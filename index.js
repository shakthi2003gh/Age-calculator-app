const inputGroups = document.querySelectorAll(".input-group");
const inputs = document.querySelectorAll(".inputs input");
const calculateButton = document.querySelector(".divider button");

inputs.forEach((input) => {
  input.removeEventListener("change", handleEventListener);
  input.addEventListener("change", handleEventListener);
});

calculateButton.removeEventListener("click", handleCalculation);
calculateButton.addEventListener("click", handleCalculation);

function handleEventListener(e) {
  const input = e.target;
  const value = input.value;
  const maxLength = Number(input.dataset.length);
  const now = new Date();

  if (value) input.closest(".input-group").classList.remove("error");

  const min = (function () {
    if (input.id === "year") return 1500;
    return "01";
  })();

  const max = (function () {
    if (input.id === "year") return new Date().getFullYear();

    if (input.id === "month") {
      const year = document.querySelector("input#year").value;

      if (now.getFullYear() == year) {
        return now.getMonth() + 1;
      }
      return 12;
    }

    if (input.id === "day") {
      const month = document.querySelector("input#month").value;
      const year = document.querySelector("input#year").value;

      if (now.getMonth() == month - 1 && now.getFullYear() == year)
        return now.getDate();

      return new Date(year || 1500, month || 1, 0).getDate();
    }
  })();

  if (value.length > maxLength) e.target.value = value.slice(0, maxLength);

  if (value.length === 1) e.target.value = `0${value}`;

  if (value < min) e.target.value = max;
  if (value > max) e.target.value = min;
}

function handleCalculation() {
  const day = inputs[0].value;
  const month = inputs[1].value - 1;
  const year = inputs[2].value;

  if ([day, month, year].some((v) => !v)) {
    inputGroups.forEach((group) => {
      const isInvalidInputValue = !group.querySelector("input").value;

      group.querySelector(".error-message").innerText =
        "This field is required";
      if (isInvalidInputValue) group.classList.add("error");
    });

    return;
  }

  const now = new Date();
  const bday = new Date(year, month, day);

  let years = now.getFullYear() - bday.getFullYear();
  let months = now.getMonth() - bday.getMonth();
  let days = now.getDate() - bday.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += days < 0 ? 11 : 12;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }

  const birthMonthDays = new Date(
    bday.getFullYear(),
    bday.getMonth() + 1,
    0
  ).getDate();

  if (days < 0) {
    months--;
    days += birthMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  console.log(years);

  if (years < 0) {
    const inputGroup = document.querySelector(".input-group:has(#month)");

    inputGroup.classList.add("error");

    inputGroup.querySelector(".error-message").innerText =
      "Must be valid month.";

    return;
  }

  inputGroups.forEach((group) => group.classList.remove("error"));

  document.querySelector(".result .day span").innerText = days;
  document.querySelector(".result .month span").innerText = months;
  document.querySelector(".result .year span").innerText = years;
}
