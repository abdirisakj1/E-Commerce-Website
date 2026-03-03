const toggleMode = document.querySelector(".toggle-mode");
const darkMode = document.querySelector(".fa-moon");
toggleMode.addEventListener("click", switchMode);

function switchMode() {
  document.body.classList.toggle("dark-mode");
  darkMode.classList.toggle("fa-sun");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const saveMode = localStorage.getItem("theme");
  if (saveMode === "dark") {
    document.body.classList.toggle("dark-mode");
    darkMode.classList.add("fa-sun");
  } else {
    darkMode.classList.add("fa-moon");
  }
});
