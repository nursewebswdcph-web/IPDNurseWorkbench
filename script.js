// =================================================================
// == IPD Nurse Workbench script.js (Complete Version 2.7.2)
// == (แก้ไขปัญหา "อัปเดตล่าสุด" และ "Coming Soon" Pop-up)
// =================================================================

// ----------------------------------------------------------------
// (1) URL ของ Google Apps Script
// ----------------------------------------------------------------
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymniWtx3CC7M_Wf0QMK-I80d6A2riIDQRRMpMy3IAoGMpYw0_gFuOXMuqWjThVHFHP2g/exec";

// (ใหม่!) ฐานข้อมูลเกณฑ์การประเมิน v2.8
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
// (2) Global Variables
// ----------------------------------------------------------------
let currentWard = null;
let currentPatientAN = null;
let currentPatientData = {};
let allWards = [];
let globalConfigData = {};
let globalStaffList = [];
let currentClassifyPage = 1;


// ----------------------------------------------------------------
// (3) DOM Element Variables
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

// ----------------------------------------------------------------
// (4) Utility Functions
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

function calculateAge(dobString_BE) { // "2517-08-16"
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

function convertCEtoBE(ceDate) { // input: "1974-08-16"
  if (!ceDate || ceDate.length < 10) return null;
  try {
    const [year, month, day] = ceDate.split('-');
    if (parseInt(year) > 2400) return ceDate;
    // It's already BE
    const beYear = parseInt(year) + 543;
    return `${beYear}-${month}-${day}`;
    // output: "2517-08-16"
  } catch (e) { return null;
  }
}

function convertBEtoCE(beDate) { // input: "2517-08-16"
  if (!beDate || beDate.length < 10) return null;
  try {
    const [year, month, day] = beDate.split('-');
    if (parseInt(year) < 2400) return beDate;
    // It's already CE
    const ceYear = parseInt(year) - 543;
    return `${ceYear}-${month}-${day}`;
    // output: "1974-08-16"
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
  return date.toISOString().split('T')[0];
}

// ----------------------------------------------------------------
// (5) Core App Functions (Load Wards, Select Ward, Load Patients)
// ----------------------------------------------------------------

async function loadWards() {
  showLoading('กำลังโหลดข้อมูลตึก...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getWards`);
    const result = await response.json();
    if (result.success) {
      allWards = result.data;
      wardGrid.innerHTML = ""; wardSwitcher.innerHTML = "";
      allWards.forEach(ward => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer text-center transform hover:-translate-y-1";
        card.innerHTML = `<h3 class="text-xl font-bold text-blue-600">${ward.value}</h3>`;
        card.onclick = () => selectWard(ward.value);
        wardGrid.appendChild(card);
        const option = document.createElement("option");
        option.value = ward.value; option.textContent = ward.value;
        wardSwitcher.appendChild(option);
  
      });
      Swal.close();
    } else { throw new Error(result.message); }
  } catch (error) { showError('โหลดข้อมูลตึกไม่สำเร็จ', error.message);
  }
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
      const chartButton = `<button class="chart-btn bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs font-bold py-1 px-3 rounded-full" data-an="${pt.AN}" data-hn="${pt.HN}" data-name="${pt.Name}">Chart</button>`;
      
      row.innerHTML = `
        <td class="p-3">${pt.Bed}</td>
        <td class="p-3">${pt.HN}</td>
        <td class="p-3">${pt.AN}</td>
        <td class="p-3">${nameCell}</td>
        <td class="p-3">${pt.Age || 'N/A'}</td>
        <td class="p-3">${pt.Dept}</td>
        <td class="p-3">${pt.Doctor}</td>
        <td class="p-3">${new Date(pt.AdmitDate).toLocaleDateString('th-TH')}</td>
        <td class="p-3">${calculateLOS(pt.AdmitDate)}</td>
        <td class="p-3 text-center">${chartButton}</td>
      `;
      patientTableBody.appendChild(row);
    });
  } catch (error) {
    showError('โหลดข้อมูลผู้ป่วยไม่สำเร็จ', error.message);
  }
}

// ----------------------------------------------------------------
// (6) Admit Modal Functions
// ----------------------------------------------------------------

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
  } catch (error) { showError('บันทึกข้อมูลไม่สำเร็จ', error.message);
  }
}

// ----------------------------------------------------------------
// (7) Details Modal Functions
// ----------------------------------------------------------------

