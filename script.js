// ============================================
//   SHRAWASTI PORTFOLIO — SCRIPT
// ============================================

// ---- DARK MODE ----
function toggleDarkMode() {
    const body = document.body;
    const icon = document.querySelector('.toggle-icon');
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    icon.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load saved theme
(function () {
    const saved = localStorage.getItem('theme');
    const icon = document.querySelector('.toggle-icon');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        if (icon) icon.textContent = '☀️';
    }
})();

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Scale cursor on hover
document.querySelectorAll('a, button, .cert-card, .project-card, .contact-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursor.style.opacity = '0.6';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.opacity = '1';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
}

// ---- SCROLL FADE ANIMATIONS ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
        }
    });
}, { threshold: 0.12 });

const fadeElements = document.querySelectorAll(
    '.cert-card, .project-card, .about-card, .contact-card, .gallery-item'
);

fadeElements.forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
});

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--accent)';
        }
    });
});

// ---- IMAGE ERROR FALLBACK ----
// Show emoji placeholder when image fails to load
document.querySelectorAll('.cert-img-wrap img').forEach(img => {
    img.addEventListener('error', function () {
        this.style.display = 'none';
        const placeholder = this.nextElementSibling;
        if (placeholder && placeholder.classList.contains('cert-placeholder')) {
            placeholder.style.display = 'flex';
        }
    });
});

document.querySelectorAll('.hero-image-frame img').forEach(img => {
    img.addEventListener('error', function () {
        this.style.display = 'none';
        const placeholder = this.nextElementSibling;
        if (placeholder && placeholder.classList.contains('profile-placeholder')) {
            placeholder.style.display = 'flex';
        }
    });
});
