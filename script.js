// =================================================================
// == IPD Nurse Workbench script.js (Final Fixed & Cleaned)
// =================================================================

// ----------------------------------------------------------------
// (1) URL ของ Google Apps Script
// ----------------------------------------------------------------
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymniWtx3CC7M_Wf0QMK-I80d6A2riIDQRRMpMy3IAoGMpYw0_gFuOXMuqWjThVHFHP2g/exec";

// ----------------------------------------------------------------
// (2) Constants & Configs
// ----------------------------------------------------------------
const ADL_TASKS = ["การรับประทานอาหาร", "การทำความสะอาดปาก/ฟัน", "การแต่งตัว", "การเดิน", "การขับถ่าย", "การอาบน้ำ"];
const ADL_OPTIONS = ["ทำได้เอง", "บางส่วน", "ไม่ได้เลย", "ใช้อุปกรณ์"];

const CLASSIFY_CRITERIA = {
  "1": { title: "1. สัญญาณชีพ", 4: "ผิดปกติ โดยมีการเปลี่ยนแปลงตลอดเวลาหรือรวดเร็ว...", 3: "ผิดปกติ แต่ควบคุมได้...", 2: "ผิดปกติ แต่มีโอกาสเปลี่ยนแปลงได้ง่าย...", 1: "คงที่ มีโอกาสเปลี่ยนแปลงได้น้อย..." },
  "2": { title: "2. อาการแสดงทางระบบประสาท", 4: "มีการเปลี่ยนแปลงตลอดเวลา...", 3: "ผิดปกติ แต่ควบคุมได้...", 2: "ปกติ หรือคงที่ ที่มีโอกาสเปลี่ยนแปลง...", 1: "ปกติ หรือคงที่" },
  "3": { title: "3. การได้รับการตรวจรักษา...", 4: "มีหัตถการฉุกเฉิน...", 3: "มีหัตถการเร่งด่วน...", 2: "มีหัตถการฉุกเฉินแบบไม่ฉุกเฉิน...", 1: "มีหัตถการทั่วไป..." },
  "4": { title: "4. พฤติกรรมที่ผิดปกติ...", 4: "พฤติกรรมผิดปกติรุนแรง...", 3: "พฤติกรรมผิดปกติรุนแรง ควบคุมไม่ได้...", 2: "พฤติกรรมผิดปกติ แต่ควบคุมตนเองได้...", 1: "ไม่มีปัญหาการปรับตัว" },
  "5": { title: "5. ความสามารถในการปฏิบัติกิจวัตร...", 4: "ไม่สามารถปฏิบัติกิจวัตรประจำวันด้วยตนเอง 3 ใน 4 ข้อ...", 3: "ไม่สามารถปฏิบัติด้วยตนเอง...", 2: "สามารถช่วยเหลือตนเองได้บ้าง...", 1: "สามารถช่วยเหลือตนเองได้ทั้งหมด" },
  "6": { title: "6. ความต้องการการสนับสนุน...", 4: "กลัวและวิตกกังวลสูงมาก...", 3: "วิตกกังวลสูง...", 2: "วิตกกังวลเล็กน้อย...", 1: "ต้องการคำแนะนำทั่วไป..." },
  "7": { title: "7. ความต้องการยา...", 4: "ได้รับยาทางหลอดเลือดดำที่มีผลต่ออวัยวะที่สำคัญ...", 3: "ต้องการการปฏิบัติที่ใช้ทักษะเฉพาะ...", 2: "ได้รับยาเพื่อการรักษา...", 1: "ได้รับยาที่ใช้รักษา..." },
  "8": { title: "8. ความต้องการการบรรเทาอาการ...", 4: "ทุกข์ทรมานจากอาการรบกวนรุนแรง...", 3: "มีอาการรบกวนรุนแรง ควบคุมได้...", 2: "มีอาการรบกวนที่ควบคุมได้...", 1: "มีอาการรบกวนเล็กน้อย..." }
};

const MORSE_CRITERIA = [
  { id: "Morse_1", label: "1. ประวัติการหกล้ม (3 เดือน)", options: [{ text: "ไม่ใช่ / ไม่มีประวัติ (0)", score: 0 }, { text: "ใช่ / มีประวัติหกล้ม (25)", score: 25 }] },
  { id: "Morse_2", label: "2. การวินิจฉัยโรคมากกว่า 1 รายการ", options: [{ text: "ไม่ใช่ (0)", score: 0 }, { text: "ใช่ (15)", score: 15 }] },
  { id: "Morse_3", label: "3. การช่วยในการเคลื่อนย้าย", options: [{ text: "เดินได้เอง/ใช้รถเข็นนั่ง/นอนพักบนเตียง (0)", score: 0 }, { text: "ใช้ไม้ค้ำยัน/ไม้เท้า/Walker (15)", score: 15 }, { text: "เดินโดยการยึดเกาะเตียง/โต๊ะ/เก้าอี้ (30)", score: 30 }] },
  { id: "Morse_4", label: "4. ให้สารละลายทางหลอดเลือด/คา Heparin lock", options: [{ text: "ไม่ใช่ (0)", score: 0 }, { text: "ใช่ (20)", score: 20 }] },
  { id: "Morse_5", label: "5. การเดิน / การเคลื่อนย้าย", options: [{ text: "ปกติ / นอนพักบนเตียงโดยไม่ลุก (0)", score: 0 }, { text: "อ่อนแรงเล็กน้อยหรืออ่อนเพลีย (10)", score: 10 }, { text: "บกพร่อง ลุกนั่งลำบาก/ต้องช่วยพยุงเดิน (20)", score: 20 }] },
  { id: "Morse_6", label: "6. สภาพจิตใจ", options: [{ text: "รับรู้บุคคล เวลา สถานที่ (0)", score: 0 }, { text: "ตอบสนองไม่ตรงความจริง/ไม่รับรู้ข้อจำกัด (15)", score: 15 }] }
];

const MAAS_OPTIONS = [
  { score: 0, text: "0: ไม่ตอบสนอง" },
  { score: 1, text: "1: ตอบสนองต่อการกระตุ้นแรง ๆ" },
  { score: 2, text: "2: ตอบสนองต่อการสัมผัสและการเรียกชื่อ" },
  { score: 3, text: "3: สงบและให้ความร่วมมือ" },
  { score: 4, text: "4: พักได้น้อยและไม่ให้ความร่วมมือ" },
  { score: 5, text: "5: ไม่ให้ความร่วมมือในการรักษา/ต่อต้านการรักษา" },
  { score: 6, text: "6: ไม่ให้ความร่วมมือในการรักษา/ต่อต้านการรักษาซึ่งก่อให้เกิดอันตรายต่อผู้อื่น" }
];

const BRADEN_CRITERIA = [
    { id: "Sensory", name: "1. การรับความรู้สึก", options: [{ val: 1, text: "1.1 ไม่ตอบสนอง" }, { val: 2, text: "1.2 มี Pain Stimuli" }, { val: 3, text: "1.3 สับสน สื่อไม่ได้ทุกครั้ง" }, { val: 4, text: "1.4 ไม่มีความบกพร่อง ปกติ" }] },
    { id: "Moisture", name: "2. การเปียกชื้นของผิวหนัง", options: [{ val: 1, text: "2.1 เปียกชุ่มตลอดเวลา Diarrhea" }, { val: 2, text: "2.2 ปัสสาวะราด / อุจจาระราดบ่อยครั้ง" }, { val: 3, text: "2.3 ปัสสาวะราด / อุจจาระราดบางครั้ง" }, { val: 4, text: "2.4 ไม่เปียก/กลั้นปัสสาวะและอุจจาระได้" }] },
    { id: "Activity", name: "3. การทำกิจกรรม", options: [{ val: 1, text: "3.1 ต้องอยู่บนเตียงตลอดเวลา" }, { val: 2, text: "3.2 ทรงตัวไม่อยู่ / ต้องนั่งรถเข็น" }, { val: 3, text: "3.3 เดินได้ระยะสั้น ต้องช่วยพยุง" }, { val: 4, text: "3.4 เดินได้เอง / ทำกิจกรรมเองได้" }] },
    { id: "Mobility", name: "4. การเคลื่อนไหว", options: [{ val: 1, text: "4.1 เคลื่อนไหวเองไม่ได้" }, { val: 2, text: "4.2 เคลื่อนไหวเองได้น้อย / มีข้อติด" }, { val: 3, text: "4.3 เคลื่อนไหวเองได้ มีผู้ช่วยเหลือบางครั้ง" }, { val: 4, text: "4.4 เคลื่อนไหวเองได้ปกติ" }] },
    { id: "Nutrition", name: "5. การรับอาหาร", options: [{ val: 1, text: "5.1 NPO / กินได้ 1/3 ถาด" }, { val: 2, text: "5.2 กินได้บ้างเล็กน้อย / กินได้ 1/2 ถาด" }, { val: 3, text: "5.3 กินได้พอควร / กินได้ > 1/2 ถาด" }, { val: 4, text: "5.4 กินได้ปกติ / Feed รับได้หมด" }] },
    { id: "Friction", name: "6. การเสียดสี", options: [{ val: 1, text: "6.1 มีกล้ามเนื้อหดเกร็ง / ใช้ผู้ช่วยหลายคน" }, { val: 2, text: "6.2 เวลานั่งลื่นไถลได้ / ใช้ผู้ช่วยน้อยคน" }, { val: 3, text: "6.3 เคลื่อนย้ายอิสระ ไม่มีปัญหาการเสียดสี" }] }
];

const BRADEN_CRITERIA_FULL = [
  { id: "Sensory", label: "1. การรับรู้/ความรู้สึก", 1: "จำกัดทั้งหมด: ไม่ตอบสนองต่อสิ่งกระตุ้น", 2: "จำกัดมาก: ตอบสนองต่อสิ่งกระตุ้นที่เจ็บปวดเท่านั้น", 3: "จำกัดเล็กน้อย: ตอบสนองต่อเสียง ไม่ได้ผลเสมอไป", 4: "ไม่บกพร่อง: ตอบสนองตามคำสั่งและสื่อสารได้ปกติ" },
  { id: "Moisture", label: "2. ความเปียกชื้น", 1: "ชื้นตลอดเวลา: ตรวจพบผ้าเปียกชื้นทุกครั้ง", 2: "ชื้นมาก: ผ้าเปียกชื้นส่วนใหญ่ (ต้องเปลี่ยนเวรละ 1 ครั้ง)", 3: "ชื้นเป็นครั้งคราว: ผ้าเปียกชื้นวันละ 1 ครั้ง", 4: "ชื้นน้อยมาก: ผิวแห้งปกติ เปลี่ยนผ้าตามรอบ" },
  { id: "Activity", label: "3. กิจกรรม", 1: "นอนอยู่บนเตียงตลอดเวลา", 2: "เดินไม่ได้: ต้องใช้รถเข็น", 3: "เดินได้เป็นครั้งคราว: โดยมีผู้ช่วยพยุง", 4: "เดินได้ปกติ: เดินบ่อยๆ อย่างน้อยวันละ 2 ครั้ง" },
  { id: "Mobility", label: "4. การเคลื่อนไหว", 1: "เคลื่อนไหวเองไม่ได้เลย", 2: "เคลื่อนไหวได้น้อยมาก: ขยับได้เพียงเล็กน้อย", 3: "เคลื่อนไหวได้บ้าง: ขยับได้ด้วยตนเองอย่างจำกัด", 4: "เคลื่อนไหวได้ปกติ: เปลี่ยนตำแหน่งได้เองบ่อยๆ" },
  { id: "Nutrition", label: "5. โภชนาการ", 1: "ไม่เพียงพอ: กินได้ไม่ถึง 1/3 ของถาด", 2: "อาจไม่เพียงพอ: กินได้ประมาณ 1/2 ของถาด", 3: "เพียงพอ: กินได้เกินกว่า 1/2 ของถาด", 4: "ดีเยี่ยม: กินได้หมดเกือบทุกมื้อ" },
  { id: "Friction", label: "6. การเสียดสี", 1: "มีปัญหา: ต้องใช้ผู้ช่วยพยุง ดึงลากผิวหนัง", 2: "เสี่ยงต่อการมีปัญหา: ขยับตัวได้ลำบาก ลื่นไถลได้", 3: "ไม่มีปัญหา: เคลื่อนไหวได้เอง ยกตัวได้พ้นที่นอน", 4: "" }
];

