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
const pinForgot = document.getElementById('pinForgot');

// Основні поля
const workType = document.getElementById('workType');
const employeeId = document.getElementById('employeeId');
const accountNumber = document.getElementById('accountNumber');
const address = document.getElementById('address');
const oldMeterNumber = document.getElementById('oldMeterNumber');
const newMeterNumber = document.getElementById('newMeterNumber');
const oldMeterType = document.getElementById('oldMeterType');
const newMeterType = document.getElementById('newMeterType');
const oldMeterReading = document.getElementById('oldMeterReading');
const newMeterReading = document.getElementById('newMeterReading');

// Демонтовані пломби
const oldSealCover = document.getElementById('oldSealCover');
const oldSealVKP = document.getElementById('oldSealVKP');
const oldSealSHO1 = document.getElementById('oldSealSHO1');
const oldSealSHO2 = document.getElementById('oldSealSHO2');
const oldSealOpto = document.getElementById('oldSealOpto');
const oldIMP1 = document.getElementById('oldIMP1');
const oldIMP2 = document.getElementById('oldIMP2');
const oldIMP3 = document.getElementById('oldIMP3');

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

// ========== GOOGLE FORM URL ==========
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfj1wXEHe0VsHAmkIY_MWK_a9cbzDgyIPmPJ3h1lCijIwAL-A/viewform";

// ========== ТІЛЬКИ ТЕКСТОВІ ПОЛЯ (ВИПАДАЮЧІ СПИСКИ НЕ ПЕРЕДАЮТЬСЯ) ==========
// Це ID тільки для текстових полів. Випадаючі списки (типи лічильників) НЕ передаються!
const TEXT_FIELDS = {
    workType: "entry.1609399626",           // Оберіть виконувану роботу
    employeeId: "entry.1583379400",         // Табельний номер
    accountNumber: "entry.244962092",       // Особовий рахунок
    oldMeterNumber: "entry.1666715724",     // Номер демонтованого лічильника
    newMeterNumber: "entry.959182756",      // Номер встановленого лічильника
    oldMeterReading: "entry.1779114186107", // Покази демонтованого лічильника
    newMeterReading: "entry.960182756",     // Покази встановленого лічильника
    address: "entry.1458846130",            // Адреса
    // Пломби
    oldSealCover: "entry.950038743",
    oldSealVKP: "entry.9515038743",
    oldSealSHO1: "entry.952083469",
    oldSealSHO2: "entry.953142835",
    oldSealOpto: "entry.954162369",
    oldIMP1: "entry.955182756",
    oldIMP2: "entry.956182756",
    oldIMP3: "entry.957182756",
    newSealCover: "entry.961182756",
    newSealVKP: "entry.962182756",
    newSealSHO1: "entry.963182756",
    newSealSHO2: "entry.964182756",
    newSealOpto: "entry.965182756",
    newIMP1: "entry.966182756",
    newIMP2: "entry.967182756",
    newIMP3: "entry.968182756"
};

// ========== PIN ФУНКЦІЇ ==========
const CORRECT_PIN = "3268";

function updatePinDisplay() {
    if (!pinDisplay) return;
    let masked = "";
    for (let i = 0; i < enteredPin.length; i++) masked += "●";
    for (let i = enteredPin.length; i < 4; i++) masked += "○";
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
                if (pinError) pinError.innerText = '❌ Невірний PIN. Спробуйте 3268';
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

// ========== ВСІ ТИПИ ЛІЧИЛЬНИКІВ ==========
const meterTypesList = [
    "AD11A.1-5-1", "EMH ED2500", "GAMMA 100 G1B", "GAMMA 300", "GROSS DDS-UA",
    "ISKRA ME162-D1A44-V12L11-M2KO", "ITZ", "Landis Gur L550", "Landis310",
    "MCS301-CE51B 30MIS-004 000", "MTX 1A10.DF.2LO-CO4", "MTX 1A10.DF.2LO-Y04",
    "MTX 1A10.DF.2ZO-CD4", "MTX 1A10.DF.2ZO-CO4", "MTX 3A 10.DF.4Z1-C4",
    "MTX 3A 10.DG.4Z3-CD4", "MTX 3A 10.DH.4Z1-CD4", "NIK 2100 AP2.0000.0.11",
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
    "HIK 2102-01.E2MT1", "HIK 2102-01.E2P1", "HIK 2102-01.E2CT", "HIK 2102-01.E2T",
    "HIK 2102-01.E2TP1", "HIK 2102-02.M1", "HIK 2102-02.M1B", "HIK 2102-02.M2",
    "HIK 2102-02.M2B", "HIK 2301 AP1", "HIK 2303 AP2", "HIK 2301 AP2B",
    "HIK 2301 AP3", "HIK 2301 AP3B", "HIK 2303 AP2T", "HIK 2303 AP3T",
    "HIK 2303L AP1T", "HIK 2303L AP6", "HIK 2303L AP6T"
];

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

// ========== ДОПОМІЖНІ ФУНКЦІЇ ==========
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }

function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:10px 18px;border-radius:40px;z-index:9999;font-size:14px;box-shadow:0 4px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function digitsExtract(text) { return text.replace(/\D/g, '').substring(0, 10); }
function smartMeterExtract(text) {
    const d = text.replace(/\D/g, '');
    if (d.length >= 16) return d.substring(4, 12);
    if (d.length >= 12) return d.substring(4, d.length - 4);
    if (d.length === 8) return d;
    return d;
}

function parseSealRange(input) {
    input = input.trim();
    const rangePattern = /^([A-Za-zА-Яа-яІіЇїЄє0-9]*?)(\d+)-(\d+)$/i;
    const match = input.match(rangePattern);
    
    if (match) {
        const prefix = match[1];
        const startNum = parseInt(match[2], 10);
        let endNum = parseInt(match[3], 10);
        const startNumStr = match[2];
        const endNumStr = match[3];
        
        if (endNumStr.length < startNumStr.length) {
            const startEndPart = parseInt(startNumStr.slice(-endNumStr.length), 10);
            const diff = endNum - startEndPart;
            endNum = startNum + diff;
        }
        
        if (startNum <= endNum) {
            const seals = [];
            for (let i = startNum; i <= endNum; i++) {
                seals.push(prefix + i);
            }
            return seals;
        }
    }
    return [input];
}

// ========== QR СКАНЕР ==========
async function stopScanner(id) { 
    if (activeScanners[id]) { 
        try { await activeScanners[id].stop(); } catch(e) {} 
        delete activeScanners[id]; 
    } 
}

async function startQrScanner(containerId, inputId, mode, callback = null) {
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
    if (!container) { alert('❌ Контейнер сканера не знайдено: ' + containerId); return; }
    container.classList.remove('hidden');
    container.innerHTML = `<div class="scanner-header"><span>📷 Наведіть камеру на QR-код</span><button class="btn-close-scanner">✕</button></div><div id="${containerId}_reader" style="width:100%"></div>`;
    const closeBtn = container.querySelector('.btn-close-scanner');
    if (closeBtn) closeBtn.onclick = async () => { await stopScanner(containerId); container.classList.add('hidden'); };
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
                
                if (callback) {
                    callback(result);
                } else {
                    const targetInput = document.getElementById(inputId);
                    if (targetInput) targetInput.value = result;
                }
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

// ========== БАЗА ПЛОМБ ==========
function loadSeals() {
    const stored = localStorage.getItem('pls_seals');
    if (stored) { try { sealsDB = JSON.parse(stored); } catch(e) { sealsDB = []; } }
    else { sealsDB = []; }
    renderSealsList();
}

function saveSeals() { localStorage.setItem('pls_seals', JSON.stringify(sealsDB)); renderSealsList(); }

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
        html += `<div class="seal-item"><span class="seal-number" data-seal="${escapeHtml(seal)}">🔒 ${escapeHtml(seal)}</span><button class="delete-seal" data-seal="${escapeHtml(seal)}">🗑️</button></div>`;
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
    
    const sealsToAdd = parseSealRange(newSeal);
    let addedCount = 0;
    const addedSeals = [];
    
    sealsToAdd.forEach(seal => {
        if (!sealsDB.includes(seal)) {
            sealsDB.push(seal);
            addedCount++;
            addedSeals.push(seal);
        }
    });
    
    saveSeals();
    newSealInput.value = '';
    sealAddPanel.classList.add('hidden');
    if (sealSearch) sealSearch.value = '';
    renderSealsList('');
    
    if (addedCount > 0) {
        showToast(`✅ Додано пломб: ${addedCount} (${addedSeals[0]} ... ${addedSeals[addedSeals.length-1]})`);
    } else {
        showToast(`⚠️ Всі пломби вже існують`);
    }
}

