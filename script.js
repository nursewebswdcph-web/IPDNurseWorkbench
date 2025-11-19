// =================================================================
// == IPD Nurse Workbench script.js (Final Corrected Version 2.8)
// =================================================================

// ----------------------------------------------------------------
// (1) URL ของ Google Apps Script
// ----------------------------------------------------------------
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymniWtx3CC7M_Wf0QMK-I80d6A2riIDQRRMpMy3IAoGMpYw0_gFuOXMuqWjThVHFHP2g/exec";
// ----------------------------------------------------------------
// (2) Constants & Configs
// ----------------------------------------------------------------
const CLASSIFY_CRITERIA = {
  "1": {
    title: "1. สัญญาณชีพ",
    4: "ผิดปกติ โดยมีการเปลี่ยนแปลงตลอดเวลาหรือรวดเร็ว ของ T/P/R/BP ต้องเฝ้าระวังทุก 15 นาที - 1 ชั่วโมง",
    3: "ผิดปกติ แต่ควบคุมได้/ปกติ แต่มีโอกาสเปลี่ยนแปลงได้ง่าย ต้องเฝ้าระวัง ทุก 2-4 ชั่วโมง",
    2: "ผิดปกติ แต่มีโอกาสเปลี่ยนแปลงได้ง่าย ต้องเฝ้าระวัง ทุก 4 - 6 ชั่วโมง",
    1: "คงที่ มีโอกาสเปลี่ยนแปลงได้น้อย ต้องเฝ้าระวัง 1 - 2 ครั้ง/วัน"
  },
  "2": {
    title: "2. อาการแสดงทางระบบประสาท",
    4: "มีการเปลี่ยนแปลงตลอดเวลา ต้องเฝ้าระวังทุก 1 ชั่วโมง / 1 - 2 ชั่วโมง",
    3: "ผิดปกติ แต่ควบคุมได้และมีโอกาสเปลี่ยนแปลง ต้องเฝ้าระวังทุก 2-4 ชั่วโมง",
    2: "ปกติ หรือคงที่ ที่มีโอกาสเปลี่ยนแปลง ต้องเฝ้าระวังเวรละ 1 ครั้ง",
    1: "ปกติ หรือคงที่"
  },
  "3": {
    title: "3. การได้รับการตรวจรักษาด้วยการผ่าตัด/หัตถการฯ",
    4: "- มีหัตถการฉุกเฉินต่ออวัยวะที่สำคัญต่อการมีชีวิต เช่น CPR, Hemodialysis, Cut down emergency, ICU, SB tube, Blood exchange\n- ผ่าตัดสมอง ปอด ตับ ไต หรืออวัยวะที่สำคัญต่อการมีชีวิต ภายใน 24 ชั่วโมงแรก ที่ยังไม่สามารถควบคุมอาการได้\n- ผ่าตัดใหญ่อวัยวะอื่น ที่ไม่สามารถควบคุมการเปลี่ยนแปลงได้\n- ใช้อุปกรณ์ช่วยชีวิตในระยะแรกที่ต้องเฝ้าระวังใกล้ชิด และมีการปรับการทำงานของอุปกรณ์ตามการเปลี่ยนแปลงของผู้ป่วย เช่น ใช้เครื่องช่วยหายใจ CPAP Wean O2 ระยะแรก  HFNC",
    3: "- มีหัตถการเร่งด่วน เช่น ICD, Hemodialysis ในรายที่มีอาการคงที่, เจาะปอด PD เจาะท้อง, Sepsis ที่ควบคุมอาการได้\n- หลังผ่าตัดสมอง ปอด ตับ ไต หรืออวัยวะที่สำคัญต่อการมีชีวิต 24 - 48 ชั่วโมง\n- ใช้อุปกรณ์ช่วยชีวิตในระยะควบคุมอาการได้ หรือปรับการทำงานของอุปกรณ์น้อยลง หรือเตรียมวางแผนปรับลดการใช้ เช่น O2 mask c bag,",
    2: "- มีหัตถการฉุกเฉินต่ออวัยวะที่สำคัญแบบไม่ฉุกเฉิน เช่น เจาะปอด, LP ส่องตรวจ\n- หลังผ่าตัดสมอง ปอด ตับ ไต หรืออวัยวะที่สำคัญต่อการมีชีวิต 48-72 ชั่วโมง ที่อาการคงที่ หรือหลังผ่าตัดใหญ่ที่ควบคุมอาการได้ 24-48 ชั่วโมงแรก\n- ใช้อุปกรณ์เพื่อช่วยชีวิต แต่ไม่ต้องปรับการทำงานของอุปกรณ์ แต่เฝ้าระวัง, เพื่อวางแผนปรับลดการใช้อุปกรณ์ เช่น O2 canular",
    1: "- มีหัตถการทั่วไป เช่น เจาะเลือด ใส่สายสวนปัสสาวะ ผ่าฝี\n- ได้รับการตรวจรักษาทั่วไปที่ไม่ใช้วิธีการตรวจพิเศษ\n- หลังผ่าตัดในระยะพักฟื้นและไม่มีภาวะแทรกซ้อน\n- ไม่มีการใช้อุปกรณ์พิเศษเพื่อช่วยชีวิต"
  },
  "4": {
    title: "4. พฤติกรรมที่ผิดปกติ อารมณ์ จิตสังคม",
    4: "- พฤติกรรมผิดปกติรุนแรง ควบคุมไม่ได้/มีโอกาสจะฆ่าตัวตาย/ไม่สามารถแสดงพฤติกรรมการรับรู้ได้\n- พฤติกรรมผิดปกติด้านการปรับตัวทางอารมณ์และจิตสังคมที่รุนแรง เช่น ต่อต้านการรักษา ดึง ETT, ดึง NG tube",
    3: "- พฤติกรรมผิดปกติรุนแรง ควบคุมไม่ได้\n- ซึมเศร้า ปรับตัวไม่ได้ ปฏิเสธการรักษา",
    2: "- พฤติกรรมผิดปกติ แต่ควบคุมตนเองได้ เครียด วิตกกังวล",
    1: "- ไม่มีปัญหาการปรับตัว"
  },
  "5": {
    title: "5. ความสามารถในการปฏิบัติกิจวัตรประจำวัน",
    4: "ไม่สามารถปฏิบัติกิจวัตรประจำวันด้วยตนเอง 3 ใน 4 ข้อ (อาหาร, เคลื่อนไหว, ความสะอาด และขับถ่าย)",
    3: "ไม่สามารถปฏิบัติด้วยตนเอง ต้องทดแทนส่วนมากอย่างน้อย 2 ใน 4 ข้อ",
    2: "สามารถช่วยเหลือตนเองได้บ้าง ต้องทดแทนบางส่วน",
    1: "สามารถช่วยเหลือตนเองได้ทั้งหมด"
  },
  "6": {
    title: "6. ความต้องการการสนับสนุนด้านจิตใจและอารมณ์ฯ",
    4: "กลัวและวิตกกังวลสูงมาก/ได้รับความกระทบกระเทือนจิตใจรุนแรง/ต้องการข้อมูลที่ชัดเจน/เจาะจง/ ไม่ยอมรับสภาพความเจ็บป่วย/ไม่เข้าใจการรักษา/ไม่สนใจตนเอง สิ้นหวัง",
    3: "วิตกกังวลสูง ต้องการข้อมูลที่ชัดเจนเพื่อการตัดสินใจ/การดูแลตนเอง",
    2: "วิตกกังวลเล็กน้อย ต้องการข้อมูลเพื่อควบคุมอาการ/การดูแลตนเอง",
    1: "ต้องการคำแนะนำทั่วไป เช่น กฎระเบียบ, การดูแลตนเอง เมื่อเจ็บป่วย"
  },
  "7": {
    title: "7. ความต้องการยา การรักษา/หัตถการและการฟื้นฟู",
    4: "ได้รับยาทางหลอดเลือดดำที่มีผลต่ออวัยวะที่สำคัญต่อการมีชีวิตและ/หรือต้องเฝ้าระวังอย่างใกล้ชิด/มีการให้ต้องได้รับการบำบัดทดแทน ที่มีบันทึกทุก 15 นาที - 1 ชั่วโมง เช่น ยา HAD ให้เลือดผู้ป่วยที่เสียเลือด พ่นยาทุก 30 นาที - 1 ชั่วโมง",
    3: "- ต้องการการปฏิบัติที่ใช้ทักษะเฉพาะ หัตถการที่ปฏิบัติบ่อยมาก เช่น ทำแผลขนาดใหญ่/ซับซ้อน/ดูดเสมหะทุก 15 นาที - 1 ชั่วโมง / เจาะ Hct, DTX ทุก 1 ชั่วโมง การ Dilate ม่านตา/ Nasal packing\n- ภายหลังได้รับหัตถการต้องต่ออวัยวะที่สำคัญต่อชีวิต ต้องการเฝ้าระวังอย่างใกล้ชิด เช่น เจาะตับ, เจาะ ABG\n- ได้รับยาที่ต้องประเมิน/ช่วยเหลือ/เฝ้าระวังก่อนและหลังการให้ยา เช่น ยาปรับระดับน้ำตาล BP, ชีพจร/ให้เลือดผู้ป่วยซีด/พ่นยาทุก 2-4 ชั่วโมง /Stat order\n- ต้องการช่วยเหลือที่ใช้ทักษะเฉพาะทางไม่ยุ่งยาก ต้องปฏิบัติบ่อย เช่น ทำแผลพื้นที่จำนวนมาก/เช็ดตา/ดูดเสมหะ/เจาะ Hct, DTX ทุก 2-4 ชั่วโมง\n- หัตถการทั่วไป เช่น สวนปัสสาวะ อุจจาระ สวนล้างช่องคลอด ล้างกระเพาะอาหาร ใส่เผือก Skin traction ครั้งแรก",
    2: "- ได้รับยาเพื่อการรักษา/ควบคุมอาการทั่วไป ต้องเฝ้าระวังตามปกติหรือมีอุปกรณ์ที่ต้องการดูแลไม่ยุ่งยากซับซ้อน การทำ Passive, active exercise / เจาะ Hct, DTX ทุก 6-12 ชั่วโมง การให้ยาชนิดฉีด/การให้สารน้ำทางหลอดเลือดดำ",
    1: "ได้รับยาที่ใช้รักษา/ควบคุมอาการในลักษณะประจำ/ต้องการกระตุ้นการดูแลตนเอง"
  },
  "8": {
    title: "8. ความต้องการการบรรเทาอาการรบกวน",
    4: "ทุกข์ทรมานจากอาการรบกวนรุนแรงควบคุมไม่ได้/พักผ่อน/เกิดความเครียดมาก ต้องเฝ้าระวัง อย่างน้อยทุก 1 ชั่วโมง",
    3: "มีอาการรบกวนรุนแรง ควบคุมได้ ต้องการเฝ้าระวังทุก 2-4 ชั่วโมง",
    2: "มีอาการรบกวนที่ควบคุมได้ ต้องเฝ้าระวังเวรละ 1 ครั้ง",
    1: "มีอาการรบกวนเล็กน้อย ควบคุมได้ ไม่ต้องการการเฝ้าระวัง หรือไม่มีอาการรบกวนเลย"
  }
};

// ----------------------------------------------------------------
// (3) Global Variables
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

// ----------------------------------------------------------------
// (4) DOM Element Variables
// ----------------------------------------------------------------
const wardSelectionPage = document.getElementById("ward-selection");
const registryPage = document.getElementById("registry-page");
const wardGrid = document.getElementById("ward-grid");
const wardHeaderTitle = document.getElementById("ward-header-title");
const wardSwitcher = document.getElementById("ward-switcher");
const patientTableBody = document.getElementById("patient-table-body");
const clockElement = document.getElementById("realtime-clock");

// (Admit Modal)
const admitModal = document.getElementById("admit-modal");
const openAdmitModalBtn = document.getElementById("open-admit-modal-btn");
const closeAdmitModalBtn = document.getElementById("close-admit-modal-btn");
const cancelAdmitBtn = document.getElementById("cancel-admit-btn");
const admitForm = document.getElementById("admit-form");
const admitDobInput = document.getElementById("admit-dob");
const admitAgeInput = document.getElementById("admit-age");

