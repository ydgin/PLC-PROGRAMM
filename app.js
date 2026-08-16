"use strict";


/* =====================================================
   PIN
===================================================== */

const CORRECT_PIN = "3268";

let enteredPin = "";

let workLog = [];

let sealsDB = [];

let metersDB = [];

let activeScanners = {};

let currentSearchTerm = "";


/* =====================================================
   DOM
===================================================== */

const $ = id => document.getElementById(id);


/* PIN */

const pinScreen = $("pinScreen");

const pinDisplay = $("pinDisplay");

const pinError = $("pinError");

const pinForgot = $("pinForgot");

const mainApp = $("mainApp");


/* =====================================================
   PIN DISPLAY
===================================================== */

function updatePinDisplay() {

    if (!pinDisplay) return;

    const dots =
        pinDisplay.querySelectorAll(".pin-dot");

    dots.forEach((dot, index) => {

        if (index < enteredPin.length) {

            dot.classList.add("active");

        } else {

            dot.classList.remove("active");

        }

    });
}


/* =====================================================
   PIN ADD
===================================================== */

function pinAddNum(num) {

    num = String(num);

    if (!/^\d$/.test(num)) return;

    if (enteredPin.length >= 4) return;

    enteredPin += num;

    updatePinDisplay();

    if (pinError) {

        pinError.textContent = "";

    }

    /*
     * Проверяем автоматически после 4 цифр
     */

    if (enteredPin.length === 4) {

        setTimeout(pinCheck, 100);

    }
}


/* =====================================================
   PIN CHECK
===================================================== */

function pinCheck() {

    if (enteredPin.length !== 4) {

        pinError.textContent =
            "Введіть 4 цифри";

        return;
    }


    if (enteredPin === CORRECT_PIN) {

        pinError.textContent = "";

        pinScreen.classList.add("hidden");

        mainApp.classList.remove("hidden");

        initApplication();

        return;
    }


    pinError.textContent =
        "❌ Невірний PIN";


    /*
     * Небольшая анимация ошибки
     */

    pinDisplay.classList.add("pin-shake");

    setTimeout(() => {

        pinDisplay.classList.remove("pin-shake");

    }, 300);


    enteredPin = "";

    updatePinDisplay();
}


/* =====================================================
   PIN CLEAR
===================================================== */

function pinClear() {

    enteredPin = "";

    updatePinDisplay();

    if (pinError) {

        pinError.textContent = "";

    }
}


/* =====================================================
   SHOW PIN
===================================================== */

function pinReset() {

    enteredPin = "";

    updatePinDisplay();

    pinError.textContent =
        "PIN: 3268";

    setTimeout(() => {

        pinError.textContent = "";

    }, 3000);
}


/* =====================================================
   PIN EVENTS
===================================================== */

function setupPin() {

    updatePinDisplay();


    document
        .querySelectorAll(".pin-btn")
        .forEach(button => {

            /*
             * pointerdown работает и на телефоне,
             * и мышью.
             */

            button.addEventListener(
                "pointerdown",
                event => {

                    event.preventDefault();

                    const value =
                        button.dataset.num;

                    if (value === "clear") {

                        pinClear();

                    } else if (value === "enter") {

                        pinCheck();

                    } else {

                        pinAddNum(value);

                    }

                }
            );

        });


    if (pinForgot) {

        pinForgot.addEventListener(
            "click",
            pinReset
        );

    }
}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const old =
        document.querySelector(".toast");

    if (old) old.remove();


    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;


    Object.assign(
        toast.style,
        {
            position: "fixed",
            left: "50%",
            bottom: "20px",
            transform: "translateX(-50%)",
            zIndex: "200000",
            background: "#16a34a",
            color: "#fff",
            padding: "11px 18px",
            borderRadius: "30px",
            boxShadow:
                "0 8px 25px rgba(0,0,0,.25)",
            maxWidth: "90%",
            textAlign: "center"
        }
    );


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.remove();

    }, 3000);
}


