// ========== PIN КОД ==========
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
const exportBtn = document.getElementById('exportBtn');
const clearLogBtn = document.getElementById('clearLogBtn');
const logTable = document.getElementById('logTable');

const sealsListDiv = document.getElementById('sealsList');
const sealSearch = document.getElementById('sealSearch');
const addSealBtn = document.getElementById('addSealBtn');
const sealAddPanel = document.getElementById('sealAddPanel');
const newSealInput = document.getElementById('newSealInput');
const confirmSealBtn = document.getElementById('confirmSealBtn');
const cancelSealBtn = document.getElementById('cancelSealBtn');

// ========== PIN ФУНКЦІЇ ==========
const CORRECT_PIN = "3268";

function updatePinDisplay() {
    if (!pinDisplay) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) masked += "●";
    for (let i = enteredPin.length; i < 4; i++) masked += "●";
    pinDisplay.innerText = masked || "●●●●";
}

function pinAddNum(num) {
    if (enteredPin.length < 4) {
        enteredPin += num;
        updatePinDisplay();
        if (pinError) pinError.innerText = '';
        if (enteredPin.length === 4) {
            if (enteredPin === CORRECT_PIN) {
                pinScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                loadData();
                loadSeals();
            } else {
                pinError.innerText = '❌ Невірний PIN. Спробуйте 3268';
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
    if (enteredPin === CORRECT_PIN) {
        pinScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        loadData();
        loadSeals();
    } else {
        if (pinError) pinError.innerText = '❌ Невірний PIN. Правильний PIN: 3268';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() { 
    enteredPin = ""; 
    updatePinDisplay(); 
    if (pinError) pinError.innerText = '✅ PIN залишається 3268. Введіть його для входу.'; 
    setTimeout(() => { if (pinError) pinError.innerText = ''; }, 3000); 
}

// ========== БАЗА ПЛОМБ ==========
function loadSeals() {
    const stored = localStorage.getItem('pls_seals');
    if (stored) {
        try { sealsDB = JSON.parse(stored); } catch(e) { sealsDB = []; }
    } else {
        sealsDB = [];
    }
    saveSeals();
    renderSealsList();
}

function saveSeals() { 
    localStorage.setItem('pls_seals', JSON.stringify(sealsDB)); 
    renderSealsList(); 
}

function renderSealsList(filter = '') {
    if (!sealsListDiv) return;
    let filtered = sealsDB;
    if (filter) filtered = sealsDB.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
    if (!filtered.length) { 
        sealsListDiv.innerHTML = '<div class="empty-seals">📦 База пломб порожня. Додайте пломбу ➕</div>'; 
        return; 
    }
    let html = '';
    filtered.forEach(seal => {
        html += `<div class="seal-item">
                    <span class="seal-number" data-seal="${escapeHtml(seal)}">🔒 ${escapeHtml(seal)}</span>
                    <button class="delete-seal" data-seal="${escapeHtml(seal)}">🗑️</button>
                </div>`;
    });
    sealsListDiv.innerHTML = html;
    
    document.querySelectorAll('.seal-number').forEach(el => {
        el.addEventListener('click', () => {
            const seal = el.getAttribute('data-seal');
            // Знаходимо активне поле (яке в фокусі)
            const activeField = document.activeElement;
            if (activeField && (activeField.id === 'sealCoverNumber' || activeField.id === 'sealOptoNumber')) {
                activeField.value = seal;
                showToast(`✅ Пломбу додано: ${seal}`);
            } else if (sealCoverInput) {
                // Якщо немає активного поля, додаємо в поле кришки
                sealCoverInput.value = seal;
                showToast(`✅ Пломбу додано в поле "Пломба кришки": ${seal}`);
            }
        });
    });
    
    document.querySelectorAll('.delete-seal').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const seal = el.getAttribute('data-seal');
            if (confirm(`Видалити пломбу "${seal}"?`)) {
                sealsDB = sealsDB.filter(s => s !== seal);
                saveSeals();
                renderSealsList(sealSearch?.value || '');
                showToast(`🗑️ Пломбу видалено: ${seal}`);
            }
        });
    });
}

function addNewSeal() {
    const newSeal = newSealInput.value.trim();
    if (!newSeal) { alert('Введіть номер пломби'); return; }
    if (sealsDB.includes(newSeal)) { alert('Така пломба вже є'); return; }
    sealsDB.push(newSeal);
    saveSeals();
    newSealInput.value = '';
    sealAddPanel.classList.add('hidden');
    if (sealSearch) sealSearch.value = '';
    renderSealsList('');
    showToast(`✅ Додано пломбу: ${newSeal}`);
}

// Додавання пломби через сканер
async function addSealByScanner() {
    const scannerContainerId = 'addSealScannerTemp';
    let tempContainer = document.getElementById(scannerContainerId);
    if (!tempContainer) {
        tempContainer = document.createElement('div');
        tempContainer.id = scannerContainerId;
        tempContainer.className = 'scanner-container';
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '50%';
        tempContainer.style.left = '50%';
        tempContainer.style.transform = 'translate(-50%, -50%)';
        tempContainer.style.width = '90%';
        tempContainer.style.maxWidth = '400px';
        tempContainer.style.zIndex = '10000';
        tempContainer.style.backgroundColor = '#000';
        tempContainer.style.borderRadius = '20px';
        tempContainer.style.overflow = 'hidden';
        document.body.appendChild(tempContainer);
    }
    
    tempContainer.classList.remove('hidden');
    tempContainer.innerHTML = `<div class="scanner-header"><span>📷 Скануйте QR код пломби</span><button class="btn-close-scanner" id="closeScannerBtn">✕</button></div><div id="${scannerContainerId}_reader" style="width:100%"></div>`;
    
    document.getElementById('closeScannerBtn').onclick = async () => {
        if (activeScanners[scannerContainerId]) {
            try { await activeScanners[scannerContainerId].stop(); } catch(e) {}
            delete activeScanners[scannerContainerId];
        }
        tempContainer.classList.add('hidden');
    };
    
    const reader = new Html5Qrcode(`${scannerContainerId}_reader`);
    activeScanners[scannerContainerId] = reader;
    
    try {
        await reader.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
                let result = decodedText.trim();
                if (result) {
                    if (!sealsDB.includes(result)) {
                        sealsDB.push(result);
                        saveSeals();
                        showToast(`✅ Пломбу додано: ${result}`);
                        if (newSealInput) newSealInput.value = result;
                    } else {
                        showToast(`⚠️ Пломба ${result} вже існує`);
                    }
                }
                reader.stop().then(() => {
                    tempContainer.classList.add('hidden');
                    delete activeScanners[scannerContainerId];
                }).catch(e => console.log(e));
            },
            (error) => { console.log(error); }
        );
    } catch(err) {
        alert('❌ Не вдалося запустити камеру');
        tempContainer.classList.add('hidden');
        delete activeScanners[scannerContainerId];
    }
}