// ========== ПОШУК ПЛОМБ ==========
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
    
    const items = container.querySelectorAll('.search-result-item');
    items.forEach(item => {
        const oldHandler = item._clickHandler;
        if (oldHandler) item.removeEventListener('click', oldHandler);
        
        const handler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const sealValue = this.getAttribute('data-seal');
            const targetInput = document.getElementById(fieldId);
            if (targetInput) {
                targetInput.value = sealValue;
                container.classList.add('hidden');
                container.innerHTML = '';
                showToast(`✅ Пломбу додано: ${sealValue}`);
            }
        };
        item._clickHandler = handler;
        item.addEventListener('click', handler);
    });
}

function hideSearchResults(fieldId) {
    const container = document.getElementById(`${fieldId}Results`);
    if (container) setTimeout(() => { container.classList.add('hidden'); container.innerHTML = ''; }, 300);
}

function setupSearch() {
    const sealInputs = document.querySelectorAll('.seal-input');
    sealInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() { 
                showSearchResults(this.id, this.value); 
            });
            input.addEventListener('blur', function() { 
                setTimeout(() => hideSearchResults(this.id), 300); 
            });
        }
    });
}

// ========== ДАНІ ДЛЯ ЖУРНАЛУ ==========
function getFormData() {
    return {
        date: new Date().toLocaleString('uk-UA'),
        workType: workType?.value || '',
        employeeId: employeeId?.value || '',
        accountNumber: accountNumber?.value || '',
        oldMeterNumber: oldMeterNumber?.value || '',
        newMeterNumber: newMeterNumber?.value || '',
        oldMeterType: oldMeterType?.value || '',
        newMeterType: newMeterType?.value || '',
        oldMeterReading: oldMeterReading?.value || '',
        newMeterReading: newMeterReading?.value || '',
        address: address?.value || '',
        oldSealCover: oldSealCover?.value || '',
        oldSealVKP: oldSealVKP?.value || '',
        oldSealSHO1: oldSealSHO1?.value || '',
        oldSealSHO2: oldSealSHO2?.value || '',
        oldSealOpto: oldSealOpto?.value || '',
        oldIMP1: oldIMP1?.value || '',
        oldIMP2: oldIMP2?.value || '',
        oldIMP3: oldIMP3?.value || '',
        newSealCover: newSealCover?.value || '',
        newSealVKP: newSealVKP?.value || '',
        newSealSHO1: newSealSHO1?.value || '',
        newSealSHO2: newSealSHO2?.value || '',
        newSealOpto: newSealOpto?.value || '',
        newIMP1: newIMP1?.value || '',
        newIMP2: newIMP2?.value || '',
        newIMP3: newIMP3?.value || ''
    };
}

function saveAllFieldsToLog() {
    const data = getFormData();
    workLog.unshift(data);
    saveData();
    alert('✅ Всі дані збережено в локальний журнал!');
}

// ========== ВІДПРАВКА В GOOGLE FORM (ТІЛЬКИ ТЕКСТОВІ ПОЛЯ) ==========
function sendToGoogleForm() {
    if (!workType.value) { 
        alert('❌ Виберіть виконувану роботу'); 
        workType.focus(); 
        return; 
    }
    if (!employeeId.value) { 
        alert('❌ Введіть табельний номер'); 
        employeeId.focus(); 
        return; 
    }
    if (!accountNumber.value || accountNumber.value.length !== 10) { 
        alert('❌ Введіть особовий рахунок (10 цифр)'); 
        accountNumber.focus(); 
        return; 
    }
    
    // Створюємо параметри для GET-запиту (ТІЛЬКИ ТЕКСТОВІ ПОЛЯ)
    const params = new URLSearchParams();
    
    // Додаємо ТІЛЬКИ текстові поля (без випадаючих списків)
    params.append(TEXT_FIELDS.workType, workType.value);
    params.append(TEXT_FIELDS.employeeId, employeeId.value);
    params.append(TEXT_FIELDS.accountNumber, accountNumber.value);
    params.append(TEXT_FIELDS.address, address?.value || '');
    params.append(TEXT_FIELDS.oldMeterNumber, oldMeterNumber?.value || '');
    params.append(TEXT_FIELDS.newMeterNumber, newMeterNumber?.value || '');
    params.append(TEXT_FIELDS.oldMeterReading, oldMeterReading?.value || '');
    params.append(TEXT_FIELDS.newMeterReading, newMeterReading?.value || '');
    
    // Пломби
    params.append(TEXT_FIELDS.oldSealCover, oldSealCover?.value || '');
    params.append(TEXT_FIELDS.oldSealVKP, oldSealVKP?.value || '');
    params.append(TEXT_FIELDS.oldSealSHO1, oldSealSHO1?.value || '');
    params.append(TEXT_FIELDS.oldSealSHO2, oldSealSHO2?.value || '');
    params.append(TEXT_FIELDS.oldSealOpto, oldSealOpto?.value || '');
    params.append(TEXT_FIELDS.oldIMP1, oldIMP1?.value || '');
    params.append(TEXT_FIELDS.oldIMP2, oldIMP2?.value || '');
    params.append(TEXT_FIELDS.oldIMP3, oldIMP3?.value || '');
    
    params.append(TEXT_FIELDS.newSealCover, newSealCover?.value || '');
    params.append(TEXT_FIELDS.newSealVKP, newSealVKP?.value || '');
    params.append(TEXT_FIELDS.newSealSHO1, newSealSHO1?.value || '');
    params.append(TEXT_FIELDS.newSealSHO2, newSealSHO2?.value || '');
    params.append(TEXT_FIELDS.newSealOpto, newSealOpto?.value || '');
    params.append(TEXT_FIELDS.newIMP1, newIMP1?.value || '');
    params.append(TEXT_FIELDS.newIMP2, newIMP2?.value || '');
    params.append(TEXT_FIELDS.newIMP3, newIMP3?.value || '');
    
    // Відкриваємо форму в новій вкладці
    const formUrl = `${GOOGLE_FORM_URL}?${params.toString()}`;
    window.open(formUrl, '_blank');
    
    // Додаємо в локальний журнал
    const data = getFormData();
    workLog.unshift(data);
    saveData();
    
    alert('✅ Google Form відкрито в новій вкладці!\n\nВсі текстові поля заповнені. Випадаючі списки (типи лічильників) виберіть вручну.');
}