async function fetchFormData(ward, currentBed = null) {
  if (globalConfigData.departments && !currentBed) {
     const beds = await fetchAvailableBeds(ward, null);
     return { ...globalConfigData, availableBeds: beds };
  }
  
  let url = `${GAS_WEB_APP_URL}?action=getFormData&ward=${ward}`;
  if(currentBed) { url += `&currentBed=${currentBed}`;
  }
  
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
  detailsAgeInput.value = data.Age; // Show saved Age
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

// ----------------------------------------------------------------
// (8) Chart Page & Assessment Functions
// ----------------------------------------------------------------

// ============ (โค้ดที่แก้ไขปัญหา 1) ============
async function openChart(an, hn, name) {
  currentPatientAN = an;
  chartAnDisplay.textContent = an;
  chartHnDisplay.textContent = hn;
  chartNameDisplay.textContent = name;
  
  showLoading('กำลังโหลดข้อมูลเวชระเบียน...');
  try {
    // (ดึงข้อมูลหลัก FR-004)
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${an}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    currentPatientData = result.data;
    // เก็บข้อมูลไว้ใช้
    
    // อัปเดต span ของ 004
    const span004 = document.getElementById('last-updated-004');
    if(span004) { 
      if(currentPatientData.LastUpdatedTime) {
        // แปลง Date จาก ISO string
        span004.textContent = `${new Date(currentPatientData.LastUpdatedTime).toLocaleString('th-TH')} โดย ${currentPatientData.LastUpdatedBy || ''}`;
      } else {
        span004.textContent = "ยังไม่เคยบันทึก";
      }
    }
    
    // (*** BEGIN NEW CODE FOR PROBLEM 1 ***)
    // (แก้ไข) อัปเดต span ของ classify
    const spanClassify = document.getElementById('last-updated-classify');
    if (spanClassify) {
      try {
        // (เรียกข้อมูลสรุป Classification ทันที)
        const classifyResponse = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationSummary&an=${an}`);
        const classifyResult = await classifyResponse.json();
        
        if (classifyResult.success && classifyResult.data.length > 0) {
          // (ดึงข้อมูลล่าสุด = ตัวแรก, เพราะ script.gs เรียงมาแล้ว)
          const latestEntry = classifyResult.data[0];
          const entryDate = new Date(latestEntry.date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
          const shift = latestEntry.shift === 'D' ? 'ดึก' : (latestEntry.shift === 'E' ? 'เช้า' : 'บ่าย');
          spanClassify.textContent = `เวร ${shift} ${entryDate} โดย ${latestEntry.user || 'N/A'}`;
        } else {
          spanClassify.textContent = "ยังไม่เคยบันทึก";
        }
      } catch (e) {
        spanClassify.textContent = "โหลดข้อมูลล้มเหลว";
      }
    }
    // (*** END NEW CODE FOR PROBLEM 1 ***)

    registryPage.classList.add("hidden");
    chartPage.classList.remove("hidden");
    
    showPreviewPlaceholder();
    
    chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
    
    Swal.close();
  } catch (error) {
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
  }
}
// ============ (สิ้นสุดโค้ดที่แก้ไข) ============


function closeChart() {
  chartPage.classList.add("hidden");
  registryPage.classList.remove("hidden");
  currentPatientAN = null;
  currentPatientData = {};
}

// (ใหม่!) แสดง Placeholder
function showPreviewPlaceholder() {
  chartPreviewTitle.textContent = "เลือกเอกสาร";
  chartPreviewPlaceholder.classList.remove("hidden");
  chartPreviewContent.innerHTML = ""; // ล้างเนื้อหาเก่า
  chartEditBtn.classList.add("hidden");
  chartAddNewBtn.classList.add("hidden");
}

// (แทนที่ฟังก์ชันนี้ทั้งหมด)
// ============ (โค้ดใหม่ที่แก้ไข) ============
async function showFormPreview(formType) { // (เพิ่ม async)
  // ซ่อน placeholder
  chartPreviewPlaceholder.classList.add("hidden");
  chartPreviewContent.innerHTML = ""; // ล้างเนื้อหาเก่า
  
  // (ใหม่!) ตรรกะ 1:1 (ฟอร์มประเมินแรกรับ)
  if (formType === '004') {
    chartPreviewTitle.textContent = "แบบประเมินประวัติและสมรรถนะผู้ป่วย (FR-IPD-004)";
    // 1. Clone template
    const template = document.getElementById("preview-template-004");
    if (!template) {
        showError("ไม่พบ Template", "ไม่สามารถโหลด preview-template-004");
        return;
    }
    const preview = template.content.cloneNode(true);
    
    // 2. Populate data (วนลูป)
    for (const key in currentPatientData) {
      if (currentPatientData.hasOwnProperty(key)) {
        let value = currentPatientData[key];
        const el = preview.querySelector(`[data-field="${key}"]`);
        
        if (el) {
          if (value === true || value === 'true' || value === 'on') {
            el.textContent = "✓";
            // ใช้ checkmark สำหรับ true
          } else if (value === false || value === 'false' || !value) {
            el.textContent = "-";
            // ใช้ - สำหรับ false หรือ ค่าว่าง
          } else if (key === 'LastUpdatedTime') {
            el.textContent = new Date(value).toLocaleString('th-TH');
            // แปลงวันที่
          } else {
            el.textContent = value;
          }
        }
      }
    }
    
    // 3. (ตรรกะพิเศษสำหรับ Checkbox ที่รวมกัน)
    
    // Hx Details
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
        .map(k => k.label)
        .join(', ');
      hxDetailEl.textContent = hxText || '-';
    }
    
    // Sx Details
    const sxDetailEl = preview.getElementById('preview-sx-details');
    if (sxDetailEl && (currentPatientData['Sx_Status'] === 'เคย')) {
       sxDetailEl.textContent = `${currentPatientData['Sx_Details'] || ''} (เมื่อ: ${currentPatientData['Sx_Date'] || 'N/A'})`;
    } else if (sxDetailEl) {
       sxDetailEl.textContent = '-';
    }
    
    // Admit Hx Details
    const admitHxEl = preview.getElementById('preview-admit-hx-details');
    if (admitHxEl && (currentPatientData['AdmitHx_Status'] === 'เคย')) {
       admitHxEl.textContent = `${currentPatientData['AdmitHx_Disease'] || ''} (เมื่อ: ${currentPatientData['AdmitHx_Date'] || 'N/A'})`;
    } else if (admitHxEl) {
       admitHxEl.textContent = '-';
    }
    
    // Cope Stress Details
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
    
    // Participation Details
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
    
    // Pain Effect
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
    
    // Pain Relief
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

    // 4. ฉีด Preview ที่เสร็จแล้วลงใน Content
    chartPreviewContent.appendChild(preview);
    // 5. แสดงปุ่ม (FR-IPD-004 เป็น 1:1)
    chartEditBtn.classList.remove("hidden");
    chartEditBtn.dataset.form = "004"; // บอกปุ่มว่าให้แก้ไขฟอร์มไหน
    chartAddNewBtn.classList.add("hidden");
    // ห้ามเพิ่มใหม่
    
  } 
  
  // (ใหม่!) ตรรกะ 1:N (ฟอร์มที่เพิ่มได้หลายครั้ง)
  else {
    // สำหรับฟอร์มอื่นๆ (เช่น classify)
    const formTitle = chartPage.querySelector(`.chart-list-item[data-form="${formType}"] h3`).textContent;
    chartPreviewTitle.textContent = formTitle;
    
    // (เรียกฟังก์ชันใหม่เพื่อแสดง "รายการที่บันทึก" - (แก้ไข) ต้อง await)
    await showEntryList(formType, formTitle);
    // (สำคัญ) แสดงปุ่ม "เพิ่มใหม่"
    chartEditBtn.classList.add("hidden");
    chartAddNewBtn.classList.remove("hidden");
    chartAddNewBtn.dataset.form = formType;
  }
}
// ============ (สิ้นสุดโค้ดที่แก้ไข) ============


// ============ (โค้ดที่แก้ไขปัญหา 2) ============
async function showEntryList(formType, formTitle) { // (เพิ่ม async)
  const template = document.getElementById("template-entry-list");
  if (!template) {
    showError("ไม่พบ Template", "ไม่สามารถโหลด template-entry-list");
    return;
  }
  
  const preview = template.content.cloneNode(true);
  chartPreviewContent.innerHTML = ""; // (ย้ายมาบน) ล้างเนื้อหาก่อน
  
  let entries = [];
  // (ใหม่!) ดึงข้อมูลจริง
  showLoading('กำลังโหลดรายการที่บันทึก...'); // (เพิ่ม Loading)
  try {
    if (formType === 'classify') {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationSummary&an=${currentPatientAN}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      entries = result.data;
    } 
    // else if (formType === 'progress-note') { ... } // (สำหรับฟอร์มอื่นในอนาคต)
    
    Swal.close();
    // (ปิด Loading)
  } catch (error) {
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
    return;
  }

  // สร้าง Header (ย้ายมาไว้ท้าย)
  const header = document.createElement('div');
  header.className = 'p-4 flex justify-between items-center';
  header.innerHTML = `<p class="text-sm text-gray-500">พบ ${entries.length} รายการ</p>`; // (ใช้ข้อมูลจริง)
  preview.prepend(header);
  
  if (entries.length === 0) {
      // (ใหม่!) แสดงว่าไม่มีข้อมูล
      const noEntryDiv = document.createElement('div');
      noEntryDiv.className = 'p-6 text-center text-gray-400';
      noEntryDiv.innerHTML = `<p>-- ยังไม่มีการบันทึก --</p><p>กรุณากดปุ่ม "+ เพิ่มใหม่"</p>`;
      preview.appendChild(noEntryDiv);
  } else {
    // สร้างรายการ (ใช้ entries ที่ดึงมา)
    entries.forEach(entry => {
      const entryDiv = document.createElement('div');
      entryDiv.className = 'p-4 hover:bg-gray-100 cursor-pointer entry-list-item';
      
      // (ปรับปรุงการแสดงผล)
      const entryDate = new Date(entry.date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const shift = entry.shift === 'N' ? 'ดึก' : (entry.shift === 'D' ? 'เช้า' : 'บ่าย');
      
      
      entryDiv.innerHTML = `
        <p class="font-semibold text-blue-600">${entryDate} (เวร ${shift})</p>
        <p class="text-sm text-gray-600">ผู้บันทึก: ${entry.user || 'N/A'}</p>
      `;
      
      // (*** BEGIN MODIFICATION FOR PROBLEM 2 ***)
      // (แก้ไข: เปลี่ยนจาก showComingSoon เป็น openClassifyModal)
      entryDiv.onclick = () => {
          // (ในอนาคต: ควรดึง page_id จาก entry และเปิดไปหน้านั้น)
          openClassifyModal(); 
      };
      // (*** END MODIFICATION FOR PROBLEM 2 ***)
      preview.appendChild(entryDiv);
    });
  }
  
  chartPreviewContent.appendChild(preview);
}
// ============ (สิ้นสุดโค้ดที่แก้ไข) ============

// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ด้วยโค้ดนี้)
async function openAssessmentForm() {
  showLoading('กำลังเตรียมฟอร์มประเมิน...');
  // 1. ดึงรายชื่อ Staff (ถ้ายังไม่มี)
  if(globalStaffList.length === 0) {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
      const result = await response.json();
      if (result.success) {
        globalStaffList = result.data;
        // (เติม Select ในฟอร์มหลัก)
        populateSelect(document.getElementById("assessor-name").id, globalStaffList.map(s => s.fullName));
      }
    } catch (e) { /* (ข้ามไปก่อนถ้าโหลดไม่ได้) */ }
  }
  
  // 2. (อัปเดต) โหลดข้อมูลล่าสุดอีกครั้งเผื่อมีการเปลี่ยนแปลง
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${currentPatientAN}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    currentPatientData = result.data;
    // อัปเดตข้อมูล Global
  } catch(e) {
    showError('ไม่สามารถโหลดข้อมูลล่าสุดได้', e.message);
    return;
  }
  
  // 3. (แก้ไข) เติมข้อมูลลงใน "ฟอร์มหลัก" (assessmentForm)
  populateAssessmentForm(currentPatientData, assessmentForm); 
  
  // 4. แสดง Modal
  assessmentModal.classList.remove("hidden");
  Swal.close();
}

function closeAssessmentModal() {
  assessmentModal.classList.add("hidden");
  assessmentForm.reset();
  calculateBradenScore(assessmentForm); // (แก้ไข)
}

// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ด้วยโค้ดนี้)
function populateAssessmentForm(data, targetForm) {
  targetForm.reset();
  // (ส่วนที่ 1: ดึงจากข้อมูลรับใหม่)
  // (เราจะตั้งค่า Header ของ Modal ต่อเมื่อมันคือ "Modal จริง" เท่านั้น)
  if (targetForm.id === 'assessment-form') { 
    targetForm.querySelector('#assess-an-display').textContent = data.AN;
    targetForm.querySelector('#assess-name-display').textContent = data.Name;
  }
  
  // (ดึงข้อมูลจาก Patients sheet)
  const fieldsToSync = {
    'AdmitDate': 'assess-admit-date',
    'AdmitTime': 'assess-admit-time',
    'AdmittedFrom': 'assess-admit-from',
    'Refer': 'assess-refer-from',
    'ChiefComplaint': 'assess-cc',
    'PresentIllness': 'assess-pi'
  };
  for (const key in fieldsToSync) {
      // (สำคัญ!) ต้องหา el ภายใน targetForm
      const el = targetForm.querySelector(`#${fieldsToSync[key]}`);
      if (el) el.value = data[key] || '';
  }
  
  // (ตรรกะพิเศษสำหรับ MainCaregiver_Rel)
  let rel = data.MainCaregiver_Rel || "";
  let relOtherText = "";
  if (rel.startsWith("อื่นๆ:")) {
    relOtherText = rel.substring(5).trim();
    rel = "อื่นๆ";
  }
  const relRadio = targetForm.querySelector(`[name="MainCaregiver_Rel"][value="${rel}"]`);
  if (relRadio) relRadio.checked = true;
  const relOtherInput = targetForm.querySelector(`[name="MainCaregiver_Rel_Other_Text"]`);
  if (relOtherInput) relOtherInput.value = relOtherText;
  
  // (ส่วนที่ 2-15: ดึงจากข้อมูลที่เคยบันทึก)
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === 'MainCaregiver_Rel' || fieldsToSync.hasOwnProperty(key)) continue;
      const field = targetForm.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'radio') {
          targetForm.querySelectorAll(`[name="${key}"][value="${data[key]}"]`).forEach(el => el.checked = true);
        } else if (field.type === 'checkbox') {
          if (data[key] === true || data[key] === 'true' || data[key] === 'on') {
            field.checked = true;
          }
        } else {
          field.value = data[key];
        }
      }
    }
  }
  
  // (ใหม่!) สั่งอัปเดต UI ของ Toggle ทั้งหมด
  targetForm.querySelectorAll('.assessment-radio-toggle').forEach(el => {
    if (el.tagName === 'SELECT') {
      el.dispatchEvent(new Event('change', { 'bubbles': true }));
    } 
    else if (el.type === 'radio' && el.checked) {
      el.dispatchEvent(new Event('change', { 'bubbles': true }));
    }
  });
  
  // คำนวณคะแนน Braden
  calculateBradenScore(targetForm); 
  
  // ตั้งค่าผู้ประเมิน
  const assessorNameEl = targetForm.querySelector("#assessor-name");
  const assessorPosEl = targetForm.querySelector("#assessor-position");
  if (assessorNameEl && assessorPosEl) {
    // (เติม Dropdown ก่อน ถ้ายังไม่มี)
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

// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ด้วยโค้ดนี้)
async function handleSaveAssessment(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกแบบประเมิน...');
  
  const formData = new FormData(assessmentForm);
  const data = Object.fromEntries(formData.entries());
  
  // --- (ตรรกะพิเศษสำหรับฟิลด์ที่ต้อง "รวม" ข้อมูล) ---
  
  // 1. ความสัมพันธ์ผู้ดูแล
  if (data.MainCaregiver_Rel === 'อื่นๆ') {
    data.MainCaregiver_Rel = 'อื่นๆ: ' + (data.MainCaregiver_Rel_Other_Text || "").trim();
  }
  delete data.MainCaregiver_Rel_Other_Text;
  
  // 2. การเผชิญภาวะเครียด (ตามคอลัมน์ใหม่)
  if (data.Cope_Stress_Status !== 'มี') {
      delete data.Cope_Stress_Fear;
      delete data.Cope_Stress_Cost;
      delete data.Cope_Stress_Work;
      delete data.Cope_Stress_Family;
      delete data.Cope_Stress_Other_Text;
  }
  // --- (สิ้นสุดตรรกะพิเศษ) ---

  const currentUser = data.Assessor_Name || "System"; 

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "saveAssessmentData",
        an: currentPatientAN,
        formData: data,
        user: currentUser
      })
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    showSuccess('บันทึกข้อมูลสำเร็จ!');
    closeAssessmentModal();
    
    // (โหลดข้อมูล Chart ใหม่)
    openChart(currentPatientAN, chartHnDisplay.textContent, chartNameDisplay.textContent); 
    
  } catch (error) {
    showError('บันทึกไม่สำเร็จ', error.message);
  }
}
// ----------------------------------------------------------------
// (ใหม่!) (9) Classification Modal Functions (v2.7)
// ----------------------------------------------------------------

