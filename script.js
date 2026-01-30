// =================================================================
// == IPD Nurse Workbench script.js (Version 3.0 - Preview Only)
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
const WARD_LIST = [
    "กุมารเวชกรรม",
    "จิตเวช",
    "นรีเวช",
    "ศัลยกรรมทั่วไป",
    "ศัลยกรรมออร์โธปิดิกส์",
    "สูติกรรม",
    "อายุรกรรม"
];
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
    label: "1. ประวัติการหกล้ม (3 เดือน)",
    options: [
      { text: "ไม่ใช่ / ไม่มีประวัติ (0)", score: 0 },
      { text: "ใช่ / มีประวัติหกล้ม (25)", score: 25 }
    ]
  },
  {
    id: "Morse_2",
    label: "2. การวินิจฉัยโรคมากกว่า 1 รายการ",
    options: [
      { text: "ไม่ใช่ (0)", score: 0 },
      { text: "ใช่ (15)", score: 15 }
    ]
  },
  {
    id: "Morse_3",
    label: "3. การช่วยในการเคลื่อนย้าย",
    options: [
      { text: "เดินได้เอง/ใช้รถเข็นนั่ง/นอนพักบนเตียง (0)", score: 0 },
      { text: "ใช้ไม้ค้ำยัน/ไม้เท้า/Walker (15)", score: 15 },
      { text: "เดินโดยการยึดเกาะเตียง/โต๊ะ/เก้าอี้ (30)", score: 30 }
    ]
  },
  {
    id: "Morse_4",
    label: "4. ให้สารละลายทางหลอดเลือด/คา Heparin lock",
    options: [
      { text: "ไม่ใช่ (0)", score: 0 },
      { text: "ใช่ (20)", score: 20 }
    ]
  },
  {
    id: "Morse_5",
    label: "5. การเดิน / การเคลื่อนย้าย",
    options: [
      { text: "ปกติ / นอนพักบนเตียงโดยไม่ลุก (0)", score: 0 },
      { text: "อ่อนแรงเล็กน้อยหรืออ่อนเพลีย (10)", score: 10 },
      { text: "บกพร่อง ลุกนั่งลำบาก/ต้องช่วยพยุงเดิน (20)", score: 20 }
    ]
  },
  {
    id: "Morse_6",
    label: "6. สภาพจิตใจ",
    options: [
      { text: "รับรู้บุคคล เวลา สถานที่ (0)", score: 0 },
      { text: "ตอบสนองไม่ตรงความจริง/ไม่รับรู้ข้อจำกัด (15)", score: 15 }
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
// (Braden  Modal)
let currentBradenPage = 1;
const bradenModal = document.getElementById("braden-modal");
const bradenForm = document.getElementById("braden-form");
const BRADEN_CRITERIA = [
    {
        id: "Sensory",
        name: "1. การรับความรู้สึก",
        options: [
            { val: 1, text: "1.1 ไม่ตอบสนอง" },
            { val: 2, text: "1.2 มี Pain Stimuli" },
            { val: 3, text: "1.3 สับสน สื่อไม่ได้ทุกครั้ง" },
            { val: 4, text: "1.4 ไม่มีความบกพร่อง ปกติ" }
        ]
    },
    {
        id: "Moisture",
        name: "2. การเปียกชื้นของผิวหนัง",
        options: [
            { val: 1, text: "2.1 เปียกชุ่มตลอดเวลา Diarrhea" },
            { val: 2, text: "2.2 ปัสสาวะราด / อุจจาระราดบ่อยครั้ง" },
            { val: 3, text: "2.3 ปัสสาวะราด / อุจจาระราดบางครั้ง" },
            { val: 4, text: "2.4 ไม่เปียก/กลั้นปัสสาวะและอุจจาระได้" }
        ]
    },
    {
        id: "Activity",
        name: "3. การทำกิจกรรม",
        options: [
            { val: 1, text: "3.1 ต้องอยู่บนเตียงตลอดเวลา" },
            { val: 2, text: "3.2 ทรงตัวไม่อยู่ / ต้องนั่งรถเข็น" },
            { val: 3, text: "3.3 เดินได้ระยะสั้น ต้องช่วยพยุง" },
            { val: 4, text: "3.4 เดินได้เอง / ทำกิจกรรมเองได้" }
        ]
    },
    {
        id: "Mobility",
        name: "4. การเคลื่อนไหว",
        options: [
            { val: 1, text: "4.1 เคลื่อนไหวเองไม่ได้" },
            { val: 2, text: "4.2 เคลื่อนไหวเองได้น้อย / มีข้อติด" },
            { val: 3, text: "4.3 เคลื่อนไหวเองได้ มีผู้ช่วยเหลือบางครั้ง" },
            { val: 4, text: "4.4 เคลื่อนไหวเองได้ปกติ" }
        ]
    },
    {
        id: "Nutrition",
        name: "5. การรับอาหาร",
        options: [
            { val: 1, text: "5.1 NPO / กินได้ 1/3 ถาด" },
            { val: 2, text: "5.2 กินได้บ้างเล็กน้อย / กินได้ 1/2 ถาด" },
            { val: 3, text: "5.3 กินได้พอควร / กินได้ > 1/2 ถาด" },
            { val: 4, text: "5.4 กินได้ปกติ / Feed รับได้หมด" }
        ]
    },
    {
        id: "Friction",
        name: "6. การเสียดสี",
        options: [
            { val: 1, text: "6.1 มีกล้ามเนื้อหดเกร็ง / ใช้ผู้ช่วยหลายคน" },
            { val: 2, text: "6.2 เวลานั่งลื่นไถลได้ / ใช้ผู้ช่วยน้อยคน" },
            { val: 3, text: "6.3 เคลื่อนย้ายอิสระ ไม่มีปัญหาการเสียดสี" }
        ]
    }
];
// ----------------------------------------------------------------
// (5) Utility Functions
// ----------------------------------------------------------------
function refreshWardDatalist() {
    const dataList = document.getElementById('ward-list-datalist');
    if (!dataList) return;

    dataList.innerHTML = ""; // ล้างข้อมูลเก่า
    
    // วนลูปสร้างรายการจาก WARD_LIST
    WARD_LIST.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward;
        dataList.appendChild(option);
    });
}

function refreshDeptDropdowns() {
    // ตรวจสอบว่ารันอยู่ในระบบ Google Apps Script หรือไม่
    if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run.withSuccessHandler(function(deptList) {
            updateDeptElements(deptList);
        }).getDeptOptions(); 
    } else {
        // หากรันแบบ Local ให้พยายามดึงผ่าน fetch (ถ้า Code.gs รองรับ action=getDeptOptions)
        // หรือดึงข้อมูลจาก WARD_LIST มาเป็นค่าเริ่มต้นก่อน
        console.warn("⚠️ google.script.run is not available (Local Testing Mode)");
        const defaultDepts = WARD_LIST.map(w => ({ value: w, context: "" }));
        updateDeptElements(defaultDepts);
    }
}

// แยกฟังก์ชัน Update UI ออกมาเพื่อให้เรียกใช้ได้จากหลายแหล่ง
function updateDeptElements(deptList) {
    const selects = ['admit-dept', 'details-dept']; 
    const deptDatalist = document.getElementById('dept-list-datalist');
    
    let optionsHtml = '<option value="">-- เลือกแผนก --</option>';
    let datalistHtml = '';

    deptList.forEach(item => {
        const label = item.context ? `${item.value} (${item.context})` : item.value;
        optionsHtml += `<option value="${item.value}">${label}</option>`;
        datalistHtml += `<option value="${item.value}">`;
    });

    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = optionsHtml;
    });
    if (deptDatalist) deptDatalist.innerHTML = datalistHtml;
}

// เรียกใช้ฟังก์ชันนี้ตอนโหลดหน้าเว็บ
window.addEventListener('load', refreshDeptDropdowns);
function showLoading(title = 'กำลังประมวลผล...') {
    Swal.fire({
        html: `
            <div class="flex flex-col items-center justify-center py-8">
                <div class="relative mb-4">
                    <div class="animate-spin rounded-full h-20 w-20 border-4 border-indigo-100 border-b-indigo-600"></div>
                    <i class="fas fa-file-medical-alt absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 text-2xl animate-pulse"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                <p class="text-sm text-gray-500 mt-2 px-6 text-center">กรุณารอสักครู่ ระบบกำลังทำงาน...</p>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        width: '420px',
        padding: '0',
        customClass: { popup: 'rounded-3xl shadow-2xl border border-gray-100' }
    });
}
function showModernLoading(title = 'กำลังจัดเตรียมเอกสาร...') {
    Swal.fire({
        html: `
            <div class="flex flex-col items-center justify-center py-8">
                <div class="relative mb-4">
                    <div class="animate-spin rounded-full h-20 w-20 border-4 border-indigo-100 border-b-indigo-600"></div>
                    <i class="fas fa-file-alt absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600 text-2xl animate-pulse"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800">${title}</h2>
                <p class="text-sm text-gray-500 mt-2 px-6 text-center">กำลังโหลดข้อมูลและจัดรูปแบบเอกสาร<br>กรุณารอสักครู่...</p>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        width: '420px',
        padding: '0',
        customClass: { popup: 'rounded-3xl shadow-2xl border border-gray-100' }
    });
}

// 1. โหลดรายชื่อเมื่อเริ่ม (เรียกอัตโนมัติ)
async function loadStaffData() {
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
        const result = await response.json();
        
        if (result.success) {
            globalStaffList = result.data; // เก็บเข้าตัวแปร Global
            // --- เรียกฟังก์ชันที่เราแก้ไขข้างบน ---
            refreshStaffDatalists(globalStaffList); 
        }
    } catch (err) {
        console.error("❌ loadStaffData Error:", err);
    }
}
// ฟังก์ชันสร้าง/อัปเดตตัวเลือกใน Datalist
function updateStaffDatalist() {
    const dl = document.getElementById("staff-list-datalist");
    if (!dl) return;
    
    dl.innerHTML = ""; // ล้างข้อมูลเก่า
    globalStaffList.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.fullName; // ชื่อที่จะแสดงในช่องค้นหา
        opt.dataset.position = s.position; // เก็บตำแหน่งไว้ดึงทีหลัง
        dl.appendChild(opt);
    });
}
// สั่งให้โหลดทันทีเมื่อไฟล์ JS นี้ถูกอ่าน
window.addEventListener('load', () => {
    try {
        loadStaffData();          // โหลดข้อมูลพยาบาล (ฟังก์ชันเดิมที่มีอยู่)
        refreshDeptDropdowns();   // โหลดข้อมูลแผนก (ฟังก์ชันที่แก้ไขใหม่)
    } catch (e) {
        console.error("Initialization Error:", e);
    }
});


// =================================================================
// ฟังก์ชันคำนวณหน้าบันทึก (แก้ปัญหาผลรวม 56 -> 23)
// =================================================================
// ฟังก์ชันคำนวณคะแนน Braden ในฟอร์มบันทึกแบบ Real-time
function calculateBradenInForm() {
    let total = 0;
    // รายชื่อ Parameter ทั้ง 6 ข้อ
    const params = ['Sensory', 'Moisture', 'Activity', 'Mobility', 'Nutrition', 'Friction'];
    
    params.forEach(p => {
        const selected = document.querySelector(`input[name="Braden_${p}"]:checked`);
        if (selected) {
            total += parseInt(selected.value);
        }
    });

    // แสดงผลคะแนนบนหน้าจอ
    const display = document.getElementById('braden-total-display');
    const hiddenInp = document.getElementById('braden-total-hidden');
    const riskText = document.getElementById('braden-risk-text');

    if (display) display.textContent = total;
    if (hiddenInp) hiddenInp.value = total;

    // แปลผลความเสี่ยง (Risk Level) 
    if (riskText && total > 0) {
        let level = "";
        if (total <= 9) level = "Very high risk (≤ 9)";
        else if (total <= 12) level = "High risk (10-12)";
        else if (total <= 14) level = "Moderate risk (13-14)";
        else level = "Low risk (≥ 15)";
        
        riskText.textContent = level;
        
        // ปรับสีตามระดับความเสี่ยง
        if (total <= 12) riskText.className = "font-bold text-red-600 italic";
        else if (total <= 14) riskText.className = "font-bold text-orange-600 italic";
        else riskText.className = "font-bold text-green-600 italic";
    }
}
function calcBraden() {
    const getVal = (name) => {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? parseInt(el.value, 10) : 0;
    };

    const s1 = getVal("Braden_Sensory");
    const s2 = getVal("Braden_Moisture");
    const s3 = getVal("Braden_Activity");
    const s4 = getVal("Braden_Mobility");
    const s5 = getVal("Braden_Nutrition");
    const s6 = getVal("Braden_Friction");

    const setScoreText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val > 0 ? val : '-';
    };
    setScoreText("score_Braden_Sensory", s1);
    setScoreText("score_Braden_Moisture", s2);
    setScoreText("score_Braden_Activity", s3);
    setScoreText("score_Braden_Mobility", s4);
    setScoreText("score_Braden_Nutrition", s5);
    setScoreText("score_Braden_Friction", s6);

    const total = s1 + s2 + s3 + s4 + s5 + s6;

    let resultText = "";
    let colorClass = "text-gray-500";

    if (total > 0) {
        if (total <= 9) {
            resultText = "Very high risk (เสี่ยงสูงมาก)";
            colorClass = "text-red-700";
        } else if (total >= 10 && total <= 12) {
            resultText = "High risk (เสี่ยงสูง)";
            colorClass = "text-red-500";
        } else if (total >= 13 && total <= 14) {
            resultText = "Moderate risk (เสี่ยงปานกลาง)";
            colorClass = "text-orange-500";
        } else {
            resultText = "Low risk (เสี่ยงต่ำ)";
            colorClass = "text-green-600";
        }
    }

    const totalEl = document.getElementById("braden-total-score");
    const resultEl = document.getElementById("braden-result");

    if (totalEl) totalEl.value = total;
    if (resultEl) {
        resultEl.value = resultText;
        resultEl.className = `w-full text-right text-lg font-black italic border-none bg-transparent focus:outline-none ${colorClass}`;
    }
}

// ฟังก์ชันกลางสำหรับปิด Modal ทุกตัวในระบบ
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("hidden");
        // ถ้ามีฟอร์มข้างใน ให้ Reset ข้อมูลด้วย (ถ้าต้องการ)
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
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

function updateAdmitAge() {
    const dobValue = document.getElementById("admit-dob").value;
    if (dobValue) {
        // แปลงจาก CE (Input) เป็น BE เพื่อใช้ฟังก์ชันที่มีอยู่แล้ว
        const beDate = convertCEtoBE(dobValue);
        if (admitAgeInput) {
            admitAgeInput.value = calculateAge(beDate);
        }
    }
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
  // ใช้เทคนิคปรับ Timezone Offset เพื่อให้ได้ค่าวันที่แบบ Local (ไทย) เสมอ
  const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  return offsetDate.toISOString().split('T')[0];
}

