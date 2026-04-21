// ========== PIN-КОД ЗБЕРІГАЄТЬСЯ ТІЛЬКИ В localStorage ==========
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
            const correctPin = getPinCode();
            if (enteredPin === correctPin) {
                pinScreen.style.display = 'none';
                mainApp.classList.remove('hidden');
                loadData();
                loadSealsDB();
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
        pinError.innerText = '❌ Введіть 4 цифри';
        return;
    }
    const correctPin = getPinCode();
    if (enteredPin === correctPin) {
        pinScreen.style.display = 'none';
        mainApp.classList.remove('hidden');
        loadData();
        loadSealsDB();
    } else {
        pinError.innerText = '❌ Невірний PIN';
        enteredPin = "";
        updatePinDisplay();
    }
}

function pinReset() {
    const newPin = "3268";
    localStorage.setItem('pls_pin', newPin);
    enteredPin = "";
    updatePinDisplay();
    pinError.innerText = '✅ PIN скинуто до 3268';
    setTimeout(function() {
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
        sealsDB = [];
        saveSealsDB();
    }
    renderSealsList();
}

function saveSealsDB() {
    localStorage.setItem('pls_seals', JSON.stringify(sealsDB));
    renderSealsList();
}

function renderSealsList(filterText) {
    filterText = filterText || '';
    if (!sealList) return;
    let filtered = [...sealsDB];
    if (filterText) {
        filtered = sealsDB.filter(function(seal) {
            return seal.toLowerCase().includes(filterText.toLowerCase());
        });
    }
    if (filtered.length === 0) {
        sealList.innerHTML = '<div class="empty-seals">Немає пломб у базі. Додайте першу пломбу ➕</div>';
        return;
    }
    let html = '';
    for (var i = 0; i < filtered.length; i++) {
        var seal = filtered[i];
        html += '<div class="seal-item">' +
                    '<span class="seal-number" data-seal="' + escapeHtml(seal) + '">🔒 ' + escapeHtml(seal) + '</span>' +
                    '<button class="delete-seal" data-seal="' + escapeHtml(seal) + '">🗑️</button>' +
                '</div>';
    }
    sealList.innerHTML = html;
    
    var sealNumbers = document.querySelectorAll('.seal-number');
    for (var j = 0; j < sealNumbers.length; j++) {
        sealNumbers[j].addEventListener('click', function() {
            var seal = this.getAttribute('data-seal');
            var activeInput = document.activeElement;
            if (activeInput && activeInput.classList && activeInput.classList.contains('seal-input')) {
                activeInput.value = seal;
            }
        });
    }
    
    var deleteSeals = document.querySelectorAll('.delete-seal');
    for (var k = 0; k < deleteSeals.length; k++) {
        deleteSeals[k].addEventListener('click', function(e) {
            e.stopPropagation();
            var seal = this.getAttribute('data-seal');
            if (confirm('Видалити пломбу "' + seal + '"?')) {
                sealsDB = sealsDB.filter(function(s) { return s !== seal; });
                saveSealsDB();
                renderSealsList(sealSearchFilter ? sealSearchFilter.value : '');
            }
        });
    }
}

function addNewSeal() {
    var newSeal = newSealNumber.value.trim();
    if (!newSeal) { alert('Введіть номер пломби'); return; }
    if (sealsDB.includes(newSeal)) { alert('Така пломба вже існує'); return; }
    sealsDB.push(newSeal);
    saveSealsDB();
    newSealNumber.value = '';
    sealAddForm.classList.add('hidden');
    if (sealSearchFilter) sealSearchFilter.value = '';
    renderSealsList('');
}

// ========== ПОШУК ПЛОМБ У ПОЛЯХ ==========
function showSearchResults(inputId, query) {
    var resultsContainer = document.getElementById(inputId + 'SearchResults');
    if (!resultsContainer) return;
    
    if (!query || query.length < 1) {
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
    }
    
    var filtered = sealsDB.filter(function(seal) {
        return seal.toLowerCase().includes(query.toLowerCase());
    });
    if (filtered.length === 0) {
        resultsContainer.classList.add('hidden');
        return;
    }
    
    resultsContainer.classList.remove('hidden');
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var seal = filtered[i];
        html += '<div class="search-result-item" data-seal="' + escapeHtml(seal) + '">🔒 ' + escapeHtml(seal) + '</div>';
    }
    resultsContainer.innerHTML = html;
    
    var resultItems = resultsContainer.querySelectorAll('.search-result-item');
    for (var j = 0; j < resultItems.length; j++) {
        resultItems[j].addEventListener('click', function() {
            var seal = this.getAttribute('data-seal');
            var targetInput = document.getElementById(inputId);
            if (targetInput) {
                targetInput.value = seal;
                resultsContainer.classList.add('hidden');
                targetInput.style.borderColor = '#22c55e';
                setTimeout(function() {
                    targetInput.style.borderColor = '#d1d5db';
                }, 500);
            }
        });
    }
}

