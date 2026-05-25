document.addEventListener('DOMContentLoaded', () => {
    initNav();
    loadPost();
});

/* ── Navigation ─────────────────────────────────────────── */
function initNav() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav?.classList.toggle('open');
    });
}

/* ── Load & render post ──────────────────────────────────── */
async function loadPost() {
    const id = window.location.hash.slice(1).split('#')[0];

    if (!id) { window.location.href = 'blog.html'; return; }

    try {
        const res = await fetch(`posts/blogs/${id}.md`);
        if (!res.ok) throw new Error('not found');
        renderPost(id, await res.text());
    } catch {
        document.getElementById('post-body').innerHTML = `
            <div class="error-state">
                <div class="error-icon">✍️</div>
                <h2>Post Not Found</h2>
                <p>The requested post could not be loaded.</p>
                <a href="blog.html" class="btn btn-primary">Return to Blog</a>
            </div>`;
    }
}

/* ── Frontmatter parser ─────────────────────────────────── */
function parseFrontmatter(text) {
    const match    = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const metadata = {};
    let   content  = text;

    if (match) {
        content = match[2];
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

    return { metadata, content };
}

/* ── Render ─────────────────────────────────────────────── */
function renderPost(id, rawText) {
    const { metadata, content } = parseFrontmatter(rawText);

    document.title = `${metadata.title || 'Post'} — PoltorProgrammer`;

    const coverColor = metadata.cover_color || 'default';

    const accentMap = {
        nature:   '#2d6a4f',
        ai:       '#1a4a6a',
        medical:  '#2e4a85',
        language: '#b59110',
        designs:  '#b55b10',
        tools:    '#3d4f63',
        games:    '#7b2d7a',
        default:  '#476573',
    };
    const accentMapDark = {
        nature:   '#52b77e',
        ai:       '#4a9fd4',
        medical:  '#6a8fd4',
        language: '#e0c040',
        designs:  '#e08840',
        tools:    '#7da5b0',
        games:    '#c060be',
        default:  '#8fb8c3',
    };
    document.documentElement.style.setProperty('--entry-accent',      accentMap[coverColor]     || accentMap.default);
    document.documentElement.style.setProperty('--entry-accent-dark', accentMapDark[coverColor] || accentMapDark.default);

    const header = document.getElementById('post-cover');
    if (header) {
        header.className = 'project-header';
        header.classList.add(`cover-${coverColor}`);
    }

    setText('post-title',    metadata.title    || 'Untitled');
    setText('post-subtitle', metadata.subtitle || '');

    const metaEl = document.getElementById('post-meta');
    if (metaEl) {
        const dateHtml = metadata.date
            ? `<time class="post-date">${formatDate(metadata.date)}</time>`
            : '';
        const tagsHtml = Array.isArray(metadata.tags) && metadata.tags.length
            ? `<div class="post-tags">${metadata.tags.map(t => `<span class="post-tag">${t}</span>`).join('')}</div>`
            : '';
        metaEl.innerHTML = dateHtml + tagsHtml;
    }

    const relatedEl = document.getElementById('post-related');
    if (relatedEl && Array.isArray(metadata.projects) && metadata.projects.length) {
        const linksHtml = metadata.projects.map(pid => {
            const label = pid.replace(/-/g, ' ');
            return `<a href="project.html#${pid}" class="post-project-link">
                <i class="fas fa-seedling"></i>${label}
            </a>`;
        }).join('');
        relatedEl.innerHTML = `
            <p class="post-related-title">Related Repositories</p>
            <div class="post-related-links">${linksHtml}</div>`;
        relatedEl.style.display = '';
    } else if (relatedEl) {
        relatedEl.style.display = 'none';
    }

    const bodyEl = document.getElementById('post-body');
    if (bodyEl) {
        if (typeof marked === 'undefined') {
            bodyEl.innerHTML = `<p style="color:var(--text-light)">Markdown renderer unavailable.</p>`;
            return;
        }

        let html = marked.parse(content);

        html = html.replace(
            /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
            (_, type, text) =>
                `<div class="alert-block alert-${type.toLowerCase()}">
                    <span class="alert-label">${type}</span>
                    <p>${text.trim()}</p>
                </div>`
        );

        bodyEl.innerHTML = html;

        initToc('post-body', 'toc-sidebar', id);

        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(bodyEl, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }
}

function formatDate(dateStr) {
    try {
        const d = new Date(dateStr + 'T12:00:00Z');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}
