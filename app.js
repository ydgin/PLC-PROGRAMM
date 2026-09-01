// ========== PIN КОД ==========
let enteredPin = "";
let workLog = [];
let sealsDB = [];
let metersDB = [];
let activeScanners = {};
let currentSearchTerm = "";
let useAI = false;
let isSending = false;

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

// Нові поля
const workDate = document.getElementById('workDate');
const replacementReason = document.getElementById('replacementReason');

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
const clearFieldsBtn = document.getElementById('clearFieldsBtn');
const searchLogBtn = document.getElementById('searchLogBtn');
const resetSearchBtn = document.getElementById('resetSearchBtn');
const searchAccountInput = document.getElementById('searchAccountInput');
const logTable = document.getElementById('logTable');

// Элементы базы пломб
const sealsListDiv = document.getElementById('sealsList');
const sealSearch = document.getElementById('sealSearch');
const addSealBtn = document.getElementById('addSealBtn');
const sealAddPanel = document.getElementById('sealAddPanel');
const newSealInput = document.getElementById('newSealInput');
const confirmSealBtn = document.getElementById('confirmSealBtn');

// Элементы базы лічильників
const metersListDiv = document.getElementById('metersList');
const meterSearch = document.getElementById('meterSearch');
const addMeterBtn = document.getElementById('addMeterBtn');
const meterAddPanel = document.getElementById('meterAddPanel');
const newMeterInput = document.getElementById('newMeterInput');
const confirmMeterBtn = document.getElementById('confirmMeterBtn');

// ========== ВСІ ТИПИ ЛІЧИЛЬНИКІВ ==========
const meterTypesList = [
    "AD11A.1-5-1", "EMH ED2500", "GAMMA 100 G1B", "GAMMA 300", "GROSS DDS-UA",
    "ISKRA ME162-D1A44-V12L11-M2KO", "ITZ", "Landis Gur L550", "Landis ZCG110ATt", "Landis310",
    "MCS301-CE51B 30MIS-004 000", "MTX 1A10.DF.2LO-C04", "MTX 1A10.DF.2LO-Y04",
    "MTX 1A10.DF.2ZO-CD4", "MTX 1A10.DF.2ZO-C04", "MTX 3A 10.DF.4Z1-C4",
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
    "NIK 2303 AT T.1800.MC.21", "NIK 2303 ARP3T.1802.MC.11", "NIK 2303 ARP3T.1802.MC.21",
    "NIK 2303 ARP6T.1802.MC.11", "NIK 2303 AP3T.1000.MC.11", "NIK 2303 AP3T.1002.MC.11",
    "NIK 2303 AP3T.1802.MC.11", "NIK 2303 AP3T.2000.MC.11", "NIK 2303 AP6T.1000.MC.11",
    "NIK 2303 AP6T.1000.C.11", "NIK 2303 AP6T.1002.MC.11", "NIK 2303 AP6T.1802.MC.11",
    "NIK 2303 AP6T.1802MC.21", "NIK 2303 AP6T.2000.MC.11", "NIK 2307 0.5s ARTT.1600.MC.21",
    "NIK 2307 ARP3T.1602.M.21", "NIK 2307 ARP3T.1602.MC.21", "NP-06 TD MME 1F 2S-U",
    "NP-06 TD MME 1F 3S-U", "ACE-3000", "ЛЭО", "ЛЭО-М1.4", "МЕРИДИАН ЛТЕ-1.03",
    "МЕРИДИАН ЛТЕ-1.03Т", "МЕРИДИАН ЛТЕ-1.03ТУ", "Меркурій 200", "Меркурій 200.02",
    "Меркурій 201", "Меркурій 206", "МЕРКУРІЙ 231 АТ-01", "НИК 2102-01.E2МСТ",
    "НИК 2102-01.E2МТ", "НИК 2102-01.E2МТ1", "НИК 2102-01.E2Р1", "НИК 2102-01.E2СТ",
    "НИК 2102-01.E2Т", "НИК 2102-01.E2ТР1", "НИК 2102-02.M1", "НИК 2102-02.M1В",
    "НИК 2102-02.M2", "НИК 2102-02.M2В", "НИК 2301 АП1", "НИК 2303 АП2",
    "НИК 2301 АП2В", "HIK 2102-01.E2T", "HIK 2102-01.E2TP1", "HIK 2102-02.M1",
    "HIK 2102-02.M1B", "HIK 2102-02.M2", "HIK 2102-02.M2B", "HIK 2301 AP1",
    "HIK 2303 AP2", "HIK 2301 AP2B", "HIK 2301 AP3", "HIK 2301 AP3B",
    "HIK 2303 AP2T", "HIK 2303 AP3T", "HIK 2303L AP1T", "HIK 2303L AP6",
    "HIK 2303L AP6T", "CA4-195", "CA4-И672п", "CO-193", "CO-197", "CO-197М",
    "CO-2", "CO-2М", "COEA09М", "CO-И446", "CO-И446М", "CO-И449",
    "CO-И449М1", "CO-И449М1-1", "CO-И449М1-2", "CO9-1.02/2", "CO9-1.02/2KPT",
    "CO9-1.02/2KT", "CO9-1.02/2T", "CO9-1.02/5KPTД", "CO-ЭА10Д",
    "CO-Э96705", "CO-Э96706", "СТ-ЭА05", "ЦЭ6807Бк", "ЭНЕРГОМЕРА СЕ 102М"
];

// ========== НОРМАЛІЗАЦІЯ ==========
function normalizeMeterType(value) {
    if (!value) return '';
    
    const cyrillicToLatin = {
        'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H',
        'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T',
        'Х': 'X', 'У': 'Y', 'І': 'I', 'Ї': 'I', 'Є': 'E',
        'а': 'a', 'в': 'b', 'с': 'c', 'е': 'e', 'н': 'h',
        'к': 'k', 'м': 'm', 'о': 'o', 'р': 'p', 'т': 't',
        'х': 'x', 'у': 'y', 'і': 'i', 'ї': 'i', 'є': 'e'
    };
    
    return value
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[А-Яа-яЇїЄєІі]/g, match => cyrillicToLatin[match] || match)
        .replace(/[–—]/g, '-')
        .replace(/\s*\.\s*/g, '.')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*\/\s*/g, '/')
        .replace(/[OО]/g, (match) => match === '0' ? '0' : 'O');
}

function normalizeMeterNumber(meter) {
    if (!meter) return '';
    
    meter = meter.trim();
    meter = meter.replace(/\s/g, '');
    meter = toUpperCaseByLanguage(meter);
    
    const replacements = {
        'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H',
        'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T',
        'Х': 'X', 'У': 'Y', 'І': 'I', 'Ї': 'I', 'Є': 'E',
        'а': 'a', 'в': 'b', 'с': 'c', 'е': 'e', 'н': 'h',
        'к': 'k', 'м': 'm', 'о': 'o', 'р': 'p', 'т': 't',
        'х': 'x', 'у': 'y', 'і': 'i', 'ї': 'i', 'є': 'e'
    };
    
    let normalized = '';
    for (let char of meter) {
        normalized += replacements[char] || char;
    }
    
    normalized = normalized.replace(/\.{2,}/g, '.');
    normalized = normalized.replace(/-{2,}/g, '-');
    normalized = normalized.replace(/\.-/g, '.');
    normalized = normalized.replace(/-\./g, '.');
    
    return normalized;
}

function normalizeSealNumber(seal) {
    if (!seal) return '';
    
    seal = seal.trim();
    seal = toUpperCaseByLanguage(seal);
    
    const replacements = {
        'К': 'K', 'к': 'k',
        'С': 'C', 'с': 'c',
        'Е': 'E', 'е': 'e',
        'Н': 'H', 'н': 'h',
        'В': 'B', 'в': 'b',
        'А': 'A', 'а': 'a',
        'Р': 'P', 'р': 'p',
        'О': 'O', 'о': 'o',
        'Т': 'T', 'т': 't',
        'М': 'M', 'м': 'm',
        'Х': 'X', 'х': 'x',
        'У': 'Y', 'у': 'y',
        'І': 'I', 'і': 'i'
    };
    
    let normalized = '';
    for (let char of seal) {
        normalized += replacements[char] || char;
    }
    
    return normalized;
}

function findMeterInSelect(selectElement, value) {
    if (!selectElement || !value) return null;
    const normalizedSearch = normalizeMeterType(value);
    
    for (let i = 0; i < selectElement.options.length; i++) {
        const optionValue = selectElement.options[i].value;
        if (!optionValue) continue;
        if (normalizeMeterType(optionValue) === normalizedSearch) {
            return {
                index: i,
                value: optionValue,
                text: selectElement.options[i].text
            };
        }
    }
    return null;
}

function setMeterTypeValue(selectElement, value) {
    if (!selectElement) return false;
    
    if (!value) {
        selectElement.value = '';
        return true;
    }
    
    const found = findMeterInSelect(selectElement, value);
    if (found) {
        selectElement.selectedIndex = found.index;
        selectElement.value = found.value;
        
        const changeEvent = new Event('change', { bubbles: true });
        selectElement.dispatchEvent(changeEvent);
        
        selectElement.style.borderColor = '#22c55e';
        selectElement.style.backgroundColor = '#f0fdf4';
        setTimeout(() => {
            selectElement.style.borderColor = '#e2e8f0';
            selectElement.style.backgroundColor = '#f8fafc';
        }, 1000);
        
        return true;
    }
    
    const newOption = document.createElement('option');
    newOption.value = value;
    newOption.textContent = value;
    selectElement.appendChild(newOption);
    selectElement.value = value;
    
    showToast(`⚠️ Тип "${value}" додано до списку (не знайдено в базі)`);
    return true;
}