// ----------------------------------------------------------------
// (6) Core App Functions
// ----------------------------------------------------------------
function refreshStaffDatalists(staffData) {
    const dataList = document.getElementById('staff-list-datalist');
    if (!dataList) return;

    // หาก staffData เป็น undefined ให้ลองใช้ globalStaffList ที่โหลดไว้ตอนแรก
    const finalData = staffData || globalStaffList;

    if (!finalData || !Array.isArray(finalData)) {
        console.warn("⚠️ refreshStaffDatalists: ไม่พบข้อมูลพยาบาลในระบบ", {
            param: staffData,
            global: globalStaffList
        });
        return; 
    }

    dataList.innerHTML = ''; // ล้างข้อมูลเก่า

    finalData.forEach(staff => {
        if (staff && staff.fullName) {
            const option = document.createElement('option');
            option.value = staff.fullName.trim();
            option.dataset.position = staff.position || "พยาบาลวิชาชีพ";
            dataList.appendChild(option);
        }
    });
    console.log(`✅ Datalist updated with ${finalData.length} names`);
}

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
    if (!currentWard) {
        showError('กรุณาเลือกหอผู้ป่วยก่อนทำรายการ');
        return;
    }

    showLoading('กำลังเตรียมฟอร์มรับใหม่...');
    
    try {
        // ดึงข้อมูลพื้นฐาน (แผนก, แพทย์, รับจาก และเตียงว่างของ Ward ปัจจุบัน)
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getFormData&ward=${currentWard}`);
        const result = await response.json();
        
        if (result.success) {
            const { departments, doctors, availableBeds, admittedFrom } = result.data;

            // 1. เติมข้อมูล "รับจาก" (Admitted From) - เพื่อให้เหมือนฟอร์มแก้ไข
            // ตรวจสอบว่าใน HTML มี <select id="admit-from">
            populateSelect("admit-from", admittedFrom.map(o => o.value));

            // 2. เติมข้อมูล "แผนก" (Dept)
            populateSelect("admit-dept", departments.map(o => o.value));
            
            // 3. เติมรายชื่อแพทย์ลงใน Datalist เพื่อให้ช่อง Input ค้นหาได้
            populateDatalist("doctor-list", doctors.map(o => o.value));

            // 4. เติมเตียงว่าง (เฉพาะของ Ward นี้)
            populateSelect("admit-bed", availableBeds);
            
            // 5. ตั้งค่าเริ่มต้น
            admitForm.reset();
            setFormDefaults(); // ตั้งค่าวันที่/เวลาปัจจุบัน
            
            admitModal.classList.remove("hidden");
            Swal.close();
        }
    } catch (error) {
        showError('โหลดข้อมูลล้มเหลว', error.message);
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
  if (!detailsForm) return;
  detailsForm.reset();

  // 1. เติมข้อมูล "รับจาก" และ "แผนก" (รูปแบบ Select Dropdown)
  // ตรวจสอบว่ามีข้อมูล GlobalConfig และฟังก์ชัน populateSelect หรือไม่
  if (typeof globalConfigData !== 'undefined') {
    populateSelect("details-from", globalConfigData.admittedFrom.map(o => o.value), data.AdmittedFrom);
    populateSelect("details-dept", globalConfigData.departments.map(o => o.value), data.Dept);
  }

  // 2. จัดการช่อง "แพทย์เจ้าของไข้" (รูปแบบ Input + Datalist เพื่อให้พิมพ์ค้นหาได้)
  const doctorInput = document.getElementById("details-doctor");
  if (doctorInput && typeof globalConfigData !== 'undefined') {
    // อัปเดตรายการแพทย์ใน Datalist เผื่อมีการเปลี่ยนแปลง
    if (typeof populateDatalist === 'function') {
      populateDatalist("doctor-list", globalConfigData.doctors.map(o => o.value));
    }
    // ใส่ชื่อแพทย์ปัจจุบัน
    doctorInput.value = data.Doctor || "";
  }

  // 3. เติมข้อมูลพื้นฐาน (Input Text / Hidden)
  const fields = {
    "details-an": data.AN,
    "details-an-display": data.AN,
    "details-hn": data.HN,
    "details-name": data.Name,
    "details-address": data.Address,
    "details-cc": data.ChiefComplaint,
    "details-pi": data.PresentIllness,
    "details-dx": data.AdmittingDx,
    "details-refer": data.Refer,
    "details-age": data.Age
  };

  for (let id in fields) {
    const el = document.getElementById(id);
    if (el) el.value = fields[id] || "";
  }

  // 4. จัดการวันที่และเวลา Admit (ต้องเป็นรูปแบบ YYYY-MM-DD และ HH:mm)
  if (data.AdmitDate) {
    document.getElementById("details-date").value = formatDateForInput(data.AdmitDate);
  }
  if (data.AdmitTime) {
    document.getElementById("details-time").value = data.AdmitTime;
  }

  // 5. จัดการการแสดงผล "เตียง"
  // เริ่มต้นด้วยการแสดงเป็นข้อความ (Display) และซ่อนตัวเลือก (Select) ไว้ก่อน
  if (detailsBedDisplay && detailsBedSelect) {
    detailsBedDisplay.value = data.Bed || "ไม่ระบุ";
    detailsBedDisplay.classList.remove("hidden");
    detailsBedSelect.classList.add("hidden");
  }

  // 6. จัดการวันเกิด (แปลงจาก พ.ศ. ใน Data เป็น ค.ศ. สำหรับ input type="date")
  if (detailsDobInput) {
    // ใช้ฟังก์ชันแปลงวันที่ถ้าข้อมูลส่งมาเป็นรูปแบบไทย
    const ceDate = typeof convertBEtoCE === 'function' ? convertBEtoCE(data.DOB_BE) : data.DOB_CE;
    detailsDobInput.value = ceDate || "";
  }
}

/**
 * ฟังก์ชันเสริม: ช่วยตรวจสอบและฟอร์แมตวันที่ให้เข้ากับ HTML Input (YYYY-MM-DD)
 */
function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  // กรณีวันที่มาเป็น ISO String หรือรูปแบบอื่น ให้จัดการให้เหลือแค่ YYYY-MM-DD
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    console.error("Date formatting error:", e);
  }
  return dateStr;
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
  const an = document.getElementById("details-an").value; // ดึง AN มาจาก Hidden Input

  if (patientData.DOB_CE) {
    patientData.DOB_BE = convertCEtoBE(patientData.DOB_CE);
    delete patientData.DOB_CE;
  }
  
  patientData.Age = document.getElementById("details-age").value;
  
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updatePatient", 
        an: an, 
        patientData: patientData // ส่งชื่อก้อนข้อมูลให้ตรงกับ Code.gs
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
// --- ส่วนของตัวแปร Braden (PDF) ---
const BRADEN_CRITERIA_FULL = [
  { id: "Sensory", label: "1. การรับรู้/ความรู้สึก", 
    1: "จำกัดทั้งหมด: ไม่ตอบสนองต่อสิ่งกระตุ้น", 2: "จำกัดมาก: ตอบสนองต่อสิ่งกระตุ้นที่เจ็บปวดเท่านั้น", 3: "จำกัดเล็กน้อย: ตอบสนองต่อเสียง ไม่ได้ผลเสมอไป", 4: "ไม่บกพร่อง: ตอบสนองตามคำสั่งและสื่อสารได้ปกติ" },
  { id: "Moisture", label: "2. ความเปียกชื้น", 
    1: "ชื้นตลอดเวลา: ตรวจพบผ้าเปียกชื้นทุกครั้ง", 2: "ชื้นมาก: ผ้าเปียกชื้นส่วนใหญ่ (ต้องเปลี่ยนเวรละ 1 ครั้ง)", 3: "ชื้นเป็นครั้งคราว: ผ้าเปียกชื้นวันละ 1 ครั้ง", 4: "ชื้นน้อยมาก: ผิวแห้งปกติ เปลี่ยนผ้าตามรอบ" },
  { id: "Activity", label: "3. กิจกรรม", 
    1: "นอนอยู่บนเตียงตลอดเวลา", 2: "เดินไม่ได้: ต้องใช้รถเข็น", 3: "เดินได้เป็นครั้งคราว: โดยมีผู้ช่วยพยุง", 4: "เดินได้ปกติ: เดินบ่อยๆ อย่างน้อยวันละ 2 ครั้ง" },
  { id: "Mobility", label: "4. การเคลื่อนไหว", 
    1: "เคลื่อนไหวเองไม่ได้เลย", 2: "เคลื่อนไหวได้น้อยมาก: ขยับได้เพียงเล็กน้อย", 3: "เคลื่อนไหวได้บ้าง: ขยับได้ด้วยตนเองอย่างจำกัด", 4: "เคลื่อนไหวได้ปกติ: เปลี่ยนตำแหน่งได้เองบ่อยๆ" },
  { id: "Nutrition", label: "5. โภชนาการ", 
    1: "ไม่เพียงพอ: กินได้ไม่ถึง 1/3 ของถาด", 2: "อาจไม่เพียงพอ: กินได้ประมาณ 1/2 ของถาด", 3: "เพียงพอ: กินได้เกินกว่า 1/2 ของถาด", 4: "ดีเยี่ยม: กินได้หมดเกือบทุกมื้อ" },
  { id: "Friction", label: "6. การเสียดสี", 
    1: "มีปัญหา: ต้องใช้ผู้ช่วยพยุง ดึงลากผิวหนัง", 2: "เสี่ยงต่อการมีปัญหา: ขยับตัวได้ลำบาก ลื่นไถลได้", 3: "ไม่มีปัญหา: เคลื่อนไหวได้เอง ยกตัวได้พ้นที่นอน", 4: "" }
];

// --- ฟังก์ชันสร้างตาราง Braden  ---
function renderBradenInitial() {
  const tbody = document.getElementById("braden-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  
  // ใช้ BRADEN_CRITERIA_FULL สำหรับฟอร์มแรกรับ 004
  BRADEN_CRITERIA_FULL.forEach(crit => {
    let row = `<tr class="hover:bg-gray-50">
      <td class="border p-2 font-bold text-left bg-gray-50">${crit.label}</td>`;
    for (let i = 1; i <= 4; i++) {
      if (crit.id === "Friction" && i === 4) { row += `<td class="border p-2 bg-gray-100">-</td>`; continue; }
      row += `<td class="border p-2 text-left">
        <label class="flex items-start gap-1 cursor-pointer">
          <input type="radio" name="Braden_${crit.id}" value="${i}" class="mt-1 braden-score" required>
          <span>${crit[i]}</span>
        </label>
      </td>`;
    }
    row += `</tr>`;
    tbody.innerHTML += row;
  });
}
function updateBradenResult(total) {
  const resEl = document.getElementById("braden-result");
  if (!resEl) return;
  
  if (total <= 9) { resEl.textContent = "Very high risk"; resEl.className = "text-xl font-black italic text-red-700"; }
  else if (total <= 12) { resEl.textContent = "High risk"; resEl.className = "text-xl font-bold italic text-red-600"; }
  else if (total <= 14) { resEl.textContent = "Moderate risk"; resEl.className = "text-xl font-bold italic text-orange-600"; }
  else if (total >= 15) { resEl.textContent = "Low risk"; resEl.className = "text-xl font-bold italic text-green-600"; }
}

// --- CHART PREVIEW LOGIC ---
function renderADLTable() {
  const tbody = document.getElementById("adl-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  ADL_TASKS.forEach((task, idx) => {
    const fieldPrefix = ["Eat", "Brush", "Dress", "Walk", "Toilet", "Bath"][idx];
    let row = `<tr><td class="border p-3 text-left font-medium">${task}</td>`;
    
    // ก่อนป่วย
    row += `<td class="border p-2"><select name="ADL_${fieldPrefix}_Before" class="w-full p-1 border rounded">`;
    ADL_OPTIONS.forEach(opt => row += `<option value="${opt}">${opt}</option>`);
    row += `</select></td>`;
    
    // ขณะป่วย
    row += `<td class="border p-2"><select name="ADL_${fieldPrefix}_Current" class="w-full p-1 border rounded">`;
    ADL_OPTIONS.forEach(opt => row += `<option value="${opt}">${opt}</option>`);
    row += `</select></td></tr>`;
    
    tbody.innerHTML += row;
  });
}
// =================================================================
// ส่วนจัดการการแสดงผลหน้า Preview (แก้ไขให้ปุ่มพิมพ์ทำงาน)
// =================================================================
async function showFormPreview(formType) {
    chartPreviewPlaceholder.classList.add("hidden");
    chartPreviewContent.innerHTML = "";

    // แสดง Loading สวยๆ ทันที
    showModernLoading('กำลังเปิดตัวอย่างเอกสาร...');

    try {
        if (formType === 'classify') {
            chartPreviewTitle.textContent = "แบบบันทึกการจำแนกประเภทผู้ป่วย)";
            chartEditBtn.classList.add("hidden");
            chartAddNewBtn.classList.remove("hidden");
            chartAddNewBtn.dataset.form = "classify";
            await renderClassifyPrintMode(currentPatientAN);
        }
        else if (formType === '004') {
            chartPreviewTitle.textContent = "แบบประเมินประวัติและสมรรถนะผู้ป่วยแรกรับ";
            chartEditBtn.classList.remove("hidden");
            chartEditBtn.dataset.form = "004";
            chartAddNewBtn.classList.add("hidden");
            await renderForm004PrintMode(currentPatientAN);
        }
        else if (formType === 'braden') {
            chartPreviewTitle.textContent = "แบบประเมินแผลกดทับ (Braden Scale)";
            chartEditBtn.classList.remove("hidden");
            chartEditBtn.dataset.form = "braden"; 
            chartAddNewBtn.classList.add("hidden");
            await renderBradenPrintMode(currentPatientAN);
        }
        else if (formType === 'morse_maas') {
            chartPreviewTitle.textContent = "แบบประเมินความเสี่ยงพลัดตกหกล้ม Morse / MAAS";
            chartEditBtn.classList.remove("hidden");
            chartEditBtn.dataset.form = "morse_maas";
            chartAddNewBtn.classList.add("hidden");
            await renderMorsePrintMode(currentPatientAN);
        }
        else if (formType === 'advice') {
            chartPreviewTitle.textContent = "แบบบันทึกการให้คำแนะนำผู้ป่วย (Discharge Planing)";
            chartEditBtn.classList.add("hidden");
            chartAddNewBtn.classList.remove("hidden");
            chartAddNewBtn.dataset.form = "advice";
            await showAdvicePreview(currentPatientAN);
        }
        else if (formType === '006') {
            chartPreviewTitle.textContent = "บันทึกความก้าวหน้าทางการพยาบาล Nursing Progress Note";
            chartEditBtn.classList.add("hidden");
            chartAddNewBtn.classList.remove("hidden");
            chartAddNewBtn.dataset.form = "006";
            await showProgressNotePreview(currentPatientAN);
        }
        else if (formType === '007') {
            chartPreviewTitle.textContent = "แบบบันทึกการพยาบาลผู้ป่วยจำหน่าย";
            chartEditBtn.classList.add("hidden");
            chartAddNewBtn.classList.remove("hidden");
            chartAddNewBtn.dataset.form = "007";
            await showDischargePreview(currentPatientAN);
        }
        else {
            const formTitleItem = document.querySelector(`.chart-list-item[data-form="${formType}"] h3`);
            chartPreviewTitle.textContent = formTitleItem ? formTitleItem.textContent : "รายละเอียด";
            chartEditBtn.classList.add("hidden");
            chartAddNewBtn.classList.remove("hidden");
            chartAddNewBtn.dataset.form = formType;
            await showEntryList(formType, chartPreviewTitle.textContent);
        }
    } catch (err) {
        Swal.close();
        showError("เกิดข้อผิดพลาดในการโหลดพรีวิว", err.message);
    }
}

// ฟังก์ชันแสดงรายการบันทึก (สำหรับเคส Generic)
async function showEntryList(formType, formTitle) { 
    const template = document.getElementById("template-entry-list");
    if (!template) return;
    
    // สร้าง Loader ชั่วคราว
    chartPreviewContent.innerHTML = '<div class="flex justify-center items-center h-40"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>';
    
    let entries = [];
    
    try {
        if (formType === 'classify') {
            // กรณีนี้อาจจะไม่ถูกเรียกใช้แล้วเพราะมี renderClassifyPrintMode แต่ใส่กันไว้
            const response = await fetch(`${GAS_WEB_APP_URL}?action=getClassificationSummary&an=${currentPatientAN}`);
            const result = await response.json();
            if (result.success) entries = result.data;
        } 
        // เพิ่ม case อื่นๆ ที่ต้องการดึงข้อมูลแบบ List ได้ที่นี่
        
    } catch (error) {
        console.error('โหลดข้อมูลไม่สำเร็จ', error);
        chartPreviewContent.innerHTML = `<div class="text-red-500 p-4 text-center">โหลดข้อมูลไม่สำเร็จ: ${error.message}</div>`;
        return;
    }

    // เตรียม HTML
    const preview = template.content.cloneNode(true);
    const container = document.createElement('div'); // Wrapper

    const header = document.createElement('div');
    header.className = 'p-4 flex justify-between items-center bg-gray-50 border-b';
    header.innerHTML = `<p class="text-sm text-gray-500 font-bold">พบ ${entries.length} รายการ</p>`;
    container.appendChild(header);

    if (entries.length === 0) {
        const noEntryDiv = document.createElement('div');
        noEntryDiv.className = 'p-10 text-center text-gray-400 flex flex-col items-center';
        noEntryDiv.innerHTML = `<i class="fas fa-file-alt text-4xl mb-2"></i><p>-- ยังไม่มีการบันทึก --</p><p class="text-sm mt-1">กดปุ่ม "+ เพิ่มใหม่" เพื่อเริ่มบันทึก</p>`;
        container.appendChild(noEntryDiv);
    } else {
        entries.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'p-4 hover:bg-blue-50 cursor-pointer border-b transition duration-150 ease-in-out';
            
            const entryDate = new Date(entry.date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const shift = entry.shift === 'N' ? 'ดึก' : (entry.shift === 'D' ? 'เช้า' : 'บ่าย');
            
            entryDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-bold text-blue-700 text-lg">${entryDate}</p>
                        <p class="text-sm text-gray-600"><span class="font-semibold">เวร:</span> ${shift}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-500">ผู้บันทึก</p>
                        <p class="text-sm font-medium text-gray-800">${entry.user || 'N/A'}</p>
                    </div>
                </div>
            `;
            
            // Logic การคลิกรายการ
            entryDiv.onclick = () => { 
                if(formType === 'classify') openClassifyModal(entry); // ส่งข้อมูลไปเพื่อแก้ไข (ถ้ามีฟังก์ชันรองรับ)
            };
            container.appendChild(entryDiv);
        });
    }
    
    // แสดงผล
    chartPreviewContent.innerHTML = ""; 
    chartPreviewContent.appendChild(preview); // Append template structure first
    chartPreviewContent.appendChild(container); // Append Data
}

// --- ASSESSMENT FORM LOGIC (FR-004) ---
async function openAssessmentForm() {
  if (!currentPatientAN) return;
  showLoading('กำลังเตรียมฟอร์มประเมิน...');
  
  // 1. โหลดรายชื่อพยาบาลเข้า Datalist (แก้ไขเคสคีย์คำค้นไม่ขึ้น)
  await refreshStaffDatalists(); 
  
  try {
    // 2. ดึงข้อมูลประเมิน + ข้อมูลจากทะเบียนผู้ป่วย (Patients)
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${currentPatientAN}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    const data = result.data;
    
    // 3. Populate Form (ฟังก์ชันเดิมของคุณ)
    populateAssessmentForm(data, assessmentForm);
    
    // 4. Force Fill Readonly Fields (Admit Info) จากตัวแปร global ที่บันทึกไว้
    // (เพื่อให้ช่อง รับจาก, Refer, อาการสำคัญ ขึ้นอัตโนมัติ)
    document.getElementById("assess-admit-from").value = data.AdmittedFrom || "";
    document.getElementById("assess-refer-from").value = data.Refer || "";
    document.getElementById("assess-cc").value = data.ChiefComplaint || "";
    document.getElementById("assess-pi").value = data.PresentIllness || "";
	
	refreshStaffDatalists();
    assessmentModal.classList.remove("hidden");
    Swal.close();
  } catch(e) {
    showError('เกิดข้อผิดพลาด', e.message);
  }
}

async function handleAssessmentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // ส่วนที่แก้ไข: จัดการ Checkbox (เพราะ FormData จะไม่เอาค่าที่ไม่ได้ติ๊กมาส่ง)
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        data[cb.name] = cb.checked; // ส่งเป็น true หรือ false
    });

    // จัดการ Radio (ถ้ามี)
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(rd => {
        data[rd.name] = rd.value;
    });

    const an = document.getElementById('assess-an-display').textContent;

    showLoading('กำลังบันทึกแบบประเมิน...');

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'saveAssessmentForm', // ตรวจสอบให้ตรงกับ switch case ใน Code.gs
                an: an,
                formData: data,
                user: "Nurse_User" // หรือตัวแปรผู้ใช้งานจริง
            })
        });

        const result = await response.json();
        if (result.success) {
            showSuccess('บันทึกสำเร็จ', 'ข้อมูลแบบประเมินถูกบันทึกลงฐานข้อมูลแล้ว');
            closeModal('assessment-modal');
            // รีโหลดหน้าพรีวิวถ้าเปิดอยู่
            if (currentAN === an) renderForm004PrintMode(an);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        showError('บันทึกไม่สำเร็จ', error.message);
    }
}

function closeAssessmentModal() {
  assessmentModal.classList.add("hidden");
  assessmentForm.reset();
  calculateBradenScore(assessmentForm);
}

function populateAssessmentForm(data, targetForm) {
  if (!targetForm) return;
  targetForm.reset();

  // ดึงข้อมูลผู้ป่วยปัจจุบันจากทะเบียนผู้ป่วยมาใส่ในหน้าจอ (Header)
  document.getElementById('assess-bed-display').textContent = currentPatientData.Bed || '-';
  document.getElementById('assess-name-display').textContent = currentPatientData.Name || '-';
  document.getElementById('assess-hn-display').textContent = currentPatientData.HN || '-';
  document.getElementById('assess-an-display').textContent = currentPatientData.AN || '-';
  document.getElementById('assess-doctor-display').textContent = currentPatientData.Doctor || '-';

  // ตั้งค่าข้อมูลแรกรับอัตโนมัติ (Registry Info)
  const setVal = (id, val) => { const el = targetForm.querySelector(`#${id}`); if(el) el.value = val; };
  setVal('assess-admit-date', currentPatientData.AdmitDate ? getISODate(new Date(currentPatientData.AdmitDate)) : "");
  setVal('assess-admit-time', currentPatientData.AdmitTime || "");
  setVal('assess-admit-from', currentPatientData.AdmittedFrom || "");
  setVal('assess-refer-from', currentPatientData.Refer || "");
  setVal('assess-cc', currentPatientData.ChiefComplaint || "");
  setVal('assess-pi', currentPatientData.PresentIllness || "");

  // บรรจุข้อมูลเดิมที่เคยบันทึกไว้ใน Assessment Sheet (ถ้ามี)
  Object.keys(data).forEach(key => {
    // ข้ามฟิลด์ที่ดึงมาจาก Registry แล้ว
    if(['AdmitDate','AdmitTime','AdmittedFrom','Refer','ChiefComplaint','PresentIllness'].includes(key)) return;
    
    const value = data[key];
    const inputs = targetForm.querySelectorAll(`[name="${key}"]`);
    inputs.forEach(input => {
      if (input.type === 'radio') {
        if (String(input.value) === String(value)) input.checked = true;
      } else if (input.type === 'checkbox') {
        if (value === true || value === 'true' || value === 'on') input.checked = true;
      } else {
        input.value = value || '';
      }
    });
  });
  
  // หมายเหตุ: ไม่ต้องเรียก calculateBradenScore แล้ว เนื่องจากต้องการยกเลิกการรวมคะแนน
}

async function handleSaveAssessment(event) {
    event.preventDefault();
    if (!currentPatientAN) {
        showError('ไม่พบข้อมูล AN', 'กรุณาเลือกผู้ป่วยใหม่อีกครั้ง');
        return;
    }

    showLoading('กำลังบันทึกแบบประเมิน...');
    try {
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // แก้ไข: จัดการ Checkbox ทุกตัวในฟอร์ม (ถ้าไม่ติ๊กให้ส่งเป็น false)
        form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            data[cb.name] = cb.checked; 
        });

        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "saveAssessmentData",
                an: currentPatientAN,
                formData: data,
                user: data.Assessor_Name || "System"
            })
        });

        const result = await response.json();
        if (result.success) {
            showSuccess('บันทึกสำเร็จ!', 'ข้อมูลแรกรับถูกบันทึกแล้ว');
            closeAssessmentModal();
            showFormPreview('004'); // รีเฟรชหน้า Preview ทันที
        } else {
            throw new Error(result.message);
        }
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
  
  // --- 1. สร้างส่วนหัวตาราง (Header) ---
  const headerRow1 = document.createElement('tr');
  headerRow1.className = 'bg-gray-100';
  headerRow1.innerHTML = '<th rowspan="2" class="p-2 border text-left text-sm font-semibold text-gray-700 w-1/4 sticky left-0 bg-gray-100 z-10">หมวดการประเมิน</th>';
  
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
    dateHeader.className = 'p-2 border text-center text-sm font-semibold text-gray-700 border-l-2 border-gray-300';
    dateHeader.innerHTML = `<span class="classify-date-display" data-day-index="${i}">${currentDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                          <input type="hidden" value="${dateString}" class="classify-date-input" data-day-index="${i}">`;
    headerRow1.appendChild(dateHeader);
    
    ['N', 'D', 'E'].forEach((shift, idx) => {
      const shiftHeader = document.createElement('th');
      const borderClass = idx === 0 ? 'border-l-2 border-gray-300' : 'border';
      shiftHeader.className = `p-1 ${borderClass} text-xs font-medium text-gray-600 min-w-[50px]`;
      shiftHeader.textContent = shift === 'N' ? 'ดึก' : (shift === 'D' ? 'เช้า' : 'บ่าย');
      headerRow2.appendChild(shiftHeader);
    });
  }
  thead.appendChild(headerRow1);
  thead.appendChild(headerRow2);
  
  tbody.innerHTML = "";
  
  // --- 2. สร้างแถวข้อมูล (Data Rows) ---
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
      row.innerHTML = `<td class="p-2 border font-bold text-indigo-800 sticky left-0 bg-indigo-50 z-10">${cat.name}</td>`;
      // เติมช่องว่างให้เต็มแถว Header
      for(let k=0; k<15; k++) { row.innerHTML += `<td class="bg-indigo-50 border"></td>`; }
    } else {
      row.innerHTML = `
        <td class="p-2 border font-semibold sticky left-0 bg-white z-10 shadow-sm text-xs">
          ${cat.name}
          <button type="button" class="classify-criteria-btn ml-1 text-blue-500 hover:text-blue-700" onclick="showCriteriaPopover(${cat.scoreIndex})">(?)</button>
        </td>`;
      
      const currentStartDate = new Date(admitDate);
      currentStartDate.setDate(currentStartDate.getDate() + ((page - 1) * 5));
      
      for (let i = 0; i < 5; i++) {
        const currentDate = new Date(currentStartDate);
        currentDate.setDate(currentStartDate.getDate() + i);
        const dateString = getISODate(currentDate);

        ['N', 'D', 'E'].forEach((shift, idx) => {
          const entry = data.find(d => d.Date === dateString && d.Shift === shift);
          const score = (entry && entry[`Score_${cat.scoreIndex}`]) ? entry[`Score_${cat.scoreIndex}`] : 0;
          const borderClass = idx === 0 ? 'border-l-2 border-gray-300' : 'border';
          
          row.innerHTML += `
            <td class="p-1 ${borderClass}">
              <select name="Score_${cat.scoreIndex}" class="w-full text-center p-1 border rounded classify-input text-xs" data-day-index="${i}" data-shift="${shift}">
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

  // --- 3. สร้างแถวสรุป (Summary Rows) ---
  const summaryRows = [
    { id: 'total-score', label: 'รวมคะแนน', class: 'bg-gray-50' },
    { id: 'category', label: 'ประเภท', class: 'bg-gray-100' },
    { id: 'assessor', label: 'ผู้ประเมิน', class: 'bg-gray-50' },
    { id: 'save', label: '', class: 'bg-white' }
  ];

  summaryRows.forEach(sr => {
    const row = document.createElement('tr');
    row.className = sr.class;
    row.id = `classify-row-${sr.id}`;
    row.innerHTML = `<td class="p-2 border font-bold text-right sticky left-0 ${sr.class} z-10 text-xs">${sr.label}</td>`;
    
    const currentStartDate = new Date(admitDate);
    currentStartDate.setDate(currentStartDate.getDate() + ((page - 1) * 5));
    
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(currentStartDate);
      currentDate.setDate(currentStartDate.getDate() + i);
      const dateString = getISODate(currentDate);

      ['N', 'D', 'E'].forEach((shift, idx) => {
        const entry = data.find(d => d.Date === dateString && d.Shift === shift);
        const borderClass = idx === 0 ? 'border-l-2 border-gray-300' : 'border';
        
        if (sr.id === 'save') {
          row.innerHTML += `
            <td class="p-1 ${borderClass} text-center">
              <button type="button" class="classify-save-btn bg-blue-500 hover:bg-blue-600 text-white text-[10px] py-1 px-2 rounded w-full shadow" 
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
          const inputClass = (sr.id !== 'assessor') ? 'bg-gray-200 font-bold text-blue-600' : 'classify-assessor-input bg-white focus:ring-1 focus:ring-blue-500';
          
          row.innerHTML += `
            <td class="p-1 ${borderClass}">
              <input ${inputType} name="${sr.id}" 
                     class="w-full text-center p-1 border rounded text-xs ${inputClass}" 
                     data-day-index="${i}" data-shift="${shift}" value="${value}" ${isReadonly}>
            </td>`;
        }
      });
    }
    tbody.appendChild(row);
  });

  // ============================================================
  // [สำคัญมาก] ส่วนที่เพิ่ม: ผูก Event Listener ให้ปุ่มทำงาน
  // ============================================================

  // 1. เมื่อเปลี่ยนคะแนนใน Dropdown -> คำนวณยอดรวมทันที
  tbody.querySelectorAll('.classify-input').forEach(select => {
    select.addEventListener('change', (e) => {
        const day = e.target.dataset.dayIndex;
        const shift = e.target.dataset.shift;
        updateClassifyColumnTotals(day, shift);
    });
  });

  // 2. เมื่อกดปุ่ม "บันทึก" -> เรียกฟังก์ชันบันทึก
  tbody.querySelectorAll('.classify-save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const day = e.target.dataset.dayIndex;
        const shift = e.target.dataset.shift;
        // เรียกฟังก์ชันบันทึก
        saveClassificationShiftData(day, shift);
    });
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

