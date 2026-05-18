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

// Основні поля
const workType = document.getElementById('workType');
const employeeId = document.getElementById('employeeId');
const accountNumber = document.getElementById('accountNumber');
const address = document.getElementById('address');

// Демонтований лічильник
const oldMeterType = document.getElementById('oldMeterType');
const oldMeterNumber = document.getElementById('oldMeterNumber');
const oldMeterReading = document.getElementById('oldMeterReading');

// Демонтовані пломби
const oldSealCover = document.getElementById('oldSealCover');
const oldSealVKP = document.getElementById('oldSealVKP');
const oldSealSHO1 = document.getElementById('oldSealSHO1');
const oldSealSHO2 = document.getElementById('oldSealSHO2');
const oldSealOpto = document.getElementById('oldSealOpto');
const oldIMP1 = document.getElementById('oldIMP1');
const oldIMP2 = document.getElementById('oldIMP2');
const oldIMP3 = document.getElementById('oldIMP3');

// Встановлений лічильник
const newMeterType = document.getElementById('newMeterType');
const newMeterNumber = document.getElementById('newMeterNumber');
const newMeterReading = document.getElementById('newMeterReading');

// Встановлені пломби
const newSealCover = document.getElementById('newSealCover');
const newSealVKP = document.getElementById('newSealVKP');
const newSealSHO1 = document.getElementById('newSealSHO1');
const newSealSHO2 = document.getElementById('newSealSHO2');
const newSealOpto = document.getElementById('newSealOpto');
const newIMP1 = document.getElementById('newIMP1');
const newIMP2 = document.getElementById('newIMP2');
const newIMP3 = document.getElementById('newIMP3');

const sendToFormBtn = document.getElementById('sendToFormBtn');
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

// GOOGLE FORM URL
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfJ1wXEHewOvsHAmkIY_MwK_a9cbzDgyIPmPJ3h11CijIwAL-A/formResponse";

// ID полів Google Form
const FORM_FIELDS = {
    workType: "entry.1609399626",
    employeeId: "entry.1583379400",
    accountNumber: "entry.244962092",
    oldMeterType: "entry.1262021573",
    oldMeterNumber: "entry.1666715724",
    oldMeterReading: "entry.1779114186107",
    oldSealCover: "entry.950038743",
    oldSealVKP: "entry.9515038743",
    oldSealSHO1: "entry.952083469",
    oldSealSHO2: "entry.953142835",
    oldSealOpto: "entry.954162369",
    oldIMP1: "entry.955182756",
    oldIMP2: "entry.956182756",
    oldIMP3: "entry.957182756",
    newMeterType: "entry.958182756",
    newMeterNumber: "entry.959182756",
    newMeterReading: "entry.960182756",
    newSealCover: "entry.961182756",
    newSealVKP: "entry.962182756",
    newSealSHO1: "entry.963182756",
    newSealSHO2: "entry.964182756",
    newSealOpto: "entry.965182756",
    newIMP1: "entry.966182756",
    newIMP2: "entry.967182756",
    newIMP3: "entry.968182756",
    address: "entry.969182756"
};