/* =====================================================
   ESCAPE
===================================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =====================================================
   GET FORM DATA
===================================================== */

function getFormData() {

    return {

        date:
            new Date()
                .toLocaleString("uk-UA"),

        workType:
            $("workType")?.value || "",

        employeeId:
            $("employeeId")?.value || "",

        accountNumber:
            $("accountNumber")?.value || "",

        address:
            $("address")?.value || "",

        oldMeterType:
            $("oldMeterType")?.value || "",

        oldMeterNumber:
            $("oldMeterNumber")?.value || "",

        oldMeterReading:
            $("oldMeterReading")?.value || "",

        newMeterType:
            $("newMeterType")?.value || "",

        newMeterNumber:
            $("newMeterNumber")?.value || "",

        newMeterReading:
            $("newMeterReading")?.value || "0000000",

        oldSealCover:
            $("oldSealCover")?.value || "",

        oldSealVKP:
            $("oldSealVKP")?.value || "",

        oldSealSHO1:
            $("oldSealSHO1")?.value || "",

        oldSealSHO2:
            $("oldSealSHO2")?.value || "",

        oldSealOpto:
            $("oldSealOpto")?.value || "",

        oldIMP1:
            $("oldIMP1")?.value || "",

        oldIMP2:
            $("oldIMP2")?.value || "",

        oldIMP3:
            $("oldIMP3")?.value || "",

        newSealCover:
            $("newSealCover")?.value || "",

        newSealVKP:
            $("newSealVKP")?.value || "",

        newSealSHO1:
            $("newSealSHO1")?.value || "",

        newSealSHO2:
            $("newSealSHO2")?.value || "",

        newSealOpto:
            $("newSealOpto")?.value || "",

        newIMP1:
            $("newIMP1")?.value || "",

        newIMP2:
            $("newIMP2")?.value || "",

        newIMP3:
            $("newIMP3")?.value || ""

    };
}


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "pls_log",
        JSON.stringify(workLog)
    );

    renderLog();
}


function loadData() {

    try {

        const data =
            localStorage.getItem("pls_log");

        workLog =
            data ? JSON.parse(data) : [];

        if (!Array.isArray(workLog)) {

            workLog = [];

        }

    } catch {

        workLog = [];

    }

    renderLog();
}


/* =====================================================
   SAVE RECORD
===================================================== */

function saveAllFieldsToLog() {

    const data = getFormData();


    if (
        !data.accountNumber ||
        data.accountNumber.length !== 10
    ) {

        alert(
            "Введіть особовий рахунок — 10 цифр."
        );

        $("accountNumber")?.focus();

        return;
    }


    workLog.unshift(data);

    saveData();

    showToast(
        "✅ Запис збережено в журнал"
    );
}


/* =====================================================
   CLEAR FIELDS
===================================================== */

function clearAllFields() {

    const fields = [

        "workType",
        "accountNumber",
        "address",

        "oldMeterType",
        "oldMeterNumber",
        "oldMeterReading",

        "newMeterType",
        "newMeterNumber",

        "oldSealCover",
        "oldSealVKP",
        "oldSealSHO1",
        "oldSealSHO2",
        "oldSealOpto",
        "oldIMP1",
        "oldIMP2",
        "oldIMP3",

        "newSealCover",
        "newSealVKP",
        "newSealSHO1",
        "newSealSHO2",
        "newSealOpto",
        "newIMP1",
        "newIMP2",
        "newIMP3"

    ];


    fields.forEach(id => {

        const field = $(id);

        if (field) {

            field.value = "";

        }

    });


    if ($("newMeterReading")) {

        $("newMeterReading").value =
            "0000000";

    }


    showToast(
        "🗑️ Поля очищено"
    );
}


/* =====================================================
   CSV
===================================================== */

function csvEscape(value) {

    return `"${String(value ?? "")
        .replace(/"/g, '""')}"`;
}


