//
// นี่คือไฟล์ script.js
//

// ----------------------------------------------------------------
// !!!!!! ใส่ Web App URL ที่คุณคัดลอกมาจาก Google Apps Script ตรงนี้
// ----------------------------------------------------------------
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymniWtx3CC7M_Wf0QMK-I80d6A2riIDQRRMpMy3IAoGMpYw0_gFuOXMuqWjThVHFHP2g/exec";
// ----------------------------------------------------------------

// ตัวแปรเก็บสถานะปัจจุบัน
let currentWard = null;
let allWards = [];

// --- องค์ประกอบ UI (DOM Elements) ---
const wardSelectionPage = document.getElementById("ward-selection");
const registryPage = document.getElementById("registry-page");
const wardGrid = document.getElementById("ward-grid");
const wardHeaderTitle = document.getElementById("ward-header-title");
const wardSwitcher = document.getElementById("ward-switcher");
const patientTableBody = document.getElementById("patient-table-body");
const clockElement = document.getElementById("realtime-clock");

// --- Modal Elements ---
const admitModal = document.getElementById("admit-modal");
const openAdmitModalBtn = document.getElementById("open-admit-modal-btn");
const closeAdmitModalBtn = document.getElementById("close-admit-modal-btn");
const cancelAdmitBtn = document.getElementById("cancel-admit-btn");
const admitForm = document.getElementById("admit-form");
const admitDobInput = document.getElementById("admit-dob");
const admitAgeInput = document.getElementById("admit-age");


// --- ฟังก์ชัน Utility ---
function convertCEtoBE(ceDate) { // input: "1974-08-16"
  if (!ceDate) return null;
  try {
    const [year, month, day] = ceDate.split('-');
    const beYear = parseInt(year) + 543;
    return `${beYear}-${month}-${day}`; // output: "2517-08-16"
  } catch (e) {
    return null;
  }
}
// แสดง SweetAlert Loading
function showLoading(title = 'กำลังประมวลผล...') {
  Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

// แสดง SweetAlert Success
function showSuccess(title = 'สำเร็จ!', message = '') {
  Swal.fire(title, message, 'success');
}

// แสดง SweetAlert Error
function showError(title = 'เกิดข้อผิดพลาด!', message = '') {
  Swal.fire(title, message, 'error');
}

// อัปเดตนาฬิกา Real-time
function updateClock() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Bangkok' };
  const thaiDate = now.toLocaleDateString('th-TH', options);
  const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Bangkok' });
  clockElement.textContent = `${thaiDate} | ${time}`;
}

// คำนวณอายุ (ปี เดือน วัน) จากวันเกิด (พ.ศ.)
function calculateAge(dobString_BE) { // "2517-08-16"
  if (!dobString_BE) return "N/A";

  // แปลง พ.ศ. เป็น ค.ศ. (YYYY-MM-DD)
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
    // หาว่าเดือนที่แล้วมีกี่วัน
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return `${years} ปี ${months} ด. ${days} ว.`;
}
// คำนวณวันนอน (LOS)
function calculateLOS(admitDateStr) {
  if (!admitDateStr) return "N/A";
  const admitDate = new Date(admitDateStr);
  const today = new Date();
  const diffTime = Math.abs(today - admitDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} วัน`;
}

// ตั้งค่าวันที่และเวลาปัจจุบันในฟอร์ม
function setFormDefaults() {
  const now = new Date();
  
  // แปลงเป็น YYYY-MM-DD
  const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const dateString = localDate.toISOString().split('T')[0];
  
  // แปลงเป็น HH:MM
  const timeString = now.toTimeString().split(' ')[0].substring(0, 5);
  
  document.getElementById("admit-date").value = dateString;
  document.getElementById("admit-time").value = timeString;
}

// --- ฟังก์ชันหลัก (ดึงข้อมูล) ---

// 1. โหลดรายชื่อตึก (หน้าแรก)
async function loadWards() {
  showLoading('กำลังโหลดข้อมูลตึก...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getWards`);
    const result = await response.json();

    if (result.success) {
      allWards = result.data;
      wardGrid.innerHTML = ""; // เคลียร์ของเก่า
      wardSwitcher.innerHTML = ""; // เคลียร์ dropdown
      
      allWards.forEach(ward => {
        // สร้าง Card
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer text-center transform hover:-translate-y-1";
        card.innerHTML = `<h3 class="text-xl font-bold text-blue-600">${ward.value}</h3>`;
        card.onclick = () => selectWard(ward.value);
        wardGrid.appendChild(card);
        
        // สร้าง Option ใน Dropdown
        const option = document.createElement("option");
        option.value = ward.value;
        option.textContent = ward.value;
        wardSwitcher.appendChild(option);
      });
      Swal.close();
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    showError('โหลดข้อมูลตึกไม่สำเร็จ', error.message);
  }
}

// 2. เมื่อเลือกตึก
function selectWard(wardName) {
  currentWard = wardName;
  
  // อัปเดต UI
  wardHeaderTitle.textContent = `ทะเบียนผู้ป่วยใน (IPD Registry) - ตึก${wardName}`;
  wardSwitcher.value = wardName;
  wardSelectionPage.classList.add("hidden");
  registryPage.classList.remove("hidden");
  
  // โหลดข้อมูลผู้ป่วยของตึกนี้
  loadPatients(wardName);
}

