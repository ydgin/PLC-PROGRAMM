// ========== ФІКСОВАНИЙ PIN-КОД 3268 ==========
const FIXED_PIN = "3268";
let enteredPin = "";
let workLog = [];
let sealsDB = [];
let activeScanners = {};

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
const sealList = document.getElementById('sealList');
const sealSearchFilter = document.getElementById('sealSearchFilter');
const addSealBtn = document.getElementById('addSealBtn');
const sealAddForm = document.getElementById('sealAddForm');
const newSealNumber = document.getElementById('newSealNumber');
const confirmAddSealBtn = document.getElementById('confirmAddSealBtn');
const cancelAddSealBtn = document.getElementById('cancelAddSealBtn');

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
        
        // Автоматична перевірка після введення 4 цифр
        if (enteredPin.length === 4) {
            if (enteredPin === FIXED_PIN) {
                // Правильний PIN
                pinScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                loadData();
                loadSealsDB();
            } else {
                pinError.innerText = '❌ Невірний PIN. Спробуйте ще раз. PIN: 3268';
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
        pinError.innerText = '❌ Введіть 4 цифри';
        return;
    }
    if (enteredPin === FIXED_PIN) {
        pinScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        loadData();
        loadSealsDB();
    } else {
        pinError.innerText = '❌ Невірний PIN. PIN: 3268';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() {
    // Скидаємо введений PIN, але сам PIN залишається 3268
    enteredPin = "";
    updatePinDisplay();
    pinError.innerText = '✅ PIN залишається 3268. Введіть його для входу.';
    setTimeout(() => {
        if (pinError) pinError.innerText = '';
    }, 3000);
}

// ========== РОБОТА З БАЗОЮ ПЛОМБ ==========
function loadSealsDB() {
    const stored = localStorage.getItem('pls_seals');
    if (stored) {
        try { sealsDB = JSON.parse(stored); } catch(e) { sealsDB = []; }
    }
    if (!sealsDB.length) {
        sealsDB = ['PL7890', 'OP5566', 'SEAL123', 'TEST456'];
        saveSealsDB();
    }
    renderSealsList();
}

function saveSealsDB() {
    localStorage.setItem('pls_seals', JSON.stringify(sealsDB));
    renderSealsList();
}

function renderSealsList(filterText = '') {
    if (!sealList) return;
    let filtered = [...sealsDB];
    if (filterText) {
        filtered = sealsDB.filter(seal => seal.toLowerCase().includes(filterText.toLowerCase()));
    }
    if (filtered.length === 0) {
        sealList.innerHTML = '<div class="empty-seals">Немає пломб за таким запитом</div>';
        return;
    }
    let html = '';
    filtered.forEach((seal, idx) => {
        html += `<div class="seal-item">
                    <span class="seal-number" data-seal="${escapeHtml(seal)}">🔒 ${escapeHtml(seal)}</span>
                    <button class="delete-seal" data-seal="${escapeHtml(seal)}">🗑️</button>
                </div>`;
    });
    sealList.innerHTML = html;
    
    document.querySelectorAll('.seal-number').forEach(el => {
        el.addEventListener('click', () => {
            const seal = el.getAttribute('data-seal');
            // Заповнюємо активне поле пломби
            const activeInput = document.activeElement;
            if (activeInput && activeInput.classList && activeInput.classList.contains('seal-input')) {
                activeInput.value = seal;
                hideSearchResults(activeInput.id);
            }
        });
    });
    
    document.querySelectorAll('.delete-seal').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const seal = el.getAttribute('data-seal');
            if (confirm(`Видалити пломбу "${seal}"?`)) {
                sealsDB = sealsDB.filter(s => s !== seal);
                saveSealsDB();
                renderSealsList(sealSearchFilter?.value || '');
            }
        });
    });
}

function addNewSeal() {
    const newSeal = newSealNumber.value.trim();
    if (!newSeal) { alert('Введіть номер пломби'); return; }
    if (sealsDB.includes(newSeal)) { alert('Така пломба вже існує'); return; }
    sealsDB.push(newSeal);
    saveSealsDB();
    newSealNumber.value = '';
    sealAddForm.classList.add('hidden');
    if (sealSearchFilter) sealSearchFilter.value = '';
    renderSealsList();
}

// ========== ПОШУК ПЛОМБ У ПОЛЯХ ==========
function showSearchResults(inputId, query) {
    const resultsContainer = document.getElementById(`${inputId}SearchResults`);
    if (!resultsContainer) return;
    if (!query || query.length < 1) {
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
    }
    const filtered = sealsDB.filter(seal => seal.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length === 0) {
        resultsContainer.classList.add('hidden');
        return;
    }
    resultsContainer.classList.remove('hidden');
    let html = '';
    filtered.forEach(seal => {
        html += `<div class="search-result-item" data-seal="${escapeHtml(seal)}">🔒 ${escapeHtml(seal)}</div>`;
    });
    resultsContainer.innerHTML = html;
    
    resultsContainer.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
            const seal = el.getAttribute('data-seal');
            document.getElementById(inputId).value = seal;
            resultsContainer.classList.add('hidden');
        });
    });
}