function exportCSV() {

    if (!workLog.length) {

        alert("Журнал порожній.");

        return;
    }


    const headers = [

        "Дата",
        "Робота",
        "Табельний",
        "Особовий рахунок",
        "Знятий лічильник",
        "Покази знятого",
        "Встановлений лічильник",
        "Покази встановленого",
        "Адреса",
        "Зняті пломби",
        "Встановлені пломби"

    ];


    const rows =
        workLog.map(record => {

            const oldSeals = [

                record.oldSealCover,
                record.oldSealVKP,
                record.oldSealSHO1,
                record.oldSealSHO2,
                record.oldSealOpto,
                record.oldIMP1,
                record.oldIMP2,
                record.oldIMP3

            ]
                .filter(Boolean)
                .join(" ");


            const newSeals = [

                record.newSealCover,
                record.newSealVKP,
                record.newSealSHO1,
                record.newSealSHO2,
                record.newSealOpto,
                record.newIMP1,
                record.newIMP2,
                record.newIMP3

            ]
                .filter(Boolean)
                .join(" ");


            return [

                record.date,
                record.workType,
                record.employeeId,
                record.accountNumber,
                record.oldMeterNumber,
                record.oldMeterReading,
                record.newMeterNumber,
                record.newMeterReading,
                record.address,
                oldSeals,
                newSeals

            ].map(csvEscape).join(",");

        });


    const csv =
        "\uFEFF" +
        headers.map(csvEscape).join(",") +
        "\n" +
        rows.join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "pls_log_" +
        new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/:/g, "-") +
        ".csv";


    link.click();


    URL.revokeObjectURL(url);
}


/* =====================================================
   RENDER LOG
===================================================== */

function renderLog(list = workLog) {

    const table = $("logTable");

    if (!table) return;


    if (!list.length) {

        table.innerHTML = `

            <tr class="empty-row">

                <td colspan="11">
                    Немає записів
                </td>

            </tr>

        `;

        return;
    }


    table.innerHTML =
        list.map((record, index) => {

            const oldSeals = [

                record.oldSealCover,
                record.oldSealVKP,
                record.oldSealSHO1,
                record.oldSealSHO2,
                record.oldSealOpto,
                record.oldIMP1,
                record.oldIMP2,
                record.oldIMP3

            ]
                .filter(Boolean)
                .join(", ");


            const newSeals = [

                record.newSealCover,
                record.newSealVKP,
                record.newSealSHO1,
                record.newSealSHO2,
                record.newSealOpto,
                record.newIMP1,
                record.newIMP2,
                record.newIMP3

            ]
                .filter(Boolean)
                .join(", ");


            const originalIndex =
                workLog.indexOf(record);


            return `

                <tr>

                    <td>
                        ${escapeHtml(record.date)}
                    </td>

                    <td>
                        ${escapeHtml(record.workType)}
                    </td>

                    <td>
                        ${escapeHtml(record.employeeId)}
                    </td>

                    <td>
                        ${escapeHtml(record.accountNumber)}
                    </td>

                    <td>
                        ${escapeHtml(record.oldMeterNumber)}
                    </td>

                    <td>
                        ${escapeHtml(record.oldMeterReading)}
                    </td>

                    <td>
                        ${escapeHtml(record.newMeterNumber)}
                    </td>

                    <td>
                        ${escapeHtml(record.newMeterReading)}
                    </td>

                    <td>
                        ${escapeHtml(record.address)}
                    </td>

                    <td>
                        <b>Зняті:</b>
                        ${escapeHtml(oldSeals || "—")}

                        <br><br>

                        <b>Встановлені:</b>
                        ${escapeHtml(newSeals || "—")}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="delete-log"
                            data-index="${originalIndex}"
                        >
                            🗑️
                        </button>

                    </td>

                </tr>

            `;

        }).join("");


    table
        .querySelectorAll(".delete-log")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(button.dataset.index);

                    if (
                        confirm(
                            "Видалити цей запис?"
                        )
                    ) {

                        workLog.splice(
                            index,
                            1
                        );

                        saveData();

                    }

                }
            );

        });
}


