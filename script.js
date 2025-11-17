// =================================================================
// == IPD Nurse Workbench script.js (Complete Version 2.6.2)
// =================================================================

// ----------------------------------------------------------------
// (1) URL ของ Google Apps Script
// ----------------------------------------------------------------
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbymniWtx3CC7M_Wf0QMK-I80d6A2riIDQRRMpMy3IAoGMpYw0_gFuOXMuqWjThVHFHP2g/exec";


// ----------------------------------------------------------------
// (2) Global Variables
// ----------------------------------------------------------------
let currentWard = null;
let currentPatientAN = null;
let currentPatientData = {};
let allWards = [];
let globalConfigData = {};
let globalStaffList = [];


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

// (Chart Page & Assessment Modal)
const chartPage = document.getElementById("chart-page");
const closeChartBtn = document.getElementById("close-chart-btn");
const chartAnDisplay = document.getElementById("chart-an-display");
const chartHnDisplay = document.getElementById("chart-hn-display");
const chartNameDisplay = document.getElementById("chart-name-display");

const assessmentModal = document.getElementById("assessment-modal");
const assessmentForm = document.getElementById("assessment-form");
const openAssessmentFormBtn = document.getElementById("open-assessment-form-btn");
const closeAssessmentModalBtn = document.getElementById("close-assessment-modal-btn");
const assessAnDisplay = document.getElementById("assess-an-display");
const assessNameDisplay = document.getElementById("assess-name-display");
const assessmentLastUpdated = document.getElementById("assessment-last-updated");

// (Braden Scale)
const bradenScoreInputs = document.querySelectorAll(".braden-score");
const bradenTotalScore = document.getElementById("braden-total-score");
const bradenResult = document.getElementById("braden-result");

// (Assessor)
const assessorNameSelect = document.getElementById("assessor-name");
const assessorPositionInput = document.getElementById("assessor-position");


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
    if (parseInt(year) > 2400) return ceDate; // It's already BE
    const beYear = parseInt(year) + 543;
    return `${beYear}-${month}-${day}`; // output: "2517-08-16"
  } catch (e) { return null; }
}

