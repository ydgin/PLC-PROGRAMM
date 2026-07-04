// ========== ВСІ ТИПИ ЛІЧИЛЬНИКІВ (БЕЗ ДУБЛІКАТІВ, У ПРАВИЛЬНІЙ ПОСЛІДОВНОСТІ) ==========
const meterTypesList = [
    "AD11A.1-5-1",
    "EMH ED2500",
    "GAMMA 100 G1B",
    "GAMMA 300",
    "GROSS DDS-UA",
    "ISKRA ME162-D1A44-V12L11-M2KO",
    "ITZ",
    "Landis Gur L550",
    "Landis ZCG110ATt",
    "Landis310",
    "MCS301-CE51B 30MIS-004 000",
    "MTX 1A10.DF.2LO-C04",
    "MTX 1A10.DF.2LO-Y04",
    "MTX 1A10.DF.2ZO-CD4",
    "MTX 1A10.DF.2ZO-C04",
    "MTX 3A 10.DF.4Z1-C4",
    "MTX 3A 10.DG.4Z3-CD4",
    "MTX 3A 10.DH.4Z1-CD4",
    "NIK 2100 AP2.0000.0.11",
    "NIK 2100 AP2T.1000.C.11",
    "NIK 2100 AP2T.1002.MC.11",
    "NIK 2100 AP2T.1002.C.11",
    "NIK 2100 AP6T.1002.MC.11",
    "NIK 2100 AP6T.2000.MC.11",
    "NIK 2100 AP6T.2002.MC.11",
    "NIK 2100 AP2T.2802.MC.11",
    "NIK 2100 AP6T.2802.MC.11",
    "NIK 2100 AP6T.2902.MC.11",
    "NIK 2104 AP2T.1000.M.11",
    "NIK 2104 AP2T.1000.C.11",
    "NIK 2104 AP2T.1002.MC.11",
    "NIK 2104 AP2T.1802.MC.11",
    "NIK 2104 AP2TB.1802.M.11",
    "NIK 2104 AP6T.2602.MC.21",
    "NIK 2300 AP6T.1000.C.11",
    "NIK 2300 ARP3T.2900 MC 21",
    "NIK 2300 ATT.2900 MC 21",
    "NIK 2300 ARTT.2902.MC.11",
    "NIK 2300 AP3.2000.MC.11",
    "NIK 2300 AP3T.2000.MC.11",
    "NIK 2300 AP6T.2002.MC.11",
    "NIK 2300 AP6T.2802.MC.11",
    "NIK 2300 AP6T.2902.MC.11",
    "NIK 2301 AP3.0 0000.0.11",
    "NIK 2303 ARP3T.1202.MC.11",
    "NIK 2303 ARP3T.1802.MC.11",
    "NIK 2303 ARP6T.1002.MC.11",
    "NIK 2303 ARP6T.1800.MC.11",
    "NIK 2303 ART T.1800.MC.11",
    "NIK 2303 AT T.1800.MC.21",
    "NIK 2303 ARP3T.1802.MC.11",
    "NIK 2303 ARP3T.1802.MC.21",
    "NIK 2303 ARP6T.1802.MC.11",
    "NIK 2303 AP3T.1000.MC.11",
    "NIK 2303 AP3T.1002.MC.11",
    "NIK 2303 AP3T.1802.MC.11",
    "NIK 2303 AP3T.2000.MC.11",
    "NIK 2303 AP6T.1000.MC.11",
    "NIK 2303 AP6T.1000.C.11",
    "NIK 2303 AP6T.1002.MC.11",
    "NIK 2303 AP6T.1802.MC.11",
    "NIK 2303 AP6T.1802MC.21",
    "NIK 2303 AP6T.2000.MC.11",
    "NIK 2307 0.5s ARTT.1600.MC.21",
    "NIK 2307 ARP3T.1602.M.21",
    "NIK 2307 ARP3T.1602.MC.21",
    "NP-06 TD MME 1F 2S-U",
    "NP-06 TD MME 1F 3S-U",
    "ACE-3000",
    "ЛЭО",
    "ЛЭО-М1.4",
    "МЕРИДИАН ЛТЕ-1.03",
    "МЕРИДИАН ЛТЕ-1.03Т",
    "МЕРИДИАН ЛТЕ-1.03ТУ",
    "Меркурій 200",
    "Меркурій 200.02",
    "Меркурій 201",
    "Меркурій 206",
    "МЕРКУРІЙ 231 АТ-01",
    "НИК 2102-01.E2МСТ",
    "НИК 2102-01.E2МТ",
    "НИК 2102-01.E2МТ1",
    "НИК 2102-01.E2Р1",
    "НИК 2102-01.E2СТ",
    "НИК 2102-01.E2Т",
    "НИК 2102-01.E2ТР1",
    "НИК 2102-02.M1",
    "НИК 2102-02.M1В",
    "НИК 2102-02.M2",
    "НИК 2102-02.M2В",
    "НИК 2301 АП1",
    "НИК 2303 АП2",
    "НИК 2301 АП2В",
    "HIK 2102-01.E2T",
    "HIK 2102-01.E2TP1",
    "HIK 2102-02.M1",
    "HIK 2102-02.M1B",
    "HIK 2102-02.M2",
    "HIK 2102-02.M2B",
    "HIK 2301 AP1",
    "HIK 2303 AP2",
    "HIK 2301 AP2B",
    "HIK 2301 AP3",
    "HIK 2301 AP3B",
    "HIK 2303 AP2T",
    "HIK 2303 AP3T",
    "HIK 2303L AP1T",
    "HIK 2303L AP6",
    "HIK 2303L AP6T",
    "CA4-195",
    "CA4-И672п",
    "CO-193",
    "CO-197",
    "CO-197М",
    "CO-2",
    "CO-2М",
    "COEA09М",
    "CO-И446",
    "CO-И446М",
    "CO-И449",
    "CO-И449М1",
    "CO-И449М1-1",
    "CO-И449М1-2",
    "CO9-1.02/2",
    "CO9-1.02/2KPT",
    "CO9-1.02/2KT",
    "CO9-1.02/2T",
    "CO9-1.02/5KPTД",
    "CO-ЭА10Д",
    "CO-Э96705",
    "CO-Э96706",
    "СТ-ЭА05",
    "ЦЭ6807Бк",
    "ЭНЕРГОМЕРА СЕ 102М"
];

