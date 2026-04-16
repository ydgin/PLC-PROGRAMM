// --- Модель данных ---
let meters = []; // массив объектов: { id, meterNumber, reading, sealNumber, location, date }

// Загрузка из localStorage
function loadData() {
    const stored = localStorage.getItem('electricity_meters');
    if(stored) {
        try {
            meters = JSON.parse(stored);
        } catch(e) { 
            meters = []; 
        }
    }
    if(!meters.length) {
        // демо-пример для наглядности
        meters = [
            { id: Date.now()+1, meterNumber: '123456', reading: 12450.5, sealNumber: 'PL7890', location: 'Квартира 12', date: new Date().toLocaleString() },
            { id: Date.now()+2, meterNumber: '789012', reading: 870.2, sealNumber: 'SEAL-001', location: 'Гараж', date: new Date().toLocaleString() }
        ];
    }
    renderTable();
}

function saveToLocal() {
    localStorage.setItem('electricity_meters', JSON.stringify(meters));
    renderTable();
}

function generateId() { 
    return Date.now() + Math.random() * 10000; 
}

function saveMeter(meterData, id = null) {
    if(id) {
        // редактирование
        const index = meters.findIndex(m => m.id == id);
        if(index !== -1) {
            meters[index] = { ...meters[index], ...meterData, date: new Date().toLocaleString() };
        }
    } else {
        // новое
        const newMeter = {
            id: generateId(),
            ...meterData,
            date: new Date().toLocaleString()
        };
        meters.unshift(newMeter); // новые сверху
    }
    saveToLocal();
    clearForm();
}

function deleteMeter(id) {
    if(confirm('Удалить запись?')) {
        meters = meters.filter(m => m.id != id);
        saveToLocal();
    }
}

function editMeter(id) {
    const meter = meters.find(m => m.id == id);
    if(meter) {
        document.getElementById('editId').value = meter.id;
        document.getElementById('meterNumber').value = meter.meterNumber;
        document.getElementById('reading').value = meter.reading;
        document.getElementById('sealNumber').value = meter.sealNumber;
        document.getElementById('location').value = meter.location || '';
        // проскроллим к форме
        document.getElementById('meterForm').scrollIntoView({ behavior: 'smooth' });
    }
}

