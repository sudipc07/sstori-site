/**
 * hero-canvas.js
 * Interactive particle network that reacts to the mouse.
 * Renders on a <canvas id="hero-canvas"> inside .hero-section.
 */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var raf;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var connectionDistance = 140;
  var mouseInfluence = 180;

  function getParticleCount() {
    var w = window.innerWidth;
    if (w < 480) return 40;
    if (w < 768) return 60;
    return 100;
  }

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    var count = getParticleCount();
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    particles = [];
    for (var i = 0; i < count; i++) {
      var speedX = (Math.random() - 0.5) * 0.7;
      var speedY = (Math.random() - 0.5) * 0.7;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: speedX,
        vy: speedY,
        baseVx: speedX,
        baseVy: speedY,
        radius: Math.random() * 2.0 + 0.8,
        opacity: Math.random() * 0.6 + 0.4,
        hue: Math.random() > 0.7 ? 265 : 170 // teal or purple
      });
    }
  }

  function animate() {
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;

    ctx.clearRect(0, 0, w, h);

    // Update & draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Mouse influence — repulsion
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseInfluence && dist > 0) {
        var force = (mouseInfluence - dist) / mouseInfluence * 0.05; // Increased force
        p.vx += dx / dist * force;
        p.vy += dy / dist * force;
      }

      // Very gently return to base velocity to ensure constant movement (mobile friendly)
      // We use a small factor so it doesn't instantly fight the mouse repulsion
      p.vx += (p.baseVx - p.vx) * 0.005;
      p.vy += (p.baseVy - p.vy) * 0.005;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      if (p.hue === 170) {
        ctx.fillStyle = 'rgba(0, 232, 198, ' + p.opacity + ')';
      } else {
        ctx.fillStyle = 'rgba(139, 92, 246, ' + p.opacity + ')';
      }
      ctx.fill();
    }

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i];
        var b = particles[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          var alpha = (1 - dist / connectionDistance) * 0.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(0, 232, 198, ' + alpha + ')';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(animate);
  }

  // Mouse tracking (relative to hero section)
  var hero = canvas.parentElement;
  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  hero.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch support
  hero.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  hero.addEventListener('touchend', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Init
  resize();
  createParticles();
  animate();

  // Debounced resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      createParticles();
    }, 200);
  });

  // Cleanup on page hide (battery friendly)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(animate);
    }
  });
})();
