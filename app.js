// ========== ГЛОБАЛЬНІ ЗМІННІ ==========
let workLog = [];
let activeScanners = {};
let pinCode = null;
let enteredPin = "";

// DOM елементи
const pinDisplay = document.getElementById('pinDisplay');
const pinError = document.getElementById('pinError');
const pinScreen = document.getElementById('pinScreen');
const mainApp = document.getElementById('mainApp');
const accountInput = document.getElementById('accountNumber');
const meterInput = document.getElementById('meterNumber');
const sealCoverInput = document.getElementById('sealCoverNumber');
const sealOptoInput = document.getElementById('sealOptoNumber');
const addressInput = document.getElementById('address');
const saveBtn = document.getElementById('saveRecordBtn');
const exportBtn = document.getElementById('exportLogBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const logBody = document.getElementById('logBody');

// ========== ІНІЦІАЛІЗАЦІЯ PIN (БЕЗ ХАРДКОДУ) ==========
function initPin() {
    let storedPin = localStorage.getItem('pls_pin');
    if (!storedPin) {
        // При першому запуску - генеруємо випадковий PIN з 4 цифр
        const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
        localStorage.setItem('pls_pin', randomPin);
        pinCode = randomPin;
        // Показуємо користувачу його PIN
        setTimeout(() => {
            alert(`🔐 Ваш PIN-код: ${randomPin}\nЗбережіть його!`);
        }, 100);
    } else {
        pinCode = storedPin;
    }
}

// ========== PIN ФУНКЦІЇ ==========
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
                pinScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                loadData();
            } else {
                pinError.innerText = '❌ Невірний PIN';
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
        pinScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        loadData();
    } else {
        if (pinError) pinError.innerText = '❌ Невірний PIN';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('pls_pin', newPin);
    pinCode = newPin;
    enteredPin = "";
    updatePinDisplay();
    if (pinError) {
        pinError.innerText = `✅ PIN скинуто! Новий PIN: ${newPin}`;
        setTimeout(() => {
            if (pinError) pinError.innerText = '';
        }, 3000);
    }
}