// (ใหม่!) เปิด Modal จำแนกประเภท
// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ด้วยโค้ดนี้)
async function openClassifyModal() {
  // 1. ตั้งค่า Header
  classifyAnDisplay.textContent = currentPatientAN;
  classifyNameDisplay.textContent = currentPatientData.Name || '';
  
  // 2. รีเซ็ต Paging
  currentClassifyPage = 1;
  
  // (ใหม่!) 3. สร้าง Datalist สำหรับค้นหาชื่อผู้ประเมิน (ถ้ายังไม่มี)
  if (!document.getElementById('staff-list-datalist')) {
    const dataList = document.createElement('datalist');
    dataList.id = 'staff-list-datalist';
    // (ใช้ globalStaffList ที่โหลดมาจากตอนเปิด FR-004)
    globalStaffList.forEach(staff => {
      dataList.innerHTML += `<option value="${staff.fullName}"></option>`;
    });
    classifyForm.appendChild(dataList); // เพิ่ม Datalist เข้าไปในฟอร์ม
  }
  
  // 4. โหลดข้อมูลหน้า 1
  await fetchAndRenderClassifyPage(currentPatientAN, currentClassifyPage);
  
  // 5. แสดง Modal
  classifyModal.classList.remove("hidden");
}

// (ใหม่!) ปิด Modal จำแนกประเภท
function closeClassifyModal() {
  classifyModal.classList.add("hidden");
  
  // (โหลด Chart Page ใหม่ เพื่ออัปเดต "อัปเดตล่าสุด")
  openChart(currentPatientAN, chartHnDisplay.textContent, chartNameDisplay.textContent);
}

