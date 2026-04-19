// ========== ГЛОБАЛЬНІ ЗМІННІ ==========
let workLog = [];
let activeScanners = {}; // { containerId: Html5Qrcode }
let pinCode = "3268";
let enteredPin = "";

// Завантаження PIN з localStorage
if (localStorage.getItem('pls_pin')) {
    pinCode = localStorage.getItem('pls_pin');
}

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
    pinCode = "3268";
    localStorage.setItem('pls_pin', pinCode);
    enteredPin = "";
    updatePinDisplay();
    if (pinError) {
        pinError.innerText = '✅ PIN скинуто до 3268';
        setTimeout(() => {
            if (pinError) pinError.innerText = '';
        }, 2000);
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
    
    // Додаємо обробники для видалення
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
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== ЗБЕРЕЖЕННЯ ЗАПИСУ ==========
function saveRecord() {
    const account = accountInput.value.trim();
    const meter = meterInput.value.trim();
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

    // Очищення полів після збереження
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

// ========== УПРАВЛІННЯ СКАНЕРОМ ==========
async function stopScanner(containerId) {
    if (activeScanners[containerId]) {
        try {
            await activeScanners[containerId].stop();
        } catch (e) {
            console.log('Помилка зупинки сканера:', e);
        }
        delete activeScanners[containerId];
    }
}

async function startQrScanner(containerId, inputId, expectedDigits) {
    // Закриваємо сканер в цьому контейнері, якщо він вже відкритий
    if (activeScanners[containerId]) {
        await stopScanner(containerId);
        const container = document.getElementById(containerId);
        if (container) container.classList.add('hidden');
        return;
    }
    
    // Закриваємо всі інші сканери
    for (let scId in activeScanners) {
        await stopScanner(scId);
        const otherContainer = document.getElementById(scId);
        if (otherContainer) otherContainer.classList.add('hidden');
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Контейнер не знайдено:', containerId);
        return;
    }
    
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="scanner-header">
            <span>📷 Наведіть камеру на QR-код</span>
            <button class="btn-close-scanner">✕</button>
        </div>
        <div id="${containerId}_reader" style="width:100%"></div>
    `;
    
    // Додаємо кнопку закриття
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
                
                // Фільтрація цифр, якщо потрібно
                if (expectedDigits > 0) {
                    const digitsOnly = result.replace(/\D/g, '');
                    if (digitsOnly.length >= expectedDigits) {
                        result = digitsOnly.substring(0, expectedDigits);
                    } else {
                        result = digitsOnly;
                    }
                }
                
                const inputElement = document.getElementById(inputId);
                if (inputElement) {
                    inputElement.value = result;
                    // Тригер події для валідації
                    const event = new Event('input', { bubbles: true });
                    inputElement.dispatchEvent(event);
                }
                
                // Автоматично закриваємо сканер після успішного сканування
                stopScanner(containerId).then(() => {
                    container.classList.add('hidden');
                });
                
                // Коротке сповіщення
                const toast = document.createElement('div');
                toast.textContent = `✅ Відскановано: ${result.substring(0, 20)}${result.length > 20 ? '...' : ''}`;
                toast.style.position = 'fixed';
                toast.style.bottom = '20px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.backgroundColor = '#22c55e';
                toast.style.color = 'white';
                toast.style.padding = '10px 20px';
                toast.style.borderRadius = '40px';
                toast.style.fontSize = '14px';
                toast.style.zIndex = '2000';
                toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            },
            (errorMessage) => {
                // Ігноруємо помилки сканування
            }
        );
    } catch (err) {
        console.error('Помилка запуску камери:', err);
        alert('❌ Не вдалося запустити камеру. Перевірте дозволи.');
        container.classList.add('hidden');
        delete activeScanners[containerId];
    }
}

// ========== ВАЛІДАЦІЯ ПОЛІВ ==========
function setupInputValidation() {
    if (accountInput) {
        accountInput.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    if (meterInput) {
        meterInput.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').slice(0, 8);
        });
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener("DOMContentLoaded", function () {
    updatePinDisplay();
    setupInputValidation();
    
    // PIN кнопки
    document.querySelectorAll(".pin-btn").forEach(btn => {
        btn.addEventListener('click', function (e) {
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
    if (saveBtn) saveBtn.onclick = saveRecord;
    if (exportBtn) exportBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    
    // QR кнопки (при натисканні відкриваємо/закриваємо сканер)
    document.querySelectorAll(".btn-scan-qr").forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = this.getAttribute('data-target');
            const digits = parseInt(this.getAttribute('data-digits')) || 0;
            
            let scannerId;
            switch (target) {
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
});

// Зупинка всіх сканерів при виході
window.addEventListener('beforeunload', function () {
    for (let scId in activeScanners) {
        activeScanners[scId].stop().catch(function () { });
    }
});