// แก้ไขการบันทึกและรวมคะแนน Classification (ชุดอัปเดต v2.8)
async function saveClassificationShiftData(dayIndex, shift) {
    const dateInput = classifyTable.querySelector(`input.classify-date-input[data-day-index="${dayIndex}"]`);
    if (!dateInput) return;
    const date = dateInput.value;
    
    if (!currentPatientAN) {
        showError('ไม่พบข้อมูล AN', 'กรุณาเปิด Chart ใหม่อีกครั้ง');
        return;
    }

    const entryData = { 
        AN: currentPatientAN, 
        Page: currentClassifyPage, 
        Date: date, 
        Shift: shift 
    };

    let hasData = false;
    let total = 0;
    
    // วนลูปเก็บคะแนน 8 ข้อ และรวมคะแนนฝั่ง Client
    for (let i = 1; i <= 8; i++) {
        const sel = classifyTableBody.querySelector(`select[name="Score_${i}"][data-day-index="${dayIndex}"][data-shift="${shift}"]`);
        const val = parseInt(sel.value) || 0;
        if (val > 0) hasData = true;
        entryData[`Score_${i}`] = val;
        total += val;
    }
    
    const assessorInp = classifyTableBody.querySelector(`#classify-row-assessor input[data-day-index="${dayIndex}"][data-shift="${shift}"]`);
    entryData.Assessor_Name = assessorInp ? assessorInp.value : "";
    if (entryData.Assessor_Name) hasData = true;
    
    if (!hasData) {
        showError("ยังไม่มีข้อมูล", "กรุณาลงคะแนนอย่างน้อย 1 หมวด หรือลงชื่อผู้ประเมิน");
        return;
    }

    // คำนวณประเภทผู้ป่วย (Category) อัตโนมัติก่อนส่ง
    let category = 0;
    if (total > 0 && total <= 8) category = 1;
    else if (total >= 9 && total <= 14) category = 2;
    else if (total >= 15 && total <= 20) category = 3;
    else if (total >= 21 && total <= 26) category = 4;
    else if (total >= 27) category = 5;
    
    entryData.Total_Score = total;
    entryData.Category = category;

    showLoading('กำลังบันทึก...');
    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({ action: "saveClassificationShift", entryData: entryData })
        });
        const result = await response.json();
        if (result.success) {
            // อัปเดตช่องคะแนนรวมและประเภทในตารางให้เห็นทันที
            classifyTableBody.querySelector(`#classify-row-total-score input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value = total;
            classifyTableBody.querySelector(`#classify-row-category input[data-day-index="${dayIndex}"][data-shift="${shift}"]`).value = category;
            
            showSuccess('บันทึกสำเร็จ!', `เวร ${shift} วันที่ ${date} เรียบร้อย`);
        } else throw new Error(result.message);
    } catch (error) { 
        console.error("Save Classify Error:", error);
        showError('บันทึกไม่สำเร็จ', error.message); 
    }
}
// ฟังก์ชันจัดการเครื่องหมายถูก ☑ ในหน้า Preview (เสมือนพิมพ์)
function updateCheckmarkPreview(data, container) {
  // 1. จัดการช่อง ☑/☐ ทั่วไป
  container.querySelectorAll('.chk').forEach(span => {
    const chkKey = span.dataset.chk;
    if (!chkKey) return;
    const [field, targetVal] = chkKey.split(':');
    const actualVal = String(data[field]);
    const isMatched = (actualVal === targetVal) || (targetVal === 'true' && (actualVal === 'true' || actualVal === true));
    span.innerHTML = `<span class="chk-box">${isMatched ? '✓' : '&nbsp;'}</span>`;
  });

  // 2. จัดการตาราง Braden (ติ๊กในเซลล์)
  container.querySelectorAll('.chk-cell').forEach(td => {
    const chkKey = td.dataset.chk;
    if (!chkKey) return;
    const [field, score] = chkKey.split(':');
    if (String(data[field]) === score) {
      td.innerHTML = '<span class="font-bold">✓</span>';
      td.classList.add('bg-blue-50');
    } else {
      td.innerHTML = '';
      td.classList.remove('bg-blue-50');
    }
  });
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
  await refreshStaffDatalists();
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

// 3. ฟังก์ชัน showAdvicePreview (แก้ไขใหม่สมบูรณ์: ใช้ไอคอน Checkbox)
async function showAdvicePreview(an) {
  showLoading('กำลังโหลดคำแนะนำ...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAdviceFormData&an=${an}`);
    const result = await response.json();
    Swal.close();
    
    const data = result.data;
    currentAdviceData = data; 

    const spanStatus = document.getElementById('last-updated-advice');
    if (spanStatus) spanStatus.textContent = data ? "บันทึกแล้ว" : "ยังไม่บันทึก";

    chartPreviewContent.innerHTML = "";

    if (!data) {
       chartPreviewContent.innerHTML = `
         <div class="text-center py-10 text-gray-400">
            <p>-- ยังไม่มีการบันทึกคำแนะนำ --</p>
            <button class="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600" onclick="openAdviceModal()">+ สร้างบันทึกคำแนะนำ</button>
         </div>
       `;
       chartEditBtn.classList.add("hidden");
       chartAddNewBtn.classList.add("hidden");
    } else {
       const template = document.getElementById("preview-template-advice");
       if (!template) return;
       
       const clone = template.content.cloneNode(true);
       
       // Helper Format Date
       const fmtDate = (dStr) => {
           if(!dStr) return "";
           try {
               const d = new Date(dStr);
               return d.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
           } catch(e) { return dStr; }
       };

       // 1. Map Data Fields (Text) - จัดการช่องว่างให้สวยงาม
       const fieldEls = clone.querySelectorAll('[data-field]');
       fieldEls.forEach(el => {
           const key = el.getAttribute('data-field');
           if (data[key]) {
               let val = data[key];
               if (key.includes('Date') && !key.includes('Appoint')) val = fmtDate(val);
               el.textContent = val;
           } else {
               // ใส่ช่องว่างเพื่อให้เส้นประแสดงผลแม้ไม่มีข้อมูล
               el.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; 
           }
       });

       // 2. Map Checkboxes (ใช้ไอคอนสี่เหลี่ยมแทน text)
       const chkEls = clone.querySelectorAll('[data-chk]');
       chkEls.forEach(chk => {
           const key = chk.getAttribute('data-chk');
           // ตรวจสอบค่า (รองรับทั้ง 'on', true, 'true')
           const isChecked = (data[key] === 'on' || data[key] === true || data[key] === 'true');
           
           if (isChecked) {
               // กรณีเลือก: แสดงกล่องมีเครื่องหมายถูก
               chk.innerHTML = `<i class="far fa-check-square"></i>`; 
           } else {
               // กรณีไม่เลือก: แสดงกล่องเปล่า
               chk.innerHTML = `<i class="far fa-square"></i>`;
           }
       });

       chartPreviewContent.appendChild(clone);
       chartEditBtn.classList.remove("hidden");
       chartEditBtn.dataset.form = "advice";
       chartAddNewBtn.classList.add("hidden"); 
    }
  } catch (e) {
    Swal.close();
    showError('โหลดข้อมูลไม่สำเร็จ', e.message);
  }
}

// 4. ฟังก์ชัน openAdviceModal (เวอร์ชันแก้ไข: รวมเป็นอันเดียว)
async function openAdviceModal(editData = null) {
    // 1. รีเซ็ตฟอร์มให้ว่างก่อนเสมอ
    adviceForm.reset();

    // 2. โหลดรายชื่อพยาบาลเข้า Datalist (เพื่อให้ช่องกรอกชื่อพยาบาลมีตัวเลือก)
    // (เรียกใช้ฟังก์ชันที่มีอยู่แล้วใน script.js)
    if (typeof refreshStaffDatalists === 'function') {
        await refreshStaffDatalists();
    }

    if (editData) {
        // === โหมดแก้ไข (Edit Mode) ===
        // วนลูปข้อมูลที่ส่งมา แล้วนำไปใส่ใน Input ตาม attribute "name"
        for (const key in editData) {
            const input = adviceForm.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    // ตรวจสอบค่า 'on', 'true', true สำหรับ Checkbox
                    input.checked = (editData[key] === 'on' || editData[key] === true || editData[key] === 'true');
                } else if (input.type === 'date') {
                    // แปลงวันที่ให้เป็น YYYY-MM-DD เพื่อแสดงผลใน input type="date"
                    try { 
                        if(editData[key]) {
                            input.value = getISODate(new Date(editData[key])); 
                        }
                    } catch(e){}
                } else {
                    // ข้อมูล Text ทั่วไป
                    input.value = editData[key];
                }
            }
        }
    } else {
        // === โหมดเพิ่มใหม่ (New Mode) ===
        // ตั้งค่าวันที่เริ่มต้นเป็น "วันนี้" ให้กับทุกช่องวันที่ในฟอร์มเพื่อความสะดวก
        const now = new Date();
        // ปรับ Timezone เพื่อให้ได้วันที่ปัจจุบันของไทย (Local)
        const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        
        adviceForm.querySelectorAll('input[type="date"]').forEach(inp => {
            inp.value = localDate;
        });
    }

    // 3. แสดง Modal
    adviceModal.classList.remove("hidden");
}

async function handleSaveAdvice(event) {
    event.preventDefault(); // <--- หัวใจสำคัญ: หยุดการรีโหลดหน้าจอ
    showLoading('กำลังบันทึกคำแนะนำ...');

    // ตรวจสอบ AN
    if (!currentPatientAN) {
        showError('ข้อผิดพลาด', 'ไม่พบข้อมูลผู้ป่วย (AN) กรุณาโหลดหน้าใหม่');
        return;
    }

    const formData = new FormData(adviceForm);
    const data = Object.fromEntries(formData.entries());
    
    // เพิ่ม AN ลงไปในข้อมูลที่จะส่ง
    data.AN = currentPatientAN;

    // (Option) จัดการ Checkbox ที่ไม่ได้ติ๊กให้เป็นค่าว่างหรือ false (ถ้าจำเป็น)
    // แต่ Code.gs รองรับค่าว่างอยู่แล้ว จึงส่งไปตามปกติได้เลย

    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({ 
                action: "saveAdviceFormData", 
                formData: data 
            })
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('บันทึกสำเร็จ!', 'ข้อมูลคำแนะนำถูกบันทึกเรียบร้อยแล้ว');
            closeModal('advice-form-modal'); // ปิด Modal
            
            // รีโหลดหน้าแสดงผลตัวอย่าง (Preview)
            showAdvicePreview(currentPatientAN);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error("Save Advice Error:", error);
        showError('บันทึกไม่สำเร็จ', error.message);
    }
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

  // --- Header Row 1: วันที่ ---
  const headerRow1 = document.createElement('tr');
  headerRow1.className = 'bg-gray-100';
  // ขยายความกว้างคอลัมน์ซ้ายเพื่อให้ใส่ข้อความได้พอดี
  headerRow1.innerHTML = '<th rowspan="2" class="p-2 border text-left w-80 align-middle bg-white sticky left-0 z-20 shadow-md">รายการประเมิน</th>'; 
  
  // --- Header Row 2: เวร ---
  const headerRow2 = document.createElement('tr');
  headerRow2.className = 'bg-gray-50';
  
  const admitDate = new Date(currentPatientData.AdmitDate || new Date());
  const startDate = new Date(admitDate);
  startDate.setDate(startDate.getDate() + ((page - 1) * 5));
  
  // Loop สร้างหัวตาราง 5 วัน
  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = getISODate(currentDate);
    
    // Header วันที่
    const dateHeader = document.createElement('th');
    dateHeader.colSpan = 3;
    dateHeader.className = 'p-2 border text-center text-sm font-bold border-l-2 border-gray-300';
    dateHeader.innerHTML = `
        <div class="flex flex-col items-center">
            <span>${currentDate.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit'})}</span>
            <input type="hidden" value="${dateString}" class="morse-date-input" data-day-index="${i}">
        </div>`;
    headerRow1.appendChild(dateHeader);
    
    // Header เวร (ดึก, เช้า, บ่าย)
    ['ด', 'ช', 'บ'].forEach((shift, idx) => {
       const th = document.createElement('th');
       const borderClass = (idx === 0) ? 'border-l-2 border-gray-300' : 'border';
       th.className = `p-1 ${borderClass} text-xs font-normal text-center min-w-[50px]`;
       th.textContent = shift;
       headerRow2.appendChild(th);
    });
  }
  thead.appendChild(headerRow1);
  thead.appendChild(headerRow2);

  // --- Body Rows: Morse Items ---
  MORSE_CRITERIA.forEach((item, idx) => {
     const row = document.createElement('tr');
     
     // --- คอลัมน์ซ้ายสุด: แสดงหัวข้อ และ รายละเอียดตัวเลือก ---
     // ใช้ div ซ้อนกันเพื่อจัด layout แนวตั้ง
     let leftColHtml = `<div class="font-bold text-sm text-gray-800 pb-2 pt-2 border-b border-gray-200 bg-gray-50 px-2">${item.label}</div>`;
     item.options.forEach(opt => {
        // กำหนดความสูง h-10 (40px) ให้แต่ละตัวเลือก เพื่อให้ตรงกับช่อง Radio ด้านขวา
        leftColHtml += `<div class="h-10 flex items-center text-xs text-gray-600 border-b border-gray-100 pl-4 hover:bg-gray-50">${opt.text}</div>`;
     });
     row.innerHTML = `<td class="p-0 border-r border-b bg-white align-top sticky left-0 z-10 shadow-md">${leftColHtml}</td>`;
     
     // --- คอลัมน์ข้อมูล (5 วัน x 3 เวร) ---
     for (let i = 0; i < 5; i++) {
       const dateStr = getISODate(new Date(startDate.getTime() + (i * 86400000)));
       ['N', 'D', 'E'].forEach((shiftCode, sIdx) => { 
          const entry = data && data.find(d => d.Date === dateStr && d.Shift === shiftCode);
          const val = entry ? entry[`Morse_${idx+1}`] : "";
          const borderClass = (sIdx === 0) ? 'border-l-2 border-gray-300' : 'border-r border-gray-200';

          // สร้าง Radio Buttons โดยใช้ Div กั้นความสูงให้เท่ากับข้อความทางซ้าย
          // Spacer สำหรับหัวข้อ (ความสูงเท่ากับหัวข้อด้านซ้าย + padding)
          let cellHtml = `<div class="pb-2 pt-2 border-b border-gray-200 bg-gray-50">&nbsp;</div>`; 
          
          item.options.forEach(opt => {
             const isChecked = (String(val) === String(opt.score)) ? 'checked' : '';
             const radioId = `m_${idx+1}_${i}_${shiftCode}_${opt.score}`;
             
             // ใช้ h-10 และ flex center เพื่อจัดปุ่มให้อยู่ตรงกลางบรรทัดเดียวกับข้อความ
             // เพิ่ม hover effect เพื่อให้ดูง่ายเวลากวาดสายตา
             cellHtml += `
               <div class="h-10 flex items-center justify-center border-b border-gray-100 hover:bg-blue-100 transition-colors cursor-pointer"
                    onclick="document.getElementById('${radioId}').click()">
                 <input type="radio" id="${radioId}" 
                        name="Morse_${idx+1}_Day${i}_${shiftCode}" 
                        value="${opt.score}" 
                        class="morse-radio cursor-pointer transform scale-125 accent-blue-600" 
                        data-day="${i}" data-shift="${shiftCode}" 
                        ${isChecked}>
               </div>`;
          });
          
          row.innerHTML += `<td class="p-0 ${borderClass} align-top bg-white min-w-[50px]">${cellHtml}</td>`;
       });
     }
     tbody.appendChild(row);
  });

  // --- Body Rows: Total & MAAS & Save (คงเดิมแต่ปรับ Sticky ให้สวยงาม) ---
  const totalRow = document.createElement('tr');
  totalRow.className = 'bg-orange-50 font-bold';
  totalRow.innerHTML = `<td class="p-2 border text-right sticky left-0 z-10 bg-orange-100 shadow-md">รวมคะแนน (Morse)</td>`;
  
  const maasRow = document.createElement('tr');
  maasRow.className = 'bg-blue-50';
  maasRow.innerHTML = `<td class="p-2 border font-bold sticky left-0 z-10 bg-blue-100 shadow-md">แบบประเมินการดึงอุปกรณ์ฯ (MAAS)</td>`;

  const actionRow = document.createElement('tr');
  actionRow.innerHTML = `<td class="p-2 border text-right sticky left-0 z-10 bg-gray-100 shadow-md">พยาบาลผู้ประเมิน / บันทึก</td>`;

  for (let i = 0; i < 5; i++) {
      const dateStr = getISODate(new Date(startDate.getTime() + (i * 86400000)));
      ['N', 'D', 'E'].forEach((shiftCode, sIdx) => {
         const entry = data && data.find(d => d.Date === dateStr && d.Shift === shiftCode);
         const borderClass = (sIdx === 0) ? 'border-l-2 border-gray-300' : 'border';
         
         // Total
         totalRow.innerHTML += `<td class="p-1 ${borderClass} text-center align-middle">
             <input type="text" readonly class="w-full text-center bg-transparent text-sm font-bold morse-total-input text-blue-600" 
             data-day="${i}" data-shift="${shiftCode}" value="${entry ? entry.Morse_Total : ''}">
         </td>`;

         // MAAS (ใช้ Dropdown เพื่อประหยัดที่ในแนวตั้ง)
         let maasSelect = `<select class="w-full p-1 border text-[10px] text-center bg-white rounded focus:ring-2 focus:ring-blue-400" name="MAAS_Score" 
                           data-day="${i}" data-shift="${shiftCode}">
                           <option value="">-เลือก-</option>`;
         MAAS_OPTIONS.forEach(opt => {
             maasSelect += `<option value="${opt.score}" ${entry && String(entry.MAAS_Score) === String(opt.score) ? 'selected' : ''}>${opt.text}</option>`;
         });
         maasSelect += `</select>`;
         maasRow.innerHTML += `<td class="p-1 ${borderClass} align-top">${maasSelect}</td>`;

         // Save
         actionRow.innerHTML += `<td class="p-1 ${borderClass} text-center align-top">
            <input type="text" list="staff-list-datalist" 
                   class="w-full text-xs p-1 border mb-1 rounded bg-gray-50 focus:bg-white morse-assessor-input text-center" 
                   placeholder="ชื่อ" 
                   data-day="${i}" data-shift="${shiftCode}" 
                   value="${entry ? entry.Assessor_Name : ''}">
            <button type="button" class="bg-green-500 hover:bg-green-600 text-white text-[10px] py-1 px-2 rounded w-full save-morse-btn shadow"
                   data-day="${i}" data-shift="${shiftCode}">
               บันทึก
            </button>
         </td>`;
      });
  }

  tbody.appendChild(totalRow);
  tbody.appendChild(maasRow);
  tbody.appendChild(actionRow);

  // Event Listeners
  tbody.querySelectorAll('.morse-radio').forEach(radio => {
      radio.addEventListener('change', () => calculateMorseColumn(radio.dataset.day, radio.dataset.shift));
  });
  
  tbody.querySelectorAll('.save-morse-btn').forEach(btn => {
      btn.addEventListener('click', () => handleSaveMorse(btn.dataset.day, btn.dataset.shift));
  });
}