function clearForm() {
    document.getElementById('editId').value = '';
    document.getElementById('meterNumber').value = '';
    document.getElementById('reading').value = '';
    document.getElementById('sealNumber').value = '';
    document.getElementById('location').value = '';
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    if(!meters.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Нет записей. Добавьте через QR или форму.</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    meters.forEach(m => {
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = `<strong>${escapeHtml(m.meterNumber)}</strong>`;
        row.insertCell(1).innerHTML = `${parseFloat(m.reading).toFixed(2)} кВт·ч`;
        row.insertCell(2).innerHTML = `<span class="badge">🔒 ${escapeHtml(m.sealNumber)}</span>`;
        row.insertCell(3).innerHTML = m.location ? escapeHtml(m.location) : '—';
        row.insertCell(4).innerHTML = m.date || '—';
        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
            <span class="action-icon" title="Редактировать" onclick="editMeter(${m.id})">✏️</span>
            <span class="action-icon" title="Удалить" onclick="deleteMeter(${m.id})">🗑️</span>
        `;
    });
}

function escapeHtml(str) {
    if(!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if(m === '&') return '&amp;';
        if(m === '<') return '&lt;';
        if(m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

// Обработка данных из QR строки
function parseQRAndFill(qrText) {
    let parts = [];
    if(qrText.includes(';')) parts = qrText.split(';');
    else if(qrText.includes(',')) parts = qrText.split(',');
    else if(qrText.includes('|')) parts = qrText.split('|');
    else {
        parts = qrText.split(/\s+/);
    }
    if(parts.length < 3) {
        alert('❌ QR-код должен содержать минимум 3 поля: номер счетчика, показание, номер пломбы.\nПример: 456123;987.5;PL555');
        return false;
    }
    let meterNumber = parts[0].trim();
    let readingRaw = parts[1].trim().replace(',','.');
    let sealNumber = parts[2].trim();
    let locationExtra = (parts.length > 3) ? parts.slice(3).join(' ').trim() : '';
    
    if(!meterNumber || !sealNumber) {
        alert('Ошибка: номер счетчика или пломбы пустые');
        return false;
    }
    let reading = parseFloat(readingRaw);
    if(isNaN(reading)) {
        alert('Показание должно быть числом. Получено: ' + readingRaw);
        return false;
    }
    
    document.getElementById('meterNumber').value = meterNumber;
    document.getElementById('reading').value = reading;
    document.getElementById('sealNumber').value = sealNumber;
    if(locationExtra) document.getElementById('location').value = locationExtra;
    else if(document.getElementById('location').value.trim() === '') document.getElementById('location').value = 'Из QR';
    
    if(confirm(`✅ Считать данные из QR?\nСчётчик: ${meterNumber}\nПоказание: ${reading}\nПломба: ${sealNumber}\nСохранить запись?`)) {
        const meterData = {
            meterNumber: meterNumber,
            reading: reading,
            sealNumber: sealNumber,
            location: document.getElementById('location').value || 'Из QR'
        };
        saveMeter(meterData, null);
        document.getElementById('scanResult').innerHTML = `✅ Успешно добавлено: ${meterNumber} | показание ${reading} | пломба ${sealNumber}`;
        setTimeout(() => {
            if(document.getElementById('scanResult')) document.getElementById('scanResult').innerHTML = 'Готов к новому сканированию';
        }, 4000);
    } else {
        document.getElementById('scanResult').innerHTML = `📋 Данные из QR загружены в форму, нажмите "Сохранить запись"`;
    }
    return true;
}

// --- QR сканер (html5-qrcode) ---
let html5QrCode = null;
let isScanning = false;

async function startScanner() {
    if(isScanning) {
        alert('Сканер уже работает');
        return;
    }
    const readerContainer = document.getElementById('reader-container');
    const startBtn = document.getElementById('startScanBtn');
    const stopBtn = document.getElementById('stopScanBtn');
    
    readerContainer.classList.remove('hidden');
    if(html5QrCode) {
        try { await html5QrCode.stop(); } catch(e) {}
        html5QrCode = null;
    }
    html5QrCode = new Html5Qrcode("reader-container");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    try {
        await html5QrCode.start({ facingMode: "environment" }, config, (decodedText, decodedResult) => {
            if(decodedText) {
                html5QrCode.stop().then(() => {
                    isScanning = false;
                    readerContainer.classList.add('hidden');
                    startBtn.classList.remove('hidden');
                    stopBtn.classList.add('hidden');
                    document.getElementById('scanResult').innerHTML = `📱 Распознано: ${decodedText.substring(0, 80)}...`;
                    parseQRAndFill(decodedText);
                }).catch(err => console.warn);
            }
        }, (errorMessage) => {});
        isScanning = true;
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
    } catch(err) {
        console.error(err);
        alert('Не удалось запустить камеру. Убедитесь в HTTPS и разрешениях.\n' + err);
        readerContainer.classList.add('hidden');
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
    }
}

async function stopScanner() {
    if(html5QrCode && isScanning) {
        try {
            await html5QrCode.stop();
        } catch(e) {}
        isScanning = false;
    }
    document.getElementById('reader-container').classList.add('hidden');
    document.getElementById('startScanBtn').classList.remove('hidden');
    document.getElementById('stopScanBtn').classList.add('hidden');
}

// Очистка всех данных
function clearAllData() {
    if(confirm('⚠️ Удалить ВСЕ записи о счетчиках и пломбах? Отменить нельзя.')) {
        meters = [];
        saveToLocal();
        clearForm();
    }
}

// Экспорт CSV
function exportToCSV() {
    if(!meters.length) {
        alert('Нет данных для экспорта');
        return;
    }
    let headers = ['ID','Номер счетчика','Показание (кВт·ч)','Номер пломбы','Локация','Дата создания'];
    let rows = meters.map(m => [
        m.id,
        `"${m.meterNumber}"`,
        m.reading,
        `"${m.sealNumber}"`,
        `"${m.location || ''}"`,
        `"${m.date}"`
    ]);
    let csvContent = headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'uchet_pomb_schetchikov.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Инициализация событий ---
document.getElementById('meterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const meterNumber = document.getElementById('meterNumber').value.trim();
    const readingVal = document.getElementById('reading').value;
    const sealNumber = document.getElementById('sealNumber').value.trim();
    const location = document.getElementById('location').value.trim();
    if(!meterNumber || !sealNumber || readingVal === '') {
        alert('Заполните обязательные поля: номер счетчика, показание, номер пломбы');
        return;
    }
    const reading = parseFloat(readingVal);
    if(isNaN(reading)) {
        alert('Показание должно быть числом');
        return;
    }
    const editId = document.getElementById('editId').value;
    const meterData = { meterNumber, reading, sealNumber, location };
    if(editId) {
        saveMeter(meterData, editId);
    } else {
        saveMeter(meterData, null);
    }
});

document.getElementById('startScanBtn').addEventListener('click', startScanner);
document.getElementById('stopScanBtn').addEventListener('click', stopScanner);
document.getElementById('clearFormBtn').addEventListener('click', clearForm);
document.getElementById('clearAllBtn').addEventListener('click', clearAllData);
document.getElementById('exportBtn').addEventListener('click', exportToCSV);

// начальная загрузка
loadData();

// при сворачивании/уходе со страницы останавливаем сканер
window.addEventListener('beforeunload', () => {
    if(html5QrCode && isScanning) {
        html5QrCode.stop().catch(e=>{});
    }
});