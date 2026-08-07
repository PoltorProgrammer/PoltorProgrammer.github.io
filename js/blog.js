const BLOG_INDEX = 'posts/blogs/index.json';
const BLOGS_DIR  = 'posts/blogs/';

let allPosts    = [];
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    initNav();
    await loadPosts();
    initSearch();
});

/* ── Navigation ─────────────────────────────────────────── */
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

/* ── Post loading ────────────────────────────────────────── */
async function loadPosts() {
    const grid    = document.getElementById('blog-grid');
    const loading = document.getElementById('blog-loading');

    try {
        const res = await fetch(BLOG_INDEX);
        if (!res.ok) throw new Error('index not found');
        const ids = await res.json();

        const settled = await Promise.allSettled(ids.map(loadPost));

        allPosts = settled
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value);

        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (loading) loading.remove();
        renderGrid();

    } catch (err) {
        console.error('Could not load posts:', err);
        if (loading) loading.innerHTML = '<p>Could not load posts.</p>';
    }
}

async function loadPost(id) {
    try {
        const res = await fetch(`${BLOGS_DIR}${id}.md`);
        if (!res.ok) return null;
        const text = await res.text();
        const { metadata } = parseFrontmatter(text);
        return { id, ...metadata };
    } catch {
        return null;
    }
}

/* ── Frontmatter parser ─────────────────────────────────── */
function parseFrontmatter(text) {
    const match    = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
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
            if (val === 'true')  val = true;
            if (val === 'false') val = false;
            metadata[key] = val;
        });
    }

    return { metadata };
}

/* ── Render grid ─────────────────────────────────────────── */
function renderGrid() {
    const grid      = document.getElementById('blog-grid');
    const noResults = document.getElementById('no-results');

    const filtered = allPosts.filter(p => {
        if (!searchQuery) return true;
        const haystack = [p.title, p.subtitle, ...(p.tags || [])].join(' ').toLowerCase();
        return haystack.includes(searchQuery);
    });

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        grid.innerHTML = '';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = filtered.map(buildCard).join('');
}

function buildCard(post) {
    const {
        id,
        title       = 'Untitled',
        subtitle    = '',
        date        = '',
        tags        = [],
        cover_color = 'default',
    } = post;

    const dateDisplay = date ? formatDate(date) : '';
    const tagsHtml = Array.isArray(tags) && tags.length
        ? `<div class="blog-tags">${tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}</div>`
        : '';

    const searchData = [title, subtitle, ...(tags || [])].join(' ').toLowerCase();

    return `
        <a href="post.html#${id}" class="blog-card" data-search="${searchData}">
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

function formatDate(dateStr) {
    try {
        const d = new Date(dateStr + 'T12:00:00Z');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

/* ── Search ─────────────────────────────────────────────── */
function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderGrid();
    });
}