// ========== ПАРСИНГ ДІАПАЗОНІВ ==========
function parseSealRange(input) {
    input = input.trim();
    if (!input) return [];
    
    if (!input.includes('-')) {
        return [input];
    }
    
    const lastDashIndex = input.lastIndexOf('-');
    if (lastDashIndex === -1) return [input];
    
    const firstPart = input.substring(0, lastDashIndex);
    const lastPart = input.substring(lastDashIndex + 1);
    
    let prefix = '';
    let startNumStr = '';
    
    for (let i = firstPart.length - 1; i >= 0; i--) {
        if (firstPart[i] >= '0' && firstPart[i] <= '9') {
            startNumStr = firstPart[i] + startNumStr;
        } else {
            prefix = firstPart.substring(0, i + 1);
            break;
        }
    }
    
    if (!startNumStr) {
        const numMatch = firstPart.match(/(\d+)$/);
        if (numMatch) {
            startNumStr = numMatch[1];
            prefix = firstPart.substring(0, firstPart.length - startNumStr.length);
        } else {
            return [input];
        }
    }
    
    let endNumStr = lastPart.trim().replace(/\D/g, '');
    if (!endNumStr) return [input];
    
    const startNum = parseInt(startNumStr, 10);
    let endNum = parseInt(endNumStr, 10);
    
    if (endNumStr.length < startNumStr.length) {
        const startEndPart = parseInt(startNumStr.slice(-endNumStr.length), 10);
        const diff = endNum - startEndPart;
        endNum = startNum + diff;
    }
    
    if (startNum > endNum || endNum - startNum > 10000) {
        return [input];
    }
    
    const seals = [];
    const numLength = startNumStr.length;
    
    for (let i = startNum; i <= endNum; i++) {
        const numStr = String(i).padStart(numLength, '0');
        seals.push(prefix + numStr);
    }
    
    return seals;
}

function parseMeterRange(input) {
    input = input.trim();
    if (!input) return [];
    
    if (!input.includes('-')) {
        return [input];
    }
    
    const lastDashIndex = input.lastIndexOf('-');
    if (lastDashIndex === -1) return [input];
    
    const firstPart = input.substring(0, lastDashIndex);
    const lastPart = input.substring(lastDashIndex + 1);
    
    let prefix = '';
    let startNumStr = '';
    
    for (let i = firstPart.length - 1; i >= 0; i--) {
        if (firstPart[i] >= '0' && firstPart[i] <= '9') {
            startNumStr = firstPart[i] + startNumStr;
        } else {
            prefix = firstPart.substring(0, i + 1);
            break;
        }
    }
    
    if (!startNumStr) {
        const numMatch = firstPart.match(/(\d+)$/);
        if (numMatch) {
            startNumStr = numMatch[1];
            prefix = firstPart.substring(0, firstPart.length - startNumStr.length);
        } else {
            return [input];
        }
    }
    
    let endNumStr = lastPart.trim().replace(/\D/g, '');
    if (!endNumStr) return [input];
    
    const startNum = parseInt(startNumStr, 10);
    let endNum = parseInt(endNumStr, 10);
    
    if (endNumStr.length < startNumStr.length) {
        const startEndPart = parseInt(startNumStr.slice(-endNumStr.length), 10);
        const diff = endNum - startEndPart;
        endNum = startNum + diff;
    }
    
    if (startNum > endNum || endNum - startNum > 10000) {
        return [input];
    }
    
    const meters = [];
    const numLength = startNumStr.length;
    
    for (let i = startNum; i <= endNum; i++) {
        const numStr = String(i).padStart(numLength, '0');
        meters.push(prefix + numStr);
    }
    
    return meters;
}

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
                loadMeters();
                initMeterTypes();
                setDefaultValues();
                setupVoiceInput();
                setupAutoClean();
                setupVoiceSearch();
                setupVoiceSelect();
                setupOCR();
                setupAI();
                setupSealInputs();
                setupMeterInputs();
                setupAutoMeterTypeDetection();
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
        loadMeters();
        initMeterTypes();
        setDefaultValues();
        setupVoiceInput();
        setupAutoClean();
        setupVoiceSearch();
        setupVoiceSelect();
        setupOCR();
        setupAI();
        setupSealInputs();
        setupMeterInputs();
        setupAutoMeterTypeDetection();
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

function setDefaultValues() {
    if (newMeterReading && !newMeterReading.value) {
        newMeterReading.value = "0000000";
    }
    if (workDate && !workDate.value) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        workDate.value = `${dd}.${mm}.${yyyy}`;
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ТИПІВ ЛІЧИЛЬНИКІВ ==========
function initMeterTypes() {
    if (oldMeterType) {
        oldMeterType.innerHTML = '<option value="">-- Виберіть --</option>';
        meterTypesList.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            oldMeterType.appendChild(option);
        });
    }
    if (newMeterType) {
        newMeterType.innerHTML = '<option value="">-- Виберіть --</option>';
        meterTypesList.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            newMeterType.appendChild(option);
        });
    }
}

// ========== ОБРОБКА ВВЕДЕННЯ ПЛОМБ ==========
function setupSealInputs() {
    const sealInputs = document.querySelectorAll('.seal-input');
    sealInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                const cursorPos = this.selectionStart;
                const oldValue = this.value;
                const normalized = normalizeSealNumber(oldValue);
                if (normalized !== oldValue) {
                    this.value = normalized;
                    this.setSelectionRange(cursorPos, cursorPos);
                }
                showSearchResults(this.id, this.value);
            });
            
            input.addEventListener('blur', function() {
                setTimeout(() => hideSearchResults(this.id), 300);
            });
            
            input.addEventListener('focusout', function() {
                if (this.value) {
                    this.value = normalizeSealNumber(this.value);
                }
            });
        }
    });
}

// ========== ОБРОБКА ВВЕДЕННЯ ЛІЧИЛЬНИКІВ ==========
function setupMeterInputs() {
    const meterInputs = document.querySelectorAll('.meter-input');
    meterInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                const cursorPos = this.selectionStart;
                const oldValue = this.value;
                const normalized = normalizeMeterNumber(oldValue);
                if (normalized !== oldValue) {
                    this.value = normalized;
                    this.setSelectionRange(cursorPos, cursorPos);
                }
                showMeterSearchResults(this.id, this.value);
            });
            
            input.addEventListener('blur', function() {
                setTimeout(() => hideSearchResults(this.id), 300);
            });
            
            input.addEventListener('focusout', function() {
                if (this.value) {
                    this.value = normalizeMeterNumber(this.value);
                    fillMeterFromDB(this, this.value);
                }
            });
        }
    });
}

// ========== АВТОМАТИЧНЕ ВИЗНАЧЕННЯ ТИПУ ЛІЧИЛЬНИКА ==========
function autoDetectMeterType(meterNumber) {
    if (!meterNumber) return null;
    
    const normalized = normalizeMeterNumber(meterNumber);
    
    const found = meterTypesList.find(type => {
        const normType = normalizeMeterType(type);
        return normalized.includes(normType) || normType.includes(normalized);
    });
    
    return found || null;
}

function setupAutoMeterTypeDetection() {
    const meterNumberFields = ['oldMeterNumber', 'newMeterNumber'];
    const meterTypeFields = ['oldMeterType', 'newMeterType'];
    
    meterNumberFields.forEach((numField, index) => {
        const input = document.getElementById(numField);
        if (!input) return;
        
        input.addEventListener('blur', function() {
            const typeField = document.getElementById(meterTypeFields[index]);
            if (!typeField || typeField.value) return;
            if (!this.value) return;
            
            const detectedType = autoDetectMeterType(this.value);
            if (detectedType) {
                setMeterTypeValue(typeField, detectedType);
                showToast(`✅ Визначено тип: ${detectedType}`);
            }
        });
    });
}

// ========== ЗАПОВНЕННЯ З БАЗИ ЛІЧИЛЬНИКІВ ==========
function fillMeterFromDB(inputField, searchTerm) {
    if (!inputField || !searchTerm) return false;
    
    const normalizedSearch = normalizeMeterNumber(searchTerm);
    const found = metersDB.find(m => 
        normalizeMeterNumber(m) === normalizedSearch ||
        normalizeMeterNumber(m).includes(normalizedSearch)
    );
    
    if (found) {
        inputField.value = found;
        inputField.style.borderColor = '#22c55e';
        inputField.style.backgroundColor = '#f0fdf4';
        setTimeout(() => {
            inputField.style.borderColor = '#e2e8f0';
            inputField.style.backgroundColor = '#f8fafc';
        }, 1000);
        showToast(`✅ Знайдено в базі: ${found}`);
        return true;
    }
    return false;
}