/* =====================================================
   SEARCH
===================================================== */

function searchLog() {

    const query =
        $("searchAccountInput")
            ?.value
            .trim()
            .toLowerCase();


    if (!query) {

        renderLog();

        return;
    }


    const result =
        workLog.filter(record => {

            return Object
                .values(record)
                .join(" ")
                .toLowerCase()
                .includes(query);

        });


    renderLog(result);


    showToast(
        `🔍 Знайдено: ${result.length}`
    );
}


/* =====================================================
   SEALS DATABASE
===================================================== */

function loadSeals() {

    try {

        const data =
            localStorage.getItem(
                "pls_seals"
            );

        sealsDB =
            data ? JSON.parse(data) : [];

        if (!Array.isArray(sealsDB)) {

            sealsDB = [];

        }

    } catch {

        sealsDB = [];

    }


    renderSealsList();
}


function saveSeals() {

    localStorage.setItem(
        "pls_seals",
        JSON.stringify(sealsDB)
    );

    renderSealsList();
}


function renderSealsList(filter = "") {

    const container =
        $("sealsList");

    if (!container) return;


    const query =
        filter.toLowerCase();


    const list =
        sealsDB.filter(item =>
            item.toLowerCase()
                .includes(query)
        );


    if (!list.length) {

        container.innerHTML = `

            <div style="
                padding:20px;
                text-align:center;
                color:#94a3b8;
            ">
                База пломб порожня
            </div>

        `;

        return;
    }


    container.innerHTML =
        list.map(seal => `

            <div class="database-item">

                <span class="database-number">
                    🔒 ${escapeHtml(seal)}
                </span>

                <button
                    type="button"
                    class="database-delete"
                    data-seal="${escapeHtml(seal)}"
                >
                    🗑️
                </button>

            </div>

        `).join("");


    container
        .querySelectorAll(".database-delete")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const seal =
                        button.dataset.seal;

                    if (
                        confirm(
                            `Видалити пломбу ${seal}?`
                        )
                    ) {

                        sealsDB =
                            sealsDB.filter(
                                item =>
                                    item !== seal
                            );

                        saveSeals();

                    }

                }
            );

        });
}


/* =====================================================
   RANGE
===================================================== */

function parseRange(value) {

    const match =
        value.match(
            /^([A-Za-zА-Яа-яІіЇїЄє0-9]*?)(\d+)-(\d+)$/
        );


    if (!match) {

        return [value];

    }


    const prefix =
        match[1];

    const start =
        Number(match[2]);

    const end =
        Number(match[3]);


    if (start > end) {

        return [value];

    }


    const result = [];


    for (
        let i = start;
        i <= end;
        i++
    ) {

        result.push(
            prefix + i
        );

    }


    return result;
}


/* =====================================================
   ADD SEAL
===================================================== */

function addNewSeal() {

    const input =
        $("newSealInput");

    const value =
        input.value.trim();


    if (!value) {

        alert(
            "Введіть номер пломби."
        );

        return;
    }


    const values =
        parseRange(value);


    let added = 0;


    values.forEach(item => {

        if (!sealsDB.includes(item)) {

            sealsDB.push(item);

            added++;

        }

    });


    saveSeals();


    input.value = "";

    $("sealAddPanel")
        ?.classList
        .add("hidden");


    showToast(
        `✅ Додано пломб: ${added}`
    );
}


/* =====================================================
   METERS DATABASE
===================================================== */

function loadMeters() {

    try {

        const data =
            localStorage.getItem(
                "pls_meters"
            );

        metersDB =
            data ? JSON.parse(data) : [];

        if (!Array.isArray(metersDB)) {

            metersDB = [];

        }

    } catch {

        metersDB = [];

    }


    renderMetersList();
}


function saveMeters() {

    localStorage.setItem(
        "pls_meters",
        JSON.stringify(metersDB)
    );

    renderMetersList();
}