// (Details Modal)
const detailsModal = document.getElementById("details-modal");
const closeDetailsModalBtn = document.getElementById("close-details-modal-btn");
const detailsForm = document.getElementById("details-form");
const detailsFieldset = document.getElementById("details-fieldset");
const editPatientBtn = document.getElementById("edit-patient-btn");
const saveDetailsBtn = document.getElementById("save-details-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const dischargeBtn = document.getElementById("discharge-btn");
const detailsBedDisplay = document.getElementById("details-bed-display");
const detailsBedSelect = document.getElementById("details-bed-select");
const detailsDobInput = document.getElementById("details-dob");
const detailsAgeInput = document.getElementById("details-age");
const transferWardBtn = document.getElementById("transfer-ward-btn");

// (Chart Page)
const chartPage = document.getElementById("chart-page");
const closeChartBtn = document.getElementById("close-chart-btn");
const chartAnDisplay = document.getElementById("chart-an-display");
const chartHnDisplay = document.getElementById("chart-hn-display");
const chartNameDisplay = document.getElementById("chart-name-display");

// (Chart Preview Area)
const chartPreviewTitle = document.getElementById("chart-preview-title");
const chartPreviewContent = document.getElementById("chart-preview-content");
const chartPreviewPlaceholder = document.getElementById("chart-preview-placeholder");
const chartEditBtn = document.getElementById("chart-edit-btn");
const chartAddNewBtn = document.getElementById("chart-add-new-btn");
const chartBedDisplay = document.getElementById("chart-bed-display");
const chartDoctorDisplay = document.getElementById("chart-doctor-display");

// (Assessment Modal)
const assessmentModal = document.getElementById("assessment-modal");
const assessmentForm = document.getElementById("assessment-form");
const closeAssessmentModalBtn = document.getElementById("close-assessment-modal-btn");
const assessAnDisplay = document.getElementById("assess-an-display");
const assessNameDisplay = document.getElementById("assess-name-display");
const assessorNameSelect = document.getElementById("assessor-name");
const assessorPositionInput = document.getElementById("assessor-position");

// (Classification Modal)
const classifyModal = document.getElementById("classify-modal");
const classifyForm = document.getElementById("classify-form");
const classifyAnDisplay = document.getElementById("classify-an-display");
const classifyNameDisplay = document.getElementById("classify-name-display");
const classifyPageDisplay = document.getElementById("classify-page-display");
const classifyPrevPageBtn = document.getElementById("classify-prev-page-btn");
const classifyNextPageBtn = document.getElementById("classify-next-page-btn");
const classifyAddPageBtn = document.getElementById("classify-add-page-btn");
const closeClassifyModalBtn = document.getElementById("close-classify-modal-btn");
const classifyTable = document.getElementById("classify-table");
const classifyTableBody = document.getElementById("classify-table-body");

// (Focus List Modal)
const focusProblemModal = document.getElementById("focus-problem-modal");
const focusProblemForm = document.getElementById("focus-problem-form");
const focusModalTitle = document.getElementById("focus-modal-title");
const closeFocusModalBtn = document.getElementById("close-focus-modal-btn");
const cancelFocusBtn = document.getElementById("cancel-focus-btn");
const focusProblemText = document.getElementById("focus-problem-text");
const focusGoalText = document.getElementById("focus-goal-text");
const focusTemplateSearch = document.getElementById("focus-template-search");
const focusTemplateDatalist = document.getElementById("focus-template-datalist");

// (Add Template Modal)
const addTemplateModal = document.getElementById("add-template-modal");
const addTemplateForm = document.getElementById("add-template-form");
const openFocusTemplateModalBtn = document.getElementById("open-template-modal-btn");
const closeTemplateModalBtn = document.getElementById("close-template-modal-btn");
const cancelTemplateModalBtn = document.getElementById("cancel-template-modal-btn");

// (Progress Modal)
const progressNoteModal = document.getElementById("progress-note-modal");
const progressNoteForm = document.getElementById("progress-note-form");
const progAnDisplay = document.getElementById("prog-an-display");
const progNameDisplay = document.getElementById("prog-name-display");
const progTemplateSearch = document.getElementById("prog-template-search");
const reProgressBtn = document.getElementById("re-progress-btn");
const saveAsTemplateBtn = document.getElementById("save-as-template-btn");

// (Discharge Modal)
const dischargeModal = document.getElementById("discharge-form-modal");
const dischargeForm = document.getElementById("discharge-form");
const closeDischargeBtn = document.getElementById("close-discharge-modal-btn");

// (Discharge Plan Modal)
const adviceModal = document.getElementById("advice-form-modal");
const adviceForm = document.getElementById("advice-form");
const closeAdviceBtn = document.getElementById("close-advice-modal-btn");

// (MORSE  Modal)
let currentMorsePage = 1;
const morseModal = document.getElementById("morse-modal");
const morseTableBody = document.getElementById("morse-table-body");
const morseTable = document.getElementById("morse-table");
// 2. Config สำหรับ Dropdown และ คะแนน (ตามเอกสาร PDF เป๊ะๆ)
const MORSE_CRITERIA = [
  {
    id: "Morse_1",
    label: "1.มีการหกล้มกะทันหัน หรือหกล้มช่วง 3 เดือนก่อนมา รพ.",
    options: [
      { text: "ไม่ใช่", score: 0 },
      { text: "ใช่", score: 25 }
    ]
  },
  {
    id: "Morse_2",
    label: "2.มีการวินิจฉัยโรคมากกว่า 1 รายการ",
    options: [
      { text: "ไม่ใช่", score: 0 },
      { text: "ใช่", score: 15 }
    ]
  },
  {
    id: "Morse_3",
    label: "3.การช่วยในการเคลื่อนย้าย",
    options: [
      { text: "เดินได้เองใช้/รถเข็นนั่ง/นอนพักบนเตียงหรือทำกิจกรรมบนเตียง", score: 0 },
      { text: "ไม้ค้ำยัน/ไม้เท้า", score: 15 },
      { text: "เดิน- โดยการยึดเกาะไปตามเตียง / โต๊ะ / เก้าอี้", score: 30 }
    ]
  },
  {
    id: "Morse_4",
    label: "4. ให้สารละลายทางหลอดเลือด/คา Heparin lock",
    options: [
      { text: "ไม่ใช่", score: 0 },
      { text: "ใช่", score: 20 }
    ]
  },
  {
    id: "Morse_5",
    label: "5. การเดิน / การเคลื่อนย้าย",
    options: [
      { text: "ปกติ / นอนพักบนเตียงโดยไม่ให้ลุกจากเตียงไม่เคลื่อนไหว", score: 0 },
      { text: "อ่อนแรงเล็กน้อยหรืออ่อนเพลีย", score: 10 },
      { text: "มีความบกพร่อง เช่น ลุกจากเก้าอี้ด้วยความลำบาก / ไม่สามารถเดินได้โดยปราศจากการช่วยเหลือ", score: 20 }
    ]
  },
  {
    id: "Morse_6",
    label: "6. สภาพจิตใจ",
    options: [
      { text: "รับรู้บุคคล เวลา สถานที่", score: 0 },
      { text: "ตอบสนองไม่ตรงกับความเป็นจริง ไม่รับรู้ข้อจำกัดของตนเอง", score: 15 }
    ]
  }
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

// ----------------------------------------------------------------
// (5) Utility Functions
// ----------------------------------------------------------------

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
  clockElement.textContent = `${thaiDate} | ${time}`;
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
  document.getElementById("admit-date").value = dateString;
  document.getElementById("admit-time").value = timeString;
}

function calculateBradenScore(targetForm = assessmentForm) {
  let total = 0;
  const inputs = targetForm.querySelectorAll(".braden-score");
  inputs.forEach(input => {
    total += parseInt(input.value, 10) || 0;
  });
  
  const totalEl = targetForm.querySelector("#braden-total-score");
  const resultEl = targetForm.querySelector("#braden-result");
  
  if(totalEl) totalEl.value = total;

  if(resultEl) {
    if (total <= 9) resultEl.textContent = "Very high risk ( 9)";
    else if (total <= 12) resultEl.textContent = "High risk (10-12)";
    else if (total <= 14) resultEl.textContent = "Moderate risk (13-14)";
    else if (total <= 18) resultEl.textContent = "Low risk (15-18)";
    else resultEl.textContent = "No risk (> 18)";
  }
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

function getISODate(date) {
  // ใช้เทคนิคปรับ Timezone Offset เพื่อให้ได้ค่าวันที่แบบ Local (ไทย) เสมอ
  const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  return offsetDate.toISOString().split('T')[0];
}

// ----------------------------------------------------------------
// (6) Core App Functions
// ----------------------------------------------------------------

// 

// สร้าง Config สำหรับจับคู่ชื่อตึกกับไอคอนและสี
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
        // ดึงค่า Config ถ้าไม่มีให้ใช้ค่า Default
        const config = WARD_CONFIG[wardName] || { icon: "fa-hospital", color: "text-gray-600", desc: "" };

        const card = document.createElement("div");
        // ปรับแต่ง CSS ให้เป็นการ์ดสวยงาม มี Icon ตรงกลาง
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
        
        // เพิ่มลงใน Dropdown ด้วย
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 pointer-events-none">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        Chart
      </button>`;
      
      // 2. จัดเรียงลำดับคอลัมน์ใหม่: เอา chartButton ไว้บรรทัดแรก
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
// (7) Modal Functions: Admit, Details, Chart, Assessment
// ----------------------------------------------------------------

// --- ADMIT MODAL ---
async function openAdmitModal() {
  if (!currentWard) return;
  showLoading('กำลังเตรียมฟอร์ม...');
  try {
    const { departments, doctors, admittedFrom, availableBeds } = await fetchFormData(currentWard);
    populateSelect("admit-from", admittedFrom.map(o => o.value));
    populateSelect("admit-bed", availableBeds);
    populateSelect("admit-dept", departments.map(o => o.value));
    populateSelect("admit-doctor", doctors.map(o => o.value));
    admitForm.reset(); setFormDefaults(); admitAgeInput.value = ""; 
    admitModal.classList.remove("hidden");
    Swal.close();
  } catch (error) { showError('เตรียมฟอร์มไม่สำเร็จ', error.message); }
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

// --- CHART PAGE ---
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

// --- CHART PREVIEW LOGIC ---
async function showFormPreview(formType) {
  chartPreviewPlaceholder.classList.add("hidden");
  chartPreviewContent.innerHTML = "";
  
  if (formType === '004') {
    chartPreviewTitle.textContent = "แบบประเมินประวัติและสมรรถนะผู้ป่วย (FR-IPD-004)";
    const template = document.getElementById("preview-template-004");
    if (!template) {
        showError("ไม่พบ Template", "ไม่สามารถโหลด preview-template-004");
        return;
    }
    const preview = template.content.cloneNode(true);
    
    for (const key in currentPatientData) {
      if (currentPatientData.hasOwnProperty(key)) {
        let value = currentPatientData[key];
        const el = preview.querySelector(`[data-field="${key}"]`);
        if (el) {
          if (value === true || value === 'true' || value === 'on') {
            el.textContent = "✓";
          } else if (value === false || value === 'false' || !value) {
            el.textContent = "-";
          } else if (key === 'LastUpdatedTime') {
            el.textContent = new Date(value).toLocaleString('th-TH');
          } else {
            el.textContent = value;
          }
        }
      }
    }
    
    // Handle combined checkboxes
    const hxDetailEl = preview.getElementById('preview-hx-details');
    if (hxDetailEl) {
      const hxValues = [
        {key: 'Hx_HT', label: 'ความดันฯ'}, {key: 'Hx_Heart', label: 'โรคหัวใจ'},
        {key: 'Hx_Liver', label: 'โรคตับ'}, {key: 'Hx_Kidney', label: 'โรคไต'},
        {key: 'Hx_DM', label: 'เบาหวาน'}, {key: 'Hx_Asthma', label: 'หอบหืด'},
        {key: 'Hx_Epilepsy', label: 'ลมชัก'}, {key: 'Hx_TB', label: 'วัณโรค'},
        {key: 'Hx_Cancer', label: `มะเร็ง (${currentPatientData['Hx_Cancer_Detail'] || ''})`},
        {key: 'Hx_Other', label: `อื่นๆ (${currentPatientData['Hx_Other'] || ''})`}
      ];
      const hxText = hxValues
        .filter(k => currentPatientData[k.key] === true || currentPatientData[k.key] === 'true')
        .map(k => k.label).join(', ');
      hxDetailEl.textContent = hxText || '-';
    }
    
    // --- (1) ประวัติการผ่าตัด (Sx Details) ---
    const sxDetailEl = preview.getElementById('preview-sx-details');
    if (sxDetailEl) {
        if (currentPatientData['Sx_Status'] === 'เคย') {
            sxDetailEl.textContent = `${currentPatientData['Sx_Details'] || ''} (เมื่อ: ${currentPatientData['Sx_Date'] || 'N/A'})`;
        } else {
            sxDetailEl.textContent = '-';
        }
    }

    // --- (2) ประวัตินอนโรงพยาบาล (Admit Hx Details) ---
    const admitHxEl = preview.getElementById('preview-admit-hx-details');
    if (admitHxEl) {
        if (currentPatientData['AdmitHx_Status'] === 'เคย') {
            admitHxEl.textContent = `${currentPatientData['AdmitHx_Disease'] || ''} (เมื่อ: ${currentPatientData['AdmitHx_Date'] || 'N/A'})`;
        } else {
            admitHxEl.textContent = '-';
        }
    }

    // --- (3) การเผชิญภาวะเครียด (Cope Stress Details) ---
    const copeEl = preview.getElementById('preview-cope-stress-details');
    if (copeEl) {
      const copeValues = [
        {key: 'Cope_Stress_Fear', label: 'กลัวไม่หาย'}, {key: 'Cope_Stress_Cost', label: 'ค่ารักษา'},
        {key: 'Cope_Stress_Work', label: 'ขาดงาน'}, {key: 'Cope_Stress_Family', label: 'ครอบครัว'}
      ];
      const copeText = copeValues
        .filter(k => currentPatientData[k.key] === true || currentPatientData[k.key] === 'true')
        .map(k => k.label)
        .join(', ');
      copeEl.textContent = copeText || '-';
    }

    // --- (4) การมีส่วนร่วม (Participation Details) ---
    const particEl = preview.getElementById('preview-partic-details');
    if (particEl) {
      const particValues = [
        {key: 'Partic_Want_Info', label: 'ทราบข้อมูล'}, {key: 'Partic_Want_Skill', label: 'เรียนรู้ทักษะ'},
        {key: 'Partic_Want_Join', label: 'ร่วมกับทีม'}
      ];
      const particText = particValues
        .filter(k => currentPatientData[k.key] === true || currentPatientData[k.key] === 'true')
        .map(k => k.label)
        .join(', ');
      particEl.textContent = particText || '-';
    }

    // --- (5) ผลกระทบความปวด (Pain Effect) ---
    const painEffectEl = preview.getElementById('preview-pain-effect');
    if (painEffectEl) {
      const painValues = [
        {key: 'Pain_Effect_Eat', label: 'การกิน'}, {key: 'Pain_Effect_Sleep', label: 'การนอน'},
        {key: 'Pain_Effect_Activity', label: 'การทำกิจกรรม'}, {key: 'Pain_Effect_Mood', label: 'อารมณ์/สังคม'},
        {key: 'Pain_Effect_Elim', label: 'การขับถ่าย'}, {key: 'Pain_Effect_Sex', label: 'เพศสัมพันธ์'}
      ];
      const painText = painValues
        .filter(k => currentPatientData[k.key] === true || currentPatientData[k.key] === 'true')
        .map(k => k.label)
        .join(', ');
      painEffectEl.textContent = painText || '-';
    }

    // --- (6) การบรรเทาความปวด (Pain Relief) ---
    const painReliefEl = preview.getElementById('preview-pain-relief');
    if (painReliefEl) {
      const reliefValues = [
        {key: 'Pain_Relief_Cold', label: 'Cold compress'}, {key: 'Pain_Relief_Hot', label: 'Hot compress'},
        {key: 'Pain_Relief_Massage', label: 'Massage'}, {key: 'Pain_Relief_Relax', label: 'Relaxation'},
        {key: 'Pain_Relief_Repo', label: 'Reposition'}, {key: 'Pain_Relief_Rest', label: 'Rest/Sleep'},
        {key: 'Pain_Relief_Meds', label: 'Medication'}
      ];
      const reliefText = reliefValues
        .filter(k => currentPatientData[k.key] === true || currentPatientData[k.key] === 'true')
        .map(k => k.label)
        .join(', ');
      painReliefEl.textContent = reliefText || '-';
    }

    chartPreviewContent.appendChild(preview);
    chartEditBtn.classList.remove("hidden");
    chartEditBtn.dataset.form = "004";
    chartAddNewBtn.classList.add("hidden");
    
  }
    else if (formType === 'advice') {
    chartPreviewTitle.textContent = "การให้คำแนะนำการปฏิบัติตัวระหว่างเข้ารับการรักษาในโรงพยาบาลและเมื่อผู้ป่วยกลับบ้าน";
    await showAdvicePreview(currentPatientAN);
  }

    else if (formType === '006') {
    chartPreviewTitle.textContent = "บันทึกความก้าวหน้าทางการพยาบาล (Nursing Progress Note)";
    chartEditBtn.classList.add("hidden");
    chartAddNewBtn.classList.remove("hidden");
    chartAddNewBtn.dataset.form = "006"; // ผูกปุ่มให้เป็น 006
    
    // เรียกฟังก์ชันโหลดรายการ (ที่จะสร้างในขั้นตอนที่ 3)
    await showProgressNotePreview(currentPatientAN);
  }

  else if (formType === '007') {
     chartPreviewTitle.textContent = "แบบบันทึกการพยาบาลผู้ป่วยจำหน่าย (PR-IPD-007)";
     // เรียกฟังก์ชันแสดง Preview
     await showDischargePreview(currentPatientAN);
  }

  else if (formType === 'morse_maas') {
    chartPreviewTitle.textContent = "แบบประเมินความเสี่ยง Morse / MAAS";
    chartPreviewContent.innerHTML = document.getElementById("preview-template-morse").innerHTML;
    chartEditBtn.classList.remove("hidden");
    chartEditBtn.dataset.form = "morse_maas";
    chartEditBtn.onclick = () => openMorseModal(); // ใช้ onclick ตรงนี้ หรือจะไปแก้ใน Event Listener หลักก็ได้
    chartAddNewBtn.classList.add("hidden");
}
      
  else {
    const formTitle = chartPage.querySelector(`.chart-list-item[data-form="${formType}"] h3`).textContent;
    chartPreviewTitle.textContent = formTitle;
    await showEntryList(formType, formTitle);
    chartEditBtn.classList.add("hidden");
    chartAddNewBtn.classList.remove("hidden");
    chartAddNewBtn.dataset.form = formType;
  }
}

async function showEntryList(formType, formTitle) { 
  const template = document.getElementById("template-entry-list");
  if (!template) return;
  
  const preview = template.content.cloneNode(true);
  let entries = [];
  showLoading('กำลังโหลดรายการที่บันทึก...');
  
  try {
    if (formType === 'classify') {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationSummary&an=${currentPatientAN}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      entries = result.data;
    } 
    Swal.close();
  } catch (error) {
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
    return;
  }

  const header = document.createElement('div');
  header.className = 'p-4 flex justify-between items-center';
  header.innerHTML = `<p class="text-sm text-gray-500">พบ ${entries.length} รายการ</p>`;
  preview.prepend(header);

  if (entries.length === 0) {
      const noEntryDiv = document.createElement('div');
      noEntryDiv.className = 'p-6 text-center text-gray-400';
      noEntryDiv.innerHTML = `<p>-- ยังไม่มีการบันทึก --</p><p>กรุณากดปุ่ม "+ เพิ่มใหม่"</p>`;
      preview.appendChild(noEntryDiv);
  } else {
    entries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'p-4 hover:bg-gray-100 cursor-pointer entry-list-item border-b';
      
      const entryDate = new Date(entry.date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const shift = entry.shift === 'N' ? 'ดึก' : (entry.shift === 'D' ? 'เช้า' : 'บ่าย');
      
      entryDiv.innerHTML = `
        <p class="font-semibold text-blue-600">${entryDate} (เวร ${shift})</p>
        <p class="text-sm text-gray-600">ผู้บันทึก: ${entry.user || 'N/A'}</p>
      `;
      
      entryDiv.onclick = () => { openClassifyModal(); };
      preview.appendChild(entryDiv);
    });
  }
  
  chartPreviewContent.innerHTML = ""; 
  chartPreviewContent.appendChild(preview);
}

// --- ASSESSMENT FORM LOGIC (FR-004) ---
async function openAssessmentForm() {
  showLoading('กำลังเตรียมฟอร์มประเมิน...');
  if(globalStaffList.length === 0) {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
      const result = await response.json();
      if (result.success) {
        globalStaffList = result.data;
        populateSelect(document.getElementById("assessor-name").id, globalStaffList.map(s => s.fullName));
      }
    } catch (e) { }
  }
  
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${currentPatientAN}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    currentPatientData = result.data;
  } catch(e) {
    showError('ไม่สามารถโหลดข้อมูลล่าสุดได้', e.message);
    return;
  }
  
  populateAssessmentForm(currentPatientData, assessmentForm); 
  assessmentModal.classList.remove("hidden");
  Swal.close();
}

function closeAssessmentModal() {
  assessmentModal.classList.add("hidden");
  assessmentForm.reset();
  calculateBradenScore(assessmentForm);
}

function populateAssessmentForm(data, targetForm) {
  targetForm.reset();
  if (targetForm.id === 'assessment-form') { 
    targetForm.querySelector('#assess-an-display').textContent = data.AN;
    targetForm.querySelector('#assess-name-display').textContent = data.Name;
  }
  
  const fieldsToSync = {
    'AdmitDate': 'assess-admit-date', 'AdmitTime': 'assess-admit-time',
    'AdmittedFrom': 'assess-admit-from', 'Refer': 'assess-refer-from',
    'ChiefComplaint': 'assess-cc', 'PresentIllness': 'assess-pi'
  };
  for (const key in fieldsToSync) {
      const el = targetForm.querySelector(`#${fieldsToSync[key]}`);
      if (el) el.value = data[key] || '';
  }
  
  // Radio/Checkbox population logic
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (fieldsToSync.hasOwnProperty(key)) continue;
      const field = targetForm.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'radio') {
          targetForm.querySelectorAll(`[name="${key}"][value="${data[key]}"]`).forEach(el => el.checked = true);
        } else if (field.type === 'checkbox') {
          if (data[key] === true || data[key] === 'true' || data[key] === 'on') field.checked = true;
        } else {
          field.value = data[key];
        }
      }
    }
  }
  
  // Trigger toggles
  targetForm.querySelectorAll('.assessment-radio-toggle').forEach(el => {
    if ((el.tagName === 'SELECT') || (el.type === 'radio' && el.checked)) {
      el.dispatchEvent(new Event('change', { 'bubbles': true }));
    }
  });
  
  calculateBradenScore(targetForm); 
  
  // Assessor logic
  const assessorNameEl = targetForm.querySelector("#assessor-name");
  const assessorPosEl = targetForm.querySelector("#assessor-position");
  if (assessorNameEl && assessorPosEl) {
    if(assessorNameEl.options.length <= 1 && globalStaffList.length > 0) {
        populateSelect(assessorNameEl.id, globalStaffList.map(s => s.fullName));
    }
    const assessor = globalStaffList.find(s => s.fullName === data.Assessor_Name);
    if(assessor) {
      assessorNameEl.value = assessor.fullName;
      assessorPosEl.value = assessor.position;
    } else {
      assessorNameEl.value = data.Assessor_Name || "";
      assessorPosEl.value = data.Assessor_Position || "";
    }
  }
}