// ========== ВАЛІДАЦІЯ ==========
function validateSeals() {
    const sealFields = [
        oldSealCover, oldSealVKP, oldSealSHO1, oldSealSHO2, oldSealOpto,
        oldIMP1, oldIMP2, oldIMP3,
        newSealCover, newSealVKP, newSealSHO1, newSealSHO2, newSealOpto,
        newIMP1, newIMP2, newIMP3
    ];
    
    let hasError = false;
    const errors = [];
    
    sealFields.forEach(field => {
        if (!field) return;
        const value = field.value.trim();
        if (!value) return;
        
        if (value.length < 4 || value.length > 20) {
            errors.push(`⚠️ Пломба "${value}" має некоректну довжину (${value.length} символів)`);
            hasError = true;
        }
        
        if (!/^[A-Za-zА-Яа-яЇїЄєІі0-9\-]+$/.test(value)) {
            errors.push(`⚠️ Пломба "${value}" містить недопустимі символи`);
            hasError = true;
        }
    });
    
    if (hasError) {
        alert('❌ Знайдено помилки в пломбах:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

function validateMeters() {
    const meterFields = [
        { field: oldMeterNumber, name: 'Знятий лічильник' },
        { field: newMeterNumber, name: 'Встановлений лічильник' }
    ];
    
    let hasError = false;
    const errors = [];
    
    meterFields.forEach(({ field, name }) => {
        if (!field) return;
        const value = field.value.trim();
        if (!value) {
            errors.push(`⚠️ Поле "${name}" не заповнене`);
            hasError = true;
            return;
        }
        
        if (value.length < 4 || value.length > 20) {
            errors.push(`⚠️ "${name}" має некоректну довжину (${value.length} символів): ${value}`);
            hasError = true;
        }
        
        if (!/^[A-Za-zА-Яа-яЇїЄєІі0-9\.\-]+$/.test(value)) {
            errors.push(`⚠️ "${name}" містить недопустимі символи: ${value}`);
            hasError = true;
        }
    });
    
    if (hasError) {
        alert('❌ Знайдено помилки в лічильниках:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// ========== ДОПОМІЖНІ ФУНКЦІЇ ==========
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m])); }

function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:10px 18px;border-radius:40px;z-index:9999;font-size:14px;box-shadow:0 4px 10px rgba(0,0,0,0.2);max-width:90%;text-align:center;';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

function digitsExtract(text) { 
    return text.replace(/\D/g, '').substring(0, 10); 
}

function smartMeterExtract(text) {
    const digits = text.replace(/\D/g, '');
    if (digits.length > 8) {
        return digits.substring(4, digits.length - 4);
    }
    return digits;
}

function detectKeyboardLanguage(text) {
    const cyrillicPattern = /[А-Яа-яЇїЄєІі]/g;
    const latinPattern = /[A-Za-z]/g;
    const cyrillicMatches = text.match(cyrillicPattern) || [];
    const latinMatches = text.match(latinPattern) || [];
    if (cyrillicMatches.length > latinMatches.length) return 'cyrillic';
    else if (latinMatches.length > cyrillicMatches.length) return 'latin';
    return 'unknown';
}

function toUpperCaseByLanguage(text) {
    const lang = detectKeyboardLanguage(text);
    if (lang === 'cyrillic') return text.toLocaleUpperCase('uk-UA');
    else if (lang === 'latin') return text.toLocaleUpperCase('en-US');
    return text.toUpperCase();
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
                if (callback) callback(result);
                else {
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

// ========== ГОЛОСОВЕ ВВЕДЕННЯ ==========
function setupVoiceInput() {
    const micButtons = document.querySelectorAll('.btn-mic');
    micButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) { showToast('❌ Поле не знайдено'); return; }
            const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            if (!hasSpeech) {
                showToast('❌ Голосове введення не підтримується');
                alert('❌ Ваш браузер не підтримує голосове введення.\nВикористовуйте Google Chrome або Safari.');
                return;
            }
            if (this.classList.contains('listening')) return;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'uk-UA';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            this.classList.add('listening');
            this.textContent = '⏺';
            try { recognition.start(); } catch(err) {
                this.classList.remove('listening');
                this.textContent = '🎤';
                showToast('❌ Помилка запуску мікрофона');
                console.error('Speech start error:', err);
                return;
            }
            recognition.onstart = function() { showToast('🎤 Скажіть щось...'); };
            recognition.onresult = function(event) {
                try {
                    let transcript = event.results[0][0].transcript;
                    const fieldId = input.id;
                    if (fieldId === 'address') {
                        transcript = transcript.replace(/[^A-Za-zА-Яа-яЇїЄєІі0-9\.,\- ]/g, '');
                        transcript = transcript.replace(/\s+/g, ' ').trim();
                    } else {
                        transcript = transcript.replace(/\s/g, '');
                        transcript = transcript.replace(/[ \t\n\r\f\v\u00A0\u2028\u2029]/g, '');
                    }
                    if (input.classList.contains('seal-input')) {
                        transcript = transcript.replace(/[^A-Za-zА-Яа-яЇїЄєІі0-9\-]/g, '');
                        transcript = toUpperCaseByLanguage(transcript);
                    }
                    if (input.classList.contains('meter-input')) {
                        transcript = transcript.replace(/[^A-Za-zА-Яа-яЇїЄєІі0-9\.\-]/g, '');
                    }
                    const numericFields = ['accountNumber', 'employeeId', 'oldMeterReading', 'newMeterReading'];
                    const isNumeric = input.type === 'number' || input.type === 'tel' || 
                                      input.getAttribute('inputmode') === 'numeric' ||
                                      numericFields.includes(fieldId);
                    if (isNumeric && fieldId !== 'address') {
                        transcript = transcript.replace(/\D/g, '');
                        if (fieldId === 'accountNumber') transcript = transcript.substring(0, 10);
                    }
                    input.value = transcript;
                    const inputEvent = new Event('input', { bubbles: true });
                    input.dispatchEvent(inputEvent);
                    input.style.borderColor = '#22c55e';
                    input.style.backgroundColor = '#f0fdf4';
                    setTimeout(() => {
                        input.style.borderColor = '#e2e8f0';
                        input.style.backgroundColor = '#f8fafc';
                    }, 1000);
                    showToast(`✅ Розпізнано: ${transcript.substring(0, 30)}`);
                } catch(err) {
                    console.error('Result error:', err);
                    showToast('❌ Помилка обробки результату');
                }
            };
            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                let msg = '';
                switch(event.error) {
                    case 'not-allowed': msg = '❌ Дозвольте доступ до мікрофона'; break;
                    case 'no-speech': msg = '⚠️ Не почуто голосу. Спробуйте ще раз'; break;
                    case 'audio-capture': msg = '❌ Не вдалося отримати доступ до мікрофона'; break;
                    case 'network': msg = '❌ Помилка мережі. Перевірте інтернет'; break;
                    case 'aborted': msg = '⚠️ Розпізнавання перервано. Спробуйте ще раз'; break;
                    default: msg = `❌ Помилка: ${event.error}`;
                }
                showToast(msg);
            };
            recognition.onend = function() {
                micButtons.forEach(b => {
                    b.classList.remove('listening');
                    b.textContent = '🎤';
                });
            };
        });
    });
}

// ========== ГОЛОСОВИЙ ПОШУК ==========
function setupVoiceSearch() {
    const micSearchButtons = document.querySelectorAll('.btn-mic-search');
    micSearchButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) { showToast('❌ Поле не знайдено'); return; }
            const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            if (!hasSpeech) { showToast('❌ Голосове введення не підтримується'); return; }
            if (this.classList.contains('listening')) return;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'uk-UA';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            this.classList.add('listening');
            this.textContent = '⏺';
            try { recognition.start(); } catch(err) {
                this.classList.remove('listening');
                this.textContent = '🎤';
                showToast('❌ Помилка запуску мікрофона');
                return;
            }
            recognition.onstart = function() { showToast('🎤 Скажіть запит для пошуку...'); };
            recognition.onresult = function(event) {
                try {
                    let transcript = event.results[0][0].transcript;
                    transcript = transcript.replace(/\s/g, '');
                    input.value = transcript;
                    const inputEvent = new Event('input', { bubbles: true });
                    input.dispatchEvent(inputEvent);
                    input.style.borderColor = '#22c55e';
                    input.style.backgroundColor = '#f0fdf4';
                    setTimeout(() => {
                        input.style.borderColor = '#e2e8f0';
                        input.style.backgroundColor = '#f8fafc';
                    }, 1000);
                    showToast(`✅ Розпізнано: ${transcript.substring(0, 30)}`);
                } catch(err) { console.error('Result error:', err); }
            };
            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                let msg = '';
                switch(event.error) {
                    case 'not-allowed': msg = '❌ Дозвольте доступ до мікрофона'; break;
                    case 'no-speech': msg = '⚠️ Не почуто голосу. Спробуйте ще раз'; break;
                    case 'aborted': msg = '⚠️ Розпізнавання перервано'; break;
                    default: msg = `❌ Помилка: ${event.error}`;
                }
                showToast(msg);
            };
            recognition.onend = function() {
                micSearchButtons.forEach(b => {
                    b.classList.remove('listening');
                    b.textContent = '🎤';
                });
            };
        });
    });
}

// ========== ГОЛОСОВИЙ ВИБІР ЗІ СПИСКУ ==========
function setupVoiceSelect() {
    const selectMicButtons = document.querySelectorAll('.btn-mic-select');
    selectMicButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('data-target');
            const select = document.getElementById(targetId);
            if (!select) { showToast('❌ Список не знайдено'); return; }
            const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            if (!hasSpeech) { showToast('❌ Голосове введення не підтримується'); return; }
            if (this.classList.contains('listening')) return;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'uk-UA';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            this.classList.add('listening');
            this.textContent = '⏺';
            try { recognition.start(); } catch(err) {
                this.classList.remove('listening');
                this.textContent = '🎤';
                showToast('❌ Помилка запуску мікрофона');
                return;
            }
            recognition.onstart = function() { showToast('🎤 Назвіть тип лічильника...'); };
            recognition.onresult = function(event) {
                try {
                    let transcript = event.results[0][0].transcript;
                    transcript = transcript.replace(/\s/g, '').toLowerCase();
                    let found = false, foundIndex = -1, foundValue = '', foundText = '';
                    for (let i = 0; i < select.options.length; i++) {
                        const optionText = select.options[i].text.replace(/\s/g, '').toLowerCase();
                        if (optionText === transcript || transcript === optionText) {
                            found = true; foundIndex = i; foundValue = select.options[i].value; foundText = select.options[i].text;
                            break;
                        }
                    }
                    if (!found) {
                        let bestMatch = 0;
                        for (let i = 1; i < select.options.length; i++) {
                            const optionText = select.options[i].text.replace(/\s/g, '').toLowerCase();
                            let matchCount = 0;
                            for (let j = 0; j < Math.min(transcript.length, optionText.length); j++) {
                                if (transcript[j] === optionText[j]) matchCount++;
                            }
                            if (matchCount > bestMatch && matchCount >= 3) {
                                bestMatch = matchCount;
                                found = true; foundIndex = i; foundValue = select.options[i].value; foundText = select.options[i].text;
                            }
                        }
                    }
                    if (found && foundIndex > 0) {
                        select.selectedIndex = foundIndex;
                        select.value = foundValue;
                        const changeEvent = new Event('change', { bubbles: true });
                        select.dispatchEvent(changeEvent);
                        select.style.borderColor = '#22c55e';
                        select.style.backgroundColor = '#f0fdf4';
                        setTimeout(() => {
                            select.style.borderColor = '#e2e8f0';
                            select.style.backgroundColor = '#f8fafc';
                        }, 1000);
                        showToast(`✅ Вибрано: ${foundText}`);
                        select.dataset.selectedValue = foundValue;
                        select.dataset.selectedText = foundText;
                    } else {
                        showToast(`⚠️ Не знайдено: "${transcript}"`);
                    }
                } catch(err) {
                    console.error('Result error:', err);
                    showToast('❌ Помилка обробки');
                }
            };
            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                let msg = '';
                switch(event.error) {
                    case 'not-allowed': msg = '❌ Дозвольте доступ до мікрофона'; break;
                    case 'no-speech': msg = '⚠️ Не почуто голосу. Спробуйте ще раз'; break;
                    case 'aborted': msg = '⚠️ Розпізнавання перервано'; break;
                    default: msg = `❌ Помилка: ${event.error}`;
                }
                showToast(msg);
            };
            recognition.onend = function() {
                selectMicButtons.forEach(b => {
                    b.classList.remove('listening');
                    b.textContent = '🎤';
                });
            };
        });
    });
}

