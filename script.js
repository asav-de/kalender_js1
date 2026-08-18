const today = new Date();




function shift(delta) {
  const d = new Date(state.year, state.month + delta);
  state.year = d.getFullYear();
  state.month = d.getMonth();
  renderCalender();
}

const state = {
  year:  today.getFullYear(),
  month: today.getMonth(),
};


// Date parts used to build the calendar grid
const year = state.year;
const nextMidnight = new Date(state.year, state.month, today.getDate() + 1);
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
const tbody = document.querySelector("table");
let cellcounter = 1;


// True at the start of each new week (every 7th cell)
function isNewRowNeeded() {
  return (cellcounter - 1) % 7 === 0;
}

// Creates a new table row and appends it to the table
function drawRow() {
    newRow = document.createElement("tr");
    tbody.appendChild(newRow);
}

// Creates a single day cell and appends it to the current row
function drawCell(i) {
  const numberMonth = state.month;
  const day = new Date(year, numberMonth, i);
  const newCell = document.createElement("td");
  newCell.textContent = i;
  if (Number(currentDay) === i) {
  newCell.classList.add('today');
  }
  if ((cellcounter % 7 === 0) || (isFeiertag(day))) {
    newCell.classList.add('So');
  } 
  if (cellcounter % 7 === 6 ) {
    newCell.classList.add('Sa');
  }
  newRow.appendChild(newCell);
  cellcounter++;
}

// Renders trailing days from the previous month
function renderPrevMonthTail(firstVisibleDayPrevMonth, quantityDaysPrevMonth) {
  for (let i = firstVisibleDayPrevMonth; i <= quantityDaysPrevMonth; i++) {
    if (isNewRowNeeded()) {
      drawRow();               
    }
    drawCell(i);
  }
}

// Renders all days of the current month
function renderCurrentMonth(quantityDaysMonthTotal) {
  for (let i = 1; i <= quantityDaysMonthTotal; i++) {
  if (isNewRowNeeded()) {
    drawRow();               
  }
  drawCell(i);
  }
}

// Renders leading days from the next month to fill the last row
function renderNextMonthLead(quantityDaysPrevMonth) {
  for (let i = 1; (!isNewRowNeeded()); i++) {             
  drawCell(i);
  }
}

function renderCalender() {
  const tbody = document.querySelector("table");
  tbody.innerHTML = "";
  cellcounter = 1;
  const year = state.year;
  const numberDay = new Date(year, state.month, 1).getDay();
  const quantityDaysMonthTotal = new Date(year, state.month + 1, 0).getDate();
  const quantityDaysPrevMonth = new Date(year, state.month, 0).getDate();
  let firstVisibleDayPrevMonth = quantityDaysPrevMonth;
  firstVisibleDayPrevMonth -= (numberDay + 5) % 7;

  const headingH2 = document.querySelector('.currentMonth');
  const monthName = new Date(state.year, state.month).toLocaleString("de", { month: "long" });
  headingH2.textContent = (`${monthName}`);

  renderPrevMonthTail(firstVisibleDayPrevMonth, quantityDaysPrevMonth);
  renderCurrentMonth(quantityDaysMonthTotal);
  renderNextMonthLead(quantityDaysPrevMonth);
}

renderCalender();

prev.addEventListener("click", () => { shift(-1); });
next.addEventListener("click", () => { shift(1); });

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