async function handleSaveAssessment(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกแบบประเมิน...');
  const formData = new FormData(assessmentForm);
  const data = Object.fromEntries(formData.entries());
  const currentUser = data.Assessor_Name || "System"; 

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "saveAssessmentData", an: currentPatientAN, formData: data, user: currentUser
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    showSuccess('บันทึกข้อมูลสำเร็จ!');
    closeAssessmentModal();
    openChart(currentPatientAN, chartHnDisplay.textContent, chartNameDisplay.textContent); 
  } catch (error) {
    showError('บันทึกไม่สำเร็จ', error.message);
  }
}

// ----------------------------------------------------------------
// (8) Classification Logic
// ----------------------------------------------------------------

async function openClassifyModal() {
  classifyAnDisplay.textContent = currentPatientAN;
  classifyNameDisplay.textContent = currentPatientData.Name || '';
  currentClassifyPage = 1;
  
  if (!document.getElementById('staff-list-datalist')) {
    const dataList = document.createElement('datalist');
    dataList.id = 'staff-list-datalist';
    globalStaffList.forEach(staff => {
      dataList.innerHTML += `<option value="${staff.fullName}"></option>`;
    });
    classifyForm.appendChild(dataList);
  }
  
  await fetchAndRenderClassifyPage(currentPatientAN, currentClassifyPage);
  classifyModal.classList.remove("hidden");
}

function closeClassifyModal() {
  classifyModal.classList.add("hidden");
  chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
  const classifyItem = document.querySelector('.chart-list-item[data-form="classify"]');
  if (classifyItem) classifyItem.classList.add('bg-indigo-100');
  showFormPreview('classify');
}

async function fetchAndRenderClassifyPage(an, page) {
  showLoading('กำลังโหลดข้อมูลการประเมิน...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationPage&an=${an}&page=${page}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    renderClassifyTable(result.data, page);
    classifyPageDisplay.textContent = page;
    classifyPrevPageBtn.disabled = (page <= 1);
    Swal.close();
  } catch (error) {
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
  }
}

