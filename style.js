// === Змінні ===
let workLog = [];
let activeScanners = {};

// === Завантаження даних з localStorage ===
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
        // Демо-дані для прикладу
        workLog = [
            {
                id: Date.now(),
                date: new Date().toLocaleString('uk-UA'),
                account: '1234567890',
                meter: '12345678',
                sealCover: 'PL7890',
                sealOpto: 'OP5566'
            }
        ];
        saveToLocal();
    }
    renderLog();
}

// === Збереження в localStorage ===
function saveToLocal() {
    localStorage.setItem('pls_work_log', JSON.stringify(workLog));
    renderLog();
}

// === Генерація ID ===
function generateId() {
    return Date.now() + Math.random() * 10000;
}

// === Отримання поточної дати ===
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

// === Збереження запису ===
function saveRecord() {
    const account = document.getElementById('accountNumber').value.trim();
    const meter = document.getElementById('meterNumber').value.trim();
    const sealCover = document.getElementById('sealCoverNumber').value.trim();
    const sealOpto = document.getElementById('sealOptoNumber').value.trim();
    
    if (!account) {
        alert('❌ Введіть або відскануйте особовий рахунок (10 цифр)');
        return;
    }
    if (account.length !== 10 || !/^\d+$/.test(account)) {
        alert('❌ Особовий рахунок має містити рівно 10 цифр');
        return;
    }
    if (!meter) {
        alert('❌ Введіть або відскануйте номер лічильника (8 цифр)');
        return;
    }
    if (meter.length !== 8 || !/^\d+$/.test(meter)) {
        alert('❌ Номер лічильника має містити рівно 8 цифр');
        return;
    }
    if (!sealCover) {
        alert('❌ Введіть або відскануйте пломбу клемної кришки');
        return;
    }
    if (!sealOpto) {
        alert('❌ Введіть або відскануйте пломбу оптопорту');
        return;
    }
    
    const newRecord = {
        id: generateId(),
        date: getCurrentDate(),
        account: account,
        meter: meter,
        sealCover: sealCover,
        sealOpto: sealOpto
    };
    
    workLog.unshift(newRecord);
    saveToLocal();
    
    document.getElementById('accountNumber').value = '';
    document.getElementById('meterNumber').value = '';
    document.getElementById('sealCoverNumber').value = '';
    document.getElementById('sealOptoNumber').value = '';
    
    alert('✅ Роботу збережено в журнал!');
}

// === Видалення запису ===
function deleteRecord(id) {
    if (confirm('Видалити цей запис?')) {
        workLog = workLog.filter(r => r.id != id);
        saveToLocal();
    }
}

// === Очищення всього журналу ===
function clearAllLog() {
    if (confirm('⚠️ ВИДАЛИТИ ВСІ ЗАПИСИ? Це не можна скасувати.')) {
        workLog = [];
        saveToLocal();
    }
}