// ========== ПОШУК ПІД ПОЛЯМИ (ПРАЦЮЄ!) ==========
function showSearchResults(fieldId, query) {
    const container = document.getElementById(`${fieldId}Results`);
    if (!container) return;
    if (!query || query.length < 1) { 
        container.classList.add('hidden'); 
        container.innerHTML = ''; 
        return; 
    }
    const filtered = sealsDB.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    if (!filtered.length) { 
        container.classList.add('hidden'); 
        return; 
    }
    container.classList.remove('hidden');
    let html = '';
    filtered.forEach(seal => { 
        html += `<div class="search-result-item" data-seal="${escapeHtml(seal)}">🔒 ${escapeHtml(seal)}</div>`; 
    });
    container.innerHTML = html;
    
    // Додаємо обробник для кожного результату
    const resultItems = container.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const sealValue = item.getAttribute('data-seal');
            const inputField = document.getElementById(fieldId);
            
            if (inputField) {
                // Вставляємо пломбу в поле
                inputField.value = sealValue;
                // Закриваємо результати
                container.classList.add('hidden');
                container.innerHTML = '';
                // Візуальний зворотній зв'язок
                inputField.style.backgroundColor = '#d1fae5';
                inputField.style.border = '2px solid #10b981';
                showToast(`✅ Пломбу додано: ${sealValue}`);
                setTimeout(() => {
                    inputField.style.backgroundColor = 'white';
                    inputField.style.border = '1px solid #e2e8f0';
                }, 500);
            }
        });
    });
}