function renderClassifyTable(data, page) {
  const table = classifyTable;
  let thead = table.querySelector("thead");
  let tbody = table.querySelector("tbody");
  
  if (!thead) {
      thead = document.createElement('thead');
      table.prepend(thead);
  }
  thead.innerHTML = "";
  
  const headerRow1 = document.createElement('tr');
  headerRow1.className = 'bg-gray-100';
  headerRow1.innerHTML = '<th rowspan="2" class="p-2 border text-left text-sm font-semibold text-gray-700 w-1/4">หมวดการประเมิน</th>';
  
  const headerRow2 = document.createElement('tr');
  headerRow2.className = 'bg-gray-50';
  
  const admitDate = new Date(currentPatientData.AdmitDate || new Date());
  const startDate = new Date(admitDate);
  startDate.setDate(startDate.getDate() + ((page - 1) * 5));
  
  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = getISODate(currentDate);
    
    const dateHeader = document.createElement('th');
    dateHeader.colSpan = 3;
    dateHeader.className = 'p-2 border text-center text-sm font-semibold text-gray-700';
    dateHeader.innerHTML = `<span class="classify-date-display" data-day-index="${i}">${currentDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          <input type="hidden" value="${dateString}" class="classify-date-input" data-day-index="${i}">`;
    headerRow1.appendChild(dateHeader);
    
    ['N', 'D', 'E'].forEach(shift => {
      const shiftHeader = document.createElement('th');
      shiftHeader.className = 'p-1 border text-xs font-medium text-gray-600';
      shiftHeader.textContent = shift === 'N' ? 'ดึก (N)' : (shift === 'D' ? 'เช้า (D)' : 'บ่าย (E)');
      headerRow2.appendChild(shiftHeader);
    });
  }
  thead.appendChild(headerRow1);
  thead.appendChild(headerRow2);
  
  tbody.innerHTML = "";
  
  const categories = [
    { name: 'I. สภาวะสุขภาพ', isHeader: true },
    { name: '1. สัญญาณชีพ', isHeader: false, scoreIndex: 1 },
    { name: '2. อาการแสดงทางระบบประสาท', isHeader: false, scoreIndex: 2 },
    { name: '3. การได้รับการตรวจรักษา/ผ่าตัดหรือหัตถการ', isHeader: false, scoreIndex: 3 },
    { name: '4. พฤติกรรมที่ผิดปกติ อารมณ์ จิตสังคม', isHeader: false, scoreIndex: 4 },
    { name: 'II. ความต้องการการดูแลขั้นต่ำ', isHeader: true },
    { name: '5. ความสามารถในการปฏิบัติกิจวัตรประจำวัน', isHeader: false, scoreIndex: 5 },
    { name: '6. ความต้องการการสนับสนุนด้านจิตใจและอารมณ์', isHeader: false, scoreIndex: 6 },
    { name: '7. ความต้องการยา การรักษา/หัตถการและการฟื้นฟู', isHeader: false, scoreIndex: 7 },
    { name: '8. ความต้องการการบรรเทาอาการรบกวน', isHeader: false, scoreIndex: 8 }
  ];
  
  categories.forEach((cat) => {
    const row = document.createElement('tr');
    if (cat.isHeader) {
      row.className = 'bg-indigo-50';
      row.innerHTML = `<td colspan="16" class="p-2 border font-bold text-indigo-800">${cat.name}</td>`;
    } else {
      row.innerHTML = `
        <td class="p-2 border font-semibold">
          ${cat.name}
          <button type="button" class="classify-criteria-btn ml-2 text-blue-500 hover:text-blue-700" data-category-index="${cat.scoreIndex}">(?)</button>
        </td>`;
      
      const currentStartDate = new Date(admitDate);
      currentStartDate.setDate(currentStartDate.getDate() + ((page - 1) * 5));
      
      for (let i = 0; i < 5; i++) {
        const currentDate = new Date(currentStartDate);
        currentDate.setDate(currentStartDate.getDate() + i);
        const dateString = getISODate(currentDate);

        ['N', 'D', 'E'].forEach(shift => {
          const entry = data.find(d => d.Date === dateString && d.Shift === shift);
          const score = (entry && entry[`Score_${cat.scoreIndex}`]) ? entry[`Score_${cat.scoreIndex}`] : 0;
          
          row.innerHTML += `
            <td class="p-1 border">
              <select name="Score_${cat.scoreIndex}" class="w-full text-center p-1 border rounded classify-input" data-day-index="${i}" data-shift="${shift}">
                <option value="0" ${score == 0 ? 'selected' : ''}></option>
                <option value="1" ${score == 1 ? 'selected' : ''}>1</option>
                <option value="2" ${score == 2 ? 'selected' : ''}>2</option>
                <option value="3" ${score == 3 ? 'selected' : ''}>3</option>
                <option value="4" ${score == 4 ? 'selected' : ''}>4</option>
              </select>
            </td>`;
        });
      }
    }
    tbody.appendChild(row);
  });

  const summaryRows = [
    { id: 'total-score', label: 'รวมคะแนน (Total Score)', class: 'bg-gray-50' },
    { id: 'category', label: 'ประเภทผู้ป่วย (Category)', class: 'bg-gray-100' },
    { id: 'assessor', label: 'ผู้ประเมิน (RN)', class: 'bg-gray-50' },
    { id: 'save', label: 'บันทึกเวร', class: 'bg-white' }
  ];

  const summaryStartDate = new Date(admitDate);
  summaryStartDate.setDate(summaryStartDate.getDate() + ((page - 1) * 5));

  summaryRows.forEach(sr => {
    const row = document.createElement('tr');
    row.className = sr.class;
    row.id = `classify-row-${sr.id}`;
    row.innerHTML = `<td class="p-2 border font-bold text-right">${sr.label}</td>`;
    
    const currentStartDate = new Date(admitDate);
    currentStartDate.setDate(currentStartDate.getDate() + ((page - 1) * 5));
    
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(currentStartDate);
      currentDate.setDate(currentStartDate.getDate() + i);
      const dateString = getISODate(currentDate);

      ['N', 'D', 'E'].forEach(shift => {
        const entry = data.find(d => d.Date === dateString && d.Shift === shift);
        
        if (sr.id === 'save') {
          row.innerHTML += `
            <td class="p-1 border text-center">
              <button type="button" class="classify-save-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded" 
                      data-day-index="${i}" data-shift="${shift}">
                บันทึก
              </button>
            </td>`;
        } else {
          let value = '';
          if (sr.id === 'total-score') value = entry?.Total_Score || '';
          if (sr.id === 'category') value = entry?.Category || '';
          if (sr.id === 'assessor') value = entry?.Assessor_Name || '';
          
          const inputType = (sr.id === 'assessor') ? `list="staff-list-datalist"` : 'text';
          const isReadonly = (sr.id !== 'assessor') ? 'readonly' : '';
          const inputClass = (sr.id !== 'assessor') ? 'bg-gray-200' : 'classify-input';
          
          row.innerHTML += `
            <td class="p-1 border">
              <input ${inputType} name="${sr.id}" 
                     class="w-full text-center p-1 border rounded ${inputClass}" 
                     data-day-index="${i}" data-shift="${shift}" value="${value}" ${isReadonly}>
            </td>`;
        }
      });
    }
    tbody.appendChild(row);
  });
}

function updateClassifyColumnTotals(dayIndex, shift) {
  let total = 0;
  for (let i = 1; i <= 8; i++) {
    const scoreInput = classifyTableBody.querySelector(`select[name="Score_${i}"][data-day-index="${dayIndex}"][data-shift="${shift}"]`);
    if (!scoreInput) continue; 
    let score = parseInt(scoreInput.value, 10) || 0;
    total += score;
  }
  
  const totalInput = classifyTableBody.querySelector(`#classify-row-total-score input[data-day-index="${dayIndex}"][data-shift="${shift}"]`);
  if (totalInput) totalInput.value = total > 0 ? total : '';
  
  const categoryInput = classifyTableBody.querySelector(`#classify-row-category input[data-day-index="${dayIndex}"][data-shift="${shift}"]`);
  if (categoryInput) {
    let category = 0;
    if (total > 0 && total <= 8) category = 1;
    else if (total >= 9 && total <= 14) category = 2;
    else if (total >= 15 && total <= 20) category = 3;
    else if (total >= 21 && total <= 26) category = 4;
    else if (total >= 27) category = 5;
    categoryInput.value = category > 0 ? category : '';
  }
  return { Total_Score: total > 0 ? total : '', Category: categoryInput.value };
}

async function saveClassificationShiftData(dayIndex, shift) {
  const dateInput = classifyTable.querySelector(`input.classify-date-input[data-day-index="${dayIndex}"]`);
  if (!dateInput) return;
  const date = dateInput.value;
  
  const entryData = { AN: currentPatientAN, Page: currentClassifyPage, Date: date, Shift: shift };
  let hasData = false;
  for (let i = 1; i <= 8; i++) {
    const val = classifyTableBody.querySelector(`select[name="Score_${i}"][data-day-index="${dayIndex}"][data-shift="${shift}"]`).value;
    if (val && val != "0") hasData = true;
    entryData[`Score_${i}`] = val;
  }
  entryData.Assessor_Name = classifyTableBody.querySelector(`#classify-row-assessor input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value;
  if (entryData.Assessor_Name) hasData = true;
  
  if (!hasData) {
    showError("ยังไม่มีข้อมูล", "กรุณาลงคะแนนอย่างน้อย 1 หมวด หรือ ลงชื่อผู้ประเมิน");
    return;
  }
  
  showLoading('กำลังบันทึก...');
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "saveClassificationShift", entryData: entryData })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    const updated = result.updatedData;
    classifyTableBody.querySelector(`#classify-row-total-score input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value = updated.Total_Score;
    classifyTableBody.querySelector(`#classify-row-category input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value = updated.Category;
    
    const shiftText = shift === 'N' ? 'ดึก' : (shift === 'D' ? 'เช้า' : 'บ่าย');
    showSuccess('บันทึกสำเร็จ!', `บันทึกเวร ${shiftText} วันที่ ${date} เรียบร้อย`);
  } catch (error) {
    showError('บันทึกไม่สำเร็จ', error.message);
  }
}

function changeClassifyPage(direction) {
  const newPage = currentClassifyPage + direction;
  if (newPage < 1) return;
  currentClassifyPage = newPage;
  fetchAndRenderClassifyPage(currentPatientAN, currentClassifyPage);
}

function showCriteriaPopover(categoryIndex) {
  const criteria = CLASSIFY_CRITERIA[categoryIndex.toString()];
  if (!criteria) {
    showError('ไม่พบเกณฑ์', `ไม่พบเกณฑ์สำหรับหมวด ${categoryIndex}`);
    return;
  }
  const criteriaHtml = `
    <div class="text-left space-y-4 p-4">
      <div class="p-3 bg-gray-100 rounded-md"><p class="font-semibold text-lg text-red-600">คะแนน 4:</p><p>${criteria[4]}</p></div>
      <div class="p-3 bg-gray-100 rounded-md"><p class="font-semibold text-lg text-orange-600">คะแนน 3:</p><p>${criteria[3]}</p></div>
      <div class="p-3 bg-gray-100 rounded-md"><p class="font-semibold text-lg text-yellow-600">คะแนน 2:</p><p>${criteria[2]}</p></div>
      <div class="p-3 bg-gray-100 rounded-md"><p class="font-semibold text-lg text-green-600">คะแนน 1:</p><p>${criteria[1]}</p></div>
    </div>`;
  Swal.fire({ title: criteria.title, html: criteriaHtml, width: '800px', confirmButtonText: 'ปิด' });
}

// ----------------------------------------------------------------
// (9) Focus List (FR-IPD-005) Logic
// ----------------------------------------------------------------

// ในไฟล์ script.js ค้นหา function showFocusListPreview แล้วแทนที่ด้วย Code นี้
async function showFocusListPreview(an) {
  chartPreviewTitle.textContent = "รายการปัญหาสุขภาพ (FOCUS LIST)";
  chartPreviewPlaceholder.classList.add("hidden");
  chartEditBtn.classList.add("hidden");
  chartAddNewBtn.classList.remove("hidden");
  chartAddNewBtn.dataset.form = "005";

  showLoading('กำลังโหลดรายการปัญหา...');

  try {
    // --- จุดที่แก้ไข: สั่งให้ทำงานพร้อมกัน 2 อย่าง (Parallel) ---
    const templatePromise = loadFocusTemplates(); // 1. เริ่มโหลด Template (ถ้าไม่มี)
    const listPromise = fetch(`${GAS_WEB_APP_URL}?action=getFocusList&an=${an}`); // 2. เริ่มโหลดรายการปัญหา
    
    // รอให้เสร็จทั้งคู่ (ใช้เวลาเท่ากับตัวที่ช้าที่สุด ไม่ใช่เวลาบวกกัน)
    const [_, listResponse] = await Promise.all([templatePromise, listPromise]);
    const result = await listResponse.json();
    // -------------------------------------------------------

    if (!result.success) throw new Error(result.message);
    const entries = result.data;
    
    // อัปเดตตัวเลขจำนวนปัญหา
    const span005 = document.getElementById('last-updated-005');
    if (span005) span005.textContent = entries.length > 0 ? `มี ${entries.length} ปัญหา` : "ยังไม่เคยบันทึก";

    // Render ตาราง (เหมือนเดิม)
    const template = document.getElementById("preview-template-005");
    if (!template) return;
    const preview = template.content.cloneNode(true);
    const tableBody = preview.querySelector("tbody");

    if (entries.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="6" class="p-6 text-center text-gray-400">-- ยังไม่มีการบันทึกปัญหา --</td>`;
      tableBody.appendChild(row);
    } else {
      entries.forEach(entry => {
        const row = document.createElement("tr");
        row.className = "hover:bg-gray-50";
        const activeDate = entry.ActiveDate ? new Date(entry.ActiveDate).toLocaleDateString('th-TH') : '';
        const resolvedDate = entry.ResolvedDate ? new Date(entry.ResolvedDate).toLocaleDateString('th-TH') : '';
        const editButton = `<button type="button" class="focus-edit-btn text-blue-600 hover:text-blue-800" data-entry-id="${entry.Entry_ID}">แก้ไข</button>`;

        row.innerHTML = `<td class="p-2 border text-center">${entry.Seq}</td><td class="p-2 border text-left">${entry.Problem || ''}</td><td class="p-2 border text-left">${entry.Goal || ''}</td><td class="p-2 border text-center">${activeDate}</td><td class="p-2 border text-center">${resolvedDate}</td><td class="p-2 border text-center">${editButton}</td>`;
        row.querySelector(".focus-edit-btn").addEventListener("click", () => { openFocusProblemModal(entry); });
        tableBody.appendChild(row);
      });
    }

    chartPreviewContent.innerHTML = ""; 
    chartPreviewContent.appendChild(preview);
    Swal.close();

  } catch (error) {
    Swal.close();
    showError('โหลดรายการปัญหาไม่สำเร็จ', error.message);
    return;
  }
}

