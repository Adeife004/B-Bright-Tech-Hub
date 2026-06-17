/* navbar.js — Navbar Interactions */

(function () {
    'use strict';

    const header      = document.querySelector('.site-header');
    const hamburger   = document.getElementById('hamburger');
    const navMenu     = document.getElementById('nav-menu');
    const dropdownLi  = document.getElementById('pages-dropdown');
    const dropdownBtn = dropdownLi && dropdownLi.querySelector('.navbar__dropdown-toggle');

    /* ---- Scroll: add .scrolled class to header ---- */
    function onScroll() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load


    /* ---- Hamburger toggle (mobile) ---- */
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            const isOpen = hamburger.classList.toggle('open');
            navMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }


    /* ---- Dropdown toggle ---- */
    if (dropdownLi && dropdownBtn) {
        dropdownBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = dropdownLi.classList.toggle('open');
            dropdownBtn.setAttribute('aria-expanded', isOpen);
        });

        /* close dropdown on outside click */
        document.addEventListener('click', function (e) {
            if (!dropdownLi.contains(e.target)) {
                dropdownLi.classList.remove('open');
                dropdownBtn.setAttribute('aria-expanded', 'false');
            }
        });

        /* close dropdown on Escape key */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                dropdownLi.classList.remove('open');
                dropdownBtn.setAttribute('aria-expanded', 'false');
                dropdownBtn.focus();
            }
        });
    }


    /* ---- Active link highlight ---- */
    const navLinks = document.querySelectorAll('.navbar__link');
    const currentPath = window.location.pathname;

    navLinks.forEach(function (link) {
        if (link.tagName === 'A' && link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });


    /* ---- Close mobile menu when a link is clicked ---- */
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger && hamburger.classList.remove('open');
                navMenu.classList.remove('open');
                hamburger && hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

})();