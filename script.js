/* ===========================
   THRONE OF GRACE MINISTRIES
   script.js
=========================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ======= PARTICLE CANVAS ======= */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x       = Math.random() * canvas.width;
      this.y       = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size    = Math.random() * 1.5 + 0.3;
      this.speedY  = -(Math.random() * 0.3 + 0.08);
      this.speedX  = (Math.random() - 0.5) * 0.12;
      this.opacity = Math.random() * 0.55 + 0.15;
      this.life    = 0;
      this.maxLife = Math.random() * 500 + 200;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const fade = this.life < 60 ? this.life / 60 :
                   this.life > this.maxLife - 60 ? (this.maxLife - this.life) / 60 : 1;
      ctx.save();
      ctx.globalAlpha = this.opacity * fade;
      ctx.fillStyle   = '#C9A84C';
      ctx.shadowBlur  = 4;
      ctx.shadowColor = '#C9A84C';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();

  /* ======= NAVBAR SCROLL ======= */
  const navbar   = document.getElementById('navbar');
  const topbarH  = document.querySelector('.topbar') ? 38 : 0;
  function onScroll() {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ======= HAMBURGER ======= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });

  /* ======= HERO SLIDESHOW ======= */
  const slides     = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }
  function nextSlide() { goToSlide(currentSlide + 1); }
  function startAuto() { slideTimer = setInterval(nextSlide, 5000); }
  function stopAuto()  { clearInterval(slideTimer); }

  indicators.forEach(btn => {
    btn.addEventListener('click', () => {
      stopAuto();
      goToSlide(parseInt(btn.dataset.slide));
      startAuto();
    });
  });
  startAuto();

  /* ======= SCROLL REVEAL ======= */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = Array.from(entry.target.parentElement.querySelectorAll(':scope > .reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(idx * 80, 400));
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ======= ACTIVE NAV ON SCROLL ======= */
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinkEls.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === `#${e.target.id}`) a.classList.add('active');
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => sectionObs.observe(s));

  /* ======= 3D TILT on BRANCH CARDS ======= */
  document.querySelectorAll('.branch-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform   = `translateY(-10px) perspective(700px) rotateX(${dy * -5}deg) rotateY(${dx * 5}deg)`;
      card.style.transition  = 'box-shadow .15s, border-color .3s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .5s cubic-bezier(.25,.46,.45,.94), box-shadow .5s, border-color .3s';
    });
  });

  /* ======= GALLERY ITEM click (light-box placeholder) ======= */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      // Could expand into a lightbox; for now subtle scale feedback
      item.style.transform = 'scale(0.96)';
      setTimeout(() => item.style.transform = '', 250);
    });
  });

  /* ======= SMOOTH SCROLL (nav offset) ======= */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ======= HERO PARALLAX ======= */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight && heroContent) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });

  /* ======= CONTACT FORM ======= */
  const form = document.getElementById('contactForm');
  const succ = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        form.reset();
        succ.classList.add('visible');
        setTimeout(() => succ.classList.remove('visible'), 5000);
      }, 1800);
    });
  }

  /* ======= TICKER PAUSE ON HOVER ======= */
  const track = document.querySelector('.ticker-track');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }

  /* ======= STATS COUNTER ANIMATION ======= */
  const statNums = document.querySelectorAll('.stat-num');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9]/g, '');
        if (!raw) return;
        const target = parseInt(raw);
        const suffix = el.textContent.replace(raw, '');
        let current = 0;
        const step = Math.ceil(target / 60);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(interval);
        }, 20);
        statObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObs.observe(el));

});