async function loadFocusTemplates() {
  // ถ้ามีข้อมูลอยู่แล้ว ให้ Return เป็น Promise ที่ Resolve ทันที (เพื่อความเร็ว)
  if (globalFocusTemplates.problems.length > 0) return Promise.resolve();
  
  try {
    // Return Promise ของการ Fetch ออกไปเลย
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getFocusTemplates`);
    const result = await response.json();
    if (result.success) {
        globalFocusTemplates = result.data;
    }
  } catch (e) { 
    console.error("Could not load focus templates:", e); 
  }
}

function closeFocusProblemModal() {
  focusProblemModal.classList.add("hidden");
  focusProblemForm.reset();
}

async function handleSaveFocusProblem(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกข้อมูล...');
  const formData = new FormData(focusProblemForm);
  const problemData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "saveFocusProblem", an: currentPatientAN, problemData: problemData })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    showSuccess('บันทึกสำเร็จ!');
    closeFocusProblemModal();
    showFocusListPreview(currentPatientAN); 
  } catch (error) { showError('บันทึกไม่สำเร็จ', error.message); }
}

function populateFocusTemplateDropdowns() {
  if (!focusTemplateDatalist) return;
  focusTemplateDatalist.innerHTML = ""; 
  
  if (globalFocusTemplates.problems) {
    globalFocusTemplates.problems.forEach(t => {
      const option = document.createElement("option");
      // ใช้ t.name (ชื่อสั้น) เป็นค่าที่จะแสดงในช่องค้นหา
      option.value = t.name; 
      // (เสริม) แสดงตัวอย่างปัญหาเล็กน้อยในวงเล็บ (Chrome อาจไม่โชว์แต่โค้ดนี้รองรับไว้)
      option.label = t.problem.substring(0, 30) + "..."; 
      focusTemplateDatalist.appendChild(option);
    });
  }
}

function openFocusProblemModal(entryData = null) {
  focusProblemForm.reset();
  if(focusTemplateSearch) focusTemplateSearch.value = "";
  populateFocusTemplateDropdowns();

  if (entryData) {
    focusModalTitle.textContent = "แก้ไขรายการปัญหาสุขภาพ";
    document.getElementById("focus-entry-id").value = entryData.Entry_ID;
    focusProblemText.value = entryData.Problem || '';
    focusGoalText.value = entryData.Goal || '';
    document.getElementById("focus-active-date").value = entryData.ActiveDate || '';
    document.getElementById("focus-resolved-date").value = entryData.ResolvedDate || '';
  } else {
    focusModalTitle.textContent = "เพิ่มรายการปัญหาสุขภาพ";
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    document.getElementById("focus-active-date").value = localDate.toISOString().split('T')[0];
  }
  focusProblemModal.classList.remove("hidden");
}

function openAddTemplateModal() {
  if (addTemplateForm) addTemplateForm.reset();
  if (addTemplateModal) {
    addTemplateModal.classList.remove("hidden");
    addTemplateModal.style.zIndex = "9999"; 
  }
}

function closeAddTemplateModal() {
  addTemplateModal.classList.add("hidden");
  addTemplateForm.reset();
}

async function handleSaveFocusTemplate(event) {
  event.preventDefault();

  // --- 1. เรียก Popup Loading ทันที ---
  showLoading('กำลังบันทึกเทมเพลต...'); 

  const formData = new FormData(addTemplateForm);
  const templateData = Object.fromEntries(formData.entries());

  // (Optional) ตรวจสอบเบื้องต้นว่ากรอกครบไหม
  if (!templateData.Name || !templateData.Problem) {
    Swal.close(); // ปิด Loading
    showError('ข้อมูลไม่ครบ', 'กรุณาระบุชื่อเทมเพลตและรายละเอียดปัญหา');
    return;
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({ action: "addFocusTemplate", templateData: templateData })
    });
    const result = await response.json();

    if (!result.success) throw new Error(result.message);

    // --- 2. โหลดข้อมูลเทมเพลตใหม่ทันที เพื่อให้ค้นหาเจอเลย ---
    // (เคลียร์ค่าเดิมเพื่อให้ loadFocusTemplates ดึงใหม่จาก Server)
    globalFocusTemplates = { problems: [] }; 
    await loadFocusTemplates(); 
    populateFocusTemplateDropdowns(); 

    // --- 3. แสดงข้อความสำเร็จ ---
    showSuccess('บันทึกเทมเพลตสำเร็จ!');
    closeAddTemplateModal();
    
  } catch (error) {
    // ถ้าพัง ให้ปิด Loading และแสดง Error
    Swal.close(); 
    showError('บันทึกเทมเพลตไม่สำเร็จ', error.message); 
  }
}

// ----------------------------------------------------------------
// (FR-IPD-006) Logic
// ----------------------------------------------------------------
// --- ฟังก์ชันแสดงรายการย้อนหลังของ FR-006 ---
async function showProgressNotePreview(an) {
  showLoading('กำลังโหลดประวัติ...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getNursingProgressHistory&an=${an}`);
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    
    const entries = result.data;
    
    // อัปเดตข้อความสถานะที่เมนูซ้าย
    const span006 = document.getElementById('last-updated-006');
    if (span006) span006.textContent = entries.length > 0 ? `มี ${entries.length} รายการ` : "ยังไม่เคยบันทึก";

    // ดึง Template ตารางมาใช้
    const template = document.getElementById("preview-template-006"); 
    
    if (template) {
      const preview = template.content.cloneNode(true);
      const tableBody = preview.querySelector("tbody");
      
      if (entries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-gray-400">-- ยังไม่มีการบันทึก --</td></tr>`;
      } else {
        entries.forEach(entry => {
          const row = document.createElement("tr");
          row.className = "hover:bg-gray-50 border-b align-top";
          
          // จัดรูปแบบวันที่
          let dateStr = entry.Date;
          try { 
             const d = new Date(entry.Date);
             dateStr = d.toLocaleDateString('th-TH', {day:'2-digit', month:'short', year:'2-digit'});
          } catch(e){}

          // กำหนดสีป้ายเวร
          let shiftClass = 'bg-gray-100 text-gray-800';
          if (entry.Shift.includes('ดึก')) shiftClass = 'bg-indigo-100 text-indigo-800';
          else if (entry.Shift.includes('เช้า')) shiftClass = 'bg-yellow-100 text-yellow-800';
          else if (entry.Shift.includes('บ่าย')) shiftClass = 'bg-green-100 text-green-800';

          // แสดงข้อมูลครบทุกช่อง
          row.innerHTML = `
            <td class="p-2 border text-center align-top">
                <div class="font-bold text-gray-800 mb-1">${dateStr}</div>
                <span class="px-2 py-0.5 rounded text-xs font-bold ${shiftClass} inline-block">${entry.Shift}</span>
            </td>
            <td class="p-2 border text-center font-medium text-gray-600 align-top">
                ${entry.Time} น.
            </td>
            <td class="p-2 border font-bold text-blue-800 align-top">
                ${entry.Focus || '-'}
            </td>
            <td class="p-2 border text-gray-600 whitespace-pre-line align-top">${entry.S_Data || '-'}</td>
            <td class="p-2 border text-gray-600 whitespace-pre-line align-top">${entry.O_Data || '-'}</td>
            <td class="p-2 border text-gray-600 whitespace-pre-line align-top">${entry.I_Data || '-'}</td>
            <td class="p-2 border text-gray-600 whitespace-pre-line align-top">
               ${entry.E_Data || '-'}
               ${entry.E_Time ? `<br><span class="text-xs bg-purple-100 text-purple-800 px-1 rounded">เวลา: ${entry.E_Time}</span>` : ''}
            </td>
            <td class="p-2 border text-center text-sm font-medium align-top">
                ${entry.Nurse_Name || '-'}<br>
                <button class="mt-2 text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs btn-edit-note">แก้ไข</button>
            </td>
          `;

          // ผูก Event ปุ่มแก้ไข ให้ส่งข้อมูล entry ทั้งก้อนไปที่ฟังก์ชันเปิด Modal
          row.querySelector('.btn-edit-note').addEventListener('click', () => {
             openProgressNoteModal(entry); 
          });

          tableBody.appendChild(row);
        });
      }
      
      chartPreviewContent.innerHTML = "";
      chartPreviewContent.appendChild(preview);
    }
    Swal.close();

  } catch (error) {
    Swal.close();
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
  }
}
async function loadProgressTemplates() {
  if (globalProgressTemplates.length > 0) return;
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getProgressTemplates`);
    const result = await response.json();
    if (result.success) {
      globalProgressTemplates = result.data;
      updateProgressTemplateDatalist();
    }
  } catch (e) { console.error(e); }
}

function updateProgressTemplateDatalist() {
  const datalist = document.getElementById("prog-template-list");
  if(!datalist) return;
  datalist.innerHTML = "";
  globalProgressTemplates.forEach(t => {
    const option = document.createElement("option");
    option.value = t.name;
    option.label = t.focus.substring(0, 30) + "...";
    datalist.appendChild(option);
  });
}

// --- 3. ฟังก์ชันเปิด Modal และ Re-Progress ---
// ฟังก์ชันเปิด Modal (รองรับทั้ง เพิ่มใหม่ และ แก้ไข)
async function openProgressNoteModal(editData = null) {
  progAnDisplay.textContent = currentPatientAN;
  progNameDisplay.textContent = currentPatientData.Name;
  
  // โหลดรายชื่อพยาบาล (ถ้ายังไม่มี)
  if (globalStaffList.length === 0) {
     try {
       const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
       const result = await response.json();
       if (result.success) globalStaffList = result.data;
     } catch(e) { console.error(e); }
  }
  // สร้าง Datalist
  let staffDatalist = document.getElementById('staff-list-datalist');
  if (!staffDatalist) {
      staffDatalist = document.createElement('datalist');
      staffDatalist.id = 'staff-list-datalist';
      document.body.appendChild(staffDatalist);
  }
  staffDatalist.innerHTML = "";
  globalStaffList.forEach(staff => staffDatalist.innerHTML += `<option value="${staff.fullName}">`);

  // --- ตรวจสอบโหมด (เพิ่มใหม่ vs แก้ไข) ---
  if (editData) {
    // >> โหมดแก้ไข: เติมข้อมูลเดิมลงฟอร์ม
    document.getElementById("prog-entry-id").value = editData.Entry_ID || ""; // ใส่ ID
    document.getElementById("prog-date").value = editData.Date ? getISODate(new Date(editData.Date)) : "";
    document.getElementById("prog-time").value = editData.Time || "";
    
    // เลือก Shift
    const shiftRadios = document.getElementsByName("Shift");
    shiftRadios.forEach(r => { r.checked = (r.value === editData.Shift); });

    document.getElementById("prog-focus").value = editData.Focus || "";
    document.getElementById("prog-s").value = editData.S_Data || "";
    document.getElementById("prog-o").value = editData.O_Data || "";
    document.getElementById("prog-i").value = editData.I_Data || "";
    document.getElementById("prog-e").value = editData.E_Data || "";
    document.getElementById("prog-e-time").value = editData.E_Time || ""; // เวลาประเมินผล
    
    // ชื่อพยาบาล
    const nurseInput = document.querySelector('input[name="Nurse_Name"]');
    if(nurseInput) nurseInput.value = editData.Nurse_Name || "";

  } else {
    // >> โหมดเพิ่มใหม่: เคลียร์ค่า, ตั้งเวลาปัจจุบัน
    document.getElementById("progress-note-form").reset();
    document.getElementById("prog-entry-id").value = ""; // เคลียร์ ID สำคัญมาก!
    
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    document.getElementById("prog-date").value = localDate.toISOString().split('T')[0];
    document.getElementById("prog-time").value = now.toTimeString().substring(0,5);
    
    // Auto Shift
    const hour = now.getHours();
    const shiftRadios = document.getElementsByName("Shift");
    if (hour >= 0 && hour < 8) document.querySelector('input[name="Shift"][value^="ดึก"]').checked = true;
    else if (hour >= 8 && hour < 16) document.querySelector('input[name="Shift"][value^="เช้า"]').checked = true;
    else document.querySelector('input[name="Shift"][value^="บ่าย"]').checked = true;
  }

  await loadProgressTemplates();
  progressNoteModal.classList.remove("hidden");
}

// ฟังก์ชัน Re-Progress (หัวใจสำคัญ)
async function handleReProgress() {
  showLoading("กำลังค้นหาประวัติ...");
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getNursingProgressHistory&an=${currentPatientAN}`);
    const result = await response.json();
    if(!result.success) throw new Error(result.message);
    
    const history = result.data;
    Swal.close();

    if (history.length === 0) {
      showError("ไม่พบข้อมูล", "ผู้ป่วยรายนี้ยังไม่มีประวัติการบันทึก");
      return;
    }

    // ให้เลือกจาก 5 รายการล่าสุด
    const options = {};
    history.slice(0, 5).forEach((h, index) => {
      const date = new Date(h.Date).toLocaleDateString('th-TH', {day:'2-digit', month:'short'});
      options[index] = `${date} (${h.Shift}) - ${h.Focus}`;
    });

    const { value: selectedIndex } = await Swal.fire({
      title: 'เลือกรายการเดิม (Re-Progress)',
      input: 'select',
      inputOptions: options,
      inputPlaceholder: 'เลือกรายการที่ต้องการคัดลอก',
      showCancelButton: true,
      width: '600px'
    });

    if (selectedIndex !== undefined) {
      const h = history[selectedIndex];
      // เติมข้อมูลลงฟอร์ม
      document.getElementById("prog-focus").value = h.Focus;
      document.getElementById("prog-s").value = h.S_Data;
      document.getElementById("prog-o").value = h.O_Data;
      document.getElementById("prog-i").value = h.I_Data;
      document.getElementById("prog-e").value = h.E_Data; // อาจจะลบออกก็ได้ถ้าต้องการประเมินใหม่
      
      // แจ้งเตือนเล็กน้อย
      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      Toast.fire({ icon: 'success', title: 'ดึงข้อมูลเรียบร้อย' });
    }

  } catch(e) {
    showError("เกิดข้อผิดพลาด", e.message);
  }
}