function renderMetersList(filter = "") {

    const container =
        $("metersList");

    if (!container) return;


    const query =
        filter.toLowerCase();


    const list =
        metersDB.filter(item =>
            item.toLowerCase()
                .includes(query)
        );


    if (!list.length) {

        container.innerHTML = `

            <div style="
                padding:20px;
                text-align:center;
                color:#94a3b8;
            ">
                База лічильників порожня
            </div>

        `;

        return;
    }


    container.innerHTML =
        list.map(meter => `

            <div class="database-item">

                <span class="database-number">
                    🔢 ${escapeHtml(meter)}
                </span>

                <button
                    type="button"
                    class="database-delete"
                    data-meter="${escapeHtml(meter)}"
                >
                    🗑️
                </button>

            </div>

        `).join("");


    container
        .querySelectorAll(".database-delete")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const meter =
                        button.dataset.meter;

                    if (
                        confirm(
                            `Видалити лічильник ${meter}?`
                        )
                    ) {

                        metersDB =
                            metersDB.filter(
                                item =>
                                    item !== meter
                            );

                        saveMeters();

                    }

                }
            );

        });
}


/* =====================================================
   ADD METER
===================================================== */

function addNewMeter() {

    const input =
        $("newMeterInput");

    const value =
        input.value.trim();


    if (!value) {

        alert(
            "Введіть номер лічильника."
        );

        return;
    }


    const values =
        parseRange(value);


    let added = 0;


    values.forEach(item => {

        if (!metersDB.includes(item)) {

            metersDB.push(item);

            added++;

        }

    });


    saveMeters();


    input.value = "";

    $("meterAddPanel")
        ?.classList
        .add("hidden");


    showToast(
        `✅ Додано лічильників: ${added}`
    );
}


/* =====================================================
   QR
===================================================== */

async function stopScanner(id) {

    const scanner =
        activeScanners[id];

    if (!scanner) return;


    try {

        await scanner.stop();

    } catch {}

    try {

        await scanner.clear();

    } catch {}


    delete activeScanners[id];
}


function extractDigits(text, max = 10) {

    return String(text || "")
        .replace(/\D/g, "")
        .slice(0, max);
}


function extractMeter(text) {

    const digits =
        String(text || "")
            .replace(/\D/g, "");


    if (digits.length <= 8) {

        return digits;

    }


    /*
     * Для QR, где вокруг номера есть
     * дополнительные цифры.
     */

    return digits.slice(0, 8);
}


async function startQrScanner(
    containerId,
    inputId,
    mode
) {

    const container =
        $(containerId);


    if (!container) {

        return;
    }


    if (activeScanners[containerId]) {

        await stopScanner(
            containerId
        );

        container.classList.add(
            "hidden"
        );

        return;
    }


    /*
     * Закрываем другие камеры.
     */

    for (
        const id in activeScanners
    ) {

        await stopScanner(id);

        $(id)?.classList.add(
            "hidden"
        );

    }


    container.classList.remove(
        "hidden"
    );


    container.innerHTML = `

        <div class="scanner-header">

            <span>
                📷 Наведіть камеру на QR
            </span>

            <button
                type="button"
                class="btn-close-scanner"
                id="${containerId}Close"
            >
                ✕
            </button>

        </div>

        <div
            id="${containerId}Reader"
        ></div>

    `;


    $(`${containerId}Close`)
        ?.addEventListener(
            "click",
            async () => {

                await stopScanner(
                    containerId
                );

                container.classList.add(
                    "hidden"
                );

            }
        );


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        alert(
            "QR-бібліотека не завантажилась."
        );

        return;
    }


    const reader =
        new Html5Qrcode(
            `${containerId}Reader`
        );


    activeScanners[containerId] =
        reader;


    try {

        await reader.start(

            {
                facingMode: "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 260,
                    height: 260
                }
            },

            async decodedText => {

                let result =
                    decodedText.trim();


                if (mode === "digits") {

                    result =
                        extractDigits(
                            result,
                            10
                        );

                } else if (
                    mode === "smart"
                ) {

                    result =
                        extractMeter(
                            result
                        );

                }


                const input =
                    $(inputId);


                if (input) {

                    input.value =
                        result;

                    input.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                await stopScanner(
                    containerId
                );


                container.classList.add(
                    "hidden"
                );


                showToast(
                    `✅ QR: ${result}`
                );

            },

            () => {}

        );

    } catch (error) {

        console.error(
            "QR error:",
            error
        );


        alert(
            "❌ Не вдалося запустити камеру.\n\n" +
            "Перевірте дозвіл на камеру."
        );


        await stopScanner(
            containerId
        );


        container.classList.add(
            "hidden"
        );

    }
}