function hideSearchResults(inputId) {
    const resultsContainer = document.getElementById(`${inputId}SearchResults`);
    if (resultsContainer) resultsContainer.classList.add('hidden');
}

// ========== РОБОТА З ДАНИМИ ==========
function loadData() {
    const stored = localStorage.getItem('pls_log');
    if (stored) {
        try { workLog = JSON.parse(stored); } catch(e) { workLog = []; }
    }
    if (!workLog.length) {
        workLog = [];
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
        html += `<tr>
                    <td>${escapeHtml(r.date)}</td>
                    <td><strong>${escapeHtml(r.account)}</strong></td>
                    <td>${escapeHtml(r.meter)}</td>
                    <td><span class="badge">🔒 ${escapeHtml(r.seal1)}</span></td>
                    <td><span class="badge">🔒 ${escapeHtml(r.seal2)}</span></td>
                    <td>${escapeHtml(r.address)}</td>
                    <td><span class="delete-icon" data-index="${idx}">🗑️</span></td>
                </tr>`;
    });
    logBody.innerHTML = html;
    document.querySelectorAll('.delete-icon').forEach(el => {
        el.addEventListener('click', () => {
            const index = parseInt(el.getAttribute('data-index'));
            if (confirm('Видалити запис?')) { workLog.splice(index, 1); saveData(); }
        });
    });
}

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }

function smartMeterExtract(rawText) {
    const digitsOnly = rawText.replace(/\D/g, '');
    if (digitsOnly.length >= 16) return digitsOnly.substring(4, 12);
    if (digitsOnly.length >= 12) return digitsOnly.substring(4, digitsOnly.length - 4);
    if (digitsOnly.length === 8) return digitsOnly;
    return digitsOnly;
}

function digitsExtract(rawText) {
    const digitsOnly = rawText.replace(/\D/g, '');
    return digitsOnly.length >= 10 ? digitsOnly.substring(0, 10) : digitsOnly;
}

// ========== QR СКАНЕР ==========
async function stopScanner(containerId) {
    if (activeScanners[containerId]) {
        try { await activeScanners[containerId].stop(); } catch(e) {}
        delete activeScanners[containerId];
    }
}

