const today = new Date();

console.log('Hallo!')

const currentFullDate = today.toLocaleDateString("de", { day: "numeric", month: "long", year: "numeric" });
const currentMonth = today.toLocaleString("de", {month: "long" });
const currentYear = today.toLocaleDateString("de", {year: "numeric"});
const currentWeekday = today.toLocaleString("de", { weekday: "long" });
const currentDay = today.toLocaleDateString("de", {day: "numeric"});
const weekdayNumberInMonth = Math.ceil(today.getDate() / 7);

const headingH1 = document.querySelector('.titel');
headingH1.textContent = `Kalenderblatt vom ${currentFullDate}`;
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

document.querySelector('[data-slot="currentFullDate"]').textContent = currentFullDate;
const items = document.querySelectorAll('[data-slot="currentWeekDay"]'); // get all of "currentWeekDay" in Text
items.forEach(el => {
  el.textContent = currentWeekday;
});
document.querySelector('[data-slot="weekdayNumberInMonth"]').textContent = weekdayNumberInMonth;
document.querySelector('[data-slot="currentMonth"]').textContent = currentMonth;
document.querySelector('[data-slot="currentYear"]').textContent = currentYear;
document.querySelector('[data-slot="pointer"]').textContent = pointer;