function convertBEtoCE(beDate) { // input: "2517-08-16"
  if (!beDate || beDate.length < 10) return null;
  try {
    const [year, month, day] = beDate.split('-');
    if (parseInt(year) < 2400) return beDate; // It's already CE
    const ceYear = parseInt(year) - 543;
    return `${ceYear}-${month}-${day}`; // output: "1974-08-16"
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

function calculateBradenScore() {
  let total = 0;
  // (แก้ไข) ต้องมั่นใจว่า bradenScoreInputs ถูกต้อง
  const inputs = assessmentForm.querySelectorAll(".braden-score");
  inputs.forEach(input => {
    total += parseInt(input.value, 10) || 0;
  });
  
  const totalEl = document.getElementById("braden-total-score");
  const resultEl = document.getElementById("braden-result");
  
  if(totalEl) totalEl.value = total;

  if(resultEl) {
    if (total <= 9) resultEl.textContent = "Very high risk (≤ 9)";
    else if (total <= 12) resultEl.textContent = "High risk (10-12)";
    else if (total <= 14) resultEl.textContent = "Moderate risk (13-14)";
    else if (total <= 18) resultEl.textContent = "Low risk (15-18)";
    else resultEl.textContent = "No risk (> 18)";
  }
}

function populateSelect(elementId, options, defaultValue = null) {
  const select = document.getElementById(elementId);
  if (!select) return; // (เพิ่ม Guard Clause)
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
  } catch (error) { showError('บันทึกข้อมูลไม่สำเร็จ', error.message); }
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

// (จัดลำดับใหม่!) ย้ายฟังก์ชันนี้มาไว้ "ก่อน" ที่จะถูกเรียกใช้
async function handleTransferWard() {
  const an = document.getElementById("details-an").value;
  const name = document.getElementById("details-name").value;

  // 1. Create ward options (excluding current)
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

  // 2. Ask for new ward
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

  if (!newWard) return; // User cancelled

  // 3. Load available beds for the new ward
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

  // 4. Ask for new bed
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
  
  if (!newBed) return; // User cancelled

  // 5. Confirm and send
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
    loadPatients(currentWard); // Refresh current ward list (patient will disappear)

  } catch (error) {
    showError('ย้ายผู้ป่วยไม่สำเร็จ', error.message);
  }
}

// ----------------------------------------------------------------
// (8) Chart Page & Assessment Functions
// ----------------------------------------------------------------

async function openChart(an, hn, name) {
  currentPatientAN = an;
  
  chartAnDisplay.textContent = an;
  chartHnDisplay.textContent = hn;
  chartNameDisplay.textContent = name;
  
  showLoading('กำลังโหลดข้อมูลเวชระเบียน...');
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getAssessmentData&an=${an}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    
    currentPatientData = result.data;
    
    if(currentPatientData.LastUpdatedTime) {
      assessmentLastUpdated.textContent = `${new Date(currentPatientData.LastUpdatedTime).toLocaleString('th-TH')} โดย ${currentPatientData.LastUpdatedBy || ''}`;
    } else {
      assessmentLastUpdated.textContent = "ยังไม่เคยบันทึก";
    }

    registryPage.classList.add("hidden");
    chartPage.classList.remove("hidden");
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

async function openAssessmentForm() {
  showLoading('กำลังเตรียมฟอร์มประเมิน...');
  
  if(globalStaffList.length === 0) {
    try {
      const response = await fetch(`${GAS_WEB_APP_URL}?action=getStaffList`);
      const result = await response.json();
      if (result.success) {
        globalStaffList = result.data;
        populateSelect(assessorNameSelect.id, globalStaffList.map(s => s.fullName));
      }
    } catch (e) { /* (Continue even if staff list fails) */ }
  }
  
  populateAssessmentForm(currentPatientData);
  assessmentModal.classList.remove("hidden");
  Swal.close();
}

function closeAssessmentModal() {
  assessmentModal.classList.add("hidden");
  assessmentForm.reset();
  calculateBradenScore();
}

// (นี่คือเวอร์ชันที่แก้ไขตามคำขอล่าสุด)
function populateAssessmentForm(data) {
  assessmentForm.reset();
  
  // (ส่วนที่ 1: ดึงจากข้อมูลรับใหม่)
  assessAnDisplay.textContent = data.AN;
  assessNameDisplay.textContent = data.Name;
  document.getElementById('assess-admit-date').value = data.AdmitDate;
  document.getElementById('assess-admit-time').value = data.AdmitTime;
  document.getElementById('assess-admit-from').value = data.AdmittedFrom;
  document.getElementById('assess-refer-from').value = data.Refer;
  document.getElementById('assess-cc').value = data.ChiefComplaint;
  document.getElementById('assess-pi').value = data.PresentIllness;

  // (ตรรกะพิเศษสำหรับ MainCaregiver_Rel ที่เป็น Radio Button)
  let rel = data.MainCaregiver_Rel || "";
  let relOtherText = "";
  
  // ตรวจสอบว่าค่าที่บันทึกไว้เป็น "อื่นๆ: ..." หรือไม่
  if (rel.startsWith("อื่นๆ:")) {
    relOtherText = rel.substring(5).trim(); // ดึงข้อความหลัง "อื่นๆ: "
    rel = "อื่นๆ"; // ตั้งค่าให้ Radio "อื่นๆ" ถูกเลือก
  }
  
  // 1. ติ๊ก Radio ที่ถูกต้อง
  const relRadio = assessmentForm.querySelector(`[name="MainCaregiver_Rel"][value="${rel}"]`);
  if (relRadio) {
    relRadio.checked = true;
  }
  // 2. เติมช่อง Text "อื่นๆ"
  const relOtherInput = assessmentForm.querySelector(`[name="MainCaregiver_Rel_Other_Text"]`);
  if (relOtherInput) {
    relOtherInput.value = relOtherText;
  }

  // (ส่วนที่ 2-15: ดึงจากข้อมูลที่เคยบันทึก)
  // นี่คือการ "วนลูป" เติมข้อมูลทุกช่องในฟอร์มที่มี name ตรงกับ key ใน object
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const field = assessmentForm.querySelector(`[name="${key}"]`);
      if (field) {
        if (field.type === 'radio') {
          // ตรวจสอบ Radio Button
          document.querySelectorAll(`[name="${key}"][value="${data[key]}"]`).forEach(el => el.checked = true);
        } else if (field.type === 'checkbox') {
          // ตรวจสอบ Checkbox (ต้องเช็คหลายค่า เพราะชีตอาจเก็บเป็น true, "true", "on")
          if (data[key] === true || data[key] === 'true' || data[key] === 'on') {
            field.checked = true;
          }
        } else {
          // เติมค่าอื่นๆ (text, select, date, time)
          field.value = data[key];
        }
      }
    }
  }
  
  // (ใหม่!) หลังจากเติมข้อมูลแล้ว ให้สั่งอัปเดต UI ของ Toggle ทั้งหมด
  // เพื่อแสดง/ซ่อนช่องที่ถูกต้องตามข้อมูลที่โหลดมา
  assessmentForm.querySelectorAll('.assessment-radio-toggle').forEach(el => {
    // สร้าง 'change' event และส่งมัน
    const event = new Event('change', { 'bubbles': true });
    el.dispatchEvent(event);
  });
  
  // คำนวณคะแนน Braden
  calculateBradenScore();
  
  // ตั้งค่าผู้ประเมิน
  const assessor = globalStaffList.find(s => s.fullName === data.Assessor_Name);
  if(assessor) {
    assessorNameSelect.value = assessor.fullName;
    assessorPositionInput.value = assessor.position;
  } else {
    // ถ้าผู้ประเมินไม่อยู่ใน List (เช่น ลาออกไปแล้ว) ให้แสดงชื่อที่เคยบันทึกไว้
    assessorNameSelect.value = data.Assessor_Name || "";
    assessorPositionInput.value = data.Assessor_Position || "";
  }
}

