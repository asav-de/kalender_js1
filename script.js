let today = new Date();

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
const nextMidnight = new Date(state.year, state.month, today.getDate() + 1);
const mSecondUntilNextDay = nextMidnight - today;
const currentDay = today.toLocaleDateString("de", {day: "numeric"});

// Reload the page at midnight so the calendar updates to the new day
setTimeout(() => {
  location.reload();
}, mSecondUntilNextDay);

function renderHeading() {
  const currentFullDate = today.toLocaleDateString("de", { day: "numeric", month: "long", year: "numeric" });
  const currentMonth = today.toLocaleString("de", {month: "long" });
  const currentWeekday = today.toLocaleString("de", {weekday: "long" });
  const numberWeekdayOfMonth = Math.ceil(today.getDate() / 7);
  
  const headingH1 = document.querySelector('.titel');
  headingH1.innerHTML = `Kalenderblatt vom <wbr><span class="datum-nowrap">${currentFullDate}</span>`;
  document.title = `Kalender vom ${currentFullDate}`; //Der Titel (angezeigt im Browser-Tab)
  
  const headingH2 = document.querySelector('.currentMonth');
  headingH2.textContent = (`${currentMonth}`);
  
  const pointer = isFeiertag(today) ? "ein" : "kein";

  const textSlots = {
  currentFullDate: currentFullDate,
  currentWeekday: currentWeekday,
  numberWeekdayOfMonth: numberWeekdayOfMonth,
  currentMonth: currentMonth,
  currentYear: state.year,
  pointer: pointer
}
  fillHeading(textSlots); 
}

// Public holidays with a fixed date every year
const festeFeiertage = {
  "1-1":   "Neujahr",
  "5-1":   "Tag der Arbeit",
  "10-3":  "Tag der Deutschen Einheit",
  "12-25": "1. Weihnachtstag",
  "12-26": "2. Weihnachtstag",
};

// Builds the full set of holidays (fixed + movable) for a given year
function getFeiertageForYear(year) {
  const bewegliche = getBeweglicheFeiertage(year);
  return new Set([...Object.keys(festeFeiertage), ...Object.keys(bewegliche)]);
}

// Checks whether a given date is a holiday
function isFeiertag(d) {
  const feiertage = getFeiertageForYear(d.getFullYear());
  const key = `${d.getMonth() + 1}-${d.getDate()}`;
  return feiertage.has(key);
}

// Returns the Date of Easter Sunday (Ostersonntag) for a given year
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Builds the movable holidays based on the date of Easter
function getBeweglicheFeiertage(year) {
  const ostersonntag = calculateEaster(year);
  const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
  const dateKey = (date) => `${date.getMonth() + 1}-${date.getDate()}`;

  const karfreitag = addDays(ostersonntag, -2);
  const ostermontag = addDays(ostersonntag, 1);
  const christiHimmelfahrt = addDays(ostersonntag, 39);
  const pfingstmontag = addDays(ostersonntag, 50);
  const fronleichnam = addDays(ostersonntag, 60);

  return {
    [dateKey(karfreitag)]: "Karfreitag",
    [dateKey(ostermontag)]: "Ostermontag",
    [dateKey(christiHimmelfahrt)]: "Christi Himmelfahrt",
    [dateKey(pfingstmontag)]: "Pfingstmontag",
    [dateKey(fronleichnam)]: "Fronleichnam",
  };
}

function getFeiertagName(d) {
  const feiertage = { ...festeFeiertage, ...getBeweglicheFeiertage(d.getFullYear()) };
  const key = `${d.getMonth() + 1}-${d.getDate()}`;
  return feiertage[key];
}

// Writes each value into the element matching its data-slot attribute
function fillHeading(slot) {
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

let newRow;
const tbody = document.getElementById("calendarBody");
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
function drawCell(i, numberMonth) {
  const day = new Date(state.year, numberMonth, i);
  const feiertagName = getFeiertagName(day);
  const newCell = document.createElement("td");
  newCell.dataset.month = numberMonth;
  newCell.dataset.day = i;
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
  if (feiertagName) {
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('feiertag-name');
    nameSpan.textContent = feiertagName;
    newCell.appendChild(nameSpan);
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
    drawCell(i, state.month - 1);
  }
}

// Renders all days of the current month
function renderCurrentMonth(quantityDaysMonthTotal) {
  for (let i = 1; i <= quantityDaysMonthTotal; i++) {
  if (isNewRowNeeded()) {
    drawRow();               
  }
  drawCell(i, state.month);
  }
}

// Renders leading days from the next month to fill the last row
function renderNextMonthLead(quantityDaysPrevMonth) {
  for (let i = 1; (!isNewRowNeeded()); i++) {             
  drawCell(i, state.month + 1);
  }
}

function renderCalender() {
  const tbody = document.getElementById("calendarBody");
  tbody.innerHTML = "";
  cellcounter = 1;
  const numberDay = new Date(state.year, state.month, 1).getDay();
  const quantityDaysMonthTotal = new Date(state.year, state.month + 1, 0).getDate();
  const quantityDaysPrevMonth = new Date(state.year, state.month, 0).getDate();
  let firstVisibleDayPrevMonth = quantityDaysPrevMonth;
  firstVisibleDayPrevMonth -= (numberDay + 5) % 7;



  renderPrevMonthTail(firstVisibleDayPrevMonth, quantityDaysPrevMonth);
  renderCurrentMonth(quantityDaysMonthTotal);
  renderNextMonthLead(quantityDaysPrevMonth);
}

function eventListener() {
  let selectedCell = null
  const calendarBody = document.getElementById("calendarBody");
  calendarBody.addEventListener("click", (e) => {
    const clickedCell = e.target.closest('td');
    if(!clickedCell) return;
    if(clickedCell === selectedCell) {
      selectedCell.classList.remove('selected');
      selectedCell = null;
      return;
    }
    if (selectedCell === null){
      selectedCell = e.target.closest('td');
      selectedCell.classList.add('selected');  
    }
    if (selectedCell != null) {
      selectedCell.classList.remove('selected');
      selectedCell = e.target.closest('td');
      selectedCell.classList.add('selected');
      let day = Number(selectedCell.dataset.day);
      let month = Number(selectedCell.dataset.month);
      let selectedMonthDate = new Date(state.year, month, day);
      today = selectedMonthDate;
      renderHeading();
      renderHistorischeEreignisse();
    }
  });
}

prev.addEventListener("click", () => { shift(-1); });
next.addEventListener("click", () => { shift(1); });

// Fetches today's historical events from https://history.muffinlabs.com/
async function ladeHistorischeEreignisse() {
  const url = `https://history.muffinlabs.com/date/${today.getMonth() + 1}/${today.getDate()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
  return response.json();
}

// Displays the last 5 fetched historical events in the list
async function renderHistorischeEreignisse() {
    const list = document.getElementById("dateList");
    list.innerHTML = "";
  try {
    const { date, data } = await ladeHistorischeEreignisse();
    document.getElementById("dateLabel").textContent = date;
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

renderHeading();
renderCalender();
eventListener();

renderHistorischeEreignisse();