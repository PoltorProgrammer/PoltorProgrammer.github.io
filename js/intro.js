document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTypewriter();
    loadBlogPreview();
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
        'Biologist & Data Scientist',
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

/* ── Blog preview (home page) ───────────────────────────── */
async function loadBlogPreview() {
    const grid    = document.getElementById('home-blog-grid');
    const loading = document.getElementById('home-blog-loading');
    if (!grid) return;

    try {
        const res = await fetch('posts/blogs/index.json');
        if (!res.ok) throw new Error('index not found');
        const ids = await res.json();

        const settled = await Promise.allSettled(ids.map(id => loadBlogPost(id)));

        const posts = settled
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 2);

        if (loading) loading.remove();

        if (posts.length === 0) {
            grid.innerHTML = '';
            return;
        }

        grid.innerHTML = posts.map(buildBlogCard).join('');
    } catch {
        if (loading) loading.remove();
        grid.innerHTML = '';
    }
}

async function loadBlogPost(id) {
    try {
        const res = await fetch(`posts/blogs/${id}.md`);
        if (!res.ok) return null;
        const text = await res.text();
        const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        const metadata = {};
        if (match) {
            match[1].split('\n').forEach(line => {
                const idx = line.indexOf(':');
                if (idx === -1) return;
                const key = line.slice(0, idx).trim();
                let   val = line.slice(idx + 1).trim();
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
                if (val.startsWith('[') && val.endsWith(']')) {
                    try { val = JSON.parse(val.replace(/'/g, '"')); }
                    catch { val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, '')); }
                }
                metadata[key] = val;
            });
        }
        return { id, ...metadata };
    } catch {
        return null;
    }
}

function buildBlogCard(post) {
    const { id, title = 'Untitled', subtitle = '', date = '', tags = [], cover_color = 'default' } = post;
    const dateDisplay = date ? (() => {
        try {
            return new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch { return date; }
    })() : '';
    const tagsHtml = Array.isArray(tags) && tags.length
        ? `<div class="blog-tags">${tags.slice(0, 4).map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>`
        : '';
    return `
        <a href="post.html#${id}" class="blog-card">
            <div class="blog-card-accent ${cover_color}"></div>
            <div class="blog-card-body">
                ${dateDisplay ? `<time class="blog-date">${dateDisplay}</time>` : ''}
                <h2 class="blog-card-title">${title}</h2>
                ${subtitle ? `<p class="blog-card-subtitle">${subtitle}</p>` : ''}
                ${tagsHtml}
                <span class="btn-read-more">Read post <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>`;
}