// 3. โหลดรายชื่อผู้ป่วยในตึก
async function loadPatients(wardName) {
  patientTableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-gray-500">กำลังโหลดข้อมูลผู้ป่วย...</td></tr>`;
  
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getPatients&ward=${wardName}`);
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);

    patientTableBody.innerHTML = ""; // เคลียร์ตาราง
    if (result.data.length === 0) {
      patientTableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-gray-400">-- ไม่มีผู้ป่วยในตึกนี้ --</td></tr>`;
      return;
    }

    // สร้างแถวในตาราง
    result.data.forEach(pt => {
      const row = document.createElement("tr");
      row.className = "hover:bg-gray-50";
      
      // ทำให้ชื่อคลิกได้ (สำหรับ Step 2.5 ในอนาคต)
      const nameCell = `<a href="#" class="text-blue-600 hover:underline font-semibold" data-an="${pt.AN}">${pt.Name}</a>`;
      
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
      `;
      patientTableBody.appendChild(row);
    });

  } catch (error) {
    showError('โหลดข้อมูลผู้ป่วยไม่สำเร็จ', error.message);
    patientTableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-red-500">เกิดข้อผิดพลาด: ${error.message}</td></tr>`;
  }
}

// 4. เปิด Modal รับใหม่ และโหลดข้อมูล Dropdowns
async function openAdmitModal() {
  if (!currentWard) return;
  
  showLoading('กำลังเตรียมฟอร์ม...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getFormData&ward=${currentWard}`);
    const result = await response.json();
    
    if (!result.success) throw new Error(result.message);
    
    const { departments, doctors, admittedFrom, availableBeds } = result.data;
    
    // เติม <select> ต่างๆ
    const populateSelect = (elementId, options) => {
      const select = document.getElementById(elementId);
      select.innerHTML = `<option value="">-- กรุณาเลือก --</option>`; // Reset
      options.forEach(opt => {
        const value = typeof opt === 'object' ? opt.value : opt;
        select.innerHTML += `<option value="${value}">${value}</option>`;
      });
    };
    
    populateSelect("admit-from", admittedFrom);
    populateSelect("admit-bed", availableBeds);
    populateSelect("admit-dept", departments);
    populateSelect("admit-doctor", doctors);
    
    admitForm.reset(); // เคลียร์ฟอร์ม
    setFormDefaults(); // ตั้งวันที่/เวลาปัจจุบัน
    admitAgeInput.value = ""; // เคลียร์อายุ
    
    admitModal.classList.remove("hidden");
    Swal.close();

  } catch (error) {
    showError('เตรียมฟอร์มไม่สำเร็จ', error.message);
  }
}

// 5. ปิด Modal
function closeAdmitModal() {
  admitModal.classList.add("hidden");
  admitForm.reset();
}

// 6. จัดการการ Submit ฟอร์มรับใหม่
async function handleAdmitSubmit(event) {
  event.preventDefault(); // ป้องกันหน้าเว็บรีโหลด
  showLoading('กำลังบันทึกข้อมูลผู้ป่วย...');
  
  const formData = new FormData(admitForm);
  let patientData = Object.fromEntries(formData.entries());
  // --- ส่วนที่เพิ่มเข้ามา ---
// แปลง DOB (ที่เป็น ค.ศ.) ให้เป็น พ.ศ. ก่อนบันทึก
if (patientData.DOB_BE) {
  patientData.DOB_BE = convertCEtoBE(patientData.DOB_BE);
}
  patientData.Age = document.getElementById("admit-age").value;
  patientData.Ward = currentWard;
  
  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "admitPatient",
        patientData: patientData
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccess('บันทึกสำเร็จ!');
      closeAdmitModal();
      loadPatients(currentWard); // โหลดตารางใหม่
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    showError('บันทึกข้อมูลไม่สำเร็จ', error.message);
  }
}


// --- Event Listeners (จุดเริ่มต้นการทำงาน) ---
document.addEventListener("DOMContentLoaded", () => {
  
  // 1. เริ่มนาฬิกา
  updateClock();
  setInterval(updateClock, 1000);
  
  // 2. โหลดหน้าเลือกตึก
  loadWards();

  // 3. ปุ่มเปลี่ยนตึกใน Dropdown
  wardSwitcher.addEventListener("change", (e) => {
    selectWard(e.target.value);
  });
  
  // 4. จัดการ Modal
  openAdmitModalBtn.addEventListener("click", openAdmitModal);
  closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
  cancelAdmitBtn.addEventListener("click", closeAdmitModal);
  
  // 5. จัดการฟอร์ม
  admitForm.addEventListener("submit", handleAdmitSubmit);

  // 6. คำนวณอายุอัตโนมัติ เมื่อกรอกวันเกิด
  admitDobInput.addEventListener("change", () => {
  const ceDate = admitDobInput.value; // ได้ "1974-08-16" (ค.ศ.)
  const beDate = convertCEtoBE(ceDate); // แปลงเป็น "2517-08-16" (พ.ศ.)
  admitAgeInput.value = calculateAge(beDate); // ส่ง (พ.ศ.) ไปคำนวณ
});

});