// --- ฟังก์ชันจัดการ 007 ---

// 1. เปิด Modal (ถ้ามีข้อมูลคือ Edit, ไม่มีคือ New)
// ฟังก์ชันเปิด Modal 007 (อัปเดตล่าสุด)
async function openDischargeModal(editData = null) {
  dischargeForm.reset();
  
  // ตั้งค่าเริ่มต้น
  if (!editData) {
     const now = new Date();
     const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
     dischargeForm.querySelector('[name="DischargeDate"]').value = localDate.toISOString().split('T')[0];
     dischargeForm.querySelector('[name="LeaveDate"]').value = localDate.toISOString().split('T')[0]; // วันที่ออก
     dischargeForm.querySelector('[name="LeaveTime"]').value = now.toTimeString().substring(0,5);
  } else {
     // เติมข้อมูลเดิม (Loop ใส่ค่า)
     // (หมายเหตุ: สำหรับ Checkbox ต้องเช็ค value ให้ตรง ถ้าใน DB เก็บเป็น true/false หรือ comma separated อาจต้องเขียน logic เพิ่ม)
     // เบื้องต้นใช้ logic พื้นฐาน:
     for (const key in editData) {
         const input = dischargeForm.querySelector(`[name="${key}"]`);
         if (input) {
             if(input.type === 'checkbox' || input.type === 'radio') {
                 // กรณี Checkbox ต้องดูว่าค่าตรงกันไหม (โค้ดนี้รองรับแบบง่าย)
                 if(input.value === editData[key] || editData[key] === true || editData[key] === 'true') input.checked = true;
             } else if(key.includes('Date')) {
                 try { input.value = getISODate(new Date(editData[key])); } catch(e){}
             } else {
                 input.value = editData[key];
             }
         }
     }
  }

  // โหลดรายชื่อพยาบาล + ตำแหน่ง
  if (globalStaffList.length === 0) {
     try {
       const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
       const result = await response.json();
       if (result.success) {
           globalStaffList = result.data;
           let dl = document.getElementById('staff-list-datalist');
           if(!dl) {
               dl = document.createElement('datalist');
               dl.id = 'staff-list-datalist';
               document.body.appendChild(dl);
           }
           dl.innerHTML = "";
           globalStaffList.forEach(s => dl.innerHTML += `<option value="${s.fullName}">`);
       }
     } catch(e) {}
  }

  dischargeModal.classList.remove("hidden");
}

// เพิ่ม Event Listener ให้ช่องชื่อพยาบาล เพื่อดึงตำแหน่งมาใส่
dischargeForm.querySelector('[name="Nurse_Name"]').addEventListener('change', (e) => {
    const val = e.target.value;
    const staff = globalStaffList.find(s => s.fullName === val);
    if(staff) {
        dischargeForm.querySelector('[name="Nurse_Pos"]').value = staff.position || "";
    }
});

// 3. สร้างฟังก์ชัน showAdvicePreview (วางไว้ใกล้ๆ showDischargePreview)
// ฟังก์ชันแสดง Preview การให้คำแนะนำ (แก้ไขเรื่องซ่อน Checkbox และปุ่ม Edit)
async function showAdvicePreview(an) {
  showLoading('กำลังโหลดคำแนะนำ...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAdviceFormData&an=${an}`);
    const result = await response.json();
    Swal.close();
    
    const data = result.data;
    currentAdviceData = data; // เก็บข้อมูลไว้ใช้ตอนกดปุ่มแก้ไข

    const spanStatus = document.getElementById('last-updated-advice');
    if (spanStatus) spanStatus.textContent = data ? "บันทึกแล้ว" : "ยังไม่บันทึก";

    chartPreviewContent.innerHTML = "";

    if (!data) {
       // กรณีไม่มีข้อมูล
       chartPreviewContent.innerHTML = `
         <div class="text-center py-10 text-gray-400">
            <p>-- ยังไม่มีการบันทึกคำแนะนำ --</p>
            <button class="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600" onclick="openAdviceModal()">+ สร้างบันทึกคำแนะนำ</button>
         </div>
       `;
       chartEditBtn.classList.add("hidden");
       chartAddNewBtn.classList.add("hidden");
    } else {
       // กรณีมีข้อมูล
       const template = document.getElementById("preview-template-advice");
       if (!template) {
           console.error("ไม่พบ Template: preview-template-advice");
           return;
       }
       const clone = template.content.cloneNode(true);
       
       // วนลูปใส่ข้อมูล
       for (const key in data) {
           const el = clone.querySelector(`[data-field="${key}"]`);
           if (el) {
               let val = data[key];

               // 1. จัดการวันที่ (Format Date เป็นไทยย่อ)
               if (key.includes('Date') && val && !key.includes('Appoint')) {
                   try { 
                     let dateObj = new Date(val);
                     let yearBE = (dateObj.getFullYear() + 543).toString().slice(-2);
                     let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                     let day = dateObj.getDate().toString().padStart(2, '0');
                     val = `${day}/${month}/${yearBE}`;
                   } catch(e){}
               }

               // 2. Logic ซ่อน Checkbox ที่ไม่ได้เลือก
               // หา Parent Element ที่เป็นบรรทัดของ Checkbox นั้น
               const parent = el.parentElement; 
               // ตรวจสอบว่าเป็นบรรทัด Checkbox จริงหรือไม่ (ดูจากวงเล็บ [ )
               const isCheckboxLine = parent && (parent.innerText.includes('['));

               if (val === 'on' || val === true || val === 'true') {
                   // ถ้าเลือก: ใส่เครื่องหมายถูก และแสดงบรรทัดนั้น
                   el.innerHTML = '<b class="text-green-600 font-bold">/</b>'; 
                   if(isCheckboxLine) parent.style.display = ""; 
               } else if (!val || val === 'false') {
                   // ถ้าไม่เลือก: ลบข้อความ และสั่งซ่อนบรรทัด (display: none)
                   el.textContent = ''; 
                   if(isCheckboxLine) {
                      parent.style.display = "none"; 
                   }
               } else {
                   // ถ้าเป็น Text ธรรมดา
                   el.textContent = val;
               }
           }
       }

       chartPreviewContent.appendChild(clone);
       
       // **จุดสำคัญที่แก้ปัญหาปุ่มแก้ไข:**
       chartEditBtn.classList.remove("hidden");
       chartEditBtn.dataset.form = "advice"; // กำหนดค่านี้ เพื่อให้ Event Listener รู้ว่าต้องเปิดฟอร์มไหน
       
       chartAddNewBtn.classList.add("hidden"); 
    }
  } catch (e) {
    Swal.close();
    showError('โหลดข้อมูลไม่สำเร็จ', e.message);
  }
}

// 4. สร้างฟังก์ชัน openAdviceModal
function openAdviceModal(editData = null) {
    adviceForm.reset();
    
    if (editData) {
        // กรณีแก้ไข: เติมข้อมูลเดิม
        for (const key in editData) {
            const input = adviceForm.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    if (editData[key] === 'on' || editData[key] === true || editData[key] === 'true') input.checked = true;
                } else if (input.type === 'date') {
                     try { input.value = getISODate(new Date(editData[key])); } catch(e){}
                } else {
                    input.value = editData[key];
                }
            }
        }
    } else {
        // กรณีเพิ่มใหม่: ใส่วันที่ปัจจุบัน
        const now = new Date();
        const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        adviceForm.querySelectorAll('input[type="date"]').forEach(inp => inp.value = localDate);
    }
    adviceModal.classList.remove("hidden");
}

// 2. แสดง Preview (007)
async function showDischargePreview(an) {
  showLoading('กำลังโหลดข้อมูลจำหน่าย...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getDischargeForm007&an=${an}`);
    const result = await response.json();
    Swal.close();

    const data = result.data;
    // อัปเดตสถานะที่เมนู
    const span007 = document.getElementById('last-updated-007');
    if (span007) span007.textContent = data ? "บันทึกแล้ว" : "ยังไม่บันทึก";

    chartPreviewContent.innerHTML = "";
    
    if (!data) {
       // กรณีไม่มีข้อมูล
       chartPreviewContent.innerHTML = `
         <div class="text-center py-10 text-gray-400">
            <p>-- ยังไม่มีข้อมูลการจำหน่าย --</p>
            <button class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onclick="openDischargeModal()">+ สร้างบันทึกจำหน่าย</button>
         </div>
       `;
       chartEditBtn.classList.add("hidden");
       chartAddNewBtn.classList.add("hidden"); // 007 มีใบเดียว ไม่ต้อง Add New ซ้ำ
    } else {
       // กรณีมีข้อมูล -> แสดง Template
       const template = document.getElementById("preview-template-007");
       const clone = template.content.cloneNode(true);
       
       // (ในฟังก์ชัน showDischargePreview)
       // Map ข้อมูลลง Template
       for (const key in data) {
           const el = clone.querySelector(`[data-field="${key}"]`);
           if (el) {
               let val = data[key];
               
               // 1. จัดการวันที่
               if (key.includes('Date') || key.includes('Timestamp')) {
                  try { 
                      if(val) val = new Date(val).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }); 
                  } catch(e){}
               }
               
               // 2. จัดการ Checkbox (ถ้าค่าเป็น on/true ให้โชว์ ✓)
               if (val === 'on' || val === true || val === 'true') {
                   el.innerHTML = '<b class="text-green-600 text-lg">✓</b>';
               } 
               // 3. ถ้าไม่มีค่า
               else if (!val || val === 'false') {
                   el.textContent = ''; // ปล่อยว่างในวงเล็บ []
               } 
               // 4. ค่าปกติ (Text)
               else {
                   el.textContent = val;
               }
           }
       }
       chartPreviewContent.appendChild(clone);
       
       // ปุ่มแก้ไข
       chartEditBtn.classList.remove("hidden");
       chartEditBtn.onclick = () => openDischargeModal(data); // ส่งข้อมูลไปแก้ไข
       chartAddNewBtn.classList.add("hidden"); 
    }

  } catch (e) {
    Swal.close();
    showError('โหลดข้อมูลไม่สำเร็จ', e.message);
  }
}

// 3. บันทึกข้อมูล (Save)
if (dischargeForm) {
    dischargeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        showLoading("กำลังบันทึก...");
        
        const formData = new FormData(dischargeForm);
        const data = Object.fromEntries(formData.entries());
        data.AN = currentPatientAN; // อย่าลืม AN

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify({ action: "saveDischargeForm007", formData: data })
            });
            const result = await response.json();
            if (result.success) {
                showSuccess("บันทึกสำเร็จ");
                dischargeModal.classList.add("hidden");
                // Reload Preview
                showDischargePreview(currentPatientAN);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            showError("บันทึกไม่สำเร็จ", err.message);
        }
    });
}

// ปุ่มปิด
if (closeDischargeBtn) {
    closeDischargeBtn.addEventListener("click", () => {
        dischargeModal.classList.add("hidden");
    });
}

// 4. ฟังก์ชันหลักสำหรับ Morse/MAAS

async function openMorseModal() {
  document.getElementById("morse-an-display").textContent = currentPatientAN;
  document.getElementById("morse-name-display").textContent = currentPatientData.Name || '';
  currentMorsePage = 1;
  
  // โหลด Datalist staff
  if (!document.getElementById('staff-list-datalist')) {
      // (โค้ดสร้าง datalist เหมือน Classification)
  }
  
  await fetchAndRenderMorsePage(currentPatientAN, currentMorsePage);
  morseModal.classList.remove("hidden");
}

async function fetchAndRenderMorsePage(an, page) {
  showLoading('กำลังโหลดตารางประเมิน...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getMorseMAASPage&an=${an}&page=${page}`);
    const result = await response.json();
    
    renderMorseTable(result.data, page);
    document.getElementById("morse-page-display").textContent = page;
    document.getElementById("morse-prev-page-btn").disabled = (page <= 1);
    
    Swal.close();
  } catch (e) { showError('โหลดไม่สำเร็จ', e.message); }
}

