/* =============================================================
   programmes.js — Catalogue search & filter
   Runs alongside index.js (navbar, scroll-top already wired there)
   ============================================================= */
(function () {
    'use strict';

    const searchInput   = document.getElementById('prog-search-input');
    const categoryChips = Array.from(document.querySelectorAll('.filter-chip[data-filter="category"]'));
    const levelSelect   = document.getElementById('level-filter');
    const cards         = Array.from(document.querySelectorAll('.cat-card'));
    const resultsCount  = document.getElementById('filter-results-count');
    const emptyState    = document.getElementById('catalogue-empty');
    const grid          = document.getElementById('catalogue-grid');
    const clearBtn       = document.getElementById('btn-clear-filters');

    if (!grid) return;

    let activeCategory = 'all';
    let activeLevel    = 'all';
    let searchTerm     = '';

    function applyFilters() {
        let visibleCount = 0;

        cards.forEach(function (card) {
            const cat   = card.dataset.category || '';
            const level = card.dataset.level || '';
            const name  = (card.dataset.name || '').toLowerCase();
            const title = card.querySelector('h3').textContent.toLowerCase();

            const matchesCategory = activeCategory === 'all' || cat === activeCategory;
            const matchesLevel    = activeLevel === 'all' || level === activeLevel;
            const matchesSearch   = searchTerm === '' ||
                name.includes(searchTerm) ||
                title.includes(searchTerm);

            const isVisible = matchesCategory && matchesLevel && matchesSearch;
            card.classList.toggle('is-hidden', !isVisible);

            if (isVisible) visibleCount++;
        });

        /* results count text */
        if (resultsCount) {
            resultsCount.textContent = visibleCount === cards.length
                ? 'Showing all ' + cards.length + ' programmes'
                : 'Showing ' + visibleCount + ' of ' + cards.length + ' programmes';
        }

        /* empty state */
        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
            grid.style.display = visibleCount === 0 ? 'none' : 'grid';
        }
    }

    /* ---- category chips ---- */
    categoryChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            categoryChips.forEach(function (c) { c.classList.remove('active'); });
            chip.classList.add('active');
            activeCategory = chip.dataset.value;
            applyFilters();
        });
    });

    /* ---- level select ---- */
    if (levelSelect) {
        levelSelect.addEventListener('change', function () {
            activeLevel = levelSelect.value;
            applyFilters();
        });
    }

    /* ---- search input (debounced) ---- */
    let searchTimer = null;
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function () {
                searchTerm = searchInput.value.trim().toLowerCase();
                applyFilters();
            }, 180);
        });
    }

    /* ---- clear filters button ---- */
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            activeCategory = 'all';
            activeLevel    = 'all';
            searchTerm     = '';

            categoryChips.forEach(function (c) { c.classList.remove('active'); });
            categoryChips[0] && categoryChips[0].classList.add('active');

            if (levelSelect)  levelSelect.value  = 'all';
            if (searchInput)  searchInput.value  = '';

            applyFilters();
        });
    }

    /* initialise */
    applyFilters();

})();