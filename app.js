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
function getPin() {
    let pin = localStorage.getItem('pls_pin');
    if (!pin) { pin = "3268"; localStorage.setItem('pls_pin', pin); }
    return pin;
}

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
        pinError.innerText = '';
        if (enteredPin.length === 4) {
            if (enteredPin === getPin()) {
                pinScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                loadData();
                loadSeals();
            } else {
                pinError.innerText = '❌ Невірний PIN (3268)';
                enteredPin = "";
                updatePinDisplay();
            }
        }
    }
}

function pinClear() { enteredPin = ""; updatePinDisplay(); pinError.innerText = ''; }
function pinCheck() {
    if (enteredPin.length !== 4) { pinError.innerText = '❌ 4 цифри'; return; }
    if (enteredPin === getPin()) {
        pinScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        loadData();
        loadSeals();
    } else {
        pinError.innerText = '❌ Невірний PIN (3268)';
        enteredPin = "";
        updatePinDisplay();
    }
}
function pinReset() { localStorage.setItem('pls_pin', "3268"); enteredPin = ""; updatePinDisplay(); pinError.innerText = '✅ PIN: 3268'; setTimeout(() => pinError.innerText = '', 2000); }

// ========== БАЗА ПЛОМБ ==========
function loadSeals() {
    const stored = localStorage.getItem('pls_seals');
    if (stored) { try { sealsDB = JSON.parse(stored); } catch(e) { sealsDB = []; } }
    if (!sealsDB.length) { sealsDB = ['PL7890', 'OP5566', 'SEAL123', 'TEST456']; saveSeals(); }
    renderSealsList();
}

function saveSeals() { localStorage.setItem('pls_seals', JSON.stringify(sealsDB)); renderSealsList(); }

function renderSealsList(filter = '') {
    if (!sealsListDiv) return;
    let filtered = sealsDB;
    if (filter) filtered = sealsDB.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
    if (!filtered.length) { sealsListDiv.innerHTML = '<div class="empty-seals">➕ Додайте першу пломбу</div>'; return; }
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
            const active = document.activeElement;
            if (active && (active.id === 'sealCoverNumber' || active.id === 'sealOptoNumber')) {
                active.value = seal;
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

// ========== ПОШУК ПІД ПОЛЯМИ ==========
function showSearchResults(fieldId, query) {
    const container = document.getElementById(`${fieldId}Results`);
    if (!container) return;
    if (!query || query.length < 1) { container.classList.add('hidden'); container.innerHTML = ''; return; }
    const filtered = sealsDB.filter(s => s.toLowerCase().includes(query.toLowerCase()));
    if (!filtered.length) { container.classList.add('hidden'); return; }
    container.classList.remove('hidden');
    let html = '';
    filtered.forEach(seal => { html += `<div class="search-result-item" data-seal="${escapeHtml(seal)}">🔒 ${escapeHtml(seal)}</div>`; });
    container.innerHTML = html;
    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const seal = item.getAttribute('data-seal');
            const input = document.getElementById(fieldId);
            if (input) {
                input.value = seal;
                container.classList.add('hidden');
                input.style.backgroundColor = '#d1fae5';
                setTimeout(() => input.style.backgroundColor = 'white', 500);
                showToast(`✅ Пломбу додано: ${seal}`);
            }
        });
    });
}