function hideSearchResults(inputId) {
    var resultsContainer = document.getElementById(inputId + 'SearchResults');
    if (resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
}

// ========== РОБОТА З ДАНИМИ ==========
function loadData() {
    var stored = localStorage.getItem('pls_log');
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
    var html = '';
    for (var i = 0; i < workLog.length; i++) {
        var r = workLog[i];
        html += '<tr>' +
                    '<td>' + escapeHtml(r.date) + '</td>' +
                    '<td><strong>' + escapeHtml(r.account) + '</strong></td>' +
                    '<td>' + escapeHtml(r.meter) + '</td>' +
                    '<td><span class="badge">🔒 ' + escapeHtml(r.seal1) + '</span></td>' +
                    '<td><span class="badge">🔒 ' + escapeHtml(r.seal2) + '</span></td>' +
                    '<td>' + escapeHtml(r.address) + '</td>' +
                    '<td><span class="delete-icon" data-index="' + i + '">🗑️</span></td>' +
                '</tr>';
    }
    logBody.innerHTML = html;
    
    var deleteIcons = document.querySelectorAll('.delete-icon');
    for (var j = 0; j < deleteIcons.length; j++) {
        deleteIcons[j].addEventListener('click', function() {
            var index = parseInt(this.getAttribute('data-index'));
            if (confirm('Видалити запис?')) { 
                workLog.splice(index, 1); 
                saveData(); 
            }
        });
    }
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

function smartMeterExtract(rawText) {
    var digitsOnly = rawText.replace(/\D/g, '');
    if (digitsOnly.length >= 16) return digitsOnly.substring(4, 12);
    if (digitsOnly.length >= 12) return digitsOnly.substring(4, digitsOnly.length - 4);
    if (digitsOnly.length === 8) return digitsOnly;
    return digitsOnly;
}

function digitsExtract(rawText) {
    var digitsOnly = rawText.replace(/\D/g, '');
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
    for (var scId in activeScanners) {
        await stopScanner(scId);
        var oc = document.getElementById(scId);
        if (oc) oc.classList.add('hidden');
    }
    var container = document.getElementById(containerId);
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = '<div class="scanner-header"><span>📷 Наведіть камеру на QR-код</span><button class="btn-close-scanner">✕</button></div><div id="' + containerId + '_reader" style="width:100%"></div>';
    container.querySelector('.btn-close-scanner').addEventListener('click', async function() {
        await stopScanner(containerId);
        container.classList.add('hidden');
    });
    var html5QrCode = new Html5Qrcode(containerId + '_reader');
    activeScanners[containerId] = html5QrCode;
    try {
        await html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 280, height: 280 } }, function(decodedText) {
            var result = decodedText.trim();
            if (mode === 'digits') result = digitsExtract(result);
            else if (mode === 'smart') result = smartMeterExtract(result);
            document.getElementById(inputId).value = result;
            stopScanner(containerId).then(function() { container.classList.add('hidden'); });
            showToast('✅ Відскановано: ' + result.substring(0, 30));
        });
    } catch(err) { 
        alert('❌ Не вдалося запустити камеру'); 
        container.classList.add('hidden'); 
        delete activeScanners[containerId]; 
    }
}

