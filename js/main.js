const PROJECT_INDEX = 'posts/projects/index.json';
const PROJECTS_DIR  = 'posts/projects/';
const BLOG_INDEX    = 'posts/blogs/index.json';
const BLOGS_DIR     = 'posts/blogs/';

let allProjects  = [];
let projectToBlog = {};
let activeFilter = 'all';
let searchQuery  = '';

document.addEventListener('DOMContentLoaded', async () => {
    initNav();
    await Promise.all([loadProjects(), loadBlogMap()]);
    renderGrid();
    initFilters();
    initSearch();
    applyUrlFilter();
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

/* ── Blog map (projectId → blogPostId) ──────────────────── */
async function loadBlogMap() {
    try {
        const res = await fetch(BLOG_INDEX);
        if (!res.ok) return;
        const ids = await res.json();

        const settled = await Promise.allSettled(ids.map(async id => {
            const r = await fetch(`${BLOGS_DIR}${id}.md`);
            if (!r.ok) return null;
            const text = await r.text();
            const { metadata } = parseFrontmatter(text);
            return { id, projects: metadata.projects || [] };
        }));

        settled.forEach(r => {
            if (r.status !== 'fulfilled' || !r.value) return;
            const { id, projects } = r.value;
            (Array.isArray(projects) ? projects : []).forEach(pid => {
                if (!projectToBlog[pid]) projectToBlog[pid] = id;
            });
        });
    } catch {
        /* blog map is optional — silent fail */
    }
}

/* ── Project loading ────────────────────────────────────── */
async function loadProjects() {
    const loading = document.getElementById('grid-loading');

    try {
        const res = await fetch(PROJECT_INDEX);
        if (!res.ok) throw new Error('index not found');
        const ids = await res.json();

        const settled = await Promise.allSettled(ids.map(loadProject));

        allProjects = settled
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value);

        if (loading) loading.remove();

    } catch (err) {
        console.error('Could not load projects:', err);
        if (loading) loading.innerHTML = '<p>Could not load projects.</p>';
    }
}

async function loadProject(id) {
    try {
        const res = await fetch(`${PROJECTS_DIR}${id}.md`);
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

/* ── Render grid ────────────────────────────────────────── */
function renderGrid() {
    const grid      = document.getElementById('project-grid');
    const noResults = document.getElementById('no-results');

    const visible = allProjects.filter(p => !p.hidden);

    if (visible.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    grid.innerHTML = visible.map(buildCard).join('');
}

function buildCard(project) {
    const {
        id,
        title       = 'Untitled',
        subtitle    = '',
        cover_image,
        visibility  = 'public',
        category    = 'tools',
        tech_stack  = [],
    } = project;

    // Support single category string or array of categories
    const categoriesArray = Array.isArray(category)
        ? category.map(c => String(c).toLowerCase().trim())
        : [String(category || 'tools').toLowerCase().trim()];

    const primaryCat = categoriesArray[0] || 'tools';
    const isPrivate  = visibility.toLowerCase() === 'private';
    const visClass   = isPrivate ? 'badge-private' : 'badge-public';
    const visText    = isPrivate ? '🔒 Private' : '🌐 Public';
    const icon       = categoryIcon(primaryCat);

    const categoryBadgesHtml = categoriesArray.map(c => {
        const lbl = categoryLabel(c);
        return `<span class="badge badge-category">${lbl}</span>`;
    }).join('');

    const blogId    = projectToBlog[id];
    const blogBadge = blogId
        ? `<span class="badge badge-blog" onclick="event.preventDefault();event.stopPropagation();location.href='post.html#${blogId}'">📖 In context</span>`
        : '';

    const badges = `
        <div class="card-badges">
            <span class="badge ${visClass}">${visText}</span>
            ${categoryBadgesHtml}
        </div>`;

    const coverHTML = cover_image
        ? `<div class="card-cover" style="background-image:url('${cover_image}')">${badges}${blogBadge}</div>`
        : `<div class="card-cover">
               <div class="card-cover-gradient ${primaryCat}"></div>
               <span class="card-cover-icon">${icon}</span>
               ${badges}${blogBadge}
           </div>`;

    const techHTML = Array.isArray(tech_stack) && tech_stack.length
        ? `<div class="card-tech">${tech_stack.slice(0, 5).map(t => `<span class="tech-pill">${t}</span>`).join('')}</div>`
        : '';

    const searchData = [title, subtitle, ...(tech_stack || [])].join(' ').toLowerCase();
    const dataCategory = categoriesArray.join(',');

    return `
        <a href="project.html#${id}" class="project-card"
            data-category="${dataCategory}"
            data-search="${searchData}">
            ${coverHTML}
            <div class="card-body">
                <h3 class="card-title">${title}</h3>
                ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ''}
                ${techHTML}
                <span class="btn-read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </span>
            </div>
        </a>`;
}

/* ── Filters & search ───────────────────────────────────── */
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyFilters();
        });
    });
}

function initSearch() {
    document.getElementById('search-input').addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilters();
    });
}

function applyUrlFilter() {
    const param = new URLSearchParams(window.location.search).get('filter');
    if (!param) return;
    const btn = document.querySelector(`.filter-btn[data-filter="${param}"]`);
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = param;
    applyFilters();
}

function applyFilters() {
    const cards     = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');
    let   visible   = 0;

    cards.forEach(card => {
        const categories = card.dataset.category.split(',');
        let catMatch = activeFilter === 'all';
        if (!catMatch) {
            catMatch = categories.some(cat => {
                const c = cat.trim().toLowerCase();
                const f = activeFilter.trim().toLowerCase();
                if (f === 'nature' && (c === 'nature' || c === 'natural')) return true;
                if (f === 'language' && c === 'language') return true;
                return c === f;
            });
        }

        const searchMatch = !searchQuery || card.dataset.search.includes(searchQuery);
        const show        = catMatch && searchMatch;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    noResults.style.display = visible === 0 ? 'block' : 'none';
}

/* ── Helpers ────────────────────────────────────────────── */
function categoryLabel(cat) {
    const c = String(cat).toLowerCase().trim();
    return {
        nature:    'Natural',
        natural:   'Natural',
        botanical: 'Botanics',
        botanics:  'Botanics',
        ai:        'AI & Data',
        medical:   'Medical',
        language:  'Language',
        designs:   'Designs',
        tools:     'Tools',
        games:     'Games'
    }[c] || cat;
}

function categoryIcon(cat) {
    const c = String(cat).toLowerCase().trim();
    return {
        nature:    '🌿',
        natural:   '🌿',
        botanical: '🌿',
        botanics:  '🌿',
        ai:        '🧠',
        medical:   '🏥',
        language:  '🌏',
        designs:   '🎨',
        tools:     '🔧',
        games:     '🎮'
    }[c] || '📦';
}