// ========== ВСІ ТИПИ ЛІЧИЛЬНИКІВ (УНІКАЛЬНІ, БЕЗ ПОВТОРІВ) ==========
const meterTypesList = [
    "AD11A.1-5-1", "EMH ED2500", "GAMMA 100 G1B", "GAMMA 300", "GROSS DDS-UA",
    "ISKRA ME162-D1A44-V12L11-M2KO", "ITZ", "Landis Gur L550", "Landis310",
    "MCS301-CE51B 30MIS-004 000", "MTX 1A10.DF.2LO-CO4", "MTX 1A10.DF.2LO-Y04",
    "MTX 1A10.DF.2ZO-CD4", "MTX 1A10.DF.2ZO-CO4", "MTX 3A 10.DF.4Z1-C4",
    "MTX 3A 10.DG.4Z3-CD4", "MTX 3A 10.DH.4Z1-CD4", "MTX 1A10.DF.2L0-C04",
    "MTX 1A10.DF.2Z0-CD4", "MTX 1A10.DF.2Z0-CO4", "NIK 2100 AP2.0000.0.11",
    "NIK 2100 AP2T.1000.C.11", "NIK 2100 AP2T.1002.MC.11", "NIK 2100 AP2T.1002.C.11",
    "NIK 2100 AP6T.1002.MC.11", "NIK 2100 AP6T.2000.MC.11", "NIK 2100 AP6T.2002.MC.11",
    "NIK 2100 AP2T.2802.MC.11", "NIK 2100 AP6T.2802.MC.11", "NIK 2100 AP6T.2902.MC.11",
    "NIK 2104 AP2T.1000.M.11", "NIK 2104 AP2T.1000.C.11", "NIK 2104 AP2T.1002.MC.11",
    "NIK 2104 AP2T.1802.MC.11", "NIK 2104 AP2TB.1802.M.11", "NIK 2104 AP6T.2602.MC.21",
    "NIK 2300 AP6T.1000.C.11", "NIK 2300 ARP3T.2900 MC 21", "NIK 2300 ATT.2900 MC 21",
    "NIK 2300 ARTT.2902.MC.11", "NIK 2300 AP3.2000.MC.11", "NIK 2300 AP3T.2000.MC.11",
    "NIK 2300 AP6T.2002.MC.11", "NIK 2300 AP6T.2802.MC.11", "NIK 2300 AP6T.2902.MC.11",
    "NIK 2301 AP3.0 0000.0.11", "NIK 2303 ARP3T.1202.MC.11", "NIK 2303 ARP3T.1802.MC.11",
    "NIK 2303 ARP6T.1002.MC.11", "NIK 2303 ARP6T.1800.MC.11", "NIK 2303 ART T.1800.MC.11",
    "NIK 2303 AT T.1800.MC.21", "NIK 2303 ARP3T.1802.MC.21", "NIK 2303 ARP6T.1802.MC.11",
    "NIK 2303 AP3T.1000.MC.11", "NIK 2303 AP3T.1002.MC.11", "NIK 2303 AP3T.1802.MC.11",
    "NIK 2303 AP3T.2000.MC.11", "NIK 2303 AP6T.1000.MC.11", "NIK 2303 AP6T.1000.C.11",
    "NIK 2303 AP6T.1002.MC.11", "NIK 2303 AP6T.1802.MC.11", "NIK 2303 AP6T.1802MC.21",
    "NIK 2303 AP6T.2000.MC.11", "NIK 2307 0.5s ARTT.1600.MC.21", "NIK 2307 ARP3T.1602.M.21",
    "NIK 2307 ARP3T.1602.MC.21", "NP-06 TD MME 1F 2S-U", "NP-06 TD MME 1F 3S-U",
    "ACE-3000", "ЛЭО", "ЛЭО-M1.4", "МЕРИДИАН ЛТЕ-1.03", "МЕРИДИАН ЛТЕ-1.03T",
    "МЕРИДИАН ЛТЕ-1.03TY", "Меркурій 200", "Меркурій 200.02", "Меркурій 201",
    "Меркурій 206", "МЕРКУРІЙ 231 АТ-01", "НІК 2102-01.E2MCT", "НІК 2102-01.E2P1",
    "НІК 2102-01.E2CT", "НІК 2102-01.E2MT", "НІК 2102-01.E2MT1", "НІК 2102-01.E2T",
    "НІК 2102-01.E2TP1", "НІК 2102-02.M1", "НІК 2102-02.M1B", "НІК 2102-02.M2",
    "НІК 2102-02.M2B", "НІК 2301 AP1", "НІК 2303 AP2", "НІК 2301 AP2B",
    "НІК 2301 AP3", "НІК 2301 AP3B", "НІК 2303 AP2T", "НІК 2303 AP3T",
    "НІК 2303L AP1T", "НІК 2303L AP6", "НІК 2303L AП6Т", "CA4-195", "CA4-И672п",
    "CO-193", "CO-197", "CO-197M", "CO-2", "CO-2M", "COEA09M", "CO-И446",
    "CO-И446M", "CO-И449", "CO-И449М1", "CO-И449М1-1", "CO-И449М1-2",
    "СОЭ-1.02/2", "СОЭ-1.02/2КРТ", "СОЭ-1.02/2KT", "СОЭ-1.02/2T",
    "СОЭ-1.02/5KPTД", "СО-3A10Д", "СО-3G6705", "CT-3A05", "Ц36807Бк",
    "СО-И449М1-1", "СО-И449М1-2", "СОЭ-1.02/2КТ", "СО-ЭА10Д", "СО-Э36705",
    "СТ-ЭА05", "ЦЭ6807Бк", "СОЭ-1.02/5КРТД", "HIK 2102-01.E2MT1", "HIK 2102-01.E2P1",
    "HIK 2102-01.E2CT", "HIK 2102-01.E2T", "HIK 2102-01.E2TP1", "HIK 2102-02.M1",
    "HIK 2102-02.M1B", "HIK 2102-02.M2", "HIK 2102-02.M2B", "HIK 2301 AP1",
    "HIK 2303 AP2", "HIK 2301 AP2B", "HIK 2301 AP3", "HIK 2301 AP3B", "HIK 2303 AP2T",
    "HIK 2303 AP3T", "HIK 2303L AP1T", "HIK 2303L AP6", "HIK 2303L AP6T"
];