function calculateMorseColumn(day, shift) {
    let total = 0;
    
    // วนลูป 6 ข้อ
    for (let i = 1; i <= 6; i++) {
        // หา Radio ที่ถูกเลือกในข้อนั้นๆ ของวัน/เวร นั้นๆ
        const checkedRadio = document.querySelector(`input[name="Morse_${i}_Day${day}_${shift}"]:checked`);
        if (checkedRadio) {
            total += parseInt(checkedRadio.value);
        }
    }
    
    // แสดงผลรวม
    const totalInput = document.querySelector(`.morse-total-input[data-day="${day}"][data-shift="${shift}"]`);
    if (totalInput) totalInput.value = total;
    
    return total;
}

// 5. ฟังก์ชันบันทึก และ **แสดง Pop-up แนวทางปฏิบัติ**
async function handleSaveMorse(day, shift) {
    const assessorInput = document.querySelector(`.morse-assessor-input[data-day="${day}"][data-shift="${shift}"]`);
    const assessorName = assessorInput ? assessorInput.value.trim() : "";
    
    if (!assessorName) {
        showError("กรุณาระบุชื่อผู้ประเมิน", "ต้องลงชื่อพยาบาลก่อนบันทึก");
        if(assessorInput) assessorInput.focus();
        return;
    }

    const dateInput = document.querySelector(`input.morse-date-input[data-day-index="${day}"]`);
    const dateVal = dateInput ? dateInput.value : "";
    
    if (!dateVal) {
        showError("ไม่พบข้อมูลวันที่", "กรุณารีเฟรชหน้าจอ");
        return;
    }

    const morseTotal = calculateMorseColumn(day, shift);
    const maasSel = document.querySelector(`select[name="MAAS_Score"][data-day="${day}"][data-shift="${shift}"]`);
    const maasScore = maasSel && maasSel.value !== "" ? parseInt(maasSel.value) : null;

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
    
    for (let i = 1; i <= 6; i++) {
        const checkedRadio = document.querySelector(`input[name="Morse_${i}_Day${day}_${shift}"]:checked`);
        entryData[`Morse_${i}`] = checkedRadio ? checkedRadio.value : "";
    }

    showLoading("กำลังบันทึก...");
    try {
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({ action: "saveMorseMAASShift", entryData: entryData })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        Swal.close();

        // --- ข้อความแนวทางปฏิบัติ (คงเดิม 100%) ---
        let interventionHtml = `<div class="text-left text-sm space-y-4">`;
        
        if (morseTotal >= 25) {
             const colorClass = morseTotal >= 51 ? "text-red-600" : "text-orange-600";
             const riskText = morseTotal >= 51 ? "High Risk (≥ 51)" : "Low Risk (25-50)";
             
             interventionHtml += `<div class="p-3 bg-gray-50 rounded border border-gray-200">
                <h4 class="font-bold ${colorClass} border-b pb-1 mb-2">เสี่ยงต่อการพลัดตกหกล้ม: ${riskText}</h4>
                <ul class="list-disc pl-5 space-y-1 text-gray-700 text-xs">
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
             interventionHtml += `<div class="p-3 bg-green-50 rounded border border-green-200">
                <h4 class="font-bold text-green-700 mb-1">เสี่ยงต่อการพลัดตกหกล้ม: No Risk (0-24)</h4>
                <p class="text-gray-600 text-xs">ปฏิบัติตามมาตรฐานการดูแลทั่วไป (ข้อ 1-7 ตรวจเยี่ยมเวรละ 1 ครั้ง)</p>
             </div>`;
        }

        if (maasScore !== null) {
            let maasHtml = (maasScore <= 3) 
                ? `<div class="text-green-700 font-bold">ไม่ต้องผูกยึด</div>`
                : `<div class="text-red-700 font-bold mb-1">ต้องผูกยึดผู้ป่วยและเฝ้าระวังการดึงอย่างใกล้ชิด</div>
                   <ul class="list-disc pl-5 space-y-1 text-red-600 text-xs">
                       <li>***ก่อนผูกยึดแจ้งญาติให้ทราบก่อนทุกครั้ง***</li>
                       <li>***กรณีไม่มีญาติให้ผู้ยึดได้เลย****</li>
                   </ul>`;

            interventionHtml += `<div class="p-3 bg-blue-50 rounded border border-blue-200">
                <h4 class="font-bold text-blue-800 border-b border-blue-200 pb-1 mb-2">
                    แนวทางปฏิบัติการป้องกันการดึงอุปกรณ์ฯ (MAAS Score: ${maasScore})
                </h4>
                ${maasHtml}
            </div>`;
        }
        
        interventionHtml += `</div>`;

        await Swal.fire({
            title: 'บันทึกสำเร็จ',
            html: interventionHtml,
            icon: 'info',
            confirmButtonText: 'รับทราบ',
            confirmButtonColor: '#3085d6',
            width: '600px'
        });

    } catch (e) {
        showError("บันทึกไม่สำเร็จ", e.message);
    }
}

// ----------------------------------------------------------------
// Braden Scale Logic
// ----------------------------------------------------------------

async function openBradenModal(targetPage = 1) {
    document.getElementById("braden-an-display").textContent = currentPatientAN;
    document.getElementById("braden-name-display").textContent = currentPatientData.Name || '';
    
    // กำหนดหน้าที่จะเปิด (ถ้าส่งมาให้ใช้หน้านั้น ถ้าไม่ส่งให้เริ่มที่ 1)
    currentBradenPage = targetPage || 1;
    
    if (!document.getElementById('staff-list-datalist')) {
       // (Logic datalist เดิม...)
    }

    await fetchAndRenderBradenPage(currentPatientAN, currentBradenPage);
    bradenModal.classList.remove("hidden");
}
// --- ฟังก์ชันบันทึก Braden Scale (เพิ่มใหม่) ---
async function handleSaveBraden(event) {
    event.preventDefault(); // หยุดการรีเฟรชหน้า
    
    if (!currentPatientAN) {
        showError('ไม่พบข้อมูลผู้ป่วย', 'กรุณาเปิด Chart ใหม่อีกครั้ง');
        return;
    }

    showLoading('กำลังบันทึก Braden Scale...');

    try {
        const formData = new FormData(bradenForm);
        const data = Object.fromEntries(formData.entries());

        // 1. เพิ่มข้อมูลสำคัญ (Key)
        data.AN = currentPatientAN;
        data.Page = currentBradenPage;

        // 2. รวบรวมข้อมูลตารางบันทึกแผล (Wound Record) เป็น JSON
        const woundRows = [];
        const tbody = document.getElementById("wound-record-body");
        if (tbody) {
            tbody.querySelectorAll("tr").forEach(tr => {
                const rowData = {
                    date: tr.querySelector(".wound-date")?.value || "",
                    pos: tr.querySelector(".wound-pos")?.value || "",
                    stage: tr.querySelector(".wound-stage")?.value || "",
                    char: tr.querySelector(".wound-char")?.value || "",
                    user: tr.querySelector(".wound-user")?.value || ""
                };
                // บันทึกเฉพาะแถวที่มีข้อมูลอย่างน้อย 1 ช่อง
                if (rowData.date || rowData.pos || rowData.stage) {
                    woundRows.push(rowData);
                }
            });
        }
        data.Wound_Record_JSON = JSON.stringify(woundRows);

        // 3. ส่งข้อมูลไป Server
        const response = await fetch(GAS_WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify({ 
                action: "saveBradenPage", 
                formData: data 
            })
        });

        const result = await response.json();

        if (result.success) {
            showSuccess('บันทึกสำเร็จ!', 'ข้อมูล Braden Scale ถูกบันทึกเรียบร้อย');
            closeModal('braden-modal');
            
            // รีเฟรชหน้า Preview
            showFormPreview('braden'); 
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error("Save Braden Error:", error);
        showError('บันทึกไม่สำเร็จ', error.message);
    }
}

async function fetchAndRenderBradenPage(an, page) {
    showLoading("กำลังโหลดตาราง...");
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getBradenPage&an=${an}&page=${page}`);
        const result = await response.json();
        const data = result.data || {}; 
        
        const safeSetValue = (id, value) => { const el = document.getElementById(id); if (el) el.value = value; };
        const safeSetByName = (name, value) => { const el = document.querySelector(`[name="${name}"]`); if (el) el.value = value; };

        // Header Data
        safeSetValue("braden-admit-date", data.AdmitDate_Braden || currentPatientData.AdmitDate || "");
        safeSetValue("braden-dx", data.Dx_Op || currentPatientData.AdmittingDx || "");
        safeSetByName("TransferDate", data.TransferDate || "");
        safeSetByName("FromWard", data.FromWard || "");
        safeSetByName("FirstAssessDate", data.FirstAssessDate || "");
        
        if (data.PressureUlcer_Adm_Status) {
            const puRadio = document.querySelector(`input[name="PressureUlcer_Adm_Status"][value="${data.PressureUlcer_Adm_Status}"]`);
            if (puRadio) puRadio.checked = true;
        }
        safeSetByName("PressureUlcer_Adm_Detail", data.PressureUlcer_Adm_Detail || "");
        safeSetValue("braden-albumin", data.Albumin || "");
        safeSetValue("braden-hb", data.Hb || "");
        safeSetByName("Hct", data.Hct || "");
        safeSetValue("braden-bmi", data.BMI || "");
        
        // Render Table
        renderBradenTable(data);
        
        // --- Part 4 Summary Data (เพิ่มวันที่จำหน่าย/ย้ายตรงนี้) ---
        if (data.Discharge_Status) {
             const statusRadio = document.querySelector(`input[name="Discharge_Status"][value="${data.Discharge_Status}"]`);
             if(statusRadio) statusRadio.checked = true;
        }
        // วันที่จำหน่าย/ย้าย
        safeSetByName("Discharge_Summary_Date", data.Discharge_Summary_Date || "");
        
        safeSetByName("Discharge_Position", data.Discharge_Position || "");
        safeSetByName("Discharge_Stage", data.Discharge_Stage || "");
        if(data.Discharge_Date) { try { const d = document.querySelector('[name="Discharge_Date"]'); if(d) d.value = getISODate(new Date(data.Discharge_Date)); } catch(e){} }
        safeSetByName("Discharge_Size", data.Discharge_Size || "");
        safeSetByName("Discharge_Char", data.Discharge_Char || "");
        safeSetByName("Discharge_Count", data.Discharge_Count || "");

        // Wound Record
        if (data.Wound_Record_JSON) {
             try { renderWoundRows(JSON.parse(data.Wound_Record_JSON)); } catch(e) { console.error(e); }
        } else {
             renderWoundRows([]); 
        }

        const pageDisplay = document.getElementById("braden-page-display");
        if(pageDisplay) pageDisplay.textContent = page;
        const prevBtn = document.getElementById("braden-prev-page");
        if(prevBtn) prevBtn.disabled = (page <= 1);
        
        Swal.close();
    } catch (e) { 
        console.error(e);
        showError("โหลดข้อมูลไม่สำเร็จ", e.message); 
    }
}

function renderBradenTable(data = {}) { 
    const table = document.getElementById("braden-table");
    if (!table) return;
    table.innerHTML = "";
    
    let theadHtml = `<thead class="bg-red-50">
      <tr>
        <th class="p-2 border w-80 text-left sticky left-0 bg-red-50 z-20 shadow-md align-bottom">
            <div class="font-bold text-red-800 text-lg">ส่วนที่ 1 การประเมินความเสี่ยง</div>
        </th>`;
    
    for (let i = 1; i <= 10; i++) {
        const dateVal = (data && data[`Date_${i}`]) ? getISODate(new Date(data[`Date_${i}`])) : "";
        theadHtml += `<th class="p-2 border min-w-[80px] text-center bg-red-50">
            <div class="text-[10px] text-gray-500 mb-1">วันที่ (${i})</div>
            <input type="date" name="Date_${i}" class="w-full text-[10px] border rounded p-0.5 braden-date-input text-center" value="${dateVal}">
        </th>`;
    }
    theadHtml += `</tr></thead>`;
    table.insertAdjacentHTML('beforeend', theadHtml);
    
    // --- BODY (BRADEN SCALE) ---
    let tbodyHtml = `<tbody>`;
    
    BRADEN_CRITERIA.forEach((criteria) => {
        let rowHtml = `<tr>`;
        let leftColHtml = `<div class="font-bold text-sm text-gray-800 pb-2 pt-2 border-b border-gray-200 bg-white px-2">${criteria.name}</div>`;
        criteria.options.forEach(opt => {
            leftColHtml += `<div class="h-8 flex items-center text-xs text-gray-600 border-b border-gray-100 pl-4 hover:bg-gray-50">${opt.text}</div>`;
        });
        rowHtml += `<td class="p-0 border-r border-b bg-white align-top sticky left-0 z-10 shadow-md">${leftColHtml}</td>`;
        
        for (let i = 1; i <= 10; i++) {
            const savedVal = data[`${criteria.id}_${i}`];
            let cellHtml = `<div class="pb-2 pt-2 border-b border-gray-200 bg-white">&nbsp;</div>`;
            
            criteria.options.forEach(opt => {
                const isChecked = (String(savedVal) === String(opt.val)) ? "checked" : "";
                const radioId = `braden_${criteria.id}_${i}_${opt.val}`;
                
                cellHtml += `
                <div class="h-8 flex items-center justify-center border-b border-gray-100 hover:bg-red-50 transition-colors cursor-pointer"
                     onclick="document.getElementById('${radioId}').click()">
                    <input type="radio" name="${criteria.id}_${i}" value="${opt.val}" id="${radioId}" 
                           class="mt-0.5 accent-red-600 braden-radio cursor-pointer" data-day="${i}" ${isChecked}>
                </div>`;
            });
            rowHtml += `<td class="p-0 border align-top bg-white min-w-[80px]">${cellHtml}</td>`;
        }
        rowHtml += `</tr>`;
        tbodyHtml += rowHtml;
    });

    // --- SUMMARY ROWS ---
    let totalRow = `<tr class="bg-gray-100 font-bold"><td class="p-2 border text-right sticky left-0 bg-gray-100 z-10 text-sm">คะแนนรวม</td>`;
    for(let i=1; i<=10; i++) totalRow += `<td class="p-1 border text-center"><input type="text" readonly name="Total_${i}" class="w-full text-center bg-transparent font-bold text-blue-700 braden-total text-sm" data-day="${i}" value="${data[`Total_${i}`] || ''}"></td>`;
    tbodyHtml += totalRow + `</tr>`;

    let riskRow = `<tr class="bg-white"><td class="p-2 border text-right sticky left-0 bg-white z-10 text-xs">แปลผลความเสี่ยง</td>`;
    for(let i=1; i<=10; i++) riskRow += `<td class="p-1 border text-center text-[10px]"><input type="text" readonly name="Risk_${i}" class="w-full text-center bg-transparent" id="risk_text_${i}" value="${data[`Risk_${i}`] || ''}"></td>`;
    tbodyHtml += riskRow + `</tr>`;

    let assessorRow = `<tr class="bg-gray-50"><td class="p-2 border text-right sticky left-0 bg-gray-50 z-10 text-sm">พยาบาลผู้ประเมิน</td>`;
    for(let i=1; i<=10; i++) assessorRow += `<td class="p-1 border text-center"><input type="text" list="staff-list-datalist" name="Assessor_${i}" class="w-full text-[10px] p-1 border rounded text-center bg-white focus:ring-1 focus:ring-red-500" placeholder="ลงชื่อ" value="${data[`Assessor_${i}`] || ''}"></td>`;
    tbodyHtml += assessorRow + `</tr></tbody>`;
    table.insertAdjacentHTML('beforeend', tbodyHtml);

    // --- APPEND EXTRA PARTS (2, 3, 4) ---
    const existingExtra = document.getElementById("braden-extra-parts");
    if (existingExtra) existingExtra.remove();

    const extraHtml = `
    <div id="braden-extra-parts" class="mt-6 space-y-6 border-t pt-4">
        
        <div class="bg-white p-4 rounded border shadow-sm">
            <h4 class="font-bold text-red-800 mb-2 text-lg">ส่วนที่ 2 การปฏิบัติเพื่อป้องกัน / ดูแลการเกิดแผลกดทับ</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="bg-red-50 p-3 rounded">
                    <div class="font-bold mb-2 text-red-700">การป้องกัน</div>
                    <ul class="space-y-1 list-disc pl-4 text-gray-700">
                        <li>พลิกตะแคงตัวทุก 2 ชั่วโมง ตรงตามเวลาที่กำหนด</li>
                        <li>ใช้ที่นอนลม</li>
                        <li>จับคู่ช่วยกันพลิกตะแคงตัว / ไม่ดึงลากเวลาพลิก</li>
                        <li>ดึงผ้าปูที่นอนให้เรียบตึง</li>
                        <li>ประเมินผิวหนังปุ่มกระดูกบริเวณกดทับทุกเวร</li>
                    </ul>
                </div>
                <div class="bg-blue-50 p-3 rounded">
                    <div class="font-bold mb-2 text-blue-700">การดูแลแผล</div>
                    <ul class="space-y-1 list-disc pl-4 text-gray-700">
                        <li>บันทึกการเกิดแผลกดทับทุกครั้งที่พบแผลใหม่</li>
                        <li>บันทึกเมื่อมีการเปลี่ยนแปลงของแผล (รอยแดง/ใหญ่ขึ้น/หาย)</li>
                        <li>ทำความสะอาดแผลด้วย NSS ทา Zinc Paste</li>
                        <li>แผลมีเนื้อตาย รายงานแพทย์ ตัดเนื้อตาย Wet Dressing</li>
                        <li>ดูแลให้ผู้ป่วยมีภาวะโภชนาการที่เหมาะสม</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded border shadow-sm">
            <h4 class="font-bold text-red-800 mb-2 text-lg">ส่วนที่ 3 บันทึกแผลกดทับ</h4>
            <p class="text-xs text-gray-500 mb-2">(ระดับ 1 ผิวหนังแดง, ระดับ 2 มี Bleb แตก, ระดับ 3 ลึกถึง Subcutaneous, ระดับ 4 ลึกถึงกล้ามเนื้อ กระดูก)</p>
            <table class="w-full border-collapse border text-sm" id="wound-record-table">
                <thead class="bg-gray-100">
                    <tr><th class="border p-2 w-32">ว/ด/ป</th><th class="border p-2">ตำแหน่งแผล</th><th class="border p-2 w-24">ระดับ</th><th class="border p-2">ลักษณะแผล</th><th class="border p-2 w-32">ชื่อผู้บันทึก</th><th class="border p-2 w-10">ลบ</th></tr>
                </thead>
                <tbody id="wound-record-body"></tbody>
            </table>
            <button type="button" onclick="addWoundRow()" class="mt-2 text-sm text-blue-600 hover:underline">+ เพิ่มรายการบันทึกแผล</button>
        </div>

        <div class="bg-white p-4 rounded border shadow-sm">
            <div class="flex items-center gap-4 mb-2">
                <h4 class="font-bold text-red-800 text-lg">ส่วนที่ 4 สรุปการเกิดแผลกดทับ (วันที่จำหน่าย/ย้าย)</h4>
                <div class="flex items-center gap-2">
                    <label class="text-sm font-bold">ระบุวันที่:</label>
                    <input type="date" name="Discharge_Summary_Date" class="border rounded p-1 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-300">
                </div>
            </div>
            
            <div class="space-y-3 text-sm">
                <div class="flex items-center gap-2">
                    <input type="radio" name="Discharge_Status" value="ไม่เกิดแผลกดทับ">
                    <label>ไม่เกิดแผลกดทับ</label>
                </div>
                <div class="flex items-start gap-2">
                    <input type="radio" name="Discharge_Status" value="เกิดแผลกดทับ">
                    <div class="w-full">
                        <label class="font-bold">เกิดแผลกดทับ</label>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 bg-gray-50 p-3 rounded border">
                            <div class="flex items-center gap-2">
                                <label>วันที่เกิด:</label>
                                <input type="date" name="Discharge_Date" class="border rounded p-1">
                            </div>
                            <div class="flex items-center gap-2">
                                <label>ตำแหน่ง:</label>
                                <input type="text" name="Discharge_Position" class="border rounded p-1 w-full">
                            </div>
                            <div class="flex items-center gap-2">
                                <label>ระดับ:</label>
                                <input type="text" name="Discharge_Stage" class="border rounded p-1 w-20 text-center">
                            </div>
                            <div class="flex items-center gap-2">
                                <label>ขนาด:</label>
                                <input type="text" name="Discharge_Size" class="border rounded p-1 w-full">
                            </div>
                            <div class="flex items-center gap-2 col-span-2">
                                <label>ลักษณะแผล:</label>
                                <input type="text" name="Discharge_Char" class="border rounded p-1 w-full">
                            </div>
                            <div class="flex items-center gap-2">
                                <label>จำนวนแผล:</label>
                                <input type="number" name="Discharge_Count" class="border rounded p-1 w-20 text-center"> แผล
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    table.insertAdjacentHTML('afterend', extraHtml);
    table.querySelectorAll('.braden-radio').forEach(r => {
        r.addEventListener('change', () => calculateBradenDay(r.dataset.day));
    });
}

// --- Helper Functions สำหรับ Part 3 (Wound Record) ---
function addWoundRow(data = {}) {
    const tbody = document.getElementById("wound-record-body");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="border p-1"><input type="date" class="w-full border rounded p-1 text-xs wound-date" value="${data.date || ''}"></td>
        <td class="border p-1"><input type="text" class="w-full border rounded p-1 text-xs wound-pos" value="${data.pos || ''}"></td>
        <td class="border p-1"><input type="text" class="w-full border rounded p-1 text-xs text-center wound-stage" value="${data.stage || ''}"></td>
        <td class="border p-1"><input type="text" class="w-full border rounded p-1 text-xs wound-char" value="${data.char || ''}"></td>
        <td class="border p-1"><input type="text" list="staff-list-datalist" class="w-full border rounded p-1 text-xs text-center wound-user" value="${data.user || ''}"></td>
        <td class="border p-1 text-center"><button type="button" onclick="this.closest('tr').remove()" class="text-red-500 hover:text-red-700">x</button></td>
    `;
    tbody.appendChild(row);
}