/* =====================================================
   VOICE
===================================================== */

function setupVoice() {

    document
        .querySelectorAll(".btn-mic")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset.target;

                    const input =
                        $(target);


                    if (!input) return;


                    const SpeechRecognition =
                        window.SpeechRecognition ||
                        window.webkitSpeechRecognition;


                    if (!SpeechRecognition) {

                        alert(
                            "Голосове введення не підтримується."
                        );

                        return;
                    }


                    const recognition =
                        new SpeechRecognition();


                    recognition.lang =
                        "uk-UA";

                    recognition.continuous =
                        false;

                    recognition.interimResults =
                        false;


                    button.classList.add(
                        "listening"
                    );


                    recognition.onresult =
                        event => {

                            let text =
                                event
                                    .results[0][0]
                                    .transcript;


                            if (
                                target ===
                                "address"
                            ) {

                                text =
                                    text
                                        .replace(
                                            /\s+/g,
                                            " "
                                        )
                                        .trim();

                            } else {

                                text =
                                    text.replace(
                                        /\s/g,
                                        ""
                                    );

                            }


                            if (
                                target ===
                                    "accountNumber" ||
                                target ===
                                    "employeeId" ||
                                target ===
                                    "oldMeterReading" ||
                                target ===
                                    "newMeterReading"
                            ) {

                                text =
                                    text.replace(
                                        /\D/g,
                                        ""
                                    );

                            }


                            input.value =
                                text;


                            input.dispatchEvent(
                                new Event(
                                    "input",
                                    {
                                        bubbles: true
                                    }
                                )
                            );


                            showToast(
                                `🎤 Розпізнано: ${text}`
                            );

                        };


                    recognition.onerror =
                        event => {

                            console.error(
                                event
                            );

                            showToast(
                                "❌ Помилка голосового введення"
                            );

                        };


                    recognition.onend =
                        () => {

                            button.classList.remove(
                                "listening"
                            );

                        };


                    try {

                        recognition.start();

                    } catch (error) {

                        button.classList.remove(
                            "listening"
                        );

                    }

                }
            );

        });
}


/* =====================================================
   AUTO CLEAN
===================================================== */

function setupAutoClean() {

    document
        .querySelectorAll(
            "input:not([type=file])"
        )
        .forEach(input => {

            input.addEventListener(
                "input",
                () => {

                    const numeric =
                        input.id ===
                            "accountNumber" ||
                        input.id ===
                            "employeeId" ||
                        input.id ===
                            "oldMeterReading" ||
                        input.id ===
                            "newMeterReading";


                    if (numeric) {

                        input.value =
                            input.value
                                .replace(
                                    /\D/g,
                                    ""
                                );

                    }

                }
            );

        });
}


/* =====================================================
   GOOGLE FORM
===================================================== */

