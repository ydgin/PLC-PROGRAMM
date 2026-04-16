// === Змінні ===
let workLog = [];
let activeStreams = {};
let animationFrames = {};

// === Завантаження даних ===
function loadData() {
    const stored = localStorage.getItem('pls_work_log');
    if (stored) {
        try {
            workLog = JSON.parse(stored);
        } catch(e) { workLog = []; }
    }
    if (workLog.length === 0) {
        workLog = [{
            id: Date.now(),
            date: new Date().toLocaleString('uk-UA'),
            account: '1234567890',
            meter: '12345678',
            sealCover: 'PL7890',
            sealOpto: 'OP5566'
        }];
        saveToLocal();
    }
    renderLog();
}

function saveToLocal() {
    localStorage.setItem('pls_work_log', JSON.stringify(workLog));
    renderLog();
}

function generateId() { return Date.now() + Math.random() * 10000; }

function getCurrentDate() {
    return new Date().toLocaleString('uk-UA', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function saveRecord() {
    const account = document.getElementById('accountNumber').value.trim();
    const meter = document.getElementById('meterNumber').value.trim();
    const sealCover = document.getElementById('sealCoverNumber').value.trim();
    const sealOpto = document.getElementById('sealOptoNumber').value.trim();
    
    if (!account || account.length !== 10 || !/^\d+$/.test(account)) {
        alert('❌ Введіть 10 цифр особового рахунку');
        return;
    }
    if (!meter || meter.length !== 8 || !/^\d+$/.test(meter)) {
        alert('❌ Введіть 8 цифр лічильника');
        return;
    }
    if (!sealCover) {
        alert('❌ Введіть пломбу клемної кришки');
        return;
    }
    if (!sealOpto) {
        alert('❌ Введіть пломбу оптопорту');
        return;
    }
    
    workLog.unshift({
        id: generateId(),
        date: getCurrentDate(),
        account, meter, sealCover, sealOpto
    });
    saveToLocal();
    
    document.getElementById('accountNumber').value = '';
    document.getElementById('meterNumber').value = '';
    document.getElementById('sealCoverNumber').value = '';
    document.getElementById('sealOptoNumber').value = '';
    alert('✅ Збережено!');
}

function deleteRecord(id) {
    if (confirm('Видалити?')) {
        workLog = workLog.filter(r => r.id != id);
        saveToLocal();
    }
}

function clearAllLog() {
    if (confirm('Видалити всі записи?')) {
        workLog = [];
        saveToLocal();
    }
}

function exportToCSV() {
    if (!workLog.length) { alert('Немає даних'); return; }
    const headers = ['Дата','Особовий рахунок','Лічильник','Пломба (кришка)','Пломба (оптопорт)'];
    const rows = workLog.map(r => [`"${r.date}"`,`"${r.account}"`,`"${r.meter}"`,`"${r.sealCover}"`,`"${r.sealOpto}"`]);
    const csv = headers.join(',') + '\n' + rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], {type: 'text/csv'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pls_${new Date().toISOString().slice(0,19)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function renderLog() {
    const tbody = document.getElementById('logBody');
    if (!workLog.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Немає записів</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    workLog.forEach(r => {
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = r.date;
        row.insertCell(1).innerHTML = `<strong>${escapeHtml(r.account)}</strong>`;
        row.insertCell(2).innerHTML = escapeHtml(r.meter);
        row.insertCell(3).innerHTML = `<span class="badge">🔒 ${escapeHtml(r.sealCover)}</span>`;
        row.insertCell(4).innerHTML = `<span class="badge">🔒 ${escapeHtml(r.sealOpto)}</span>`;
        row.insertCell(5).innerHTML = `<span class="action-icon" onclick="deleteRecord(${r.id})">🗑️</span>`;
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

// === QR СКАНЕР (працює!) ===
async function startScanner(targetId, fieldId, resultId, expectedDigits) {
    const container = document.getElementById(`${targetId}Scanner`);
    const video = document.getElementById(`${targetId}Video`);
    const canvas = document.getElementById(`${targetId}Canvas`);
    
    // Зупиняємо всі активні сканери
    for (let key in activeStreams) {
        if (activeStreams[key]) {
            if (animationFrames[key]) cancelAnimationFrame(animationFrames[key]);
            activeStreams[key].getTracks().forEach(track => track.stop());
            delete activeStreams[key];
        }
    }
    document.querySelectorAll('.scanner-container').forEach(c => c.classList.add('hidden'));
    
    container.classList.remove('hidden');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        activeStreams[targetId] = stream;
        video.srcObject = stream;
        await video.play();
        
        // Налаштовуємо canvas
        const ctx = canvas.getContext('2d');
        
        const scanInterval = setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Використовуємо jsQR для розпізнавання
                const code = jsQR(imageData.data, canvas.width, canvas.height, {
                    inversionAttempts: "dontInvert",
                });
                
                if (code) {
                    clearInterval(scanInterval);
                    let result = code.data.trim();
                    
                    if (expectedDigits > 0) {
                        const digitsOnly = result.replace(/\D/g, '');
                        if (digitsOnly.length >= expectedDigits) {
                            result = digitsOnly.substring(0, expectedDigits);
                        }
                    }
                    
                    document.getElementById(fieldId).value = result;
                    const resultDiv = document.getElementById(resultId);
                    resultDiv.innerHTML = `✅ Відскановано: ${result}`;
                    resultDiv.classList.remove('hidden');
                    setTimeout(() => resultDiv.classList.add('hidden'), 3000);
                    
                    // Зупиняємо сканер
                    stream.getTracks().forEach(track => track.stop());
                    delete activeStreams[targetId];
                    container.classList.add('hidden');
                }
            }
        }, 500);
        
        activeStreams[`${targetId}_interval`] = scanInterval;
        
    } catch(err) {
        console.error(err);
        alert('❌ Не вдалося отримати доступ до камери.\nПеревірте дозволи в браузері.');
        container.classList.add('hidden');
    }
}

// === Ініціалізація ===
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    document.getElementById('saveRecordBtn').addEventListener('click', saveRecord);
    document.getElementById('exportLogBtn').addEventListener('click', exportToCSV);
    document.getElementById('clearLogBtn').addEventListener('click', clearAllLog);
    
    // Кнопки сканування
    const scans = [
        { target: 'account', field: 'accountNumber', result: 'accountResult', digits: 10 },
        { target: 'meter', field: 'meterNumber', result: 'meterResult', digits: 8 },
        { target: 'sealCover', field: 'sealCoverNumber', result: 'sealCoverResult', digits: 0 },
        { target: 'sealOpto', field: 'sealOptoNumber', result: 'sealOptoResult', digits: 0 }
    ];
    
    scans.forEach(s => {
        const btn = document.querySelector(`.btn-scan[data-target="${s.target}"]`);
        if (btn) {
            btn.addEventListener('click', () => startScanner(s.target, s.field, s.result, s.digits));
        }
    });
    
    // Кнопки очищення
    document.querySelectorAll('.btn-clear-input').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target) document.getElementById(target).value = '';
        });
    });
    
    // Валідація
    document.getElementById('accountNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
    document.getElementById('meterNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });
});