function renderWoundRows(records) {
    const tbody = document.getElementById("wound-record-body");
    if(tbody) {
        tbody.innerHTML = "";
        if (records.length > 0) {
            records.forEach(rec => addWoundRow(rec));
        } else {
            addWoundRow(); // Default 1 row
        }
    }
}

function calculateBradenDay(day) {
    let total = 0;
    const criteriaIds = ["Sensory", "Moisture", "Activity", "Mobility", "Nutrition", "Friction"];
    
    criteriaIds.forEach(id => {
        const checked = document.querySelector(`input[name="${id}_${day}"]:checked`);
        if (checked) total += parseInt(checked.value);
    });

    // Update Total
    const totalInput = document.querySelector(`input[name="Total_${day}"]`);
    if (totalInput && total > 0) totalInput.value = total;

    // Update Risk
    const riskInput = document.getElementById(`risk_text_${day}`);
    if (riskInput && total > 0) {
        if (total <= 16) {
            riskInput.value = "เสี่ยงสูง";
            riskInput.classList.add("text-red-600", "font-bold");
            riskInput.classList.remove("text-green-600");
        } else {
            riskInput.value = "เสี่ยงต่ำ";
            riskInput.classList.add("text-green-600", "font-bold");
            riskInput.classList.remove("text-red-600");
        }
    }
}
// ----------------------------------------------------------------
// (Updated) Classify Print Preview Logic (A4 Portrait & Print All)
// ----------------------------------------------------------------
let currentClassifyPrintPage = 1;
let allClassifyDataCache = [];

// --- Render Classify ---
async function renderClassifyPrintMode(an) {
    chartPreviewContent.innerHTML = "";
    const controlDiv = document.createElement('div');
    controlDiv.className = "flex justify-between items-center mb-4 bg-gray-100 p-2 rounded shadow print:hidden";
    controlDiv.innerHTML = `
        <div class="font-bold text-gray-700">แบบบันทึกประเภทผู้ป่วย - หน้า <span id="print-classify-page-num">1</span></div>
        <div class="flex gap-2">
            <button id="btn-prev-classify-sheet" class="bg-gray-300 py-1 px-3 rounded text-sm">&lt;</button>
            <button id="btn-next-classify-sheet" class="bg-gray-300 py-1 px-3 rounded text-sm">&gt;</button>
        </div>`;
    chartPreviewContent.appendChild(controlDiv);

    // ผูกปุ่มทันทีที่สร้างเสร็จ (Fix!)
    // document.getElementById("btn-print-classify-action").onclick = handleClassifyPrint;

    const sheetDiv = document.createElement('div');
    sheetDiv.id = "classify-sheet-content";
    sheetDiv.className = "bg-white shadow-lg mx-auto print:hidden";
    sheetDiv.style.cssText = "width: 210mm; min-height: 297mm; padding: 10mm 15mm;";
    chartPreviewContent.appendChild(sheetDiv);

    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getAllClassificationData&an=${an}`);
        const result = await response.json();
        allClassifyDataCache = result.success ? result.data : [];
        renderClassifySheetA4(1);
        
        document.getElementById("btn-prev-classify-sheet").onclick = () => { if(currentClassifyPrintPage > 1) renderClassifySheetA4(--currentClassifyPrintPage); };
        document.getElementById("btn-next-classify-sheet").onclick = () => { renderClassifySheetA4(++currentClassifyPrintPage); };
        Swal.close();
    } catch (e) { Swal.close(); showError("โหลดไม่สำเร็จ", e.message); }
}

// ฟังก์ชัน Render หน้ากระดาษ (แก้ไข: ปี พ.ศ. เต็ม + ตัดคำนำหน้าชื่อในตาราง)
function renderClassifySheetA4(page, targetContainer = null, options = {}) {
  const container = targetContainer || document.getElementById("classify-sheet-content");
  if(!container) return;

  const getShortName = (fullName) => {
      if (!fullName) return "";
      let cleaned = fullName.replace(/^(นาย|นางสาว|นาง|น\.ส\.|ว่าที่ร\.ต\.|ดร\.|พญ\.|นพ\.|Mr\.|Mrs\.|Miss\.|Ms\.)\s*/g, '');
      return cleaned.split(/\s+/)[0]; 
  };

  const admitDate = new Date(currentPatientData.AdmitDate); 
  const startDayOffset = (page - 1) * 5;
  const admitDateStr = admitDate.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
  
  let dischargeDateStr = "........................";
  if (options.customDischargeDate) {
      const d = new Date(options.customDischargeDate);
      dischargeDateStr = d.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
  } else if (currentPatientData.DischargeDate) {
      dischargeDateStr = new Date(currentPatientData.DischargeDate).toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
  }

  const assessorNameVal = options.customAssessor || "";
  const assessorPosVal = options.customAssessorPosition || "";
  const assessorDisplay = assessorNameVal 
      ? `(${assessorNameVal}${assessorPosVal ? ', ' + assessorPosVal : ''})` 
      : "(..................................................)";

  const wardName = currentPatientData.Ward || "........................"; 
  
  let html = `
    <div class="mb-4 text-black font-sarabun">
        <div class="text-center flex flex-col gap-1">
            <h2 class="font-bold text-xl">แบบบันทึกการจำแนกผู้ป่วย ${wardName}</h2>
            <h3 class="font-bold text-lg">กลุ่มการพยาบาล โรงพยาบาลสมเด็จพระยุพราชสว่างแดนดิน</h3>
            <div class="flex justify-center items-center gap-16 mt-1 text-sm font-bold">
                <div>รับใหม่  ${admitDateStr}</div>
                <div>จำหน่าย  ${dischargeDateStr}</div>
            </div>
        </div>
        <div class="flex justify-between items-end mt-4 px-1 text-[12px] font-bold border-b border-transparent">
           <div>ชื่อ-สกุล: <span class="text-sm ml-1">${currentPatientData.Name}</span></div>
           <div>AN: <span class="text-sm ml-1">${currentPatientData.AN}</span></div>
           <div>HN: <span class="text-sm ml-1">${currentPatientData.HN}</span></div>
        </div>
    </div>
  `;

  html += `
    <table class="w-full border-collapse border border-black text-center text-[9px] leading-tight">
      <thead>
        <tr class="bg-gray-100">
          <th rowspan="2" class="border border-black p-1 w-[160px] text-left align-middle font-bold">รายการประเมิน</th>
  `;

  for (let i = 0; i < 5; i++) {
     const currDate = new Date(admitDate);
     currDate.setDate(admitDate.getDate() + startDayOffset + i);
     const dateStr = currDate.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
     html += `<th colspan="3" class="border border-black p-1 font-bold">${dateStr}</th>`;
  }
  html += `</tr><tr class="bg-gray-50">`;
  
  for (let i = 0; i < 5; i++) {
     html += `
       <th class="border border-black p-0.5 w-[20px]">ด</th>
       <th class="border border-black p-0.5 w-[20px]">ช</th>
       <th class="border border-black p-0.5 w-[20px]">บ</th>
     `;
  }
  html += `</tr></thead><tbody>`;

  const tableStructure = [
    { type: 'header', text: 'I. สภาวะสุขภาพ' },
    { type: 'row', label: '1. สัญญาณชีพ', key: 'Score_1' },
    { type: 'row', label: '2. อาการแสดงทางระบบประสาท', key: 'Score_2' },
    { type: 'row', label: '3. การตรวจรักษา/ผ่าตัดหรือหัตถการ', key: 'Score_3' },
    { type: 'row', label: '4. พฤติกรรมที่ผิดปกติ/อารมณ์/จิตสังคม', key: 'Score_4' },
    { type: 'header', text: 'II. ความต้องการการดูแลขั้นต่ำ' },
    { type: 'row', label: '5. ความสามารถในการปฏิบัติกิจวัตรประจำวัน', key: 'Score_5' },
    { type: 'row', label: '6. ความต้องการด้านอารมณ์และจิตใจ', key: 'Score_6' },
    { type: 'row', label: '7. ความต้องการยา/หัตถการ/ฟื้นฟู', key: 'Score_7' },
    { type: 'row', label: '8. ความต้องการบรรเทาอาการรบกวน', key: 'Score_8' },
    { type: 'summary', label: 'รวมคะแนน', key: 'Total_Score' },
    { type: 'summary', label: 'ประเภทผู้ป่วย', key: 'Category' },
    { type: 'text', label: 'ผู้ประเมิน', key: 'Assessor_Name' }
  ];

  tableStructure.forEach(item => {
     if (item.type === 'header') {
         html += `
            <tr class="bg-indigo-50/50">
                <td class="border border-black p-1 text-left font-bold" colspan="16">${item.text}</td>
            </tr>
         `;
     } else {
         let labelClass = "text-left pl-1";
         let rowBg = "";
         if (item.type === 'summary') {
             labelClass = "text-right pr-2 font-bold";
             rowBg = item.key === 'Category' ? "bg-gray-200" : "bg-gray-100";
         }

         html += `<tr class="${rowBg}">
            <td class="border border-black p-1 ${labelClass}">${item.label}</td>`;

         for (let i = 0; i < 5; i++) {
            const currDate = new Date(admitDate);
            currDate.setDate(admitDate.getDate() + startDayOffset + i);
            const dateKey = getISODate(currDate); 
            
            ['N', 'D', 'E'].forEach(shift => {
               const entry = allClassifyDataCache.find(d => {
                  let dStr = d.Date;
                  if (d.Date instanceof Date || (typeof d.Date === 'string' && d.Date.includes('T'))) {
                      dStr = getISODate(new Date(d.Date));
                  }
                  return dStr === dateKey && d.Shift === shift;
               });

               let val = entry ? entry[item.key] : "";
               
               if (item.type === 'text' && val) {
                  const shortName = getShortName(val);
                  val = `<span class="text-[8px] block leading-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[35px]" title="${val}">${shortName}</span>`;
               } else if ((item.type === 'row' || item.type === 'summary') && val == 0) {
                  val = ""; 
               }
               html += `<td class="border border-black p-0.5 text-center align-middle h-5">${val}</td>`;
            });
         }
         html += `</tr>`;
     }
  });

  html += `</tbody></table>`;

  html += `
    <div class="mt-4 text-[10px] text-gray-700">
        <div class="mb-1 font-bold underline">เกณฑ์การแบ่งประเภท: (นับรวมตั้งแต่ข้อ 1 ถึง ข้อ 8)</div>
        <div class="grid grid-cols-2 gap-x-8">
          <div class="space-y-0.5">
            <div><b>ประเภทที่ 1:</b> ผู้ป่วยพักฟื้นดูแลตัวเองได้ (คะแนน ≤ 8)</div>
            <div><b>ประเภทที่ 2:</b> ผู้ป่วยเจ็บป่วยเล็กน้อย (คะแนน 9-14)</div>
            <div><b>ประเภทที่ 3:</b> ผู้ป่วยเจ็บป่วยปานกลาง (คะแนน 15-20)</div>
            <div><b>ประเภทที่ 4:</b> ผู้ป่วยหนัก (คะแนน 21-26)</div>
            <div><b>ประเภทที่ 5:</b> ผู้ป่วยหนักมาก/วิกฤต (คะแนน 27-32)</div>
          </div>
          <div class="space-y-0.5">
             <div class="mt-2 text-right"><b>ชื่อผู้ประเมิน</b> ${assessorDisplay}</div>
          </div>
        </div>
    </div>
  `;

  container.innerHTML = html;
  
  if(!targetContainer) {
      if(document.getElementById("print-classify-page-num")) document.getElementById("print-classify-page-num").textContent = page;
      if(document.getElementById("btn-prev-classify-sheet")) document.getElementById("btn-prev-classify-sheet").disabled = (page <= 1);
  }
}

// =================================================================
// (Updated) Morse/MAAS Print Preview Logic (Preview Only)
// =================================================================
let currentMorsePrintPage = 1;
let allMorseDataCache = [];

async function renderMorsePrintMode(an) {
    chartPreviewContent.innerHTML = "";
    const controlDiv = document.createElement('div');
    controlDiv.className = "flex justify-between items-center mb-4 bg-gray-100 p-2 rounded shadow print:hidden";
    controlDiv.innerHTML = `
        <div class="font-bold text-gray-700">ประเมิน Morse/MAAS - หน้า <span id="print-morse-page-num">1</span></div>
        <div class="flex gap-2">
            <button id="btn-prev-morse-sheet" class="bg-gray-300 py-1 px-3 rounded text-sm">&lt;</button>
            <button id="btn-next-morse-sheet" class="bg-gray-300 py-1 px-3 rounded text-sm">&gt;</button>
        </div>`;
    chartPreviewContent.appendChild(controlDiv);

    const sheetDiv = document.createElement('div');
    sheetDiv.id = "morse-sheet-content";
    sheetDiv.className = "bg-white shadow-lg mx-auto print:hidden";
    sheetDiv.style.cssText = "width: 210mm; min-height: 297mm; padding: 10mm 15mm;";
    chartPreviewContent.appendChild(sheetDiv);

    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getAllMorseData&an=${an}`);
        const result = await response.json();
        allMorseDataCache = result.success ? result.data : [];
        renderMorseSheetA4(1);
        
        document.getElementById("btn-prev-morse-sheet").onclick = () => { if(currentMorsePrintPage > 1) renderMorseSheetA4(--currentMorsePrintPage); };
        document.getElementById("btn-next-morse-sheet").onclick = () => { renderMorseSheetA4(++currentMorsePrintPage); };

        Swal.close();
    } catch (e) { Swal.close(); showError("โหลดไม่สำเร็จ", e.message); }
}

