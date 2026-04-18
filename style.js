// === ГЛОБАЛЬНІ ЗМІННІ ===
let workLog = [];
let activeScanner = null;
let pinCode = "3268";
let enteredPin = "";

// === PIN-код функції (виправлені) ===
function updatePinDisplay() {
    const display = document.getElementById('pinDisplay');
    if (!display) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) {
        masked += "●";
    }
    for (let i = enteredPin.length; i < 4; i++) {
        masked += "●";
    }
    display.innerText = masked;
}

function pinAddNum(num) {
    if (enteredPin.length < 4) {
        enteredPin += num.toString();
        updatePinDisplay();
        const errorDiv = document.getElementById('pinError');
        if (errorDiv) errorDiv.innerText = '';
        
        // Автоматична перевірка після введення 4 цифр
        if (enteredPin.length === 4) {
            if (enteredPin === pinCode) {
                // Правильний PIN
                const pinScreen = document.getElementById('pinScreen');
                const mainApp = document.getElementById('mainApp');
                if (pinScreen) pinScreen.style.display = 'none';
                if (mainApp) mainApp.classList.remove('hidden');
                loadData();
            } else {
                const errorDiv = document.getElementById('pinError');
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
        const pinScreen = document.getElementById('pinScreen');
        const mainApp = document.getElementById('mainApp');
        if (pinScreen) pinScreen.style.display = 'none';
        if (mainApp) mainApp.classList.remove('hidden');
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
        setTimeout(() => {
            errorDiv.innerText = '';
        }, 2000);
    }
}

// === Основна логіка ===
function loadData() {
    const stored = localStorage.getItem('pls_work_log');
    if (stored) {
        try {
            workLog = JSON.parse(stored);
        } catch(e) { 
            workLog = []; 
        }
    }
    if (workLog.length === 0) {
        // Демо-дані
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

function generateId() { 
    return Date.now() + Math.random() * 10000; 
}

function getCurrentDate() {
    return new Date().toLocaleString('uk-UA', {
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
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
        alert('❌ Введіть 8 цифр лічильника (наприклад: 21113352)');
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
    if (!workLog.length) { 
        alert('Немає даних для експорту'); 
        return; 
    }
    const headers = ['Дата', 'Особовий рахунок', 'Лічильник', 'Пломба (кришка)', 'Пломба (оптопорт)', 'Адреса'];
    const rows = workLog.map(r => [
        `"${r.date}"`,
        `"${r.account}"`, 
        `"${r.meter}"`,
        `"${r.sealCover}"`, 
        `"${r.sealOpto}"`, 
        `"${r.address}"`
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
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// === Функція для фото з камери (OCR) ===
async function openCamera(inputId, expectedDigits) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const container = document.createElement('div');
    
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'black';
    container.style.zIndex = '2000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    
    video.style.width = '100%';
    video.style.maxHeight = '70%';
    video.style.objectFit = 'cover';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '20px';
    buttonContainer.style.marginTop = '20px';
    
    const captureBtn = document.createElement('button');
    captureBtn.innerText = '📸 Зробити фото';
    captureBtn.style.padding = '15px 30px';
    captureBtn.style.fontSize = '18px';
    captureBtn.style.borderRadius = '40px';
    captureBtn.style.border = 'none';
    captureBtn.style.backgroundColor = '#22c55e';
    captureBtn.style.color = 'white';
    captureBtn.style.fontWeight = 'bold';
    captureBtn.style.cursor = 'pointer';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '❌ Закрити';
    closeBtn.style.padding = '15px 30px';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.borderRadius = '40px';
    closeBtn.style.border = 'none';
    closeBtn.style.backgroundColor = '#ef4444';
    closeBtn.style.color = 'white';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.cursor = 'pointer';
    
    buttonContainer.appendChild(captureBtn);
    buttonContainer.appendChild(closeBtn);
    container.appendChild(video);
    container.appendChild(buttonContainer);
    document.body.appendChild(container);
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        await video.play();
        
        captureBtn.onclick = async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            stream.getTracks().forEach(track => track.stop());
            container.remove();
            
            let resultDivId = 'accountResult';
            if (inputId === 'meterNumber') resultDivId = 'meterResult';
            else if (inputId === 'sealCoverNumber') resultDivId = 'sealCoverResult';
            else if (inputId === 'sealOptoNumber') resultDivId = 'sealOptoResult';
            else if (inputId === 'address') resultDivId = 'addressResult';
            
            const resultDiv = document.getElementById(resultDivId);
            
            try {
                const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'ukr+eng', {
                    logger: m => console.log(m)
                });
                
                let recognizedText = text.trim();
                let finalResult = recognizedText;
                
                if (expectedDigits > 0) {
                    const digitsOnly = recognizedText.replace(/\D/g, '');
                    if (digitsOnly.length >= expectedDigits) {
                        finalResult = digitsOnly.substring(0, expectedDigits);
                    } else {
                        finalResult = digitsOnly;
                    }
                }
                
                document.getElementById(inputId).value = finalResult;
                if (resultDiv) {
                    resultDiv.innerHTML = `✅ Розпізнано: ${finalResult}`;
                    resultDiv.classList.remove('hidden');
                    setTimeout(() => resultDiv.classList.add('hidden'), 3000);
                }
            } catch(err) {
                console.error('OCR помилка:', err);
                alert('❌ Не вдалося розпізнати текст. Спробуйте ще раз.');
                if (resultDiv) {
                    resultDiv.innerHTML = '❌ Помилка розпізнавання';
                    resultDiv.classList.remove('hidden');
                    setTimeout(() => resultDiv.classList.add('hidden'), 2000);
                }
            }
        };
        
        closeBtn.onclick = () => {
            stream.getTracks().forEach(track => track.stop());
            container.remove();
        };
        
    } catch(err) {
        console.error(err);
        alert('❌ Не вдалося відкрити камеру');
        container.remove();
    }
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
    console.log('Додаток завантажено');
    
    // PIN-код події
    const pinButtons = document.querySelectorAll('.pin-btn');
    console.log('Знайдено кнопок PIN:', pinButtons.length);
    
    pinButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const num = this.getAttribute('data-num');
            console.log('Натиснуто кнопку:', num);
            if (num === 'clear') {
                pinClear();
            } else if (num === 'enter') {
                pinCheck();
            } else {
                pinAddNum(num);
            }
        });
    });
    
    const pinForgot = document.getElementById('pinForgot');
    if (pinForgot) {
        pinForgot.addEventListener('click', pinReset);
    }
    
    // Головні кнопки
    const saveBtn = document.getElementById('saveRecordBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveRecord);
    
    const exportBtn = document.getElementById('exportLogBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportToCSV);
    
    const clearBtn = document.getElementById('clearLogBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearAllLog);
    
    // Кнопки камери (фото)
    const cameraBtns = document.querySelectorAll('.btn-camera');
    console.log('Знайдено кнопок камери:', cameraBtns.length);
    
    cameraBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const digits = parseInt(this.getAttribute('data-digits')) || 0;
            console.log('Відкриття камери для:', target);
            openCamera(target, digits);
        });
    });
    
    // Кнопки QR сканера
    const qrBtns = document.querySelectorAll('.btn-scan-qr');
    console.log('Знайдено кнопок QR:', qrBtns.length);
    
    qrBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            const digits = parseInt(this.getAttribute('data-digits')) || 0;
            console.log('Запуск QR сканера для:', target);
            
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
    const accountInput = document.getElementById('accountNumber');
    if (accountInput) {
        accountInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 10);
        });
    }
    
    const meterInput = document.getElementById('meterNumber');
    if (meterInput) {
        meterInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '').slice(0, 8);
        });
    }
});

window.addEventListener('beforeunload', async () => {
    if (activeScanner) {
        try { await activeScanner.stop(); } catch(e) {}
    }
});