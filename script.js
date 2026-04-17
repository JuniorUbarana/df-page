/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
    }, 2200);
});

/* ═══════════════════════════════════════════
   CURSOR GLOW
═══════════════════════════════════════════ */
const cursorGlow = document.getElementById("cursorGlow");

if (window.innerWidth > 1024) {
    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
    });
} else {
    cursorGlow.style.display = "none";
}

/* ═══════════════════════════════════════════
   NAV SCROLL EFFECT
═══════════════════════════════════════════ */
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
    if (window.pageYOffset > 80) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

/* ═══════════════════════════════════════════
   MOBILE NAVIGATION
═══════════════════════════════════════════ */
const mobileBtn = document.getElementById("mobileBtn");
const mobileNav = document.getElementById("mobileNav");

mobileBtn.addEventListener("click", () => {
    mobileBtn.classList.toggle("active");
    mobileNav.classList.toggle("active");
    document.body.style.overflow = mobileNav.classList.contains("active")
        ? "hidden"
        : "";
});

function closeMobile() {
    mobileBtn.classList.remove("active");
    mobileNav.classList.remove("active");
    document.body.style.overflow = "";
}

/* ═══════════════════════════════════════════
   REVEAL ON SCROLL (Intersection Observer)
═══════════════════════════════════════════ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ═══════════════════════════════════════════
   SMOOTH SCROLL FOR ANCHOR LINKS
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const offset = 80;
            const position =
                target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: position, behavior: "smooth" });
        }
    });
});

/* ═══════════════════════════════════════════
   FORM SUBMISSION (with visual feedback)
═══════════════════════════════════════════ */
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Loading state
    btn.innerHTML = "<span>Enviando...</span>";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    // Simulate sending
    setTimeout(() => {
        // Success state
        btn.innerHTML = "<span>✓ Enviado com sucesso</span>";
        btn.style.background = "linear-gradient(135deg, #10b981, #059669)";

        // Reset after delay
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.background = "";
            this.reset();
        }, 2500);
    }, 1500);
});

/* ═══════════════════════════════════════════
   PARALLAX ON HERO IMAGE
═══════════════════════════════════════════ */
window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector(".hero-bg-image");
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});