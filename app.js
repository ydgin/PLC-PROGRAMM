/* PLS INVEST — основной script.js */

let enteredPin = '';
let workLog = [];
let activeScanners = {};

const CORRECT_PIN = '3268';


/* ================= ТИПЫ СЧЕТЧИКОВ ================= */

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


const $ = id => document.getElementById(id);


const ids = [
    'workType',
    'employeeId',
    'accountNumber',
    'address',
    'oldMeterNumber',
    'newMeterNumber',
    'oldMeterType',
    'newMeterType',
    'oldMeterReading',
    'newMeterReading',

    'oldSealCover',
    'oldSealVKP',
    'oldSealSHO1',
    'oldSealSHO2',
    'oldSealOpto',
    'oldIMP1',
    'oldIMP2',
    'oldIMP3',

    'newSealCover',
    'newSealVKP',
    'newSealSHO1',
    'newSealSHO2',
    'newSealOpto',
    'newIMP1',
    'newIMP2',
    'newIMP3'
];


const fields = Object.fromEntries(
    ids.map(id => [id, $(id)])
);


/* ================= TOAST ================= */

function showToast(msg) {

    const t = document.createElement('div');

    t.className = 'toast';

    t.textContent = msg;

    document.body.appendChild(t);

    setTimeout(() => t.remove(), 2800);
}


/* ================= HTML ================= */

function escapeHtml(s) {

    return String(s ?? '')
        .replace(/[&<>"']/g, c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c]));

}


/* ================= PIN ================= */

function updatePinDisplay() {

    const display = $('pinDisplay');

    if (!display) return;

    const dots = display.querySelectorAll('.pin-dot');

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            'active',
            index < enteredPin.length
        );

    });

    display.setAttribute(
        'aria-label',
        'PIN: ' + enteredPin.length + ' з 4'
    );
}


function openApp() {

    const screen = $('pinScreen');
    const app = $('mainApp');

    if (screen) {
        screen.style.display = 'none';
    }

    if (app) {
        app.classList.remove('hidden');
    }

    loadData();
    initMeterTypes();
    setDefaults();
    setupAutoClean();
    renderLog();

}


function pinAdd(n) {

    n = String(n);

    if (!/^\d$/.test(n)) {
        return;
    }

    if (enteredPin.length >= 4) {
        return;
    }

    enteredPin += n;

    const error = $('pinError');

    if (error) {
        error.textContent = '';
    }

    updatePinDisplay();

    if (enteredPin.length === 4) {

        setTimeout(
            pinCheck,
            80
        );

    }

}


function pinCheck() {

    if (enteredPin === CORRECT_PIN) {

        openApp();

        return;

    }

    const error = $('pinError');

    if (error) {
        error.textContent = '❌ Невірний PIN';
    }

    const card = document.querySelector('.pin-card');

    if (card) {

        card.classList.remove('pin-shake');

        void card.offsetWidth;

        card.classList.add('pin-shake');

    }

    enteredPin = '';

    setTimeout(
        updatePinDisplay,
        80
    );

}


/* ================= DEFAULT ================= */

function setDefaults() {

    if (
        fields.newMeterReading &&
        !fields.newMeterReading.value
    ) {

        fields.newMeterReading.value = '0000000';

    }

}


/* ================= TYPES ================= */

function initMeterTypes() {

    for (
        const id of [
            'oldMeterType',
            'newMeterType'
        ]
    ) {

        const select = $(id);

        if (!select) continue;

        select.innerHTML =
            '<option value="">-- Виберіть --</option>';

        meterTypesList.forEach(value => {

            const option =
                document.createElement('option');

            option.value = value;

            option.textContent = value;

            select.appendChild(option);

        });

    }

}


/* ================= AUTO CLEAN ================= */

function setupAutoClean() {

    document.querySelectorAll('input')
        .forEach(input => {

            input.addEventListener(
                'input',
                () => {

                    if (input.id === 'address') {

                        input.value =
                            input.value
                                .replace(/\s+/g, ' ')
                                .trim();

                        return;
                    }

                    if (
                        input.inputMode === 'numeric' ||
                        [
                            'employeeId',
                            'accountNumber',
                            'oldMeterReading',
                            'newMeterReading'
                        ].includes(input.id)
                    ) {

                        input.value =
                            input.value
                                .replace(/\D/g, '');

                    } else {

                        input.value =
                            input.value
                                .replace(/\s+/g, '');

                    }

                }
            );

        });

}


/* ================= QR ================= */

function digitsExtract(text) {

    return String(text)
        .replace(/\D/g, '')
        .slice(0, 10);

}


