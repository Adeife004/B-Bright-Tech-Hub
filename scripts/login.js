/* =============================================================
   login.js — B Bright Tech Hub Login Page
   1. Background particle canvas
   2. Terminal code-rain background
   3. Wordmark typewriter
   4. Tab switcher + 3D flip card
   5. Password show/hide toggle
   6. Password strength meter
   7. Form validation
   ============================================================= */


/* ===========================================================
   1.  BACKGROUND CANVAS
   =========================================================== */
(function () {
    'use strict';

    const canvas = document.getElementById('login-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;

    const PARTICLE_COUNT = 60;
    const MAX_DIST       = 120;
    const COLORS         = ['#378f84', '#5ecec4', '#c9913a', '#aac2c5'];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function createParticles() {
        particles = Array.from({ length: PARTICLE_COUNT }, function () {
            return {
                x: rand(0, W), y: rand(0, H),
                vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
                r: rand(1, 2.4),
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
            };
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(94,206,196,' + (1 - dist / MAX_DIST) * 0.15 + ')';
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(function (p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.6;
            ctx.fill();
            ctx.globalAlpha = 1;

            p.x += p.vx; p.y += p.vy;
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

})();


/* ===========================================================
   2.  TERMINAL CODE-RAIN BACKGROUND
   =========================================================== */
(function () {
    'use strict';

    const wrap = document.getElementById('terminal-bg');
    if (!wrap) return;

    const SNIPPETS = [
        "const user = await auth.signIn(email);",
        "function buildCareer(skills) {",
        "  return skills.map(s => master(s));",
        "}",
        "class Student extends Learner {",
        "  constructor(name) {",
        "    super(name);",
        "    this.progress = 0;",
        "  }",
        "}",
        "import { BBright } from './hub';",
        "export default function Apply() {",
        "  const [step, setStep] = useState(1);",
        "  return <Form step={step} />;",
        "}",
        "git commit -m 'launch career'",
        "npm run build:future",
        "SELECT * FROM students",
        "WHERE status = 'thriving';",
        "while (learning) { grow(); }",
        "try {",
        "  await applyToProgramme();",
        "} catch (doubt) {",
        "  ignore(doubt);",
        "}",
        "const success = true;",
        "// 2,400+ graduates and counting",
        "<Hub vision='bright' />",
        "deploy(yourFuture);"
    ];

    function buildColumn() {
        const col = document.createElement('div');
        col.className = 'terminal-bg__col';

        const lineCount = 18 + Math.floor(Math.random() * 10);
        const lines = [];
        for (let i = 0; i < lineCount; i++) {
            lines.push(SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)]);
        }
        col.textContent = lines.join('\n');

        col.style.left = Math.random() * 100 + '%';
        col.style.animationDuration = (28 + Math.random() * 22) + 's';
        col.style.animationDelay = (-Math.random() * 30) + 's';

        return col;
    }

    const COLUMN_COUNT = window.innerWidth < 700 ? 5 : 9;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COLUMN_COUNT; i++) {
        frag.appendChild(buildColumn());
    }
    wrap.appendChild(frag);

})();


/* ===========================================================
   3.  WORDMARK TYPEWRITER — "B Bright Tech Hub"
   =========================================================== */
(function () {
    'use strict';

    const el = document.getElementById('wordmark-type');
    if (!el) return;

    const FULL_TEXT = 'B Bright Tech Hub';
    const TYPE_SPEED = 90;
    let i = 0;

    function typeNext() {
        if (i <= FULL_TEXT.length) {
            el.textContent = FULL_TEXT.slice(0, i);
            i++;
            setTimeout(typeNext, TYPE_SPEED);
        }
        /* stays fully typed — cursor keeps blinking via CSS */
    }

    setTimeout(typeNext, 400);

})();


/* ===========================================================
   4.  TAB SWITCHER + FLIP CARD
   =========================================================== */
(function () {
    'use strict';

    const tabLogin    = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const tabsWrap    = document.querySelector('.card-tabs');
    const flipCard     = document.getElementById('flip-card');

    if (!tabLogin || !tabRegister || !flipCard) return;

    function showLogin() {
        flipCard.classList.remove('flipped');
        tabsWrap.classList.remove('show-register');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabRegister.setAttribute('aria-selected', 'false');
    }

    function showRegister() {
        flipCard.classList.add('flipped');
        tabsWrap.classList.add('show-register');
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        tabRegister.setAttribute('aria-selected', 'true');
        tabLogin.setAttribute('aria-selected', 'false');
    }

    tabLogin.addEventListener('click', showLogin);
    tabRegister.addEventListener('click', showRegister);

    /* expose globally so links like "Don't have an account? Sign up" can call it */
    window.bbthShowRegister = showRegister;
    window.bbthShowLogin    = showLogin;

})();


/* ===========================================================
   5.  PASSWORD SHOW / HIDE TOGGLE
   =========================================================== */
(function () {
    'use strict';

    document.querySelectorAll('.field__toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const targetId = btn.getAttribute('data-target');
            const input    = document.getElementById(targetId);
            if (!input) return;

            const icon = btn.querySelector('i');
            const isHidden = input.type === 'password';

            input.type = isHidden ? 'text' : 'password';
            btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');

            if (icon) {
                icon.classList.toggle('fa-eye', !isHidden);
                icon.classList.toggle('fa-eye-slash', isHidden);
            }
        });
    });

})();


