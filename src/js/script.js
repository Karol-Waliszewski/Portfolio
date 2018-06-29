const NavModule = (function() {
  // DOM Elements
  var $nav = document.getElementById('nav');
  var $body = document.querySelector('.body');
  var $burger = document.getElementById('burger');
  var $links = document.querySelectorAll('.nav__link');

  var toggleActive = function() {
    $nav.classList.toggle('active');
    $burger.classList.toggle('active');
    $body.classList.toggle('active');
  };

  $burger.addEventListener('click', toggleActive);
  for (let $link of $links) {
    $link.addEventListener('click', function() {
      if (window.innerWidth < 768)
        toggleActive();
    });
  }

})();

const ScrollModule = (function() {
  // DOM Element
  var $scroll = document.getElementById('scroll');

  var checkVisibility = function() {
    let offset = window.scrollY;
    let height = window.innerHeight;
    if (offset > height / 2) {
      $scroll.classList.remove('hidden');
    } else {
      $scroll.classList.add('hidden');
    }
  };

  window.addEventListener('scroll', checkVisibility);
  checkVisibility();
})();

const contactModule = (function() {
  // DOM Elements
  var $form = document.getElementById('contactForm');
  var $name = document.getElementById('name');
  var $email = document.getElementById('email');
  var $message = document.getElementById('message');
  var $submit = document.getElementById('submit');

  var inputs = [$email, $name, $message];

  var validateData = function() {
    let flag = true;

    for (let input of inputs) {
      if (input.value.length < 1) {
        //alert('Proszę o wypełnienie wszystkich pól');
        input.classList.add('error');
        input.nextElementSibling.classList.add('active');
        flag = false;
      } else {
        input.classList.remove('error');
        input.nextElementSibling.classList.remove('active');
      }
    }

    if (!$email.value.includes('@') || !$email.value.includes('.')) {
      $email.classList.add('error');
      flag = false;
    }

    return flag;
  };

  var clearForm = function() {
    $form.reset();
    for (let input of inputs) {
      input.classList.remove('error');
      input.nextElementSibling.classList.remove('active');
    }
  };

  var submitForm = function(e) {
    e.preventDefault();
    $submit.setAttribute('disabled', true);

    if (validateData()) {
      sendMessage();
    } else {
      setTimeout(function() {
        submitError();
        $submit.removeAttribute('disabled');
      }, 500);
    }

  };

  var submitSuccess = function() {
    $submit.value = 'Pomyślnie wysłano wiadomość';
    $submit.classList.add('success');
    $submit.classList.remove('error');
  };

  var submitError = function() {
    $submit.value = 'Wyślij';
    $submit.classList.add('error');
    $submit.classList.remove('success');
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
        $submit.removeAttribute('disabled');
      },
      err => {
        console.error(err);
        submitError();
        $submit.removeAttribute('disabled');
      });
  };

  $form.addEventListener('submit', submitForm);

})();