// (นี่คือเวอร์ชันที่แก้ไขตามคำขอล่าสุด)
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
  delete data.MainCaregiver_Rel_Other_Text; // ลบคีย์ชั่วคราว
  
  // 2. การเผชิญภาวะเครียด (ลบคีย์ "อื่นๆ" ถ้า "มี" ไม่ได้ถูกเลือก)
  if (data.Cope_Stress_Status !== 'มี') {
      delete data.Cope_Stress_Fear;
      delete data.Cope_Stress_Cost;
      delete data.Cope_Stress_Work;
      delete data.Cope_Stress_Family;
      delete data.Cope_Stress_Other_Text;
  }
  // --- (สิ้นสุดตรรกะพิเศษ) ---

  // (ดึงชื่อผู้ใช้จริง - ในอนาคต)
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
// (9) MAIN EVENT LISTENERS (The *only* DOMContentLoaded)
// ----------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  
  // (Init)
  updateClock(); setInterval(updateClock, 1000);
  loadWards();
  wardSwitcher.addEventListener("change", (e) => { selectWard(e.target.value); });
  
  // (Admit Modal)
  openAdmitModalBtn.addEventListener("click", openAdmitModal);
  closeAdmitModalBtn.addEventListener("click", closeAdmitModal);
  cancelAdmitBtn.addEventListener("click", cancelAdmitModal);
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
  transferWardBtn.addEventListener("click", handleTransferWard); // This will now be found
  detailsDobInput.addEventListener("change", () => {
    const ceDate = detailsDobInput.value;
    const beDate = convertCEtoBE(ceDate);
    detailsAgeInput.value = calculateAge(beDate);
  });
  
  // (Patient Table Clicks)
  patientTableBody.addEventListener('click', (e) => {
    const target = e.target;
    
    // 1. Click "Name" -> Open Details Modal
    if (target.tagName === 'A' && target.dataset.an) {
      e.preventDefault();
      openDetailsModal(target.dataset.an);
    }
    
    // 2. Click "Chart" -> Open Chart Page
    if (target.classList.contains('chart-btn') && target.dataset.an) {
      e.preventDefault();
      openChart(target.dataset.an, target.dataset.hn, target.dataset.name);
    }
  });

  // (Chart Page & Assessment Modal)
  closeChartBtn.addEventListener("click", closeChart);
  
  // เปิด/ปิด ฟอร์มประเมิน (ปุ่มบน)
  openAssessmentFormBtn.addEventListener("click", openAssessmentForm);
  closeAssessmentModalBtn.addEventListener("click", closeAssessmentModal);
  
  // (ใหม่) ปิดฟอร์มประเมิน (ปุ่มล่าง)
  const closeAssessmentModalBtnBottom = document.getElementById("close-assessment-modal-btn-bottom");
  if(closeAssessmentModalBtnBottom) {
    closeAssessmentModalBtnBottom.addEventListener("click", closeAssessmentModal);
  }

  // บันทึกฟอร์มประเมิน
  assessmentForm.addEventListener("submit", handleSaveAssessment);
  
  // (นี่คือเวอร์ชันที่แก้ไขตามคำขอล่าสุด)
  // Event listener "ตัวเดียว" ที่จัดการทุกการเปลี่ยนแปลงใน Assessment Form
  assessmentForm.addEventListener('change', (e) => {
    const target = e.target;
  
    // 1. จัดการ Braden Score
    if (target.classList.contains('braden-score')) {
      calculateBradenScore();
    }
    
    // 2. จัดการ Assessor Position
    if (target.id === 'assessor-name') {
      const selectedName = target.value;
      const staff = globalStaffList.find(s => s.fullName === selectedName);
      if (staff) {
        assessorPositionInput.value = staff.position;
      } else {
        assessorPositionInput.value = "";
      }
    }
  
    // 3. จัดการ Show/Hide Toggles ทั้งหมด
    if (target.classList.contains('assessment-radio-toggle')) {
      const groupName = target.name;
      const form = target.closest('form');
      
      let selectedValue = null;
      if (target.tagName === 'SELECT') {
          selectedValue = target.value;
      } else if (target.type === 'radio') {
          selectedValue = target.checked ? target.value : null;
      }

      // 3.1 ซ่อนเป้าหมายทั้งหมดที่อยู่ในกลุ่มเดียวกันก่อน
      form.querySelectorAll(`[name="${groupName}"]`).forEach(sibling => {
        let targetId = null;
        if (sibling.tagName === 'SELECT') {
          // ซ่อน <option> ทั้งหมด
          sibling.querySelectorAll('option').forEach(opt => {
            if (opt.dataset.controls) {
              const el = document.getElementById(opt.dataset.controls);
              if (el) el.classList.add('hidden');
              form.querySelectorAll(`[data-follows="${opt.dataset.controls}"]`).forEach(f => f.classList.add('hidden'));
            }
          });
        } else { // สำหรับ <radio>
          targetId = sibling.dataset.controls;
          if (targetId) {
            const el = document.getElementById(targetId);
            if (el) el.classList.add('hidden');
            form.querySelectorAll(`[data-follows="${targetId}"]`).forEach(f => f.classList.add('hidden'));
          }
        }
      });
  
      // 3.2 โชว์เฉพาะเป้าหมายที่ถูกเลือก
      let selectedTargetId = null;
      
      if (target.tagName === 'SELECT') {
        selectedTargetId = target.options[target.selectedIndex]?.dataset.controls;
      } else if (target.type === 'radio' && target.checked) {
        selectedTargetId = target.dataset.controls;
      }
      
      // (ตรรกะพิเศษสำหรับ select ที่ต้องเช็คค่า)
      if (groupName === 'Substance_Alcohol' && (selectedValue === 'ดื่มเป็นประจำ' || selectedValue === 'ดื่มนาน ๆ ครั้ง')) selectedTargetId = 'alcohol-vol';
      if (groupName === 'Substance_Smoke' && (selectedValue === 'สูบเป็นประจำ' || selectedValue === 'สูบนาน ๆ ครั้ง')) selectedTargetId = 'smoke-vol';
      if (groupName === 'Pain_Pattern' && selectedValue === 'อื่นๆ') selectedTargetId = 'pain-pattern-other';
      if (groupName === 'HP_Before' && selectedValue === 'ไม่ดี') selectedTargetId = 'hp-before-detail';
      if (groupName === 'HP_Care' && selectedValue === 'อื่นๆ') selectedTargetId = 'hp-care-other';
      if (groupName === 'Nutri_Type' && selectedValue === 'อาหารเฉพาะโรค') selectedTargetId = 'nutri-type-detail';
      if (groupName === 'Belief_Cause' && selectedValue === 'อื่นๆ') selectedTargetId = 'belief-cause-other';

      if (selectedTargetId) {
        const targetEl = document.getElementById(selectedTargetId);
        if (targetEl) targetEl.classList.remove('hidden');
        
        // โชว์ตัวที่ตามมา (data-follows) ด้วย
        form.querySelectorAll(`[data-follows="${selectedTargetId}"]`).forEach(f => f.classList.remove('hidden'));
      }
    }
  });
  
});