// ========== АВТОМАТИЧНЕ ОЧИЩЕННЯ ==========
function setupAutoClean() {
    const allInputs = document.querySelectorAll('input:not([type="hidden"])');
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            const fieldId = this.id;
            if (fieldId === 'address') {
                this.value = this.value.replace(/\s+/g, ' ').trim();
                return;
            }
            const numericFields = ['accountNumber', 'employeeId', 'oldMeterReading', 'newMeterReading'];
            const isNumeric = this.type === 'number' || this.type === 'tel' || 
                              this.getAttribute('inputmode') === 'numeric' ||
                              numericFields.includes(fieldId);
            if (isNumeric) {
                this.value = this.value.replace(/\s/g, '').replace(/\D/g, '');
            } else if (this.classList.contains('seal-input')) {
                this.value = this.value.replace(/\s/g, '');
                this.value = normalizeSealNumber(this.value);
            } else if (this.classList.contains('meter-input')) {
                this.value = this.value.replace(/\s/g, '');
                this.value = normalizeMeterNumber(this.value);
            } else {
                this.value = this.value.replace(/\s/g, '');
            }
        });
    });
}

// ========== AI ФУНКЦІЇ ==========
function setupAI() {
    const enableBtn = document.getElementById('enableAIBtn');
    const disableBtn = document.getElementById('disableAIBtn');
    const statusText = document.getElementById('aiStatusText');
    
    if (enableBtn) {
        enableBtn.addEventListener('click', function() {
            useAI = true;
            if (statusText) {
                statusText.textContent = 'УВІМКНЕНО 🤖';
                statusText.className = 'ai-on';
            }
            showToast('🤖 AI режим увімкнено!');
        });
    }
    
    if (disableBtn) {
        disableBtn.addEventListener('click', function() {
            useAI = false;
            if (statusText) {
                statusText.textContent = 'ВИМКНЕНО';
                statusText.className = 'ai-off';
            }
            showToast('📝 Звичайний режим увімкнено');
        });
    }
}

// ========== AI АНАЛІЗ ТЕКСТУ ==========
const OPENAI_API_KEY = "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";

async function analyzeWithAI(text) {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
        console.warn('⚠️ API ключ не налаштовано. Використовуйте звичайний парсинг.');
        return null;
    }
    
    const prompt = `
Проаналізуй текст з акта технічної перевірки лічильника електроенергії.
Витягни структуровані дані у форматі JSON:

Текст:
"""
${text}
"""

Поверни ТІЛЬКИ JSON без пояснень у такому форматі:
{
    "date": "дата виконання роботи (ДД.ММ.РРРР)",
    "oldMeterType": "тип знятого лічильника",
    "newMeterType": "тип встановленого лічильника",
    "oldMeterNumber": "номер знятого лічильника",
    "oldMeterReading": "покази знятого лічильника (тільки цифри)",
    "newMeterNumber": "номер встановленого лічильника",
    "newMeterReading": "покази встановленого лічильника (тільки цифри)",
    "accountNumber": "особовий рахунок (10 цифр)",
    "address": "адреса",
    "reason": "підстава для заміни",
    "oldSealCover": "пломба клемна кришка (знята)",
    "oldSealVKP": "пломба ВКП (знята)",
    "newSealCover": "пломба клемна кришка (встановлена)",
    "newSealVKP": "пломба ВКП (встановлена)"
}

Якщо якесь поле не знайдено, залиш порожнім.
`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'Ти асистент для аналізу технічних документів. Повертай тільки JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error('OpenAI API помилка:', data.error);
            return null;
        }
        
        const result = data.choices[0].message.content;
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch (error) {
        console.error('AI помилка:', error);
        return null;
    }
}

// ========== ЗАПОВНЕННЯ ПОЛІВ З AI ==========
function fillFieldsFromAI(data) {
    console.log('📊 Дані від AI:', data);
    
    const fieldMap = {
        'date': 'workDate',
        'oldMeterType': 'oldMeterType',
        'newMeterType': 'newMeterType',
        'oldMeterNumber': 'oldMeterNumber',
        'oldMeterReading': 'oldMeterReading',
        'newMeterNumber': 'newMeterNumber',
        'newMeterReading': 'newMeterReading',
        'accountNumber': 'accountNumber',
        'address': 'address',
        'reason': 'replacementReason',
        'oldSealCover': 'oldSealCover',
        'oldSealVKP': 'oldSealVKP',
        'newSealCover': 'newSealCover',
        'newSealVKP': 'newSealVKP'
    };
    
    for (const [aiField, appField] of Object.entries(fieldMap)) {
        const value = data[aiField];
        if (value) {
            const field = document.getElementById(appField);
            if (field && !field.value) {
                field.value = value;
                console.log(`✅ Заповнено ${appField}: ${value}`);
            }
        }
    }
}

// ========== OCR (РОЗПІЗНАВАННЯ ТЕКСТУ З ФОТО) ==========
function setupOCR() {
    const ocrBtn = document.getElementById('ocrFromPhotoBtn');
    if (ocrBtn) {
        ocrBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openFilePicker('*');
        });
    }
    
    const galleryBtn = document.getElementById('ocrFromGalleryBtn');
    if (galleryBtn) {
        galleryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openFilePicker('image/*');
        });
    }
    
    const cameraBtn = document.getElementById('ocrFromCameraBtn');
    if (cameraBtn) {
        cameraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCamera();
        });
    }
}

function openFilePicker(acceptType) {
    if (typeof Tesseract === 'undefined') {
        alert('❌ Бібліотека Tesseract не завантажена. Перевірте інтернет.');
        return;
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = acceptType || 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.click();
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) {
            document.body.removeChild(fileInput);
            return;
        }
        processImageFile(file);
        document.body.removeChild(fileInput);
    };
}

function openCamera() {
    if (typeof Tesseract === 'undefined') {
        alert('❌ Бібліотека Tesseract не завантажена. Перевірте інтернет.');
        return;
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.capture = 'environment';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.click();
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) {
            document.body.removeChild(fileInput);
            return;
        }
        processImageFile(file);
        document.body.removeChild(fileInput);
    };
}

function processImageFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageData = event.target.result;
        showOCRModal(imageData, function() {
            startOCRWithAI(imageData);
        });
    };
    reader.readAsDataURL(file);
}