const WARD_CONFIG = {
  "ศัลยกรรมทั่วไป": { icon: "fa-user-doctor", color: "text-blue-600", desc: "" },
  "ศัลยกรรมกระดูก": { icon: "fa-bone", color: "text-orange-500", desc: "" },
  "สูติ-นรีเวช": { icon: "fa-person-pregnant", color: "text-pink-500", desc: "" },
  "พวงชมพู": { icon: "fa-star", color: "text-pink-600", desc: "" },
  "อายุรกรรมชาย": { icon: "fa-user-injured", color: "text-blue-500", desc: "" },
  "อายุรกรรมหญิง": { icon: "fa-user-nurse", color: "text-rose-400", desc: "" },
  "กุมารเวชกรรม": { icon: "fa-child-reaching", color: "text-yellow-500", desc: "" },
  "ปาริฉัตร": { icon: "fa-bed-pulse", color: "text-indigo-600", desc: "" },
  "สงฆ์อาพาธ": { icon: "fa-hands-praying", color: "text-yellow-600", desc: "" },
  "ICU": { icon: "fa-heart-pulse", color: "text-red-600", desc: "" },
  "NICU-SNB": { icon: "fa-baby", color: "text-green-500", desc: "" },
  "Stroke": { icon: "fa-brain", color: "text-purple-600", desc: "" },
  "รักษ์ใจปันสุข": { icon: "fa-puzzle-piece", color: "text-teal-600", desc: "" },
  "ห้องคลอด": { icon: "fa-baby-carriage", color: "text-pink-400", desc: "" }
};

// ----------------------------------------------------------------
// (3) Global Variables & DOM Elements
// ----------------------------------------------------------------
let currentWard = null;
let currentPatientAN = null;
let currentPatientData = {};
let currentAdviceData = null;
let allWards = [];
let globalConfigData = {};
let globalStaffList = [];
let currentClassifyPage = 1;
let globalFocusTemplates = { problems: [], goals: [] };
let globalProgressTemplates = [];
let currentMorsePage = 1;
let currentBradenPage = 1;

// DOM Elements
const wardSelectionPage = document.getElementById("ward-selection");
const registryPage = document.getElementById("registry-page");
const wardGrid = document.getElementById("ward-grid");
const wardHeaderTitle = document.getElementById("ward-header-title");
const wardSwitcher = document.getElementById("ward-switcher");
const patientTableBody = document.getElementById("patient-table-body");
const clockElement = document.getElementById("realtime-clock");

// Modal Elements
const admitModal = document.getElementById("admit-modal");
const admitForm = document.getElementById("admit-form");
const admitDobInput = document.getElementById("admit-dob");
const admitAgeInput = document.getElementById("admit-age");
const openAdmitModalBtn = document.getElementById("open-admit-modal-btn");
const closeAdmitModalBtn = document.getElementById("close-admit-modal-btn");

const detailsModal = document.getElementById("details-modal");
const detailsForm = document.getElementById("details-form");
const detailsFieldset = document.getElementById("details-fieldset");
const editPatientBtn = document.getElementById("edit-patient-btn");
const saveDetailsBtn = document.getElementById("save-details-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const dischargeBtn = document.getElementById("discharge-btn");
const transferWardBtn = document.getElementById("transfer-ward-btn");
const detailsBedDisplay = document.getElementById("details-bed-display");
const detailsBedSelect = document.getElementById("details-bed-select");
const detailsDobInput = document.getElementById("details-dob");
const detailsAgeInput = document.getElementById("details-age");
const closeDetailsModalBtn = document.getElementById("close-details-modal-btn");

const chartPage = document.getElementById("chart-page");
const closeChartBtn = document.getElementById("close-chart-btn");
const chartAnDisplay = document.getElementById("chart-an-display");
const chartHnDisplay = document.getElementById("chart-hn-display");
const chartNameDisplay = document.getElementById("chart-name-display");
const chartPreviewTitle = document.getElementById("chart-preview-title");
const chartPreviewContent = document.getElementById("chart-preview-content");
const chartPreviewPlaceholder = document.getElementById("chart-preview-placeholder");
const chartEditBtn = document.getElementById("chart-edit-btn");
const chartAddNewBtn = document.getElementById("chart-add-new-btn");
const chartBedDisplay = document.getElementById("chart-bed-display");
const chartDoctorDisplay = document.getElementById("chart-doctor-display");

const assessmentModal = document.getElementById("assessment-modal");
const assessmentForm = document.getElementById("assessment-form");
const closeAssessmentModalBtn = document.getElementById("close-assessment-modal-btn");

const classifyModal = document.getElementById("classify-modal");
const classifyForm = document.getElementById("classify-form");
const classifyAnDisplay = document.getElementById("classify-an-display");
const classifyNameDisplay = document.getElementById("classify-name-display");
const classifyPageDisplay = document.getElementById("classify-page-display");
const classifyPrevPageBtn = document.getElementById("classify-prev-page-btn");
const classifyNextPageBtn = document.getElementById("classify-next-page-btn");
const classifyAddPageBtn = document.getElementById("classify-add-page-btn");
const classifyTable = document.getElementById("classify-table");
const classifyTableBody = document.getElementById("classify-table-body");

const focusProblemModal = document.getElementById("focus-problem-modal");
const focusProblemForm = document.getElementById("focus-problem-form");
const focusModalTitle = document.getElementById("focus-modal-title");
const focusProblemText = document.getElementById("focus-problem-text");
const focusGoalText = document.getElementById("focus-goal-text");
const focusTemplateSearch = document.getElementById("focus-template-search");
const focusTemplateDatalist = document.getElementById("focus-template-datalist");

const addTemplateModal = document.getElementById("add-template-modal");
const addTemplateForm = document.getElementById("add-template-form");

const progressNoteModal = document.getElementById("progress-note-modal");
const progressNoteForm = document.getElementById("progress-note-form");
const progAnDisplay = document.getElementById("prog-an-display");
const progNameDisplay = document.getElementById("prog-name-display");

const dischargeModal = document.getElementById("discharge-form-modal");
const dischargeForm = document.getElementById("discharge-form");
const closeDischargeBtn = document.getElementById("close-discharge-modal-btn");

const adviceModal = document.getElementById("advice-form-modal");
const adviceForm = document.getElementById("advice-form");
const closeAdviceBtn = document.getElementById("close-advice-modal-btn");

const morseModal = document.getElementById("morse-modal");
const morseTable = document.getElementById("morse-table");

const bradenModal = document.getElementById("braden-modal");
const bradenForm = document.getElementById("braden-form");

// ----------------------------------------------------------------
// (4) Utility Functions
// ----------------------------------------------------------------

// *** แก้ไข: ป้องกัน Error หาก google.script ไม่พร้อมใช้งาน (เช่น Local Test) ***
let staffListCache = [];
function loadStaffData() {
    if (typeof google === 'undefined' || typeof google.script === 'undefined') {
        console.warn("Google Apps Script environment not detected. Mock data or skipping.");
        return;
    }
    google.script.run.withSuccessHandler(data => {
        staffListCache = data;
    }).getStaffList();
}
// เรียกใช้ตอนโหลดหน้าเว็บ
window.addEventListener('load', loadStaffData);

function showLoading(title = 'กำลังประมวลผล...') {
  Swal.fire({ title: title, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }, });
}
function showSuccess(title = 'สำเร็จ!', message = '') {
  Swal.fire(title, message, 'success');
}
function showError(title = 'เกิดข้อผิดพลาด!', message = '') {
  Swal.fire(title, message, 'error');
}
function showComingSoon() {
  Swal.fire({
    title: 'เร็วๆ นี้ (Coming Soon)',
    text: 'ฟังก์ชันนี้กำลังอยู่ระหว่างการพัฒนาครับ',
    icon: 'info',
    confirmButtonText: 'ตกลง'
  });
}
function updateClock() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Bangkok' };
  const thaiDate = now.toLocaleDateString('th-TH', options);
  const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Bangkok' });
  if(clockElement) clockElement.textContent = `${thaiDate} | ${time}`;
}

function calculateAge(dobString_BE) {
  if (!dobString_BE) return "N/A";
  try {
    const [yearBE, month, day] = dobString_BE.split('-');
    const yearCE = parseInt(yearBE) - 543;
    const dob = new Date(yearCE, month - 1, day);
    if (isNaN(dob.getTime())) return "N/A";
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} ปี ${months} ด. ${days} ว.`;
  } catch(e) {
    return "N/A";
  }
}

function convertCEtoBE(ceDate) {
  if (!ceDate || ceDate.length < 10) return null;
  try {
    const [year, month, day] = ceDate.split('-');
    if (parseInt(year) > 2400) return ceDate;
    const beYear = parseInt(year) + 543;
    return `${beYear}-${month}-${day}`;
  } catch (e) { return null; }
}

function convertBEtoCE(beDate) {
  if (!beDate || beDate.length < 10) return null;
  try {
    const [year, month, day] = beDate.split('-');
    if (parseInt(year) < 2400) return beDate;
    const ceYear = parseInt(year) - 543;
    return `${ceYear}-${month}-${day}`;
  } catch (e) { return null; }
}

function calculateLOS(admitDateStr) {
  if (!admitDateStr) return "N/A";
  const admitDate = new Date(admitDateStr);
  const today = new Date();
  const diffTime = Math.abs(today - admitDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} วัน`;
}

function setFormDefaults() {
  const now = new Date();
  const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const dateString = localDate.toISOString().split('T')[0];
  const timeString = now.toTimeString().split(' ')[0].substring(0, 5);
  if(document.getElementById("admit-date")) document.getElementById("admit-date").value = dateString;
  if(document.getElementById("admit-time")) document.getElementById("admit-time").value = timeString;
}

function populateSelect(elementId, options, defaultValue = null) {
  const select = document.getElementById(elementId);
  if (!select) return;
  select.innerHTML = `<option value="">-- กรุณาเลือก --</option>`;
  options.forEach(optValue => {
    const option = document.createElement("option");
    option.value = optValue;
    option.textContent = optValue;
    if (optValue === defaultValue) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}
function populateDatalist(datalistId, options) {
  const datalist = document.getElementById(datalistId);
  if (!datalist) return;
  datalist.innerHTML = ""; 
  options.forEach(val => {
    const option = document.createElement("option");
    option.value = val;
    datalist.appendChild(option);
  });
}

function getISODate(date) {
  const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  return offsetDate.toISOString().split('T')[0];
}

// ฟังก์ชันกลางสำหรับปิด Modal ทุกตัว
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

// ----------------------------------------------------------------
// (5) Core App Functions (Load Wards, Patients)
// ----------------------------------------------------------------

async function refreshStaffDatalists() {
  try {
    if (globalStaffList.length === 0) {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
      const result = await response.json();
      if (result.success) globalStaffList = result.data;
    }
    const dl = document.getElementById("staff-list-datalist");
    if (dl) {
      dl.innerHTML = "";
      globalStaffList.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.fullName;
        dl.appendChild(opt);
      });
    }
  } catch (e) { console.error("Error loading staff", e); }
}

async function loadWards() {
  showLoading('กำลังโหลดหน้าเริ่มต้น กรุณารอสักครู่...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getWards`);
    const result = await response.json();
    
    if (result.success) {
      allWards = result.data;
      wardGrid.innerHTML = ""; 
      wardSwitcher.innerHTML = "";
      
      allWards.forEach(ward => {
        const wardName = ward.value;
        const config = WARD_CONFIG[wardName] || { icon: "fa-hospital", color: "text-gray-600", desc: "" };

        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 border border-gray-100 transform hover:-translate-y-1 group";
        
        card.innerHTML = `
            <div class="text-4xl ${config.color} group-hover:scale-110 transition-transform duration-300">
                <i class="fa-solid ${config.icon}"></i>
            </div>
            <div class="text-center">
                <h3 class="text-lg font-bold text-gray-700 group-hover:text-blue-700 transition-colors">${wardName}</h3>
                ${config.desc ? `<p class="text-xs text-gray-500 font-medium mt-1">${config.desc}</p>` : ''}
            </div>
        `;
        
        card.onclick = () => selectWard(wardName);
        wardGrid.appendChild(card);
        
        const option = document.createElement("option");
        option.value = wardName; 
        option.textContent = wardName;
        wardSwitcher.appendChild(option);
      });
      
      Swal.close();
    } else { throw new Error(result.message); }
  } catch (error) { showError('โหลดข้อมูลตึกไม่สำเร็จ', error.message); }
}