function sendToGoogleForm() {

    const data =
        getFormData();


    if (
        !data.accountNumber ||
        data.accountNumber.length !== 10
    ) {

        alert(
            "Введіть особовий рахунок — 10 цифр."
        );

        return;
    }


    const params =
        new URLSearchParams();


    /*
     * Эти entry ID сохранены
     * из предыдущей версии проекта.
     */

    params.append(
        "entry.1609399626",
        data.workType
    );

    params.append(
        "entry.244962092",
        data.accountNumber
    );

    params.append(
        "entry.1583379400",
        data.employeeId
    );


    if (data.oldMeterType) {

        params.append(
            "entry.155422969",
            data.oldMeterType
        );

    }


    if (data.oldMeterNumber) {

        params.append(
            "entry.1262021573",
            data.oldMeterNumber
        );

    }


    if (data.oldMeterReading) {

        params.append(
            "entry.1666715724",
            data.oldMeterReading
        );

    }


    const oldSeals = {

        oldSealCover:
            "entry.980914247",

        oldSealVKP:
            "entry.1281985427",

        oldSealSHO1:
            "entry.1571141896",

        oldSealSHO2:
            "entry.950038743",

        oldSealOpto:
            "entry.1825187506",

        oldIMP1:
            "entry.851707833",

        oldIMP2:
            "entry.1653188291",

        oldIMP3:
            "entry.174981808"

    };


    Object.entries(oldSeals)
        .forEach(
            ([field, entry]) => {

                if (data[field]) {

                    params.append(
                        entry,
                        data[field]
                    );

                }

            }
        );


    if (data.newMeterType) {

        params.append(
            "entry.1958360409",
            data.newMeterType
        );

    }


    if (data.newMeterNumber) {

        params.append(
            "entry.591456354",
            data.newMeterNumber
        );

    }


    if (data.newMeterReading) {

        params.append(
            "entry.686446183",
            data.newMeterReading
        );

    }


    const newSeals = {

        newSealCover:
            "entry.1577377109",

        newSealVKP:
            "entry.1292803469",

        newSealSHO1:
            "entry.1309070612",

        newSealSHO2:
            "entry.1176747559",

        newSealOpto:
            "entry.67142835",

        newIMP1:
            "entry.245114888",

        newIMP2:
            "entry.1581321253",

        newIMP3:
            "entry.865785872"

    };


    Object.entries(newSeals)
        .forEach(
            ([field, entry]) => {

                if (data[field]) {

                    params.append(
                        entry,
                        data[field]
                    );

                }

            }
        );


    if (data.address) {

        params.append(
            "entry.1234567890",
            data.address
        );

    }


    const url =
        "https://docs.google.com/forms/d/e/" +
        "1FAIpQLSfj1wXEHe0VsHAmkIY_MWK_a9cbzDgyIPmPJ3h1lCijIwAL-A/" +
        "viewform?usp=pp_url&" +
        params.toString();


    console.log(
        "Google Form URL:",
        url
    );


    window.open(
        url,
        "_blank"
    );


    workLog.unshift(data);

    saveData();


    showToast(
        "✅ Google Form відкрито"
    );
}


/* =====================================================
   TELEGRAM SHARE
===================================================== */

