/* =============================================================
   index.js  —  B Bright Tech Hub
   1. Navbar: scroll shrink, hamburger, dropdown, active link
   2. Hero canvas: floating particle network
   3. Typewriter: cycling taglines with typing + erasing
   ============================================================= */

(function () {
    'use strict';


    /* ===========================================================
       1.  NAVBAR
       =========================================================== */

    const header     = document.querySelector('.site-header');
    const hamburger  = document.getElementById('hamburger');
    const navMenu    = document.getElementById('nav-menu');
    const dropdownLi = document.getElementById('pages-dropdown');
    const dropBtn    = dropdownLi && dropdownLi.querySelector('.navbar__dropdown-toggle');

    /* scroll: add .scrolled */
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* hamburger */
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            const open = hamburger.classList.toggle('open');
            navMenu.classList.toggle('open', open);
            hamburger.setAttribute('aria-expanded', open);
        });
    }

    /* dropdown */
    if (dropdownLi && dropBtn) {
        dropBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const open = dropdownLi.classList.toggle('open');
            dropBtn.setAttribute('aria-expanded', open);
        });
        document.addEventListener('click', function (e) {
            if (!dropdownLi.contains(e.target)) {
                dropdownLi.classList.remove('open');
                dropBtn.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                dropdownLi.classList.remove('open');
                dropBtn.setAttribute('aria-expanded', 'false');
                dropBtn.focus();
            }
        });
    }

    /* active link */
    document.querySelectorAll('.navbar__link').forEach(function (link) {
        if (link.tagName === 'A' && link.getAttribute('href') === window.location.pathname) {
            link.classList.add('active');
        }
    });

    /* close mobile menu on link click */
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger && hamburger.classList.remove('open');
                navMenu.classList.remove('open');
                hamburger && hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* ===========================================================
       2.  HERO CANVAS  —  floating particle network
       =========================================================== */

    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, particles;
        const PARTICLE_COUNT = 80;
        const MAX_DIST       = 130;
        const COLORS         = ['#378f84', '#5ecec4', '#c9913a', '#aac2c5'];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }

        function randomBetween(a, b) { return a + Math.random() * (b - a); }

        function createParticles() {
            particles = Array.from({ length: PARTICLE_COUNT }, function () {
                return {
                    x:    randomBetween(0, W),
                    y:    randomBetween(0, H),
                    vx:   randomBetween(-0.35, 0.35),
                    vy:   randomBetween(-0.35, 0.35),
                    r:    randomBetween(1.2, 2.8),
                    color: COLORS[Math.floor(Math.random() * COLORS.length)]
                };
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            /* connect nearby particles */
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(94, 206, 196, ' + (1 - dist / MAX_DIST) * 0.18 + ')';
                        ctx.lineWidth   = 0.8;
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

        window.addEventListener('resize', function () {
            resize();
            createParticles();
        }, { passive: true });
    }


    /* ===========================================================
       3.  TYPEWRITER  —  cycling taglines
       =========================================================== */

    const typeEl = document.getElementById('typewriter');

    if (typeEl) {

        const phrases = [
            'the Home of Technology.',
            'where Careers are Built.',
            'the Future of Learning.',
            'where Coders are Born.',
            'the Place to Excel.',
            'your Next Chapter.'
        ];

        let phraseIndex  = 0;
        let charIndex    = 0;
        let isDeleting   = false;
        let pauseTimer   = null;

        const TYPE_SPEED   = 65;   /* ms per character while typing   */
        const DELETE_SPEED = 35;   /* ms per character while deleting  */
        const PAUSE_END    = 2200; /* ms to pause after full phrase    */
        const PAUSE_START  = 400;  /* ms to pause before typing next   */

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