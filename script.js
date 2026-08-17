const today = new Date();

// Date parts used to build the calendar grid
const year = today.getFullYear();
const numberMonth = today.getMonth();
const numberDay = new Date(year, numberMonth, 1).getDay();
const quantityDaysMonthTotal = new Date(year, numberMonth + 1, 0).getDate();
const quantityDaysPrevMonth = new Date(year, numberMonth, 0).getDate();
const nextMidnight = new Date(year, numberMonth, today.getDate() + 1);
const mSecondUntilNextDay = nextMidnight - today;

// Reload the page at midnight so the calendar updates to the new day
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

// German public holidays as "month-day" keys
const feiertage = new Set([
  "1-1",    // Neujahr
  "5-1",    // Tag der Arbeit
  "10-3",   // Tag der Deutschen Einheit
  "12-25",  // 1. Weihnachtstag
  "12-26", // 2. Weihnachtstag
]);

// Checks whether a given date is in the holidays set
function isFeiertag(d) {
  const key = `${d.getMonth() + 1}-${d.getDate()}`;
  return feiertage.has(key);
}

const pointer = isFeiertag(today) ? "ein" : "kein";

// Writes each value into the element matching its data-slot attribute
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
firstVisibleDayPrevMonth -= (numberDay + 5) % 7;

// True at the start of each new week (every 7th cell)
function isNewRowNeeded() {
  return (cellCounter - 1) % 7 === 0;
}

// Creates a new table row and appends it to the table
function drawRow() {
    newRow = document.createElement("tr");
    table.appendChild(newRow);
}

let cellCounter = 1;

// Creates a single day cell and appends it to the current row
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

// Renders trailing days from the previous month
function renderPrevMonthTail() {
  for (let i = firstVisibleDayPrevMonth; i <= quantityDaysPrevMonth; i++) {
    if (isNewRowNeeded()) {
      drawRow();               
    }
    drawCell(i);
  }
}

// Renders all days of the current month
function renderCurrentMonth() {
  for (let i = 1; i <= quantityDaysMonthTotal; i++) {
  if (isNewRowNeeded()) {
    drawRow();               
  }
  drawCell(i);
  }
}

// Renders leading days from the next month to fill the last row
function renderNextMonthLead() {
  for (let i = 1; (!isNewRowNeeded()); i++) {             
  drawCell(i);
  }
}

function renderCalender() {
  renderPrevMonthTail();
  renderCurrentMonth();
  renderNextMonthLead();
}

renderCalender();

// Fetches today's historical events from https://history.muffinlabs.com/
async function ladeHistorischeEreignisse() {
  const heute = new Date();
  const url = `https://history.muffinlabs.com/date/${heute.getMonth() + 1}/${heute.getDate()}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);

  return response.json();
}

// Displays the last 5 fetched historical events in the list
async function renderHistorischeEreignisse() {
  try {
    const { date, data } = await ladeHistorischeEreignisse();

    document.querySelector(".date").textContent = date;

    const liste = document.querySelector(".text-column ul");
    liste.replaceChildren(
      ...[...data.Events]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(({ year, text }) => {
        const li = document.createElement("li");
        li.textContent = `${year}: ${text}`;
        return li;
      })
    );

  } catch (error) {
    console.error("Fehler:", error);
  }
}

renderHistorischeEreignisse();