function smartMeterExtract(text) {

    const digits =
        String(text)
            .replace(/\D/g, '');

    return digits.length > 8
        ? digits.slice(0, 8)
        : digits;

}


async function stopScanner(id) {

    if (!activeScanners[id]) {
        return;
    }

    try {
        await activeScanners[id].stop();
    } catch (e) {}

    delete activeScanners[id];

}


async function startQrScanner(
    containerId,
    inputId,
    mode
) {

    if (activeScanners[containerId]) {

        await stopScanner(containerId);

        $(containerId)?.classList.add('hidden');

        return;

    }


    for (const id in activeScanners) {

        await stopScanner(id);

    }


    const container = $(containerId);

    if (!container) {
        return;
    }


    container.classList.remove('hidden');

    container.innerHTML = `
        <div class="scanner-head">
            📷 Наведіть камеру на QR
            <button
                type="button"
                class="close-scan"
            >
                ✕
            </button>
        </div>

        <div id="${containerId}_reader"></div>
    `;


    const closeButton =
        container.querySelector('.close-scan');


    if (closeButton) {

        closeButton.onclick = () => {

            stopScanner(containerId)
                .then(() =>
                    container.classList.add('hidden')
                );

        };

    }


    const reader =
        new Html5Qrcode(
            containerId + '_reader'
        );


    activeScanners[containerId] = reader;


    try {

        await reader.start(

            {
                facingMode: 'environment'
            },

            {
                fps: 10,
                qrbox: {
                    width: 260,
                    height: 180
                }
            },

            text => {

                let value = text.trim();

                if (mode === 'digits') {
                    value = digitsExtract(value);
                }

                if (mode === 'smart') {
                    value = smartMeterExtract(value);
                }

                const input = $(inputId);

                if (input) {

                    input.value = value;

                    input.dispatchEvent(
                        new Event(
                            'input',
                            { bubbles: true }
                        )
                    );

                }

                stopScanner(containerId)
                    .then(() =>
                        container.classList.add('hidden')
                    );

                showToast(
                    '✅ QR: ' + value
                );

            },

            () => {}

        );

    } catch (error) {

        alert(
            '❌ Не вдалося запустити камеру. ' +
            'Дозвольте доступ до камери.'
        );

        container.classList.add('hidden');

        delete activeScanners[containerId];

    }

}


/* ================= FORM DATA ================= */

function getFormData() {

    const date =
        new Date();

    const data = {

        date:
            date.toLocaleString('uk-UA'),

        workType:
            fields.workType?.value || '',

        employeeId:
            fields.employeeId?.value || '',

        accountNumber:
            fields.accountNumber?.value || '',

        address:
            fields.address?.value || '',

        oldMeterNumber:
            fields.oldMeterNumber?.value || '',

        newMeterNumber:
            fields.newMeterNumber?.value || '',

        oldMeterType:
            fields.oldMeterType?.value || '',

        newMeterType:
            fields.newMeterType?.value || '',

        oldMeterReading:
            fields.oldMeterReading?.value || '',

        newMeterReading:
            fields.newMeterReading?.value || ''

    };


    [

        'oldSealCover',
        'oldSealVKP',
        'oldSealSHO1',
        'oldSealSHO2',
        'oldSealOpto',
        'oldIMP1',
        'oldIMP2',
        'oldIMP3',

        'newSealCover',
        'newSealVKP',
        'newSealSHO1',
        'newSealSHO2',
        'newSealOpto',
        'newIMP1',
        'newIMP2',
        'newIMP3'

    ].forEach(id => {

        data[id] =
            $(id)?.value || '';

    });


    return data;

}


/* ================= STORAGE ================= */

function saveData() {

    localStorage.setItem(
        'pls_log',
        JSON.stringify(workLog)
    );

    renderLog();

}


function loadData() {

    try {

        workLog =
            JSON.parse(
                localStorage.getItem(
                    'pls_log'
                ) || '[]'
            );

    } catch {

        workLog = [];

    }

}


/* ================= LOG ================= */

