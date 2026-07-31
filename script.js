let today = new Date();
let currentFullDate = today.toLocaleDateString("de", { day: "numeric", month: "long", year: "numeric" });
let currentMonth = today.toLocaleString("de", {day: "numeric", month: "long" });

let headingH1 = document.querySelector('.titel');
headingH1.textContent = (`Kalenderblatt vom ${currentFullDate}`);

let headingH3 = document.querySelector('.HE');
headingH3.textContent = (`Historische Ereignisse am ${currentMonth}`);