function showOCRModal(imageData, onConfirm) {
    const oldModal = document.querySelector('.ocr-modal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'ocr-modal';
    modal.innerHTML = `
        <div class="ocr-modal-content">
            <h3>📷 Розпізнавання тексту</h3>
            <p>Перевірте фото та підтвердіть розпізнавання</p>
            <img src="${imageData}" class="preview-image" alt="Попередній перегляд">
            <div class="modal-buttons">
                <button class="btn-modal-confirm">✅ Розпізнати</button>
                <button class="btn-modal-cancel">❌ Скасувати</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelector('.btn-modal-confirm').addEventListener('click', function() {
        modal.remove();
        if (onConfirm) onConfirm();
    });
    
    modal.querySelector('.btn-modal-cancel').addEventListener('click', function() {
        modal.remove();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function startOCRWithAI(imageData) {
    const ocrBtn = document.getElementById('ocrFromPhotoBtn');
    const galleryBtn = document.getElementById('ocrFromGalleryBtn');
    const cameraBtn = document.getElementById('ocrFromCameraBtn');
    
    showToast('⏳ Розпізнавання тексту...');
    
    if (ocrBtn) { ocrBtn.textContent = '⏳ РОЗПІЗНАЄТЬСЯ...'; ocrBtn.disabled = true; ocrBtn.style.opacity = '0.6'; }
    if (galleryBtn) { galleryBtn.disabled = true; galleryBtn.style.opacity = '0.6'; }
    if (cameraBtn) { cameraBtn.disabled = true; cameraBtn.style.opacity = '0.6'; }
    
    Tesseract.recognize(imageData, 'ukr+eng', {
        logger: function(m) {
            if (m.status === 'recognizing text') {
                console.log(`Прогрес: ${Math.round(m.progress * 100)}%`);
            }
        }
    }).then(async function(result) {
        const text = result.data.text;
        console.log('=== РОЗПІЗНАНИЙ ТЕКСТ ===');
        console.log(text);
        
        if (text.length < 3) {
            showToast('⚠️ Текст не розпізнано. Спробуйте чіткіше фото.');
            restoreButtons(ocrBtn, galleryBtn, cameraBtn);
            return;
        }
        
        let filled = false;
        
        if (useAI) {
            showToast('🤖 AI аналізує текст...');
            if (ocrBtn) ocrBtn.textContent = '🤖 AI АНАЛІЗУЄ...';
            
            const aiData = await analyzeWithAI(text);
            if (aiData) {
                fillFieldsFromAI(aiData);
                filled = true;
                showToast('✅ Поля заповнено за допомогою AI!');
            } else {
                showToast('⚠️ AI не зміг розпізнати. Використовуємо звичайний парсинг.');
                filled = parseAndFillFields(text);
            }
        } else {
            filled = parseAndFillFields(text);
        }
        
        if (filled) {
            showToast('✅ Поля заповнено!');
        } else {
            showToast('⚠️ Не вдалося розпізнати дані. Спробуйте чіткіше фото.');
        }
        
        restoreButtons(ocrBtn, galleryBtn, cameraBtn);
    }).catch(function(err) {
        console.error('OCR помилка:', err);
        alert('❌ Помилка розпізнавання: ' + err.message);
        restoreButtons(ocrBtn, galleryBtn, cameraBtn);
    });
}

function restoreButtons(ocrBtn, galleryBtn, cameraBtn) {
    if (ocrBtn) { ocrBtn.textContent = '📷 РОЗПІЗНАТИ З ФОТО'; ocrBtn.disabled = false; ocrBtn.style.opacity = '1'; }
    if (galleryBtn) { galleryBtn.disabled = false; galleryBtn.style.opacity = '1'; }
    if (cameraBtn) { cameraBtn.disabled = false; cameraBtn.style.opacity = '1'; }
}

// ========== ПАРСИНГ РОЗПІЗНАНОГО ТЕКСТУ ==========
function parseAndFillFields(text) {
    if (!text || text.length < 3) {
        console.log('❌ Текст занадто короткий');
        return false;
    }

    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 1);

    console.log('📋 Рядки для парсингу:', lines);
    let foundAny = false;

    // 1. Особовий рахунок
    if (accountNumber && !accountNumber.value) {
        for (let line of lines) {
            const oyeMatch = line.match(/oye\s*(\d{9,10})/i);
            if (oyeMatch) {
                accountNumber.value = oyeMatch[1];
                foundAny = true;
                console.log(`📋 Особовий (oye): ${oyeMatch[1]}`);
                showToast(`📋 Особовий: ${oyeMatch[1]}`);
                break;
            }
            const digitsMatch = line.match(/\b(\d{9,10})\b/);
            if (digitsMatch && digitsMatch[1].length >= 9) {
                accountNumber.value = digitsMatch[1];
                foundAny = true;
                console.log(`📋 Особовий (цифри): ${digitsMatch[1]}`);
                showToast(`📋 Особовий: ${digitsMatch[1]}`);
                break;
            }
        }
    }

    // 2. Адреса
    if (address && !address.value) {
        for (let line of lines) {
            if (line.includes('Героїв') || line.includes('вул') || line.includes('буд') || line.includes('кв') || 
                line.includes('просп') || line.includes('пров') || line.includes('будинок')) {
                address.value = line;
                foundAny = true;
                console.log(`📍 Адреса: ${line}`);
                showToast(`📍 Адреса: ${line}`);
                break;
            }
        }
    }

    // 3. Номер знятого лічильника
    if (oldMeterNumber && !oldMeterNumber.value) {
        for (let line of lines) {
            const numberMatch = line.match(/номер\s*[\s\/]*(\d{6,8})/i);
            if (numberMatch) {
                oldMeterNumber.value = numberMatch[1];
                foundAny = true;
                console.log(`🔢 Номер знятого: ${numberMatch[1]}`);
                showToast(`🔢 Номер знятого: ${numberMatch[1]}`);
                break;
            }
            const digitsMatch = line.match(/\b(\d{6,8})\b/);
            if (digitsMatch && digitsMatch[1].length >= 6) {
                oldMeterNumber.value = digitsMatch[1];
                foundAny = true;
                console.log(`🔢 Номер знятого (цифри): ${digitsMatch[1]}`);
                showToast(`🔢 Номер знятого: ${digitsMatch[1]}`);
                break;
            }
        }
    }

    // 4. Покази знятого лічильника
    if (oldMeterReading && !oldMeterReading.value) {
        for (let line of lines) {
            const readingMatch = line.match(/показ[иі]\s*[\(\)\-]*\s*(\d{5,10})/i);
            if (readingMatch) {
                oldMeterReading.value = readingMatch[1];
                foundAny = true;
                console.log(`📊 Покази знятого: ${readingMatch[1]}`);
                showToast(`📊 Покази знятого: ${readingMatch[1]}`);
                break;
            }
            const tableMatch = line.match(/[\|\s]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*/);
            if (tableMatch) {
                const reading = tableMatch.slice(1).join('');
                if (reading.length >= 5) {
                    oldMeterReading.value = reading;
                    foundAny = true;
                    console.log(`📊 Покази знятого (таблиця): ${reading}`);
                    showToast(`📊 Покази знятого: ${reading}`);
                    break;
                }
            }
        }
    }

    // 5. Номер встановленого лічильника
    if (newMeterNumber && !newMeterNumber.value) {
        for (let line of lines) {
            const tableMatch = line.match(/[\|\s]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*(\d)[\s\|]*/);
            if (tableMatch) {
                const number = tableMatch.slice(1).join('');
                if (number.length >= 5) {
                    newMeterNumber.value = number;
                    foundAny = true;
                    console.log(`🔢 Номер встановленого (таблиця): ${number}`);
                    showToast(`🔢 Номер встановленого: ${number}`);
                    break;
                }
            }
        }
    }

    // 6. Пломби
    if (oldSealCover && !oldSealCover.value) {
        for (let line of lines) {
            if (line.includes('Держспоживстандарту') || line.includes('відбиток') || line.includes('пломби')) {
                const sealMatch = line.match(/\b(\d{6,12})\b/);
                if (sealMatch) {
                    oldSealCover.value = sealMatch[1];
                    foundAny = true;
                    console.log(`🔒 Пломба кл. кришка (знята): ${sealMatch[1]}`);
                    showToast(`🔒 Пломба кл. кришка: ${sealMatch[1]}`);
                    break;
                }
            }
        }
    }

    if (oldSealVKP && !oldSealVKP.value) {
        for (let line of lines) {
            if (line.includes('Шафа') || line.includes('облику') || line.includes('вводний') || line.includes('автомат')) {
                const sealMatch = line.match(/\b(\d{6,12})\b/);
                if (sealMatch) {
                    oldSealVKP.value = sealMatch[1];
                    foundAny = true;
                    console.log(`🔒 Пломба ВКП (знята): ${sealMatch[1]}`);
                    showToast(`🔒 Пломба ВКП: ${sealMatch[1]}`);
                    break;
                }
            }
        }
    }

    // 7. Копіюємо пломби для встановлених
    if (newSealCover && !newSealCover.value && oldSealCover && oldSealCover.value) {
        newSealCover.value = oldSealCover.value;
        foundAny = true;
        console.log(`🔒 Пломба кл. кришка (встановлена): ${oldSealCover.value}`);
        showToast(`🔒 Пломба кл. кришка встановлена: ${oldSealCover.value}`);
    }

    if (newSealVKP && !newSealVKP.value && oldSealVKP && oldSealVKP.value) {
        newSealVKP.value = oldSealVKP.value;
        foundAny = true;
        console.log(`🔒 Пломба ВКП (встановлена): ${oldSealVKP.value}`);
        showToast(`🔒 Пломба ВКП встановлена: ${oldSealVKP.value}`);
    }

    console.log('✅ Результат парсингу:', foundAny ? 'Знайдено дані' : 'Нічого не знайдено');
    return foundAny;
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
    let newSeal = newSealInput.value.trim();
    if (!newSeal) { alert('Введіть номер пломби'); return; }
    newSeal = normalizeSealNumber(newSeal);
    newSealInput.value = newSeal;
    const sealsToAdd = parseSealRange(newSeal);
    let addedCount = 0, addedSeals = [];
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
        const displaySeals = addedSeals.slice(0, 5);
        const more = addedSeals.length > 5 ? `... +${addedSeals.length - 5}` : '';
        showToast(`✅ Додано пломб: ${addedCount} (${displaySeals.join(', ')}${more})`);
    } else {
        showToast(`⚠️ Всі пломби вже існують`);
    }
}

// ========== БАЗА ЛІЧИЛЬНИКІВ ==========
function loadMeters() {
    const stored = localStorage.getItem('pls_meters');
    if (stored) { try { metersDB = JSON.parse(stored); } catch(e) { metersDB = []; } }
    else { metersDB = []; }
    renderMetersList();
}

function saveMeters() { localStorage.setItem('pls_meters', JSON.stringify(metersDB)); renderMetersList(); }

function renderMetersList(filter = '') {
    if (!metersListDiv) return;
    let filtered = metersDB;
    if (filter) filtered = metersDB.filter(m => m.toLowerCase().includes(filter.toLowerCase()));
    if (!filtered.length) { 
        metersListDiv.innerHTML = '<div class="empty-seals">🔢 База лічильників порожня. Додайте лічильник ➕</div>'; 
        return; 
    }
    let html = '';
    filtered.forEach(meter => {
        html += `<div class="seal-item"><span class="seal-number" data-meter="${escapeHtml(meter)}">📟 ${escapeHtml(meter)}</span><button class="delete-meter" data-meter="${escapeHtml(meter)}">🗑️</button></div>`;
    });
    metersListDiv.innerHTML = html;
    document.querySelectorAll('.seal-number[data-meter]').forEach(el => {
        el.addEventListener('click', () => {
            const meter = el.getAttribute('data-meter');
            const activeField = document.activeElement;
            if (activeField && activeField.classList && activeField.classList.contains('meter-input')) {
                activeField.value = meter;
                showToast(`✅ Лічильник додано: ${meter}`);
            }
        });
    });
    document.querySelectorAll('.delete-meter').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const meter = el.getAttribute('data-meter');
            if (confirm(`Видалити лічильник "${meter}"?`)) {
                metersDB = metersDB.filter(m => m !== meter);
                saveMeters();
                renderMetersList(meterSearch?.value || '');
                showToast(`🗑️ Лічильник видалено: ${meter}`);
            }
        });
    });
}

function addNewMeter() {
    const newMeter = newMeterInput.value.trim();
    if (!newMeter) { alert('Введіть номер лічильника'); return; }
    const normalizedMeter = normalizeMeterNumber(newMeter);
    newMeterInput.value = normalizedMeter;
    const metersToAdd = parseMeterRange(normalizedMeter);
    let addedCount = 0, addedMeters = [];
    metersToAdd.forEach(meter => {
        const normMeter = normalizeMeterNumber(meter);
        if (!metersDB.includes(normMeter)) {
            metersDB.push(normMeter);
            addedCount++;
            addedMeters.push(normMeter);
        }
    });
    saveMeters();
    newMeterInput.value = '';
    meterAddPanel.classList.add('hidden');
    if (meterSearch) meterSearch.value = '';
    renderMetersList('');
    if (addedCount > 0) {
        const displayMeters = addedMeters.slice(0, 5);
        const more = addedMeters.length > 5 ? `... +${addedMeters.length - 5}` : '';
        showToast(`✅ Додано лічильників: ${addedCount} (${displayMeters.join(', ')}${more})`);
    } else {
        showToast(`⚠️ Всі лічильники вже існують`);
    }
}

// ========== ПОШУК ==========
function showSearchResults(fieldId, query) {
    const container = document.getElementById(`${fieldId}Results`);
    if (!container) return;
    if (!query || query.length < 1) { 
        container.classList.add('hidden'); 
        container.innerHTML = ''; 
        return; 
    }
    const normalizedQuery = normalizeSealNumber(query).toLowerCase();
    const filtered = sealsDB.filter(s => {
        const normalizedSeal = normalizeSealNumber(s).toLowerCase();
        return normalizedSeal.includes(normalizedQuery);
    });
    if (!filtered.length) { container.classList.add('hidden'); return; }
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

function showMeterSearchResults(fieldId, query) {
    const container = document.getElementById(`${fieldId}Results`);
    if (!container) return;
    if (!query || query.length < 1) { 
        container.classList.add('hidden'); 
        container.innerHTML = ''; 
        return; 
    }
    const normalizedQuery = normalizeMeterNumber(query).toLowerCase();
    const filtered = metersDB.filter(m => {
        const normalizedMeter = normalizeMeterNumber(m).toLowerCase();
        return normalizedMeter.includes(normalizedQuery);
    });
    if (!filtered.length) { container.classList.add('hidden'); return; }
    container.classList.remove('hidden');
    let html = '';
    filtered.forEach(meter => { 
        html += `<div class="search-result-item" data-meter="${escapeHtml(meter)}">📟 ${escapeHtml(meter)}</div>`; 
    });
    container.innerHTML = html;
    const items = container.querySelectorAll('.search-result-item');
    items.forEach(item => {
        const oldHandler = item._clickHandler;
        if (oldHandler) item.removeEventListener('click', oldHandler);
        const handler = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const meterValue = this.getAttribute('data-meter');
            const targetInput = document.getElementById(fieldId);
            if (targetInput) {
                targetInput.value = meterValue;
                container.classList.add('hidden');
                container.innerHTML = '';
                showToast(`✅ Лічильник додано: ${meterValue}`);
            }
        };
        item._clickHandler = handler;
        item.addEventListener('click', handler);
    });
}

function setupSearch() {
    const sealInputs = document.querySelectorAll('.seal-input');
    sealInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() { showSearchResults(this.id, this.value); });
            input.addEventListener('blur', function() { setTimeout(() => hideSearchResults(this.id), 300); });
        }
    });
    const meterInputs = document.querySelectorAll('.meter-input');
    meterInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() { showMeterSearchResults(this.id, this.value); });
            input.addEventListener('blur', function() { setTimeout(() => hideSearchResults(this.id), 300); });
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
        newMeterReading: newMeterReading?.value || '0000000',
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
    if (!validateSeals() || !validateMeters()) return;
    const data = getFormData();
    workLog.unshift(data);
    saveData();
    showToast('✅ Всі дані збережено в локальний журнал!');
}

// ========== ОЧИСТКА ПОЛЕЙ ==========
function clearAllFieldsExceptEmployee() {
    const fieldsToClear = [
        workDate, replacementReason, workType, accountNumber, address, 
        oldMeterNumber, newMeterNumber, oldMeterType, newMeterType, 
        oldMeterReading, newMeterReading,
        oldSealCover, oldSealVKP, oldSealSHO1, oldSealSHO2, oldSealOpto,
        oldIMP1, oldIMP2, oldIMP3, newSealCover, newSealVKP, newSealSHO1,
        newSealSHO2, newSealOpto, newIMP1, newIMP2, newIMP3
    ];
    fieldsToClear.forEach(field => {
        if (field) {
            if (field.tagName === 'SELECT') field.value = '';
            else field.value = '';
        }
    });
    if (newMeterReading) newMeterReading.value = '0000000';
    setDefaultValues();
    showToast('✅ Всі поля очищено (табельний номер збережено)');
}

// ========== ПОШУК У ЖУРНАЛІ ==========
function searchLogByAccount() {
    const searchTerm = searchAccountInput?.value.trim().toLowerCase();
    if (!searchTerm) {
        renderLog();
        currentSearchTerm = "";
        return;
    }
    currentSearchTerm = searchTerm;
    function recordMatches(record, term) {
        const fieldsToCheck = [
            record.date, record.workType, record.employeeId, record.accountNumber,
            record.oldMeterNumber, record.newMeterNumber, record.oldMeterType, record.newMeterType,
            record.oldMeterReading, record.newMeterReading, record.address,
            record.oldSealCover, record.oldSealVKP, record.oldSealSHO1, record.oldSealSHO2,
            record.oldSealOpto, record.oldIMP1, record.oldIMP2, record.oldIMP3,
            record.newSealCover, record.newSealVKP, record.newSealSHO1, record.newSealSHO2,
            record.newSealOpto, record.newIMP1, record.newIMP2, record.newIMP3
        ];
        const removedSealsCombined = [
            record.oldSealCover, record.oldSealVKP, record.oldSealSHO1, 
            record.oldSealSHO2, record.oldSealOpto, record.oldIMP1, 
            record.oldIMP2, record.oldIMP3
        ].filter(v => v && v.trim() !== '').join(' ');
        const installedSealsCombined = [
            record.newSealCover, record.newSealVKP, record.newSealSHO1,
            record.newSealSHO2, record.newSealOpto, record.newIMP1,
            record.newIMP2, record.newIMP3
        ].filter(v => v && v.trim() !== '').join(' ');
        fieldsToCheck.push(removedSealsCombined, installedSealsCombined);
        for (let field of fieldsToCheck) {
            if (field && field.toString().toLowerCase().includes(term)) return true;
        }
        return false;
    }
    const filtered = workLog.filter(record => recordMatches(record, searchTerm));
    renderFilteredLog(filtered);
    showToast(`🔍 Знайдено ${filtered.length} запис(ів) за запитом: "${searchTerm}"`);
}

function resetSearch() {
    if (searchAccountInput) searchAccountInput.value = '';
    currentSearchTerm = "";
    renderLog();
    showToast('🔍 Пошук скинуто');
}

function renderFilteredLog(filteredLog) {
    if (!logTable) return;
    if (!filteredLog.length) {
        logTable.innerHTML = '<tr class="empty-row"><td colspan="12">Записи не знайдено</td></tr>';
        return;
    }
    let html = '';
    filteredLog.forEach((r, idx) => {
        const originalIdx = workLog.findIndex(original => original.date === r.date && original.accountNumber === r.accountNumber);
        const removedSeals = [r.oldSealCover, r.oldSealVKP, r.oldSealSHO1, r.oldSealSHO2, r.oldSealOpto, r.oldIMP1, r.oldIMP2, r.oldIMP3].filter(v => v && v.trim() !== '').join(', ');
        const installedSeals = [r.newSealCover, r.newSealVKP, r.newSealSHO1, r.newSealSHO2, r.newSealOpto, r.newIMP1, r.newIMP2, r.newIMP3].filter(v => v && v.trim() !== '').join(', ');
        html += `<tr>
            <td>${escapeHtml(r.date || '')}</td>
            <td>${escapeHtml(r.workType || '')}</td>
            <td>${escapeHtml(r.employeeId || '')}</td>
            <td>${escapeHtml(r.accountNumber || '')}</td>
            <td>${escapeHtml(r.oldMeterNumber || '')}</td>
            <td>${escapeHtml(r.oldMeterReading || '')}</td>
            <td>${escapeHtml(r.newMeterNumber || '')}</td>
            <td>${escapeHtml(r.newMeterReading || '')}</td>
            <td style="min-width:220px;">${escapeHtml(r.address || '')}</td>
            <td style="min-width:240px;"><div style="background:#fee2e2; color:#dc2626; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:600; display:inline-block; margin-bottom:6px;">🔻 Зняті</div><div style="white-space:normal; word-break:break-word;">${escapeHtml(removedSeals) || '—'}</div></td>
            <td style="min-width:240px;"><div style="background:#dcfce7; color:#16a34a; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:600; display:inline-block; margin-bottom:6px;">🔺 Встановлені</div><div style="white-space:normal; word-break:break-word;">${escapeHtml(installedSeals) || '—'}</div></td>
            <td><button class="delete-icon" data-idx="${originalIdx}" style="border:none; background:none; cursor:pointer; font-size:18px;">🗑️</button></td>
        </tr>`;
    });
    logTable.innerHTML = html;
    document.querySelectorAll('.delete-icon').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-idx'));
            if (confirm('Видалити запис?')) { workLog.splice(idx, 1); saveData(); if (currentSearchTerm) searchLogByAccount(); }
        });
    });
}

// ========== ВІДПРАВКА В ФОРМУ (З ПІДБОРОМ ДЛЯ ВСТАНОВЛЕНОГО) ==========
function sendToGoogleForm() {
    // Защита от двойного нажатия
    if (isSending) {
        showToast('⏳ Почекайте, запит вже виконується...');
        return;
    }
    
    // Получаем актуальные элементы DOM
    const workTypeEl = document.getElementById('workType');
    const employeeIdEl = document.getElementById('employeeId');
    const accountNumberEl = document.getElementById('accountNumber');
    const oldMeterTypeEl = document.getElementById('oldMeterType');
    const newMeterTypeEl = document.getElementById('newMeterType');
    const oldMeterNumberEl = document.getElementById('oldMeterNumber');
    const newMeterNumberEl = document.getElementById('newMeterNumber');
    const oldMeterReadingEl = document.getElementById('oldMeterReading');
    const newMeterReadingEl = document.getElementById('newMeterReading');
    const workDateEl = document.getElementById('workDate');
    const replacementReasonEl = document.getElementById('replacementReason');
    const addressEl = document.getElementById('address');
    const oldSealCoverEl = document.getElementById('oldSealCover');
    const oldSealVKPEl = document.getElementById('oldSealVKP');
    const oldSealSHO1El = document.getElementById('oldSealSHO1');
    const oldSealSHO2El = document.getElementById('oldSealSHO2');
    const oldSealOptoEl = document.getElementById('oldSealOpto');
    const oldIMP1El = document.getElementById('oldIMP1');
    const oldIMP2El = document.getElementById('oldIMP2');
    const oldIMP3El = document.getElementById('oldIMP3');
    const newSealCoverEl = document.getElementById('newSealCover');
    const newSealVKPEl = document.getElementById('newSealVKP');
    const newSealSHO1El = document.getElementById('newSealSHO1');
    const newSealSHO2El = document.getElementById('newSealSHO2');
    const newSealOptoEl = document.getElementById('newSealOpto');
    const newIMP1El = document.getElementById('newIMP1');
    const newIMP2El = document.getElementById('newIMP2');
    const newIMP3El = document.getElementById('newIMP3');

    // Проверяем обязательные поля
    if (!workTypeEl || !workTypeEl.value) { 
        alert('❌ Виберіть виконувану роботу'); 
        if (workTypeEl) workTypeEl.focus(); 
        return; 
    }
    if (!employeeIdEl || !employeeIdEl.value) { 
        alert('❌ Введіть табельний номер'); 
        if (employeeIdEl) employeeIdEl.focus(); 
        return; 
    }
    if (!accountNumberEl || !accountNumberEl.value || accountNumberEl.value.length !== 10) { 
        alert('❌ Введіть особовий рахунок (10 цифр)'); 
        if (accountNumberEl) accountNumberEl.focus(); 
        return; 
    }

    // Валидация пломб и личильников
    if (!validateSeals()) return;
    if (!validateMeters()) return;

    // Блокируем кнопку
    isSending = true;
    if (sendToFormBtn) {
        sendToFormBtn.disabled = true;
        sendToFormBtn.textContent = '⏳ ВІДПРАВЛЯЄТЬСЯ...';
        sendToFormBtn.style.opacity = '0.6';
    }

    try {
        // Получаем значения
        let oldMeterTypeVal = oldMeterTypeEl ? oldMeterTypeEl.value : '';
        let newMeterTypeVal = newMeterTypeEl ? newMeterTypeEl.value : '';
        let workDateVal = workDateEl ? workDateEl.value : '';
        let replacementReasonVal = replacementReasonEl ? replacementReasonEl.value : '';
        
        // ===== КЛЮЧЕВАЯ ФУНКЦИЯ: поиск значения для Google Form =====
        function findGoogleFormValue(value, fieldId) {
            if (!value) return '';
            
            // Нормализуем искомое значение
            const normalizedSearch = normalizeMeterType(value);
            console.log(`🔍 Поиск для Google Form (${fieldId}): "${value}" → нормализовано: "${normalizedSearch}"`);
            
            // Ищем точное совпадение (нормализованное)
            for (let i = 0; i < meterTypesList.length; i++) {
                const optionValue = meterTypesList[i];
                const normalizedOption = normalizeMeterType(optionValue);
                if (normalizedOption === normalizedSearch) {
                    console.log(`✅ Найдено точное совпадение: "${optionValue}"`);
                    return optionValue;
                }
            }
            
            // Ищем частичное совпадение
            for (let i = 0; i < meterTypesList.length; i++) {
                const optionValue = meterTypesList[i];
                const normalizedOption = normalizeMeterType(optionValue);
                if (normalizedOption.includes(normalizedSearch) || normalizedSearch.includes(normalizedOption)) {
                    console.log(`✅ Найдено частичное совпадение: "${optionValue}"`);
                    return optionValue;
                }
            }
            
            // Ищем по первым символам
            const shortSearch = normalizedSearch.substring(0, 8);
            for (let i = 0; i < meterTypesList.length; i++) {
                const optionValue = meterTypesList[i];
                const normalizedOption = normalizeMeterType(optionValue);
                if (normalizedOption.includes(shortSearch) || shortSearch.includes(normalizedOption.substring(0, 8))) {
                    console.log(`✅ Найдено по первым символам: "${optionValue}"`);
                    return optionValue;
                }
            }
            
            // Если ничего не нашли - возвращаем как есть
            console.log(`⚠️ Совпадение не найдено, используем: "${value}"`);
            return value;
        }
        
        // Применяем поиск для обоих полей
        let oldMeterTypeForForm = findGoogleFormValue(oldMeterTypeVal, 'entry.155422969');
        let newMeterTypeForForm = findGoogleFormValue(newMeterTypeVal, 'entry.1958360409');
        
        // Если встановленный пустой - пробуем скопировать из знятого
        if (!newMeterTypeVal && oldMeterTypeVal) {
            newMeterTypeForForm = findGoogleFormValue(oldMeterTypeVal, 'entry.1958360409');
            if (newMeterTypeForForm) {
                console.log(`🔄 Скопировано тип знятого → встановлений: "${newMeterTypeForForm}"`);
            }
        }
        
        console.log('📤 Отправка в Google Form:');
        console.log('  Тип знятого (entry.155422969):', oldMeterTypeForForm);
        console.log('  Тип встановленого (entry.1958360409):', newMeterTypeForForm);
        
        // Маппинг причин
        const reasonMap = {
            'ІП (PLC)': 'IN (PLC)',
            'Непрацюючий лічильник': 'Непрацюючий лічильник',
            'Планова заміна (протермінований)': 'Планова заміна (протермінований)',
            'Платна заміна (б/т)': 'Платна заміна (б/т)',
            'Експертиза': 'Експертиза'
        };
        replacementReasonVal = reasonMap[replacementReasonVal] || replacementReasonVal;
        
        // Форматируем дату для Google Form
        if (workDateVal) {
            const parts = workDateVal.split('.');
            if (parts.length === 3) {
                workDateVal = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }
        
        // Собираем параметры для Google Form
        const params = new URLSearchParams();
        
        // Основные поля
        if (workDateVal) params.append('entry.814427514', workDateVal);
        if (replacementReasonVal) params.append('entry.2001364225', replacementReasonVal);
        params.append('entry.1609399626', workTypeEl.value);
        params.append('entry.244962092', accountNumberEl.value);
        params.append('entry.1583379400', employeeIdEl.value);
        
        // ===== ВАЖЛИВО: отправляем ТИП ВСТАНОВЛЕНОГО =====
        if (oldMeterTypeForForm) params.append('entry.155422969', oldMeterTypeForForm);
        if (newMeterTypeForForm) params.append('entry.1958360409', newMeterTypeForForm);
        
        // Номера и показания
        if (oldMeterNumberEl && oldMeterNumberEl.value) params.append('entry.1262021573', oldMeterNumberEl.value);
        if (oldMeterReadingEl && oldMeterReadingEl.value) params.append('entry.1666715724', oldMeterReadingEl.value);
        if (newMeterNumberEl && newMeterNumberEl.value) params.append('entry.591456354', newMeterNumberEl.value);
        if (newMeterReadingEl && newMeterReadingEl.value) params.append('entry.686446183', newMeterReadingEl.value);
        
        // Пломбы (знятые)
        if (oldSealCoverEl && oldSealCoverEl.value) params.append('entry.980914247', oldSealCoverEl.value);
        if (oldSealVKPEl && oldSealVKPEl.value) params.append('entry.1281985427', oldSealVKPEl.value);
        if (oldSealSHO1El && oldSealSHO1El.value) params.append('entry.1571141896', oldSealSHO1El.value);
        if (oldSealSHO2El && oldSealSHO2El.value) params.append('entry.950038743', oldSealSHO2El.value);
        if (oldSealOptoEl && oldSealOptoEl.value) params.append('entry.1825187506', oldSealOptoEl.value);
        if (oldIMP1El && oldIMP1El.value) params.append('entry.851707833', oldIMP1El.value);
        if (oldIMP2El && oldIMP2El.value) params.append('entry.1653188291', oldIMP2El.value);
        if (oldIMP3El && oldIMP3El.value) params.append('entry.174981808', oldIMP3El.value);
        
        // Пломбы (встановленные)
        if (newSealCoverEl && newSealCoverEl.value) params.append('entry.1577377109', newSealCoverEl.value);
        if (newSealVKPEl && newSealVKPEl.value) params.append('entry.1292803469', newSealVKPEl.value);
        if (newSealSHO1El && newSealSHO1El.value) params.append('entry.1309070612', newSealSHO1El.value);
        if (newSealSHO2El && newSealSHO2El.value) params.append('entry.1176747559', newSealSHO2El.value);
        if (newSealOptoEl && newSealOptoEl.value) params.append('entry.67142835', newSealOptoEl.value);
        if (newIMP1El && newIMP1El.value) params.append('entry.245114888', newIMP1El.value);
        if (newIMP2El && newIMP2El.value) params.append('entry.1581321253', newIMP2El.value);
        if (newIMP3El && newIMP3El.value) params.append('entry.865785872', newIMP3El.value);
        
        // Адреса
        if (addressEl && addressEl.value) params.append('entry.1234567890', addressEl.value);
        
        // Формируем URL
        const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfj1wXEHe0VsHAmkIY_MWK_a9cbzDgyIPmPJ3h1lCijIwAL-A/viewform?usp=pp_url&${params.toString()}`;
        
        console.log('📤 URL форми (довжина):', formUrl.length);
        console.log('📤 Параметри:', params.toString());
        
        // Открываем форму
        window.open(formUrl, '_blank');
        
        // Сохраняем в журнал
        const data = getFormData();
        workLog.unshift(data);
        saveData();
        
        showToast('✅ Google Form відкрито!');
        alert('✅ Google Form відкрито!\n\nВсі поля заповнені автоматично.\nПеревірте та натисніть "Надіслати".');
        
    } catch (error) {
        console.error('Помилка відправки:', error);
        alert('❌ Помилка відправки: ' + error.message);
    } finally {
        // Разблокируем кнопку
        isSending = false;
        if (sendToFormBtn) {
            sendToFormBtn.disabled = false;
            sendToFormBtn.textContent = '📤 ВІДПРАВИТИ В ФОРМУ';
            sendToFormBtn.style.opacity = '1';
        }
    }
}