function hideSearchResults(fieldId) {
    const container = document.getElementById(`${fieldId}Results`);
    if (container) {
        setTimeout(() => { 
            container.classList.add('hidden'); 
            container.innerHTML = ''; 
        }, 300);
    }
}

// ========== ДАНІ ЖУРНАЛУ ==========
function loadData() {
    const stored = localStorage.getItem('pls_log');
    if (stored) { try { workLog = JSON.parse(stored); } catch(e) { workLog = []; } }
    if (!workLog.length) workLog = [];
    renderLog();
}

function saveData() { localStorage.setItem('pls_log', JSON.stringify(workLog)); renderLog(); }

function renderLog() {
    if (!logTable) return;
    if (!workLog.length) { logTable.innerHTML = '<tr class="empty-row"><td colspan="7">Немає записів</td></tr>'; return; }
    let html = '';
    workLog.forEach((r, idx) => {
        html += `<tr>
                    <td>${escapeHtml(r.date)}</td>
                    <td>${escapeHtml(r.account)}</td>
                    <td>${escapeHtml(r.meter)}</td>
                    <td><span class="badge">🔒 ${escapeHtml(r.seal1)}</span></td>
                    <td><span class="badge">🔒 ${escapeHtml(r.seal2)}</span></td>
                    <td>${escapeHtml(r.address)}</td>
                    <td><span class="delete-icon" data-idx="${idx}">🗑️</span></td>
                </tr>`;
    });
    logTable.innerHTML = html;
    document.querySelectorAll('.delete-icon').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.getAttribute('data-idx'));
            if (confirm('Видалити запис?')) { workLog.splice(idx, 1); saveData(); }
        });
    });
}

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }

function smartMeterExtract(t) {
    const d = t.replace(/\D/g, '');
    if (d.length >= 16) return d.substring(4, 12);
    if (d.length >= 12) return d.substring(4, d.length - 4);
    if (d.length === 8) return d;
    return d;
}
function digitsExtract(t) { return t.replace(/\D/g, '').substring(0, 10); }

// ========== QR СКАНЕР ДЛЯ ПОЛІВ ==========
async function stopScanner(id) { 
    if (activeScanners[id]) { 
        try { await activeScanners[id].stop(); } catch(e) {} 
        delete activeScanners[id]; 
    } 
}

