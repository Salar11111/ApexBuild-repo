/* =====================================================
   APEX BUILD CO. — SITE INTERACTIONS
   ===================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------
     1. STICKY NAV — adds shadow on scroll
     --------------------------------------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------
     2. MOBILE NAV TOGGLE
     --------------------------------------------------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------------------------------------------------
     3. SCROLL REVEAL — IntersectionObserver
     --------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback for ancient browsers
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------
     4. STAT COUNTER — animate when in view
     --------------------------------------------------- */
  const stats = document.querySelectorAll('.stat__num');
  const animateStat = (el) => {
    const target   = parseFloat(el.dataset.count || '0');
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const isFloat  = !Number.isInteger(target);
    const duration = 1800;
    const startTs  = performance.now();

    const tick = (now) => {
      const t = Math.min((now - startTs) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;

      let display;
      if (isFloat) {
        display = v.toFixed(1);
      } else {
        display = Math.floor(v).toLocaleString();
      }
      el.textContent = `${prefix}${display}${suffix}`;

      if (t < 1) requestAnimationFrame(tick);
      else {
        // Lock final value
        if (isFloat) el.textContent = `${prefix}${target.toFixed(1)}${suffix}`;
        else el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(s => statIO.observe(s));
  } else {
    stats.forEach(animateStat);
  }

  /* ---------------------------------------------------
     5. PROJECT FILTER
     --------------------------------------------------- */
  const filterBtns = document.querySelectorAll('#filters .filter');
  const projects   = document.querySelectorAll('#projectsGrid .project');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      projects.forEach(p => {
        const cat = p.dataset.cat;
        const show = filter === 'all' || cat === filter;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------------------------------------------------
     6. CONTACT FORM — client-side handling
     --------------------------------------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const success = document.createElement('div');
    success.className = 'form-success';
    success.textContent = '✓ Thanks! Your request has been received. We\'ll be in touch within one business day.';
    form.prepend(success);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic validation
      const required = form.querySelectorAll('[required]');
      let ok = true;
      required.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#dc2626';
          ok = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!ok) return;

      // In a real app this would POST to a server.
      // Here we just show a confirmation.
      success.classList.add('is-visible');
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => success.classList.remove('is-visible'), 6000);
    });

    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      });
    });
  }

  /* ---------------------------------------------------
     7. SMOOTH ANCHOR SCROLL (offset for sticky nav)
     --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();