function hideSearchResults(fieldId) {
    const container = document.getElementById(`${fieldId}Results`);
    if (container) setTimeout(() => { container.classList.add('hidden'); container.innerHTML = ''; }, 200);
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

// ========== QR СКАНЕР ==========
async function stopScanner(id) { if (activeScanners[id]) { try { await activeScanners[id].stop(); } catch(e) {} delete activeScanners[id]; } }

async function startQrScanner(containerId, inputId, mode) {
    if (activeScanners[containerId]) { await stopScanner(containerId); document.getElementById(containerId).classList.add('hidden'); return; }
    for (let s in activeScanners) { await stopScanner(s); const c = document.getElementById(s); if (c) c.classList.add('hidden'); }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `<div class="scanner-header"><span>📷 Наведіть камеру на QR-код</span><button class="btn-close-scanner">✕</button></div><div id="${containerId}_reader"></div>`;
    container.querySelector('.btn-close-scanner').onclick = async () => { await stopScanner(containerId); container.classList.add('hidden'); };
    const reader = new Html5Qrcode(`${containerId}_reader`);
    activeScanners[containerId] = reader;
    try {
        await reader.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, (text) => {
            let res = text.trim();
            if (mode === 'digits') res = digitsExtract(res);
            else if (mode === 'smart') res = smartMeterExtract(res);
            document.getElementById(inputId).value = res;
            stopScanner(containerId).then(() => container.classList.add('hidden'));
            showToast(`✅ Відскановано: ${res.substring(0, 30)}`);
        });
    } catch(e) { alert('❌ Помилка камери'); container.classList.add('hidden'); delete activeScanners[containerId]; }
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
    if (acc.length !== 10) { alert('❌ 10 цифр особового'); return; }
    if (meter.length !== 8) { alert('❌ 8 цифр лічильника'); return; }
    if (!s1) { alert('❌ Пломба кришки'); return; }
    if (!s2) { alert('❌ Пломба оптопорту'); return; }
    if (!addr) { alert('❌ Адреса'); return; }
    workLog.unshift({ date: new Date().toLocaleString('uk-UA'), account: acc, meter: meter, seal1: s1, seal2: s2, address: addr });
    saveData();
    accountInput.value = ""; meterInput.value = ""; sealCoverInput.value = ""; sealOptoInput.value = ""; addressInput.value = "";
    alert('✅ Роботу збережено!');
}

function exportCSV() {
    if (!workLog.length) { alert('Немає даних'); return; }
    const headers = ['Дата','Особовий','Лічильник','Пломба кришки','Пломба оптопорту','Адреса'];
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
    if (confirm('⚠️ Видалити всі записи?')) { workLog = []; saveData(); alert('✅ Журнал очищено'); }
}

function setupValidation() {
    accountInput?.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,10); });
    meterInput?.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,8); });
    sealCoverInput?.addEventListener('input', function() { showSearchResults('sealCover', this.value); });
    sealCoverInput?.addEventListener('blur', function() { setTimeout(() => hideSearchResults('sealCover'), 200); });
    sealOptoInput?.addEventListener('input', function() { showSearchResults('sealOpto', this.value); });
    sealOptoInput?.addEventListener('blur', function() { setTimeout(() => hideSearchResults('sealOpto'), 200); });
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener("DOMContentLoaded", function() {
    updatePinDisplay();
    setupValidation();
    
    document.querySelectorAll(".pin-btn").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const num = btn.getAttribute('data-num');
            if (num === "clear") pinClear();
            else if (num === "enter") pinCheck();
            else pinAddNum(num);
        });
    });
    
    document.getElementById("pinForgot").onclick = pinReset;
    saveBtn.onclick = saveRecord;
    exportBtn.onclick = exportCSV;
    clearLogBtn.onclick = clearLog;
    
    if (addSealBtn) {
        addSealBtn.onclick = () => sealAddPanel.classList.toggle('hidden');
        confirmSealBtn.onclick = addNewSeal;
        cancelSealBtn.onclick = () => sealAddPanel.classList.add('hidden');
    }
    if (sealSearch) {
        sealSearch.addEventListener('input', (e) => renderSealsList(e.target.value));
    }
    
    // QR сканер
    document.querySelectorAll(".btn-icon[data-type='qr']").forEach(btn => {
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
    
    // Видаляємо кнопки фото (аналіз фото вимкнено)
    const photoBtns = document.querySelectorAll(".btn-icon[data-type='photo']");
    photoBtns.forEach(btn => btn.remove());
});