function openGoogleForm() {
    window.open(GOOGLE_FORM_URL, '_blank');
}

function clearAllFields() {
    document.querySelectorAll('input, select').forEach(input => {
        if (input.id !== 'employeeId') input.value = '';
    });
    showToast('✅ Всі поля очищено');
}

// ========== ЖУРНАЛ ==========
function loadData() {
    const stored = localStorage.getItem('pls_log');
    if (stored) { try { workLog = JSON.parse(stored); } catch(e) { workLog = []; } }
    if (!workLog.length) workLog = [];
    renderLog();
}

function saveData() { localStorage.setItem('pls_log', JSON.stringify(workLog)); renderLog(); }

function renderLog() {
    if (!logTable) return;
    if (!workLog.length) {
        logTable.innerHTML = '<tr class="empty-row"><td colspan="10">Немає записів<\/td><\/tr>';
        return;
    }
    let html = '';
    workLog.forEach((r, idx) => {
        const removedSeals = [r.oldSealCover, r.oldSealVKP, r.oldSealSHO1, r.oldSealSHO2, r.oldSealOpto, r.oldIMP1, r.oldIMP2, r.oldIMP3].filter(v => v && v.trim() !== '').join(', ');
        const installedSeals = [r.newSealCover, r.newSealVKP, r.newSealSHO1, r.newSealSHO2, r.newSealOpto, r.newIMP1, r.newIMP2, r.newIMP3].filter(v => v && v.trim() !== '').join(', ');
        html += `<tr>
            <td>${escapeHtml(r.date || '')}<\/td>
            <td>${escapeHtml(r.workType || '')}<\/td>
            <td>${escapeHtml(r.employeeId || '')}<\/td>
            <td>${escapeHtml(r.accountNumber || '')}<\/td>
            <td>${escapeHtml(r.oldMeterNumber || '')}<\/td>
            <td>${escapeHtml(r.newMeterNumber || '')}<\/td>
            <td style="min-width:220px;">${escapeHtml(r.address || '')}<\/td>
            <td style="min-width:240px;"><div style="background:#fee2e2; color:#dc2626; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:600; display:inline-block; margin-bottom:6px;">🔻 Зняті<\/div><div style="white-space:normal; word-break:break-word;">${escapeHtml(removedSeals) || '—'}<\/div><\/td>
            <td style="min-width:240px;"><div style="background:#dcfce7; color:#16a34a; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:600; display:inline-block; margin-bottom:6px;">🔺 Встановлені<\/div><div style="white-space:normal; word-break:break-word;">${escapeHtml(installedSeals) || '—'}<\/div><\/td>
            <td><button class="delete-icon" data-idx="${idx}" style="border:none; background:none; cursor:pointer; font-size:18px;">🗑️<\/button><\/td>
        <\/tr>`;
    });
    logTable.innerHTML = html;
    document.querySelectorAll('.delete-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            if (confirm('Видалити запис?')) { workLog.splice(idx, 1); saveData(); }
        });
    });
}