function selectWard(wardName) {
  currentWard = wardName;
  wardHeaderTitle.textContent = `ทะเบียนผู้ป่วยใน (IPD Registry) - ตึก${wardName}`;
  wardSwitcher.value = wardName;
  wardSelectionPage.classList.add("hidden");
  registryPage.classList.remove("hidden");
  loadPatients(wardName);
}

async function loadPatients(wardName) {
  patientTableBody.innerHTML = `<tr><td colspan="10" class="p-6 text-center text-gray-500">กำลังโหลดข้อมูลผู้ป่วย...</td></tr>`;
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getPatients&ward=${wardName}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    patientTableBody.innerHTML = "";
    if (result.data.length === 0) {
      patientTableBody.innerHTML = `<tr><td colspan="10" class="p-6 text-center text-gray-400">-- ไม่มีผู้ป่วยในตึกนี้ --</td></tr>`;
      return;
    }

    result.data.forEach(pt => {
      const row = document.createElement("tr");
      row.className = "hover:bg-gray-50";
      const nameCell = `<a href="#" class="text-blue-600 hover:underline font-semibold" data-an="${pt.AN}">${pt.Name}</a>`;
      const chartButton = `
      <button class="chart-btn flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-2 px-4 rounded shadow transition-transform transform hover:scale-105" 
        data-an="${pt.AN}" 
        data-hn="${pt.HN}" 
        data-name="${pt.Name}"
        data-bed="${pt.Bed}" 
        data-doctor="${pt.Doctor}">
        Chart
      </button>`;
      
      row.innerHTML = `
        <td class="p-3 text-center">${chartButton}</td>
        <td class="p-3">${pt.Bed}</td>
        <td class="p-3">${pt.HN}</td>
        <td class="p-3">${pt.AN}</td>
        <td class="p-3">${nameCell}</td>
        <td class="p-3">${pt.Age || 'N/A'}</td>
        <td class="p-3">${pt.Dept}</td>
        <td class="p-3">${pt.Doctor}</td>
        <td class="p-3">${new Date(pt.AdmitDate).toLocaleDateString('th-TH')}</td>
        <td class="p-3">${calculateLOS(pt.AdmitDate)}</td>
      `;
      patientTableBody.appendChild(row);
    });
  } catch (error) {
    showError('โหลดข้อมูลผู้ป่วยไม่สำเร็จ', error.message);
  }
}

// ----------------------------------------------------------------
// (6) Modal Functions: Admit, Details
// ----------------------------------------------------------------

// --- ADMIT MODAL ---
async function openAdmitModal() {
  if (!currentWard) {
    showError('กรุณาเลือกหอผู้ป่วยก่อนทำรายการ');
    return;
  }
  showLoading('กำลังเตรียมฟอร์ม...');
  try {
    const { departments, doctors, admittedFrom, availableBeds } = await fetchFormData(currentWard);
    if (doctors && doctors.length > 0) {
      populateDatalist("doctor-list", doctors.map(o => o.value));
    }
    populateSelect("admit-from", admittedFrom.map(o => o.value));
    populateSelect("admit-bed", availableBeds);
    populateSelect("admit-dept", departments.map(o => o.value));
    
    admitForm.reset();
    setFormDefaults();
    if (document.getElementById("admit-age")) document.getElementById("admit-age").value = "";

    admitModal.classList.remove("hidden");
    Swal.close();
  } catch (error) {
    console.error('Error in openAdmitModal:', error);
    showError('เตรียมฟอร์มไม่สำเร็จ', 'ไม่สามารถโหลดข้อมูลพื้นฐานจากระบบได้ กรุณาลองใหม่อีกครั้ง');
  }
}

function closeAdmitModal() {
  admitModal.classList.add("hidden");
  admitForm.reset();
}

async function handleAdmitSubmit(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกข้อมูลผู้ป่วย...');
  const formData = new FormData(admitForm);
  let patientData = Object.fromEntries(formData.entries());
  
  if (patientData.DOB_BE) {
    patientData.DOB_BE = convertCEtoBE(patientData.DOB_BE);
  }
  patientData.Age = document.getElementById("admit-age").value;
  patientData.Ward = currentWard;
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "admitPatient", patientData: patientData })
    });
    const result = await response.json();
    if (result.success) {
      showSuccess('บันทึกสำเร็จ!');
      closeAdmitModal();
      loadPatients(currentWard);
    } else { throw new Error(result.message); }
  } catch (error) { showError('บันทึกข้อมูลไม่สำเร็จ', error.message); }
}

// --- DETAILS MODAL ---
async function fetchFormData(ward, currentBed = null) {
  if (globalConfigData.departments && !currentBed) {
     const beds = await fetchAvailableBeds(ward, null);
     return { ...globalConfigData, availableBeds: beds };
  }
  let url = `${GAS_WEB_APP_URL}?action=getFormData&ward=${ward}`;
  if(currentBed) { url += `&currentBed=${currentBed}`; }
  
  const response = await fetch(url);
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  if (!globalConfigData.departments) {
      globalConfigData = {
          departments: result.data.departments,
          doctors: result.data.doctors,
          admittedFrom: result.data.admittedFrom
      };
  }
  return result.data;
}

async function fetchAvailableBeds(ward, currentBed = null) {
  let url = `${GAS_WEB_APP_URL}?action=getFormData&ward=${ward}`;
  if(currentBed) { url += `&currentBed=${currentBed}`; }
  const response = await fetch(url);
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data.availableBeds;
}

async function openDetailsModal(an) {
  showLoading('กำลังดึงข้อมูลผู้ป่วย...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getPatientDetails&an=${an}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    if (!globalConfigData.departments) {
        await fetchFormData(currentWard);
    }
    populateDetailsForm(result.data);
    resetDetailsModalState();
    detailsModal.classList.remove("hidden");
    Swal.close();
  } catch (error) {
    showError('ดึงข้อมูลไม่สำเร็จ', error.message);
  }
}

function populateDetailsForm(data) {
  detailsForm.reset();
  populateSelect("details-from", globalConfigData.admittedFrom.map(o => o.value), data.AdmittedFrom);
  populateSelect("details-dept", globalConfigData.departments.map(o => o.value), data.Dept);
  populateSelect("details-doctor", globalConfigData.doctors.map(o => o.value), data.Doctor);
  
  document.getElementById("details-an").value = data.AN;
  document.getElementById("details-an-display").value = data.AN;
  document.getElementById("details-hn").value = data.HN;
  document.getElementById("details-name").value = data.Name;
  document.getElementById("details-address").value = data.Address;
  document.getElementById("details-cc").value = data.ChiefComplaint;
  document.getElementById("details-pi").value = data.PresentIllness;
  document.getElementById("details-dx").value = data.AdmittingDx;
  document.getElementById("details-refer").value = data.Refer;
  document.getElementById("details-date").value = data.AdmitDate;
  document.getElementById("details-time").value = data.AdmitTime;
  
  detailsBedDisplay.value = data.Bed;
  detailsBedDisplay.classList.remove("hidden");
  detailsBedSelect.classList.add("hidden");

  const ceDate = convertBEtoCE(data.DOB_BE);
  detailsDobInput.value = ceDate;
  detailsAgeInput.value = data.Age;
}

function resetDetailsModalState() {
  detailsFieldset.disabled = true;
  editPatientBtn.classList.remove("hidden");
  dischargeBtn.classList.remove("hidden");
  transferWardBtn.classList.remove("hidden");
  saveDetailsBtn.classList.add("hidden");
  cancelEditBtn.classList.add("hidden");
  const inputs = detailsForm.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    if (input.id.includes("-display") || input.id.includes("-age") || input.id.includes("-an-display")) {
       input.classList.add("bg-gray-200");
    } else if (input.tagName === "INPUT") {
       input.classList.add("bg-gray-100");
    }
  });
  detailsBedDisplay.classList.remove("hidden");
  detailsBedSelect.classList.add("hidden");
}

function closeDetailsModal() {
  detailsModal.classList.add("hidden");
  resetDetailsModalState();
}

async function enableEditMode() {
  detailsFieldset.disabled = false;
  editPatientBtn.classList.add("hidden");
  dischargeBtn.classList.add("hidden");
  transferWardBtn.classList.add("hidden");
  saveDetailsBtn.classList.remove("hidden");
  cancelEditBtn.classList.remove("hidden");

  const inputs = detailsForm.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.classList.remove("bg-gray-100");
    input.classList.remove("bg-gray-200");
  });
  showLoading('กำลังโหลดเตียงว่าง...');
  const currentBed = detailsBedDisplay.value;
  const availableBeds = await fetchAvailableBeds(currentWard, currentBed);
  const bedOptions = [currentBed, ...availableBeds.filter(b => b !== currentBed)];
  populateSelect("details-bed-select", bedOptions, currentBed);
  
  detailsBedDisplay.classList.add("hidden");
  detailsBedSelect.classList.remove("hidden");
  Swal.close();
}

async function handleUpdateSubmit(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกการแก้ไข...');
  
  const formData = new FormData(detailsForm);
  let patientData = Object.fromEntries(formData.entries());
  const an = document.getElementById("details-an").value;

  if (patientData.DOB_CE) {
    patientData.DOB_BE = convertCEtoBE(patientData.DOB_CE);
    delete patientData.DOB_CE;
  }
  patientData.Age = document.getElementById("details-age").value;
  if (!patientData.Bed) {
    patientData.Bed = detailsBedDisplay.value;
  }
  
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updatePatient", an: an, patientData: patientData
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    showSuccess('อัปเดตข้อมูลสำเร็จ!');
    closeDetailsModal();
    loadPatients(currentWard);
  } catch (error) {
    showError('อัปเดตไม่สำเร็จ', error.message);
  }
}

async function handleDischarge() {
  const an = document.getElementById("details-an").value;
  const name = document.getElementById("details-name").value;

  const { value: isConfirm } = await Swal.fire({
    title: `ยืนยันการจำหน่าย`,
    text: `คุณต้องการจำหน่าย ${name} (AN: ${an}) ใช่หรือไม่?`,
    icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
    confirmButtonText: 'ยืนยันจำหน่าย', cancelButtonText: 'ยกเลิก'
  });
  if (isConfirm) {
    showLoading('กำลังดำเนินการจำหน่าย...');
    
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const dischargeDate = localDate.toISOString().split('T')[0];
    const dischargeTime = now.toTimeString().split(' ')[0].substring(0, 5);
    try {
       const response = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "dischargePatient", an: an,
          dischargeDate: dischargeDate, dischargeTime: dischargeTime
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      showSuccess('จำหน่ายผู้ป่วยสำเร็จ!');
      closeDetailsModal();
      loadPatients(currentWard);
    } catch (error) {
       showError('จำหน่ายไม่สำเร็จ', error.message);
    }
  }
}

async function handleTransferWard() {
  const an = document.getElementById("details-an").value;
  const name = document.getElementById("details-name").value;

  const wardOptions = {};
  allWards.forEach(w => {
    if (w.value !== currentWard) {
      wardOptions[w.value] = w.value;
    }
  });
  if (Object.keys(wardOptions).length === 0) {
    showError("มีเพียงตึกเดียวในระบบ", "ไม่สามารถย้ายตึกได้");
    return;
  }

  const { value: newWard } = await Swal.fire({
    title: 'ย้ายตึก (ขั้นตอนที่ 1/2)',
    text: `เลือกตึกใหม่ที่จะย้าย ${name} ไป:`,
    input: 'select',
    inputOptions: wardOptions,
    inputPlaceholder: '-- เลือกตึก --',
    showCancelButton: true,
    cancelButtonText: 'ยกเลิก',
    confirmButtonText: 'ถัดไป'
  });
  if (!newWard) return;

  showLoading(`กำลังโหลดเตียงว่างตึก ${newWard}...`);
  let availableBeds = [];
  try {
    availableBeds = await fetchAvailableBeds(newWard, null);
    Swal.close();
  } catch (error) {
    showError('โหลดเตียงว่างไม่สำเร็จ!', error.message);
    return;
  }

  if (availableBeds.length === 0) {
    showError(`ตึก ${newWard} ไม่มีเตียงว่าง!`, "กรุณาตรวจสอบในระบบจัดการเตียง");
    return;
  }
  
  const bedOptions = {};
  availableBeds.forEach(bed => { bedOptions[bed] = bed; });
  const { value: newBed } = await Swal.fire({
    title: 'ย้ายตึก (ขั้นตอนที่ 2/2)',
    text: `เลือกเตียงในตึก ${newWard}:`,
    input: 'select',
    inputOptions: bedOptions,
    inputPlaceholder: '-- เลือกเตียง --',
    showCancelButton: true,
    cancelButtonText: 'ยกเลิก',
    confirmButtonText: 'ยืนยันการย้าย'
  });
  if (!newBed) return;

  showLoading('กำลังย้ายผู้ป่วย...');
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updatePatient",
        an: an,
        patientData: {
          Ward: newWard,
          Bed: newBed
        }
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    showSuccess('ย้ายผู้ป่วยสำเร็จ!');
    closeDetailsModal();
    loadPatients(currentWard);
  } catch (error) {
    showError('ย้ายผู้ป่วยไม่สำเร็จ', error.message);
  }
}