// ========== PIN ФУНКЦІЇ ==========
const CORRECT_PIN = "3268";

function updatePinDisplay() {
    if (!pinDisplay) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) masked += "●";
    for (let i = enteredPin.length; i < 4; i++) masked += "●";
    pinDisplay.innerText = masked;
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
                initMeterTypes();
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
        initMeterTypes();
    } else {
        if (pinError) pinError.innerText = '❌ Невірний PIN. Правильний PIN: 3268';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() { 
    enteredPin = ""; 
    updatePinDisplay(); 
    if (pinError) pinError.innerText = '✅ PIN: 3268'; 
    setTimeout(() => { if (pinError) pinError.innerText = ''; }, 3000); 
}

// ========== ІНІЦІАЛІЗАЦІЯ ТИПІВ ЛІЧИЛЬНИКІВ ==========
function initMeterTypes() {
    if (oldMeterType && oldMeterType.children.length <= 1) {
        meterTypesList.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            oldMeterType.appendChild(option);
        });
    }
    if (newMeterType && newMeterType.children.length <= 1) {
        meterTypesList.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            newMeterType.appendChild(option);
        });
    }
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
            if (activeField && activeField.classList && activeField.classList.contains('seal-input')) {
                activeField.value = seal;
                showToast(`✅ Пломбу додано: ${seal}`);
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

// ========== ВІДПРАВКА В GOOGLE FORM ==========
async function sendToGoogleForm() {
    if (!workType.value) { alert('❌ Виберіть виконувану роботу'); workType.focus(); return; }
    if (!employeeId.value) { alert('❌ Введіть табельний номер'); employeeId.focus(); return; }
    if (!accountNumber.value || accountNumber.value.length !== 10) { 
        alert('❌ Введіть особовий рахунок (10 цифр)'); 
        accountNumber.focus(); 
        return; 
    }
    
    const formData = new FormData();
    
    formData.append(FORM_FIELDS.workType, workType.value);
    formData.append(FORM_FIELDS.employeeId, employeeId.value);
    formData.append(FORM_FIELDS.accountNumber, accountNumber.value);
    formData.append(FORM_FIELDS.address, address?.value || '');
    
    formData.append(FORM_FIELDS.oldMeterType, oldMeterType?.value || '');
    formData.append(FORM_FIELDS.oldMeterNumber, oldMeterNumber?.value || '');
    formData.append(FORM_FIELDS.oldMeterReading, oldMeterReading?.value || '');
    
    formData.append(FORM_FIELDS.oldSealCover, oldSealCover?.value || '');
    formData.append(FORM_FIELDS.oldSealVKP, oldSealVKP?.value || '');
    formData.append(FORM_FIELDS.oldSealSHO1, oldSealSHO1?.value || '');
    formData.append(FORM_FIELDS.oldSealSHO2, oldSealSHO2?.value || '');
    formData.append(FORM_FIELDS.oldSealOpto, oldSealOpto?.value || '');
    formData.append(FORM_FIELDS.oldIMP1, oldIMP1?.value || '');
    formData.append(FORM_FIELDS.oldIMP2, oldIMP2?.value || '');
    formData.append(FORM_FIELDS.oldIMP3, oldIMP3?.value || '');
    
    formData.append(FORM_FIELDS.newMeterType, newMeterType?.value || '');
    formData.append(FORM_FIELDS.newMeterNumber, newMeterNumber?.value || '');
    formData.append(FORM_FIELDS.newMeterReading, newMeterReading?.value || '');
    
    formData.append(FORM_FIELDS.newSealCover, newSealCover?.value || '');
    formData.append(FORM_FIELDS.newSealVKP, newSealVKP?.value || '');
    formData.append(FORM_FIELDS.newSealSHO1, newSealSHO1?.value || '');
    formData.append(FORM_FIELDS.newSealSHO2, newSealSHO2?.value || '');
    formData.append(FORM_FIELDS.newSealOpto, newSealOpto?.value || '');
    formData.append(FORM_FIELDS.newIMP1, newIMP1?.value || '');
    formData.append(FORM_FIELDS.newIMP2, newIMP2?.value || '');
    formData.append(FORM_FIELDS.newIMP3, newIMP3?.value || '');
    
    try {
        await fetch(GOOGLE_FORM_ACTION_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
        
        const now = new Date().toLocaleString('uk-UA');
        workLog.unshift({
            date: now,
            workType: workType.value,
            employeeId: employeeId.value,
            accountNumber: accountNumber.value,
            oldMeter: oldMeterNumber?.value || '',
            newMeter: newMeterNumber?.value || '',
            address: address?.value || '',
            status: 'Відправлено в Google Form'
        });
        saveData();
        
        alert('✅ Дані успішно відправлено в Google Form!');
        
        if (confirm('Очистити всі поля після відправки?')) {
            clearAllFields();
        }
    } catch(error) {
        console.error('Помилка відправки:', error);
        alert('❌ Помилка відправки. Перевірте підключення до інтернету.');
    }
}

function clearAllFields() {
    const allInputs = document.querySelectorAll('input, select');
    allInputs.forEach(input => {
        if (input.id !== 'employeeId') {
            input.value = '';
        }
    });
    showToast('✅ Всі поля очищено');
}

function saveAllFieldsToLog() {
    const now = new Date().toLocaleString('uk-UA');
    
    workLog.unshift({
        date: now,
        workType: workType.value,
        employeeId: employeeId.value,
        accountNumber: accountNumber.value,
        oldMeter: oldMeterNumber?.value || '',
        newMeter: newMeterNumber?.value || '',
        address: address?.value || '',
        status: 'Збережено локально'
    });
    
    saveData();
    alert('✅ Всі дані збережено в локальний журнал!');
}

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
        logTable.innerHTML = '<tr class="empty-row"><td colspan="8">Немає записів</td></tr>'; 
        return; 
    }
    let html = '';
    workLog.forEach((r, idx) => {
        html += `<tr>
                    <td>${escapeHtml(r.date)}</td>
                    <td>${escapeHtml(r.workType || '')}</td>
                    <td>${escapeHtml(r.employeeId || '')}</td>
                    <td>${escapeHtml(r.accountNumber || '')}</td>
                    <td>${escapeHtml(r.oldMeter || '')}</td>
                    <td>${escapeHtml(r.newMeter || '')}</td>
                    <td>${escapeHtml(r.address || '')}</td>
                    <td><span class="badge">${escapeHtml(r.status || '')}</span></td>
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

function exportCSV() {
    if (!workLog.length) { alert('Немає даних для експорту'); return; }
    const headers = ['Дата','Робота','Табельний','Особовий','Дем.лічильник','Нов.лічильник','Адреса','Статус'];
    const rows = workLog.map(r => [`"${r.date}"`,`"${r.workType || ''}"`,`"${r.employeeId || ''}"`,`"${r.accountNumber || ''}"`,`"${r.oldMeter || ''}"`,`"${r.newMeter || ''}"`,`"${r.address || ''}"`,`"${r.status || ''}"`]);
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

function setupSearch() {
    const sealInputs = document.querySelectorAll('.seal-input');
    sealInputs.forEach(input => {
        input.addEventListener('input', function() { 
            showSearchResults(this.id, this.value); 
        });
        input.addEventListener('blur', function() { 
            setTimeout(() => hideSearchResults(this.id), 300); 
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    updatePinDisplay();
    setupSearch();
    
    document.querySelectorAll(".pin-btn").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const num = btn.getAttribute('data-num');
            if (num === "clear") pinClear();
            else if (num === "enter") pinCheck();
            else pinAddNum(num);
        });
    });
    
    const pinForgot = document.getElementById("pinForgot");
    if (pinForgot) pinForgot.onclick = pinReset;
    
    if (sendToFormBtn) sendToFormBtn.onclick = sendToGoogleForm;
    if (saveBtn) saveBtn.onclick = saveAllFieldsToLog;
    if (exportBtn) exportBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    
    if (addSealBtn) {
        addSealBtn.onclick = () => sealAddPanel.classList.toggle('hidden');
        if (confirmSealBtn) confirmSealBtn.onclick = addNewSeal;
        if (cancelSealBtn) cancelSealBtn.onclick = () => sealAddPanel.classList.add('hidden');
    }
    if (sealSearch) {
        sealSearch.addEventListener('input', (e) => renderSealsList(e.target.value));
    }
    
    document.querySelectorAll(".btn-scan").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const mode = btn.getAttribute('data-mode');
            let scannerId = target + 'Scanner';
            startQrScanner(scannerId, target, mode);
        });
    });
});