// === Експорт у CSV ===
function exportToCSV() {
    if (workLog.length === 0) {
        alert('Немає даних для експорту');
        return;
    }
    
    const headers = ['Дата', 'Особовий рахунок', 'Лічильник', 'Пломба (клемна кришка)', 'Пломба (оптопорт)'];
    const rows = workLog.map(r => [
        `"${r.date}"`,
        `"${r.account}"`,
        `"${r.meter}"`,
        `"${r.sealCover}"`,
        `"${r.sealOpto}"`
    ]);
    
    const csvContent = headers.join(',') + '\n' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `pls_journal_${new Date().toISOString().slice(0,19)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// === Відображення журналу ===
function renderLog() {
    const tbody = document.getElementById('logBody');
    if (!workLog.length) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Немає записів. Додайте нову роботу</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    workLog.forEach(record => {
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = record.date;
        row.insertCell(1).innerHTML = `<strong>${escapeHtml(record.account)}</strong>`;
        row.insertCell(2).innerHTML = escapeHtml(record.meter);
        row.insertCell(3).innerHTML = `<span class="badge">🔒 ${escapeHtml(record.sealCover)}</span>`;
        row.insertCell(4).innerHTML = `<span class="badge">🔒 ${escapeHtml(record.sealOpto)}</span>`;
        row.insertCell(5).innerHTML = `<span class="action-icon" onclick="deleteRecord(${record.id})" title="Видалити">🗑️</span>`;
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

// === Функції сканування QR (виправлена) ===
async function startScanner(targetId, scannerContainerId, resultDivId, inputFieldId, expectedDigits = null) {
    const container = document.getElementById(scannerContainerId);
    
    // Зупиняємо всі активні сканери
    for (let key in activeScanners) {
        if (activeScanners[key]) {
            try { await activeScanners[key].stop(); } catch(e) {}
            delete activeScanners[key];
        }
    }
    
    // Ховаємо всі контейнери сканерів
    document.querySelectorAll('.scanner-container').forEach(c => c.classList.add('hidden'));
    
    // Показуємо потрібний контейнер
    container.classList.remove('hidden');
    
    // Перевіряємо підтримку камери
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Ваш браузер не підтримує доступ до камери. Використовуйте Chrome, Safari або Firefox.');
        container.classList.add('hidden');
        return;
    }
    
    const html5QrCode = new Html5Qrcode(scannerContainerId);
    activeScanners[scannerContainerId] = html5QrCode;
    
    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };
    
    try {
        await html5QrCode.start(
            { facingMode: "environment" }, // задня камера
            config,
            (decodedText) => {
                // Успішне сканування
                let result = decodedText.trim();
                
                // Якщо очікується певна кількість цифр - фільтруємо
                if (expectedDigits && expectedDigits > 0) {
                    const digitsOnly = result.replace(/\D/g, '');
                    if (digitsOnly.length === expectedDigits) {
                        result = digitsOnly;
                    } else if (digitsOnly.length > expectedDigits) {
                        result = digitsOnly.substring(0, expectedDigits);
                    } else if (digitsOnly.length > 0) {
                        // Якщо менше цифр, але щось є - використовуємо
                        result = digitsOnly;
                    }
                }
                
                // Заповнюємо поле
                document.getElementById(inputFieldId).value = result;
                
                // Показуємо результат
                const resultDiv = document.getElementById(resultDivId);
                resultDiv.innerHTML = `✅ Відскановано: ${result}`;
                resultDiv.classList.remove('hidden');
                
                setTimeout(() => {
                    resultDiv.classList.add('hidden');
                }, 3000);
                
                // Зупиняємо сканер
                html5QrCode.stop().catch(e => console.log('Stop error:', e));
                delete activeScanners[scannerContainerId];
                container.classList.add('hidden');
            },
            (errorMessage) => {
                // Ігноруємо помилки сканування (це нормально)
                // console.log('Scan error:', errorMessage);
            }
        );
    } catch(err) {
        console.error('Scanner start error:', err);
        alert('❌ Не вдалося запустити камеру.\n\nПеревірте:\n1. Дозвіл на камеру в браузері\n2. HTTPS з'єднання\n3. Спробуйте перезавантажити сторінку');
        container.classList.add('hidden');
        delete activeScanners[scannerContainerId];
    }
}

// === Ініціалізація подій ===
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Кнопки
    document.getElementById('saveRecordBtn').addEventListener('click', saveRecord);
    document.getElementById('exportLogBtn').addEventListener('click', exportToCSV);
    document.getElementById('clearLogBtn').addEventListener('click', clearAllLog);
    
    // Кнопки сканування
    document.querySelectorAll('.btn-scan').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target');
            const digits = parseInt(btn.getAttribute('data-digits')) || 0;
            
            let scannerId, resultId, inputId;
            
            switch(target) {
                case 'account':
                    scannerId = 'accountScanner';
                    resultId = 'accountResult';
                    inputId = 'accountNumber';
                    break;
                case 'meter':
                    scannerId = 'meterScanner';
                    resultId = 'meterResult';
                    inputId = 'meterNumber';
                    break;
                case 'sealCover':
                    scannerId = 'sealCoverScanner';
                    resultId = 'sealCoverResult';
                    inputId = 'sealCoverNumber';
                    break;
                case 'sealOpto':
                    scannerId = 'sealOptoScanner';
                    resultId = 'sealOptoResult';
                    inputId = 'sealOptoNumber';
                    break;
                default: return;
            }
            
            startScanner(target, scannerId, resultId, inputId, digits);
        });
    });
    
    // Кнопки очищення полів
    document.querySelectorAll('.btn-clear-input').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = btn.getAttribute('data-target');
            if (target) {
                document.getElementById(target).value = '';
            }
        });
    });
    
    // Валідація полів (тільки цифри)
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

// Зупинка сканерів при виході
window.addEventListener('beforeunload', async () => {
    for (let key in activeScanners) {
        if (activeScanners[key]) {
            try { await activeScanners[key].stop(); } catch(e) {}
        }
    }
});

// === PWA: Реєстрація Service Worker ===
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/PLC-PROGRAMM/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW error:', err));
}

// === Підказка про встановлення на телефон ===
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Перевіряємо чи кнопка вже існує
    if (!document.getElementById('installAppBtn')) {
        const installBtn = document.createElement('button');
        installBtn.id = 'installAppBtn';
        installBtn.innerText = '📲 Встановити додаток';
        installBtn.className = 'btn btn-primary';
        installBtn.style.marginTop = '10px';
        
        const container = document.querySelector('.header-card');
        if (container) {
            container.appendChild(installBtn);
            
            installBtn.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        console.log('Користувач встановив додаток');
                    }
                    deferredPrompt = null;
                    installBtn.remove();
                }
            });
        }
    }
});