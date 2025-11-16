
// ----------------------------------------------------------------
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymniWtx3CC7M_Wf0QMK-I80d6A2riIDQRRMpMy3IAoGMpYw0_gFuOXMuqWjThVHFHP2g/exec";
// ----------------------------------------------------------------


// ตัวแปรเก็บสถานะปัจจุบัน
let currentWard = null;
let allWards = [];
let globalConfigData = {}; // เก็บข้อมูล Config ไว้ใช้ซ้ำ

// --- องค์ประกอบ UI (DOM Elements) ---
const wardSelectionPage = document.getElementById("ward-selection");
const registryPage = document.getElementById("registry-page");
const wardGrid = document.getElementById("ward-grid");
const wardHeaderTitle = document.getElementById("ward-header-title");
const wardSwitcher = document.getElementById("ward-switcher");
const patientTableBody = document.getElementById("patient-table-body");
const clockElement = document.getElementById("realtime-clock");

// --- Admit Modal Elements ---
const admitModal = document.getElementById("admit-modal");
const openAdmitModalBtn = document.getElementById("open-admit-modal-btn");
const closeAdmitModalBtn = document.getElementById("close-admit-modal-btn");
const cancelAdmitBtn = document.getElementById("cancel-admit-btn");
const admitForm = document.getElementById("admit-form");
const admitDobInput = document.getElementById("admit-dob");
const admitAgeInput = document.getElementById("admit-age");

// --- (ใหม่) Details Modal Elements ---
const detailsModal = document.getElementById("details-modal");
const closeDetailsModalBtn = document.getElementById("close-details-modal-btn");
const detailsForm = document.getElementById("details-form");
const detailsFieldset = document.getElementById("details-fieldset");
const editPatientBtn = document.getElementById("edit-patient-btn");
const saveDetailsBtn = document.getElementById("save-details-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const dischargeBtn = document.getElementById("discharge-btn");
const transferBedBtn = document.getElementById("transfer-bed-btn");
const detailsBedDisplay = document.getElementById("details-bed-display");
const detailsBedSelect = document.getElementById("details-bed-select");
const detailsDobInput = document.getElementById("details-dob");
const detailsAgeInput = document.getElementById("details-age");


// --- ฟังก์ชัน Utility ---

function showLoading(title = 'กำลังประมวลผล...') {
  Swal.fire({ title: title, allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }, });
}
function showSuccess(title = 'สำเร็จ!', message = '') {
  Swal.fire(title, message, 'success');
}
function showError(title = 'เกิดข้อผิดพลาด!', message = '') {
  Swal.fire(title, message, 'error');
}
function updateClock() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Bangkok' };
  const thaiDate = now.toLocaleDateString('th-TH', options);
  const time = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Bangkok' });
  clockElement.textContent = `${thaiDate} | ${time}`;
}

// (ปรับปรุง) คำนวณอายุจาก "พ.ศ."
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
    if (parseInt(year) > 2400) return ceDate; // ถ้าเป็น พ.ศ. อยู่แล้ว
    const beYear = parseInt(year) + 543;
    return `${beYear}-${month}-${day}`; // output: "2517-08-16"
  } catch (e) {
    return null;
  }
}

