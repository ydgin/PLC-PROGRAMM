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

// Оновлюємо відображення PIN (крапки)
function updatePinDisplay() {
    if (!pinDisplay) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) masked += "●";
    for (let i = enteredPin.length; i < 4; i++) masked += "●";
    pinDisplay.innerText = masked;
}

// Додавання цифри
function pinAddNum(num) {
    if (enteredPin.length < 4) {
        enteredPin += num;
        updatePinDisplay();
        if (pinError) pinError.innerText = '';
        
        // Автоматична перевірка після 4 цифр
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

// Очищення
function pinClear() { 
    enteredPin = ""; 
    updatePinDisplay(); 
    if (pinError) pinError.innerText = ''; 
}

// Перевірка по кнопці "✓"
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

// Скидання PIN (нагадування)
function pinReset() { 
    enteredPin = ""; 
    updatePinDisplay(); 
    if (pinError) pinError.innerText = '✅ PIN: 3268'; 
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
            const activeField = document.activeElement;
            if (activeField && (activeField.id === 'sealCoverNumber' || activeField.id === 'sealOptoNumber')) {
                activeField.value = seal;
                showToast(`✅ Пломбу додано: ${seal}`);
            } else if (sealCoverInput) {
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

// ========== ЗБЕРЕЖЕННЯ ОКРЕМОГО ПОЛЯ ==========
function saveFieldToLog(fieldId, label) {
    const input = document.getElementById(fieldId);
    if (!input) return;
    
    const value = input.value.trim();
    if (!value) {
        alert(`❌ Поле "${label}" порожнє. Введіть значення.`);
        return;
    }
    
    if (fieldId === 'accountNumber' && value.length !== 10) {
        alert(`❌ Особовий рахунок має містити 10 цифр. Зараз: ${value.length}`);
        return;
    }
    
    if (fieldId === 'meterNumber' && value.length !== 8) {
        alert(`❌ Лічильник має містити 8 цифр. Зараз: ${value.length}`);
        return;
    }
    
    const now = new Date().toLocaleString('uk-UA');
    
    workLog.unshift({
        date: now,
        account: fieldId === 'accountNumber' ? value : '',
        meter: fieldId === 'meterNumber' ? value : '',
        seal1: fieldId === 'sealCoverNumber' ? value : '',
        seal2: fieldId === 'sealOptoNumber' ? value : '',
        address: fieldId === 'address' ? value : ''
    });
    
    saveData();
    showToast(`✅ "${label}" збережено: ${value.substring(0, 30)}`);
}

// ========== ЗАГАЛЬНЕ ЗБЕРЕЖЕННЯ ==========
function saveAllFieldsToLog() {
    const account = accountInput.value.trim();
    const meter = meterInput.value.trim();
    const seal1 = sealCoverInput.value.trim();
    const seal2 = sealOptoInput.value.trim();
    const addr = addressInput.value.trim();
    
    if (account.length !== 10) { alert('❌ Особовий рахунок має містити 10 цифр'); return; }
    if (meter.length !== 8) { alert('❌ Лічильник має містити 8 цифр'); return; }
    if (!seal1) { alert('❌ Введіть пломбу кришки'); return; }
    if (!seal2) { alert('❌ Введіть пломбу оптопорту'); return; }
    if (!addr) { alert('❌ Введіть адресу'); return; }
    
    const now = new Date().toLocaleString('uk-UA');
    
    workLog.unshift({
        date: now,
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
    
    alert('✅ Всі дані збережено в журнал!');
}

// ========== ПОШУК ПІД ПОЛЯМИ ==========
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
    
    const resultItems = container.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
        item.removeEventListener('click', item._handler);
        
        const handler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const sealValue = this.getAttribute('data-seal');
            const targetField = document.getElementById(fieldId);
            
            if (targetField) {
                targetField.value = sealValue;
                container.classList.add('hidden');
                container.innerHTML = '';
                targetField.style.backgroundColor = '#d1fae5';
                targetField.style.border = '2px solid #10b981';
                showToast(`✅ Пломбу додано: ${sealValue}`);
                setTimeout(() => {
                    targetField.style.backgroundColor = 'white';
                    targetField.style.border = '1px solid #e2e8f0';
                }, 500);
            }
        };
        
        item._handler = handler;
        item.addEventListener('click', handler);
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

function saveData() { 
    localStorage.setItem('pls_log', JSON.stringify(workLog)); 
    renderLog(); 
}

function renderLog() {
    if (!logTable) return;
    if (!workLog.length) { 
        logTable.innerHTML = '<tr class="empty-row"><td colspan="7">Немає записів</td></tr>'; 
        return; 
    }
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

// ========== QR СКАНЕР ==========
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
    if (saveBtn) saveBtn.onclick = saveAllFieldsToLog;
    if (exportBtn) exportBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    
    // Кнопки збереження окремих полів
    document.querySelectorAll(".btn-save-field").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const fieldId = btn.getAttribute('data-field');
            const label = btn.getAttribute('data-label');
            saveFieldToLog(fieldId, label);
        });
    });
    
    // База пломб
    if (addSealBtn) {
        addSealBtn.onclick = () => sealAddPanel.classList.toggle('hidden');
        if (confirmSealBtn) confirmSealBtn.onclick = addNewSeal;
        if (cancelSealBtn) cancelSealBtn.onclick = () => sealAddPanel.classList.add('hidden');
    }
    if (sealSearch) {
        sealSearch.addEventListener('input', (e) => renderSealsList(e.target.value));
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
});