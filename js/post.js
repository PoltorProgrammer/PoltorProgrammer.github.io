document.addEventListener('DOMContentLoaded', () => {
    initNav();
    loadPost();
    initPdfModal();
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

/* ── PDF Modal Previews ────────────────────────────────── */
let pdfDoc = null;
const scale = 1.5;

function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve();
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            resolve();
        };
        document.head.appendChild(script);
    });
}

function renderPageOnCanvas(num, targetCanvas) {
    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale: scale });
        const context = targetCanvas.getContext('2d');
        targetCanvas.height = viewport.height;
        targetCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
}

function initPdfModal() {
    if (document.getElementById('pdf-modal')) return;
    const modalHtml = `
        <div id="pdf-modal" class="pdf-modal" style="display: none;">
            <div class="pdf-modal-content">
                <div class="pdf-modal-header">
                    <span id="pdf-modal-title">Document Preview</span>
                    <div class="pdf-modal-controls">
                        <button onclick="prevPdfPage()" class="modal-nav-btn" aria-label="Previous Page"><i class="fas fa-chevron-left"></i></button>
                        <div class="pdf-page-indicator">
                            <input type="number" id="pdf-current-page-input" class="pdf-page-input" value="1" min="1">
                            <span class="pdf-page-separator">/</span>
                            <span id="pdf-page-count-display">1</span>
                        </div>
                        <button onclick="nextPdfPage()" class="modal-nav-btn" aria-label="Next Page"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    <button onclick="closePdfModal()" class="pdf-modal-close" aria-label="Close modal">&times;</button>
                </div>
                <div class="pdf-canvas-container">
                    <!-- Canvases are appended here -->
                </div>
            </div>
        </div>
    `;
    const div = document.createElement('div');
    div.innerHTML = modalHtml.trim();
    const modalEl = div.firstChild;
    document.body.appendChild(modalEl);
    
    // Close modal when clicking outside content
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            closePdfModal();
        }
    });

    // Add scroll event listener to track page
    const container = modalEl.querySelector('.pdf-canvas-container');
    container.addEventListener('scroll', () => {
        if (pdfDoc === null) return;
        const canvases = container.querySelectorAll('canvas');
        let activePage = 1;
        let minDiff = Infinity;
        const containerTop = container.getBoundingClientRect().top;
        
        canvases.forEach((canvasEl) => {
            const rect = canvasEl.getBoundingClientRect();
            const diff = Math.abs(rect.top - containerTop);
            if (diff < minDiff) {
                minDiff = diff;
                activePage = parseInt(canvasEl.id.replace('pdf-canvas-', ''));
            }
        });
        
        const pageInput = document.getElementById('pdf-current-page-input');
        if (pageInput && document.activeElement !== pageInput) {
            pageInput.value = activePage;
        }
    });

    // Add input keydown event listener to type page
    const pageInput = modalEl.querySelector('#pdf-current-page-input');
    pageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (pdfDoc === null) return;
            let targetPage = parseInt(pageInput.value);
            if (isNaN(targetPage) || targetPage < 1) targetPage = 1;
            if (targetPage > pdfDoc.numPages) targetPage = pdfDoc.numPages;
            pageInput.value = targetPage;
            jumpToPage(targetPage);
            pageInput.blur();
        }
    });
}

function jumpToPage(pageNum) {
    const container = document.querySelector('.pdf-canvas-container');
    const targetCanvas = document.getElementById(`pdf-canvas-${pageNum}`);
    if (container && targetCanvas) {
        const wrapper = targetCanvas.parentElement;
        container.scrollTo({
            top: wrapper.offsetTop - container.offsetTop,
            behavior: 'smooth'
        });
    }
}

window.prevPdfPage = function() {
    const pageInput = document.getElementById('pdf-current-page-input');
    if (!pageInput) return;
    let page = parseInt(pageInput.value);
    if (page <= 1) return;
    page--;
    pageInput.value = page;
    jumpToPage(page);
};

window.nextPdfPage = function() {
    if (pdfDoc === null) return;
    const pageInput = document.getElementById('pdf-current-page-input');
    if (!pageInput) return;
    let page = parseInt(pageInput.value);
    if (page >= pdfDoc.numPages) return;
    page++;
    pageInput.value = page;
    jumpToPage(page);
};

window.openPdfModal = function(pdfUrl, docTitle) {
    const modal = document.getElementById('pdf-modal');
    const title = document.getElementById('pdf-modal-title');
    const pageCountEl = document.getElementById('pdf-page-count-display');
    const pageInput = document.getElementById('pdf-current-page-input');
    const container = document.querySelector('.pdf-canvas-container');
    if (!modal || !title || !pageCountEl || !container || !pageInput) return;
    
    title.textContent = docTitle;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    container.innerHTML = '<div class="pdf-loading" style="color: #ffffff; font-weight: 600; padding: 2rem; text-align: center; width: 100%;">Loading document...</div>';
    pageCountEl.textContent = '1';
    pageInput.value = '1';
    
    loadPdfJs().then(() => {
        window.pdfjsLib.getDocument(pdfUrl).promise.then((pdfDoc_) => {
            pdfDoc = pdfDoc_;
            container.innerHTML = ''; // Clear loading text
            pageCountEl.textContent = pdfDoc.numPages;
            pageInput.max = pdfDoc.numPages;
            
            // Loop and render all pages
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const canvasWrapper = document.createElement('div');
                canvasWrapper.className = 'pdf-page-wrapper';
                canvasWrapper.style.margin = '0.5rem 0 1.5rem 0';
                canvasWrapper.style.width = '100%';
                canvasWrapper.style.display = 'flex';
                canvasWrapper.style.justifyContent = 'center';
                
                const canvasEl = document.createElement('canvas');
                canvasEl.id = `pdf-canvas-${i}`;
                canvasEl.style.maxWidth = '100%';
                canvasEl.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
                canvasEl.style.background = '#ffffff';
                
                canvasWrapper.appendChild(canvasEl);
                container.appendChild(canvasWrapper);
                
                renderPageOnCanvas(i, canvasEl);
            }
        }).catch(err => {
            container.innerHTML = '<div class="pdf-error" style="color: #ff6b6b; font-weight: 600; padding: 2rem; text-align: center; width: 100%;">Error loading document</div>';
            pageCountEl.textContent = 'Error';
            console.error('Error loading PDF: ', err);
        });
    });
};

window.closePdfModal = function() {
    const modal = document.getElementById('pdf-modal');
    const container = document.querySelector('.pdf-canvas-container');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (container) container.innerHTML = ''; // Clear canvases on close to free memory
        pdfDoc = null;
    }
};