function convertBEtoCE(beDate) { // input: "2517-08-16"
  if (!beDate || beDate.length < 10) return null;
  try {
    const [year, month, day] = beDate.split('-');
    if (parseInt(year) < 2400) return beDate; // ถ้าเป็น ค.ศ. อยู่แล้ว
    const ceYear = parseInt(year) - 543;
    return `${ceYear}-${month}-${day}`; // output: "1974-08-16"
  } catch (e) {
    return null;
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


// --- ฟังก์ชันหลัก (ดึงข้อมูล) ---

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

// (อัปเดต) นี่คือเวอร์ชันที่แก้บั๊ก N/A แล้ว
async function loadPatients(wardName) {
  patientTableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-gray-500">กำลังโหลดข้อมูลผู้ป่วย...</td></tr>`;
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getPatients&ward=${wardName}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    patientTableBody.innerHTML = "";
    if (result.data.length === 0) {
      patientTableBody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-gray-400">-- ไม่มีผู้ป่วยในตึกนี้ --</td></tr>`;
      return;
    }

    result.data.forEach(pt => {
      const row = document.createElement("tr");
      row.className = "hover:bg-gray-50";
      const nameCell = `<a href="#" class="text-blue-600 hover:underline font-semibold" data-an="${pt.AN}">${pt.Name}</a>`;
      
      row.innerHTML = `
        <td class="p-3">${pt.Bed}</td>
        <td class="p-3">${pt.HN}</td>
        <td class="p-3">${pt.AN}</td>
        <td class="p-3">${nameCell}</td>
        <td class="p-3">${pt.Age || 'N/A'}</td> <td class="p-3">${pt.Dept}</td>
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

// (อัปเดต) นี่คือเวอร์ชันที่บันทึก Age ลงชีต
async function handleAdmitSubmit(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกข้อมูลผู้ป่วย...');
  
  const formData = new FormData(admitForm);
  let patientData = Object.fromEntries(formData.entries());
  
  // แปลงวันเกิด ค.ศ. -> พ.ศ.
  if (patientData.DOB_BE) {
    patientData.DOB_BE = convertCEtoBE(patientData.DOB_BE);
  }
  
  // (อัปเดต) ดึงค่า Age ที่คำนวณแล้วไปบันทึก
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


// --- (ใหม่) ฟังก์ชันสำหรับ Details Modal ---

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

// (อัปเดต) เติมฟอร์มโดยใช้ Age จากชีต
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

  // (อัปเดต) แสดง DOB (แปลงเป็น ค.ศ.) และ Age (จากชีต)
  const ceDate = convertBEtoCE(data.DOB_BE);
  detailsDobInput.value = ceDate;
  detailsAgeInput.value = data.Age; // แสดง Age ที่บันทึกไว้
}

function resetDetailsModalState() {
  detailsFieldset.disabled = true;
  editPatientBtn.classList.remove("hidden");
  dischargeBtn.classList.remove("hidden");
  transferBedBtn.classList.remove("hidden");
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
  transferBedBtn.classList.add("hidden");
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

// (อัปเดต) บันทึก Age ที่คำนวณใหม่ (ถ้ามี)
async function handleUpdateSubmit(event) {
  event.preventDefault();
  showLoading('กำลังบันทึกการแก้ไข...');
  
  const formData = new FormData(detailsForm);
  let patientData = Object.fromEntries(formData.entries());
  const an = document.getElementById("details-an").value;

  // แปลงวันเกิด ค.ศ. -> พ.ศ. ก่อนบันทึก
  if (patientData.DOB_CE) {
    patientData.DOB_BE = convertCEtoBE(patientData.DOB_CE);
    delete patientData.DOB_CE;
  }
  
  // (อัปเดต) ดึงค่า Age ที่อาจจะคำนวณใหม่ไปอัปเดต
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

function populateSelect(elementId, options, defaultValue = null) {
  const select = document.getElementById(elementId);
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

// --- (ใหม่) Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  updateClock(); setInterval(updateClock, 1000);
  loadWards();
  wardSwitcher.addEventListener("change", (e) => { selectWard(e.target.value); });
  
  // 4. จัดการ Admit Modal
  openAdmitModalBtn.addEventListener("click", openAdmitModal);
  closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
  cancelAdmitBtn.addEventListener("click", closeAdmitModal);
  admitForm.addEventListener("submit", handleAdmitSubmit);
  admitDobInput.addEventListener("change", () => {
    const ceDate = admitDobInput.value;
    const beDate = convertCEtoBE(ceDate);
    admitAgeInput.value = calculateAge(beDate);
  });

  // --- (ใหม่) 5. จัดการ Details Modal ---
  
  // 5.1 (สำคัญ) ตัวดักฟังการคลิกที่ตาราง
  patientTableBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.dataset.an) {
      e.preventDefault();
      const an = e.target.dataset.an;
      openDetailsModal(an);
    }
  });

  // 5.2 ปุ่มใน Details Modal
  closeDetailsModalBtn.addEventListener("click", closeDetailsModal);
  editPatientBtn.addEventListener("click", enableEditMode);
  cancelEditBtn.addEventListener("click", resetDetailsModalState);
  detailsForm.addEventListener("submit", handleUpdateSubmit);
  dischargeBtn.addEventListener("click", handleDischarge);

  // 5.3 คำนวณอายุใน Details Modal (เมื่อแก้ไข)
  detailsDobInput.addEventListener("change", () => {
    const ceDate = detailsDobInput.value;
    const beDate = convertCEtoBE(ceDate);
    detailsAgeInput.value = calculateAge(beDate); // คำนวณใหม่ แต่ยังไม่บันทึกจนกว่าจะกด Save
  });
});
