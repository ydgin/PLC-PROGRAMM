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
const addSealBtn = document.getElementById('add