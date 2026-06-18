/* =============================================================
   apply.js — B Bright Tech Hub Application Page (v2)
   1. Terminal code-rain background
   2. Wordmark typewriter
   3. Path selector (student vs careers)
   4. Multi-step navigation per panel
   5. Per-step validation
   6. Review summary builder
   7. Submit handling
   ============================================================= */


/* ===========================================================
   1.  TERMINAL CODE-RAIN BACKGROUND
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
        "class Applicant extends Hopeful {",
        "  constructor(name) {",
        "    super(name);",
        "    this.status = 'pending';",
        "  }",
        "}",
        "import { BBright } from './hub';",
        "export default function Apply() {",
        "  const [step, setStep] = useState(1);",
        "  return <Form step={step} />;",
        "}",
        "git commit -m 'submit application'",
        "npm run build:future",
        "SELECT * FROM applicants",
        "WHERE status = 'accepted';",
        "while (learning) { grow(); }",
        "try {",
        "  await submitApplication();",
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
   2.  WORDMARK TYPEWRITER — "B Bright Tech Hub"
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
    }

    setTimeout(typeNext, 400);

})();


/* ===========================================================
   3.  PATH SELECTOR + MULTI-STEP FORMS
   =========================================================== */
(function () {
    'use strict';

    const pathSelect  = document.getElementById('path-select');
    const apployHeader = document.getElementById('apply-header');
    const panelLearn   = document.getElementById('panel-learn');
    const panelWork    = document.getElementById('panel-work');
    const successCard  = document.getElementById('success-card');
    const successTitle = document.getElementById('success-title');
    const successText  = document.getElementById('success-text');

    const btnPathLearn = document.getElementById('path-learn');
    const btnPathWork  = document.getElementById('path-work');


    /* ----------------------------------------------------------
       PATH SWITCHING
    ---------------------------------------------------------- */
    function showPanel(panel) {
        pathSelect.hidden = true;
        panelLearn.hidden = true;
        panelWork.hidden  = true;
        panel.hidden = false;
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showPathSelect() {
        panelLearn.hidden = true;
        panelWork.hidden  = true;
        successCard.hidden = true;
        pathSelect.hidden = false;
        pathSelect.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (btnPathLearn) btnPathLearn.addEventListener('click', function () { showPanel(panelLearn); });
    if (btnPathWork)  btnPathWork.addEventListener('click', function () { showPanel(panelWork); });

    document.querySelectorAll('[data-back]').forEach(function (btn) {
        btn.addEventListener('click', showPathSelect);
    });


    /* ----------------------------------------------------------
       FIELD ERROR HELPERS
    ---------------------------------------------------------- */
    function showError(fieldEl, message) {
        if (!fieldEl) return;
        fieldEl.classList.add('has-error');
        const errEl = fieldEl.querySelector('.field__error');
        if (errEl) errEl.textContent = message;
    }

    function clearError(fieldEl) {
        if (!fieldEl) return;
        fieldEl.classList.remove('has-error');
        const errEl = fieldEl.querySelector('.field__error');
        if (errEl) errEl.textContent = '';
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }


    /* ----------------------------------------------------------
       GENERIC MULTI-STEP CONTROLLER
       One instance per form (student / careers)
    ---------------------------------------------------------- */
    function initStepper(config) {
        const form        = document.getElementById(config.formId);
        if (!form) return;

        const panel        = form.closest('.path-panel');
        const steps         = Array.from(panel.querySelectorAll('.step'));
        const progressSteps = Array.from(panel.querySelectorAll('.progress__step'));
        const progressLines = Array.from(panel.querySelectorAll('.progress__line'));
        const btnBack       = form.querySelector('[data-prev]');
        const btnNext        = form.querySelector('[data-next]');
        const btnSubmit       = form.querySelector('[data-submit]');
        const reviewList     = document.getElementById(config.reviewListId);

        const TOTAL_STEPS = steps.length;
        let currentStep = 1;

        function goToStep(stepNum) {
            steps.forEach(function (step) {
                step.classList.toggle('active', Number(step.dataset.step) === stepNum);
            });

            progressSteps.forEach(function (ps) {
                const n = Number(ps.dataset.step);
                ps.classList.toggle('active', n === stepNum);
                ps.classList.toggle('done', n < stepNum);
            });

            progressLines.forEach(function (line, i) {
                line.classList.toggle('filled', (i + 1) < stepNum);
            });

            btnBack.disabled = stepNum === 1;

            if (stepNum === TOTAL_STEPS) {
                btnNext.hidden   = true;
                btnSubmit.hidden = false;
                config.buildReview(reviewList, collectFormData(form));
            } else {
                btnNext.hidden   = false;
                btnSubmit.hidden = true;
            }

            currentStep = stepNum;
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        btnNext.addEventListener('click', function () {
            if (!config.validateStep(currentStep, form, showError, clearError, isValidEmail)) return;
            if (currentStep < TOTAL_STEPS) goToStep(currentStep + 1);
        });

        btnBack.addEventListener('click', function () {
            if (currentStep > 1) goToStep(currentStep - 1);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!config.validateStep(TOTAL_STEPS, form, showError, clearError, isValidEmail)) return;

            btnSubmit.classList.add('loading');

            /* Replace this timeout with your real backend submission */
            setTimeout(function () {
                btnSubmit.classList.remove('loading');
                form.hidden = true;
                panel.querySelector('.progress').hidden = true;
                panel.querySelector('.panel-back').hidden = true;
                successTitle.textContent = config.successTitle;
                successText.textContent  = config.successText;
                successCard.hidden = false;
                panelLearn.hidden = true;
                panelWork.hidden  = true;
                successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1400);
        });

        /* expose reset so path-switch can restore form to step 1 */
        return { reset: function () { goToStep(1); form.hidden = false; panel.querySelector('.progress').hidden = false; panel.querySelector('.panel-back').hidden = false; } };
    }

    function collectFormData(form) {
        const fd = new FormData(form);
        const obj = {};
        fd.forEach(function (value, key) { obj[key] = value; });
        return obj;
    }


    /* ----------------------------------------------------------
       STUDENT FORM CONFIG
    ---------------------------------------------------------- */
    const PROGRAMME_LABELS = {
        'web-development':    'Web Development',
        'ai-data-science':    'AI & Data Science',
        'cybersecurity':      'Cybersecurity',
        'mobile-development': 'Mobile Development',
        'cloud-devops':       'Cloud & DevOps',
        'not-sure':           'Not Sure Yet'
    };

    const TRACK_LABELS = {
        'july-of-tech':   'July of Tech',
        'summer-classes': 'Summer Classes',
        'after-school':   'After School'
    };

    const learnStepper = initStepper({
        formId: 'form-learn',
        reviewListId: 'l-review-list',
        successTitle: 'Application Sent!',
        successText: "Thanks for applying to B Bright Tech Hub. Check your inbox — we'll follow up within 48 hours to schedule your intro call.",

        validateStep: function (stepNum, form, showError, clearError, isValidEmail) {
            let valid = true;

            if (stepNum === 1) {
                const fFirst = document.getElementById('l-f-firstname');
                const fLast  = document.getElementById('l-f-lastname');
                const fEmail = document.getElementById('l-f-email');
                const fPhone = document.getElementById('l-f-phone');
                const fAge   = document.getElementById('l-f-age');

                [fFirst, fLast, fEmail, fPhone, fAge].forEach(clearError);

                if (!document.getElementById('l-firstname').value.trim()) { showError(fFirst, 'Required'); valid = false; }
                if (!document.getElementById('l-lastname').value.trim())  { showError(fLast, 'Required'); valid = false; }

                const emailVal = document.getElementById('l-email').value.trim();
                if (!emailVal || !isValidEmail(emailVal)) { showError(fEmail, 'Enter a valid email'); valid = false; }

                if (!document.getElementById('l-phone').value.trim()) { showError(fPhone, 'Required'); valid = false; }
                if (!document.getElementById('l-age').value)          { showError(fAge, 'Please select your age range'); valid = false; }
            }

            if (stepNum === 2) {
                const errProgramme = document.getElementById('l-err-programme');
                const fTrack        = document.getElementById('l-f-track');
                clearError(fTrack);

                const checkedProgramme = form.querySelector('input[name="programme"]:checked');
                if (!checkedProgramme) {
                    errProgramme.textContent = 'Please select a programme';
                    valid = false;
                } else {
                    errProgramme.textContent = '';
                }

                if (!document.getElementById('l-track').value) {
                    showError(fTrack, 'Please select a track');
                    valid = false;
                }
            }

            if (stepNum === 3) {
                const termsCheck = document.getElementById('l-terms');
                const errEl = document.getElementById('l-err-terms');
                if (!termsCheck.checked) {
                    errEl.textContent = 'You must accept the terms to continue';
                    valid = false;
                } else {
                    errEl.textContent = '';
                }
            }

            return valid;
        },

        buildReview: function (reviewList, data) {
            const rows = [
                { label: 'Name',      value: data.firstname + ' ' + data.lastname },
                { label: 'Email',     value: data.email },
                { label: 'Phone',     value: data.phone },
                { label: 'Age range', value: data.age },
                { label: 'Programme', value: PROGRAMME_LABELS[data.programme] || '—' },
                { label: 'Track',     value: TRACK_LABELS[data.track] || '—' }
            ];

            reviewList.innerHTML = rows.map(function (row) {
                return (
                    '<div class="review-item">' +
                        '<span class="review-item__label">' + row.label + '</span>' +
                        '<span class="review-item__value">' + escapeHtml(row.value || '—') + '</span>' +
                    '</div>'
                );
            }).join('');
        }
    });


    /* ----------------------------------------------------------
       CAREERS FORM CONFIG
    ---------------------------------------------------------- */
    const ROLE_LABELS = {
        'instructor': 'Instructor',
        'mentor':     'Mentor',
        'curriculum': 'Curriculum Designer',
        'operations': 'Operations',
        'marketing':  'Marketing',
        'other':      'Other'
    };

    const workStepper = initStepper({
        formId: 'form-work',
        reviewListId: 'w-review-list',
        successTitle: 'Application Received!',
        successText: "Thanks for your interest in joining B Bright Tech Hub. Our team will review your application and reach out within 5 business days.",

        validateStep: function (stepNum, form, showError, clearError, isValidEmail) {
            let valid = true;

            if (stepNum === 1) {
                const fFirst = document.getElementById('w-f-firstname');
                const fLast  = document.getElementById('w-f-lastname');
                const fEmail = document.getElementById('w-f-email');
                const fPhone = document.getElementById('w-f-phone');

                [fFirst, fLast, fEmail, fPhone].forEach(clearError);

                if (!document.getElementById('w-firstname').value.trim()) { showError(fFirst, 'Required'); valid = false; }
                if (!document.getElementById('w-lastname').value.trim())  { showError(fLast, 'Required'); valid = false; }

                const emailVal = document.getElementById('w-email').value.trim();
                if (!emailVal || !isValidEmail(emailVal)) { showError(fEmail, 'Enter a valid email'); valid = false; }

                if (!document.getElementById('w-phone').value.trim()) { showError(fPhone, 'Required'); valid = false; }
            }

            if (stepNum === 2) {
                const errRole = document.getElementById('w-err-role');
                const checkedRole = form.querySelector('input[name="role"]:checked');
                if (!checkedRole) {
                    errRole.textContent = 'Please select a role';
                    valid = false;
                } else {
                    errRole.textContent = '';
                }
            }

            if (stepNum === 3) {
                const termsCheck = document.getElementById('w-terms');
                const errEl = document.getElementById('w-err-terms');
                if (!termsCheck.checked) {
                    errEl.textContent = 'You must accept the terms to continue';
                    valid = false;
                } else {
                    errEl.textContent = '';
                }
            }

            return valid;
        },

        buildReview: function (reviewList, data) {
            const rows = [
                { label: 'Name',      value: data.firstname + ' ' + data.lastname },
                { label: 'Email',     value: data.email },
                { label: 'Phone',     value: data.phone },
                { label: 'Portfolio', value: data.linkedin || '—' },
                { label: 'Role',      value: ROLE_LABELS[data.role] || '—' }
            ];

            reviewList.innerHTML = rows.map(function (row) {
                return (
                    '<div class="review-item">' +
                        '<span class="review-item__label">' + row.label + '</span>' +
                        '<span class="review-item__value">' + escapeHtml(row.value || '—') + '</span>' +
                    '</div>'
                );
            }).join('');
        }
    });

})();