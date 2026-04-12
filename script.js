const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
let mouseX = 0, mouseY = 0;         // raw mouse
let lerpMouseX = 0, lerpMouseY = 0; // smoothed mouse
let scrollY = 0, targetScrollY = 0;
let isPageVisible = true;
let rafId = null;

// ─── UTILITY ──────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const map = (v, a, b, c, d) => c + (v - a) / (b - a) * (d - c);
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

// ─── LOADER ───────────────────────────────────────────────
const loaderMsgs = ['Initializing...','Loading assets...','Rendering portfolio...','Almost ready...'];
const loaderBar = $('#loader-bar');
const loaderText = $('#loader-text');
let loadPct = 0, msgIdx = 0;

const loaderInt = setInterval(() => {
  loadPct += Math.random() * 15 + 6;
  if (loadPct > 100) loadPct = 100;
  if (loaderBar) loaderBar.style.width = loadPct + '%';
  if (msgIdx < loaderMsgs.length - 1 && loadPct > (msgIdx + 1) * 25) {
    msgIdx++;
    if (loaderText) loaderText.textContent = loaderMsgs[msgIdx];
  }
  if (loadPct >= 100) {
    clearInterval(loaderInt);
    if (loaderText) loaderText.textContent = 'Welcome! ✨';
    setTimeout(bootPortfolio, 500);
  }
}, 110);

function bootPortfolio() {
  const loader = $('#loader');
  if (loader) {
    loader.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    loader.style.opacity = '0';
    loader.style.transform = 'scale(1.05)';
    setTimeout(() => loader.classList.add('hidden'), 800);
  }

  initNebula();
  startTyping();
  initSkillBars();
  initScrollReveal();
  initTilt();
  initMagneticButtons();
  initPageTransitions();
  animateHeroEntrance();
  startMouseParallax();
  if (!IS_MOBILE) initSmoothScroll();
}

// ─── DARK MODE ────────────────────────────────────────────
const darkBtn = $('#dark-toggle');
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  if (darkBtn) darkBtn.textContent = '☀️';
}
if (darkBtn) darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const dark = document.body.classList.contains('dark');
  darkBtn.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

// ─── HAMBURGER ────────────────────────────────────────────
$('#hamburger')?.addEventListener('click', () => $('#nav-links')?.classList.toggle('open'));
$$('.nav-a').forEach(a => a.addEventListener('click', () => $('#nav-links')?.classList.remove('open')));

// ─── GLOBAL MOUSE TRACKER ─────────────────────────────────
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ─── CURSOR GLOW ──────────────────────────────────────────
const glowEl = $('#cursor-glow');
const dotEl  = $('#cursor-dot');
let glowX = 0, glowY = 0;

function tickCursor() {
  glowX = lerp(glowX, mouseX, 0.07);
  glowY = lerp(glowY, mouseY, 0.07);
  lerpMouseX = lerp(lerpMouseX, mouseX, 0.1);
  lerpMouseY = lerp(lerpMouseY, mouseY, 0.1);
  if (glowEl) { glowEl.style.left = glowX + 'px'; glowEl.style.top = glowY + 'px'; }
  if (dotEl)  { dotEl.style.left  = mouseX + 'px'; dotEl.style.top = mouseY + 'px'; }
}

$$('a, button, .tilt-card, .stag, .gallery-item, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (dotEl) { dotEl.style.width = '22px'; dotEl.style.height = '22px'; dotEl.style.opacity = '0.6'; }
  });
  el.addEventListener('mouseleave', () => {
    if (dotEl) { dotEl.style.width = '10px'; dotEl.style.height = '10px'; dotEl.style.opacity = '1'; }
  });
});

// ─── SCROLL PROGRESS ──────────────────────────────────────
const progressEl = $('#scroll-progress');
const navEl = $('#navbar');

function tickScroll() {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = (window.scrollY / docH) * 100;
  if (progressEl) progressEl.style.width = pct + '%';
  if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}

window.addEventListener('scroll', tickScroll, { passive: true });

