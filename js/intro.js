document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTypewriter();
});

function initNav() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });
}

function initTypewriter() {
    const roles = [
        'Botanical Developer',
        'AI System Architect',
        'Full-Stack Programmer',
        'Open Source Creator',
    ];
    const el     = document.getElementById('typewriter');
    if (!el) return;

    let roleIdx  = 0;
    let charIdx  = 0;
    let deleting = false;

    function tick() {
        const current = roles[roleIdx];

        if (!deleting) {
            el.textContent = current.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(tick, 1600);
                return;
            }
        } else {
            el.textContent = current.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                roleIdx  = (roleIdx + 1) % roles.length;
            }
        }

        setTimeout(tick, deleting ? 48 : 88);
    }

    setTimeout(tick, 900);
}