function renderMorseSheetA4(page, targetContainer = null, options = {}) {
  const container = targetContainer || document.getElementById("morse-sheet-content");
  if(!container) return;

  const getShortName = (fullName) => {
      if (!fullName) return "";
      let cleaned = fullName.replace(/^(นาย|นางสาว|นาง|น\.ส\.|ว่าที่ร\.ต\.|ดร\.|พญ\.|นพ\.|Mr\.|Mrs\.|Miss\.|Ms\.)\s*/g, '');
      return cleaned.split(/\s+/)[0]; 
  };
  const getISODate = (date) => {
      const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      return offsetDate.toISOString().split('T')[0];
  };

  const admitDate = new Date(currentPatientData.AdmitDate); 
  const startDayOffset = (page - 1) * 5;
  const wardName = currentPatientData.Ward || "........................"; 

  // Header
  let html = `
    <div class="mb-2 text-black font-sarabun">
        <div class="text-center mb-2">
            <h2 class="font-bold text-lg">โรงพยาบาลสมเด็จพระยุพราชสว่างแดนดิน</h2>
            <h3 class="font-bold text-base whitespace-nowrap">แบบประเมินความเสี่ยงต่อการพลัดตกหกล้ม Morse / การดึงอุปกรณ์ที่สอดใส่ในร่างกายผู้ป่วย (MAAS)</h3>
        </div>
        <div class="flex justify-between items-end px-1 text-[11px] font-bold border-b border-transparent">
           <div>ชื่อ-สกุล: <span class="text-sm ml-1">${currentPatientData.Name}</span></div>
           <div>AN: <span class="text-sm ml-1">${currentPatientData.AN}</span></div>
           <div>HN: <span class="text-sm ml-1">${currentPatientData.HN}</span></div>
           <div>ตึก: <span class="text-sm ml-1">${wardName}</span></div>
        </div>
    </div>
  `;

  // Morse Table
  html += `
    <div class="font-bold text-[10px] mb-1 mt-2">แบบประเมินความเสี่ยงต่อการพลัดตกหกล้ม (Morse)</div>
    <table class="w-full border-collapse border border-black text-center text-[9px] leading-tight mb-2">
      <thead>
        <tr class="bg-gray-100">
          <th rowspan="2" class="border border-black p-1 w-[240px] text-left align-middle font-bold">ประเด็น / คะแนน</th>
  `;

  for (let i = 0; i < 5; i++) {
     const currDate = new Date(admitDate);
     currDate.setDate(admitDate.getDate() + startDayOffset + i);
     const dateStr = currDate.toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
     html += `<th colspan="3" class="border border-black p-1 font-bold">${dateStr}</th>`;
  }
  html += `</tr><tr class="bg-gray-50">`;
  
  for (let i = 0; i < 5; i++) {
     html += `<th class="border border-black p-0.5 w-[20px]">ด</th><th class="border border-black p-0.5 w-[20px]">ช</th><th class="border border-black p-0.5 w-[20px]">บ</th>`;
  }
  html += `</tr></thead><tbody>`;

  const morseRows = [
      { label: "1. มีการหกล้มกะทันหัน หรือหกล้มช่วง 3 เดือนก่อนมา รพ.", sub: ["ไม่ใช่ = 0", "ใช่ = 25"], key: "Morse_1" },
      { label: "2. มีการวินิจฉัยโรคมากกว่า 1 รายการ", sub: ["ไม่ใช่ = 0", "ใช่ = 15"], key: "Morse_2" },
      { label: "3. การช่วยในการเคลื่อนย้าย", sub: ["- เดินได้เองใช้/รถเข็นนั่ง/นอนพักบนเตียงหรือทำกิจกรรมบนเตียง (ใช่ = 0)", "- ไม้ค้ำยัน/ไม้เท้า (ใช่ = 15)", "เดิน- โดยการยึดเกาะไปตามเตียง / โต๊ะ / เก้าอี้ (ใช่ = 30)"], key: "Morse_3" },
      { label: "4. ให้สารละลายทางหลอดเลือด/คา Heparin lock", sub: ["ไม่ใช่ = 0", "ใช่ = 20"], key: "Morse_4" },
      { label: "5. การเดิน / การเคลื่อนย้าย", sub: ["- ปกติ / นอนพักบนเตียงโดยไม่ให้ลุกจากเตียงไม่เคลื่อนไหว (ใช่ = 0)", "อ่อนแรงเล็กน้อยหรืออ่อนเพลีย (ใช่ = 10)", "- มีความบกพร่อง เช่น ลุกจากเก้าอี้ด้วยความลำบาก / ไม่สามารถเดินได้โดยปราศจากการช่วยเหลือ (ใช่ = 20)"], key: "Morse_5" },
      { label: "6. สภาพจิตใจ", sub: ["- รับรู้บุคคล เวลา สถานที่ (ใช่ = 0)", "ตอบสนองไม่ตรงกับความเป็นจริง ไม่รับรู้ข้อจำกัดของตนเอง (ใช่ = 15)"], key: "Morse_6" }
  ];

  morseRows.forEach((row) => {
      let labelHtml = `<div class="font-bold border-b border-gray-300 pb-1 mb-1">${row.label}</div>`;
      row.sub.forEach(txt => { labelHtml += `<div class="pl-2 mb-0.5 text-[8px] leading-tight text-gray-700 font-medium">${txt}</div>`; });
      html += `<tr><td class="border border-black p-1 text-left align-top bg-white">${labelHtml}</td>`;
      for (let i = 0; i < 5; i++) {
          const currDate = new Date(admitDate);
          currDate.setDate(admitDate.getDate() + startDayOffset + i);
          const dateKey = getISODate(currDate); 
          ['N', 'D', 'E'].forEach(shift => {
              const entry = allMorseDataCache.find(d => {
                  let dStr = d.Date;
                  if (d.Date instanceof Date || (typeof d.Date === 'string' && d.Date.includes('T'))) dStr = getISODate(new Date(d.Date));
                  return dStr === dateKey && d.Shift === shift;
              });
              let val = entry ? entry[row.key] : "";
              html += `<td class="border border-black p-0.5 text-center align-middle font-medium">${val !== "" ? val : ""}</td>`;
          });
      }
      html += `</tr>`;
  });

  html += `<tr class="bg-gray-100"><td class="border border-black p-1 text-right font-bold">รวมคะแนน</td>`;
  for (let i = 0; i < 5; i++) {
      const currDate = new Date(admitDate);
      currDate.setDate(admitDate.getDate() + startDayOffset + i);
      const dateKey = getISODate(currDate); 
      ['N', 'D', 'E'].forEach(shift => {
          const entry = allMorseDataCache.find(d => {
              let dStr = d.Date;
              if (d.Date instanceof Date || (typeof d.Date === 'string' && d.Date.includes('T'))) dStr = getISODate(new Date(d.Date));
              return dStr === dateKey && d.Shift === shift;
          });
          let val = entry ? entry.Morse_Total : "";
          let color = (val >= 51) ? "text-red-600 font-bold" : ((val >= 25) ? "text-orange-600 font-bold" : "");
          html += `<td class="border border-black p-0.5 text-center ${color}">${val}</td>`;
      });
  }
  html += `</tr>`;

  html += `<tr><td class="border border-black p-1 text-right font-bold">พยาบาลผู้ประเมิน</td>`;
  for (let i = 0; i < 5; i++) {
      const currDate = new Date(admitDate);
      currDate.setDate(admitDate.getDate() + startDayOffset + i);
      const dateKey = getISODate(currDate); 
      ['N', 'D', 'E'].forEach(shift => {
          const entry = allMorseDataCache.find(d => {
              let dStr = d.Date;
              if (d.Date instanceof Date || (typeof d.Date === 'string' && d.Date.includes('T'))) dStr = getISODate(new Date(d.Date));
              return dStr === dateKey && d.Shift === shift;
          });
          let val = entry ? entry.Assessor_Name : "";
          html += `<td class="border border-black p-0.5 text-center text-[7px] whitespace-nowrap overflow-hidden">${getShortName(val)}</td>`;
      });
  }
  html += `</tr></tbody></table>`;

  // MAAS
  html += `
    <div class="font-bold text-[10px] mb-1 mt-2">แบบประเมินความเสี่ยงต่อ การดึงอุปกรณ์ที่สอดใส่ในร่างกายผู้ป่วย (MAAS)</div>
    <table class="w-full border-collapse border border-black text-center text-[8px] leading-tight mb-2">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-black p-1 text-left w-[200px]">ประเด็น</th>
          <th class="border border-black p-1 w-[30px]">คะแนน</th>
  `;
  for (let i = 0; i < 5; i++) {
     html += `<th class="border border-black p-0.5 w-[20px]">ด</th><th class="border border-black p-0.5 w-[20px]">ช</th><th class="border border-black p-0.5 w-[20px]">บ</th>`;
  }
  html += `</tr></thead><tbody>`;

  const maasItems = [
      { t: "ไม่ตอบสนอง", s: 0 }, { t: "ตอบสนองต่อการกระตุ้นแรง ๆ", s: 1 }, { t: "ตอบสนองต่อการสัมผัสและการเรียกชื่อ", s: 2 },
      { t: "สงบและให้ความร่วมมือ", s: 3 }, { t: "พักได้น้อยและไม่ให้ความร่วมมือ", s: 4 },
      { t: "ไม่ให้ความร่วมมือในการรักษา/ต่อต้านการรักษา", s: 5 }, { t: "ไม่ให้ความร่วมมือในการรักษา/ต่อต้านการรักษาซึ่งก่อให้เกิดอันตรายต่อผู้อื่น", s: 6 },
  ];

  maasItems.forEach(item => {
      html += `<tr><td class="border border-black p-0.5 text-left">${item.t}</td><td class="border border-black p-0.5 font-bold">${item.s}</td>`;
      for (let i = 0; i < 5; i++) {
          const currDate = new Date(admitDate);
          currDate.setDate(admitDate.getDate() + startDayOffset + i);
          const dateKey = getISODate(currDate); 
          ['N', 'D', 'E'].forEach(shift => {
              const entry = allMorseDataCache.find(d => {
                  let dStr = d.Date;
                  if (d.Date instanceof Date || (typeof d.Date === 'string' && d.Date.includes('T'))) dStr = getISODate(new Date(d.Date));
                  return dStr === dateKey && d.Shift === shift;
              });
              let val = entry ? entry.MAAS_Score : "";
              let mark = (val !== "" && parseInt(val) === item.s) ? val : "";
              html += `<td class="border border-black p-0.5">${mark}</td>`;
          });
      }
      html += `</tr>`;
  });

  html += `<tr class="bg-gray-50"><td class="border border-black p-1 text-right font-bold" colspan="2">คะแนนที่ได้</td>`;
  for (let i = 0; i < 5; i++) {
      const currDate = new Date(admitDate);
      currDate.setDate(admitDate.getDate() + startDayOffset + i);
      const dateKey = getISODate(currDate); 
      ['N', 'D', 'E'].forEach(shift => {
          const entry = allMorseDataCache.find(d => {
              let dStr = d.Date;
              if (d.Date instanceof Date || (typeof d.Date === 'string' && d.Date.includes('T'))) dStr = getISODate(new Date(d.Date));
              return dStr === dateKey && d.Shift === shift;
          });
          let val = entry ? entry.MAAS_Score : "";
          let color = (val >= 4) ? "text-red-600 font-bold" : "";
          html += `<td class="border border-black p-0.5 text-center ${color}">${val}</td>`;
      });
  }
  html += `</tr></tbody></table>`;

  // Footer (Criteria Only - No Signature/Date)
  html += `
    <div class="mt-2 border border-black p-0 text-[8px] text-black">
       <div class="grid grid-cols-3 border-b border-black font-bold text-center bg-gray-100">
           <div class="border-r border-black p-1">No Risk (0-24)</div>
           <div class="border-r border-black p-1">Low Risk (25-50)</div>
           <div class="p-1 text-red-700">High Risk (≥ 51)</div>
       </div>
       <div class="grid grid-cols-3 text-left leading-snug">
           <div class="border-r border-black p-1 space-y-1">
               <div>1. จัดเตียงให้เหมาะสมกับสภาพผู้ป่วย</div>
               <div>2. ประเมินความสามารถในการช่วยเหลือตนเอง การทรงตัว</div>
               <div>3. ให้ข้อมูลผู้ป่วย/ญาติเกี่ยวกับการป้องกันการพลัดหกล้ม</div>
               <div>4. จัดสิ่งแวดล้อมให้ปลอดภัย</div>
               <div>5. ให้ญาติเฝ้า</div>
               <div>6. ยกเหล็กกั้นเตียง</div>
               <div class="font-bold">7. ตรวจเยี่ยมผู้ป่วย (เวรละ 1 ครั้ง)</div>
           </div>
           <div class="border-r border-black p-1 space-y-1">
               <div>1. จัดเตียงให้เหมาะสมกับสภาพผู้ป่วย</div>
               <div>2. ประเมินความสามารถในการช่วยเหลือตนเอง การทรงตัว</div>
               <div>3. ให้ข้อมูลผู้ป่วย/ญาติเกี่ยวกับการป้องกันการพลัดหกล้ม</div>
               <div>4. จัดสิ่งแวดล้อมให้ปลอดภัย</div>
               <div>5. ให้ญาติเฝ้า</div>
               <div>6. ยกเหล็กกั้นเตียง</div>
               <div class="font-bold">7. ตรวจเยี่ยมผู้ป่วย (ทุก 4 ชม.)</div>
               <div>8. ติดสัญลักษณ์ความเสี่ยง (สีเหลือง)</div>
               <div>9. ผูกมัดผู้ป่วยตามสภาพ</div>
               <div>10. ส่งเวรเกี่ยวกับอาการผู้ป่วย</div>
           </div>
           <div class="p-1 space-y-1">
               <div>1. จัดเตียงให้เหมาะสมกับสภาพผู้ป่วย</div>
               <div>2. ประเมินความสามารถในการช่วยเหลือตนเอง การทรงตัว</div>
               <div>3. ให้ข้อมูลผู้ป่วย/ญาติเกี่ยวกับการป้องกันการพลัดหกล้ม</div>
               <div>4. จัดสิ่งแวดล้อมให้ปลอดภัย</div>
               <div>5. ให้ญาติเฝ้า</div>
               <div>6. ยกเหล็กกั้นเตียง</div>
               <div class="font-bold text-red-600">7. ตรวจเยี่ยมผู้ป่วย (ทุก 2 ชม.)</div>
               <div class="text-red-600">8. ติดสัญลักษณ์ความเสี่ยง (สีแดง)</div>
               <div>9. ผูกมัดผู้ป่วยตามสภาพ</div>
               <div>10. ส่งเวรเกี่ยวกับอาการผู้ป่วย</div>
               <div>11. ปรึกษาสหวิชาชีพ</div>
           </div>
       </div>
       <div class="border-t border-black p-1 bg-gray-50 flex gap-4 items-center">
          <div class="font-bold underline">เกณฑ์ MAAS:</div>
          <div>0-3: ไม่ต้องผูกยึด</div>
          <div class="text-red-600 font-bold">4-6: ต้องผูกยึดผู้ป่วยและเฝ้าระวังการดึงอย่างใกล้ชิด (ก่อนผูกยึดแจ้งญาติให้ทราบก่อนทุกครั้ง หากกรณีไม่มีญาติให้ผูกยึดได้เลย)</div>
       </div>
    </div>
  `;
  container.innerHTML = html;
  
  if(!targetContainer) {
      if(document.getElementById("print-morse-page-num")) {
          document.getElementById("print-morse-page-num").textContent = page;
      }
      if(document.getElementById("btn-prev-morse-sheet")) {
          document.getElementById("btn-prev-morse-sheet").disabled = (page <= 1);
      }
  }
}

// =================================================================
// (Updated) Braden Scale Print Preview Logic (Preview Only)
// =================================================================
let currentBradenPrintSet = 1;
let allBradenDataCache = [];

async function renderBradenPrintMode(an) {
    chartPreviewContent.innerHTML = "";
    const controlDiv = document.createElement('div');
    controlDiv.className = "flex justify-between items-center mb-4 bg-gray-100 p-2 rounded shadow print:hidden";
    controlDiv.innerHTML = `
        <div class="font-bold text-gray-700">แบบประเมินแผลกดทับ - ชุดที่ <span id="print-braden-set-num">1</span></div>
        <div class="flex gap-2">
            <button id="btn-prev-braden-set" class="bg-gray-300 py-1 px-3 rounded text-sm">&lt;</button>
            <button id="btn-next-braden-set" class="bg-gray-300 py-1 px-3 rounded text-sm">&gt;</button>
        </div>`;
    chartPreviewContent.appendChild(controlDiv);

    const previewContainer = document.createElement('div');
    previewContainer.id = "braden-preview-container";
    previewContainer.className = "overflow-y-auto bg-gray-200 p-4 print:p-0";
    chartPreviewContent.appendChild(previewContainer);

    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getBradenList&an=${an}`);
        const result = await response.json();
        allBradenDataCache = result.data || [];
        if (allBradenDataCache.length > 0) {
            await fetchAndRenderBradenSet(an, allBradenDataCache[0].page, previewContainer);
        }
        Swal.close();
    } catch (e) { Swal.close(); showError("โหลดไม่สำเร็จ", e.message); }
}

async function fetchAndRenderBradenSet(an, pageNum, container) {
    document.getElementById("print-braden-set-num").textContent = pageNum;
    container.innerHTML = `<div class="text-center py-4">กำลังโหลดเนื้อหาชุดที่ ${pageNum}...</div>`;
    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getBradenPage&an=${an}&page=${pageNum}`);
        const result = await response.json();
        const data = result.data || {};
        container.innerHTML = ""; 
        
        // Render หน้า 1
        const page1 = document.createElement('div');
        page1.className = "bg-white shadow-lg mx-auto overflow-hidden text-black font-sarabun relative mb-4 print:mb-0 print:break-after-page";
        page1.style.width = "210mm";
        page1.style.minHeight = "297mm";
        page1.style.padding = "10mm 15mm 25mm 15mm";
        renderBradenPage1(page1, data);
        container.appendChild(page1);

        // Render หน้า 2
        const page2 = document.createElement('div');
        page2.className = "bg-white shadow-lg mx-auto overflow-hidden text-black font-sarabun relative";
        page2.style.width = "210mm";
        page2.style.minHeight = "297mm";
        page2.style.padding = "10mm 15mm 25mm 15mm";
        renderBradenPage2(page2, data);
        container.appendChild(page2);
    } catch (e) {
        container.innerHTML = `<div class="text-red-500 text-center">เกิดข้อผิดพลาด: ${e.message}</div>`;
    }
}

function renderBradenPage1(container, data, options = {}) {
    const wardName = currentPatientData.Ward || "........................";
    const formatDateFull = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'numeric'});
    };
    const admitDate = formatDateFull(data.AdmitDate_Braden);
    const firstAssessDate = formatDateFull(data.FirstAssessDate);
    const transferDate = formatDateFull(data.TransferDate);
    const isNoPU = (data.PressureUlcer_Adm_Status === 'ไม่มี') ? '✓' : '&nbsp;';
    const isHasPU = (data.PressureUlcer_Adm_Status === 'มี') ? '✓' : '&nbsp;';
    const dotted = (text, minW = "50px") => `<span class="border-b border-black border-dotted px-1 inline-block text-center font-bold text-blue-900 whitespace-nowrap overflow-hidden" style="min-width:${minW}; flex-grow: 1;">${text || "&nbsp;"}</span>`;
    const getISODate = (date) => {
        const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        return offsetDate.toISOString().split('T')[0];
    };

    let html = `
    <div class="text-center mb-2">
        <h2 class="font-bold text-lg">แบบบันทึกการพยาบาลเพื่อป้องกันและการดูแลผู้ป่วยที่มีแผลกดทับ</h2>
        <h3 class="font-bold text-lg">โรงพยาบาลสมเด็จพระยุพราชสว่างแดนดิน</h3>
    </div>
    <div class="flex justify-between items-end mb-2 px-1 text-[11px] font-bold border-b border-transparent">
        <div>ชื่อ-สกุล: ${currentPatientData.Name}</div>
        <div class="flex gap-4">
             <span>HN: ${currentPatientData.HN}</span>
             <span>AN: ${currentPatientData.AN}</span>
			 <span>หอผู้ป่วย: ${p.Ward || '-'}</span>
        </div>
    </div>
    <div class="text-[11px] leading-loose mb-4 border border-black p-2 font-sarabun text-black">
        <div class="flex items-end gap-2 w-full">
            <div class="flex items-end whitespace-nowrap">วันที่ Admit: ${dotted(admitDate, "70px")}</div>
            <div class="flex items-end whitespace-nowrap">วันที่รับย้าย: ${dotted(transferDate, "70px")}</div>
            <div class="flex items-end flex-grow min-w-0 whitespace-nowrap">จาก Ward: ${dotted(data.FromWard, "50px")}</div>
            <div class="flex items-end whitespace-nowrap">วันที่ประเมินครั้งแรก: ${dotted(firstAssessDate, "70px")}</div>
        </div>
        <div class="flex mt-1 items-end w-full">
            <span class="whitespace-nowrap mr-1">Diagnosis/Operation:</span>
            <div class="border-b border-black border-dotted px-2 w-full text-blue-900 font-bold relative top-1 whitespace-nowrap overflow-hidden">${data.Dx_Op || currentPatientData.AdmittingDx || "&nbsp;"}</div>
        </div>
        <div class="flex items-center gap-2 mt-1 whitespace-nowrap w-full">
            <span class="font-bold">แผลกดทับแรกรับ:</span>
            <div class="flex items-center gap-1 border border-black px-1" style="height: 18px;">
                <div class="w-3 h-3 border border-black text-[8px] flex items-center justify-center leading-none">${isNoPU}</div> ไม่มี
            </div>
            <div class="flex items-center gap-1 border border-black px-1 ml-2" style="height: 18px;">
                <div class="w-3 h-3 border border-black text-[8px] flex items-center justify-center leading-none">${isHasPU}</div> มี
            </div>
            <div class="flex items-end flex-grow min-w-0 ml-2">
                <span class="mr-1">ตำแหน่ง/ลักษณะ/ขนาด:</span>
                ${dotted(data.PressureUlcer_Adm_Detail, "10px")}
            </div>
        </div>
        <div class="flex justify-between mt-1 items-end whitespace-nowrap gap-2">
            <div class="flex items-end">Serum Albumin ${dotted(data.Albumin, "30px")} mg/dL (3.5-5.4)</div>
            <div class="flex items-end">Hb = ${dotted(data.Hb, "30px")} mg%</div>
            <div class="flex items-end">Hct = ${dotted(data.Hct, "30px")} Vol%</div>
            <div class="flex items-end">BMI = ${dotted(data.BMI, "30px")}</div>
        </div>
    </div>
    <div class="mb-2 font-bold text-sm">ส่วนที่ 1 การประเมินความเสี่ยงต่อการเกิดแผลกดทับ</div>
    <table class="w-full border-collapse border border-black text-center text-[9px] leading-tight">
        <thead>
            <tr class="bg-gray-100">
                <th rowspan="2" class="border border-black p-1 w-[200px] text-left align-middle">ปัจจัยส่งเสริมการเกิดแผลกดทับ</th>
                <th rowspan="2" class="border border-black p-1 w-[30px] text-center align-middle">ค่า<br>คะแนน</th>
                <th colspan="10" class="border border-black p-1">วันที่ประเมิน</th>
            </tr>
            <tr>`;
            for(let i=1; i<=10; i++) {
                let d = data[`Date_${i}`] ? new Date(data[`Date_${i}`]).toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit'}) : "";
                html += `<th class="border border-black p-0.5 w-[25px] align-bottom text-[8px] font-bold">${d}</th>`;
            }
    html += `</tr></thead><tbody>`;

    const getBScore = (val) => parseInt(val, 10) || 0;
    const criteria = [
        { name: "1. การรับความรู้สึก", items: ["1.1 ไม่ตอบสนอง (1)", "1.2 มี Pain Stimuli (2)", "1.3 สับสน สื่อไม่ได้ทุกครั้ง (3)", "1.4 ไม่มีความบกพร่อง ปกติ (4)"], id: "Sensory" },
        { name: "2. การเปียกชื้นของผิวหนัง", items: ["2.1 เปียกชุ่มตลอดเวลา (1)", "2.2 ปัสสาวะ/อุจจาระราดบ่อยครั้ง (2)", "2.3 ปัสสาวะราด / อุจจาระราดบางครั้ง (3)", "2.4 ไม่เปียก/กลั้นปัสสาวะและอุจจาระได้/Retain Cath (4)"], id: "Moisture" },
        { name: "3. การทำกิจกรรม", items: ["3.1 ต้องอยู่บนเตียงตลอดเวลา (1)", "3.2 ทรงตัวไม่อยู่ / ต้องนั่งรถเข็น  (2)", "3.3 เดินได้ระยะสั้น ต้องช่วยพยุง  (3)", "3.4 เดินได้เอง / ทำกิจกรรมเองได้ (4)"], id: "Activity" },
        { name: "4. การเคลื่อนไหว", items: ["4.1 เคลื่อนไหวเองไม่ได้ (1)", "4.2 เคลื่อนไหวเองได้น้อย / มีข้อติด / ต้องมีผู้ช่วยเหลือ (2)", "4.3  เคลื่อนไหวเองได้ มีผู้ช่วยเหลือบางครั้ง (3)", "4.4 คลื่อนไหวเองได้ปกติ (4)"], id: "Mobility" },
        { name: "5. การรับอาหาร", items: ["5.1 NPO / กินได้ 1/3 ถาด (1)", "5.2 รับประทานอาหารได้บ้างเล็กน้อย / กินได้ 1/2 ถาด (2)", "5.3 รับประทานอาหารได้พอควร / กินได้>1/2 ถาด (3)", "5.4 รับประทานอาหารได้ปกติ/ Feed รับได้หมด (4)"], id: "Nutrition" },
        { name: "6. การเสียดสี", items: ["6.1 มีกล้ามเนื้อหดเกร็ง ต้องมีผู้ช่วยหลายคนในการเคลื่อนย้าย (1)", "6.2 เวลานั่งลื่นไถลได้ / ใช้ผู้ช่วยน้อยคนในการเคลื่อนย้าย (2)", "6.3 เคลื่อนย้ายบนตียงได้อย่างอิสระ ไม่มีปัญหาการเสียดสี (3)"], id: "Friction" }
    ];

    criteria.forEach(c => {
        html += `<tr><td class="border border-black p-1 text-left font-bold bg-gray-50" colspan="12">${c.name}</td></tr>`;
        c.items.forEach(item => {
            const score = item.match(/\((\d)\)$/)[1]; 
            const text = item.replace(/\(\d\)$/, "");
            html += `<tr>
                <td class="border border-black p-0.5 text-left pl-2">${text}</td>
                <td class="border border-black p-0.5 font-bold">${score}</td>`;
            for(let i=1; i<=10; i++) {
                let val = data[`${c.id}_${i}`];
                let mark = (String(val) === score) ? "/" : "";
                html += `<td class="border border-black p-0.5">${mark}</td>`;
            }
            html += `</tr>`;
        });
    });

    html += `<tr><td class="border border-black p-1 text-right font-bold" colspan="2">คะแนนรวม</td>`;
    for(let i=1; i<=10; i++) {
        let val = data[`Total_${i}`] || '';
        let color = (val && parseInt(val) <= 16) ? 'text-red-600 font-bold' : '';
        html += `<td class="border border-black p-0.5 font-bold text-xs ${color}">${val}</td>`;
    }
    html += `</tr>`;
    
    // Helper Function ตัดชื่อ
    const getShortName = (fullName) => {
      if (!fullName) return "";
      let cleaned = fullName.replace(/^(นาย|นางสาว|นาง|น\.ส\.|ว่าที่ร\.ต\.|ดร\.|พญ\.|นพ\.|Mr\.|Mrs\.|Miss\.|Ms\.)\s*/g, '');
      return cleaned.split(/\s+/)[0]; 
    };

    html += `<tr><td class="border border-black p-1 text-right font-bold" colspan="2">พยาบาลผู้ประเมิน</td>`;
    for(let i=1; i<=10; i++) {
        let name = data[`Assessor_${i}`] || "";
        html += `<td class="border border-black p-0.5 text-[6px] whitespace-nowrap overflow-hidden">${getShortName(name)}</td>`;
    }
    html += `</tr></tbody></table>`;

    // Footer Notes (Criteria Only)
    html += `
    <div class="mt-2 text-[9px] text-gray-700">
        <div class="mb-1"><b>หมายเหตุ:</b> คะแนน ≤ 16 ถือเป็นกลุ่มเสี่ยงต่อการเกิดแผลกดทับสูง , คะแนน ≥ 16 ถือเป็นกลุ่มเสี่ยงต่อการเกิดแผลกดทับต่ำ, กรณีคะแนนน้อยกว่า 16 ให้ประเมินใหม่ทุก 3-5 วัน </div>
        <div class="font-bold underline">ผู้ป่วยกลุ่มเสี่ยง:</div>
        <div class="grid grid-cols-2 gap-x-4">
            <div>1) ผู้ป่วยถูกจำกัดการเคลื่อนไหว / จำกัดกิจกรรม เช่น มีการดึงถ่วงน้ำหนัก, เข้าเฝือก, On Respirator</div>
            <div>2) ไม่รู้สึกตัว / อัมพาต</div>
            <div>3) ผู้ป่วยที่มีปัญหาการบาดเจ็บของระบบประสาทและไขสันหลัง </div>
            <div>4) ผู้ป่วยที่มีภาวะทุพโภชนาการ / มีระดับอัลบูมินในเลือดต่ำกว่า 3.4 mg/Dl </div>
            <div>5) ผู้สูงอายุ > 60 ปี</div>
            <div>6) ผู้ป่วยที่ถ่ายอุจจาระ ปัสสาวะราดบ่อยครั้ง/กลั้นปัสสาวะ อุจจาระไม่ได้ </div>
            <div>7) ผู้ป่วยที่มีภาวะซีด </div>
            <div>8) ผู้ป่วยที่อ้วน/ผอมมาก </div>
            <div>9) ผู้ป่วยที่ได้รับยาระงับความนรู้สึกหลังการผ่าตัดภายใน 72 ชั่วโมง 1</div>
            <div>10)ผู้ป่วยเรื้อรังที่ต้องนอนพักบนเตียงตลอด </div>
        </div>
    </div>
    <div class="text-right text-[10px] mt-2 font-bold">Braden Scale Form Page 1/2</div>
    `;

    container.innerHTML = html;
}

