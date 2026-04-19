/* === ГЛОБАЛЬНО === */
let workLog = [];
let activeScanner = null;
let pinCode = "3268";
let enteredPin = "";

// Отримуємо збережений PIN
if (localStorage.getItem('pls_pin')) {
    pinCode = localStorage.getItem('pls_pin');
}

/* === DOM ЕЛЕМЕНТИ === */
const pinDisplay = document.getElementById('pinDisplay');
const pinError = document.getElementById('pinError');
const pinScreen = document.getElementById('pinScreen');
const mainApp = document.getElementById('mainApp');
const accountNumber = document.getElementById('accountNumber');
const meterNumber = document.getElementById('meterNumber');
const sealCoverNumber = document.getElementById('sealCoverNumber');
const sealOptoNumber = document.getElementById('sealOptoNumber');
const address = document.getElementById('address');
const saveRecordBtn = document.getElementById('saveRecordBtn');
const exportLogBtn = document.getElementById('exportLogBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const logBody = document.getElementById('logBody');

/* === PIN ФУНКЦІЇ === */
function updatePinDisplay() {
    if (!pinDisplay) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) masked += "●";
    for (let i = enteredPin.length; i < 4; i++) masked += "●";
    pinDisplay.innerText = masked;
}

function pinAddNum(num) {
    if (enteredPin.length < 4) {
        enteredPin += num.toString();
        updatePinDisplay();
        if (pinError) pinError.innerText = '';
        
        if (enteredPin.length === 4) {
            if (enteredPin === pinCode) {
                if (pinScreen) pinScreen.style.display = 'none';
                if (mainApp) mainApp.classList.remove('hidden');
                loadData();
            } else {
                if (pinError) pinError.innerText = '❌ Невірний PIN';
                enteredPin = "";
                updatePinDisplay();
            }
        }
    }
}

function pinClear() {
    enteredPin = "";
    updatePinDisplay();
    if (pinError) pinError.innerText = '';
}

