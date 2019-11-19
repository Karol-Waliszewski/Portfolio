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

// CONTACT MODULE

(function() {
  // DOM Elements
  var $form = document.getElementById("contactForm");
  var $name = document.getElementById("name");
  var $email = document.getElementById("email");
  var $message = document.getElementById("message");
  var $submit = document.getElementById("submit");
  var $error = document.getElementById("submitError");

  // Variables
  var inputs = [$email, $name, $message];

  // Functions
  var validateData = function() {
    let flag = true;

    for (let input of inputs) {
      if (input.value.length < 1) {
        input.classList.add("error");
        input.parentNode
          .querySelector(".contact__error")
          .classList.add("active");
        flag = false;
      } else {
        input.classList.remove("error");
        input.parentNode
          .querySelector(".contact__error")
          .classList.remove("active");
      }
    }

    if (!$email.value.includes("@") || !$email.value.includes(".")) {
      $email.classList.add("error");
      flag = false;
    } else {
      $email.classList.remove("error");
    }

    return flag;
  };

  var clearForm = function() {
    let errors = [...document.querySelectorAll(".contact__error")];
    $form.reset();
    for (let input of inputs) {
      input.classList.remove("error");
    }
    for (let error of errors) {
      error.classList.remove("active");
    }
  };

  var submitForm = function(e) {
    e.preventDefault();
    $submit.setAttribute("disabled", true);

    if (validateData()) {
      sendMessage();
    } else {
      setTimeout(function() {
        submitError();
        $submit.removeAttribute("disabled");
      }, 500);
    }
  };

  var submitSuccess = function() {
    $submit.value = "Pomyślnie wysłano wiadomość";
    $submit.classList.add("success");
    $submit.classList.remove("error");
  };

  var submitError = function() {
    $submit.value = "Wyślij";
    $submit.classList.add("error");
    $submit.classList.remove("success");
  };

  var sendMessage = function() {
    let service_id = "lolekappa";
    let template_id = "template_da8gZu7J";

    let params = {
      from_name: $name.value,
      message_html: $message.value,
      reply_to: $email.value
    };

    emailjs.send(service_id, template_id, params).then(
      () => {
        submitSuccess();
        clearForm();
        $submit.removeAttribute("disabled");
        $error.classList.remove("active");
      },
      err => {
        console.error(err);
        submitError();
        $error.classList.add("active");
        $submit.removeAttribute("disabled");
      }
    );
  };

  // Listener
  $form.addEventListener("submit", submitForm);
})();

// VH variable mobile fix
function fixVH() {
  let vh = document.documentElement.clientHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

fixVH();
window.addEventListener("resize", fixVH);
