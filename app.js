// ========== PIN-КОД ==========
let enteredPin = "";
let workLog = [];
let sealsDB = [];
let activeScanners = {};

// DOM
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
const addSealPhotoBtn = document.getElementById('addSealPhotoBtn');

// ========== PIN ==========
function getPinCode() {
    let pin = localStorage.getItem('pls_pin');
    if (!pin) {
        pin = "3268";
        localStorage.setItem('pls_pin', pin);
    }
    return pin;
}

function updatePinDisplay() {
    if (!pinDisplay) return;
    pinDisplay.innerText = "●●●●";
}

function pinAddNum(num) {
    if (enteredPin.length < 4) {
        enteredPin += num;
        updatePinDisplay();

        if (enteredPin.length === 4) {
            if (enteredPin === getPinCode()) {
                pinScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                loadData();
                loadSealsDB();
            } else {
                pinError.innerText = '❌ Невірний PIN';
                enteredPin = "";
            }
        }
    }
}

function pinClear() { enteredPin = ""; updatePinDisplay(); }

function pinCheck() {
    if (enteredPin === getPinCode()) {
        pinScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        loadData();
        loadSealsDB();
    } else {
        pinError.innerText = '❌ Невірний PIN';
    }
}

function pinReset() {
    localStorage.setItem('pls_pin', "3268");
    pinError.innerText = '✅ PIN: 3268';
}

// ========== OCR ==========
async function enhanceImageForOCR(file) {
    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let w = img.width;
            let h = img.height;

            if (w > 1200) {
                h *= 1200 / w;
                w = 1200;
            }

            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);

            const data = ctx.getImageData(0, 0, w, h);
            for (let i = 0; i < data.data.length; i += 4) {
                let avg = (data.data[i] + data.data[i+1] + data.data[i+2]) / 3;
                let val = avg > 140 ? 255 : 0;
                data.data[i] = data.data[i+1] = data.data[i+2] = val;
            }
            ctx.putImageData(data, 0, 0);

            canvas.toBlob(resolve, 'image/png');
        };
        img.src = url;
    });
}

async function processPhoto(file, inputId, mode) {
    const enhanced = await enhanceImageForOCR(file);

    const result = await Tesseract.recognize(enhanced, 'eng', {
        tessedit_pageseg_mode: '6',
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    });

    let text = result.data.text
        .replace(/\s/g, '')
        .replace(/[^A-Z0-9]/gi, '');

    if (mode === 'digits') text = text.substring(0, 10);
    if (mode === 'smart') text = text.substring(4, 12);

    document.getElementById(inputId).value = text;
    showToast(`📷 ${text}`);
}

async function processPhotoForSeal(file, targetInput) {
    const enhanced = await enhanceImageForOCR(file);

    const result = await Tesseract.recognize(enhanced, 'eng', {
        tessedit_pageseg_mode: '7',
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    });

    let text = result.data.text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 20);

    targetInput.value = text;
    showToast(`🔒 ${text}`);
}

// ========== ДАННЫЕ ==========
function loadData() {
    const stored = localStorage.getItem('pls_log');
    workLog = stored ? JSON.parse(stored) : [];
    renderLog();
}

function saveData() {
    localStorage.setItem('pls_log', JSON.stringify(workLog));
    renderLog();
}

function renderLog() {
    if (!workLog.length) {
        logBody.innerHTML = '<tr><td colspan="7">Немає записів</td></tr>';
        return;
    }

    logBody.innerHTML = workLog.map((r,i)=>`
        <tr>
            <td>${r.date}</td>
            <td>${r.account}</td>
            <td>${r.meter}</td>
            <td>${r.seal1}</td>
            <td>${r.seal2}</td>
            <td>${r.address}</td>
            <td onclick="deleteRow(${i})">🗑️</td>
        </tr>
    `).join('');
}

function deleteRow(i){
    workLog.splice(i,1);
    saveData();
}

// ========== СОХРАНЕНИЕ ==========
function saveRecord() {
    const account = accountInput.value.trim();
    const meter = meterInput.value.trim();

    if (!/^\d{10}$/.test(account)) return alert('10 цифр');
    if (!/^\d{8}$/.test(meter)) return alert('8 цифр');

    workLog.unshift({
        date: new Date().toLocaleString(),
        account,
        meter,
        seal1: sealCoverInput.value,
        seal2: sealOptoInput.value,
        address: addressInput.value
    });

    saveData();
    alert('✅ Збережено');
}

// ========== TOAST ==========
function showToast(msg){
    const t=document.createElement('div');
    t.textContent=msg;
    t.style='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:8px;border-radius:20px;';
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2000);
}