function updateActiveNav() {
  let current = '';
  $$('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  $$('.nav-a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}

// ─── HERO ENTRANCE ANIMATION ──────────────────────────────
// Staggers hero elements in like GSAP timeline
function animateHeroEntrance() {
  const targets = [
    { el: '.hero-photo-wrap',  delay: 100, from: 'translateY(60px) scale(0.8)', opacity: 0 },
    { el: '.hero-greeting',    delay: 300, from: 'translateX(-40px)',            opacity: 0 },
    { el: '.hero-name',        delay: 400, from: 'translateX(-40px)',            opacity: 0 },
    { el: '.hero-tagline',     delay: 520, from: 'translateX(-30px)',            opacity: 0 },
    { el: '.hero-intro',       delay: 620, from: 'translateX(-30px)',            opacity: 0 },
    { el: '.hero-btns',        delay: 740, from: 'translateY(20px)',             opacity: 0 },
  ];

  targets.forEach(({ el, delay, from }) => {
    const node = $(el);
    if (!node) return;
    node.style.cssText += `opacity:0; transform:${from}; transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms;`;
    setTimeout(() => {
      node.style.opacity = '1';
      node.style.transform = 'none';
    }, 50);
  });
}

// ─── TYPING EFFECT ────────────────────────────────────────
const phrases = ['CSE Student 🎓','Python Learner 🐍','AI Enthusiast 🤖','Web Developer 🌐','Problem Solver 💡','Creative Thinker ✨'];
let tpIdx = 0, tpChar = 0, tpDel = false;
const typedEl = $('#typed-text');

function startTyping() {
  if (!typedEl) return;
  function tick() {
    const cur = phrases[tpIdx];
    typedEl.textContent = tpDel ? cur.slice(0, --tpChar) : cur.slice(0, ++tpChar);
    if (!tpDel && tpChar === cur.length) { tpDel = true; setTimeout(tick, 1800); return; }
    if (tpDel && tpChar === 0)           { tpDel = false; tpIdx = (tpIdx + 1) % phrases.length; setTimeout(tick, 400); return; }
    setTimeout(tick, tpDel ? 55 : 85);
  }
  tick();
}

// ─── NEBULA PARTICLE SYSTEM ───────────────────────────────
// Canvas-based: particles react to mouse, have depth layers
let nebCanvas, nebCtx, nebParticles = [];

function initNebula() {
  const container = $('#hero-particles');
  if (!container) return;
  nebCanvas = document.createElement('canvas');
  nebCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(nebCanvas);
  resizeNebCanvas();
  createNebParticles();
  window.addEventListener('resize', resizeNebCanvas);
}

function resizeNebCanvas() {
  if (!nebCanvas) return;
  const parent = nebCanvas.parentElement;
  nebCanvas.width  = parent.offsetWidth;
  nebCanvas.height = parent.offsetHeight;
  nebCtx = nebCanvas.getContext('2d');
}

function createNebParticles() {
  nebParticles = [];
  const count = IS_MOBILE ? 40 : 90;
  const colors = ['167,139,250','244,114,182','34,211,238','251,191,36','255,255,255','129,140,248'];
  for (let i = 0; i < count; i++) {
    const depth = Math.random(); // 0=far, 1=near
    nebParticles.push({
      x: Math.random() * nebCanvas.width,
      y: Math.random() * nebCanvas.height,
      ox: 0, oy: 0, // origin offset for mouse repulsion
      size: Math.random() * 2.5 + 0.5 + depth * 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2 + depth * 0.3,
      speedY: -(Math.random() * 0.4 + 0.1 + depth * 0.3),
      speedX: (Math.random() - 0.5) * 0.2,
      depth,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      connected: false,
    });
  }
}

function drawNebula() {
  if (!nebCtx || !nebCanvas) return;
  nebCtx.clearRect(0, 0, nebCanvas.width, nebCanvas.height);

  // Mouse position relative to canvas
  const rect = nebCanvas.getBoundingClientRect();
  const mx = lerpMouseX - rect.left;
  const my = lerpMouseY - rect.top;

  nebParticles.forEach(p => {
    // Mouse repulsion
    const dx = p.x - mx, dy = p.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelR = 100 + p.depth * 50;
    if (dist < repelR) {
      const force = (repelR - dist) / repelR;
      p.ox = lerp(p.ox, dx / dist * force * 30, 0.05);
      p.oy = lerp(p.oy, dy / dist * force * 30, 0.05);
    } else {
      p.ox = lerp(p.ox, 0, 0.04);
      p.oy = lerp(p.oy, 0, 0.04);
    }

    // Move
    p.x += p.speedX;
    p.y += p.speedY;
    p.twinkle += p.twinkleSpeed;

    // Wrap
    if (p.y < -10) { p.y = nebCanvas.height + 10; p.x = Math.random() * nebCanvas.width; }
    if (p.x < -10) p.x = nebCanvas.width + 10;
    if (p.x > nebCanvas.width + 10) p.x = -10;

    const drawX = p.x + p.ox;
    const drawY = p.y + p.oy;
    const twinkleAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle));

    // Glow
    const grd = nebCtx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.size * 3);
    grd.addColorStop(0,   `rgba(${p.color},${twinkleAlpha})`);
    grd.addColorStop(0.4, `rgba(${p.color},${twinkleAlpha * 0.4})`);
    grd.addColorStop(1,   `rgba(${p.color},0)`);
    nebCtx.beginPath();
    nebCtx.arc(drawX, drawY, p.size * 3, 0, Math.PI * 2);
    nebCtx.fillStyle = grd;
    nebCtx.fill();

    // Core
    nebCtx.beginPath();
    nebCtx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
    nebCtx.fillStyle = `rgba(${p.color},${twinkleAlpha})`;
    nebCtx.fill();
  });

  // Draw connection lines between nearby particles
  if (!IS_MOBILE) {
    nebCtx.lineWidth = 0.3;
    for (let i = 0; i < nebParticles.length; i++) {
      for (let j = i + 1; j < nebParticles.length; j++) {
        const a = nebParticles[i], b = nebParticles[j];
        const dx = (a.x + a.ox) - (b.x + b.ox);
        const dy = (a.y + a.oy) - (b.y + b.oy);
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) {
          nebCtx.beginPath();
          nebCtx.moveTo(a.x + a.ox, a.y + a.oy);
          nebCtx.lineTo(b.x + b.ox, b.y + b.oy);
          const alpha = (1 - d / 80) * 0.15;
          nebCtx.strokeStyle = `rgba(167,139,250,${alpha})`;
          nebCtx.stroke();
        }
      }
    }
  }
}

