// NAV and SCROLL MODULE

(function() {
  // DOM Elements
  var $nav = document.getElementById("nav");
  var $burgerWrapper = document.querySelector(".nav__burger");
  var $burger = document.getElementById("burger");
  var $links = document.querySelectorAll(".nav__link");
  var $scroll = document.getElementById("scroll");

  // Variables
  var active = false;
  var mobile = 768;

  // Functions
  var toggleActive = function() {
    active = !active;
    $nav.classList.toggle("active");
    $burger.classList.toggle("active");
    $burgerWrapper.classList.toggle("active");
    if (window.innerWidth < mobile) {
      if (active) $nav.addEventListener("touchmove", disableScroll, false);
      else $nav.removeEventListener("touchmove", disableScroll, false);
    }
  };

  var disableScroll = function(e) {
    e.preventDefault();
  };

  var checkVisibility = function() {
    let offset = window.scrollY;
    let height = window.innerHeight;
    if (offset > height / 2) {
      $scroll.classList.remove("hidden");
    } else {
      $scroll.classList.add("hidden");
    }
  };

  var checkShadow = function() {
    let offset = window.scrollY;
    let height = window.innerHeight;
    if (offset > height - $burgerWrapper.clientHeight - 1) {
      $burgerWrapper.classList.add("shadow");
    } else {
      $burgerWrapper.classList.remove("shadow");
    }
  };

  // Listeners
  window.addEventListener("scroll", checkVisibility);
  window.addEventListener("scroll", checkShadow);
  $burger.addEventListener("click", toggleActive);
  for (let $link of $links) {
    $link.addEventListener("click", function() {
      if (window.innerWidth < mobile) toggleActive();
    });
  }

  checkVisibility();
  checkShadow();
})();

// VH variable mobile fix
function fixVH() {
  let vh = document.documentElement.clientHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

fixVH();
window.addEventListener("resize", fixVH);