function renderBradenPage2(container, data, options = {}) {
    let dDate = data.Discharge_Date ? new Date(data.Discharge_Date).toLocaleDateString('th-TH') : ".....................";
    let summaryDate = data.Discharge_Summary_Date ? new Date(data.Discharge_Summary_Date).toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit'}) : "........................";
    let isNoPU = (data.Discharge_Status === 'ไม่เกิดแผลกดทับ') ? '✓' : '&nbsp;';
    let isHasPU = (data.Discharge_Status === 'เกิดแผลกดทับ') ? '✓' : '&nbsp;';

    let html = `
    <div class="mb-2 font-bold text-sm">ส่วนที่ 2 การปฏิบัติเพื่อป้องกัน / ดูแลการเกิดแผลกดทับ</div>
    <div class="text-[9px] mb-1">(โดยเฉพาะผู้ป่วยที่มีความเสี่ยงสูง Braden Score ≤ 16)</div>
    <div class="grid grid-cols-2 gap-4 text-[10px] border border-black p-2 mb-4">
        <div class="border-r border-black pr-2">
            <div class="font-bold underline mb-1 text-center">การป้องกัน</div>
            <ul class="list-decimal pl-4 space-y-1">
                <li>พลิกตะแคงตัวทุก 2 ชั่วโมง ตรงตามเวลาที่กำหนด</li>
                <li>ใช้ที่นอนลม</li>
                <li>จับคู่ช่วยกันพลิกตะแคงตัว / ไม่ดึงลากเวลาพลิกตะแคงตัว / ดึงผ้าปูที่นอนให้เรียบตึง</li>
                <li>ประเมินผิวหนังปุ่มกระดูกบริเวณกดทับทุกเวร</li>
                <li>บันทึกการเกิดแผลกดทับทุกครั้งที่พบแผลใหม่</li>
                <li>บันทึกเมื่อมีการเปลี่ยนแปลงของแผล (ตั้งแต่รอยแดง / ใหญ่ขึ้น / ลึกลง / แผลหาย)</li>
                <li>ส่งต่อข้อมูลการเกิดแผลกดทับในการส่งเวรแต่ละครั้ง</li>
            </ul>
        </div>
        <div class="pl-2">
            <div class="font-bold underline mb-1 text-center">การดูแลแผล</div>
            <ul class="list-decimal pl-4 space-y-1">
                <li>ทำความสะอาดแผลด้วย NSS หลังจากนั้นทาด้วย Zinc Paste</li>
                <li>แผลที่มีเนื้อตาย รายงานแพทย์ทราบตัดเนื้อตายออก และ Wet Dressing ด้วย NSS</li>
                <li>ดูแลให้ผู้ป่วยมีภาวะโภชนาการที่เหมาะสม</li>
            </ul>
        </div>
    </div>
    <div class="mb-2 font-bold text-sm">ส่วนที่ 3 บันทึกแผลกดทับ</div>
    <div class="text-[9px] mb-1">(ระดับ 1 ผิวหนังแดง, ระดับ 2 มี Bleb แตก, ระดับ 3 ลึกถึง Subcutaneous, ระดับ 4 ลึกถึงกล้ามเนื้อ กระดูก)</div>
    <table class="w-full border-collapse border border-black text-center text-[10px] mb-4">
        <thead class="bg-gray-100">
            <tr><th class="border border-black p-1 w-[15%]">ว/ด/ป</th><th class="border border-black p-1 w-[30%]">ตำแหน่งแผล</th><th class="border border-black p-1 w-[10%]">ระดับ</th><th class="border border-black p-1 w-[30%]">ลักษณะแผล</th><th class="border border-black p-1 w-[15%]">ชื่อผู้บันทึก</th></tr>
        </thead>
        <tbody>`;
        
        let woundRecords = [];
        if (data.Wound_Record_JSON) {
            try { woundRecords = JSON.parse(data.Wound_Record_JSON); } catch(e){}
        }
        for(let i=0; i<15; i++) {
            let rec = woundRecords[i] || {};
            let dateStr = rec.date ? new Date(rec.date).toLocaleDateString('th-TH', {day:'2-digit', month:'2-digit', year:'2-digit'}) : "";
            html += `<tr class="h-6">
                <td class="border border-black p-1">${dateStr}</td>
                <td class="border border-black p-1 text-left">${rec.pos || ""}</td>
                <td class="border border-black p-1">${rec.stage || ""}</td>
                <td class="border border-black p-1 text-left">${rec.char || ""}</td>
                <td class="border border-black p-1">${rec.user || ""}</td>
            </tr>`;
        }
    html += `</tbody></table>`;
    
    html += `
    <div class="border border-black p-3 text-[11px]">
        <div class="font-bold text-sm mb-2 border-b border-gray-300 pb-1 flex justify-between">
            <span>ส่วนที่ 4 สรุปการเกิดแผลกดทับ (วันที่จำหน่าย / ย้าย)</span>
            <span>วันที่: ${summaryDate}</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
            <div class="border border-black w-4 h-4 text-center leading-none font-bold">${isNoPU}</div> 
            <div>ไม่เกิดแผลกดทับ</div>
        </div>
        <div class="flex items-start gap-2">
            <div class="border border-black w-4 h-4 text-center leading-none font-bold mt-1">${isHasPU}</div> 
            <div class="w-full">
                <div class="font-bold mb-1">เกิดแผลกดทับ</div>
                <div class="grid grid-cols-2 gap-y-2 gap-x-8 pl-2">
                    <div>วันที่เกิด: <span class="border-b border-black border-dotted px-2 inline-block min-w-[100px]">${dDate}</span></div>
                    <div>ตำแหน่งที่เป็น: <span class="border-b border-black border-dotted px-2 inline-block min-w-[100px]">${data.Discharge_Position || ''}</span></div>
                    <div>ระดับของแผล: <span class="border-b border-black border-dotted px-2 inline-block min-w-[50px]">${data.Discharge_Stage || ''}</span></div>
                    <div>ขนาด: <span class="border-b border-black border-dotted px-2 inline-block min-w-[100px]">${data.Discharge_Size || ''}</span></div>
                    <div class="col-span-2">ลักษณะแผล: <span class="border-b border-black border-dotted px-2 inline-block min-w-[200px]">${data.Discharge_Char || ''}</span></div>
                    <div>จำนวนแผล: <span class="border-b border-black border-dotted px-2 inline-block min-w-[50px] text-center">${data.Discharge_Count || ''}</span> แผล</div>
                </div>
            </div>
        </div>
    </div>
    <div class="text-right text-[10px] mt-4 font-bold">Braden Scale Form Page 2/2</div>
    `;

    container.innerHTML = html;
}

// ----------------------------------------------------------------
// FR-IPD-004 PRINT SYSTEM (Corrected & Icon Style)
// ----------------------------------------------------------------

// 1. Helper สำหรับ Normalize Data
function normalizeData004(raw) {
    if (!raw) return {};
    const d = { ...raw }; 
    
    // Helper: ตรวจสอบค่าว่าเป็น True หรือไม่ (รองรับหลายรูปแบบจากฐานข้อมูล)
    const isTrue = (val) => {
        if (val === true || val === "TRUE") return true;
        const s = String(val).toLowerCase();
        return s === 'true' || s === 'on' || s === '1' || s === 'yes';
    };

    // 1. ประวัติเจ็บป่วย (Hx_List) - แก้ไขให้ดึง Key ตรงๆ จากชีต
    d.Hx_List = [];
    if (isTrue(raw.Hx_HT)) d.Hx_List.push('ความดันโลหิตสูง');
    if (isTrue(raw.Hx_Heart)) d.Hx_List.push('โรคหัวใจ');
    if (isTrue(raw.Hx_Liver)) d.Hx_List.push('โรคตับ');
    if (isTrue(raw.Hx_Kidney)) d.Hx_List.push('โรคไต');
    if (isTrue(raw.Hx_DM)) d.Hx_List.push('เบาหวาน');
    if (isTrue(raw.Hx_Asthma)) d.Hx_List.push('หอบหืด');
    if (isTrue(raw.Hx_Epilepsy)) d.Hx_List.push('ลมชัก');
    if (isTrue(raw.Hx_TB)) d.Hx_List.push('วัณโรค');
    if (isTrue(raw.Hx_Cancer)) d.Hx_List.push('มะเร็ง');

    // 2. สาเหตุความเครียด (Stress_Causes)
    d.Stress_Causes = [];
    if (isTrue(raw.Cope_Stress_Fear)) d.Stress_Causes.push('กลัวไม่หาย');
    if (isTrue(raw.Cope_Stress_Cost)) d.Stress_Causes.push('ค่ารักษาพยาบาล');
    if (isTrue(raw.Cope_Stress_Work)) d.Stress_Causes.push('ขาดงาน/รายได้');
    if (isTrue(raw.Cope_Stress_Family)) d.Stress_Causes.push('ครอบครัว');

    // 3. บทบาท (Roles)
    d.Roles = [];
    if (isTrue(raw.Role_Effect_Family)) d.Roles.push('ครอบครัว');
    if (isTrue(raw.Role_Effect_Career)) d.Roles.push('อาชีพ');
    if (isTrue(raw.Role_Effect_Education)) d.Roles.push('การศึกษา');
    if (isTrue(raw.Role_Effect_Relationship)) d.Roles.push('สัมพันธภาพในครอบครัวและผู้อื่น');

    // 4. ผลกระทบความปวด (Pain_Effects)
    d.Pain_Effects = [];
    const painKeys = { 
        Pain_Effect_Eat: 'Eat', Pain_Effect_Sleep: 'Sleep', 
        Pain_Effect_Activity: 'Activity', Pain_Effect_Mood: 'Mood', 
        Pain_Effect_Elim: 'Elim', Pain_Effect_Sex: 'Sex' 
    };
    for (let key in painKeys) { if (isTrue(raw[key])) d.Pain_Effects.push(painKeys[key]); }

    // 5. การบรรเทาปวด (Pain_Relief)
    d.Pain_Relief = [];
    const reliefKeys = {
        Pain_Relief_Cold: 'Cold', Pain_Relief_Hot: 'Hot', 
        Pain_Relief_Massage: 'Massage', Pain_Relief_Relax: 'Relax', 
        Pain_Relief_Repo: 'Repo', Pain_Relief_Rest: 'Rest', Pain_Relief_Meds: 'Meds'
    };
    for (let key in reliefKeys) { if (isTrue(raw[key])) d.Pain_Relief.push(reliefKeys[key]); }

    // 6. การประเมินพลัดตกหกล้ม (Fall Risk) - แก้ไขให้ดึงค่า Boolean
    d.Fall_Age_Child = isTrue(raw.Fall_Age_Child) ? 'true' : 'false';
    d.Fall_Age_Elder = isTrue(raw.Fall_Age_Elder) ? 'true' : 'false';

    return d;
}

