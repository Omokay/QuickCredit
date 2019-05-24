const sidenavEl = document.getElementById("sidenav");

// Add and remove provided class names
function toggleClassName(el, className) {
  if (el.classList.contains(className)) {
    el.classList.remove(className);
  } else {
    el.classList.add(className);
  }
}

// Open the side nav on click
document.getElementById("menu-icon").onclick = function(){
  toggleClassName(sidenavEl, 'active');
}

// Close the side nav on click
document.getElementById("sidenav-close-icon").onclick = function(){
  toggleClassName(sidenavEl, 'active');
}