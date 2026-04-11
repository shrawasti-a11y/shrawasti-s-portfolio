<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
  // ===== DARK MODE =====
const toggleBtn = document.getElementById('dark-toggle');
const body = document.body;
const saved = localStorage.getItem('theme');
if (saved === 'dark') { body.classList.add('dark'); toggleBtn.textContent = '☀️'; }

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===== HAMBURGER MENU =====
const ham = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
ham.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });

  // Navbar shadow on scroll
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.08)' : '';
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .ach-card, .project-card, .gallery-item, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===== LIGHTBOX =====
function openLightbox(src, cap) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-cap').textContent = cap;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ===== STAGGER ANIMATION =====
document.querySelectorAll('.ach-grid .ach-card, .projects-grid .project-card, .about-grid .about-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 80) + 'ms';
});
