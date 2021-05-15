const showMenu = (headerToggle, navbarId) => {
  const toggleBtn = document.getElementById(headerToggle),
    nav = document.getElementById(navbarId);

  if (headerToggle && navbarId) {
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        nav.classList.toggle("show-menu");
        toggleBtn.classList.toggle("bx-x");
      });
    }
  }
};
showMenu("header-toggle", "navbar");

const linkColor = document.querySelectorAll(".nav_link");

function colorLink() {
  linkColor.forEach((l) => l.classList.remove("active"));
  this.classList.add("active");
}

linkColor.forEach((l) => l.addEventListener("click", colorLink));

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");

const optionsList = document.querySelectorAll(".option");
if (selected) {
  selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
  });
}

optionsList.forEach((o) => {
  if (o) {
    o.addEventListener("click", () => {
      selected.innerHTML = o.querySelector("label").innerHTML;
      optionsContainer.classList.remove("active");
    });
  }
});