function openGoogleForm() {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSfj1wXEHe0VsHAmkIY_MWK_a9cbzDgyIPmPJ3h1lCijIwAL-A/viewform', '_blank');
}

// ========== ВІДПРАВКА ВСІХ ДАНИХ ВЛАСНИКУ ==========
function sendAllDataToOwner() {
    if (isSending) {
        showToast('⏳ Почекайте, запит вже виконується...');
        return;
    }
    
    if (!validateSeals() || !validateMeters()) return;
    
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
    
    isSending = true;
    const sendAllBtn = document.getElementById('sendAllBtn');
    if (sendAllBtn) {
        sendAllBtn.disabled = true;
        sendAllBtn.textContent = '⏳ ВІДПРАВЛЯЄТЬСЯ...';
        sendAllBtn.style.opacity = '0.6';
    }
    
    try {
        const data = getFormData();
        let message = '📋 **ЗВІТ ПРО РОБОТУ**\n\n';
        message += `📅 Дата виконання: ${workDate?.value || '—'}\n`;
        message += `📋 Підстава: ${replacementReason?.value || '—'}\n`;
        message += `📋 Робота: ${data.workType}\n`;
        message += `👤 Табельний: ${data.employeeId}\n`;
        message += `📋 Особовий: ${data.accountNumber}\n\n`;
        message += '🔻 **Знятий лічильник**\n';
        message += `Тип: ${data.oldMeterType || '—'}\n`;
        message += `Номер: ${data.oldMeterNumber || '—'}\n`;
        message += `Покази: ${data.oldMeterReading || '—'}\n\n`;
        message += '🔻 **Зняті пломби**\n';
        const oldSeals = [
            `кл. кришка: ${data.oldSealCover || '—'}`,
            `ВКП: ${data.oldSealVKP || '—'}`,
            `ШО (1): ${data.oldSealSHO1 || '—'}`,
            `ШО (2): ${data.oldSealSHO2 || '—'}`,
            `оптопорт: ${data.oldSealOpto || '—'}`,
            `ИМП (1): ${data.oldIMP1 || '—'}`,
            `ИМП (2): ${data.oldIMP2 || '—'}`,
            `ИМП (3): ${data.oldIMP3 || '—'}`
        ].filter(s => !s.includes('—'));
        message += oldSeals.length ? oldSeals.join('\n') : '—\n';
        message += '\n';
        message += '🔺 **Встановлений лічильник**\n';
        message += `Тип: ${data.newMeterType || '—'}\n`;
        message += `Номер: ${data.newMeterNumber || '—'}\n`;
        message += `Покази: ${data.newMeterReading || '0000000'}\n\n`;
        message += '🔺 **Встановлені пломби**\n';
        const newSeals = [
            `кл. кришка: ${data.newSealCover || '—'}`,
            `ВКП: ${data.newSealVKP || '—'}`,
            `ШО (1): ${data.newSealSHO1 || '—'}`,
            `ШО (2): ${data.newSealSHO2 || '—'}`,
            `оптопорт: ${data.newSealOpto || '—'}`,
            `ИМП (1): ${data.newIMP1 || '—'}`,
            `ИМП (2): ${data.newIMP2 || '—'}`,
            `ИМП (3): ${data.newIMP3 || '—'}`
        ].filter(s => !s.includes('—'));
        message += newSeals.length ? newSeals.join('\n') : '—\n';
        message += '\n';
        message += `📍 Адреса: ${data.address || '—'}\n`;
        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/share/url?url=${encodedMessage}`;
        window.open(telegramUrl, '_blank');
        workLog.unshift(data);
        saveData();
        showToast('📨 Дані відправлено власнику!');
    } catch (error) {
        console.error('Помилка:', error);
        alert('❌ Помилка: ' + error.message);
    } finally {
        isSending = false;
        const sendAllBtn = document.getElementById('sendAllBtn');
        if (sendAllBtn) {
            sendAllBtn.disabled = false;
            sendAllBtn.textContent = '📨 ВІДПРАВИТИ ВЛАСНИКУ';
            sendAllBtn.style.opacity = '1';
        }
    }
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
        logTable.innerHTML = '<tr class="empty-row"><td colspan="12">Немає записів</td></tr>';
        return;
    }
    let html = '';
    workLog.forEach((r, idx) => {
        const removedSeals = [r.oldSealCover, r.oldSealVKP, r.oldSealSHO1, r.oldSealSHO2, r.oldSealOpto, r.oldIMP1, r.oldIMP2, r.oldIMP3].filter(v => v && v.trim() !== '').join(', ');
        const installedSeals = [r.newSealCover, r.newSealVKP, r.newSealSHO1, r.newSealSHO2, r.newSealOpto, r.newIMP1, r.newIMP2, r.newIMP3].filter(v => v && v.trim() !== '').join(', ');
        html += `<tr>
            <td>${escapeHtml(r.date || '')}</td>
            <td>${escapeHtml(r.workType || '')}</td>
            <td>${escapeHtml(r.employeeId || '')}</td>
            <td>${escapeHtml(r.accountNumber || '')}</td>
            <td>${escapeHtml(r.oldMeterNumber || '')}</td>
            <td>${escapeHtml(r.oldMeterReading || '')}</td>
            <td>${escapeHtml(r.newMeterNumber || '')}</td>
            <td>${escapeHtml(r.newMeterReading || '')}</td>
            <td style="min-width:220px;">${escapeHtml(r.address || '')}</td>
            <td style="min-width:240px;"><div style="background:#fee2e2; color:#dc2626; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:600; display:inline-block; margin-bottom:6px;">🔻 Зняті</div><div style="white-space:normal; word-break:break-word;">${escapeHtml(removedSeals) || '—'}</div></td>
            <td style="min-width:240px;"><div style="background:#dcfce7; color:#16a34a; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:600; display:inline-block; margin-bottom:6px;">🔺 Встановлені</div><div style="white-space:normal; word-break:break-word;">${escapeHtml(installedSeals) || '—'}</div></td>
            <td><button class="delete-icon" data-idx="${idx}" style="border:none; background:none; cursor:pointer; font-size:18px;">🗑️</button></td>
        </tr>`;
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
    const headers = ['Дата','Робота','Табельний','Особовий','Знятий лічильник','Покази знятого','Встановлений лічильник','Покази встановленого','Адреса','Зняті пломби','Встановлені пломби'];
    const rows = workLog.map(r => {
        const removedSeals = [r.oldSealCover, r.oldSealVKP, r.oldSealSHO1, r.oldSealSHO2, r.oldSealOpto, r.oldIMP1, r.oldIMP2, r.oldIMP3].filter(v => v && v.trim() !== '').join(' ');
        const installedSeals = [r.newSealCover, r.newSealVKP, r.newSealSHO1, r.newSealSHO2, r.newSealOpto, r.newIMP1, r.newIMP2, r.newIMP3].filter(v => v && v.trim() !== '').join(' ');
        return [`"${r.date}"`,`"${r.workType || ''}"`,`"${r.employeeId || ''}"`,`"${r.accountNumber || ''}"`,`"${r.oldMeterNumber || ''}"`,`"${r.oldMeterReading || ''}"`,`"${r.newMeterNumber || ''}"`,`"${r.newMeterReading || ''}"`,`"${r.address || ''}"`,`"${removedSeals}"`,`"${installedSeals}"`];
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
    if (clearFieldsBtn) clearFieldsBtn.onclick = clearAllFieldsExceptEmployee;
    if (searchLogBtn) searchLogBtn.onclick = searchLogByAccount;
    if (resetSearchBtn) resetSearchBtn.onclick = resetSearch;
    
    const sendAllBtn = document.getElementById('sendAllBtn');
    if (sendAllBtn) {
        sendAllBtn.addEventListener('click', sendAllDataToOwner);
    }
    
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
                        let result = decodedText.trim();
                        result = normalizeSealNumber(result);
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
    
    const scanMeterBtn = document.getElementById('scanMeterBtn');
    if (scanMeterBtn) {
        scanMeterBtn.addEventListener('click', async () => {
            const tempContainerId = 'tempMeterScanner';
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
            tempContainer.innerHTML = `<div class="scanner-header"><span>📷 Скануйте QR код лічильника</span><button class="btn-close-scanner" id="closeTempMeterScanner">✕</button></div><div id="${tempContainerId}_reader" style="width:100%"></div>`;
            document.getElementById('closeTempMeterScanner').onclick = async () => {
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
                        let result = decodedText.trim();
                        result = smartMeterExtract(result);
                        if (newMeterInput) newMeterInput.value = result;
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
    }
    if (sealSearch) {
        sealSearch.addEventListener('input', (e) => renderSealsList(e.target.value));
    }
    
    if (addMeterBtn) {
        addMeterBtn.onclick = () => meterAddPanel.classList.toggle('hidden');
        if (confirmMeterBtn) confirmMeterBtn.onclick = addNewMeter;
    }
    if (meterSearch) {
        meterSearch.addEventListener('input', (e) => renderMetersList(e.target.value));
    }
    
    setDefaultValues();
    setupVoiceInput();
    setupAutoClean();
    setupVoiceSearch();
    setupVoiceSelect();
    setupOCR();
    setupAI();
});