async function startQrScanner(containerId, inputId, mode) {
    if (activeScanners[containerId]) { 
        await stopScanner(containerId); 
        document.getElementById(containerId).classList.add('hidden'); 
        return; 
    }
    for (let s in activeScanners) { 
        await stopScanner(s); 
        const c = document.getElementById(s); 
        if (c) c.classList.add('hidden'); 
    }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="scanner-header"><span>📷 Наведіть камеру на QR-код</span><button class="btn-close-scanner">✕</button></div><div id="${containerId}_reader" style="width:100%"></div>`;
    const closeBtn = container.querySelector('.btn-close-scanner');
    if (closeBtn) {
        closeBtn.onclick = async () => { await stopScanner(containerId); container.classList.add('hidden'); };
    }
    const reader = new Html5Qrcode(`${containerId}_reader`);
    activeScanners[containerId] = reader;
    try {
        await reader.start(
            { facingMode: "environment" }, 
            { fps: 10, qrbox: { width: 280, height: 280 } }, 
            (decodedText) => {
                let result = decodedText.trim();
                if (mode === 'digits') result = digitsExtract(result);
                else if (mode === 'smart') result = smartMeterExtract(result);
                document.getElementById(inputId).value = result;
                stopScanner(containerId).then(() => container.classList.add('hidden'));
                showToast(`✅ Відскановано: ${result.substring(0, 30)}`);
            },
            (error) => { console.log(error); }
        );
    } catch(err) { 
        alert('❌ Не вдалося запустити камеру. Перевірте дозволи.'); 
        container.classList.add('hidden'); 
        delete activeScanners[containerId]; 
    }
}

function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:8px 16px;border-radius:40px;font-size:13px;z-index:2000';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function saveRecord() {
    const acc = accountInput.value.trim();
    const meter = meterInput.value.trim();
    const s1 = sealCoverInput.value.trim();
    const s2 = sealOptoInput.value.trim();
    const addr = addressInput.value.trim();
    if (acc.length !== 10) { alert('❌ Особовий рахунок має містити 10 цифр'); return; }
    if (meter.length !== 8) { alert('❌ Лічильник має містити 8 цифр'); return; }
    if (!s1) { alert('❌ Введіть пломбу кришки'); return; }
    if (!s2) { alert('❌ Введіть пломбу оптопорту'); return; }
    if (!addr) { alert('❌ Введіть адресу'); return; }
    workLog.unshift({ date: new Date().toLocaleString('uk-UA'), account: acc, meter: meter, seal1: s1, seal2: s2, address: addr });
    saveData();
    accountInput.value = ""; meterInput.value = ""; sealCoverInput.value = ""; sealOptoInput.value = ""; addressInput.value = "";
    alert('✅ Роботу збережено!');
}

function exportCSV() {
    if (!workLog.length) { alert('Немає даних для експорту'); return; }
    const headers = ['Дата','Особовий рахунок','Лічильник','Пломба кришки','Пломба оптопорту','Адреса'];
    const rows = workLog.map(r => [`"${r.date}"`,`"${r.account}"`,`"${r.meter}"`,`"${r.seal1}"`,`"${r.seal2}"`,`"${r.address}"`]);
    const csv = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csv], {type: 'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pls_log_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function clearLog() {
    if (confirm('⚠️ Видалити ВСІ записи? Це не можна скасувати.')) { workLog = []; saveData(); alert('✅ Журнал очищено'); }
}

function setupValidation() {
    if (accountInput) {
        accountInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,10); });
    }
    if (meterInput) {
        meterInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,8); });
    }
    if (sealCoverInput) {
        sealCoverInput.addEventListener('input', function() { showSearchResults('sealCover', this.value); });
        sealCoverInput.addEventListener('blur', function() { setTimeout(() => hideSearchResults('sealCover'), 300); });
    }
    if (sealOptoInput) {
        sealOptoInput.addEventListener('input', function() { showSearchResults('sealOpto', this.value); });
        sealOptoInput.addEventListener('blur', function() { setTimeout(() => hideSearchResults('sealOpto'), 300); });
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener("DOMContentLoaded", function() {
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
        addSealBtn.onclick = () => sealAddPanel.classList.toggle('hidden');
        if (confirmSealBtn) confirmSealBtn.onclick = addNewSeal;
        if (cancelSealBtn) cancelSealBtn.onclick = () => sealAddPanel.classList.add('hidden');
    }
    if (sealSearch) {
        sealSearch.addEventListener('input', (e) => renderSealsList(e.target.value));
    }
    
    // Кнопка додавання пломби через сканер
    const scanToAddBtn = document.createElement('button');
    scanToAddBtn.textContent = '📷 Сканувати QR';
    scanToAddBtn.className = 'btn-small';
    scanToAddBtn.style.marginLeft = '8px';
    scanToAddBtn.style.background = '#9333ea';
    scanToAddBtn.onclick = addSealByScanner;
    if (addSealBtn && addSealBtn.parentNode) {
        addSealBtn.parentNode.appendChild(scanToAddBtn);
    }
    
    // QR сканер для полів
    document.querySelectorAll(".btn-scan").forEach(btn => {
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
});