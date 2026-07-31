const MS_PER_DAY = 1000 * 60 * 60 * 24;

const today = new Date();

const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const startOfYear = Date.UTC(today.getFullYear(), 0, 1);
const startOfNextYear = Date.UTC(today.getFullYear() + 1, 0, 1)
const todayUTS = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

const daysInYear = (startOfNextYear - startOfYear) / MS_PER_DAY; 
const dayOfYear = (todayUTS - startOfYear) / MS_PER_DAY + 1;
const remainingDays = (startOfNextYear - todayUTS) / MS_PER_DAY;
const isWeekend = today => today.getDay() === 0 || today.getDay() === 6;

let currentFullDate = today.toLocaleDateString("de", { day: "numeric", month: "long", year: "numeric" });
let currentDay = today.toLocaleDateString("de", {day: "numeric"});

let currentMonth = today.toLocaleString("de", {month: "long" });
let currentYear = today.toLocaleDateString("de", {year: "numeric"});
let currentWeekday = today.toLocaleString("de", { weekday: "long" });
let numberOfTheWeek = today.getDay();

let headingH1 = document.querySelector('.titel');
headingH1.textContent = (`Kalenderblatt vom ${currentFullDate}`);

let headingH3 = document.querySelector('.HE');
headingH3.textContent = (`Historische Ereignisse am ${currentDay + ". " + currentMonth}`);

const pointer = isWeekend(today) ? "Wochenende" : "kein";

document.querySelector('[data-slot="currentFullDate"]').textContent = currentFullDate;
document.querySelector('[data-slot="currentWeekDay"]').textContent = currentWeekday;
document.querySelector('[data-slot="numberOfTheWeek"]').textContent = numberOfTheWeek;
document.querySelector('[data-slot="currentDay"]').textContent = currentDay;
document.querySelector('[data-slot="currentMonth"]').textContent = currentMonth;
document.querySelector('[data-slot="currentYear"]').textContent = currentYear;
document.querySelector('[data-slot="dayOfYear"]').textContent = dayOfYear;
document.querySelector('[data-slot="remainingDays"]').textContent = remainingDays;
document.querySelector('[data-slot="remainingDays"]').textContent = remainingDays;
document.querySelector('[data-slot="daysInMonth"]').textContent = daysInMonth;
document.querySelector('[data-slot="pointer"]').textContent = pointer;

