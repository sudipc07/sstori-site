/**
 * animations.js
 * Scroll-reveal, 3D card tilt, mouse-follow glow, and stat counters.
 */
(function () {
  /* ═══════════════════════════════════════════
     0. MOBILE NAVIGATION
     ═══════════════════════════════════════════ */
  var menuToggle = document.querySelector('.mobile-menu-toggle');
  var navLinksContainer = document.querySelector('.nav-links');
  var navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', function () {
      var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      document.body.style.overflow = isExpanded ? '' : 'hidden'; // Prevent scrolling when open
    });

    // Close menu when a link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ═══════════════════════════════════════════
     1. SCROLL REVEAL (IntersectionObserver)
     ═══════════════════════════════════════════ */
  var revealItems = document.querySelectorAll('.reveal');

  if (revealItems.length) {
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) {
        item.classList.add('reveal-visible');
      });
    } else {
      var revealObserver = new IntersectionObserver(
        function (entries, io) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('reveal-visible');
            io.unobserve(entry.target);
          });
        },
        { root: null, threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
      );

      revealItems.forEach(function (item) {
        revealObserver.observe(item);
      });
    }
  }

  /* ═══════════════════════════════════════════
     2. 3D CARD TILT
     ═══════════════════════════════════════════ */
  var tiltCards = document.querySelectorAll('.service-card');

  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';

      // Update mouse position for the radial glow CSS effect
      var px = (x / rect.width * 100).toFixed(1) + '%';
      var py = (y / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mouse-x', px);
      card.style.setProperty('--mouse-y', py);
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });

  /* ═══════════════════════════════════════════
     3. HERO MOUSE-FOLLOW GLOW
     ═══════════════════════════════════════════ */
  var heroGlow = document.querySelector('.hero-mouse-glow');
  var heroSection = document.querySelector('.hero-section');

  if (heroGlow && heroSection) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      heroGlow.style.background = 'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(0, 232, 198, 0.07), transparent 60%)';
    });
  }

  /* ═══════════════════════════════════════════
     4. ANIMATED STAT COUNTERS
     ═══════════════════════════════════════════ */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length && 'IntersectionObserver' in window) {
    var statsObserver = new IntersectionObserver(
      function (entries, io) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var el = entry.target;
          var target = el.getAttribute('data-target');
          var suffix = el.getAttribute('data-suffix') || '';
          var prefix = el.getAttribute('data-prefix') || '';
          var numTarget = parseFloat(target);
          var duration = 1600;
          var startTime = null;

          function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
          }

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOutCubic(progress);
            var current = easedProgress * numTarget;

            if (Number.isInteger(numTarget)) {
              el.textContent = prefix + Math.round(current) + suffix;
            } else {
              el.textContent = prefix + current.toFixed(1) + suffix;
            }

            if (progress < 1) {
              requestAnimationFrame(step);
            }
          }

          requestAnimationFrame(step);
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ═══════════════════════════════════════════
     5. SMOOTH SCROLL FOR NAV LINKS
     ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
