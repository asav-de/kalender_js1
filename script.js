const today = new Date();

console.log('Hallo!')

const year = today.getFullYear();
const curMonth = today.getMonth();
const curDay = new Date(year, curMonth, 1).getDay();
const daysMonthTotal = new Date(year, curMonth + 1, 0).getDate();
const daysPrevMonth = new Date(year, curMonth, 0).getDate();


const currentFullDate = today.toLocaleDateString("de", { day: "numeric", month: "long", year: "numeric" });
const currentMonth = today.toLocaleString("de", {month: "long" });
const currentWeekday = today.toLocaleString("de", {weekday: "long" });
const currentDay = today.toLocaleDateString("de", {day: "numeric"});
const weekdayNumberInMonth = Math.ceil(today.getDate() / 7);


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

function fillSlots(slot) {
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

const slots = {
  currentFullDate: currentFullDate,
  currentWeekday: currentWeekday,
  weekdayNumberInMonth: weekdayNumberInMonth,
  currentMonth: currentMonth,
  currentYear: year,
  pointer: pointer
}

fillSlots(slots);
let newRow;
const table = document.querySelector("table");
let prevMonthDays = daysPrevMonth;
prevMonthDays -= (curDay + 6) % 7;


let j = 1;

for (let i = prevMonthDays + 1; i <= daysPrevMonth; i++) {
  if ((j - 1) % 7 === 0) {
    newRow = document.createElement("tr");  
    table.appendChild(newRow);               
  }
  const td = document.createElement("td");
  td.textContent = i;
  newRow.appendChild(td); 
  j++;
}

for (let i = 1; i <= daysMonthTotal; i++) {
  if ((j - 1) % 7 === 0) {
    newRow = document.createElement("tr");  
    table.appendChild(newRow);               
  }
  const td = document.createElement("td");
  td.textContent = i;
  newRow.appendChild(td);
  j++;
}

for (let i = 1; ((j - 1) % 7 !== 0); i++) {             
  const td = document.createElement("td");
  td.textContent = i;
  newRow.appendChild(td);
  j++;
}