// ========== OCR З ФОТО ==========
function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#22c55e;color:white;padding:10px 20px;border-radius:40px;font-size:14px;z-index:2000';
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
}

function saveRecord() {
    var account = accountInput.value.trim();
    var meter = meterInput.value.trim();
    var seal1 = sealCoverInput.value.trim();
    var seal2 = sealOptoInput.value.trim();
    var addr = addressInput.value.trim();
    if (account.length !== 10) { alert('❌ Особовий рахунок має містити 10 цифр'); return; }
    if (meter.length !== 8) { alert('❌ Лічильник має містити 8 цифр'); return; }
    if (!seal1 || !seal2 || !addr) { alert('❌ Заповніть всі поля'); return; }
    workLog.unshift({ date: new Date().toLocaleString('uk-UA'), account: account, meter: meter, seal1: seal1, seal2: seal2, address: addr });
    saveData();
    accountInput.value = ""; 
    meterInput.value = ""; 
    sealCoverInput.value = ""; 
    sealOptoInput.value = ""; 
    addressInput.value = "";
    alert('✅ Роботу збережено!');
}

function exportCSV() {
    if (!workLog.length) { alert('Немає даних'); return; }
    var headers = ['Дата','Особовий рахунок','Лічильник','Пломба кришки','Пломба оптопорту','Адреса'];
    var rows = [];
    for (var i = 0; i < workLog.length; i++) {
        var r = workLog[i];
        rows.push(['"' + r.date + '"','"' + r.account + '"','"' + r.meter + '"','"' + r.seal1 + '"','"' + r.seal2 + '"','"' + r.address + '"']);
    }
    var csv = headers.join(',') + '\n';
    for (var j = 0; j < rows.length; j++) {
        csv += rows[j].join(',') + '\n';
    }
    var blob = new Blob(["\uFEFF" + csv], {type: 'text/csv'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pls_log_' + new Date().toISOString().slice(0,19) + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}

function clearLog() {
    if (confirm('⚠️ Видалити всі записи?')) { workLog = []; saveData(); alert('✅ Журнал очищено'); }
}

function setupValidation() {
    if (accountInput) {
        accountInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,10); });
    }
    if (meterInput) {
        meterInput.addEventListener('input', function() { this.value = this.value.replace(/\D/g,'').slice(0,8); });
    }
    
    if (sealCoverInput) {
        sealCoverInput.addEventListener('input', function() { 
            showSearchResults('sealCover', this.value); 
        });
        sealCoverInput.addEventListener('blur', function() { 
            setTimeout(function() { hideSearchResults('sealCover'); }, 300); 
        });
    }
    
    if (sealOptoInput) {
        sealOptoInput.addEventListener('input', function() { 
            showSearchResults('sealOpto', this.value); 
        });
        sealOptoInput.addEventListener('blur', function() { 
            setTimeout(function() { hideSearchResults('sealOpto'); }, 300); 
        });
    }
}

// ========== OCR З ФОТО ==========
async function enhanceImageForOCR(file) {
    return new Promise(function(resolve) {
        var img = new Image();
        var url = URL.createObjectURL(file);
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var width = img.width;
            var height = img.height;
            var maxSize = 1200;
            if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            var imageData = ctx.getImageData(0, 0, width, height);
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                var gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
                var threshold = 140;
                var value = gray > threshold ? 255 : 0;
                data[i] = value;
                data[i+1] = value;
                data[i+2] = value;
            }
            ctx.putImageData(imageData, 0, 0);
            canvas.toBlob(function(blob) { 
                URL.revokeObjectURL(url); 
                resolve(blob); 
            }, 'image/jpeg', 0.95);
        };
        img.src = url;
    });
}

