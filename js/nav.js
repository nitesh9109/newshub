const body = document.querySelector("body");
const nav = document.querySelector("nav");
const modeToggle = document.querySelector(".dark-light");
const searchToggle = document.querySelector(".searchToggle");
const sidebarOpen = document.querySelector(".sidebarOpen");
const sidebarClose = document.querySelector(".siderbarClose");

// Set initial mode based on localStorage
let getMode = localStorage.getItem("mode");
if (getMode === "dark-mode") {
  body.classList.add("dark");
  modeToggle.classList.add("active");
}

// Toggle dark and light mode
modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark");

  // Update localStorage based on mode
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark-mode");
  } else {
    localStorage.setItem("mode", "light-mode");
  }
});

// Toggle search box
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

// Toggle sidebar
sidebarOpen.addEventListener("click", () => {
  nav.classList.add("active");
});

// Close sidebar when clicking outside of it
body.addEventListener("click", (e) => {
  let clickedElm = e.target;

  if (!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")) {
    nav.classList.remove("active");
  }
});
