/* ==========================================================================
   Archit Gupta — Resume Website
   js/script.js
   Small progressive enhancements. The page is fully readable without this
   file; it only adds interaction on top of the HTML and CSS.
   --------------------------------------------------------------------------
   1. Header shadow + scroll progress bar
   2. Mobile navigation
   3. Active nav link while scrolling (scroll spy)
   4. Scroll reveal
   5. Stat counters
   6. Project filters
   7. Project detail dialog
   8. Voice-note players
   9. Contact form
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;


  /* 1. Header shadow + scroll progress bar -------------------------------- */
  var header = $('.site-header');
  var progressBar = $('#progress-bar');
  var ticking = false;

  function onScroll() {
    var scrolled = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', scrolled > 24);
    progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrolled / max, 1) : 0) + ')';
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();


  /* 2. Mobile navigation --------------------------------------------------- */
  var navToggle = $('#nav-toggle');
  var navMenu = $('#nav-menu');

  function setMenu(open) {
    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    setMenu(!navMenu.classList.contains('is-open'));
  });

  navMenu.addEventListener('click', function (event) {
    if (event.target.closest('a')) { setMenu(false); }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { setMenu(false); }
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('#site-nav')) { setMenu(false); }
  });


  /* 3. Scroll spy ---------------------------------------------------------- */
  var navLinks = $$('.nav__link');
  var linkById = {};
  navLinks.forEach(function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  function setCurrent(id) {
    navLinks.forEach(function (link) { link.removeAttribute('aria-current'); });
    if (linkById[id]) { linkById[id].setAttribute('aria-current', 'true'); }
  }

  if (canObserve) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setCurrent(entry.target.id); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    $$('main section[id]').forEach(function (section) { spy.observe(section); });
  }


  /* 4. Scroll reveal ------------------------------------------------------- */
  var revealItems = $$('.reveal');

  if (canObserve && !reduceMotion) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (item) { revealer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }


  /* 5. Stat counters ------------------------------------------------------- */
  function countUp(element) {
    var target = parseInt(element.getAttribute('data-count'), 10);
    var duration = 1300;
    var start = null;

    function step(timestamp) {
      if (start === null) { start = timestamp; }
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);
      if (progress < 1) { window.requestAnimationFrame(step); }
    }

    element.textContent = '0';
    window.requestAnimationFrame(step);
  }

  var counters = $$('[data-count]');

  if (canObserve && !reduceMotion && counters.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) { counterObserver.observe(counter); });
  }


  /* 6. Project filters ----------------------------------------------------- */
  var filterButtons = $$('.filter');
  var projects = $$('.project');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var filter = button.getAttribute('data-filter');

      filterButtons.forEach(function (other) {
        var active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });

      projects.forEach(function (project) {
        var categories = project.getAttribute('data-category').split(' ');
        var show = filter === 'all' || categories.indexOf(filter) !== -1;
        project.classList.toggle('is-hidden', !show);

        if (show) {
          project.classList.add('is-visible');
          project.classList.remove('is-entering');
          void project.offsetWidth; // restart the pop animation
          project.classList.add('is-entering');
        }
      });
    });
  });

  projects.forEach(function (project) {
    project.addEventListener('animationend', function () {
      project.classList.remove('is-entering');
    });
  });


  /* 7. Project detail dialog ----------------------------------------------- */
  var dialog = $('#project-dialog');
  var modalMedia = $('#modal-media');
  var modalRole = $('#modal-role');
  var modalTitle = $('#modal-title');
  var modalBody = $('#modal-body');
  var lastTrigger = null;

  function openProject(project, trigger) {
    var media = $('.project__media', project).cloneNode(true);

    modalMedia.innerHTML = '';
    modalMedia.appendChild(media);
    modalRole.textContent = $('.project__role', project).textContent;
    modalTitle.textContent = $('.project__title', project).textContent;
    modalBody.innerHTML = $('.project__details', project).innerHTML;
    $('.modal__content', dialog).scrollTop = 0;

    lastTrigger = trigger;
    document.documentElement.classList.add('modal-open');
    dialog.showModal();
  }

  if (dialog && typeof dialog.showModal === 'function') {
    $$('[data-open-project]').forEach(function (button) {
      button.addEventListener('click', function () {
        openProject(button.closest('.project'), button);
      });
    });

    $('#modal-close').addEventListener('click', function () { dialog.close(); });

    // A click on the dialog element itself (not its children) is a click on the backdrop
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) { dialog.close(); }
    });

    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('modal-open');
      if (lastTrigger) { lastTrigger.focus({ preventScroll: true }); }
    });
  } else {
    // Very old browsers: show the details inline instead
    document.documentElement.classList.remove('js');
  }


  /* 8. Voice-note players -------------------------------------------------- */
  var players = $$('[data-voice]');

  function formatTime(seconds) {
    var total = Math.max(0, Math.round(seconds));
    var secs = total % 60;
    return Math.floor(total / 60) + ':' + (secs < 10 ? '0' : '') + secs;
  }

  players.forEach(function (player) {
    var audio = $('audio', player);
    var button = $('.voice__btn', player);
    var time = $('.voice__time', player);
    var length = time.textContent;

    audio.removeAttribute('controls');

    button.addEventListener('click', function () {
      if (audio.paused) {
        players.forEach(function (other) {
          var otherAudio = $('audio', other);
          if (otherAudio !== audio) { otherAudio.pause(); }
        });
        audio.play().catch(function () { /* playback blocked or file missing */ });
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function () {
      player.classList.add('is-playing');
      button.setAttribute('aria-label', 'Pause voice note');
    });

    audio.addEventListener('pause', function () {
      player.classList.remove('is-playing');
      button.setAttribute('aria-label', 'Play voice note');
    });

    audio.addEventListener('timeupdate', function () {
      if (isFinite(audio.duration) && !audio.paused) {
        time.textContent = formatTime(audio.duration - audio.currentTime);
      }
    });

    audio.addEventListener('ended', function () {
      audio.currentTime = 0;
      time.textContent = length;
    });
  });


  /* 9. Contact form -------------------------------------------------------- */
  var form = $('#contact-form');
  var hint = $('#form-hint');

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = form.elements.Name.value.trim();
      var email = form.elements.Email.value.trim();
      var message = form.elements.Message.value.trim();
      var address = form.getAttribute('action').replace('mailto:', '');
      var subject = 'Hello from ' + name;
      var body = message + '\n\n— ' + name + ' (' + email + ')';

      window.location.href = 'mailto:' + address +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      hint.textContent = 'Opening your email app… if nothing happens, write to ' + address + '.';
    });
  }

  var year = $('#year');
  if (year) { year.textContent = new Date().getFullYear(); }
})();
