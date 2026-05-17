document.addEventListener('DOMContentLoaded', () => {
    // ── Hamburger Menu ────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav?.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('open');
            mobileNav?.classList.remove('open');
        });
    });

    // ── Dynamic vCard Loading ─────────────────────────
    const nameEl = document.getElementById('contact-name');
    const gridEl = document.getElementById('contact-grid');

    const fallbackVCard = {
        fullName: "Tomás González Bartomeu",
        title: "Co-Founder & Lead Engineer",
        org: "MediXtract",
        email: "PoltorProgrammer@gmail.com",
        tel: "+34626587634",
        urls: [
            "https://poltorprogrammer.github.io/",
            "https://medixtract.github.io/MediXtract/",
            "https://www.linkedin.com/in/tom%C3%A1s-gonz%C3%A1lez-bartomeu-573a98222"
        ]
    };

    function parseVCard(text) {
        const lines = text.split(/\r?\n/);
        const data = { urls: [] };
        
        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('BEGIN:') || line.startsWith('END:')) continue;
            
            const colonIdx = line.indexOf(':');
            if (colonIdx === -1) continue;
            
            const keyPart = line.substring(0, colonIdx);
            const value = line.substring(colonIdx + 1).trim();
            const key = keyPart.split(';')[0].toUpperCase();
            
            if (key === 'FN') {
                data.fullName = value;
            } else if (key === 'TITLE') {
                data.title = value;
            } else if (key === 'ORG') {
                data.org = value;
            } else if (key === 'EMAIL') {
                data.email = value;
            } else if (key === 'TEL') {
                data.tel = value;
            } else if (key === 'URL') {
                data.urls.push(value);
            }
        }
        return data;
    }

    function getUrlDetails(url) {
        let label = "Link";
        let displayValue = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        let iconClass = "fas fa-link";
        let target = "_blank";
        
        if (url.includes('linkedin.com')) {
            label = "LinkedIn";
            displayValue = "Tomás González";
            iconClass = "fab fa-linkedin-in";
        } else if (url.includes('github.com')) {
            label = "GitHub";
            const match = url.match(/github\.com\/([^/]+)/);
            displayValue = match ? match[1] : "GitHub Profile";
            iconClass = "fab fa-github";
        } else if (url.includes('poltorprogrammer.github.io')) {
            label = "GitHub";
            displayValue = "PoltorProgrammer";
            iconClass = "fab fa-github";
        } else if (url.includes('medixtract.github.io')) {
            label = "Website (MediXtract)";
            displayValue = "medixtract.github.io";
            iconClass = "fas fa-globe";
        } else if (url.includes('github.io')) {
            label = "Website";
            iconClass = "fas fa-globe";
        }
        
        return { label, displayValue, iconClass, target };
    }

    function renderVCard(vcard) {
        // Render name
        if (nameEl) nameEl.textContent = vcard.fullName || fallbackVCard.fullName;

        if (!gridEl) return;
        gridEl.innerHTML = ''; // Clear skeleton or old cards

        // 1. Email Card
        const email = vcard.email || fallbackVCard.email;
        if (email) {
            gridEl.appendChild(createCard({
                href: `mailto:${email}`,
                iconClass: "fas fa-envelope",
                label: "Email",
                value: email
            }));
        }

        // 2. Phone Card
        const tel = vcard.tel || fallbackVCard.tel;
        if (tel) {
            // Format phone for display (+34 626 58 76 34)
            let formattedTel = tel;
            if (tel.startsWith('+34') && tel.length === 12) {
                formattedTel = `+34 ${tel.slice(3, 6)} ${tel.slice(6, 8)} ${tel.slice(8, 10)} ${tel.slice(10, 12)}`;
            }
            gridEl.appendChild(createCard({
                href: `tel:${tel}`,
                iconClass: "fas fa-phone-alt",
                label: "Phone",
                value: formattedTel
            }));
        }

        // 3. URL Cards
        const urls = (vcard.urls && vcard.urls.length > 0) ? vcard.urls : fallbackVCard.urls;
        urls.forEach(url => {
            const details = getUrlDetails(url);
            gridEl.appendChild(createCard({
                href: url,
                iconClass: details.iconClass,
                label: details.label,
                value: details.displayValue,
                target: details.target
            }));
        });

        // 4. Always append a vCard Download Card
        gridEl.appendChild(createCard({
            href: "assets/tomas_gonzalez.vcf",
            iconClass: "fas fa-address-card",
            label: "Save Contact",
            value: "Download vCard (.vcf)",
            download: "tomas_gonzalez.vcf"
        }));
    }

    function createCard({ href, iconClass, label, value, target, download }) {
        const card = document.createElement('a');
        card.href = href;
        card.className = 'contact-card';
        if (target) card.target = target;
        if (download) card.download = download;

        card.innerHTML = `
            <div class="contact-icon"><i class="${iconClass}"></i></div>
            <div class="contact-info">
                <span class="contact-label">${escapeHtml(label)}</span>
                <span class="contact-value">${escapeHtml(value)}</span>
            </div>
            <i class="fas fa-arrow-right contact-arrow"></i>
        `;
        return card;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    async function loadVCard() {
        try {
            const response = await fetch('assets/tomas_gonzalez.vcf');
            if (!response.ok) throw new Error('Fetch failed');
            const text = await response.text();
            const vcard = parseVCard(text);
            renderVCard(vcard);
        } catch (error) {
            console.warn('Could not fetch vCard dynamically, using fallback data:', error);
            renderVCard(fallbackVCard);
        }
    }

    loadVCard();
});
