document.addEventListener("DOMContentLoaded", () => {
    initHeader(); // 헤더 스크롤
    initCursor(); // 커스텀 마우스 커서
    initIntroAnimation(); // 초기 화면 애니메이션
    initScrollAnimation(); // 스크롤 애니메이션

    // 사용자가 모션 감소를 설정한 경우, 모든 GSAP 효과를 실행 X
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);

    // 데스크톱에서만 ScrollSmoother(부드러운 관성 스크롤)을 적용
    let smoother;

    if (window.ScrollSmoother) {
        gsap.registerPlugin(window.ScrollSmoother);
        smoother = window.ScrollSmoother.create({
            smooth: 0.8,
            smoothTouch: 0,
            effects: false
        });
        document.body.classList.add("has-smoother");
    }

    // 기본 앵커 이동 대신 ScrollSmoother를 이용해 메뉴 위치로 이동
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();

            if (smoother) {
                smoother.scrollTo(target, true, "top top");
            } else {
                target.scrollIntoView({ behavior: "smooth" });
            }

            window.history.pushState(null, "", link.getAttribute("href"));
        });
    });
});

// 헤더 스크롤 시 클래스 추가
function initHeader() {
    const header = document.querySelector("header");

    const handleScroll = () => {
        header.classList.toggle("is-fixed", window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
}

// 커스텀 마우스 커서
function initCursor() {
    // 마우스를 사용하는 환경에서만 커스텀 커서를 실행
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.querySelector(".cursor");
        const cursorText = cursor.querySelector("span");
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        const moveCursorX = gsap.quickTo(cursor, "x", { duration: 0.18, ease: "power3.out" });
        const moveCursorY = gsap.quickTo(cursor, "y", { duration: 0.18, ease: "power3.out" });

        document.body.classList.add("has-cursor");
        window.addEventListener("pointermove", (event) => {
            moveCursorX(event.clientX);
            moveCursorY(event.clientY);
        });

        // data-cursor 값에 따라 카드와 버튼 위의 커서 문구를 변경
        document.querySelectorAll("[data-cursor]").forEach((element) => {
            element.addEventListener("pointerenter", () => {
                cursor.dataset.state = "active";
                cursorText.textContent = element.dataset.cursor;
            });

            element.addEventListener("pointerleave", () => {
                delete cursor.dataset.state;
                cursorText.textContent = "";
            });
        });
    }
}

function initIntroAnimation() {
    // 첫 화면의 요소가 순서대로 나타나는 진입 모션
    gsap.from(".header", { y: -20, autoAlpha: 0, duration: 2, delay: 0.3, ease: "power2.out" });
    gsap.from(".section01-label, .section01 .section01-title, .section01 .section01-desc, .section01 .section01-link, .section01-index, .hero-blob", { y: 28, autoAlpha: 0, duration: 2, stagger: 0.15, delay: 0.3, ease: "power3.out" });
}

function initScrollAnimation() {
    // 스크롤 시 애니메이션
    const scrollAnimation = (selector, options = {}) => {
        const elements = gsap.utils.toArray(selector);
        gsap.from(elements, { y: 44, autoAlpha: 0, duration: 1.2, ease: "power3.out", ...options, scrollTrigger: { trigger: elements[0], start: "top 75%", toggleActions: "play none none reverse" } });
    };

    // Section 02
    scrollAnimation(".section02-title, .section02-profile, .section02-info", { stagger: 0.12 });

    // Project
    scrollAnimation(".project-list");
    scrollAnimation(".project-visual, .project-footer", { stagger: 0.12 });

    // Section 04
    scrollAnimation(".section04-title, .section04-cont strong, .section04-cont .section04-desc", { stagger: 0.12 });
}