// (ใหม่!) ดึงข้อมูลและวาดตาราง
async function fetchAndRenderClassifyPage(an, page) {
  showLoading('กำลังโหลดข้อมูลการประเมิน...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationPage&an=${an}&page=${page}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    renderClassifyTable(result.data, page); // ส่ง page ไปด้วย
    classifyPageDisplay.textContent = page;
    classifyPrevPageBtn.disabled = (page <= 1);
    
    Swal.close();
  } catch (error) {
    showError('โหลดข้อมูลไม่สำเร็จ', error.message);
  }
}

// (ใหม่!) วาดตาราง 15 คอลัมน์ (5 วัน x 3 เวร)
function renderClassifyTable(data, page) {
  const table = classifyTable;
  let thead = table.querySelector("thead");
  let tbody = table.querySelector("tbody");
  
  // --- 1. สร้าง Header (วันที่ และ เวร) ---
  if (!thead) {
      thead = document.createElement('thead');
      table.prepend(thead);
  }
  thead.innerHTML = ""; // เคลียร์ของเก่า
  
  const headerRow1 = document.createElement('tr');
  headerRow1.className = 'bg-gray-100';
  headerRow1.innerHTML = '<th rowspan="2" class="p-2 border text-left text-sm font-semibold text-gray-700 w-1/4">หมวดการประเมิน</th>';
  
  const headerRow2 = document.createElement('tr');
  headerRow2.className = 'bg-gray-50';
  
  const admitDate = new Date(currentPatientData.AdmitDate || new Date());
  const startDate = new Date(admitDate);
  startDate.setDate(startDate.getDate() + ((page - 1) * 5));
  
  for (let i = 0; i < 5; i++) { // 5 วัน
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = getISODate(currentDate);
    
    // Header แถว 1 (วันที่)
    const dateHeader = document.createElement('th');
    dateHeader.colSpan = 3;
    dateHeader.className = 'p-2 border text-center text-sm font-semibold text-gray-700';
    dateHeader.innerHTML = `<span class="classify-date-display" data-day-index="${i}">${currentDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          <input type="hidden" value="${dateString}" class="classify-date-input" data-day-index="${i}">`;
    headerRow1.appendChild(dateHeader);
    
    // Header แถว 2 (เวร)
    ['N', 'D', 'E'].forEach(shift => {
      const shiftHeader = document.createElement('th');
      shiftHeader.className = 'p-1 border text-xs font-medium text-gray-600';
      shiftHeader.textContent = shift === 'N' ? 'ดึก (N)' : (shift === 'D' ? 'เช้า (D)' : 'บ่าย (E)');
      headerRow2.appendChild(shiftHeader);
    });
  }
  thead.appendChild(headerRow1);
  thead.appendChild(headerRow2);
  
  // --- 2. สร้าง Body (หมวด 1-8 และ สรุป) ---
  tbody.innerHTML = "";
  // เคลียร์ของเก่า
  
  // (ใหม่!) อัปเดตชื่อหมวดตามเกณฑ์ใหม่
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
  
  // สร้าง 10 แถว (8 หมวด + 2 หัวข้อ)
  categories.forEach((cat) => {
    const row = document.createElement('tr');
    
    if (cat.isHeader) {
      // (แถวหัวข้อ I, II)
      row.className = 'bg-indigo-50';
      row.innerHTML = `<td colspan="16" class="p-2 border font-bold text-indigo-800">${cat.name}</td>`;
    } else {
      // (แถวประเมิน 1-8)
      // (ใหม่!) เพิ่มปุ่ม (?)
      row.innerHTML = `
        <td class="p-2 border font-semibold">
          ${cat.name}
          <button type="button" class="classify-criteria-btn ml-2 text-blue-500 hover:text-blue-700" data-category-index="${cat.scoreIndex}">(?)</button>
        </td>`;
      
      const currentStartDate = new Date(admitDate);
      currentStartDate.setDate(currentStartDate.getDate() + ((page - 1) * 5));
      
      for (let i = 0; i < 5; i++) { // 5 วัน
        const currentDate = new Date(currentStartDate);
        currentDate.setDate(currentStartDate.getDate() + i);
        const dateString = getISODate(currentDate);
        
        ['N', 'D', 'E'].forEach(shift => {
          const entry = data.find(d => d.Date === dateString && d.Shift === shift);
          const score = (entry && entry[`Score_${cat.scoreIndex}`]) ? entry[`Score_${cat.scoreIndex}`] : 0;
          
          // (ใหม่!) เปลี่ยนจาก <input> เป็น <select>
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
  
  // สร้าง 4 แถว สรุป (เพิ่มแถวปุ่ม Save)
  const summaryRows = [
    { id: 'total-score', label: 'รวมคะแนน (Total Score)', class: 'bg-gray-50' },
    { id: 'category', label: 'ประเภทผู้ป่วย (Category)', class: 'bg-gray-100' },
    { id: 'assessor', label: 'ผู้ประเมิน (RN)', class: 'bg-gray-50' },
    { id: 'save', label: 'บันทึกเวร', class: 'bg-white' } // (ใหม่!)
  ];
  
  const summaryStartDate = new Date(admitDate);
  summaryStartDate.setDate(summaryStartDate.getDate() + ((page - 1) * 5));
  
  summaryRows.forEach(sr => {
    const row = document.createElement('tr');
    row.className = sr.class;
    row.id = `classify-row-${sr.id}`;
    row.innerHTML = `<td class="p-2 border font-bold text-right">${sr.label}</td>`;
    
    const currentStartDate = new Date(admitDate); // (รีเซ็ตวันที่อีกครั้ง)
    currentStartDate.setDate(currentStartDate.getDate() + ((page - 1) * 5));
    
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(currentStartDate);
      currentDate.setDate(currentStartDate.getDate() + i);
      const dateString = getISODate(currentDate);

      ['N', 'D', 'E'].forEach(shift => {
        const entry = data.find(d => d.Date === dateString && d.Shift === shift);
        
        // (ใหม่!) ตรรกะสำหรับปุ่ม Save
        if (sr.id === 'save') {
          row.innerHTML += `
            <td class="p-1 border text-center">
              <button type="button" class="classify-save-btn bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded" 
                      data-day-index="${i}" data-shift="${shift}">
                บันทึก
              </button>
            </td>`;
        } 
        // (ตรรกะเดิมสำหรับช่องอื่นๆ)
        else {
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

// (ใหม่!) อัปเดตคะแนนรวมของ 1 คอลัมน์ (1 เวร)
// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ด้วยโค้ดนี้)
function updateClassifyColumnTotals(dayIndex, shift) {
  let total = 0;
  
  // 1. วนลูป 8 หมวด (ใช้ <select>)
  for (let i = 1; i <= 8; i++) {
    const scoreInput = classifyTableBody.querySelector(`select[name="Score_${i}"][data-day-index="${dayIndex}"][data-shift="${shift}"]`);
    if (!scoreInput) continue; 
    
    let score = parseInt(scoreInput.value, 10) || 0;
    total += score;
  }
  
  // 2. อัปเดตช่อง Total
  const totalInput = classifyTableBody.querySelector(`#classify-row-total-score input[data-day-index="${dayIndex}"][data-shift="${shift}"]`);
  if (totalInput) totalInput.value = total > 0 ? total : '';
  
  // 3. (ใหม่!) อัปเดตช่อง Category (ตามเกณฑ์ "Total Score")
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
  
  // (ส่งคืน Total และ Category เผื่อใช้)
  return {
    Total_Score: total > 0 ? total : '',
    Category: categoryInput.value
  };
}

// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ด้วยโค้ดนี้)
async function saveClassificationShiftData(dayIndex, shift) {
  
  // 1. หาวันที่
  const dateInput = classifyTable.querySelector(`input.classify-date-input[data-day-index="${dayIndex}"]`);
  if (!dateInput) return;
  const date = dateInput.value;
  
  // 2. รวบรวมข้อมูล
  const entryData = {
    AN: currentPatientAN,
    Page: currentClassifyPage,
    Date: date,
    Shift: shift
  };
  
  // 3. วนลูป 8 หมวด + ผู้ประเมิน
  let hasData = false;
  for (let i = 1; i <= 8; i++) {
    const val = classifyTableBody.querySelector(`select[name="Score_${i}"][data-day-index="${dayIndex}"][data-shift="${shift}"]`).value;
    if (val && val != "0") hasData = true; // (เช็คว่ามีคะแนน)
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
    
    // (อัปเดตช่อง Total/Category ที่ Backend คำนวณให้)
    const updated = result.updatedData;
    classifyTableBody.querySelector(`#classify-row-total-score input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value = updated.Total_Score;
    classifyTableBody.querySelector(`#classify-row-category input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value = updated.Category;
    
    // (ใช้ showSuccess แทน Swal.close())
    const shiftText = shift === 'N' ? 'ดึก' : (shift === 'D' ? 'เช้า' : 'บ่าย');
    showSuccess('บันทึกสำเร็จ!', `บันทึกเวร ${shiftText} วันที่ ${date} เรียบร้อย`);
  } catch (error) {
    showError('บันทึกไม่สำเร็จ', error.message);
  }
}

// (ใหม่!) ฟังก์ชัน Paging
function changeClassifyPage(direction) {
  const newPage = currentClassifyPage + direction;
  if (newPage < 1) return; // (ห้ามต่ำกว่า 1)
  
  currentClassifyPage = newPage;
  fetchAndRenderClassifyPage(currentPatientAN, currentClassifyPage);
}

// (เพิ่มฟังก์ชันใหม่นี้)
function showCriteriaPopover(categoryIndex) {
  const criteria = CLASSIFY_CRITERIA[categoryIndex.toString()];
  if (!criteria) {
    showError('ไม่พบเกณฑ์', `ไม่พบเกณฑ์สำหรับหมวด ${categoryIndex}`);
    return;
  }

  // สร้าง HTML สำหรับ SweetAlert
  const criteriaHtml = `
    <div class="text-left space-y-4 p-4">
      <div class="p-3 bg-gray-100 rounded-md">
        <p class="font-semibold text-lg text-red-600">คะแนน 4:</p>
        <p class="whitespace-pre-wrap">${criteria[4]}</p>
      </div>
      <div class="p-3 bg-gray-100 rounded-md">
        <p class="font-semibold text-lg text-orange-600">คะแนน 3:</p>
        <p class="whitespace-pre-wrap">${criteria[3]}</p>
      </div>
      <div class="p-3 bg-gray-100 rounded-md">
        <p class="font-semibold text-lg text-yellow-600">คะแนน 2:</p>
        <p class="whitespace-pre-wrap">${criteria[2]}</p>
      </div>
      <div class="p-3 bg-gray-100 rounded-md">
        <p class="font-semibold text-lg text-green-600">คะแนน 1:</p>
        <p class="whitespace-pre-wrap">${criteria[1]}</p>
      </div>
    </div>
  `;
  
  Swal.fire({
    title: criteria.title,
    html: criteriaHtml,
    width: '800px',
    confirmButtonText: 'ปิด'
  });
}

// ----------------------------------------------------------------
// (9) MAIN EVENT LISTENERS (The *only* DOMContentLoaded)
// ----------------------------------------------------------------
// (ค้นหาฟังก์ชันนี้ แล้วแทนที่ "ทั้งบล็อก" ด้วยโค้ดนี้)
document.addEventListener("DOMContentLoaded", () => {
  
  // (Init)
  updateClock(); setInterval(updateClock, 1000);
  loadWards();
  wardSwitcher.addEventListener("change", (e) => { selectWard(e.target.value); });
  
  // (Admit Modal)
  openAdmitModalBtn.addEventListener("click", openAdmitModal);
  closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
  cancelAdmitBtn.addEventListener("click", closeAdmitModal);
  admitForm.addEventListener("submit", handleAdmitSubmit);
  admitDobInput.addEventListener("change", () => {
    const ceDate = admitDobInput.value;
    const beDate = convertCEtoBE(ceDate);
    admitAgeInput.value = calculateAge(beDate);
  });

  // (Details Modal)
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
  
  // (Patient Table Clicks)
  patientTableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'A' && target.dataset.an) {
      e.preventDefault(); openDetailsModal(target.dataset.an);
    }
    if (target.classList.contains('chart-btn') && target.dataset.an) {
      e.preventDefault(); openChart(target.dataset.an, target.dataset.hn, target.dataset.name);
    }
  });
  
  // (Chart Page)
  chartPage.addEventListener('click', (e) => {
    const targetItem = e.target.closest('.chart-list-item');
    if (targetItem) {
      const formType = targetItem.dataset.form;
      chartPage.querySelectorAll('.chart-list-item').forEach(li => li.classList.remove('bg-indigo-100'));
      targetItem.classList.add('bg-indigo-100');
      // (แก้ไข) เราไม่ต้อง await ที่นี่ เพราะ showFormPreview/showEntryList
      // (จะจัดการ Swwal loading ด้วยตัวเอง)
      showFormPreview(formType);
    }
  });
  
  chartEditBtn.addEventListener('click', (e) => {
    const formType = e.target.dataset.form;
    if (formType === '004') { openAssessmentForm(); } 
    else { showComingSoon(); }
  });
  
  chartAddNewBtn.addEventListener('click', (e) => {
    const formType = e.target.dataset.form;
    if (formType === 'classify') { openClassifyModal(); } 
    else { showComingSoon(); }
  });
  
  // (Assessment Modal - FR-004)
  closeAssessmentModalBtn.addEventListener("click", closeAssessmentModal);
  document.getElementById("close-assessment-modal-btn-bottom")?.addEventListener("click", closeAssessmentModal);
  assessmentForm.addEventListener("submit", handleSaveAssessment);
  
  assessmentForm.addEventListener('change', (e) => {
    const target = e.target;
    if (target.classList.contains('braden-score')) {
      calculateBradenScore(assessmentForm);
    }
    if (target.id === 'assessor-name') {
      const selectedName = target.value;
      const staff = globalStaffList.find(s => s.fullName === selectedName);
      assessorPositionInput.value = staff ? staff.position : "";
    }
    if (target.classList.contains('assessment-radio-toggle')) {
      const groupName = e.target.name;
      const form = e.target.closest('form'); 
      if (!form) return;
      
      let selectedValue = (e.target.tagName === 'SELECT') ? e.target.value : (e.target.checked ? e.target.value : null);
      
      form.querySelectorAll(`[name="${groupName}"]`).forEach(sibling => {
        let targetId = (sibling.tagName === 'SELECT') ? 
          sibling.options[sibling.selectedIndex]?.dataset.controls : 
          sibling.dataset.controls;
        if (targetId) {
          form.querySelector(`#${targetId}`)?.classList.add('hidden');
          form.querySelectorAll(`[data-follows="${targetId}"]`).forEach(f => f.classList.add('hidden'));
        }
      });
      
      let selectedTargetId = (e.target.tagName === 'SELECT') ?
        e.target.options[e.target.selectedIndex]?.dataset.controls : 
        (e.target.checked ? e.target.dataset.controls : null);
      
      // (ตรรกะพิเศษสำหรับ select ที่ต้องเช็คค่า)
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
  
  // --- (ใหม่!) Event Listeners สำหรับ Classification Modal (v2.8) ---
  
  closeClassifyModalBtn.addEventListener("click", closeClassifyModal);
  
  // (ใหม่!) เพิ่ม 'click' listener ตัวเดียว
  classifyTableBody.addEventListener('click', (e) => {
    const target = e.target;
    
    // 1. ถ้าคลิกปุ่ม "บันทึก"
    if (target.classList.contains('classify-save-btn')) {
      const dayIndex = target.dataset.dayIndex;
      const shift = target.dataset.shift;
      
      // (คำนวณ)
      const { Total_Score, Category } = updateClassifyColumnTotals(dayIndex, shift);
      
      // (ตรวจสอบว่ามีข้อมูลหรือไม่)
      if (Total_Score === '' && !classifyTableBody.querySelector(`#classify-row-assessor input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value) {
        showError('ยังไม่มีข้อมูล', 'กรุณาลงคะแนนอย่างน้อย 1 หมวด หรือ ลงชื่อผู้ประเมิน');
        return;
      }
      
      // (บันทึก)
      saveClassificationShiftData(dayIndex, shift);
    }
    
    // 2. ถ้าคลิกปุ่ม "เกณฑ์ (?)"
    if (target.classList.contains('classify-criteria-btn')) {
      const categoryIndex = target.dataset.categoryIndex;
      showCriteriaPopover(categoryIndex);
    }
  });
  
  // (Paging)
  classifyPrevPageBtn.addEventListener("click", () => changeClassifyPage(-1));
  classifyNextPageBtn.addEventListener("click", () => changeClassifyPage(1));
  
  // (เพิ่มหน้าใหม่)
  classifyAddPageBtn.addEventListener("click", () => {
    showError("ยังไม่รองรับ", "ฟังก์ชันเพิ่มหน้าใหม่ (หน้า 6+) ยังไม่เปิดใช้งานครับ");
  });

});