// --- CHART PAGE & PREVIEW ---
async function openChart(an, hn, name, bed, doctor) {
  currentPatientAN = an;
  chartAnDisplay.textContent = an;
  chartHnDisplay.textContent = hn;
  chartNameDisplay.textContent = name;
  if(chartBedDisplay) chartBedDisplay.textContent = bed || '-';
  if(chartDoctorDisplay) chartDoctorDisplay.textContent = doctor || '-';
  showLoading('กำลังโหลดข้อมูลเวชระเบียน...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${an}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    currentPatientData = result.data;
    
    // Update spans
    const span004 = document.getElementById('last-updated-004');
    if(span004) { 
      if(currentPatientData.LastUpdatedTime) {
        span004.textContent = `${new Date(currentPatientData.LastUpdatedTime).toLocaleString('th-TH')} โดย ${currentPatientData.LastUpdatedBy || ''}`;
      } else {
        span004.textContent = "ยังไม่เคยบันทึก";
      }
    }
    
    const spanClassify = document.getElementById('last-updated-classify');
    if (spanClassify) {
      try {
        const classifyResponse = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationSummary&an=${an}`);
        const classifyResult = await classifyResponse.json();
        
        if (classifyResult.success && classifyResult.data.length > 0) {
          const latestEntry = classifyResult.data[0];
          const entryDate = new Date(latestEntry.date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
          const shift = latestEntry.shift === 'N' ? 'ดึก' : (latestEntry.shift === 'D' ? 'เช้า' : 'บ่าย');
          spanClassify.textContent = `เวร ${shift} ${entryDate} โดย ${latestEntry.user || 'N/A'}`;
        } else {
          spanClassify.textContent = "ยังไม่เคยบันทึก";
        }
      } catch (e) {
        spanClassify.textContent = "โหลดข้อมูลล้มเหลว";
      }
    }

    const span005 = document.getElementById('last-updated-005');
    if (span005) {
      span005.textContent = "คลิกเพื่อโหลด";
    }

    registryPage.classList.add("hidden");
    chartPage.classList.remove("hidden");
    
    showPreviewPlaceholder();
    chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
    Swal.close();
  } catch (error) {
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
  }
}

function closeChart() {
  chartPage.classList.add("hidden");
  registryPage.classList.remove("hidden");
  currentPatientAN = null;
  currentPatientData = {};
}

function showPreviewPlaceholder() {
  chartPreviewTitle.textContent = "เลือกเอกสาร";
  chartPreviewPlaceholder.classList.remove("hidden");
  chartPreviewContent.innerHTML = "";
  chartEditBtn.classList.add("hidden");
  chartAddNewBtn.classList.add("hidden");
}

// ----------------------------------------------------------------
// (7) Form Preview Logic (Classify, 004, Advice, 006, 007, Braden, Morse)
// ----------------------------------------------------------------

function renderADLTable() {
  const tbody = document.getElementById("adl-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  ADL_TASKS.forEach((task, idx) => {
    const fieldPrefix = ["Eat", "Brush", "Dress", "Walk", "Toilet", "Bath"][idx];
    let row = `<tr><td class="border p-3 text-left font-medium">${task}</td>`;
    
    row += `<td class="border p-2"><select name="ADL_${fieldPrefix}_Before" class="w-full p-1 border rounded">`;
    ADL_OPTIONS.forEach(opt => row += `<option value="${opt}">${opt}</option>`);
    row += `</select></td>`;
    
    row += `<td class="border p-2"><select name="ADL_${fieldPrefix}_Current" class="w-full p-1 border rounded">`;
    ADL_OPTIONS.forEach(opt => row += `<option value="${opt}">${opt}</option>`);
    row += `</select></td></tr>`;
    
    tbody.innerHTML += row;
  });
}

function renderBradenInitial() {
  const tbody = document.getElementById("braden-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  BRADEN_CRITERIA_FULL.forEach(crit => {
    let row = `<tr class="hover:bg-gray-50">
      <td class="border p-2 font-bold text-left bg-gray-50">${crit.label}</td>`;
    for (let i = 1; i <= 4; i++) {
      if (crit.id === "Friction" && i === 4) { row += `<td class="border p-2 bg-gray-100">-</td>`; continue; }
      row += `<td class="border p-2 text-left">
        <label class="flex items-start gap-1 cursor-pointer">
          <input type="radio" name="Braden_${crit.id}" value="${i}" class="mt-1 braden-score" required onclick="calculateBradenScore()">
          <span>${crit[i]}</span>
        </label>
      </td>`;
    }
    row += `</tr>`;
    tbody.innerHTML += row;
  });
}

function calculateBradenScore(targetForm = assessmentForm) {
  let total = 0;
  const inputs = targetForm.querySelectorAll(".braden-score:checked");
  inputs.forEach(input => {
    total += parseInt(input.value, 10) || 0;
  });
  
  const totalEl = targetForm.querySelector("#braden-total-score");
  const resultEl = targetForm.querySelector("#braden-result");
  
  if(totalEl) totalEl.value = total;

  if(resultEl) {
    if (total <= 9) resultEl.textContent = "Very high risk (<= 9)";
    else if (total <= 12) resultEl.textContent = "High risk (10-12)";
    else if (total <= 14) resultEl.textContent = "Moderate risk (13-14)";
    else if (total <= 18) resultEl.textContent = "Low risk (15-18)";
    else resultEl.textContent = "No risk (> 18)";
  }
}

// ----------------------------------------------------------------
// (8) Print Settings & Logic
// ----------------------------------------------------------------

// 2. เปิด Modal
function openPrintSettings004() {
    document.getElementById('printSettingsModal').classList.remove('hidden');
    document.getElementById('printerSearch').value = '';
    document.getElementById('staffDropdown').innerHTML = '';
}

// 3. ปิด Modal
function closePrintModal() {
    document.getElementById('printSettingsModal').classList.add('hidden');
}

// 4. ค้นหารายชื่อ
function filterStaffList(keyword) {
    const dropdown = document.getElementById('staffDropdown');
    dropdown.innerHTML = '';
    
    if (!keyword) {
        dropdown.classList.add('hidden');
        return;
    }

    const filtered = staffListCache.filter(s => s.name.includes(keyword));
    
    if (filtered.length > 0) {
        dropdown.classList.remove('hidden');
        filtered.forEach(staff => {
            const div = document.createElement('div');
            div.className = 'px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm';
            div.innerText = `${staff.name} (${staff.position})`;
            div.onclick = () => selectStaff(staff);
            dropdown.appendChild(div);
        });
    } else {
        dropdown.classList.add('hidden');
    }
}

// 5. เลือกรายชื่อ
function selectStaff(staff) {
    document.getElementById('printerSearch').value = staff.name;
    document.getElementById('selectedPrinterName').value = staff.name;
    document.getElementById('selectedPrinterPosition').value = staff.position;
    document.getElementById('staffDropdown').classList.add('hidden');
}

// 6. สั่งพิมพ์จริง (Render + Footer)
function executePrint004() {
    const printerName = document.getElementById('selectedPrinterName').value || '-';
    const printerPos = document.getElementById('selectedPrinterPosition').value || '-';
    
    // สร้างวันที่ไทย
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }); // 19/01/2569
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const printDate = `${dateStr} เวลา ${timeStr} น.`;

    // เตรียมข้อมูล Footer
    const footerData = {
        name: printerName,
        position: printerPos,
        date: printDate
    };

    // Render หน้า 1 และ 2 ใหม่โดยส่ง Footer Data ไปด้วย
    const printArea = document.getElementById('printArea'); // หรือ ID ที่ท่านใช้แสดงผลตอนพิมพ์
    if(!printArea) return;

    printArea.innerHTML = ''; // เคลียร์ของเก่า
    
    // สร้าง Container หน้า 1
    const page1 = document.createElement('div');
    page1.className = 'page-break'; 
    // แปลงข้อมูลล่าสุดก่อนส่ง
    const freshData = normalizeData004(currentPatientData);
    renderForm004Page1(page1, { data: freshData, footer: footerData }); 
    printArea.appendChild(page1);

    // สร้าง Container หน้า 2
    const page2 = document.createElement('div');
    page2.className = 'page-break';
    renderForm004Page2(page2, { data: freshData, footer: footerData }); 
    printArea.appendChild(page2);

    closePrintModal();
    window.print();
}

// ----------------------------------------------------------------
// (9) MAIN RENDERERS (Cleaned & Updated)
// ----------------------------------------------------------------

async function showFormPreview(formType) {
  chartPreviewPlaceholder.classList.add("hidden");
  chartPreviewContent.innerHTML = "";

  if (formType === 'classify') {
    chartPreviewTitle.textContent = "แบบบันทึกการจำแนกประเภทผู้ป่วย (Print View)";
    chartEditBtn.classList.add("hidden"); 
    chartAddNewBtn.classList.remove("hidden");
    chartAddNewBtn.dataset.form = "classify";
    await renderClassifyPrintMode(currentPatientAN);
  }
  else if (formType === '004') {
    chartPreviewTitle.textContent = "แบบประเมินประวัติและสมรรถนะผู้ป่วย (FR-IPD-004)";
    chartEditBtn.classList.remove("hidden");
    chartEditBtn.dataset.form = "004";
    chartAddNewBtn.classList.add("hidden");
    await renderForm004PrintMode(currentPatientAN);
  }
  else if (formType === 'advice') {
    chartPreviewTitle.textContent = "การให้คำแนะนำการปฏิบัติตัว";
    await showAdvicePreview(currentPatientAN);
  }
  else if (formType === '006') {
    chartPreviewTitle.textContent = "บันทึกความก้าวหน้าทางการพยาบาล (Nursing Progress Note)";
    chartEditBtn.classList.add("hidden");
    chartAddNewBtn.classList.remove("hidden");
    chartAddNewBtn.dataset.form = "006";
    await showProgressNotePreview(currentPatientAN);
  }
  else if (formType === '007') {
     chartPreviewTitle.textContent = "แบบบันทึกการพยาบาลผู้ป่วยจำหน่าย (PR-IPD-007)";
     await showDischargePreview(currentPatientAN);
  }
  else if (formType === 'braden') {
    chartPreviewTitle.textContent = "แบบประเมินแผลกดทับ (Braden Scale) - Print View";
    chartEditBtn.classList.remove("hidden");
    chartEditBtn.dataset.form = "braden"; 
    chartAddNewBtn.classList.add("hidden");
    await renderBradenPrintMode(currentPatientAN);
  }
  else if (formType === 'morse_maas') {
    chartPreviewTitle.textContent = "แบบประเมินความเสี่ยง Morse / MAAS (Print View)";
    chartEditBtn.classList.remove("hidden");
    chartEditBtn.dataset.form = "morse_maas";
    chartAddNewBtn.classList.add("hidden");
    await renderMorsePrintMode(currentPatientAN);
  }
  else {
    const formTitleItem = chartPage.querySelector(`.chart-list-item[data-form="${formType}"] h3`);
    const formTitle = formTitleItem ? formTitleItem.textContent : "รายละเอียด";
    chartPreviewTitle.textContent = formTitle;
    await showEntryList(formType, formTitle);
    chartEditBtn.classList.add("hidden");
    chartAddNewBtn.classList.remove("hidden");
    chartAddNewBtn.dataset.form = formType;
  }
}

// ----------------------------------------------------------------
// (10) 004 RENDERERS (PAGE 1 & 2 with Flexbox Footer)
// ----------------------------------------------------------------

function renderForm004Page1(container, options = {}) {
    const d = options.data || {};
    const p = currentPatientData || {};
    const f = options.footer; 

    const formatDate = (date) => (typeof formatDateThai === 'function') ? formatDateThai(date) : (date || '');
    const formatT = (time) => (typeof formatTime === 'function') ? formatTime(time) : (time || '');

    const dateText = formatDate(d.AdmitDate);
    const timeText = formatT(d.AdmitTime);
    const dot = (val, w) => `<span class="border-b border-black border-dotted inline-block text-center whitespace-nowrap overflow-hidden text-blue-900 font-bold px-1" style="min-width: ${w};">${val || '&nbsp;'}</span>`;

    const checkADL = (val, target) => {
        if (!val) return '';
        const v = String(val).trim();
        if (target === 'Independent' && (v === 'Independent' || v === 'ทำได้เอง')) return '/';
        if (target === 'Partial' && (v === 'Partial' || v === 'ช่วยเหลือบ้าง' || v === 'บางส่วน')) return '/';
        if (target === 'Dependent' && (v === 'Dependent' || v === 'ไม่ได้เลย' || v === 'พึ่งพาผู้อื่น')) return '/';
        return '';
    };

    const boxCheck = (val, target) => {
        let isChecked = false;
        if (val) {
            if (Array.isArray(val)) {
                isChecked = val.includes(target);
            } else {
                const parts = String(val).split(',').map(s=>s.trim());
                isChecked = parts.includes(target);
            }
        }
        return `<span class="inline-block font-sarabun font-bold mr-1" style="font-family: 'Sarabun'; font-size: 14px;">[ ${isChecked ? '/' : '&nbsp;'} ]</span>`;
    };

    const chk = (val, target, label) => {
        return `<span class="inline-flex items-center mr-2 select-none whitespace-nowrap">${boxCheck(val, target)} ${label}</span>`;
    };

    let footerHtml = '';
    if (f) {
        footerHtml = `
        <div class="mt-auto pt-2 border-t border-gray-400 text-[10px] flex justify-between font-sarabun text-gray-600">
            <div>
                <div>ผู้พิมพ์ : ${f.name} ${f.position}</div>
                <div>วันที่พิมพ์ : ${f.date}</div>
            </div>
            <div class="text-right">
                <div>โปรแกรม IPD Nurse Workbench</div>
                <div>ระบบบันทึกเวชระเบียนทางการพยาบาล งานการพยาบาลผู้ป่วยใน</div>
            </div>
        </div>`;
    }

    let contentHtml = `
    <div class="flex justify-between items-end mb-1 border-b border-black pb-1 font-sarabun text-black">
       <div class="w-[15%]"></div>
       <div class="text-center w-[70%]">
          <h2 class="font-bold text-[18px]">แบบประเมินประวัติและประเมินสมรรถนะผู้ป่วย งานผู้ป่วยใน</h2>
          <h3 class="font-bold text-[16px]">โรงพยาบาลสมเด็จพระยุพราชสว่างแดนดิน</h3>
       </div>
       <div class="w-[15%] text-right flex flex-col justify-end text-[10px]">
          <div class="font-bold text-[12px]">FR-IPD-004</div>
          <div>แก้ไขครั้งที่ 02 1 ม.ค. 2564</div>
       </div>
    </div>
    
    <div class="font-bold text-[12px]">
        <span>ชื่อ-สกุล: ${p.Name || '-'}</span>
        <span>HN: ${p.HN || '-'}</span>
        <span>AN: ${p.AN || d.AN || '-'}</span>
        <span>หอผู้ป่วย: ${p.Ward || '-'}</span>
    </div>

    <div class="font-sarabun text-black text-[12px] leading-tight">
        
        <div class="flex items-end w-full mb-1 whitespace-nowrap">
            <span class="mr-1">วันที่</span> ${dot(dateText, "90px")}
            <span class="mx-2">เวลา</span> ${dot(timeText, "50px")} <span class="mr-2">น.</span>
            <span class="mr-1">รับจาก</span> ${dot(d.AdmittedFrom, "160px")}
            <span class="mx-2">รับ REFER จาก</span> ${dot(d.Refer, "160px")}
        </div>

        <div class="flex flex-wrap items-end gap-3 mb-1">
            <span class="font-bold">มาโดย :</span> 
            ${chk(d.ArriveBy, 'เดินมา', 'เดินมา')}
            ${chk(d.ArriveBy, 'รถนั่ง', 'รถนั่ง')}
            ${chk(d.ArriveBy, 'เปลนอน', 'เปลนอน')}
            <span class="font-bold">ผู้ให้ข้อมูล :</span>
            ${chk(d.InfoSource, 'ผู้ป่วย', 'ผู้ป่วย')}
            ${chk(d.InfoSource, 'ผู้นำส่ง/ญาติ', 'ผู้นำส่ง/ญาติ')}
        </div>
        
        <div class="flex flex-wrap items-end gap-3 mb-1">
            <span class="font-bold ml-6 mr-1">ผู้ดูแลหลักชื่อ</span> ${dot(d.MainCaregiver_Name, "200px")}
            <span class="font-bold ml-2 mr-1">ความสัมพันธ์กับผู้ป่วย</span> ${dot(d.MainCaregiver_Rel, "120px")}
        </div>

        <div class="border border-black p-1.5 mb-1 space-y-1">
            <div class="flex items-end"><span class="font-bold w-24">อาการสำคัญ</span><div class="border-b border-black border-dotted flex-grow text-blue-900 px-2 font-bold">${d.ChiefComplaint || ''}</div></div>
            <div class="flex items-end"><span class="font-bold w-32">ประวัติการเจ็บป่วย</span><div class="border-b border-black border-dotted flex-grow text-blue-900 px-2 font-bold">${d.PresentIllness || ''}</div></div>
            <div class="flex items-end"><span class="font-bold w-48">อาการและอาการแสดงแรกรับ</span><div class="border-b border-black border-dotted flex-grow text-blue-900 px-2 font-bold">${d.AdmitSymptoms || ''}</div></div>
            <div class="flex items-end mt-1">
                <span class="font-bold mr-2">สัญญาณชีพแรกรับ</span>
                BT ${dot(d.BT, "40px")} (°C) <span class="ml-4">PR</span> ${dot(d.PR, "40px")} (/min)
                <span class="ml-4">RR</span> ${dot(d.RR, "40px")} (/min) <span class="ml-4">BP</span> ${dot(d.BP, "80px")} (mmHg)
            </div>

            <div class="flex flex-wrap items-start mt-1 border-t border-black pt-1">
                <span class="font-bold mr-4 w-20">โรคประจำตัว</span>
                <div class="flex-grow">
                    <div class="flex gap-4 mb-1">
                        ${chk(d.Hx_Status, 'ไม่มี', 'ไม่มี')}
                        ${chk(d.Hx_Status, 'ไม่ทราบ', 'ไม่ทราบ')}
                        ${chk(d.Hx_Status, 'ไม่เคยตรวจ', 'ไม่เคยตรวจ')}
                    </div>
                    <div class="flex flex-wrap gap-y-1 items-end">
                        ${chk(d.Hx_Status, 'มี', 'มี ได้แก่')}
                        <div class="ml-2 grid grid-cols-4 gap-x-2 gap-y-1 w-full">
                            ${chk(d.Hx_List, 'ความดันโลหิตสูง', 'ความดันโลหิตสูง')} ${chk(d.Hx_List, 'โรคหัวใจ', 'โรคหัวใจ')}
                            ${chk(d.Hx_List, 'โรคตับ', 'โรคตับ')} ${chk(d.Hx_List, 'โรคไต', 'โรคไต')}
                            ${chk(d.Hx_List, 'เบาหวาน', 'เบาหวาน')} ${chk(d.Hx_List, 'หอบหืด', 'หอบหืด')}
                            ${chk(d.Hx_List, 'ลมชัก', 'ลมชัก')} ${chk(d.Hx_List, 'วัณโรค', 'วัณโรค')}
                            <div class="col-span-2">${chk(d.Hx_List, 'มะเร็ง', 'มะเร็ง')} ${dot(d.UD_Cancer_Detail, "100px")}</div>
                            <div class="col-span-2">อื่นๆ: ${dot(d.Hx_Other, "80%")}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-1 mt-1 border-t border-black pt-1">
                <div class="flex items-end"><span class="font-bold w-32">การแพ้ยา/สารต่าง ๆ :</span> ${chk(d.Allergy_Status, 'ไม่เคย', 'ไม่เคย')} ${chk(d.Allergy_Status, 'เคย', 'เคย(ระบุ)')} ${dot(d.Allergy_Details, "70%")}</div>
                
                <div class="flex items-end"><span class="font-bold w-40">การรักษาตัวในโรงพยาบาล:</span> ${chk(d.AdmitHx_Status, 'ไม่เคย', 'ไม่เคย')} ${chk(d.AdmitHx_Status, 'เคย', 'เคย ด้วยโรค')} ${dot(d.AdmitHx_Disease, "140px")} <span class="ml-2">เมื่อ</span> ${dot(formatDate(d.AdmitHx_Date), "80px")}</div>
                
                <div class="flex items-end"><span class="font-bold w-32">การผ่าตัด :</span> ${chk(d.Sx_Status, 'ไม่เคย', 'ไม่เคย')} ${chk(d.Sx_Status, 'เคย', 'เคย ผ่าตัด')} ${dot(d.Sx_Details, "140px")} <span class="ml-2">เมื่อ</span> ${dot(formatDate(d.Sx_Date), "80px")}</div>
                
                <div class="flex items-end"><span class="font-bold w-48">ประวัติการเจ็บป่วยในครอบครัว:</span> ${chk(d.FamilyHx_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.FamilyHx_Status, 'มี', 'มี(ระบุ)')} ${dot(d.FamilyHx_Details, "50%")}</div>
            </div>

            <div class="flex items-start mt-1 border-t border-black pt-1">
                <span class="font-bold w-20">สิ่งเสพติด :</span>
                <div class="flex-grow">
                    <div class="flex flex-wrap gap-4 mb-1">
                        <span class="font-bold w-10">สุรา</span>
                        ${chk(d.Substance_Alcohol, 'ไม่ดื่ม', 'ไม่ดื่ม')}
                        ${chk(d.Substance_Alcohol, 'ดื่มนานๆครั้ง', 'ดื่มนานๆครั้ง')}
                        ${chk(d.Substance_Alcohol, 'ดื่มเป็นประจำ', 'ดื่มเป็นประจำ ปริมาณ')} ${dot(d.Substance_Alcohol_Vol, "40px")} <span>ต่อวัน</span>
                    </div>
                    <div class="flex flex-wrap gap-4 mb-1">
                        <span class="font-bold w-10">บุหรี่</span>
                        ${chk(d.Substance_Smoke, 'ไม่สูบ', 'ไม่สูบ')}
                        ${chk(d.Substance_Smoke, 'สูบนานๆครั้ง', 'สูบนานๆครั้ง')}
                        ${chk(d.Substance_Smoke, 'สูบเป็นประจำ', 'สูบเป็นประจำ ปริมาณ')} ${dot(d.Substance_Smoke_Vol, "40px")} <span>มวน/วัน</span>
                    </div>
                </div>
            </div>
            <div class="flex items-end pt-1 border-t border-black"><span class="font-bold w-32">ยาที่ใช้ประจำ :</span> ${chk(d.Meds_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.Meds_Status, 'มี', 'มี(ระบุ)')} ${dot(d.Meds_Details, "100%")}</div>
        </div>

        <div class="grid grid-cols-3 border border-black mt-1 divide-x divide-black text-[12px] h-auto">
            <div class="p-1 flex flex-col justify-between">
                <div>
                    <div class="font-bold underline mb-1">1) การรับรู้เกี่ยวกับสุขภาพและการดูแล</div>
                    <div class="space-y-0.5">
                        <div class="flex flex-wrap items-end whitespace-nowrap">ก่อนเจ็บป่วยครั้งนี้: ${chk(d.HP_Before, 'ดี', 'ดี')} ${chk(d.HP_Before, 'ไม่ดี', 'ไม่ดี:')} ${dot(d.HP_Before_Detail, "30px")}</div>
                        <div class="flex flex-wrap items-end whitespace-nowrap">เจ็บป่วยครั้งนี้: ${chk(d.HP_Current, 'รุนแรง', 'รุนแรง')} ${chk(d.HP_Current, 'ไม่รุนแรง', 'ไม่รุนแรง')}</div>
                        <div class="flex flex-wrap whitespace-nowrap">การดูแล: ${chk(d.HP_Care, 'ไปรพ./คลินิก', 'ไปรพ./คลินิก')}</div>
                        <div class="flex flex-wrap whitespace-nowrap pl-10">${chk(d.HP_Care, 'ซื้อยารับประทาน', 'ซื้อยา')}</div>
                        <div class="whitespace-nowrap">${chk(d.HP_Care, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.HP_Care_Other, "60px")}</div>
                    </div>
                </div>
                <div class="flex flex-wrap items-end mt-1 whitespace-nowrap">ความคาดหวังในการรักษา: ${chk(d.HP_Expect, 'หาย', 'หาย')} ${chk(d.HP_Expect, 'ไม่แน่ใจ', 'ไม่แน่ใจ')} ${chk(d.HP_Expect, 'ไม่หาย', 'ไม่หาย')}</div>
            </div>

            <div class="p-1 flex flex-col justify-between">
                <div>
                    <div class="font-bold underline mb-1">2) โภชนาการและการเผาผลาญ</div>
                    <div class="space-y-0.5">
                        <div class="flex items-end whitespace-nowrap">รับประทานอาหาร ${dot(d.Nutri_Meals, "20px")} มื้อ/วัน</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Nutri_Type, 'อาหารธรรมดา', 'ธรรมดา')} ${chk(d.Nutri_Type, 'อาหารอ่อน', 'อ่อน')}</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Nutri_Type, 'อาหารทางสายยาง', 'สายยาง')}</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Nutri_Type, 'อาหารเฉพาะโรค', 'เฉพาะโรค:')} ${dot(d.Nutri_Type_Detail, "30px")}</div>
                        <div class="flex flex-wrap items-end whitespace-nowrap">ปัญหาการกิน: ${chk(d.Nutri_Problem, 'ไม่มี', 'ไม่มี')} ${chk(d.Nutri_Problem, 'มี', 'มี:')} ${dot(d.Nutri_Problem_Detail, "30px")}</div>
                    </div>
                </div>
                <div class="flex flex-wrap items-end mt-1 whitespace-nowrap">ผิวหนัง: ${chk(d.Nutri_Skin, 'ปกติ', 'ปกติ')} ${chk(d.Nutri_Skin, 'ไม่ปกติ', 'ไม่ปกติ:')} ${dot(d.Nutri_Skin_Detail, "30px")}</div>
            </div>

            <div class="p-1 flex flex-col justify-between">
                <div>
                    <div class="font-bold underline mb-1">3) การขับถ่าย</div>
                    <div class="space-y-0.5">
                        <div class="flex items-end whitespace-nowrap">ปัสสาวะ ${dot(d.Elim_Urine_Freq, "20px")} ครั้ง/วัน</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Elim_Urine_Status, 'ปกติ', 'ปกติ')} ${chk(d.Elim_Urine_Status, 'ไม่ปกติ', 'ไม่ปกติ:')} ${dot(d.Elim_Urine_Detail, "30px")}</div>
                        <div class="flex items-end mt-2 whitespace-nowrap">อุจจาระ ${dot(d.Elim_Bowel_Freq, "20px")} ครั้ง/วัน</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Elim_Bowel_Status, 'ปกติ', 'ปกติ')} ${chk(d.Elim_Bowel_Status, 'ไม่ปกติ', 'ไม่ปกติ:')} ${dot(d.Elim_Bowel_Detail, "30px")}</div>
                    </div>
                </div>
                <div class="flex flex-wrap items-end mt-1 whitespace-nowrap">ขับถ่ายทางหน้าท้อง: ${chk(d.Elim_Stoma, 'ไม่มี', 'ไม่มี')} ${chk(d.Elim_Stoma, 'มี', 'มี')}</div>
            </div>
        </div>
        <div class="border border-black border-t-0 p-1">
            <div class="font-bold mb-0.5">4) กิจวัตรประจำวัน</div>
            <table class="w-full border-collapse border border-black text-center text-[11px]">
                <tr class="bg-gray-100">
                    <th rowspan="2" class="border border-black w-[22%] text-left pl-2 align-middle">กิจกรรม</th>
                    <th colspan="3" class="border border-black">ก่อนการเจ็บป่วย</th>
                    <th colspan="3" class="border border-black">ขณะเจ็บป่วย</th>
                </tr>
                <tr class="bg-gray-50">
                    <th class="border border-black w-[13%]">ทำได้เอง</th>
                    <th class="border border-black w-[13%]">บางส่วน</th>
                    <th class="border border-black w-[13%]">ไม่ได้เลย</th>
                    <th class="border border-black w-[13%]">ทำได้เอง</th>
                    <th class="border border-black w-[13%]">บางส่วน</th>
                    <th class="border border-black w-[13%]">ไม่ได้เลย</th>
                </tr>
                ${['Eat', 'Brush', 'Dress', 'Walk', 'Toilet', 'Bath'].map((act, i) => {
                    const label = ['รับประทานอาหาร', 'ทำความสะอาดปาก/ฟัน', 'การแต่งตัว', 'การเดิน', 'การขับถ่าย', 'การอาบน้ำ'][i];
                    const b = d.ADL?.[`${act}_Before`];
                    const c = d.ADL?.[`${act}_Current`];
                    return `
                    <tr>
                        <td class="border border-black text-left pl-2">${label}</td>
                        <td class="border border-black font-bold">${checkADL(b, 'Independent')}</td>
                        <td class="border border-black font-bold">${checkADL(b, 'Partial')}</td>
                        <td class="border border-black font-bold">${checkADL(b, 'Dependent')}</td>
                        <td class="border border-black font-bold">${checkADL(c, 'Independent')}</td>
                        <td class="border border-black font-bold">${checkADL(c, 'Partial')}</td>
                        <td class="border border-black font-bold">${checkADL(c, 'Dependent')}</td>
                    </tr>`;
                }).join('')}
            </table>
        </div>

        <div class="border border-black border-t-0 p-1">
            <div class="font-bold mb-0.5 underline">5) การพักผ่อนนอนหลับ</div>
            <div class="flex flex-wrap items-end pl-2">
                <span>นอน:</span> ${dot(d.Sleep_Hours, "40px")} <span>ชั่วโมงต่อวัน</span>
                <span class="ml-6"></span>
                ${chk(d.Sleep_Adequacy, 'เพียงพอ', 'เพียงพอ')}
                ${chk(d.Sleep_Adequacy, 'ไม่เพียงพอ', 'ไม่เพียงพอ')}
                <span class="ml-6">ปัญหาการนอน:</span>
                ${chk(d.Sleep_Problem, 'ไม่มี', 'ไม่มี')}
                ${chk(d.Sleep_Problem, 'มี', 'มี ระบุ:')} ${dot(d.Sleep_Problem_Detail, "150px")}
            </div>
        </div>

        <div class="border border-black border-t-0 p-1 flex-grow">
            <div class="font-bold mb-0.5 underline">6) การรับรู้และประสาทสัมผัส</div>
            <div class="pl-2 space-y-0.5">
                <div class="flex flex-wrap items-end">
                    <span class="w-28 font-bold">ระดับความรู้สึก:</span>
                    ${chk(d.Cogn_LOC, 'รู้สึกตัวดี', 'รู้สึกตัวดี')}
                    ${chk(d.Cogn_LOC, 'สับสน', 'สับสน')}
                    ${chk(d.Cogn_LOC, 'ซึม', 'ซึม')}
                    ${chk(d.Cogn_LOC, 'ไม่รู้สึกตัว', 'ไม่รู้สึกตัว')}
                </div>
                <div class="flex flex-wrap items-end">
                    <span class="w-28 font-bold">การมองเห็น:</span>
                    ${chk(d.Cogn_Vision, 'ปกติ', 'ปกติ')}
                    ${chk(d.Cogn_Vision, 'สายตาสั้น', 'สายตาสั้น')}
                    ${chk(d.Cogn_Vision, 'สายตายาว', 'สายตายาว')}
                    ${chk(d.Cogn_Vision, 'ใช้แว่นตา', 'ใช้แว่นตา')}
                    ${chk(d.Cogn_Vision, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Cogn_Vision_Other, "80px")}
                </div>
                <div class="flex flex-wrap items-end">
                    <span class="w-28 font-bold">การได้ยิน:</span>
                    ${chk(d.Cogn_Hearing, 'Normal', 'ปกติ')}
                    ${chk(d.Cogn_Hearing, 'Partial', 'ได้ยินบางส่วน')}
                    ${chk(d.Cogn_Hearing, 'Deaf', 'ไม่ได้ยิน')}
                    ${chk(d.Cogn_Hearing, 'Other', 'อื่นๆ:')} ${dot(d.Cogn_Hearing_Other, "80px")}
                </div>
                <div class="flex flex-wrap items-end">
                    <span class="w-28 font-bold">การพูด:</span>
                    ${chk(d.Cogn_Speech, 'ปกติ', 'ปกติ')}
                    ${chk(d.Cogn_Speech, 'มีปัญหา', 'มีปัญหา:')} ${dot(d.Cogn_Speech_Detail, "120px")}
                    ${chk(d.Cogn_Speech, 'ใช้ภาษาต่างประเทศ', 'ใช้ภาษาต่างประเทศ:')} ${dot(d.Cogn_Speech_Other, "80px")}
                </div>
                <div class="flex flex-wrap items-end">
                    <span class="w-28 font-bold">การเคลื่อนไหว:</span>
                    ${chk(d.Cogn_Movement, 'ปกติ', 'ปกติ')}
                    ${chk(d.Cogn_Movement, 'ข้อติดแข็ง', 'ข้อติดแข็ง')}
                    ${chk(d.Cogn_Movement, 'อัมพาต', 'อัมพาต')}
                    ${chk(d.Cogn_Movement, 'ข้ออักเสบ', 'ข้ออักเสบ')}
                    ${chk(d.Cogn_Movement, 'กระดูกหัก', 'กระดูกหัก')}
                    ${chk(d.Cogn_Movement, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Cogn_Movement_Other, "80px")}
                </div>
            </div>
        </div>

    </div>
    `;

    // Final Assembly with Flexbox for Footer
    container.innerHTML = `
        <div class="flex flex-col justify-between h-full">
            <div>${contentHtml}</div>
            <div>
                ${footerHtml}
                <div class="text-right text-[10px] mt-2 font-bold font-sarabun text-black">- 1 -</div>
            </div>
        </div>
    `;
}

function renderForm004Page2(container, options = {}) {
    const d = options.data || {};
    const f = options.footer; 

    const boxCheck = (val, target) => {
        let isChecked = false;
        if (val) {
            if (Array.isArray(val)) {
                isChecked = val.includes(target);
            } else {
                const parts = String(val).split(',').map(s=>s.trim());
                isChecked = parts.includes(target);
            }
        }
        return `<span class="inline-block font-sarabun font-bold mr-1" style="font-family: 'Sarabun'; font-size: 14px;">[ ${isChecked ? '/' : '&nbsp;'} ]</span>`;
    };
    const chk = (val, target, label) => `<span class="inline-flex items-center mr-2 select-none whitespace-nowrap">${boxCheck(val, target)} ${label}</span>`;
    const dot = (val, w) => `<span class="border-b border-black border-dotted inline-block text-center whitespace-nowrap overflow-hidden text-blue-900 font-bold px-1" style="min-width: ${w};">${val || '&nbsp;'}</span>`;

    const getBScore = (val) => parseInt(val, 10) || 0;

    const totalBraden = getBScore(d.Braden_Sensory) + getBScore(d.Braden_Moisture) + 
                        getBScore(d.Braden_Activity) + getBScore(d.Braden_Mobility) + 
                        getBScore(d.Braden_Nutrition) + getBScore(d.Braden_Friction);
    
    const isRisk = (score, min, max) => {
        if (score === 0) return false;
        if (max === null) return score >= min;
        return score >= min && score <= max;
    };
    const chkRisk = (condition) => `[ <span class="font-bold">${condition ? '/' : '&nbsp;'}</span> ]`;

    let footerHtml = '';
    if (f) {
        footerHtml = `
        <div class="mt-4 pt-2 border-t border-gray-400 text-[10px] flex justify-between font-sarabun text-gray-600">
            <div>
                <div>ผู้พิมพ์ : ${f.name} ${f.position}</div>
                <div>วันที่พิมพ์ : ${f.date}</div>
            </div>
            <div class="text-right">
                <div>โปรแกรม IPD Nurse Workbench</div>
                <div>ระบบบันทึกเวชระเบียนทางการพยาบาล งานการพยาบาลผู้ป่วยใน</div>
            </div>
        </div>`;
    }

    let contentHtml = `
    <div class="flex justify-between items-end mb-1 border-b border-black pb-1 font-sarabun text-black">
       <div class="w-[15%]"></div>
       <div class="text-center w-[70%]">
          <h2 class="font-bold text-[18px]">แบบประเมินประวัติและประเมินสมรรถนะผู้ป่วย งานผู้ป่วยใน (ต่อ)</h2>
          <h3 class="font-bold text-[16px]">โรงพยาบาลสมเด็จพระยุพราชสว่างแดนดิน</h3>
       </div>
       <div class="w-[15%] text-right flex flex-col justify-end text-[10px]">
          <div class="font-bold text-[12px]">FR-IPD-004</div>
          <div>แก้ไขครั้งที่ 02 1 ม.ค. 2564</div>
       </div>
    </div>

    <div class="font-sarabun text-black text-[12px] leading-tight border border-black">
        
        <div class="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div class="p-1">
                <div class="font-bold underline mb-1">7) การรับรู้ตนเองและอัตมโนทัศน์: การเจ็บป่วยมีผลกระทบต่อ</div>
                <div class="space-y-1">
                    <div class="flex flex-wrap items-end">ภาพลักษณ์: ${chk(d.Self_Image, 'ไม่มี', 'ไม่มี')} ${chk(d.Self_Image, 'ไม่แน่ใจ', 'ไม่แน่ใจ')} ${chk(d.Self_Image, 'มี', 'มี:')} ${dot(d.Self_Image_Detail, "50px")}</div>
                    <div class="flex flex-wrap items-end">อารมณ์และจิตใจ: ${chk(d.Self_Mood, 'ไม่มี', 'ไม่มี')} ${chk(d.Self_Mood, 'ไม่แน่ใจ', 'ไม่แน่ใจ')} ${chk(d.Self_Mood, 'มี', 'มี:')} ${dot(d.Self_Mood_Detail, "50px")}</div>
                    <div class="flex flex-wrap items-end">ความสามารถดูแลตนเอง: ${chk(d.Self_Ability, 'ไม่มี', 'ไม่มี')} ${chk(d.Self_Ability, 'ไม่แน่ใจ', 'ไม่แน่ใจ')} ${chk(d.Self_Ability, 'มี', 'มี:')} ${dot(d.Self_Ability_Detail, "50px")}</div>
                </div>
            </div>
            <div class="p-1">
                <div class="font-bold underline mb-1">8) การเผชิญความเครียด / การปรับตัว</div>
                <div class="space-y-1">
                    <div class="flex flex-wrap">สิ่งที่ทำให้ไม่สบายใจ: ${chk(d.Stress_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.Stress_Status, 'มี', 'มี')}</div>
                    <div class="pl-4 flex flex-wrap gap-y-0.5">
                        ${chk(d.Stress_Causes, 'กลัวไม่หาย', 'กลัวไม่หาย')} ${chk(d.Stress_Causes, 'ค่ารักษาพยาบาล', 'ค่ารักษาพยาบาล')}
                        ${chk(d.Stress_Causes, 'ขาดงาน/รายได้', 'ขาดงาน/รายได้')} ${chk(d.Stress_Causes, 'ครอบครัว', 'ครอบครัว')}
                        ${chk(d.Stress_Causes, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Stress_Cause_Other, "50px")}
                    </div>
                    <div class="flex flex-wrap items-end">การแสดงออก: ${chk(d.Stress_Express, 'สีหน้าเรียบเฉย', 'สีหน้าเรียบเฉย')} ${chk(d.Stress_Express, 'วิตกกังวล', 'วิตกกังวล')} ${chk(d.Stress_Express, 'กลัว', 'กลัว')} ${chk(d.Stress_Express, 'ซึมเศร้า', 'ซึมเศร้า')}</div>
                    <div class="pl-4 flex flex-wrap items-end">${chk(d.Stress_Express, 'เอะอะโวยวาย', 'เอะอะโวยวาย')} ${chk(d.Stress_Express, 'หงุดหงิด', 'หงุดหงิด')} ${chk(d.Stress_Express, 'อื่นๆ', 'อื่น:')} ${dot(d.Stress_Express_Other, "50px")}</div>
                    <div class="flex flex-wrap items-end">วิธีแก้ไข: ${chk(d.Cope_Method, 'ปรึกษาผู้อื่น', 'ปรึกษาผู้อื่น')} ${chk(d.Cope_Method, 'แยกตัวเอง', 'แยกตัวเอง')} ${chk(d.Cope_Method, 'ใช้ยา', 'ใช้ยา')} ${chk(d.Cope_Method, 'อื่นๆ', 'อื่นๆ')} ${dot(d.Cope_Method_Other, "30px")}</div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div class="p-1">
                <div class="font-bold underline mb-1">9) บทบาทและสัมพันธภาพ: <span class="font-normal">การเจ็บป่วยครั้งนี้กระทบต่อบทบาท</span></div>
                <div class="flex flex-wrap gap-2">
                    ${chk(d.Roles, 'ครอบครัว', 'ครอบครัว')} ${chk(d.Roles, 'อาชีพ', 'อาชีพ')} ${chk(d.Roles, 'การศึกษา', 'การศึกษา')}
                </div>
                <div class="flex flex-wrap mt-1">
                    ${chk(d.Roles, 'สัมพันธภาพในครอบครัวและผู้อื่น', 'สัมพันธภาพในครอบครัวและผู้อื่น')}
                </div>
            </div>
            <div class="p-1">
                <div class="font-bold underline mb-1">10) เพศและการเจริญพันธุ์</div>
                <div class="flex flex-wrap items-end">ประจำเดือน: ${chk(d.Sex_Menses, 'ปกติ', 'ปกติ')} ${chk(d.Sex_Menses, 'ไม่ปกติ', 'ไม่ปกติ')} ${dot(d.Sex_Menses_Status, "80px")}</div>
                <div class="flex flex-wrap items-end">เต้านม: ${chk(d.Sex_Breast, 'ปกติ', 'ปกติ')} ${chk(d.Sex_Breast, 'ไม่ปกติ', 'ไม่ปกติ')}</div>
                <div class="flex flex-wrap items-end">อวัยวะสืบพันธุ์: ${chk(d.Sex_Genitals, 'ปกติ', 'ปกติ')} ${chk(d.Sex_Genitals, 'ไม่ปกติ', 'ไม่ปกติ')} ${dot(d.Sex_Genitals_Detail, "80px")}</div>
            </div>
        </div>

        <div class="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div class="p-1">
                <div class="font-bold underline mb-1">11) คุณค่าและความเชื่อ</div>
                <div class="space-y-1">
                    <div class="flex flex-wrap items-end">การเจ็บป่วยครั้งนี้เชื่อว่า: ${chk(d.Belief_Cause, 'การปฏิบัติตัวไม่ถูกต้อง', 'การปฏิบัติตัวไม่ถูกต้อง')} ${chk(d.Belief_Cause, 'เคราะห์กรรม', 'เคราะห์กรรม')}</div>
                    <div class="pl-4 flex flex-wrap items-end">${chk(d.Belief_Cause, 'ตามวัย', 'ตามวัย')} ${chk(d.Belief_Cause, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Belief_Cause_Detail, "50px")}</div>
                    <div class="flex flex-wrap items-end">ต้องการปฏิบัติศาสนกิจ: ${chk(d.Religion_Practice, 'ไม่มี', 'ไม่มี')} ${chk(d.Religion_Practice, 'ต้องการ', 'ต้องการ:')} ${dot(d.Religion_Practice_Detail, "80px")}</div>
                    <div class="flex flex-wrap items-end">สิ่งยึดเหนี่ยวทางจิตใจ: ${chk(d.Belief_Anchor_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.Belief_Anchor_Status, 'มี', 'มี:')} ${dot(d.Belief_Anchor_Detail, "80px")}</div>
                </div>
            </div>
            <div class="p-1">
                <div class="font-bold underline mb-1">12) การมีส่วนร่วมของผู้ป่วยและญาติในการรักษาพยาบาล</div>
                <div>${chk(d.Partic_Status, 'ไม่ต้องการ', 'ไม่ต้องการ')}</div>
                <div class="flex flex-wrap items-start">
                    ${chk(d.Partic_Status, 'ต้องการ', 'ต้องการ:')} 
                    <div class="flex flex-col ml-1">
                        ${chk(d.Partic_Needs, 'Info', 'ทราบข้อมูลเรื่องโรคและแนวทางรักษาพยาบาล')}
                        ${chk(d.Partic_Needs, 'Skill', 'เรียนรู้ทักษะดูแลตนเอง/ผู้ป่วย')}
                        ${chk(d.Partic_Needs, 'Team', 'ร่วมกับทีมสุขภาพในการดูแลผู้ป่วยระหว่างอยู่ใน รพ.')}
                        <div class="flex items-end">${chk(d.Partic_Other, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Partic_Other, "80px")}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-1 border-b border-black">
            <div class="font-bold text-[14px]">13. PAIN MANAGEMENT</div>
            <div class="flex flex-wrap items-end gap-4">
                <div>Pain: ${chk(d.Pain_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.Pain_Status, 'มี', 'มี')}</div>
                <div>บริเวณที่ปวด ${dot(d.Pain_Location, "150px")}</div>
                <div>สาเหตุ ${dot(d.Pain_Cause, "150px")}</div>
            </div>
            <div class="flex flex-wrap items-end gap-4 mt-1">
                <div>ลักษณะ: ${chk(d.Pain_Pattern, 'ครั้งคราว', 'ครั้งคราว')} ${chk(d.Pain_Pattern, 'ตลอดเวลา', 'ตลอดเวลา')}</div>
                <div class="flex items-center">
                    <span class="mr-2">Pain Scale:</span>
                    ${[0,1,2,3,4,5,6,7,8,9,10].map(n => chk(String(d.Pain_Scale_Score), String(n), n)).join(' ')}
                </div>
            </div>
            
            <div class="my-1 flex justify-center">
                <img src="https://www.mosio.com/wp-content/uploads/2018/10/color-pain-scale-with-faces-1030x417.png" style="height: 60px; max-width: 100%;">
            </div>

            <div class="flex flex-wrap mt-1 gap-2">
                <span class="font-bold">การปวดกระทบต่อ:</span>
                ${chk(d.Pain_Effects, 'Eat', 'การกิน')} ${chk(d.Pain_Effects, 'Sleep', 'การนอน')}
                ${chk(d.Pain_Effects, 'Activity', 'การทำกิจกรรม')} ${chk(d.Pain_Effects, 'Mood', 'อารมณ์/สังคม')}
                ${chk(d.Pain_Effects, 'Elim', 'การขับถ่าย')} ${chk(d.Pain_Effects, 'Sex', 'เพศสัมพันธุ์')}
            </div>
            <div class="flex flex-wrap mt-1 gap-2">
                <span class="font-bold">สิ่งที่บรรเทาปวด:</span>
                ${chk(d.Pain_Relief, 'Cold', 'Cold compress')} ${chk(d.Pain_Relief, 'Hot', 'Hot compress')}
                ${chk(d.Pain_Relief, 'Massage', 'Massage')} ${chk(d.Pain_Relief, 'Relax', 'Relaxation')}
                ${chk(d.Pain_Relief, 'Repo', 'Reposition')} ${chk(d.Pain_Relief, 'Rest', 'Rest/Sleep')}
                ${chk(d.Pain_Relief, 'Meds', 'Medication')}
            </div>
        </div>

        <div class="p-1 border-b border-black">
            <div class="font-bold text-[14px] mb-1">14. Braden Scale (Predicting Pressure Sore Risk)</div>
            
            <table class="w-full border-collapse border border-black text-center text-[10px]">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-black p-1 text-left w-[13%]">Parameter</th>
                        <th class="border border-black p-1 w-[13%]">1</th>
                        <th class="border border-black p-1 w-[13%]">2</th>
                        <th class="border border-black p-1 w-[13%]">3</th>
                        <th class="border border-black p-1 w-[13%]">4</th>
                        <th class="border border-black p-1 w-[13%] bg-blue-50">Score</th>
                    </tr>
                </thead>
                <tbody>
                ${[
                    ['การรับรู้/ความรู้สึก', 'จำกัดทั้งหมด', 'มีความจำกัดมาก', 'มีความจำกัดเล็กน้อย', 'ไม่บกพร่อง', d.Braden_Sensory],
                    ['ความเปียกชื้น', 'เปียกชื้นตลอดเวลา', 'เปียกชื้นมาก', 'เปียกชื้นบางคาั้ง', 'เปียกชื้นน้อยมาก', d.Braden_Moisture],
                    ['กิจกรรม', 'นอนอยู่กับที่ตลอดเวลา', 'เดินไม่ได้/นั่งรถเข็น', 'เดินได้เป็นบาง', 'เดินปกติ<br>(Walks Frequently)', d.Braden_Activity],
                    ['การเคลื่อนไหว', 'เคลื่อนไหวเองไม่ได้', 'เคลื่อนไหวเองได้น้อย', 'เคลื่อนไหวเองได้บ้าง', 'เคลื่อนไหวเองได้ปกติ', d.Braden_Mobility],
                    ['โภชนาการ', 'ไม่เพียงพอ', 'อาจไม่เพียงพอเกือบทุกมื้อ', 'เพียงพอ', 'ดีเยี่ยม)', d.Braden_Nutrition],
                    ['แรงเสียดทาน', 'มีปัญหา', 'เสี่ยงต่อการเกิดปัญหา', 'ไม่มีปัญหา', '', d.Braden_Friction]
                ].map((row, idx) => {
                    const score = getBScore(row[5]); 
                    const b1 = score == 1 ? 'font-bold bg-gray-200' : '';
                    const b2 = score == 2 ? 'font-bold bg-gray-200' : '';
                    const b3 = score == 3 ? 'font-bold bg-gray-200' : '';
                    const b4 = score == 4 ? 'font-bold bg-gray-200' : '';
                    
                    const td4 = idx === 5 ? '<td class="border border-black p-1 bg-gray-100"></td>' 
                                          : `<td class="border border-black p-1 align-middle ${b4}">${row[4]}</td>`;

                    return `
                    <tr>
                        <td class="border border-black text-left pl-2 align-middle">${row[0]}</td>
                        <td class="border border-black p-1 align-middle ${b1}">${row[1]}</td>
                        <td class="border border-black p-1 align-middle ${b2}">${row[2]}</td>
                        <td class="border border-black p-1 align-middle ${b3}">${row[3]}</td>
                        ${td4}
                        <td class="border border-black font-bold align-middle text-[12px] text-blue-800">${score || '-'}</td>
                    </tr>`;
                }).join('')}
                </tbody>
            </table>
            
            <div class="flex justify-end mt-2 items-center gap-4 text-[12px]">
                <div class="flex items-center">
                    <span class="font-bold text-[14px] mr-2">Total Score:</span> 
                    <span class="border border-black px-2 py-1 w-12 text-center font-bold bg-white text-[16px]">${totalBraden || 0}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="font-bold">การแปลผล:</span>
                    ${chkRisk(isRisk(totalBraden, 0, 9))} ≤ 9 Very high
                    ${chkRisk(isRisk(totalBraden, 10, 12))} 10-12 High
                    ${chkRisk(isRisk(totalBraden, 13, 14))} 13-14 Moderate
                    ${chkRisk(isRisk(totalBraden, 15, null))} ≥ 15 Low
                </div>
            </div>
        </div>

        <div class="p-1">
            <div class="font-bold text-[14px]">15. Fall risk assessment</div>
            <div class="flex flex-wrap gap-4">
                ${chk(String(d.Fall_Age_Child).toLowerCase(), 'true', 'วัยเด็ก')} 
                ${chk(String(d.Fall_Age_Elder).toLowerCase(), 'true', 'ผู้สูงอายุมากกว่า 65 ปี')}
            </div>
            <div class="grid grid-cols-2 gap-x-4 mt-1">
                <div class="flex justify-between"><span>สภาวะทางสมอง/ทางจิตผิดปกติ</span> <div>${chk(d.Fall_Mental, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Mental, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>มีปัญหาในการมองเห็น</span> <div>${chk(d.Fall_Vision, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Vision, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>มีประวัติการพลัดตกหกล้ม</span> <div>${chk(d.Fall_History, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_History, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>มีปัญหาในการเดิน/ทรงตัว</span> <div>${chk(d.Fall_Gait, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Gait, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>ใช้ยานอนหลับ / Psychotropics</span> <div>${chk(d.Fall_Meds, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Meds, 'มี', 'มี')}</div></div>
                <div class="flex justify-between font-bold"><span>จำเป็นต้องได้รับการป้องกัน</span> <div>${chk(d.Fall_Prevention, 'จำเป็น', 'จำเป็น')} ${chk(d.Fall_Prevention, 'ไม่จำเป็น', 'ไม่จำเป็น')}</div></div>
            </div>
        </div>

    </div>

    <div class="mt-6 flex justify-end px-10 text-[12px] font-sarabun text-black">
        <div class="flex items-end">
            <span class="font-bold">ลงชื่อผู้ประเมิน/ผู้บันทึก</span>
            <span class="mx-2 border-b border-black border-dotted min-w-[150px] text-center">${d.Assessor_Name || '&nbsp;'}</span>
            <span class="font-bold ml-2">ตำแหน่ง</span>
            <span class="mx-2 border-b border-black border-dotted min-w-[150px] text-center">${d.Assessor_Position || '&nbsp;'}</span>
        </div>
    </div>
    `;

    container.innerHTML = `
        <div class="flex flex-col justify-between h-full">
            <div>${contentHtml}</div>
            <div>
                ${footerHtml}
                <div class="text-right text-[10px] mt-2 font-bold font-sarabun text-black">- 2 -</div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------------------
// (11) DOMContentLoaded Listener
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    updateClock(); 
    setInterval(updateClock, 1000);
    loadWards();

    const closeButtons = [
        { btn: "close-admit-modal-btn", modal: "admit-modal" },
        { btn: "cancel-admit-btn", modal: "admit-modal" },
        { btn: "close-details-modal-btn", modal: "details-modal" },
        { btn: "close-assessment-modal-btn", modal: "assessment-modal" },
        { btn: "close-assessment-modal-btn-bottom", modal: "assessment-modal" },
        { btn: "close-classify-modal-btn", modal: "classify-modal" },
        { btn: "close-focus-modal-btn", modal: "focus-problem-modal" },
        { btn: "cancel-focus-btn", modal: "focus-problem-modal" },
        { btn: "close-progress-modal-btn", modal: "progress-note-modal" },
        { btn: "close-discharge-modal-btn", modal: "discharge-form-modal" },
        { btn: "close-advice-modal-btn", modal: "advice-form-modal" },
        { btn: "close-morse-modal-btn", modal: "morse-modal" },
        { btn: "close-braden-modal", modal: "braden-modal" }
    ];

    closeButtons.forEach(item => {
        const btn = document.getElementById(item.btn);
        if (btn) {
            btn.addEventListener("click", () => closeModal(item.modal));
        }
    });

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('bg-black')) {
            e.target.classList.add("hidden");
        }
    });

    try {
        if (typeof renderADLTable === "function") renderADLTable();
        if (typeof renderBradenInitial === "function") renderBradenInitial();
        if (typeof renderBradenMonitoring === "function") renderBradenMonitoring({}); 
    } catch (e) { console.warn("Initial table rendering warning:", e); }

    if (wardSwitcher) {
        wardSwitcher.addEventListener("change", (e) => { selectWard(e.target.value); });
    }

    patientTableBody.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'A' && target.dataset.an) {
            e.preventDefault(); 
            openDetailsModal(target.dataset.an);
        }
        if (target.classList.contains('chart-btn') && target.dataset.an) {
            e.preventDefault(); 
            openChart(target.dataset.an, target.dataset.hn, target.dataset.name, target.dataset.bed, target.dataset.doctor);
        }
    });

    if (openAdmitModalBtn) openAdmitModalBtn.addEventListener("click", openAdmitModal);
    if (closeAdmitModalBtn) closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
    if (admitForm) admitForm.addEventListener("submit", handleAdmitSubmit);

    admitDobInput.addEventListener("change", () => {
        const beDate = convertCEtoBE(admitDobInput.value);
        if (admitAgeInput) admitAgeInput.value = calculateAge(beDate);
    });

    if (closeDetailsModalBtn) closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
    if (editPatientBtn) editPatientBtn.addEventListener("click", enableEditMode);
    if (detailsForm) detailsForm.addEventListener("submit", handleUpdateSubmit);

    detailsDobInput.addEventListener("change", () => {
        const beDate = convertCEtoBE(detailsDobInput.value);
        if (detailsAgeInput) detailsAgeInput.value = calculateAge(beDate);
    });

    if (closeChartBtn) closeChartBtn.addEventListener("click", closeChart);

    chartPage.addEventListener('click', (e) => {
        const targetItem = e.target.closest('.chart-list-item');
        if (targetItem) {
            const formType = targetItem.dataset.form;
            chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
            targetItem.classList.add('bg-indigo-100');
            showFormPreview(formType);
        }
    });

    chartEditBtn.addEventListener('click', (e) => {
        const formType = e.currentTarget.dataset.form; 
        if (formType === '004') openAssessmentForm();
        else if (formType === 'morse_maas') openMorseModal();
        else if (formType === 'braden') openBradenModal();
        else if (formType === 'advice') openAdviceModal(currentAdviceData);
        else showComingSoon();
    });

    chartAddNewBtn.addEventListener('click', (e) => {
        const formType = e.target.dataset.form;
        if (formType === 'classify') openClassifyModal();
        else if (formType === '005') openFocusProblemModal(); 
        else if (formType === '006') openProgressNoteModal();
        else showComingSoon(); 
    });

    if (assessmentForm) {
        assessmentForm.addEventListener("submit", handleSaveAssessment);
        
        assessmentForm.addEventListener('change', (e) => {
            if (e.target.classList.contains('braden-score')) {
                let total = 0;
                assessmentForm.querySelectorAll('.braden-score:checked').forEach(r => total += parseInt(r.value));
                const totalInp = document.getElementById("braden-total-score");
                if (totalInp) {
                    totalInp.value = total;
                    // Logic Update Risk Text (Local)
                    const resEl = document.getElementById("braden-result");
                    if (resEl) {
                        if (total <= 9) resEl.textContent = "Very high risk (<= 9)";
                        else if (total <= 12) resEl.textContent = "High risk (10-12)";
                        else if (total <= 14) resEl.textContent = "Moderate risk (13-14)";
                        else if (total <= 18) resEl.textContent = "Low risk (15-18)";
                        else resEl.textContent = "No risk (> 18)";
                    }
                }
            }
            
            if (e.target.classList.contains('assessment-radio-toggle')) {
                const groupName = e.target.name;
                const form = e.target.closest('form');
                form.querySelectorAll(`[name="${groupName}"]`).forEach(sibling => {
                    const tid = sibling.dataset.controls;
                    if (tid) form.querySelector(`#${tid}`)?.classList.add('hidden');
                });
                const targetId = e.target.dataset.controls;
                if (e.target.checked && targetId) {
                    form.querySelector(`#${targetId}`)?.classList.remove('hidden');
                }
            }
        });
    }

    document.body.addEventListener('input', (e) => {
        if (e.target.list && e.target.list.id === 'staff-list-datalist') {
            const staff = globalStaffList.find(s => s.fullName === e.target.value.trim());
            if (staff) {
                const parentForm = e.target.closest('form') || document;
                const posInput = parentForm.querySelector('[name*="Position"]') || 
                                 parentForm.querySelector('[name*="Pos"]') ||
                                 document.getElementById('assessor-position') ||
                                 document.getElementById('discharge-nurse-pos');
                if (posInput) posInput.value = staff.position;
            }
        }
    });

    const bForm = document.getElementById("braden-form");
    if (bForm) {
        bForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (typeof handleSaveBradenMonitoring === "function") {
                handleSaveBradenMonitoring();
            }
        });
    }

    const mPrev = document.getElementById("morse-prev-page-btn");
    const mNext = document.getElementById("morse-next-page-btn");
    if(mPrev) mPrev.addEventListener("click", () => {
        if(currentMorsePage > 1) { currentMorsePage--; fetchAndRenderMorsePage(currentPatientAN, currentMorsePage); }
    });
    if(mNext) mNext.addEventListener("click", () => {
        currentMorsePage++; fetchAndRenderMorsePage(currentPatientAN, currentMorsePage);
    });

    const classifyPrevBtn = document.getElementById("classify-prev-page-btn");
    const classifyNextBtn = document.getElementById("classify-next-page-btn");
    const classifyAddBtn = document.getElementById("classify-add-page-btn");

    if (classifyPrevBtn) {
        classifyPrevBtn.addEventListener("click", () => {
            changeClassifyPage(-1); 
        });
    }

    if (classifyNextBtn) {
        classifyNextBtn.addEventListener("click", () => {
            changeClassifyPage(1); 
        });
    }

    if (classifyAddBtn) {
        classifyAddBtn.addEventListener("click", () => {
            changeClassifyPage(1); 
        });
    }
});