// 2. ฟังก์ชันหลักสำหรับเรียกดู Preview (Print Mode)
async function renderForm004PrintMode(an) {
    chartPreviewContent.innerHTML = "";
    
    // แสดงสถานะกำลังโหลด
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = `<div class="text-center p-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div><p>กำลังโหลดแบบประเมิน...</p></div>`;
    chartPreviewContent.appendChild(loadingDiv);

    try {
        const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${an}`);
        const result = await response.json();

        // แก้ไข: ผสานข้อมูลจาก Registry (Patient Data) และ Assessment Data เข้าด้วยกัน
        // เพื่อให้ข้อมูลแรกรับดึงมาแสดงในหน้าพรีวิวได้ครบถ้วน
        const combinedData = { ...currentPatientData, ...result.data }; 
        
        // ประกาศ freshData เพียงครั้งเดียวโดยใช้ข้อมูลที่ผสานแล้ว [cite: 29]
        const freshData = normalizeData004(combinedData); 
        
        // ล้างสถานะ Loading
        chartPreviewContent.innerHTML = "";

        // แถบควบคุม (Control Bar)
        const controlDiv = document.createElement('div');
        controlDiv.className = "flex justify-between items-center mb-4 bg-gray-100 p-2 rounded shadow print:hidden";
        controlDiv.innerHTML = `
            <div class="font-bold text-gray-700">แบบประเมินแรกรับ (FR-IPD-004)</div>
        `;
        chartPreviewContent.appendChild(controlDiv);

        const previewContainer = document.createElement('div');
        previewContainer.className = "overflow-y-auto bg-gray-300 p-4 flex flex-col items-center gap-4 print:p-0 print:bg-white";
        chartPreviewContent.appendChild(previewContainer);

        // แสดงผลหน้า 1 
        const page1 = document.createElement('div');
        page1.className = "bg-white shadow-lg print:shadow-none mx-auto overflow-hidden text-black font-sarabun relative mb-4 print:mb-0 print:break-after-page";
        page1.style.cssText = "width: 210mm; min-height: 297mm; padding: 10mm;";
        renderForm004Page1(page1, { data: freshData });
        previewContainer.appendChild(page1);

        // แสดงผลหน้า 2 
        const page2 = document.createElement('div');
        page2.className = "bg-white shadow-lg print:shadow-none mx-auto overflow-hidden text-black font-sarabun relative";
        page2.style.cssText = "width: 210mm; min-height: 297mm; padding: 10mm;";
        renderForm004Page2(page2, { data: freshData });
        previewContainer.appendChild(page2);

        Swal.close();
    } catch (e) { 
        Swal.close(); 
        showError("โหลดไม่สำเร็จ", e.message); 
    }
}

// 3. ฟังก์ชัน Render หน้า 1 (แก้ไขให้ใช้ไอคอนสี่เหลี่ยม)
function renderForm004Page1(container, options = {}) {
    const d = options.data || {};
    const p = currentPatientData || {};
    const wardName = p.Ward || "........................";

    // --- Helpers ---
    const formatDate = (date) => (typeof formatDateThai === 'function') ? formatDateThai(date) : (date || '');
    const formatT = (time) => (typeof formatTime === 'function') ? formatTime(time) : (time || '');
    const dateText = formatDate(d.AdmitDate);
    const timeText = formatT(d.AdmitTime);
    
    const dot = (val, w="auto") => `<span class="border-b border-black border-dotted px-1 inline-block text-center text-blue-900 font-bold whitespace-nowrap overflow-hidden align-bottom" style="width:${w}; min-width: 20px; height: 1.4em; line-height: 1.4;">${val || "&nbsp;"}</span>`;
    
    // *** New Checkbox Logic with Icons ***
    const chk = (val, target, label) => {
    let isChecked = false;
    
    // กรณีเป็น Boolean (เช่น Hx_HT = true)
    if (typeof val === 'boolean') {
        isChecked = val === true;
    } 
    // กรณีเป็น Array (ที่เราสร้างจาก normalizeData004)
    else if (Array.isArray(val)) {
        isChecked = val.includes(target);
    } 
    // กรณีเป็น String (เช่น 'เดินมา')
    else if (val) {
        const parts = String(val).split(',').map(s => s.trim());
        isChecked = parts.includes(target) || String(val) === target;
    }

    const icon = isChecked ? `<i class="far fa-check-square text-[14px]"></i>` : `<i class="far fa-square text-[14px]"></i>`;
    return `<span class="inline-flex items-center mr-2 select-none whitespace-nowrap gap-1">${icon} ${label}</span>`;
};

    const formatDateFull = (dateStr) => {
        if (!dateStr) return ".........................";
        const dt = new Date(dateStr);
        if (isNaN(dt.getTime())) return dateStr;
        let y = dt.getFullYear();
        if (y < 2400) y += 543;
        return dt.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' }) + "/" + y;
    };

    const checkADL = (val, target) => {
        if (!val) return '';
        const v = String(val).trim();
        // เงื่อนไขการติ๊ก ADL
        let isMatch = false;
        if (target === 'Independent' && (v === 'ทำได้เอง' || v === 'Independent' || v === '4')) isMatch = true;
        if (target === 'Partial' && (v === 'บางส่วน' || v === 'Partial' || v === 'ใช้อุปกรณ์' || v === '3' || v === '2')) isMatch = true;
        if (target === 'Dependent' && (v === 'ไม่ได้เลย' || v === 'Dependent' || v === '1')) isMatch = true;
        return isMatch ? `<i class="fas fa-check text-[12px]"></i>` : '';
    };

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
    
    <div class="flex justify-between items-end mb-2 px-1 text-[11px] font-bold border-b border-transparent">
        <div>ชื่อ-สกุล: <span class="font-normal text-sm">${currentPatientData.Name}</span></div>
        <div class="flex gap-4">
             <span>HN: <span class="font-normal text-sm">${currentPatientData.HN}</span></span>
             <span>AN: <span class="font-normal text-sm">${currentPatientData.AN}</span></span>
             <span>หอผู้ป่วย: <span class="font-normal text-sm">${wardName}</span></span>
        </div>
    </div>

    <div class="font-sarabun text-black text-[12px] leading-tight mt-2">
        
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
            <span class="mx-2">|</span>
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
                BT ${dot(d.Admit_BT, "40px")} (°C) <span class="ml-4">PR</span> ${dot(d.Admit_PR, "40px")} (/min)
                <span class="ml-4">RR</span> ${dot(d.Admit_RR, "40px")} (/min) <span class="ml-4">BP</span> ${dot(d.Admit_BP, "80px")} (mmHg)
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
                            <div class="col-span-2 flex items-center">${chk(d.Hx_List, 'มะเร็ง', 'มะเร็ง')} ${dot(d.UD_Cancer_Detail, "100px")}</div>
                            <div class="col-span-2">อื่นๆ: ${dot(d.Hx_Other, "80%")}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-1 mt-1 border-t border-black pt-1">
                <div class="flex items-end"><span class="font-bold w-32">การแพ้ยา/สารต่าง ๆ :</span> ${chk(d.Allergy_Status, 'ไม่เคย', 'ไม่เคย')} ${chk(d.Allergy_Status, 'เคย', 'เคย(ระบุ)')} ${dot(d.Allergy_Details, "70%")}</div>
                
                <div class="flex items-end"><span class="font-bold w-40">การรักษาตัวในโรงพยาบาล:</span> ${chk(d.AdmitHx_Status, 'ไม่เคย', 'ไม่เคย')} ${chk(d.AdmitHx_Status, 'เคย', 'เคย ด้วยโรค')} ${dot(d.AdmitHx_Disease, "140px")} <span class="ml-2">เมื่อ</span> ${dot(formatDateFull(d.AdmitHx_Date), "80px")}</div>
                
                <div class="flex items-end"><span class="font-bold w-32">การผ่าตัด :</span> ${chk(d.Sx_Status, 'ไม่เคย', 'ไม่เคย')} ${chk(d.Sx_Status, 'เคย', 'เคย ผ่าตัด')} ${dot(d.Sx_Details, "140px")} <span class="ml-2">เมื่อ</span> ${dot(formatDateFull(d.Sx_Date), "80px")}</div>
                
                <div class="flex items-end"><span class="font-bold w-48">ประวัติการเจ็บป่วยในครอบครัว:</span> ${chk(d.FamilyHx_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.FamilyHx_Status, 'มี', 'มี(ระบุ)')} ${dot(d.FamilyHx_Details, "50%")}</div>
            </div>

            <div class="flex items-start mt-1 border-t border-black pt-1">
                <span class="font-bold w-20">สิ่งเสพติด :</span>
                <div class="flex-grow">
                    <div class="flex flex-wrap gap-4 mb-1">
                        <span class="font-bold w-10">สุรา</span>
                        ${chk(d.Substance_Alcohol, 'ไม่ดื่ม', 'ไม่ดื่ม')}
                        ${chk(d.Substance_Alcohol, 'ดื่มนานๆครั้ง', 'ดื่มนานๆครั้ง')}
                        <div class="flex items-center">${chk(d.Substance_Alcohol, 'ดื่มเป็นประจำ', 'ดื่มเป็นประจำ ปริมาณ')} ${dot(d.Substance_Alcohol_Vol, "40px")} <span>ต่อวัน</span></div>
                    </div>
                    <div class="flex flex-wrap gap-4 mb-1">
                        <span class="font-bold w-10">บุหรี่</span>
                        ${chk(d.Substance_Smoke, 'ไม่สูบ', 'ไม่สูบ')}
                        ${chk(d.Substance_Smoke, 'สูบนานๆครั้ง', 'สูบนานๆครั้ง')}
                        <div class="flex items-center">${chk(d.Substance_Smoke, 'สูบเป็นประจำ', 'สูบเป็นประจำ ปริมาณ')} ${dot(d.Substance_Smoke_Vol, "40px")} <span>มวน/วัน</span></div>
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
                        <div class="flex flex-wrap items-end whitespace-nowrap">ก่อนการเจ็บป่วย: ${chk(d.HP_Before, 'ดี', 'ดี')} ${chk(d.HP_Before, 'ไม่ดี', 'ไม่ดี:')} ${dot(d.HP_Before_Detail, "30px")}</div>
                        <div class="flex flex-wrap items-end whitespace-nowrap">เจ็บป่วยครั้งนี้: ${chk(d.HP_Current, 'รุนแรง', 'รุนแรง')} ${chk(d.HP_Current, 'ไม่รุนแรง', 'ไม่รุนแรง')}</div>
                        <div class="flex flex-wrap whitespace-nowrap">การดูแล: ${chk(d.HP_Care, 'ไปรพ./คลินิก', 'ไปรพ./คลินิก')}</div>
                        <div class="flex flex-wrap whitespace-nowrap pl-4">${chk(d.HP_Care, 'ซื้อยารับประทาน', 'ซื้อยา')}</div>
                        <div class="whitespace-nowrap pl-4 flex items-center">${chk(d.HP_Care, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.HP_Care_Other, "60px")}</div>
                    </div>
                </div>
                <div class="flex flex-wrap items-end mt-1 whitespace-nowrap">ความคาดหวังในการรักษาครั้งนี้: ${chk(d.HP_Expect, 'หาย', 'หาย')} ${chk(d.HP_Expect, 'ไม่แน่ใจ', 'ไม่แน่ใจ')} ${chk(d.HP_Expect, 'ไม่หาย', 'ไม่หาย')}</div>
            </div>

            <div class="p-1 flex flex-col justify-between">
                <div>
                    <div class="font-bold underline mb-1">2) โภชนาการและการเผาผลาญ</div>
                    <div class="space-y-0.5">
                        <div class="flex items-end whitespace-nowrap">รับประทานอาหาร ${dot(d.Nutri_Meals, "20px")} มื้อ/วัน</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Nutri_Type, 'อาหารธรรมดา', 'อาหารธรรมดา')} ${chk(d.Nutri_Type, 'อาหารอ่อน', 'อาหารอ่อน')}</div>
                        <div class="flex flex-wrap whitespace-nowrap">${chk(d.Nutri_Type, 'อาหารทางสายยาง', 'อาหารสายยาง')}</div>
                        <div class="flex flex-wrap whitespace-nowrap items-center">${chk(d.Nutri_Type, 'อาหารเฉพาะโรค', 'อาหารเฉพาะโรค:')} ${dot(d.Nutri_Type_Detail, "30px")}</div>
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
                        <div class="flex flex-wrap whitespace-nowrap items-center">${chk(d.Elim_Urine_Status, 'ปกติ', 'ปกติ')} ${chk(d.Elim_Urine_Status, 'ไม่ปกติ', 'ไม่ปกติ:')} ${dot(d.Elim_Urine_Detail, "30px")}</div>
                        <div class="flex items-end mt-2 whitespace-nowrap">อุจจาระ ${dot(d.Elim_Bowel_Freq, "20px")} ครั้ง/วัน</div>
                        <div class="flex flex-wrap whitespace-nowrap items-center">${chk(d.Elim_Bowel_Status, 'ปกติ', 'ปกติ')} ${chk(d.Elim_Bowel_Status, 'ไม่ปกติ', 'ไม่ปกติ:')} ${dot(d.Elim_Bowel_Detail, "30px")}</div>
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
                    
                    const b = d['ADL_' + act + '_Before'];
                    const c = d['ADL_' + act + '_Current'];

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
    <div class="text-right text-[10px] mt-2 font-bold font-sarabun text-black">FR-IPD-004 Page 1/2</div>
    `;
    
    container.innerHTML = `
        <div class="flex flex-col justify-between h-full">
            <div>${contentHtml}</div>
        </div>
    `;
}

// 4. ฟังก์ชัน Render หน้า 2 (จัดระเบียบใหม่ 100% ตามต้นฉบับ)
function renderForm004Page2(container, options = {}) {
    const d = options.data || {};
    
    // *** Helper Functions ***
    const boxCheck = (val, target) => {
        let isChecked = false;
        if (val) {
            if (Array.isArray(val)) isChecked = val.includes(target);
            else {
                const parts = String(val).split(',').map(s=>s.trim());
                isChecked = parts.includes(target) || String(val) === target;
            }
        }
        return isChecked ? `<i class="far fa-check-square text-[14px]"></i>` : `<i class="far fa-square text-[14px]"></i>`;
    };
    
    const chk = (val, target, label) => `<span class="inline-flex items-center mr-2 select-none whitespace-nowrap gap-1">${boxCheck(val, target)} ${label}</span>`;
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
    const chkRisk = (condition) => `<span class="font-bold inline-block mx-1" style="font-size:14px;">${condition ? '<i class="far fa-check-square"></i>' : '<i class="far fa-square"></i>'}</span>`;

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
                <div class="font-bold underline mb-1">7) การรับรู้ตนเองและอัตมโนทัศน์: <span class="font-normal">การเจ็บป่วยมีผลกระทบต่อ</span></div>
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
                        ${chk(d.Stress_Causes, 'กลัวไม่หาย', 'กลัวไม่หาย')} ${chk(d.Stress_Causes, 'ค่ารักษาพยาบาล', 'ค่ารักษา')}
                        ${chk(d.Stress_Causes, 'ขาดงาน/รายได้', 'ขาดรายได้')} ${chk(d.Stress_Causes, 'ครอบครัว', 'ครอบครัว')}
                        ${chk(d.Stress_Causes, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Stress_Cause_Other, "50px")}
                    </div>
                    
                    <div class="flex flex-wrap items-end gap-x-1">
                        การแสดงออก: 
                        ${chk(d.Stress_Express, 'สีหน้าเรียบเฉย', 'สีหน้าเรียบเฉย')} 
                        ${chk(d.Stress_Express, 'วิตกกังวล', 'วิตกกังวล')} 
                        ${chk(d.Stress_Express, 'กลัว', 'กลัว')}
                    </div>
                    <div class="pl-4 flex flex-wrap items-end gap-x-1">
                        ${chk(d.Stress_Express, 'ซึมเศร้า', 'ซึมเศร้า')} 
                        ${chk(d.Stress_Express, 'เอะอะโวยวาย', 'เอะอะโวยวาย')}
                        ${chk(d.Stress_Express, 'หงุดหงิด', 'หงุดหงิด')} 
                        ${chk(d.Stress_Express, 'อื่นๆ', 'อื่น:')} ${dot(d.Stress_Express_Other, "50px")}
                    </div>

                    <div class="flex flex-wrap items-end gap-x-1">
                        แก้ไขความไม่สบายใจ: 
                        ${chk(d.Cope_Method, 'ปรึกษาผู้อื่น', 'ปรึกษาผู้อื่น')} 
                        ${chk(d.Cope_Method, 'แยกตัวเอง', 'แยกตัวเอง')} 
                        ${chk(d.Cope_Method, 'ใช้ยา', 'ใช้ยา')} 
                        ${chk(d.Cope_Method, 'อื่นๆ', 'อื่นๆ')} ${dot(d.Cope_Method_Other, "30px")}
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 divide-x divide-black border-b border-black">
            <div class="p-1">
                <div class="font-bold underline mb-1">9) บทบาทและสัมพันธภาพ: <span class="font-normal">การเจ็บป่วยมีผลกระทบต่อบทบาท</span></div>
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

        <div class="border-b border-black p-1">
             <div class="font-bold underline mb-1">11) คุณค่าและความเชื่อ</div>
             <div class="space-y-1">
                <div class="flex flex-wrap items-end">เจ็บป่วยครั้งนี้เชื่อว่า: ${chk(d.Belief_Cause, 'การปฏิบัติตัวไม่ถูกต้อง', 'ปฏิบัติตัวไม่ถูกต้อง')} ${chk(d.Belief_Cause, 'เคราะห์กรรม', 'เคราะห์กรรม')} ${chk(d.Belief_Cause, 'ตามวัย', 'ตามวัย')} ${chk(d.Belief_Cause, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Belief_Cause_Detail, "50px")}</div>
                <div class="flex flex-wrap items-end">ต้องการปฏิบัติศาสนกิจ: ${chk(d.Religion_Practice, 'ไม่มี', 'ไม่มี')} ${chk(d.Religion_Practice, 'ต้องการ', 'ต้องการ:')} ${dot(d.Religion_Practice_Detail, "80px")}</div>
                <div class="flex flex-wrap items-end">สิ่งยึดเหนี่ยวทางจิตใจ: ${chk(d.Belief_Anchor_Status, 'ไม่มี', 'ไม่มี')} ${chk(d.Belief_Anchor_Status, 'มี', 'มี:')} ${dot(d.Belief_Anchor_Detail, "80px")}</div>
             </div>
        </div>

        <div class="border-b border-black p-1">
             <div class="font-bold underline mb-1">12) การมีส่วนร่วมของผู้ป่วยและญาติในการรักษาพยาบาล</div>
             <div class="flex flex-wrap gap-x-4">
                 ${chk(d.Partic_Status, 'ไม่ต้องการ', 'ไม่ต้องการ')}
                 ${chk(d.Partic_Status, 'ต้องการ', 'ต้องการ:')} 
             </div>
             <div class="flex flex-wrap gap-x-4 ml-6 mt-1">
                 ${chk(d.Partic_Needs, 'Info', 'ทราบข้อมูลเรื่องโรคและแนวทางการรักษา')}
                 ${chk(d.Partic_Needs, 'Skill', 'เรียนรู้ทักษะดูแลตนเอง/ผู้ป่วย')}
                 ${chk(d.Partic_Needs, 'Team', 'ร่วมกับทีมสุขภาพในการดูแลผู้ป่วย')}
                 ${chk(d.Partic_Other, 'อื่นๆ', 'อื่นๆ:')} ${dot(d.Partic_Other, "80px")}
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
                <div class="flex items-center flex-wrap">
                    <span class="mr-2">Pain Scale:</span>
                    ${[0,1,2,3,4,5,6,7,8,9,10].map(n => chk(String(d.Pain_Scale_Score), String(n), n)).join(' ')}
                </div>
            </div>
            
            <div class="my-1 flex justify-center">
                <img src="https://www.mosio.com/wp-content/uploads/2018/10/color-pain-scale-with-faces-1030x417.png" style="height: 60px; max-width: 100%;" alt="Pain Scale">
            </div>

            <div class="flex flex-wrap mt-1 gap-2">
                <span class="font-bold">กระทบต่อ:</span>
                ${chk(d.Pain_Effects, 'Eat', 'การกิน')} 
                ${chk(d.Pain_Effects, 'Sleep', 'การนอน')}
                ${chk(d.Pain_Effects, 'Activity', 'การทำกิจกรรม')} 
                ${chk(d.Pain_Effects, 'Mood', 'อารมณ์ /สังคม')}
                ${chk(d.Pain_Effects, 'Elim', 'การขับถ่าย')} 
                ${chk(d.Pain_Effects, 'Sex', 'เพศสัมพันธุ์')}
            </div>
            <div class="flex flex-wrap mt-1 gap-2">
                <span class="font-bold">บรรเทาปวด:</span>
                ${chk(d.Pain_Relief, 'Cold', 'Cold compression')} 
                ${chk(d.Pain_Relief, 'Hot', 'Hot compression')}
                ${chk(d.Pain_Relief, 'Massage', 'Massage')} 
                ${chk(d.Pain_Relief, 'Relax', 'Relaxation')}
                ${chk(d.Pain_Relief, 'Repo', 'Reposition')} 
                ${chk(d.Pain_Relief, 'Rest', 'Rest/Sleep')}
                ${chk(d.Pain_Relief, 'Meds', 'Medication')}
            </div>
        </div>

        <div class="p-1 border-b border-black">
            <div class="font-bold text-[14px] mb-1">14. Braden Scale (Predicting Pressure Sore Risk)</div>
            
            <table class="w-full border-collapse border border-black text-center text-[10px]">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="border border-black p-1 text-left w-[15%]">Parameter</th>
                        <th class="border border-black p-1 w-[13%]">1</th>
                        <th class="border border-black p-1 w-[13%]">2</th>
                        <th class="border border-black p-1 w-[13%]">3</th>
                        <th class="border border-black p-1 w-[13%]">4</th>
                        <th class="border border-black p-1 w-[10%] bg-blue-50">Score</th>
                    </tr>
                </thead>
                <tbody>
                ${[
                    ['การรับรู้/ความรู้สึก', 'จำกัดทั้งหมด', 'จำกัดมาก', 'จำกัดเล็กน้อย', 'ไม่บกพร่อง', d.Braden_Sensory],
                    ['ความเปียกชื้น', 'เปียกชื้นตลอดเวลา', 'เปียกชื้นมาก', 'เปียกชื้นเป็นบางครั้ง', 'เปียกชื้นน้อยมาก', d.Braden_Moisture],
                    ['กิจกรรม', 'อยู่บนเตียงตลอด', 'เดินไม่ได้/นั่งรถเข็น', 'เดินได้บ้าง', 'เดินได้ปกติ', d.Braden_Activity],
                    ['การเคลื่อนไหว', 'เคลื่อนไหวไม่ได้เลย', 'เคลื่อนไหวได้น้อย ต้องมีผู้ช่วยเหลือ', 'เคลื่อนไหวเองได้บ้าง', 'เคลื่อนไหวได้ปกติ', d.Braden_Mobility],
                    ['โภชนาการ', 'ไม่เพียงพอ', 'อาจไม่เพียงพอ', 'เพียงพอ', 'ดีเยี่ยม', d.Braden_Nutrition],
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
                ${chk(String(d.Fall_Age_Elder).toLowerCase(), 'true', 'ผู้สูงอายุ > 65 ปี')}
            </div>
            <div class="grid grid-cols-2 gap-x-4 mt-1">
                <div class="flex justify-between"><span>สภาวะทางสมอง/จิตผิดปกติ</span> <div>${chk(d.Fall_Mental, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Mental, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>มีปัญหาการมองเห็น</span> <div>${chk(d.Fall_Vision, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Vision, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>มีประวัติพลัดตกหกล้ม/ชัก</span> <div>${chk(d.Fall_History, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_History, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>มีปัญหาในการเดิน/ทรงตัว</span> <div>${chk(d.Fall_Gait, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Gait, 'มี', 'มี')}</div></div>
                <div class="flex justify-between"><span>ใช้ยานอนหลับ/Psychotropics/Sedative</span> <div>${chk(d.Fall_Meds, 'ไม่มี', 'ไม่มี')} ${chk(d.Fall_Meds, 'มี', 'มี')}</div></div>
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
    
    <div class="text-right text-[10px] mt-2 font-bold font-sarabun text-black">FR-IPD-004 Page 2/2</div>
    `;

    container.innerHTML = `
        <div class="flex flex-col justify-between h-full">
            <div>${contentHtml}</div>
        </div>
    `;
}
// ฟังก์ชันดึงตำแหน่งอัตโนมัติ (วางไว้นอก DOMContentLoaded)
function updateAssessorPosition(inputElement) {
    const selectedName = inputElement.value.trim();
    // ตรวจสอบว่ามีข้อมูลใน globalStaffList หรือไม่
    if (!selectedName || typeof globalStaffList === 'undefined' || globalStaffList.length === 0) return;

    const staff = globalStaffList.find(s => s.fullName.trim() === selectedName);
    if (staff) {
        const parentForm = inputElement.closest('form') || document;
        // ค้นหาช่องตำแหน่งที่อาจใช้ชื่อต่างกันในแต่ละฟอร์ม
        const posInput = parentForm.querySelector('[name="Assessor_Position"]') || 
                         parentForm.querySelector('[name="Nurse_Pos"]') ||
                         parentForm.querySelector('#assessor-position-display') ||
                         parentForm.querySelector('.morse-position-input'); // สำหรับฟอร์ม Morse
        
        if (posInput) {
            posInput.value = staff.position || "พยาบาลวิชาชีพ";
        }
    }
}
// ----------------------------------------------------------------
// (10) MAIN EVENT LISTENERS (Updated - รวมฟังก์ชันดึงตำแหน่งข้อ 15)
// ----------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
	refreshWardDatalist();
	refreshDeptDropdowns();
    updateClock(); 
    setInterval(updateClock, 1000);
    loadWards();

    // 1. Close Buttons for Modals
    const closeButtons = [
        { btn: "close-admit-modal-btn", modal: "admit-modal" },
        { btn: "cancel-admit-btn", modal: "admit-modal" },
        { btn: "close-details-modal-btn", modal: "details-modal" },
        { btn: "close-assessment-modal-btn", modal: "assessment-modal" },
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

    // 2. Handle Click Outside Modal to Close
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('bg-black')) {
            e.target.classList.add("hidden");
        }
    });

    // 3. Ward Selection
    if (wardSwitcher) {
        wardSwitcher.addEventListener("change", (e) => { selectWard(e.target.value); });
    }

    // 4. Patient Table Interaction (Details & Chart)
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

    // 5. Admit Form Logic
    if (openAdmitModalBtn) openAdmitModalBtn.addEventListener("click", openAdmitModal);
    if (closeAdmitModalBtn) closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
    if (admitForm) admitForm.addEventListener("submit", handleAdmitSubmit);
	if (admitDobInput) {
        admitDobInput.addEventListener("change", updateAdmitAge);
    }

    // 6. Details Form Logic
    if (closeDetailsModalBtn) closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
    if (editPatientBtn) editPatientBtn.addEventListener("click", enableEditMode);
    if (detailsForm) detailsForm.addEventListener("submit", handleUpdateSubmit);

    detailsDobInput.addEventListener("change", () => {
        const beDate = convertCEtoBE(detailsDobInput.value);
        if (detailsAgeInput) detailsAgeInput.value = calculateAge(beDate);
    });

    // 7. Chart Navigation
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

    // 8. Assessment Form Logic (004)
    if (assessmentForm) {
        assessmentForm.addEventListener("submit", handleSaveAssessment);
        assessmentForm.addEventListener('change', (e) => {
            // Auto Calculate Braden
            if (e.target.classList.contains('braden-score')) {
                let total = 0;
                assessmentForm.querySelectorAll('.braden-score:checked').forEach(r => total += parseInt(r.value));
                const totalInp = document.getElementById("braden-total-score");
                if (totalInp) {
                    totalInp.value = total;
                    updateBradenResult(total); 
                }
            }
            // Auto Toggle Fields
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

    // 9. Staff Datalist Auto-fill (Generic Listener)
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

    // 10. Braden Form
    const bForm = document.getElementById("braden-form");
    if (bForm) {
        bForm.removeEventListener("submit", handleSaveBraden); 
        bForm.addEventListener("submit", handleSaveBraden);
    }

    // 11. Morse Pagination
    const mPrev = document.getElementById("morse-prev-page-btn");
    const mNext = document.getElementById("morse-next-page-btn");
    if(mPrev) mPrev.addEventListener("click", () => {
        if(currentMorsePage > 1) { currentMorsePage--; fetchAndRenderMorsePage(currentPatientAN, currentMorsePage); }
    });
    if(mNext) mNext.addEventListener("click", () => {
        currentMorsePage++; fetchAndRenderMorsePage(currentPatientAN, currentMorsePage);
    });

    // 12. Classification Pagination
    const classifyPrevBtn = document.getElementById("classify-prev-page-btn");
    const classifyNextBtn = document.getElementById("classify-next-page-btn");
    if (classifyPrevBtn) classifyPrevBtn.addEventListener("click", () => { changeClassifyPage(-1); });
    if (classifyNextBtn) classifyNextBtn.addEventListener("click", () => { changeClassifyPage(1); });

    // 13. Advice Form
    if (adviceForm) adviceForm.addEventListener("submit", handleSaveAdvice);

	// 14. Sidebar Toggle Logic
    const sidebarBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarList = document.getElementById('chart-menu-list');
    const sidebarArrow = document.getElementById('sidebar-arrow-icon');
    if (sidebarBtn && sidebarList && sidebarArrow) {
        sidebarBtn.addEventListener('click', () => {
            if (sidebarList.classList.contains('hidden')) {
                sidebarList.classList.remove('hidden');
                sidebarArrow.innerHTML = '<i class="fas fa-chevron-up"></i>';
            } else {
                sidebarList.classList.add('hidden');
                sidebarArrow.innerHTML = '<i class="fas fa-chevron-down"></i>';
            }
        });
    }

    const assessmentForm = document.getElementById('assessment-form');
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', handleAssessmentSubmit);
    }
	
	// 15. ค้นหาตำแหน่งที่รวม Event Listeners (บรรทัดสุดท้ายภายใน DOMContentLoaded)
    const assessorNameInput = document.getElementById('assessor-name');
    const assessorPositionInput = document.getElementById('assessor-position-display');

    if (assessorNameInput) {
        // แนะนำใช้ 'input' แทน 'change' หากต้องการให้ตำแหน่งขึ้นทันทีที่เลือก
        assessorNameInput.addEventListener('input', function() {
            const selectedName = this.value.trim();
            const dataList = document.getElementById('staff-list-datalist');
            if (!dataList) return;

            const options = dataList.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === selectedName) {
                    // ตรวจสอบทั้ง getAttribute และ dataset เพื่อความแม่นยำ
                    const pos = options[i].getAttribute('data-position') || options[i].dataset.position;
                    if (assessorPositionInput) {
                        assessorPositionInput.value = pos || "พยาบาลวิชาชีพ";
                    }
                    return;
                }
            }
        });
    }
	document.body.addEventListener('input', (e) => {
        if (e.target.list && e.target.list.id === 'staff-list-datalist') {
            updateAssessorPosition(e.target);
        }
    });
});