// ========== РОБОТА З ДАНИМИ ==========
function loadData() {
    const stored = localStorage.getItem('pls_log');
    if (stored) {
        try {
            workLog = JSON.parse(stored);
        } catch (e) {
            workLog = [];
        }
    }
    
    if (!workLog.length) {
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

function renderLog() {
    if (!logBody) return;
    
    if (!workLog.length) {
        logBody.innerHTML = '<tr class="empty-row"><td colspan="7">Немає записів. Додайте нову роботу</td></tr>';
        return;
    }
    
    let html = '';
    workLog.forEach((r, idx) => {
        html += `
            <tr>
                <td>${escapeHtml(r.date)}</td>
                <td><strong>${escapeHtml(r.account)}</strong></td>
                <td>${escapeHtml(r.meter)}</td>
                <td><span class="badge">🔒 ${escapeHtml(r.seal1)}</span></td>
                <td><span class="badge">🔒 ${escapeHtml(r.seal2)}</span></td>
                <td>${escapeHtml(r.address)}</td>
                <td><span class="delete-icon" data-index="${idx}">🗑️</span></td>
            </tr>
        `;
    });
    logBody.innerHTML = html;
    
    document.querySelectorAll('.delete-icon').forEach(el => {
        el.addEventListener('click', (e) => {
            const index = parseInt(el.getAttribute('data-index'));
            if (confirm('Видалити запис?')) {
                workLog.splice(index, 1);
                saveData();
            }
        });
    });
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

// ========== РОЗУМНЕ РОЗПІЗНАВАННЯ ЛІЧИЛЬНИКА ==========
function smartMeterExtract(rawText) {
    // Видаляємо всі нецифрові символи
    const digitsOnly = rawText.replace(/\D/g, '');
    
    // Якщо є хоча б 8 цифр - беремо останні 8?
    // За вимогою: ігноруємо перші 4 та останні 4 -> беремо середні 8 цифр
    if (digitsOnly.length >= 16) {
        // Якщо 16+ цифр - беремо з 5 по 12 позицію (ігноруємо перші 4 і останні 4)
        return digitsOnly.substring(4, 12);
    } else if (digitsOnly.length >= 12) {
        // Якщо 12-15 цифр - беремо з 5 по останні-4
        return digitsOnly.substring(4, digitsOnly.length - 4);
    } else if (digitsOnly.length === 8) {
        return digitsOnly;
    } else {
        // Якщо менше 8 цифр - повертаємо як є
        return digitsOnly;
    }
}

// ========== УПРАВЛІННЯ СКАНЕРОМ ==========
async function stopScanner(containerId) {
    if (activeScanners[containerId]) {
        try {
            await activeScanners[containerId].stop();
        } catch (e) {}
        delete activeScanners[containerId];
    }
}

async function startQrScanner(containerId, inputId, mode) {
    if (activeScanners[containerId]) {
        await stopScanner(containerId);
        const container = document.getElementById(containerId);
        if (container) container.classList.add('hidden');
        return;
    }
    
    for (let scId in activeScanners) {
        await stopScanner(scId);
        const otherContainer = document.getElementById(scId);
        if (otherContainer) otherContainer.classList.add('hidden');
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="scanner-header">
            <span>📷 Наведіть камеру на QR-код</span>
            <button class="btn-close-scanner">✕</button>
        </div>
        <div id="${containerId}_reader" style="width:100%"></div>
    `;
    
    container.querySelector('.btn-close-scanner').addEventListener('click', async () => {
        await stopScanner(containerId);
        container.classList.add('hidden');
    });
    
    const readerElementId = `${containerId}_reader`;
    const html5QrCode = new Html5Qrcode(readerElementId);
    activeScanners[containerId] = html5QrCode;
    
    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 280, height: 280 } },
            (decodedText) => {
                let result = decodedText.trim();
                
                if (mode === 'smart') {
                    // Розумне розпізнавання для лічильника
                    result = smartMeterExtract(result);
                } else if (mode === 'digits10') {
                    const digitsOnly = result.replace(/\D/g, '');
                    result = digitsOnly.length >= 10 ? digitsOnly.substring(0, 10) : digitsOnly;
                } else if (mode === 'digits0') {
                    // Без фільтрації
                }
                
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    inputElement.value = result;
                    const event = new Event('input', { bubbles: true });
                    inputElement.dispatchEvent(event);
                }
                
                stopScanner(containerId).then(() => {
                    container.classList.add('hidden');
                });
                
                showToast(`✅ Відскановано: ${result.substring(0, 30)}${result.length > 30 ? '...' : ''}`);
            },
            (errorMessage) => {}
        );
    } catch (err) {
        console.error('Помилка камери:', err);
        alert('❌ Не вдалося запустити камеру. Перевірте дозволи.');
        container.classList.add('hidden');
        delete activeScanners[containerId];
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#238636';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '40px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '2000';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// ========== ЗБЕРЕЖЕННЯ ЗАПИСУ ==========
function saveRecord() {
    const account = accountInput.value.trim();
    let meter = meterInput.value.trim();
    const seal1 = sealCoverInput.value.trim();
    const seal2 = sealOptoInput.value.trim();
    const addr = addressInput.value.trim();

    if (account.length !== 10) {
        alert('❌ Особовий рахунок має містити рівно 10 цифр');
        return;
    }
    if (meter.length !== 8) {
        alert('❌ Лічильник має містити рівно 8 цифр');
        return;
    }
    if (!seal1) {
        alert('❌ Введіть пломбу кришки');
        return;
    }
    if (!seal2) {
        alert('❌ Введіть пломбу оптопорту');
        return;
    }
    if (!addr) {
        alert('❌ Введіть адресу');
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
    
    accountInput.value = "";
    meterInput.value = "";
    sealCoverInput.value = "";
    sealOptoInput.value = "";
    addressInput.value = "";
    
    alert('✅ Роботу збережено!');
}

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

function clearLog() {
    if (confirm('⚠️ ВИДАЛИТИ ВСІ ЗАПИСИ НАЗАВЖДИ?')) {
        workLog = [];
        saveData();
        alert('✅ Журнал очищено');
    }
}

// ========== ВАЛІДАЦІЯ ПОЛІВ ==========
function setupInputValidation() {
    if (accountInput) {
        accountInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    if (meterInput) {
        meterInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 8);
        });
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener("DOMContentLoaded", function() {
    initPin();
    updatePinDisplay();
    setupInputValidation();
    
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
    
    if (saveBtn) saveBtn.onclick = saveRecord;
    if (exportBtn) exportBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    
    document.querySelectorAll(".btn-camera-icon").forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = this.getAttribute('data-target');
            const mode = this.getAttribute('data-digits');
            
            let scannerId;
            let scanMode;
            
            switch (target) {
                case 'accountNumber': scannerId = 'accountScanner'; scanMode = 'digits10'; break;
                case 'meterNumber': scannerId = 'meterScanner'; scanMode = 'smart'; break;
                case 'sealCoverNumber': scannerId = 'sealCoverScanner'; scanMode = 'digits0'; break;
                case 'sealOptoNumber': scannerId = 'sealOptoScanner'; scanMode = 'digits0'; break;
                case 'address': scannerId = 'addressScanner'; scanMode = 'digits0'; break;
                default: return;
            }
            
            startQrScanner(scannerId, target, scanMode);
        });
    });
});

window.addEventListener('beforeunload', function() {
    for (let scId in activeScanners) {
        activeScanners[scId].stop().catch(function() {});
    }
});