// ========== ФУНКЦІЯ ВІДПРАВКИ ВСІХ ДАНИХ ВЛАСНИКУ ==========
function sendAllDataToOwner() {
    // Перевірка обов'язкових полів
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
    
    // Збираємо всі дані
    const data = getFormData();
    
    // Формуємо текст повідомлення
    let message = '📋 **ЗВІТ ПРО РОБОТУ**\n\n';
    message += `📅 Дата: ${data.date}\n`;
    message += `📋 Робота: ${data.workType}\n`;
    message += `👤 Табельний: ${data.employeeId}\n`;
    message += `📋 Особовий: ${data.accountNumber}\n\n`;
    
    message += '🔻 **Демонтований лічильник**\n';
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
    
    // Кодуємо повідомлення для Telegram
    const encodedMessage = encodeURIComponent(message);
    
    // Відкриваємо Telegram з готовим повідомленням
    // Замініть `YOUR_BOT_TOKEN` та `YOUR_CHAT_ID` на свої
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    
    // Варіант 1: Відкриття Telegram Web
    const telegramUrl = `https://t.me/share/url?url=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
    
    // Варіант 2: Відправка через Telegram Bot API (якщо є токен)
    if (botToken !== 'YOUR_BOT_TOKEN') {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showToast('✅ Дані успішно відправлено власнику!');
            } else {
                showToast('❌ Помилка відправки: ' + data.description);
            }
        })
        .catch(err => {
            showToast('❌ Помилка: ' + err.message);
        });
    }
    
    // Зберігаємо в журнал
    workLog.unshift(data);
    saveData();
}

// ========== ДОДАТКОВА ФУНКЦІЯ ДЛЯ ГОЛОСОВОГО ПОШУКУ ==========
function setupVoiceSearch() {
    const micSearchButtons = document.querySelectorAll('.btn-mic-search');
    
    micSearchButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (!input) {
                showToast('❌ Поле не знайдено');
                return;
            }
            
            const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            if (!hasSpeech) {
                showToast('❌ Голосове введення не підтримується');
                return;
            }
            
            if (this.classList.contains('listening')) {
                return;
            }
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'uk-UA';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            
            this.classList.add('listening');
            this.textContent = '⏺';
            
            try {
                recognition.start();
            } catch(err) {
                this.classList.remove('listening');
                this.textContent = '🎤';
                showToast('❌ Помилка запуску мікрофона');
                return;
            }
            
            recognition.onstart = function() {
                showToast('🎤 Скажіть запит для пошуку...');
            };
            
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
                } catch(err) {
                    console.error('Result error:', err);
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
                micSearchButtons.forEach(b => {
                    b.classList.remove('listening');
                    b.textContent = '🎤';
                });
            };
        });
    });
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
    
    // Нова кнопка для відправки власнику
    const sendAllBtn = document.getElementById('sendAllBtn');
    if (sendAllBtn) {
        sendAllBtn.addEventListener('click', sendAllDataToOwner);
    }
    
    const openFormBtn = document.getElementById('openFormBtn');
    if (openFormBtn) {
        openFormBtn.addEventListener('click', openGoogleForm);
    }
    
    // ... решта коду ...
    
    setDefaultValues();
    setupVoiceInput();
    setupAutoClean();
    setupVoiceSearch();
});