async function startQrScanner(containerId, inputId, mode) {
    if (activeScanners[containerId]) {
        await stopScanner(containerId);
        document.getElementById(containerId).classList.add('hidden');
        return;
    }
    for (let scId in activeScanners) {
        await stopScanner(scId);
        const oc = document.getElementById(scId);
        if (oc) oc.classList.add('hidden');
    }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="scanner-header"><span>📷 Наведіть камеру на QR-код</span><button class="btn-close-scanner">✕</button></div><div id="${containerId}_reader" style="width:100%"></div>`;
    container.querySelector('.btn-close-scanner').addEventListener('click', async () => {
        await stopScanner(containerId);
        container.classList.add('hidden');
    });
    const html5QrCode = new Html5Qrcode(`${containerId}_reader`);
    activeScanners[containerId] = html5QrCode;
    try {
        await html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 280, height: 280 } }, (decodedText) => {
            let result = decodedText.trim();
            if (mode === 'digits') result = digitsExtract(result);
            else if (mode === 'smart') result = smartMeterExtract(result);
            document.getElementById(inputId).value = result;
            stopScanner(containerId).then(() => container.classList.add('hidden'));
            showToast(`✅ Відскановано: ${result.substring(0, 30)}`);
        });
    } catch(err) { alert('❌ Не вдалося запустити камеру'); container.classList.add('hidden'); delete activeScanners[containerId]; }
}

// ========== OCR З ФОТО ==========
async function enhanceImageForOCR(file) {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let width = img.width;
            let height = img.height;
            const maxSize = 1200;
            if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
            canvas.width = width; canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                const threshold = 140;
                const value = gray > threshold ? 255 : 0;
                data[i] = value; data[i+1] = value; data[i+2] = value;
            }
            ctx.putImageData(imageData, 0, 0);
            canvas.toBlob((blob) => { URL.revokeObjectURL(url); resolve(blob); }, 'image/jpeg', 0.95);
        };
        img.src = url;
    });
}

async function processPhoto(file, inputId, mode) {
    const statusDiv = document.createElement('div');
    statusDiv.textContent = '⏳ Обробка зображення...';
    statusDiv.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1f2937;color:white;padding:8px 16px;border-radius:40px;font-size:12px;z-index:2000';
    document.body.appendChild(statusDiv);
    try {
        statusDiv.textContent = '⏳ Покращення зображення...';
        const enhancedBlob = await enhanceImageForOCR(file);
        statusDiv.textContent = '⏳ Розпізнавання тексту...';
        
        const { data: { text } } = await Tesseract.recognize(enhancedBlob, 'ukr+eng', {
            logger: m => console.log(m),
            tessedit_pageseg_mode: '6',
            tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгґдеєжзиіїйклмнопрстуфхцчшщьюя -.,'
        });
        
        let result = text.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        
        if (mode === 'digits') {
            const digitsOnly = result.replace(/\D/g, '');
            result = digitsExtract(digitsOnly);
        } else if (mode === 'smart') {
            const digitsOnly = result.replace(/\D/g, '');
            result = smartMeterExtract(digitsOnly);
        }
        
        document.getElementById(inputId).value = result;
        const shortResult = result.length > 40 ? result.substring(0, 40) + '...' : result;
        statusDiv.textContent = `✅ Розпізнано: ${shortResult}`;
        setTimeout(() => statusDiv.remove(), 3000);
        showToast(`📷 Розпізнано: ${shortResult}`);
    } catch(err) {
        console.error('OCR помилка:', err);
        statusDiv.textContent = '❌ Помилка розпізнавання';
        setTimeout(() => statusDiv.remove(), 3000);
        alert('❌ Не вдалося розпізнати текст. Спробуйте краще фото.');
    }
}

function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:10px 20px;border-radius:40px;font-size:14px;z-index:2000';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function saveRecord() {
    const account = accountInput.value.trim();
    const meter = meterInput.value.trim();
    const seal1 = sealCoverInput.value.trim();
    const seal2 = sealOptoInput.value.trim();
    const addr = addressInput.value.trim();
    if (account.length !== 10) { alert('❌ Особовий рахунок має містити 10 цифр'); return; }
    if (meter.length !== 8) { alert('❌ Лічильник має містити 8 цифр'); return; }
    if (!seal1 || !seal2 || !addr) { alert('❌ Заповніть всі поля'); return; }
    workLog.unshift({ date: new Date().toLocaleString('uk-UA'), account, meter, seal1, seal2, address: addr });
    saveData();
    accountInput.value = ""; meterInput.value = ""; sealCoverInput.value = ""; sealOptoInput.value = ""; addressInput.value = "";
    alert('✅ Роботу збережено!');
}

function exportCSV() {
    if (!workLog.length) { alert('Немає даних'); return; }
    const headers = ['Дата','Особовий рахунок','Лічильник','Пломба кришки','Пломба оптопорту','Адреса'];
    const rows = workLog.map(r => [`"${r.date}"`,`"${r.account}"`,`"${r.meter}"`,`"${r.seal1}"`,`"${r.seal2}"`,`"${r.address}"`]);
    const csv = headers.join(',') + '\n' + rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob(["\uFEFF"+csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pls_log_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function clearLog() {
    if (confirm('⚠️ Видалити всі записи?')) { workLog = []; saveData(); alert('✅ Журнал очищено'); }
}

function setupValidation() {
    accountInput?.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,10); });
    meterInput?.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,8); });
    
    // Пошук пломб при введенні
    sealCoverInput?.addEventListener('input', function() { showSearchResults('sealCover', this.value); });
    sealOptoInput?.addEventListener('input', function() { showSearchResults('sealOpto', this.value); });
    sealCoverInput?.addEventListener('blur', function() { setTimeout(() => hideSearchResults('sealCover'), 200); });
    sealOptoInput?.addEventListener('blur', function() { setTimeout(() => hideSearchResults('sealOpto'), 200); });
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener("DOMContentLoaded", () => {
    updatePinDisplay();
    setupValidation();
    
    // PIN кнопки
    document.querySelectorAll(".pin-btn").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const num = btn.getAttribute('data-num');
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
    
    // База пломб
    if (addSealBtn) {
        addSealBtn.onclick = () => sealAddForm.classList.toggle('hidden');
        confirmAddSealBtn.onclick = addNewSeal;
        cancelAddSealBtn.onclick = () => sealAddForm.classList.add('hidden');
    }
    if (sealSearchFilter) {
        sealSearchFilter.addEventListener('input', (e) => renderSealsList(e.target.value));
    }
    
    // QR сканер
    document.querySelectorAll(".btn-camera-icon").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const mode = btn.getAttribute('data-mode');
            let scannerId;
            switch(target) {
                case 'accountNumber': scannerId='accountScanner'; break;
                case 'meterNumber': scannerId='meterScanner'; break;
                case 'sealCoverNumber': scannerId='sealCoverScanner'; break;
                case 'sealOptoNumber': scannerId='sealOptoScanner'; break;
                case 'address': scannerId='addressScanner'; break;
                default: return;
            }
            startQrScanner(scannerId, target, mode);
        });
    });
    
    // Фото/OCR
    document.querySelectorAll(".btn-photo-icon").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const mode = btn.getAttribute('data-mode');
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.capture = 'environment';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            fileInput.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    await processPhoto(file, target, mode);
                }
                fileInput.remove();
            };
            fileInput.click();
        });
    });
    
    // Кнопки пошуку пломб
    document.querySelectorAll(".btn-search-seal").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const input = document.getElementById(target);
            if (input) {
                showSearchResults(target, input.value || '');
            }
        });
    });
});