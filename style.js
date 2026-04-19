/* === ГЛОБАЛЬНО === */
let workLog = [];
let activeScanner = null;

let pinCode = localStorage.getItem('pls_pin') || "3268";
let enteredPin = "";

/* === PIN === */
function updatePinDisplay() {
const display = document.getElementById('pinDisplay');
if (!display) return;

```
display.innerText = "●".repeat(enteredPin.length);
```

}

function checkPin() {
const error = document.getElementById('pinError');

```
if (enteredPin === pinCode) {
    document.getElementById('pinScreen').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
    loadData();
} else {
    error.innerText = "❌ Невірний PIN";
    navigator.vibrate?.(200);
    enteredPin = "";
    updatePinDisplay();
}
```

}

function pinReset() {
pinCode = "3268";
localStorage.setItem('pls_pin', pinCode);
enteredPin = "";
updatePinDisplay();

```
const error = document.getElementById('pinError');
error.innerText = "✅ PIN скинуто (3268)";
setTimeout(() => error.innerText = "", 2000);
```

}

/* === DATA === */
function loadData() {
workLog = JSON.parse(localStorage.getItem('pls_log') || "[]");
renderLog();
}

function saveData() {
localStorage.setItem('pls_log', JSON.stringify(workLog));
renderLog();
}

/* === SAVE === */
function saveRecord() {
const account = accountNumber.value.trim();
const meter = meterNumber.value.trim();
const seal1 = sealCoverNumber.value.trim();
const seal2 = sealOptoNumber.value.trim();
const address = address.value.trim();

```
if (account.length !== 10) return alert("10 цифр рахунку");
if (meter.length !== 8) return alert("8 цифр лічильника");
if (!seal1 || !seal2 || !address) return alert("Заповніть всі поля");

workLog.unshift({
    date: new Date().toLocaleString(),
    account, meter, seal1, seal2, address
});

saveData();

accountNumber.value = "";
meterNumber.value = "";
sealCoverNumber.value = "";
sealOptoNumber.value = "";
address.value = "";
```

}

/* === TABLE === */
function renderLog() {
const tbody = document.getElementById('logBody');
tbody.innerHTML = "";

```
if (!workLog.length) {
    tbody.innerHTML = `<tr><td colspan="6">Немає записів</td></tr>`;
    return;
}

workLog.forEach(r => {
    tbody.innerHTML += `
    <tr>
        <td>${r.date}</td>
        <td>${r.account}</td>
        <td>${r.meter}</td>
        <td>${r.seal1}</td>
        <td>${r.seal2}</td>
        <td>${r.address}</td>
    </tr>`;
});
```

}

/* === CSV === */
function exportCSV() {
if (!workLog.length) return alert("Немає даних");

```
const csv = workLog.map(r =>
    `${r.date},${r.account},${r.meter},${r.seal1},${r.seal2},${r.address}`
).join("\n");

const blob = new Blob(["\uFEFF" + csv]);
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = "pls_log.csv";
a.click();
```

}

/* === CLEAR === */
function clearLog() {
if (confirm("Видалити все?")) {
workLog = [];
saveData();
}
}

/* === QR СКАНЕР === */
async function startQrScanner(containerId, inputId, digits = 0) {

```
if (activeScanner) {
    await activeScanner.stop().catch(()=>{});
    activeScanner = null;
}

document.querySelectorAll('.scanner-container')
    .forEach(el => el.classList.add('hidden'));

const container = document.getElementById(containerId);
container.classList.remove('hidden');

const qr = new Html5Qrcode(containerId);
activeScanner = qr;

try {
    await qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },

        (text) => {
            let result = text.trim();

            if (digits > 0) {
                result = result.replace(/\D/g, '').slice(0, digits);
            }

            document.getElementById(inputId).value = result;

            qr.stop();
            container.classList.add('hidden');
            activeScanner = null;
        }
    );
} catch (e) {
    alert("❌ Камера не працює");
    container.classList.add('hidden');
}
```

}

/* === INIT === */
document.addEventListener("DOMContentLoaded", () => {

```
updatePinDisplay();

/* PIN */
document.querySelectorAll(".pin-btn").forEach(btn => {
    btn.onclick = () => {
        const n = btn.dataset.num;

        if (n === "clear") enteredPin = enteredPin.slice(0, -1);
        else if (n === "enter") return checkPin();
        else if (enteredPin.length < 4) enteredPin += n;

        updatePinDisplay();
    };
});

document.getElementById("pinForgot").onclick = pinReset;

/* BUTTONS */
saveRecordBtn.onclick = saveRecord;
exportLogBtn.onclick = exportCSV;
clearLogBtn.onclick = clearLog;

/* QR BUTTONS */
document.querySelectorAll(".btn-scan-qr").forEach(btn => {
    btn.onclick = () => {
        const target = btn.dataset.target;
        const digits = parseInt(btn.dataset.digits) || 0;

        startQrScanner(target + "Scanner", target, digits);
    };
});

/* VALIDATION */
accountNumber.oninput = () => {
    accountNumber.value = accountNumber.value.replace(/\D/g, '').slice(0,10);
};

meterNumber.oninput = () => {
    meterNumber.value = meterNumber.value.replace(/\D/g, '').slice(0,8);
};
```

});

/* STOP CAMERA */
window.addEventListener('beforeunload', () => {
if (activeScanner) activeScanner.stop().catch(()=>{});
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}