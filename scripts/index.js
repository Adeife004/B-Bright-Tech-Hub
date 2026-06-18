/* =============================================================
   index.js  —  B Bright Tech Hub
   1. Navbar: scroll shrink, hamburger, dropdown, active link
   2. Hero canvas: floating particle network
   3. Typewriter: cycling taglines with typing + erasing
   ============================================================= */

(function () {
  "use strict";

  /* ===========================================================
       1.  NAVBAR
       =========================================================== */

  const header = document.querySelector(".site-header");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const dropdownLi = document.getElementById("pages-dropdown");
  const dropBtn =
    dropdownLi && dropdownLi.querySelector(".navbar__dropdown-toggle");

  /* scroll: add .scrolled */
  function initialScrollState() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 20);
    }
  }

  window.addEventListener("scroll", initialScrollState, { passive: true });
  initialScrollState();

  /* hamburger */
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      const open = hamburger.classList.toggle("open");
      navMenu.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open);
    });
  }

  /* dropdown */
  if (dropdownLi && dropBtn) {
    dropBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      const open = dropdownLi.classList.toggle("open");
      dropBtn.setAttribute("aria-expanded", open);
    });
    document.addEventListener("click", function (e) {
      if (!dropdownLi.contains(e.target)) {
        dropdownLi.classList.remove("open");
        dropBtn.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdownLi.classList.remove("open");
        dropBtn.setAttribute("aria-expanded", "false");
        dropBtn.focus();
      }
    });
  }

  /* active link */
  document.querySelectorAll(".navbar__link").forEach(function (link) {
    if (
      link.tagName === "A" &&
      link.getAttribute("href") === window.location.pathname
    ) {
      link.classList.add("active");
    }
  });

  /* close mobile menu on link click */
  if (navMenu) {
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger && hamburger.classList.remove("open");
        navMenu.classList.remove("open");
        hamburger && hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================================================
   NAVBAR SMART SCROLL
   Replace the onScroll function + its event listener
   in the "1. NAVBAR" block of your scripts/index.js
   ============================================================ */

  /* ---- smart scroll behaviour ---- */
  let lastY = 0;
  let ticking = false;
  let scrollDir = "up";
  let peekTimer = null;
  let revealTimer = null;
  const HIDE_THRESHOLD = 80; 
  const DELTA_THRESHOLD = 6; 

  function applyScrollState() {
    if (!header) {
      ticking = false;
      return;
    }

    const currentY = window.scrollY;
    const delta = currentY - lastY;

    /* --- at the very top --- */
    if (currentY <= 10) {
      clearTimeout(peekTimer);
      clearTimeout(revealTimer);
      header.classList.remove("nav-hidden", "nav-peek", "scrolled");
      header.classList.add("at-top", "nav-visible");
      lastY = currentY;
      ticking = false;
      return;
    }

    header.classList.remove("at-top");
    header.classList.add("scrolled");

    /* ignore tiny jitter */
    if (Math.abs(delta) < DELTA_THRESHOLD) {
      ticking = false;
      return;
    }

    if (delta > 0 && currentY > HIDE_THRESHOLD) {
      /* scrolling DOWN */
      if (scrollDir !== "down") {
        scrollDir = "down";
        clearTimeout(peekTimer);
        clearTimeout(revealTimer);

        /* brief delay before hiding so it doesn't feel jumpy */
        revealTimer = setTimeout(function () {
          header.classList.remove("nav-visible", "nav-peek");
          header.classList.add("nav-hidden");

          /* after hiding, show a peek to remind user it exists */
          peekTimer = setTimeout(function () {
            if (header.classList.contains("nav-hidden")) {
              header.classList.remove("nav-hidden");
              header.classList.add("nav-peek");
            }
          }, 1800);
        }, 120);
      }
    } else if (delta < 0) {
      /* scrolling UP — snap back immediately */
      if (scrollDir !== "up") {
        scrollDir = "up";
        clearTimeout(peekTimer);
        clearTimeout(revealTimer);
      }
      header.classList.remove("nav-hidden", "nav-peek");
      header.classList.add("nav-visible");
    }

    lastY = currentY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(applyScrollState);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  applyScrollState(); /* run once on load */

  /* ===========================================================
       2.  HERO CANVAS  —  floating particle network
       =========================================================== */

  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, particles;
    const PARTICLE_COUNT = 80;
    const MAX_DIST = 130;
    const COLORS = ["#378f84", "#5ecec4", "#c9913a", "#aac2c5"];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function randomBetween(a, b) {
      return a + Math.random() * (b - a);
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, function () {
        return {
          x: randomBetween(0, W),
          y: randomBetween(0, H),
          vx: randomBetween(-0.35, 0.35),
          vy: randomBetween(-0.35, 0.35),
          r: randomBetween(1.2, 2.8),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* connect nearby particles */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              "rgba(94, 206, 196, " + (1 - dist / MAX_DIST) * 0.18 + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      /* draw dots */
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;

        /* move */
        p.x += p.vx;
        p.y += p.vy;

        /* bounce */
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener(
      "resize",
      function () {
        resize();
        createParticles();
      },
      { passive: true },
    );
  }

  /* ===========================================================
       3.  TYPEWRITER  —  cycling taglines
       =========================================================== */

  const typeEl = document.getElementById("typewriter");

  if (typeEl) {
    const phrases = [
      "The Home of Technology.",
      "Where Careers are Built.",
      "The Future of Learning.",
      "Where Coders are Born.",
      "The Place to Excel.",
      "Your Next Chapter.",
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseTimer = null;

    const TYPE_SPEED = 65; /* ms per character while typing   */
    const DELETE_SPEED = 35; /* ms per character while deleting  */
    const PAUSE_END = 2200; /* ms to pause after full phrase    */
    const PAUSE_START = 400; /* ms to pause before typing next   */

    function tick() {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        /* type one more character */
        charIndex++;
        typeEl.textContent = current.slice(0, charIndex);

        if (charIndex === current.length) {
          /* finished typing — pause then start deleting */
          pauseTimer = setTimeout(function () {
            isDeleting = true;
            tick();
          }, PAUSE_END);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        /* erase one character */
        charIndex--;
        typeEl.textContent = current.slice(0, charIndex);

        if (charIndex === 0) {
          /* finished deleting — move to next phrase */
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, PAUSE_START);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    /* small initial delay so the page has settled */
    setTimeout(tick, 900);
  }
})();

/* ============================================================
   PROGRAMMES SECTION — July of Tech countdown
   ============================================================ */

(function () {
  "use strict";

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const statusEl = document.getElementById("july-status");
  const liveBanner = document.getElementById("july-live-banner");

  if (!daysEl) return; // section not on this page

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function setNum(el, val) {
    const newVal = pad(val);
    if (el.textContent !== newVal) {
      el.classList.remove("flip");
      void el.offsetWidth; // reflow to restart animation
      el.classList.add("flip");
      el.textContent = newVal;
      setTimeout(function () {
        el.classList.remove("flip");
      }, 200);
    }
  }

  function tick() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed; 6 = July

    // July 1 of the current or next year
    let target = new Date(year, 6, 1, 0, 0, 0); // July 1, 00:00:00
    const julyEnd = new Date(year, 6, 31, 23, 59, 59); // July 31

    const isJulyNow = month === 6;

    if (isJulyNow) {
      // It's July — show live banner, hide countdown
      if (statusEl) {
        statusEl.className = "prog-card__badge prog-card__badge--live";
        statusEl.textContent = "🔴 LIVE NOW";
      }
      if (liveBanner) liveBanner.hidden = false;

      // Show time remaining in July
      const diff = julyEnd - now;
      if (diff <= 0) return;

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setNum(daysEl, d);
      setNum(hoursEl, h);
      setNum(minsEl, m);
      setNum(secsEl, s);
    } else {
      // Not July — countdown to next July 1
      if (month > 6) {
        target = new Date(year + 1, 6, 1, 0, 0, 0);
      }

      if (statusEl) {
        statusEl.className = "prog-card__badge prog-card__badge--upcoming";
        const monthsLeft =
          (target.getFullYear() - now.getFullYear()) * 12 +
          (6 - now.getMonth());
        statusEl.textContent =
          monthsLeft <= 1 ? "Coming Soon" : "July " + target.getFullYear();
      }

      const diff = target - now;
      if (diff <= 0) return;

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setNum(daysEl, d);
      setNum(hoursEl, h);
      setNum(minsEl, m);
      setNum(secsEl, s);
    }
  }

  tick();
  setInterval(tick, 1000);
})();

/* ============================================================
   FOOTER — auto year
   Append to bottom of scripts/index.js
   ============================================================ */
(function () {
  const yr = document.getElementById("footer-year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
