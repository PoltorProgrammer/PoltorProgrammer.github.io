document.addEventListener('DOMContentLoaded', () => {
    initNav();
    loadProject();
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

/* ── Load & render project ──────────────────────────────── */
async function loadProject() {
    const id = window.location.hash.slice(1);

    if (!id) { window.location.href = 'garden.html'; return; }

    try {
        const res = await fetch(`projects/${id}.md`);
        if (!res.ok) throw new Error('not found');
        renderProject(id, await res.text());
    } catch {
        document.getElementById('project-body').innerHTML = `
            <div class="error-state">
                <div class="error-icon">🌿</div>
                <h2>Project Not Found</h2>
                <p>The requested project could not be loaded.</p>
                <a href="garden.html" class="btn btn-primary">Return to Garden</a>
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
function renderProject(id, rawText) {
    const { metadata, content } = parseFrontmatter(rawText);

    document.title = `${metadata.title || 'Project'} — PoltorProgrammer`;

    // Support single category string or array of categories
    const categoriesArray = Array.isArray(metadata.category)
        ? metadata.category.map(c => String(c).toLowerCase().trim())
        : [String(metadata.category || 'tools').toLowerCase().trim()];

    const primaryCat = categoriesArray[0] || 'tools';

    // Category accent color — drives bold text colour in the markdown body
    const accentMap = {
        nature:    '#2d6a4f',
        natural:   '#2d6a4f',
        botanical: '#2d6a4f',
        botanics:  '#2d6a4f',
        ai:        '#1a4a6a',
        medical:   '#2e4a85',
        language:  '#b59110',
        lenguage:  '#b59110',
        designs:   '#b55b10',
        tools:     '#3d4f63',
        blogs:     '#6f959e',
        games:     '#7b2d7a',
    };
    const accent = accentMap[primaryCat] || '#223440';
    document.documentElement.style.setProperty('--entry-accent', accent);

    // Cover header class
    const header = document.getElementById('project-cover');
    if (header) {
        if (metadata.cover_image) {
            header.style.backgroundImage = `url(${metadata.cover_image})`;
            header.classList.add('has-image');
        } else {
            // Remove any old cover classes just in case
            header.className = 'project-header';
            header.classList.add(`cover-${primaryCat}`);
        }
    }

    setText('project-title',    metadata.title    || 'Untitled');
    setText('project-subtitle', metadata.subtitle || '');

    // Badges
    const badgesEl = document.getElementById('project-badges');
    if (badgesEl) {
        const isPrivate = (metadata.visibility || '').toLowerCase() === 'private';
        const visHtml   = `<span class="badge ${isPrivate ? 'badge-private' : 'badge-public'}">${isPrivate ? '🔒 Private' : '🌐 Public'}</span>`;
        
        // Show category labels
        const categoryLabels = {
            nature:    'Natural',
            natural:   'Natural',
            botanical: 'Botanics',
            botanics:  'Botanics',
            ai:        'AI & Data',
            medical:   'Medical',
            language:  'Lenguage',
            designs:   'Designs',
            tools:     'Tools',
            blogs:     'Blogs',
            games:     'Games'
        };
        const categoryHtml = categoriesArray.map(c => {
            const lbl = categoryLabels[c] || c;
            return `<span class="badge badge-category">${lbl}</span>`;
        }).join('');

        const statusHtml = metadata.status
            ? `<span class="badge badge-status">${metadata.status}</span>`
            : '';
        badgesEl.innerHTML = visHtml + categoryHtml + statusHtml;
    }

    // Tech stack
    const techEl = document.getElementById('project-tech');
    if (techEl && Array.isArray(metadata.tech_stack)) {
        techEl.innerHTML = metadata.tech_stack
            .map(t => `<span class="tech-pill">${t}</span>`)
            .join('');
    }

    // Action buttons
    const actionsEl = document.getElementById('project-actions');
    if (actionsEl) {
        let html = '';
        if (metadata.github_url) {
            html += `<a href="${metadata.github_url}" target="_blank" class="btn-action btn-git"><i class="fab fa-github"></i> Source Code</a>`;
        }
        if (metadata.demo_url) {
            html += `<a href="${metadata.demo_url}" target="_blank" class="btn-action btn-demo"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
        }
        actionsEl.innerHTML = html;
    }

    // Markdown body
    const bodyEl = document.getElementById('project-body');
    if (bodyEl) {
        if (typeof marked === 'undefined') {
            bodyEl.innerHTML = `<p style="color:var(--text-light)">Markdown renderer unavailable.</p>`;
            return;
        }

        let html = marked.parse(content);

        // GitHub-style alert blocks
        html = html.replace(
            /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
            (_, type, text) =>
                `<div class="alert-block alert-${type.toLowerCase()}">
                    <span class="alert-label">${type}</span>
                    <p>${text.trim()}</p>
                </div>`
        );

        bodyEl.innerHTML = html;

        // Render mathematical formulas (LaTeX) using KaTeX auto-render
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

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}
