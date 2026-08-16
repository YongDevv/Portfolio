function initHeroBlob(prefersReducedMotion) {
    const wrap = document.querySelector(".hero-blob-wrap");
    const halo = document.querySelector(".hero-blob-halo");
    const cyan = document.querySelector(".hero-blob-shape-cyan");
    const magenta = document.querySelector(".hero-blob-shape-magenta");
    const blue = document.querySelector(".hero-blob-shape-blue");

    if (!wrap || !cyan || !magenta || !blue) return;
    if (prefersReducedMotion) return;

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    if (isFinePointer) {
        const container = wrap.closest(".section01");
        container?.addEventListener("mousemove", (e) => {
            const rect = container.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 5;
            targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 5;
        });
    }

    let t = 0;

    function tick() {
        requestAnimationFrame(tick);
        t += 0.008;
        curX += (targetX - curX) * 0.03;
        curY += (targetY - curY) * 0.03;

        cyan.style.transform = `translate(${Math.sin(t * 1.1) * 30}px, ${Math.cos(t * 0.9) * 30}px)`;
        magenta.style.transform = `translate(${Math.cos(t * 0.8) * 46}px, ${Math.sin(t * 1.2) * 41}px)`;
        blue.style.transform = `translate(${Math.sin(t * 1.4 + 1.5) * 44}px, ${Math.cos(t * 1.2 + 1.5) * 44}px)`;

        wrap.style.transform = `translateY(-50%) rotate(${t * 14}deg) translate(${curX * 14}px, ${curY * 14}px)`;
        if (halo) {
            halo.style.transform = `translateY(-50%) translate(${curX * 14}px, ${curY * 14}px)`;
        }
    }

    tick();
}

const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

initHeroBlob(prefersReducedMotion);