function exportCSV() {
    if (!workLog.length) { alert('Немає даних для експорту'); return; }
    const headers = ['Дата','Робота','Табельний','Особовий','Дем.лічильник','Нов.лічильник','Адреса','Зняті пломби','Встановлені пломби'];
    const rows = workLog.map(r => {
        const removedSeals = [r.oldSealCover, r.oldSealVKP, r.oldSealSHO1, r.oldSealSHO2, r.oldSealOpto, r.oldIMP1, r.oldIMP2, r.oldIMP3].filter(v => v && v.trim() !== '').join(' ');
        const installedSeals = [r.newSealCover, r.newSealVKP, r.newSealSHO1, r.newSealSHO2, r.newSealOpto, r.newIMP1, r.newIMP2, r.newIMP3].filter(v => v && v.trim() !== '').join(' ');
        return [`"${r.date}"`,`"${r.workType || ''}"`,`"${r.employeeId || ''}"`,`"${r.accountNumber || ''}"`,`"${r.oldMeterNumber || ''}"`,`"${r.newMeterNumber || ''}"`,`"${r.address || ''}"`,`"${removedSeals}"`,`"${installedSeals}"`];
    });
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

// ========== ІНІЦІАЛІЗАЦІЯ ==========
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
    
    if (pinForgot) pinForgot.onclick = pinReset;
    
    if (saveBtn) saveBtn.onclick = saveAllFieldsToLog;
    if (exportBtn) exportBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    if (sendToFormBtn) sendToFormBtn.onclick = sendToGoogleForm;
    
    const openFormBtn = document.getElementById('openFormBtn');
    if (openFormBtn) {
        openFormBtn.addEventListener('click', openGoogleForm);
    }
    
    const scanAccountBtn = document.getElementById('scanAccountBtn');
    if (scanAccountBtn) {
        scanAccountBtn.addEventListener('click', () => {
            startQrScanner('accountScanner', 'accountNumber', 'digits');
        });
    }
    
    document.querySelectorAll(".btn-scan:not(#scanAccountBtn)").forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const mode = btn.getAttribute('data-mode');
            if (!target) return;
            let scannerId = target + 'Scanner';
            startQrScanner(scannerId, target, mode);
        });
    });
    
    const scanSealBtn = document.getElementById('scanSealBtn');
    if (scanSealBtn) {
        scanSealBtn.addEventListener('click', async () => {
            const tempContainerId = 'tempSealScanner';
            let tempContainer = document.getElementById(tempContainerId);
            if (!tempContainer) {
                tempContainer = document.createElement('div');
                tempContainer.id = tempContainerId;
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
            tempContainer.innerHTML = `<div class="scanner-header"><span>📷 Скануйте QR код пломби</span><button class="btn-close-scanner" id="closeTempScanner">✕</button></div><div id="${tempContainerId}_reader" style="width:100%"></div>`;
            
            document.getElementById('closeTempScanner').onclick = async () => {
                if (activeScanners[tempContainerId]) {
                    try { await activeScanners[tempContainerId].stop(); } catch(e) {}
                    delete activeScanners[tempContainerId];
                }
                tempContainer.classList.add('hidden');
            };
            
            const reader = new Html5Qrcode(`${tempContainerId}_reader`);
            activeScanners[tempContainerId] = reader;
            
            try {
                await reader.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => {
                        const result = decodedText.trim();
                        if (newSealInput) newSealInput.value = result;
                        reader.stop().then(() => {
                            tempContainer.classList.add('hidden');
                            delete activeScanners[tempContainerId];
                        }).catch(e => console.log(e));
                        showToast(`✅ Відскановано: ${result.substring(0, 30)}`);
                    },
                    (error) => { console.log(error); }
                );
            } catch(err) {
                alert('❌ Не вдалося запустити камеру');
                tempContainer.classList.add('hidden');
                delete activeScanners[tempContainerId];
            }
        });
    }
    
    if (addSealBtn) {
        addSealBtn.onclick = () => sealAddPanel.classList.toggle('hidden');
        if (confirmSealBtn) confirmSealBtn.onclick = addNewSeal;
        if (cancelSealBtn) cancelSealBtn.onclick = () => sealAddPanel.classList.add('hidden');
    }
    if (sealSearch) {
        sealSearch.addEventListener('input', (e) => renderSealsList(e.target.value));
    }
});