// ─── MULTI-LAYER PARALLAX (mouse + scroll) ────────────────
const parallaxLayers = [
  { sel: '.hero-bg',        mouseX: -0.015, mouseY: -0.015, scrollMult: 0.35 },
  { sel: '.hero-orb',       mouseX:  0.025, mouseY:  0.025, scrollMult: -0.2 },
  { sel: '.hero-photo-wrap',mouseX:  0.012, mouseY:  0.01,  scrollMult: 0.08 },
  { sel: '.hero-text',      mouseX: -0.006, mouseY: -0.005, scrollMult: 0.04 },
];

function startMouseParallax() {
  // Section depth effect — different sections move at different rates
  $$('[data-parallax]').forEach(el => {
    const depth = parseFloat(el.dataset.parallax) || 0.1;
    el._parallaxDepth = depth;
  });
}

function tickParallax() {
  const winW = window.innerWidth, winH = window.innerHeight;
  const nx = (lerpMouseX / winW - 0.5);  // -0.5 to 0.5
  const ny = (lerpMouseY / winH - 0.5);
  const sy = window.scrollY;

  parallaxLayers.forEach(layer => {
    const el = $(layer.sel);
    if (!el) return;
    const mx = nx * winW * layer.mouseX;
    const my = ny * winH * layer.mouseY;
    const sy2 = sy * layer.scrollMult;
    el.style.transform = `translate3d(${mx}px, ${my + sy2}px, 0)`;
  });

  // Section content parallax — elements with data-depth
  $$('[data-depth]').forEach(el => {
    const depth = parseFloat(el.dataset.depth);
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2 - winH / 2;
    el.style.transform = `translate3d(${nx * depth * 30}px, ${ny * depth * 20 + centerY * depth * 0.1}px, 0)`;
  });
}

// ─── SKILL BARS ───────────────────────────────────────────
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
        setTimeout(() => { fill.style.width = fill.dataset.pct + '%'; }, i * 120);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const s = $('#skills');
  if (s) obs.observe(s);
}