function pinCheck() {
    if (enteredPin.length !== 4) {
        if (pinError) pinError.innerText = '❌ Введіть 4 цифри';
        return;
    }
    if (enteredPin === pinCode) {
        if (pinScreen) pinScreen.style.display = 'none';
        if (mainApp) mainApp.classList.remove('hidden');
        loadData();
    } else {
        if (pinError) pinError.innerText = '❌ Невірний PIN';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() {
    pinCode = "3268";
    localStorage.setItem('pls_pin', pinCode);
    enteredPin = "";
    updatePinDisplay();
    if (pinError) {
        pinError.innerText = '✅ PIN скинуто';
        setTimeout(() => { if (pinError) pinError.innerText = ''; }, 2000);
    }
}

/* === DATA === */
function loadData() {
    const stored = localStorage.getItem('pls_log');
    if (stored) {
        try {
            workLog = JSON.parse(stored);
        } catch(e) {
            workLog = [];
        }
    }
    if (workLog.length === 0) {
        workLog = [{
            date: new Date().toLocaleString('uk-UA'),
            account: '1234567890',
            meter: '21113352',
            seal1: 'PL7890',
            seal2: 'OP5566',
            address: 'вул. Тестова, 1'
        }];
        saveData();
    }
    renderLog();
}

function saveData() {
    localStorage.setItem('pls_log', JSON.stringify(workLog));
    renderLog();
}

/* === SAVE === */
function saveRecord() {
    if (!accountNumber || !meterNumber || !sealCoverNumber || !sealOptoNumber || !address) {
        alert('❌ Помилка: не знайдено поля форми');
        return;
    }
    
    const account = accountNumber.value.trim();
    const meter = meterNumber.value.trim();
    const seal1 = sealCoverNumber.value.trim();
    const seal2 = sealOptoNumber.value.trim();
    const addr = address.value.trim();
    
    if (account.length !== 10) {
        alert('❌ Введіть 10 цифр особового рахунку');
        return;
    }
    if (meter.length !== 8) {
        alert('❌ Введіть 8 цифр лічильника');
        return;
    }
    if (!seal1) {
        alert('❌ Введіть пломбу клемної кришки');
        return;
    }
    if (!seal2) {
        alert('❌ Введіть пломбу оптопорту');
        return;
    }
    if (!addr) {
        alert('❌ Введіть адресу об\'єкту');
        return;
    }
    
    workLog.unshift({
        date: new Date().toLocaleString('uk-UA'),
        account: account,
        meter: meter,
        seal1: seal1,
        seal2: seal2,
        address: addr
    });
    
    saveData();
    
    accountNumber.value = "";
    meterNumber.value = "";
    sealCoverNumber.value = "";
    sealOptoNumber.value = "";
    address.value = "";
    
    alert('✅ Роботу збережено в журнал!');
}

/* === TABLE === */
function renderLog() {
    if (!logBody) return;
    
    if (!workLog.length) {
        logBody.innerHTML = '<tr class="empty-row"><td colspan="6">Немає записів. Додайте нову роботу</td></tr>';
        return;
    }
    
    let html = '';
    workLog.forEach((r, index) => {
        html += `
            <tr>
                <td>${escapeHtml(r.date)}</td>
                <td><strong>${escapeHtml(r.account)}</strong></td>
                <td>${escapeHtml(r.meter)}</td>
                <td><span class="badge">🔒 ${escapeHtml(r.seal1)}</span></td>
                <td><span class="badge">🔒 ${escapeHtml(r.seal2)}</span></td>
                <td>${escapeHtml(r.address)}</td>
                <td><span style="cursor:pointer;color:#ef4444;" onclick="deleteRecord(${index})">🗑️</span></td>
            </tr>
        `;
    });
    logBody.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function deleteRecord(index) {
    if (confirm('Видалити цей запис?')) {
        workLog.splice(index, 1);
        saveData();
    }
}

/* === CSV === */
function exportCSV() {
    if (!workLog.length) {
        alert('Немає даних для експорту');
        return;
    }
    
    const headers = ['Дата', 'Особовий рахунок', 'Лічильник', 'Пломба (кришка)', 'Пломба (оптопорт)', 'Адреса'];
    const rows = workLog.map(r => [
        `"${r.date}"`,
        `"${r.account}"`,
        `"${r.meter}"`,
        `"${r.seal1}"`,
        `"${r.seal2}"`,
        `"${r.address}"`
    ]);
    
    const csv = headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pls_log_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
}

/* === CLEAR === */
function clearLog() {
    if (confirm('⚠️ ВИДАЛИТИ ВСІ ЗАПИСИ? Це не можна скасувати.')) {
        workLog = [];
        saveData();
        alert('✅ Журнал очищено');
    }
}

/* === QR СКАНЕР === */
async function startQrScanner(containerId, inputId, expectedDigits) {
    if (activeScanner) {
        try { await activeScanner.stop(); } catch(e) {}
        activeScanner = null;
    }
    
    document.querySelectorAll('.scanner-container').forEach(el => {
        if (el) el.classList.add('hidden');
    });
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Контейнер не знайдено:', containerId);
        return;
    }
    container.classList.remove('hidden');
    
    const html5QrCode = new Html5Qrcode(containerId);
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
                    } else {
                        result = digitsOnly;
                    }
                }
                
                const inputElement = document.getElementById(inputId);
                if (inputElement) inputElement.value = result;
                
                html5QrCode.stop().catch(e => console.log);
                activeScanner = null;
                container.classList.add('hidden');
                
                // Показати результат
                const resultId = inputId.replace('Number', 'Result');
                const resultDiv = document.getElementById(resultId);
                if (resultDiv) {
                    resultDiv.innerHTML = `✅ Відскановано: ${result}`;
                    resultDiv.classList.remove('hidden');
                    setTimeout(() => resultDiv.classList.add('hidden'), 3000);
                }
            },
            (errorMessage) => {}
        );
    } catch(err) {
        console.error('Помилка камери:', err);
        alert('❌ Не вдалося запустити камеру. Перевірте дозволи.');
        container.classList.add('hidden');
        activeScanner = null;
    }
}

/* === ІНІЦІАЛІЗАЦІЯ === */
document.addEventListener("DOMContentLoaded", function() {
    updatePinDisplay();
    
    // PIN кнопки
    document.querySelectorAll(".pin-btn").forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const num = this.getAttribute('data-num');
            
            if (num === "clear") {
                pinClear();
            } else if (num === "enter") {
                pinCheck();
            } else {
                pinAddNum(num);
            }
        });
    });
    
    const pinForgot = document.getElementById("pinForgot");
    if (pinForgot) pinForgot.onclick = pinReset;
    
    // Головні кнопки
    if (saveRecordBtn) saveRecordBtn.onclick = saveRecord;
    if (exportLogBtn) exportLogBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    
    // QR кнопки
    document.querySelectorAll(".btn-scan-qr").forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const digits = parseInt(this.getAttribute('data-digits')) || 0;
            
            let scannerId;
            switch(target) {
                case 'accountNumber': scannerId = 'accountScanner'; break;
                case 'meterNumber': scannerId = 'meterScanner'; break;
                case 'sealCoverNumber': scannerId = 'sealCoverScanner'; break;
                case 'sealOptoNumber': scannerId = 'sealOptoScanner'; break;
                case 'address': scannerId = 'addressScanner'; break;
                default: return;
            }
            
            startQrScanner(scannerId, target, digits);
        });
    });
    
    // Валідація полів
    if (accountNumber) {
        accountNumber.oninput = function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        };
    }
    
    if (meterNumber) {
        meterNumber.oninput = function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 8);
        };
    }
});

/* Зупинка камери при виході */
window.addEventListener('beforeunload', function() {
    if (activeScanner) {
        activeScanner.stop().catch(function() {});
    }
});