/* ===========================================================
   6.  PASSWORD STRENGTH METER
   =========================================================== */
(function () {
    'use strict';

    const pwInput = document.getElementById('reg-password');
    const fillEl  = document.getElementById('pw-fill');
    const labelEl = document.getElementById('pw-label');

    if (!pwInput || !fillEl || !labelEl) return;

    const LEVELS = [
        { min: 0, width: '0%',   color: 'transparent',          label: '' },
        { min: 1, width: '25%',  color: '#e03c3c',               label: 'Weak' },
        { min: 2, width: '50%',  color: '#e0a83c',               label: 'Fair' },
        { min: 3, width: '75%',  color: '#c9913a',               label: 'Good' },
        { min: 4, width: '100%', color: '#378f84',               label: 'Strong' }
    ];

    function scorePassword(value) {
        let score = 0;
        if (value.length >= 8)               score++;
        if (/[A-Z]/.test(value))             score++;
        if (/[0-9]/.test(value))             score++;
        if (/[^A-Za-z0-9]/.test(value))      score++;
        return score;
    }

    pwInput.addEventListener('input', function () {
        const value = pwInput.value;

        if (value.length === 0) {
            fillEl.style.width = '0%';
            labelEl.textContent = '';
            return;
        }

        const score = Math.min(scorePassword(value), 4);
        const level = LEVELS[score] || LEVELS[1];

        fillEl.style.width      = level.width;
        fillEl.style.background = level.color;
        labelEl.textContent     = level.label;
        labelEl.style.color     = level.color;
    });

})();


/* ===========================================================
   7.  FORM VALIDATION
   =========================================================== */
(function () {
    'use strict';

    function showError(fieldEl, message) {
        fieldEl.classList.add('has-error');
        const errEl = fieldEl.querySelector('.field__error');
        if (errEl) errEl.textContent = message;
    }

    function clearError(fieldEl) {
        fieldEl.classList.remove('has-error');
        const errEl = fieldEl.querySelector('.field__error');
        if (errEl) errEl.textContent = '';
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function simulateSubmit(button, onDone) {
        button.classList.add('loading');
        setTimeout(function () {
            button.classList.remove('loading');
            onDone();
        }, 1400);
    }

    /* ---- LOGIN FORM ---- */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let valid = true;

            const emailField = document.getElementById('field-email-login');
            const pwField    = document.getElementById('field-pw-login');
            const emailVal   = document.getElementById('login-email').value.trim();
            const pwVal      = document.getElementById('login-password').value;

            clearError(emailField);
            clearError(pwField);

            if (!emailVal || !isValidEmail(emailVal)) {
                showError(emailField, 'Enter a valid email address');
                valid = false;
            }

            if (!pwVal) {
                showError(pwField, 'Password is required');
                valid = false;
            }

            if (!valid) return;

            const submitBtn = document.getElementById('login-submit');
            simulateSubmit(submitBtn, function () {
                /* Replace this with your real authentication call */
                alert('Login successful! (demo — wire this up to your backend)');
            });
        });
    }

    /* ---- REGISTER FORM ---- */
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let valid = true;

            const firstField = document.getElementById('reg-firstname').closest('.field');
            const lastField  = document.getElementById('reg-lastname').closest('.field');
            const emailField = document.getElementById('reg-email').closest('.field');
            const pwField    = document.getElementById('reg-password').closest('.field');
            const termsCheck = document.getElementById('reg-terms');
            const termsError = document.getElementById('terms-error');

            const firstVal = document.getElementById('reg-firstname').value.trim();
            const lastVal  = document.getElementById('reg-lastname').value.trim();
            const emailVal = document.getElementById('reg-email').value.trim();
            const pwVal    = document.getElementById('reg-password').value;

            [firstField, lastField, emailField, pwField].forEach(clearError);
            if (termsError) termsError.textContent = '';

            if (!firstVal) { showError(firstField, 'Required'); valid = false; }
            if (!lastVal)  { showError(lastField, 'Required'); valid = false; }

            if (!emailVal || !isValidEmail(emailVal)) {
                showError(emailField, 'Enter a valid email address');
                valid = false;
            }

            if (!pwVal || pwVal.length < 8) {
                showError(pwField, 'Use at least 8 characters');
                valid = false;
            }

            if (!termsCheck.checked) {
                if (termsError) termsError.textContent = 'You must accept the terms to continue';
                valid = false;
            }

            if (!valid) return;

            const submitBtn = document.getElementById('register-submit');
            simulateSubmit(submitBtn, function () {
                /* Replace this with your real registration call */
                alert('Account created! (demo — wire this up to your backend)');
            });
        });
    }

})();