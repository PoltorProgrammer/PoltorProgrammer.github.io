(function () {
    function init() {
        const container = document.getElementById('particles');
        if (!container) return;

        // Bubbles
        for (let i = 0; i < 22; i++) {
            const p = document.createElement('div');
            const isLarge = i < 5;
            p.className = 'particle bubble' + (isLarge ? ' large' : '');

            const size     = isLarge ? 55 + Math.random() * 90 : 3 + Math.random() * 10;
            const left     = Math.random() * 100;
            const delay    = Math.random() * 22;
            const duration = 11 + Math.random() * 18;
            const drift    = (Math.random() - 0.5) * 90;
            const opacity  = isLarge ? 0.03 + Math.random() * 0.05 : 0.25 + Math.random() * 0.5;

            p.style.cssText = [
                `width:${size}px`,
                `height:${size}px`,
                `left:${left}%`,
                `bottom:-${size + 10}px`,
                `opacity:${opacity}`,
                `animation-duration:${duration}s`,
                `animation-delay:${delay}s`,
                `--drift:${drift}px`,
            ].join(';');

            container.appendChild(p);
        }

        // Fish
        const fish = ['🐠', '🐟', '🐡'];
        for (let i = 0; i < 3; i++) {
            const f = document.createElement('span');
            f.className = 'particle fish';

            const size     = 15 + Math.random() * 13;
            const top      = 12 + Math.random() * 62;
            const delay    = Math.random() * 30;
            const duration = 24 + Math.random() * 22;

            f.style.cssText = [
                `font-size:${size}px`,
                `top:${top}%`,
                `animation-duration:${duration}s`,
                `animation-delay:-${delay}s`,
                'opacity:0.3',
            ].join(';');

            f.textContent = fish[i % fish.length];
            container.appendChild(f);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