async function processPhoto(file, inputId, mode) {
    var statusDiv = document.createElement('div');
    statusDiv.textContent = '⏳ Обробка зображення...';
    statusDiv.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1f2937;color:white;padding:8px 16px;border-radius:40px;font-size:12px;z-index:2000';
    document.body.appendChild(statusDiv);
    try {
        statusDiv.textContent = '⏳ Покращення зображення...';
        var enhancedBlob = await enhanceImageForOCR(file);
        statusDiv.textContent = '⏳ Розпізнавання тексту...';
        
        var resultObj = await Tesseract.recognize(enhancedBlob, 'ukr+eng', {
            logger: function(m) { console.log(m); },
            tessedit_pageseg_mode: '6'
        });
        var text = resultObj.data.text;
        var result = text.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        
        if (mode === 'digits') {
            var digitsOnly = result.replace(/\D/g, '');
            result = digitsExtract(digitsOnly);
        } else if (mode === 'smart') {
            var digitsOnly = result.replace(/\D/g, '');
            result = smartMeterExtract(digitsOnly);
        }
        
        document.getElementById(inputId).value = result;
        var shortResult = result.length > 40 ? result.substring(0, 40) + '...' : result;
        statusDiv.textContent = '✅ Розпізнано: ' + shortResult;
        setTimeout(function() { statusDiv.remove(); }, 3000);
        showToast('📷 Розпізнано: ' + shortResult);
    } catch(err) {
        console.error('OCR помилка:', err);
        statusDiv.textContent = '❌ Помилка розпізнавання';
        setTimeout(function() { statusDiv.remove(); }, 3000);
        alert('❌ Не вдалося розпізнати текст. Спробуйте краще фото.');
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
document.addEventListener("DOMContentLoaded", function() {
    updatePinDisplay();
    setupValidation();
    
    // PIN кнопки
    var pinBtns = document.querySelectorAll(".pin-btn");
    for (var i = 0; i < pinBtns.length; i++) {
        pinBtns[i].addEventListener('click', function(e) {
            e.stopPropagation();
            var num = this.getAttribute('data-num');
            if (num === "clear") {
                pinClear();
            } else if (num === "enter") {
                pinCheck();
            } else {
                pinAddNum(num);
            }
        });
    }
    
    var pinForgot = document.getElementById("pinForgot");
    if (pinForgot) pinForgot.onclick = pinReset;
    
    // Головні кнопки
    if (saveBtn) saveBtn.onclick = saveRecord;
    if (exportBtn) exportBtn.onclick = exportCSV;
    if (clearLogBtn) clearLogBtn.onclick = clearLog;
    
    // База пломб
    if (addSealBtn) {
        addSealBtn.onclick = function() { sealAddForm.classList.toggle('hidden'); };
        if (confirmAddSealBtn) confirmAddSealBtn.onclick = addNewSeal;
        if (cancelAddSealBtn) cancelAddSealBtn.onclick = function() { sealAddForm.classList.add('hidden'); };
    }
    if (sealSearchFilter) {
        sealSearchFilter.addEventListener('input', function(e) { renderSealsList(e.target.value); });
    }
    
    // QR сканер
    var cameraBtns = document.querySelectorAll(".btn-camera-icon");
    for (var j = 0; j < cameraBtns.length; j++) {
        cameraBtns[j].addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('data-target');
            var mode = this.getAttribute('data-mode');
            var scannerId;
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
    }
    
    // Фото/OCR
    var photoBtns = document.querySelectorAll(".btn-photo-icon");
    for (var k = 0; k < photoBtns.length; k++) {
        photoBtns[k].addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('data-target');
            var mode = this.getAttribute('data-mode');
            
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.capture = 'environment';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);
            
            fileInput.onchange = async function(event) {
                var file = event.target.files[0];
                if (file) {
                    await processPhoto(file, target, mode);
                }
                fileInput.remove();
            };
            fileInput.click();
        });
    }
});