function sendAllDataToOwner() {

    const data =
        getFormData();


    if (
        !data.accountNumber ||
        data.accountNumber.length !== 10
    ) {

        alert(
            "Введіть особовий рахунок — 10 цифр."
        );

        return;
    }


    const oldSeals = [

        data.oldSealCover,
        data.oldSealVKP,
        data.oldSealSHO1,
        data.oldSealSHO2,
        data.oldSealOpto,
        data.oldIMP1,
        data.oldIMP2,
        data.oldIMP3

    ]
        .filter(Boolean)
        .join(", ");


    const newSeals = [

        data.newSealCover,
        data.newSealVKP,
        data.newSealSHO1,
        data.newSealSHO2,
        data.newSealOpto,
        data.newIMP1,
        data.newIMP2,
        data.newIMP3

    ]
        .filter(Boolean)
        .join(", ");


    const message =

        "📋 ЗВІТ ПРО РОБОТУ\n\n" +

        `📅 Дата: ${data.date}\n` +

        `📋 Робота: ${data.workType}\n` +

        `👤 Табельний: ${data.employeeId}\n` +

        `📋 Особовий: ${data.accountNumber}\n\n` +

        "🔻 ЗНЯТИЙ ЛІЧИЛЬНИК\n" +

        `Тип: ${data.oldMeterType || "—"}\n` +

        `Номер: ${data.oldMeterNumber || "—"}\n` +

        `Покази: ${data.oldMeterReading || "—"}\n\n` +

        `Пломби: ${oldSeals || "—"}\n\n` +

        "🔺 ВСТАНОВЛЕНИЙ ЛІЧИЛЬНИК\n" +

        `Тип: ${data.newMeterType || "—"}\n` +

        `Номер: ${data.newMeterNumber || "—"}\n` +

        `Покази: ${data.newMeterReading || "—"}\n\n` +

        `Пломби: ${newSeals || "—"}\n\n` +

        `📍 Адреса: ${data.address || "—"}`;


    const url =
        "https://t.me/share/url?text=" +
        encodeURIComponent(message);


    window.open(
        url,
        "_blank"
    );


    workLog.unshift(data);

    saveData();


    showToast(
        "📤 Звіт підготовлено"
    );
}


/* =====================================================
   EVENTS
===================================================== */

function setupButtons() {


    $("saveRecordBtn")
        ?.addEventListener(
            "click",
            saveAllFieldsToLog
        );


    $("sendToFormBtn")
        ?.addEventListener(
            "click",
            sendToGoogleForm
        );


    $("sendAllBtn")
        ?.addEventListener(
            "click",
            sendAllDataToOwner
        );


    $("clearFieldsBtn")
        ?.addEventListener(
            "click",
            clearAllFields
        );


    $("exportBtn")
        ?.addEventListener(
            "click",
            exportCSV
        );


    $("clearLogBtn")
        ?.addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Видалити весь журнал?"
                    )
                ) {

                    workLog = [];

                    saveData();

                }

            }
        );


    $("searchLogBtn")
        ?.addEventListener(
            "click",
            searchLog
        );


    $("resetSearchBtn")
        ?.addEventListener(
            "click",
            () => {

                $("searchAccountInput")
                    .value = "";

                renderLog();

            }
        );


    $("addSealBtn")
        ?.addEventListener(
            "click",
            () => {

                $("sealAddPanel")
                    ?.classList
                    .toggle("hidden");

            }
        );


    $("confirmSealBtn")
        ?.addEventListener(
            "click",
            addNewSeal
        );


    $("sealSearch")
        ?.addEventListener(
            "input",
            event => {

                renderSealsList(
                    event.target.value
                );

            }
        );


    $("addMeterBtn")
        ?.addEventListener(
            "click",
            () => {

                $("meterAddPanel")
                    ?.classList
                    .toggle("hidden");

            }
        );


    $("confirmMeterBtn")
        ?.addEventListener(
            "click",
            addNewMeter
        );


    $("meterSearch")
        ?.addEventListener(
            "input",
            event => {

                renderMetersList(
                    event.target.value
                );

            }
        );


    /*
     * QR buttons
     */

    document
        .querySelectorAll(".btn-scan")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const inputId =
                        button.dataset.target;

                    const mode =
                        button.dataset.mode ||
                        "text";


                    startQrScanner(
                        inputId +
                        "Scanner",

                        inputId,

                        mode
                    );

                }
            );

        });

}


/* =====================================================
   APPLICATION INIT
===================================================== */

let applicationInitialized = false;


function initApplication() {

    if (applicationInitialized) {

        return;
    }


    applicationInitialized = true;


    loadData();

    loadSeals();

    loadMeters();

    setupButtons();

    setupVoice();

    setupAutoClean();

    /*
     * OCR запускается из ocr.js
     */

    if (
        typeof setupOCR ===
        "function"
    ) {

        setupOCR();

    }


    if ($("newMeterReading")) {

        $("newMeterReading").value =
            "0000000";

    }

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPin();

    }
);