// ─── SCROLL REVEAL (staggered, direction-aware) ───────────
function initScrollReveal() {
  const els = $$('.about-card, .ach-card, .project-card, .gallery-item, .contact-card, .skill-item, .stag, .section-title, .section-label');
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 5) * 90 + 'ms';
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ─── 3D TILT EFFECT (enhanced) ────────────────────────────
function initTilt() {
  $$('.tilt-card').forEach(card => {
    let tiltX = 0, tiltY = 0, sc = 1;

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      tiltX = lerp(tiltX, -dy * 12, 0.2);
      tiltY = lerp(tiltY,  dx * 12, 0.2);
      sc    = lerp(sc, 1.03, 0.15);
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${sc})`;
      const shine = card.querySelector('.tilt-shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${(dx+1)*50}% ${(dy+1)*50}%, rgba(255,255,255,0.2) 0%, transparent 65%)`;
        shine.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      function resetTilt() {
        tiltX = lerp(tiltX, 0, 0.15);
        tiltY = lerp(tiltY, 0, 0.15);
        sc    = lerp(sc,    1, 0.15);
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${sc})`;
        const shine = card.querySelector('.tilt-shine');
        if (shine) shine.style.opacity = (Math.abs(tiltX) + Math.abs(tiltY)) > 0.1 ? '0.3' : '0';
        if (Math.abs(tiltX) + Math.abs(tiltY) > 0.05 || Math.abs(sc - 1) > 0.001) {
          requestAnimationFrame(resetTilt);
        }
      }
      resetTilt();
    });
  });
}

// ─── MAGNETIC BUTTONS ─────────────────────────────────────
function initMagneticButtons() {
  $$('.btn-primary, .btn-outline, .magnetic').forEach(btn => {
    let bx = 0, by = 0;

    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const strength = 0.38;
      bx = lerp(bx, dx * strength, 0.2);
      by = lerp(by, dy * strength, 0.2);
      btn.style.transform = `translate(${bx}px, ${by}px)`;
      // inner text also moves slightly
      const inner = btn.querySelector('span') || btn;
      if (inner !== btn) inner.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      function resetMag() {
        bx = lerp(bx, 0, 0.12);
        by = lerp(by, 0, 0.12);
        btn.style.transform = `translate(${bx}px, ${by}px)`;
        const inner = btn.querySelector('span');
        if (inner) inner.style.transform = `translate(${bx * 0.2}px, ${by * 0.2}px)`;
        if (Math.abs(bx) + Math.abs(by) > 0.05) requestAnimationFrame(resetMag);
        else {
          btn.style.transform = '';
          if (inner) inner.style.transform = '';
        }
      }
      resetMag();
    });
  });
}

// ─── SMOOTH PAGE TRANSITIONS ──────────────────────────────
// Ink-wipe reveal when clicking nav links
function initPageTransitions() {
  // Create transition overlay
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.innerHTML = `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" id="pt-svg">
      <path id="pt-path" d="M0,0 L100,0 L100,0 L0,0 Z"/>
    </svg>`;
  document.body.appendChild(overlay);

  $$('.nav-a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      playTransition(() => {
        const target = $(href);
        if (target) target.scrollIntoView({ behavior: 'instant' });
      });
    });
  });
}

function playTransition(callback) {
  const overlay = $('#page-transition');
  const path = $('#pt-path');
  if (!overlay || !path) { callback(); return; }

  overlay.classList.add('active');

  // Animate path from bottom strip to full cover to top strip out
  const steps = [
    { d: 'M0,100 L100,100 L100,100 L0,100 Z', t: 0 },
    { d: 'M0,0   L100,0   L100,100 L0,100 Z', t: 300 },
    { d: 'M0,0   L100,0   L100,0   L0,0   Z', t: 600 },
  ];

  steps.forEach(({ d, t }) => {
    setTimeout(() => { path.setAttribute('d', d); }, t);
  });

  setTimeout(() => { callback(); }, 320);
  setTimeout(() => { overlay.classList.remove('active'); }, 700);
}

// ─── SMOOTH INERTIA SCROLL (desktop only) ────────────────
function initSmoothScroll() {
  let cur = window.scrollY, tar = window.scrollY;
  const ease = 0.085;

  // Intercept wheel
  window.addEventListener('wheel', e => {
    e.preventDefault();
    tar += e.deltaY * 0.9;
    tar = clamp(tar, 0, document.body.scrollHeight - window.innerHeight);
  }, { passive: false });

  function scrollLoop() {
    cur = lerp(cur, tar, ease);
    if (Math.abs(tar - cur) < 0.3) cur = tar;
    window.scrollTo(0, cur);
    requestAnimationFrame(scrollLoop);
  }
  scrollLoop();
}

// ─── MASTER RAF LOOP ──────────────────────────────────────
// Everything that needs per-frame updates lives here
function masterLoop() {
  tickCursor();
  tickParallax();
  drawNebula();
  requestAnimationFrame(masterLoop);
}
requestAnimationFrame(masterLoop);

// ─── LIGHTBOX ─────────────────────────────────────────────
function openLightbox(src, cap) {
  const lb = $('#lightbox');
  $('#lb-img').src = src;
  $('#lb-cap').textContent = cap;
  lb.classList.add('open');
  lb.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  const lb = $('#lightbox');
  lb.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).onfinish = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  };
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ─── CHATBOT ──────────────────────────────────────────────
function toggleChat() {
  const w = $('#chatbot-window');
  w.classList.toggle('open');
  if (w.classList.contains('open')) $('#chat-input')?.focus();
}
$('#chat-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

const KB = {
  greetings:    ['hi','hello','hey','hii','helo','greet'],
  skills:       ['skill','know','language','programming','code','tech','able'],
  projects:     ['project','built','made','work','portfolio','program','created'],
  certificates: ['certificate','cert','coursera','cisco','netacad','ai','python','physics','chemistry','award'],
  education:    ['study','college','university','degree','btech','cse','year','student'],
  contact:      ['contact','email','reach','linkedin','github','social','connect'],
  about:        ['who','about','yourself','shrawasti','introduce','background'],
};
const KR = {
  greetings:    "Hi there! 👋 I'm Shrawasti's portfolio assistant. Ask about her skills, projects, or certificates!",
  skills:       "Shrawasti's skills:\n🔹 C Programming (80%)\n🔹 HTML & CSS (75%)\n🔹 Python (65%)\n🔹 JavaScript (55%)\n🔹 Discrete Math (70%)\n🔹 AI & ML (50%)",
  projects:     "Her projects:\n🌐 Digital Portfolio Website\n💻 C Programming Exercises\n📐 Discrete Maths Solutions\n🐍 Python (Coursera)\n\nSee the Projects section!",
  certificates: "Certificates:\n✅ Programming for Everybody — Univ. of Michigan\n✅ Engineering Physics — MIT VPU\n✅ Chemistry Prep — MIT VPU\n✅ Intro to Modern AI — Cisco NetAcad",
  education:    "1st-year B.Tech CSE student at MIT Vishwaprayag University, Pune. Studying C, Discrete Maths, Physics & Chemistry.",
  contact:      "Reach Shrawasti:\n📧 shrawasti@mitvpu.ac.in\n🐙 github.com/shrawasti\n💼 linkedin.com/in/shrawasti",
  about:        "Shrawasti Vijay Dhole — 1st-year B.Tech CSE at MIT Vishwaprayag University. Passionate about AI, web development & problem-solving, with multiple Coursera & Cisco certifications!",
  default:      "I can answer questions about Shrawasti's skills, projects, certificates, education, or contact info. Give one of those a try! 😊",
};

function sendChat() {
  const input = $('#chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addMsg(msg, 'user');
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot chat-typing';
  typing.innerHTML = '<p><span class="dot-pulse"></span></p>';
  $('#chat-messages').appendChild(typing);
  scrollChatBottom();

  setTimeout(() => {
    typing.remove();
    const lower = msg.toLowerCase();
    let resp = KR.default;
    for (const [k, kws] of Object.entries(KB)) {
      if (kws.some(w => lower.includes(w))) { resp = KR[k]; break; }
    }
    addMsg(resp, 'bot');
  }, 800 + Math.random() * 500);
}

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<p>${text.replace(/\n/g,'<br>')}</p>`;
  div.style.cssText = 'opacity:0;transform:translateY(8px);transition:opacity 0.25s,transform 0.25s;';
  $('#chat-messages').appendChild(div);
  scrollChatBottom();
  requestAnimationFrame(() => { div.style.opacity='1'; div.style.transform='none'; });
}
function scrollChatBottom() { const m = $('#chat-messages'); m.scrollTop = m.scrollHeight; }
