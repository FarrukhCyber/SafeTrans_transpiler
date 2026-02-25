// ============================================================
// SafeTrans Website — script.js
// ============================================================

// ── Navbar scroll effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNav();
});

// ── Active nav link ──────────────────────────────────────────
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}

// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ────────────────────────────────────────
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            counterObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-value[data-target]').forEach(el => counterObserver.observe(el));

// ── Bar chart animation ──────────────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.bar-fill').forEach(bar => {
                const w = bar.dataset.width;
                setTimeout(() => { bar.style.width = w + '%'; }, 200);
            });
            barObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.2 });

const tableWrap = document.querySelector('.table-wrap');
if (tableWrap) barObserver.observe(tableWrap);

// ── Methodology tabs ─────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// ── BibTeX copy ──────────────────────────────────────────────
const copyBtn = document.querySelector('.copy-btn');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const code = document.querySelector('.bib-code').innerText;
        navigator.clipboard.writeText(code).then(() => {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy BibTeX`;
            }, 2500);
        });
    });
}

// ── Stagger reveal children ──────────────────────────────────
document.querySelectorAll('.stats-grid, .pipeline-grid, .vuln-grid').forEach(grid => {
    const children = grid.querySelectorAll(':scope > *');
    children.forEach((child, i) => {
        child.style.transitionDelay = (i * 80) + 'ms';
        child.classList.add('reveal');
        revealObserver.observe(child);
    });
});
