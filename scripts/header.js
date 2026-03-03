const navbar = document.querySelector(".navbar")
const toggleBtn = document.querySelector(".toggle-button");


toggleBtn.addEventListener("click", function() {
    navbar.classList.toggle("active")
})