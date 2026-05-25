function initToc(bodyId, sidebarId, baseHash) {
    const body    = document.getElementById(bodyId);
    const sidebar = document.getElementById(sidebarId);
    if (!body || !sidebar) return;

    const headings = [...body.querySelectorAll('h1, h2, h3')];
    if (headings.length < 2) return;

    // Assign IDs and capture text before mutating DOM
    const seen = {};
    const headingData = headings.map(h => {
        const text = h.textContent.trim();
        if (!h.id) {
            let slug = text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            if (seen[slug]) { slug += `-${++seen[slug]}`; } else { seen[slug] = 1; }
            h.id = slug;
        }
        return { el: h, text, id: h.id };
    });

    // Append # anchor icon to each heading
    headingData.forEach(({ el, id }) => {
        const anchor = document.createElement('a');
        anchor.className = 'heading-anchor';
        anchor.href      = `#${baseHash}#${id}`;
        anchor.textContent = '#';
        anchor.addEventListener('click', e => {
            e.preventDefault();
            history.replaceState(null, '', `#${baseHash}#${id}`);
            navigator.clipboard?.writeText(location.href);
        });
        el.appendChild(anchor);
    });

    // Build ToC
    const levelMap = { H1: 1, H2: 2, H3: 3 };
    const items = headingData.map(({ el, text, id }) =>
        `<li><a class="toc-link" href="#${id}" data-level="${levelMap[el.tagName] || 1}">${text}</a></li>`
    ).join('');

    sidebar.innerHTML = `<p class="toc-title">On this page</p><ul class="toc-list">${items}</ul>`;

    const links = [...sidebar.querySelectorAll('.toc-link')];

    // ToC click: smooth scroll + update URL
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const headingId = link.getAttribute('href').slice(1);
            const target    = document.getElementById(headingId);
            if (target) {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
                history.replaceState(null, '', `#${baseHash}#${headingId}`);
            }
        });
    });

    // Active section tracking
    function update() {
        const scrollY = window.scrollY + 110;
        let active = headings[0];
        headings.forEach(h => { if (h.offsetTop <= scrollY) active = h; });
        links.forEach(l => l.classList.remove('active'));
        const activeLink = sidebar.querySelector(`.toc-link[href="#${active.id}"]`);
        if (activeLink) activeLink.classList.add('active');
        history.replaceState(null, '', `#${baseHash}#${active.id}`);
    }

    // Capture original hash before update() overwrites it via replaceState
    const hashParts = window.location.hash.slice(1).split('#');

    window.addEventListener('scroll', update, { passive: true });
    update();
    if (hashParts[1]) {
        const target = document.getElementById(hashParts[1]);
        if (target) {
            setTimeout(() => {
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
            }, 80);
        }
    }
}