function renderLog() {

    const table =
        $('logTable');

    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <th>Дата</th>
            <th>Робота</th>
            <th>Особовий</th>
            <th>Знятий</th>
            <th>Встановлений</th>
            <th>Адреса</th>
            <th>Дії</th>
        </tr>
    `;


    if (!workLog.length) {

        table.innerHTML += `
            <tr>
                <td
                    colspan="7"
                    class="empty"
                >
                    Немає записів
                </td>
            </tr>
        `;

        return;

    }


    workLog.forEach(
        (record, index) => {

            table.insertAdjacentHTML(
                'beforeend',
                `
                <tr>

                    <td>
                        ${escapeHtml(record.date)}
                    </td>

                    <td>
                        ${escapeHtml(record.workType)}
                    </td>

                    <td>
                        ${escapeHtml(record.accountNumber)}
                    </td>

                    <td>
                        ${escapeHtml(record.oldMeterNumber)}
                    </td>

                    <td>
                        ${escapeHtml(record.newMeterNumber)}
                    </td>

                    <td>
                        ${escapeHtml(record.address)}
                    </td>

                    <td>
                        <button
                            class="delete-icon"
                            data-i="${index}"
                        >
                            🗑️
                        </button>
                    </td>

                </tr>
                `
            );

        }
    );


    table
        .querySelectorAll('.delete-icon')
        .forEach(button => {

            button.onclick = () => {

                if (
                    confirm(
                        'Видалити запис?'
                    )
                ) {

                    workLog.splice(
                        Number(button.dataset.i),
                        1
                    );

                    saveData();

                }

            };

        });

}


/* ================= SAVE ================= */

function saveRecord() {

    const data =
        getFormData();


    if (
        !data.accountNumber ||
        data.accountNumber.length !== 10
    ) {

        alert(
            'Введіть особовий рахунок (10 цифр)'
        );

        fields.accountNumber?.focus();

        return;

    }


    workLog.unshift(data);

    saveData();

    showToast(
        '✅ Запис збережено'
    );

}


/* ================= CLEAR ================= */

function clearFields() {

    [

        'workType',
        'accountNumber',
        'address',

        'oldMeterNumber',
        'oldMeterReading',
        'oldMeterType',

        'newMeterNumber',
        'newMeterType',

        'oldSealCover',
        'oldSealVKP',
        'oldSealSHO1',
        'oldSealSHO2',
        'oldSealOpto',
        'oldIMP1',
        'oldIMP2',
        'oldIMP3',

        'newSealCover',
        'newSealVKP',
        'newSealSHO1',
        'newSealSHO2',
        'newSealOpto',
        'newIMP1',
        'newIMP2',
        'newIMP3'

    ].forEach(id => {

        const element = $(id);

        if (element) {
            element.value = '';
        }

    });


    if (fields.newMeterReading) {

        fields.newMeterReading.value =
            '0000000';

    }


    showToast(
        '🧹 Поля очищено'
    );

}


/* ================= CSV ================= */

function exportCSV() {

    if (!workLog.length) {

        alert(
            'Немає даних'
        );

        return;

    }


    const keys = [

        'date',
        'workType',
        'employeeId',
        'accountNumber',
        'address',

        'oldMeterType',
        'oldMeterNumber',
        'oldMeterReading',

        'newMeterType',
        'newMeterNumber',
        'newMeterReading',

        'oldSealCover',
        'oldSealVKP',
        'oldSealSHO1',
        'oldSealSHO2',
        'oldSealOpto',
        'oldIMP1',
        'oldIMP2',
        'oldIMP3',

        'newSealCover',
        'newSealVKP',
        'newSealSHO1',
        'newSealSHO2',
        'newSealOpto',
        'newIMP1',
        'newIMP2',
        'newIMP3'

    ];


    const csv =
        '\uFEFF' +
        keys.join(';') +
        '\n' +

        workLog
            .map(
                record =>
                    keys
                        .map(
                            key =>
                                '"' +
                                String(
                                    record[key] ?? ''
                                )
                                .replace(/"/g, '""') +
                                '"'
                        )
                        .join(';')
            )
            .join('\n');


    const link =
        document.createElement('a');

    link.href =
        URL.createObjectURL(
            new Blob(
                [csv],
                {
                    type:
                        'text/csv;charset=utf-8'
                }
            )
        );

    link.download =
        'pls_log.csv';

    link.click();

    URL.revokeObjectURL(
        link.href
    );

}


/* ================= GOOGLE FORM ================= */

function sendToGoogleForm() {

    const data =
        getFormData();


    if (!data.accountNumber) {

        alert(
            'Введіть особовий рахунок'
        );

        return;

    }


    const params =
        new URLSearchParams({
            usp: 'pp_url'
        });


    const map = {

        workType: 'entry.1609399626',

        accountNumber: 'entry.244962092',

        employeeId: 'entry.1583379400',

        oldMeterType: 'entry.155422969',

        oldMeterNumber: 'entry.1262021573',

        oldMeterReading: 'entry.1666715724',

        oldSealCover: 'entry.980914247',

        oldSealVKP: 'entry.1281985427',

        oldSealSHO1: 'entry.1571141896',

        oldSealSHO2: 'entry.950038743',

        oldSealOpto: 'entry.1825187506',

        oldIMP1: 'entry.851707833',

        oldIMP2: 'entry.1653188291',

        oldIMP3: 'entry.174981808',

        newMeterType: 'entry.1958360409',

        newMeterNumber: 'entry.591456354',

        newMeterReading: 'entry.686446183',

        newSealCover: 'entry.1577377109',

        newSealVKP: 'entry.1292803469',

        newSealSHO1: 'entry.1309070612',

        newSealSHO2: 'entry.1176747559',

        newSealOpto: 'entry.67142835',

        newIMP1: 'entry.245114888',

        newIMP2: 'entry.1581321253',

        newIMP3: 'entry.865785872',

        address: 'entry.1234567890'

    };


    Object.entries(map)
        .forEach(
            ([key, entry]) => {

                if (data[key]) {

                    params.append(
                        entry,
                        data[key]
                    );

                }

            }
        );


    window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSfj1wXEHe0VsHAmkIY_MWK_a9cbzDgyIPmPJ3h1lCijIwAL-A/viewform?' +
        params.toString(),
        '_blank'
    );

}


/* ================= ОТЧЕТ ================= */

function sendReport() {

    const data =
        getFormData();


    const text =
`📋 ЗВІТ
Дата: ${data.date}
Робота: ${data.workType}
Табельний: ${data.employeeId}
Особовий: ${data.accountNumber}
Лічильник: ${data.newMeterNumber}
Пломба кришки: ${data.newSealCover}
Пломба оптопорту: ${data.newSealOpto}
Адреса: ${data.address}`;


    window.open(
        'https://t.me/share/url?url=' +
        encodeURIComponent(text),
        '_blank'
    );

}


/* ================= START ================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const pinScreen =
            $('pinScreen');


        /*
         * ВАЖНО:
         * Используем делегирование событий.
         * Поэтому кнопки PIN работают
         * и мышью, и на телефоне.
         */

        if (pinScreen) {

            pinScreen.addEventListener(
                'click',
                event => {

                    const button =
                        event.target.closest(
                            '.pin-btn'
                        );


                    if (!button) {
                        return;
                    }


                    event.preventDefault();

                    event.stopPropagation();


                    if (
                        button.dataset.num !==
                        undefined
                    ) {

                        pinAdd(
                            button.dataset.num
                        );

                        return;

                    }


                    if (
                        button.id ===
                        'pinClear'
                    ) {

                        enteredPin = '';

                        $('pinError').textContent =
                            '';

                        updatePinDisplay();

                        return;

                    }


                    if (
                        button.id ===
                        'pinEnter'
                    ) {

                        pinCheck();

                    }

                }
            );

        }


        document
            .querySelectorAll(
                '.pin-btn[data-num]'
            )
            .forEach(button => {

                button.addEventListener(
                    'pointerdown',
                    event => {

                        event.preventDefault();

                    }
                );

            });


        $('pinForgot').onclick =
            () => {

                $('pinError').textContent =
                    'PIN: ' + CORRECT_PIN;

                setTimeout(
                    () =>
                        $('pinError').textContent =
                            '',
                    3000
                );

            };


        updatePinDisplay();


        $('saveRecordBtn').onclick =
            saveRecord;


        $('exportBtn').onclick =
            exportCSV;


        $('clearLogBtn').onclick =
            () => {

                if (
                    confirm(
                        'Очистити журнал?'
                    )
                ) {

                    workLog = [];

                    saveData();

                }

            };


        $('clearFieldsBtn').onclick =
            clearFields;


        $('sendToFormBtn').onclick =
            sendToGoogleForm;


        $('sendAllBtn').onclick =
            sendReport;


        document
            .querySelectorAll('.scan-btn')
            .forEach(button => {

                button.onclick =
                    () => {

                        const target =
                            button.dataset.target;

                        startQrScanner(
                            target + 'Scanner',
                            target,
                            button.dataset.mode
                        );

                    };

            });


        /*
         * Если контейнера сканера нет —
         * создаём автоматически.
         */

        document
            .querySelectorAll('.scan-btn')
            .forEach(button => {

                const target =
                    button.dataset.target;


                if (
                    !$(target + 'Scanner')
                ) {

                    const container =
                        document.createElement(
                            'div'
                        );

                    container.id =
                        target + 'Scanner';

                    container.className =
                        'scanner hidden';


                    $(target)
                        .closest('.input-row')
                        .after(container);

                }

            });


        if (fields.employeeId) {

            fields.employeeId.maxLength =
                10;

        }

    }
);