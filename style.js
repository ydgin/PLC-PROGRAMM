// === ГЛОБАЛЬНІ ЗМІННІ ===
let workLog = [];
let activeScanner = null;
let pinCode = "3268";
let enteredPin = "";

// === PIN-код функції ===
function updatePinDisplay() {
    const display = document.getElementById('pinDisplay');
    if (!display) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) masked += "●";
    for (let i = enteredPin.length; i < 4; i++) masked += "●";
    display.innerText = masked;
}

function pinAddNum(num) {
    if (enteredPin.length < 4) {
        enteredPin += num.toString();
        updatePinDisplay();
        const errorDiv = document.getElementById('pinError');
        if (errorDiv) errorDiv.innerText = '';
        
        if (enteredPin.length === 4) {
            if (enteredPin === pinCode) {
                document.getElementById('pinScreen').style.display = 'none';
                document.getElementById('mainApp').classList.remove('hidden');
                loadData();
            } else {
                if (errorDiv) errorDiv.innerText = '❌ Невірний PIN-код';
                enteredPin = "";
                updatePinDisplay();
            }
        }
    }
}

function pinClear() {
    enteredPin = "";
    updatePinDisplay();
    const errorDiv = document.getElementById('pinError');
    if (errorDiv) errorDiv.innerText = '';
}

function pinCheck() {
    if (enteredPin.length !== 4) {
        const errorDiv = document.getElementById('pinError');
        if (errorDiv) errorDiv.innerText = '❌ Введіть 4 цифри';
        return;
    }
    if (enteredPin === pinCode) {
        document.getElementById('pinScreen').style.display = 'none';
        document.getElementById('mainApp').classList.remove('hidden');
        loadData();
    } else {
        const errorDiv = document.getElementById('pinError');
        if (errorDiv) errorDiv.innerText = '❌ Невірний PIN-код';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() {
    pinCode = "3268";
    enteredPin = "";
    updatePinDisplay();
    const errorDiv = document.getElementById('pinError');
    if (errorDiv) {
        errorDiv.innerText = '✅ PIN скинуто на 3268';
        setTimeout(() => { errorDiv.innerText = ''; }, 2000);
    }
}

// === Основна логіка ===
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
            meter: '21113352',
            sealCover: 'PL7890',
            sealOpto: 'OP5566',
            address: 'вул. Тестова, 1'
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
    const address = document.getElementById('address').value.trim();
    
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
    if (!address) {
        alert('❌ Введіть адресу об\'єкту');
        return;
    }
    
    const newRecord = {
        id: generateId(),
        date: getCurrentDate(),
        account: account,
        meter: meter,
        sealCover: sealCover,
        sealOpto: sealOpto,
        address: address
    };
    
    workLog.unshift(newRecord);
    saveToLocal();
    
    document.getElementById('accountNumber').value = '';
    document.getElementById('meterNumber').value = '';
    document.getElementById('sealCoverNumber').value = '';
    document.getElementById('sealOptoNumber').value = '';
    document.getElementById('address').value = '';
    
    alert('✅ Роботу збережено в журнал!');
}

function deleteRecord(id) {
    if (confirm('Видалити цей запис?')) {
        workLog = workLog.filter(r => r.id != id);
        saveToLocal();
    }
}

function clearAllLog() {
    if (confirm('⚠️ ВИДАЛИТИ ВСІ ЗАПИСИ?')) {
        workLog = [];
        saveToLocal();
    }
}

function exportToCSV() {
    if (!workLog.length) { alert('Немає даних'); return; }
    const headers = ['Дата', 'Особовий рахунок', 'Лічильник', 'Пломба (кришка)', 'Пломба (оптопорт)', 'Адреса'];
    const rows = workLog.map(r => [
        `"${r.date}"`, `"${r.account}"`, `"${r.meter}"`,
        `"${r.sealCover}"`, `"${r.sealOpto}"`, `"${r.address}"`
    ]);
    const csv = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pls_${new Date().toISOString().slice(0, 19)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

function renderLog() {
    const tbody = document.getElementById('logBody');
    if (!tbody) return;
    if (!workLog.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Немає записів. Додайте нову роботу</td></tr>';
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
        row.insertCell(5).innerHTML = escapeHtml(r.address);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

// === QR СКАНЕР ===
async function startQrScanner(scannerId, inputId, resultId, expectedDigits) {
    if (activeScanner) {
        try { await activeScanner.stop(); } catch(e) {}
        activeScanner = null;
    }
    
    document.querySelectorAll('.scanner-container').forEach(c => c.classList.add('hidden'));
    
    const container = document.getElementById(scannerId);
    if (!container) return;
    container.classList.remove('hidden');
    
    const html5QrCode = new Html5Qrcode(scannerId);
    activeScanner = html5QrCode;
    
    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 300, height: 300 } },
            (decodedText) => {
                let result = decodedText.trim();
                
                if (expectedDigits > 0) {
                    const digitsOnly = result.replace(/\D/g, '');
                    if (digitsOnly.length >= expectedDigits) {
                        result = digitsOnly.substring(0, expectedDigits);
                    }
                }
                
                document.getElementById(inputId).value = result;
                const resultDiv = document.getElementById(resultId);
                if (resultDiv) {
                    resultDiv.innerHTML = `✅ Відскановано: ${result}`;
                    resultDiv.classList.remove('hidden');
                    setTimeout(() => resultDiv.classList.add('hidden'), 3000);
                }
                
                html5QrCode.stop().catch(e => console.log);
                activeScanner = null;
                container.classList.add('hidden');
            },
            (errorMessage) => {}
        );
    } catch(err) {
        console.error(err);
        alert('❌ Не вдалося запустити камеру. Перевірте дозволи.');
        container.classList.add('hidden');
        activeScanner = null;
    }
}

// === Ініціалізація ===
document.addEventListener('DOMContentLoaded', function() {
    // PIN-код події
    document.querySelectorAll('.pin-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const num = this.getAttribute('data-num');
            if (num === 'clear') pinClear();
            else if (num === 'enter') pinCheck();
            else pinAddNum(num);
        });
    });
    
    document.getElementById('pinForgot').addEventListener('click', pinReset);
    
    // Головні кнопки
    document.getElementById('saveRecordBtn').addEventListener('click', saveRecord);
    document.getElementById('exportLogBtn').addEventListener('click', exportToCSV);
    document.getElementById('clearLogBtn').addEventListener('click', clearAllLog);
    
    // Кнопки QR сканера
    document.querySelectorAll('.btn-scan-qr').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const digits = parseInt(this.getAttribute('data-digits')) || 0;
            
            let scannerId, resultId;
            switch(target) {
                case 'accountNumber':
                    scannerId = 'accountScanner';
                    resultId = 'accountResult';
                    break;
                case 'meterNumber':
                    scannerId = 'meterScanner';
                    resultId = 'meterResult';
                    break;
                case 'sealCoverNumber':
                    scannerId = 'sealCoverScanner';
                    resultId = 'sealCoverResult';
                    break;
                case 'sealOptoNumber':
                    scannerId = 'sealOptoScanner';
                    resultId = 'sealOptoResult';
                    break;
                case 'address':
                    scannerId = 'addressScanner';
                    resultId = 'addressResult';
                    break;
                default: return;
            }
            startQrScanner(scannerId, target, resultId, digits);
        });
    });
    
    // Валідація полів
    document.getElementById('accountNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });
    document.getElementById('meterNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });
});

window.addEventListener('beforeunload', async () => {
    if (activeScanner) {
        try { await activeScanner.stop(); } catch(e) {}
    }
});