function renderMorseTable(data, page) {
  const table = morseTable;
  let thead = table.querySelector("thead");
  let tbody = table.querySelector("tbody");
  
  if (!thead) { thead = document.createElement('thead'); table.prepend(thead); }
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Header Row 1 & 2 (Logic เดียวกับ Classification: 5 วัน x 3 เวร)
  const headerRow1 = document.createElement('tr');
  headerRow1.className = 'bg-gray-100';
  headerRow1.innerHTML = '<th rowspan="2" class="p-2 border text-left w-1/3">ประเด็น</th>';
  
  const headerRow2 = document.createElement('tr');
  headerRow2.className = 'bg-gray-50';
  
  const admitDate = new Date(currentPatientData.AdmitDate || new Date());
  const startDate = new Date(admitDate);
  startDate.setDate(startDate.getDate() + ((page - 1) * 5));
  
  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = getISODate(currentDate);
    
    const dateHeader = document.createElement('th');
    dateHeader.colSpan = 3;
    dateHeader.className = 'p-2 border text-center text-sm font-bold';
    dateHeader.innerHTML = `<span>${currentDate.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit'})}</span>
                            <input type="hidden" value="${dateString}" class="morse-date-input" data-day-index="${i}">`;
    headerRow1.appendChild(dateHeader);
    
    .forEach(shift => {
       const th = document.createElement('th');
       th.className = 'p-1 border text-xs font-normal text-center w-10';
       th.textContent = shift;
       headerRow2.appendChild(th);
    });
  }
  thead.appendChild(headerRow1);
  thead.appendChild(headerRow2);

  // Body Rows: Morse Items
  MORSE_CRITERIA.forEach((item, idx) => {
     const row = document.createElement('tr');
     row.innerHTML = `<td class="p-2 border text-sm">${item.label}</td>`;
     
     for (let i = 0; i < 5; i++) {
       const dateStr = getISODate(new Date(startDate.getTime() + (i * 86400000)));
       ['ด', 'ช', 'บ'].forEach(shift => {
          const shiftCode = shift === 'ด' ? 'N' : (shift === 'ช' ? 'D' : 'E');
          const entry = data && data.find(d => d.Date === dateStr && d.Shift === shiftCode);
          const val = entry ? entry[`Morse_${idx+1}`] : "";
          
          let selectHtml = `<select class="w-full p-1 border text-xs morse-score-select text-center" 
                             data-day="${i}" data-shift="${shiftCode}" data-item="Morse_${idx+1}">
                             <option value=""></option>`;
          item.options.forEach(opt => {
             selectHtml += `<option value="${opt.score}" ${String(val) === String(opt.score) ? 'selected' : ''} title="${opt.text}">${opt.score}</option>`;
          });
          selectHtml += `</select>`;
          
          row.innerHTML += `<td class="p-0 border align-top">${selectHtml}</td>`;
       });
     }
     tbody.appendChild(row);
  });

  // Body Row: Total Score & Level
  const totalRow = document.createElement('tr');
  totalRow.className = 'bg-orange-50 font-bold';
  totalRow.innerHTML = `<td class="p-2 border text-right">รวมคะแนน (Morse)</td>`;
  
  // Body Row: MAAS
  const maasRow = document.createElement('tr');
  maasRow.className = 'bg-blue-50';
  maasRow.innerHTML = `<td class="p-2 border font-bold">แบบประเมินการดึงอุปกรณ์ฯ (MAAS)</td>`;

  // Body Row: Assessor & Save
  const actionRow = document.createElement('tr');
  actionRow.innerHTML = `<td class="p-2 border text-right">พยาบาลผู้ประเมิน / บันทึก</td>`;

  for (let i = 0; i < 5; i++) {
      const dateStr = getISODate(new Date(startDate.getTime() + (i * 86400000)));
      ['ด', 'ช', 'บ'].forEach(shift => {
         const shiftCode = shift === 'ด' ? 'N' : (shift === 'ช' ? 'D' : 'E');
         const entry = data && data.find(d => d.Date === dateStr && d.Shift === shiftCode);
         
         // Total Cell
         totalRow.innerHTML += `<td class="p-1 border text-center">
             <input type="text" readonly class="w-full text-center bg-transparent text-xs font-bold morse-total-input" 
             data-day="${i}" data-shift="${shiftCode}" value="${entry ? entry.Morse_Total : ''}">
         </td>`;

         // MAAS Cell
         let maasSelect = `<select class="w-full p-1 border text-xs text-center" name="MAAS_Score" 
                           data-day="${i}" data-shift="${shiftCode}">
                           <option value=""></option>`;
         MAAS_OPTIONS.forEach(opt => {
             maasSelect += `<option value="${opt.score}" ${entry && String(entry.MAAS_Score) === String(opt.score) ? 'selected' : ''} title="${opt.text}">${opt.score}</option>`;
         });
         maasSelect += `</select>`;
         maasRow.innerHTML += `<td class="p-0 border align-top">${maasSelect}</td>`;

         // Action Cell
         actionRow.innerHTML += `<td class="p-1 border text-center">
            <input type="text" list="staff-list-datalist" class="w-full text-xs p-1 border mb-1" placeholder="ชื่อ" 
                   data-day="${i}" data-shift="${shiftCode}" value="${entry ? entry.Assessor_Name : ''}">
            <button type="button" class="bg-green-500 text-white text-[10px] px-1 rounded w-full save-morse-btn"
                   data-day="${i}" data-shift="${shiftCode}">บันทึก</button>
         </td>`;
      });
  }

  tbody.appendChild(totalRow);
  tbody.appendChild(maasRow);
  tbody.appendChild(actionRow);

  // Add Event Listeners for Calculation
  tbody.querySelectorAll('.morse-score-select').forEach(sel => {
      sel.addEventListener('change', () => calculateMorseColumn(sel.dataset.day, sel.dataset.shift));
  });
  
  // Add Event Listeners for Save
  tbody.querySelectorAll('.save-morse-btn').forEach(btn => {
      btn.addEventListener('click', () => handleSaveMorse(btn.dataset.day, btn.dataset.shift));
  });
}

function calculateMorseColumn(day, shift) {
    let total = 0;
    let allFilled = true; // เช็คว่ากรอกครบไหม (ถ้าไม่ซีเรียสก็ตัดออกได้)
    
    for (let i = 1; i <= 6; i++) {
        const sel = document.querySelector(`.morse-score-select[data-day="${day}"][data-shift="${shift}"][data-item="Morse_${i}"]`);
        if (sel && sel.value !== "") {
            total += parseInt(sel.value);
        } else {
            // allFilled = false; 
        }
    }
    
    const totalInput = document.querySelector(`.morse-total-input[data-day="${day}"][data-shift="${shift}"]`);
    if (totalInput) totalInput.value = total;
    return total;
}

// 5. ฟังก์ชันบันทึก และ **แสดง Pop-up แนวทางปฏิบัติ**
async function handleSaveMorse(day, shift) {
    // 1. คำนวณ Morse Total
    const morseTotal = calculateMorseColumn(day, shift);
    
    // 2. อ่านค่า MAAS
    const maasSel = document.querySelector(`select[name="MAAS_Score"][data-day="${day}"][data-shift="${shift}"]`);
    const maasScore = maasSel ? parseInt(maasSel.value) : null;
    
    // 3. อ่านชื่อผู้ประเมิน
    const assessorInput = document.querySelector(`input[list="staff-list-datalist"][data-day="${day}"][data-shift="${shift}"]`);
    const assessorName = assessorInput ? assessorInput.value : "";
    
    if (!assessorName) {
        showError("กรุณาระบุชื่อผู้ประเมิน");
        return;
    }

    // 4. เตรียมข้อมูล
    const dateInput = document.querySelector(`input.morse-date-input[data-day-index="${day}"]`);
    const dateVal = dateInput.value;
    
    // Determine Morse Level
    let morseLevel = "No Risk";
    if (morseTotal >= 51) morseLevel = "High Risk";
    else if (morseTotal >= 25) morseLevel = "Low Risk";
    
    const entryData = {
        AN: currentPatientAN,
        Page: currentMorsePage,
        Date: dateVal,
        Shift: shift,
        Morse_Total: morseTotal,
        Morse_Level: morseLevel,
        MAAS_Score: maasScore,
        Assessor_Name: assessorName
    };
    
    // Collect Morse Item Scores
    for (let i = 1; i <= 6; i++) {
        const sel = document.querySelector(`.morse-score-select[data-day="${day}"][data-shift="${shift}"][data-item="Morse_${i}"]`);
        entryData[`Morse_${i}`] = sel ? sel.value : "";
    }

    // 5. ส่งไปบันทึก
    showLoading("กำลังบันทึก...");
    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({ action: "saveMorseMAASShift", entryData: entryData })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        Swal.close(); // ปิด Loading
        
        // 6. **แสดง Pop-up แนวทางปฏิบัติ (Intervention)**
        let interventionHtml = `<div class="text-left text-sm space-y-2">`;
        
        // 6.1 Morse Guidelines
        if (morseTotal >= 25) {
            const colorClass = morseTotal >= 51 ? "text-red-600" : "text-orange-600";
            const riskText = morseTotal >= 51 ? "High Risk (≥ 51)" : "Low Risk (25-50)";
            
            interventionHtml += `<div class="p-3 bg-gray-50 rounded border">
                <h4 class="font-bold ${colorClass} border-b pb-1 mb-2">เสี่ยงต่อการพลัดตกหกล้ม: ${riskText}</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700">
                    <li>1. จัดเตียงให้เหมาะสมกับสภาพผู้ป่วย</li>
                    <li>2. ประเมินความสามารถในการช่วยเหลือตนเอง การทรงตัว</li>
                    <li>3. ให้ข้อมูลผู้ป่วย/ญาติเกี่ยวกับการป้องกันการพลัดหกล้ม</li>
                    <li>4. จัดสิ่งแวดล้อมให้ปลอดภัย</li>
                    <li>5. ให้ญาติเฝ้า</li>
                    <li>6. ยกเหล็กกั้นเตียง</li>
                    <li>7. ตรวจเยี่ยมผู้ป่วย ${morseTotal >= 51 ? 'ทุก 2 ชั่วโมง' : 'ทุก 4 ชั่วโมง'}</li>
                    <li>8. ติดสัญลักษณ์ความเสี่ยงการพลัดตกหกล้ม</li>
                    ${morseTotal >= 51 ? '<li>9. ผูกมัดผู้ป่วยตามสภาพ</li>' : ''}
                    ${morseTotal >= 51 ? '<li>10. ส่งเวรเกี่ยวกับอาการผู้ป่วย</li>' : ''}
                    ${morseTotal >= 51 ? '<li>11. ปรึกษาสหวิชาชีพ</li>' : ''}
                </ul>
            </div>`;
        } else {
             interventionHtml += `<div class="p-3 bg-green-50 rounded border">
                <h4 class="font-bold text-green-700">No Risk (0-24)</h4>
                <p>ปฏิบัติตามมาตรฐานการดูแลทั่วไป (ข้อ 1-7 ตรวจเยี่ยมเวรละ 1 ครั้ง)</p>
             </div>`;
        }

        // 6.2 MAAS Guidelines 
        if (maasScore !== null) {
            interventionHtml += `<div class="mt-3 p-3 bg-blue-50 rounded border">
                <h4 class="font-bold text-blue-800 border-b pb-1 mb-2">การดึงอุปกรณ์ (MAAS Score: ${maasScore})</h4>`;
            
            if (maasScore >= 4) {
                interventionHtml += `<div class="text-red-700 font-bold">ต้องผูกยึดผู้ป่วยและเฝ้าระวังการดึงอย่างใกล้ชิด</div>
                                     <div class="text-red-600 mt-1 text-xs">***ก่อนผูกยึดแจ้งญาติให้ทราบก่อนทุกครั้ง (กรณีไม่มีญาติให้ผูกยึดได้เลย)***</div>`;
            } else {
                interventionHtml += `<div class="text-green-700">ไม่ต้องผูกยึด</div>`;
            }
            interventionHtml += `</div>`;
        }
        
        interventionHtml += `</div>`;

        // Show Popup
        await Swal.fire({
            title: 'บันทึกสำเร็จ! กรุณาปฏิบัติตามแนวทาง',
            html: interventionHtml,
            icon: 'info',
            width: '600px',
            confirmButtonText: 'รับทราบ'
        });

    } catch (e) {
        showError("บันทึกไม่สำเร็จ", e.message);
    }
}


