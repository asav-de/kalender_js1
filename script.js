const today = new Date();

const year = today.getFullYear();
const numberMonth = today.getMonth();
const numberDay = new Date(year, numberMonth, 1).getDay();
const quantityDaysMonthTotal = new Date(year, numberMonth + 1, 0).getDate();
const quantityDaysPrevMonth = new Date(year, numberMonth, 0).getDate();
const nextMidnight = new Date(year, numberMonth, today.getDate() + 1);
const mSecondUntilNextDay = nextMidnight - today;

setTimeout(() => {
  location.reload();
}, mSecondUntilNextDay);

const currentFullDate = today.toLocaleDateString("de", { day: "numeric", month: "long", year: "numeric" });
const currentMonth = today.toLocaleString("de", {month: "long" });
const currentWeekday = today.toLocaleString("de", {weekday: "long" });
const currentDay = today.toLocaleDateString("de", {day: "numeric"});
const numberWeekdayOfMonth = Math.ceil(today.getDate() / 7);


const headingH1 = document.querySelector('.titel');
headingH1.innerHTML = `Kalenderblatt vom <wbr><span class="datum-nowrap">${currentFullDate}</span>`;
document.title = `Kalender vom ${currentFullDate}`; //Der Titel (angezeigt im Browser-Tab)
const headingH3 = document.querySelector('.HE');
headingH3.textContent = (`Historische Ereignisse am ${currentDay + ". " + currentMonth}`);

const feiertage = new Set([
  "1-1",    // Neujahr
  "5-1",    // Tag der Arbeit
  "10-3",   // Tag der Deutschen Einheit
  "12-25",  // 1. Weihnachtstag
  "12-26",  // 2. Weihnachtstag
]);

function isFeiertag(d) {
  const key = `${d.getMonth() + 1}-${d.getDate()}`;
  return feiertage.has(key);
}

const pointer = isFeiertag(today) ? "ein" : "kein";

function fillTextSlots(slot) {
  for (const [key, value] of Object.entries(slot)) {
    if (key === 'currentWeekday') {
      listOfEl = document.querySelectorAll(`[data-slot="${key}"]`);
      listOfEl.forEach(element => {
        element.textContent = value;
      });
      continue;
    }
    document.querySelector(`[data-slot="${key}"]`).textContent = value;
  }
}

const textSlots = {
  currentFullDate: currentFullDate,
  currentWeekday: currentWeekday,
  numberWeekdayOfMonth: numberWeekdayOfMonth,
  currentMonth: currentMonth,
  currentYear: year,
  pointer: pointer
}

fillTextSlots(textSlots);

let newRow;
const table = document.querySelector("table");
let firstVisibleDayPrevMonth = quantityDaysPrevMonth;
firstVisibleDayPrevMonth -= (numberDay + 6) % 7;

function isNewRowNeeded() {
  return (cellCounter - 1) % 7 === 0;
}

function drawRow() {
    newRow = document.createElement("tr");  
    table.appendChild(newRow);  
}

let cellCounter = 1;

function drawCell(i) {
  const day = new Date(year, numberMonth, i);
  const newCell = document.createElement("td");
  newCell.textContent = i;
  if (Number(currentDay) === i) {
  newCell.classList.add('today');
  }
  if ((cellCounter % 7 === 0) || (isFeiertag(day))) {
    newCell.classList.add('So');
  } 
  if (cellCounter % 7 === 6 ) {
    newCell.classList.add('Sa');
  }
  newRow.appendChild(newCell);
  cellCounter++;
}

function renderPrevMonthTail() {
  for (let i = firstVisibleDayPrevMonth + 1; i <= quantityDaysPrevMonth; i++) {
    if (isNewRowNeeded()) {
      drawRow();               
    }
    drawCell(i);
  }
}

function renderCurrentMonth() {
  for (let i = 1; i <= quantityDaysMonthTotal; i++) {
  if (isNewRowNeeded()) {
    drawRow();               
  }
  drawCell(i);
  }
}

function renderNextMonthLead() {
  for (let i = 1; (!isNewRowNeeded()); i++) {             
  drawCell(i);
  }
}

renderPrevMonthTail();
renderCurrentMonth();
renderNextMonthLead();