// ----------------------------------------------------------------
// (10) MAIN EVENT LISTENERS (The Only DOMContentLoaded)
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateClock(); setInterval(updateClock, 1000);
  loadWards();
  wardSwitcher.addEventListener("change", (e) => { selectWard(e.target.value); });
  
  // Admit
  openAdmitModalBtn.addEventListener("click", openAdmitModal);
  closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
  cancelAdmitBtn.addEventListener("click", closeAdmitModal);
  admitForm.addEventListener("submit", handleAdmitSubmit);
  admitDobInput.addEventListener("change", () => {
    const ceDate = admitDobInput.value;
    const beDate = convertCEtoBE(ceDate);
    admitAgeInput.value = calculateAge(beDate);
  });

  // Details
  closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
  editPatientBtn.addEventListener("click", enableEditMode);
  cancelEditBtn.addEventListener("click", resetDetailsModalState);
  detailsForm.addEventListener("submit", handleUpdateSubmit);
  dischargeBtn.addEventListener("click", handleDischarge);
  transferWardBtn.addEventListener("click", handleTransferWard);
  detailsDobInput.addEventListener("change", () => {
    const ceDate = detailsDobInput.value;
    const beDate = convertCEtoBE(ceDate);
    detailsAgeInput.value = calculateAge(beDate);
  });
  
  if(closeChartBtn) closeChartBtn.addEventListener("click", closeChart);

  // Table
  patientTableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'A' && target.dataset.an) {
      e.preventDefault(); openDetailsModal(target.dataset.an);
    }
    if (target.classList.contains('chart-btn') && target.dataset.an) {
      e.preventDefault(); openChart(target.dataset.an, target.dataset.hn, target.dataset.name, target.dataset.bed, target.dataset.doctor);
}
  });

  // Chart
  chartPage.addEventListener('click', (e) => {
    const targetItem = e.target.closest('.chart-list-item');
    if (targetItem) {
      const formType = targetItem.dataset.form;
      chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
      targetItem.classList.add('bg-indigo-100');
      if (formType === '005') showFocusListPreview(currentPatientAN);
      else showFormPreview(formType);
    }
  });
  
  chartEditBtn.addEventListener('click', (e) => {
    const formType = e.target.dataset.form;
    if (formType === '004') {
        openAssessmentForm();
    }
    
    else if (formType === 'morse_maas') {
        openMorseModal();
    }
    else if (formType === '007') {
        return; 
    }
    else if (formType === 'advice') {
        // เรียกฟังก์ชันเปิด Modal พร้อมส่งข้อมูลปัจจุบันเข้าไป
        openAdviceModal(currentAdviceData);
    }
    else {
        showComingSoon(); 
    }
  });
  
  chartAddNewBtn.addEventListener('click', (e) => {
    const formType = e.target.dataset.form;
    if (formType === 'classify') openClassifyModal();
    else if (formType === 'advice') openAdviceModal();
    else if (formType === '005') openFocusProblemModal(); 
    else if (formType === '006') openProgressNoteModal();
    else showComingSoon(); 
  });

  // Assessment FR-004
  closeAssessmentModalBtn.addEventListener("click", closeAssessmentModal);
  document.getElementById("close-assessment-modal-btn-bottom")?.addEventListener("click", closeAssessmentModal);
  assessmentForm.addEventListener("submit", handleSaveAssessment);
  assessmentForm.addEventListener('change', (e) => {
    if (e.target.classList.contains('braden-score')) calculateBradenScore(assessmentForm);
    if (e.target.id === 'assessor-name') {
      const selectedName = e.target.value;
      const staff = globalStaffList.find(s => s.fullName === selectedName);
      assessorPositionInput.value = staff ? staff.position : "";
    }
    if (e.target.classList.contains('assessment-radio-toggle')) {
      const groupName = e.target.name;
      const form = e.target.closest('form'); 
      if (!form) return;
      let selectedValue = (e.target.tagName === 'SELECT') ? e.target.value : (e.target.checked ? e.target.value : null);
      form.querySelectorAll(`[name="${groupName}"]`).forEach(sibling => {
        let targetId = (sibling.tagName === 'SELECT') ? sibling.options[sibling.selectedIndex]?.dataset.controls : sibling.dataset.controls;
        if (targetId) {
          form.querySelector(`#${targetId}`)?.classList.add('hidden');
          form.querySelectorAll(`[data-follows="${targetId}"]`).forEach(f => f.classList.add('hidden'));
        }
      });
      let selectedTargetId = (e.target.tagName === 'SELECT') ? e.target.options[e.target.selectedIndex]?.dataset.controls : (e.target.checked ? e.target.dataset.controls : null);
      if (groupName === 'Substance_Alcohol' && (selectedValue === 'ดื่มเป็นประจำ' || selectedValue === 'ดื่มนาน ๆ ครั้ง')) selectedTargetId = 'alcohol-vol';
      if (groupName === 'Substance_Smoke' && (selectedValue === 'สูบเป็นประจำ' || selectedValue === 'สูบนาน ๆ ครั้ง')) selectedTargetId = 'smoke-vol';
      if (groupName === 'Pain_Pattern' && selectedValue === 'อื่นๆ') selectedTargetId = 'pain-pattern-other';
      if (groupName === 'HP_Before' && selectedValue === 'ไม่ดี') selectedTargetId = 'hp-before-detail';
      if (groupName === 'HP_Care' && selectedValue === 'อื่นๆ') selectedTargetId = 'hp-care-other';
      if (groupName === 'Nutri_Type' && selectedValue === 'อาหารเฉพาะโรค') selectedTargetId = 'nutri-type-detail';
      if (groupName === 'Belief_Cause' && selectedValue === 'อื่นๆ') selectedTargetId = 'belief-cause-other';
      if (groupName === 'Elim_Urine_Status' && selectedValue === 'ไม่ปกติ') selectedTargetId = 'elim-urine-detail';
      if (groupName === 'Elim_Bowel_Status' && selectedValue === 'ไม่ปกติ') selectedTargetId = 'elim-bowel-detail';
      if (groupName === 'Cogn_Speech' && selectedValue === 'ใช้ภาษาต่างประเทศ') selectedTargetId = 'cogn-speech-other';
      if (selectedTargetId) {
        const targetEl = form.querySelector(`#${selectedTargetId}`);
        if (targetEl) targetEl.classList.remove('hidden');
        form.querySelectorAll(`[data-follows="${selectedTargetId}"]`).forEach(f => f.classList.remove('hidden'));
      }
    }
  });

  // Classify FR
  closeClassifyModalBtn.addEventListener("click", closeClassifyModal);
  classifyTableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('classify-save-btn')) {
      const dayIndex = target.dataset.dayIndex;
      const shift = target.dataset.shift;
      const { Total_Score, Category } = updateClassifyColumnTotals(dayIndex, shift);
      if (Total_Score === '' && !classifyTableBody.querySelector(`#classify-row-assessor input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value) {
        showError('ยังไม่มีข้อมูล', 'กรุณาลงคะแนนอย่างน้อย 1 หมวด หรือ ลงชื่อผู้ประเมิน');
        return;
      }
      saveClassificationShiftData(dayIndex, shift);
    }
    if (target.classList.contains('classify-criteria-btn')) {
      const categoryIndex = target.dataset.categoryIndex;
      showCriteriaPopover(categoryIndex);
    }
  });
  classifyPrevPageBtn.addEventListener("click", () => changeClassifyPage(-1));
  classifyNextPageBtn.addEventListener("click", () => changeClassifyPage(1));
  classifyAddPageBtn.addEventListener("click", () => { showError("ยังไม่รองรับ", "ฟังก์ชันเพิ่มหน้าใหม่ (หน้า 6+) ยังไม่เปิดใช้งานครับ"); });

  // Focus List FR-005
  if (closeFocusModalBtn) closeFocusModalBtn.addEventListener("click", closeFocusProblemModal);
  if (cancelFocusBtn) cancelFocusBtn.addEventListener("click", closeFocusProblemModal);
  if (focusProblemForm) focusProblemForm.addEventListener("submit", handleSaveFocusProblem);
 
  if (focusTemplateSearch) {
    focusTemplateSearch.addEventListener("input", (e) => {
      const val = e.target.value; // ค่าที่พิมพ์ หรือ เลือก (คือ Template Name)
      if (!val || !globalFocusTemplates.problems) return;

      const cleanVal = val.trim();

      // แก้ไข: ค้นหาโดยเทียบกับ t.name (ชื่อเทมเพลต) แทน t.problem
      const found = globalFocusTemplates.problems.find(t => t.name === cleanVal);
      
      if (found) {
        // ถ้าเจอชื่อเทมเพลต ให้ดึง Problem และ Goal ตัวเต็มมาใส่
        if(focusProblemText) focusProblemText.value = found.problem;
        if(focusGoalText) focusGoalText.value = found.goal || "";
      }
    });
  }
  if (openFocusTemplateModalBtn) openFocusTemplateModalBtn.addEventListener("click", openAddTemplateModal);
  if (closeTemplateModalBtn) closeTemplateModalBtn.addEventListener("click", closeAddTemplateModal);
  if (cancelTemplateModalBtn) cancelTemplateModalBtn.addEventListener("click", closeAddTemplateModal);
  if (addTemplateForm) addTemplateForm.addEventListener("submit", handleSaveFocusTemplate);

  // Progress note FR-006
    // ปุ่มใน Modal 006
  document.getElementById("close-progress-modal-btn").addEventListener("click", () => {
    progressNoteModal.classList.add("hidden");
    progressNoteForm.reset();
  });
  
  reProgressBtn.addEventListener("click", handleReProgress);

  // ค้นหา Template
  // 5. ค้นหา Template (Input Event) [แก้ไขล่าสุด]
  const progSearchInput = document.getElementById("prog-template-search");
  if(progSearchInput) {
      progSearchInput.addEventListener("input", (e) => {
         const val = e.target.value; // ไม่ต้อง trim() ทันที เผื่อพิมพ์วรรค
         if(!val) return;
         
         // ค้นหาโดยเทียบชื่อ (Name)
         // ใช้ .trim() ทั้งคู่เพื่อให้แม่นยำขึ้น
         const found = globalProgressTemplates.find(t => t.name.trim() === val.trim());
         
         if(found) {
           document.getElementById("prog-focus").value = found.focus || "";
           document.getElementById("prog-s").value = found.s || "";
           document.getElementById("prog-o").value = found.o || "";
           document.getElementById("prog-i").value = found.i || "";
           document.getElementById("prog-e").value = found.e || "";
         }
      });
  }

  // บันทึก Progress Note
  progressNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoading("กำลังบันทึก...");
    const formData = new FormData(progressNoteForm);
    const data = Object.fromEntries(formData.entries());
    data.AN = currentPatientAN; // เติม AN

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
         method: "POST", 
         body: JSON.stringify({ action: "saveNursingProgress", formData: data })
      });
      const result = await response.json();
      if(result.success) {
         showSuccess("บันทึกสำเร็จ");
         progressNoteModal.classList.add("hidden");
         progressNoteForm.reset();
         // อัปเดตหน้าแสดงผลถ้าจำเป็น
      } else { throw new Error(result.message); }
    } catch(err) { showError("บันทึกไม่สำเร็จ", err.message); }
  });

  
  // --- Logic Modal สร้างเทมเพลต (FR-006) [แก้ไขล่าสุด] ---
  const addProgTempModal = document.getElementById("add-progress-template-modal");
  const addProgTempForm = document.getElementById("add-progress-template-form");
  const closeProgTempBtn = document.getElementById("close-prog-temp-modal-btn");
  const cancelProgTempBtn = document.getElementById("cancel-prog-temp-btn");

  // กดปุ่ม "+ สร้าง Template"
  if(saveAsTemplateBtn) {
    saveAsTemplateBtn.addEventListener("click", () => {
       // 1. เคลียร์ฟอร์มก่อน
       addProgTempForm.reset();

       // 2. ดึงข้อมูลจากหน้าจอหลัก (ถ้ามี) มาใส่เป็นค่าเริ่มต้น เพื่อความสะดวก
       document.getElementById("temp-focus-input").value = document.getElementById("prog-focus").value || "";
       document.getElementById("temp-s-input").value = document.getElementById("prog-s").value || "";
       document.getElementById("temp-o-input").value = document.getElementById("prog-o").value || "";
       document.getElementById("temp-i-input").value = document.getElementById("prog-i").value || "";
       document.getElementById("temp-e-input").value = document.getElementById("prog-e").value || "";

       // 3. เปิด Modal
       addProgTempModal.classList.remove("hidden");
    });
  }

  // ปุ่มปิด Modal
  const closeTempModal = () => addProgTempModal.classList.add("hidden");
  if(closeProgTempBtn) closeProgTempBtn.addEventListener("click", closeTempModal);
  if(cancelProgTempBtn) cancelProgTempBtn.addEventListener("click", closeTempModal);

  // กดบันทึก (Submit) ใน Modal สร้างเทมเพลต
  if(addProgTempForm) {
    addProgTempForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // อ่านค่าจากฟอร์มใน Modal (temp-input) ไม่ใช่จากหน้าจอหลัก
      const name = document.getElementById("temp-name-input").value;
      
      if(!name) return;
      
      const data = {
        Name: name,
        Focus: document.getElementById("temp-focus-input").value,
        S: document.getElementById("temp-s-input").value,
        O: document.getElementById("temp-o-input").value,
        I: document.getElementById("temp-i-input").value,
        E: document.getElementById("temp-e-input").value
      };

      closeTempModal(); // ปิด Modal
      showLoading("กำลังสร้าง Template...");

      try {
          const response = await fetch(GAS_WEB_APP_URL, {
             method: "POST", 
             body: JSON.stringify({ action: "addProgressTemplate", templateData: data })
          });
          const result = await response.json();
          if(result.success) {
             globalProgressTemplates = []; // ล้าง Cache
             await loadProgressTemplates(); // โหลดใหม่
             showSuccess("สร้าง Template สำเร็จ");
          } else { 
             throw new Error(result.message); 
          }
       } catch(err) { 
          showError("สร้างไม่สำเร็จ", err.message); 
       }
    });
  }
  // Discharge Plan
  if (closeAdviceBtn) {
    closeAdviceBtn.addEventListener("click", () => adviceModal.classList.add("hidden"));
}

// Submit Form
if (adviceForm) {
    adviceForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        showLoading("กำลังบันทึก...");
        
        const formData = new FormData(adviceForm);
        const data = Object.fromEntries(formData.entries());
        data.AN = currentPatientAN;

        try {
            const response = await fetch(GAS_WEB_APP_URL, {
                method: "POST",
                body: JSON.stringify({ action: "saveAdviceFormData", formData: data })
            });
            const result = await response.json();
            if (result.success) {
                showSuccess("บันทึกสำเร็จ");
                adviceModal.classList.add("hidden");
                showAdvicePreview(currentPatientAN);
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            showError("บันทึกไม่สำเร็จ", err.message);
        }
    });
}
 
document.getElementById("morse-prev-page-btn").addEventListener("click", () => {
    if(currentMorsePage > 1) {
        currentMorsePage--;
        fetchAndRenderMorsePage(currentPatientAN, currentMorsePage);
    }
});
document.getElementById("morse-next-page-btn").addEventListener("click", () => {
    currentMorsePage++;
    fetchAndRenderMorsePage(currentPatientAN, currentMorsePage);
});
document.getElementById("morse-add-page-btn").addEventListener("click", () => {
     showError("แจ้งเตือน", "ระบบจะเพิ่มหน้าอัตโนมัติเมื่อกดปุ่ม 'หน้าถัดไป' ในอนาคต");
});
document.getElementById("close-morse-modal-btn").addEventListener("click", () => {
    morseModal.classList.add("hidden");
    // Reset active state in menu
    chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
});
  
}); // End DOMContentLoaded
