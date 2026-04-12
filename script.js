'use strict';

const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lerpMouseX = mouseX;
let lerpMouseY = mouseY;

// ─── SAFE DOM-READY WRAPPER ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──────────────────────────────────────────────
  const loaderEl  = $('#loader');
  const loaderBar = $('#loader-bar');
  const loaderTxt = $('#loader-text');
  const msgs = ['Initializing...', 'Loading assets...', 'Rendering portfolio...', 'Almost ready...'];
  let pct = 0, mi = 0;

  const loaderTimer = setInterval(() => {
    pct += Math.random() * 14 + 7;
    if (pct > 100) pct = 100;
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (mi < msgs.length - 1 && pct > (mi + 1) * 25) {
      mi++;
      if (loaderTxt) loaderTxt.textContent = msgs[mi];
    }
    if (pct >= 100) {
      clearInterval(loaderTimer);
      if (loaderTxt) loaderTxt.textContent = 'Welcome! ✨';
      setTimeout(() => {
        if (loaderEl) {
          loaderEl.style.opacity = '0';
          loaderEl.style.transition = 'opacity 0.7s ease';
          setTimeout(() => {
            loaderEl.style.display = 'none';
          }, 700);
        }
        onLoaderDone();
      }, 400);
    }
  }, 120);

  // ── DARK MODE ────────────────────────────────────────────
  const darkBtn = $('#dark-toggle');
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    if (darkBtn) darkBtn.textContent = '☀️';
  }
  darkBtn && darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const d = document.body.classList.contains('dark');
    darkBtn.textContent = d ? '☀️' : '🌙';
    localStorage.setItem('theme', d ? 'dark' : 'light');
  });

  // ── HAMBURGER ────────────────────────────────────────────
  $('#hamburger') && $('#hamburger').addEventListener('click', () => {
    $('#nav-links') && $('#nav-links').classList.toggle('open');
  });
  $$('.nav-a').forEach(a => a.addEventListener('click', () => {
    $('#nav-links') && $('#nav-links').classList.remove('open');
  }));

  // ── MOUSE TRACKER ────────────────────────────────────────
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // ── SCROLL: PROGRESS + NAV ───────────────────────────────
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    const bar  = $('#scroll-progress');
    if (bar) bar.style.width = pct + '%';
    const nav = $('#navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveNav();
  }, { passive: true });

  // ── LIGHTBOX ─────────────────────────────────────────────
  window.openLightbox = (src, cap) => {
    const lb = $('#lightbox');
    const img = $('#lb-img');
    const capEl = $('#lb-cap');
    if (!lb) return;
    if (img) img.src = src;
    if (capEl) capEl.textContent = cap;
    lb.classList.add('open');
  };
  window.closeLightbox = () => {
    const lb = $('#lightbox');
    if (lb) lb.classList.remove('open');
  };
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  // ── CHATBOT ──────────────────────────────────────────────
  window.toggleChat = () => {
    const w = $('#chatbot-window');
    if (!w) return;
    w.classList.toggle('open');
    if (w.classList.contains('open')) {
      const inp = $('#chat-input');
      if (inp) inp.focus();
    }
  };

  const chatInput = $('#chat-input');
  chatInput && chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') window.sendChat();
  });

  const KB = {
    greetings:    ['hi','hello','hey','hii'],
    skills:       ['skill','language','programming','code','tech'],
    projects:     ['project','built','made','portfolio','program'],
    certificates: ['certificate','cert','coursera','cisco','netacad','ai','python','physics','chemistry'],
    education:    ['study','college','university','degree','btech','cse'],
    contact:      ['contact','email','reach','linkedin','github'],
    about:        ['who','about','yourself','shrawasti'],
  };
  const KR = {
    greetings:    "Hi there! 👋 I'm Shrawasti's assistant. Ask about her skills, projects or certificates!",
    skills:       "Skills:\n🔹 C Programming (80%)\n🔹 HTML & CSS (75%)\n🔹 Python (65%)\n🔹 JavaScript (55%)\n🔹 Discrete Math (70%)\n🔹 AI & ML (50%)",
    projects:     "Projects:\n🌐 Digital Portfolio\n💻 C Programming Exercises\n📐 Discrete Maths Solutions\n🐍 Python (Coursera)",
    certificates: "Certificates:\n✅ Programming for Everybody — Univ. Michigan\n✅ Engineering Physics — MIT VPU\n✅ Chemistry Prep — MIT VPU\n✅ Intro to Modern AI — Cisco NetAcad",
    education:    "1st-year B.Tech CSE at MIT Vishwaprayag University, Pune. Studying C, Discrete Maths, Physics & Chemistry.",
    contact:      "📧 shrawasti@mitvpu.ac.in\n🐙 github.com/shrawasti\n💼 linkedin.com/in/shrawasti",
    about:        "Shrawasti Vijay Dhole — 1st-year B.Tech CSE at MIT Vishwaprayag University. Passionate about AI, web dev & problem-solving!",
    default:      "I can answer about skills, projects, certificates, education or contact. Try one of those! 😊",
  };

  window.sendChat = () => {
    const input = $('#chat-input');
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    addChatMsg(msg, 'user');

    const typing = document.createElement('div');
    typing.className = 'chat-msg bot chat-typing';
    typing.innerHTML = '<p>typing...</p>';
    const msgs = $('#chat-messages');
    if (msgs) { msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight; }

    setTimeout(() => {
      typing.remove();
      const lower = msg.toLowerCase();
      let resp = KR.default;
      for (const [k, kws] of Object.entries(KB)) {
        if (kws.some(w => lower.includes(w))) { resp = KR[k]; break; }
      }
      addChatMsg(resp, 'bot');
    }, 900);
  };

  function addChatMsg(text, role) {
    const msgs = $('#chat-messages');
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.innerHTML = `<p>${text.replace(/\n/g,'<br>')}</p>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ── MASTER RAF LOOP ──────────────────────────────────────
  // Cursor + parallax run every frame — NO DOM moving
  function masterLoop() {
    lerpMouseX = lerp(lerpMouseX, mouseX, 0.08);
    lerpMouseY = lerp(lerpMouseY, mouseY, 0.08);

    // Cursor glow follows smoothed mouse
    const glowEl = $('#cursor-glow');
    const dotEl  = $('#cursor-dot');
    if (glowEl) { glowEl.style.left = lerpMouseX + 'px'; glowEl.style.top = lerpMouseY + 'px'; }
    if (dotEl)  { dotEl.style.left  = mouseX + 'px';     dotEl.style.top  = mouseY + 'px'; }

    // Mouse parallax on hero elements
    if (!IS_MOBILE) {
      const nx = (lerpMouseX / window.innerWidth  - 0.5);
      const ny = (lerpMouseY / window.innerHeight - 0.5);
      const sy = window.scrollY;

      applyParallax('.hero-bg',         nx * -25,  ny * -20 + sy * 0.3);
      applyParallax('.hero-orb',        nx *  35,  ny *  30 + sy * -0.15);
      applyParallax('.hero-photo-wrap', nx *  18,  ny *  14 + sy * 0.08);
      applyParallax('.hero-text',       nx *  -8,  ny *  -6 + sy * 0.03);
    }

    // Draw nebula canvas if ready
    if (window._nebDraw) window._nebDraw();

    requestAnimationFrame(masterLoop);
  }
  requestAnimationFrame(masterLoop);

  function applyParallax(sel, tx, ty) {
    const el = $(sel);
    if (el) el.style.transform = `translate3d(${tx}px,${ty}px,0)`;
  }

  // cursor scale on hover
  $$('a, button, .tilt-card, .stag, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const d = $('#cursor-dot');
      if (d) { d.style.width = '22px'; d.style.height = '22px'; d.style.opacity = '0.6'; }
    });
    el.addEventListener('mouseleave', () => {
      const d = $('#cursor-dot');
      if (d) { d.style.width = '10px'; d.style.height = '10px'; d.style.opacity = '1'; }
    });
  });

}); // end DOMContentLoaded

// ─── BOOT (called after loader finishes) ──────────────────
function onLoaderDone() {
  initNebula();
  startTyping();
  initSkillBars();
  initScrollReveal();
  initTilt();
  initMagneticButtons();
  initPageTransitions();
  animateHeroEntrance();
}

// ─── HERO ENTRANCE ────────────────────────────────────────
function animateHeroEntrance() {
  const items = [
    ['.hero-photo-wrap', 100,  'translateY(50px) scale(0.85)'],
    ['.hero-greeting',   280,  'translateX(-35px)'],
    ['.hero-name',       380,  'translateX(-35px)'],
    ['.hero-tagline',    480,  'translateX(-25px)'],
    ['.hero-intro',      560,  'translateX(-25px)'],
    ['.hero-btns',       660,  'translateY(20px)'],
  ];
  items.forEach(([sel, delay, from]) => {
    const el = $(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = from;
    el.style.transition = `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }));
  });
}

// ─── TYPING EFFECT ────────────────────────────────────────
function startTyping() {
  const el = $('#typed-text');
  if (!el) return;
  const phrases = ['CSE Student 🎓','Python Learner 🐍','AI Enthusiast 🤖','Web Developer 🌐','Problem Solver 💡','Creative Thinker ✨'];
  let i = 0, c = 0, del = false;
  function tick() {
    const cur = phrases[i];
    el.textContent = del ? cur.slice(0, --c) : cur.slice(0, ++c);
    if (!del && c === cur.length) { del = true; setTimeout(tick, 1800); return; }
    if (del  && c === 0)          { del = false; i = (i + 1) % phrases.length; setTimeout(tick, 400); return; }
    setTimeout(tick, del ? 55 : 88);
  }
  tick();
}

// ─── NEBULA CANVAS PARTICLES ──────────────────────────────
function initNebula() {
  const container = $('#hero-particles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  container.appendChild(canvas);

  let ctx, particles = [];
  const colors = ['167,139,250','244,114,182','34,211,238','251,191,36','255,255,255'];

  function resize() {
    canvas.width  = container.offsetWidth  || window.innerWidth;
    canvas.height = container.offsetHeight || window.innerHeight;
    ctx = canvas.getContext('2d');
  }
  resize();
  window.addEventListener('resize', resize);

  const count = IS_MOBILE ? 35 : 80;
  for (let i = 0; i < count; i++) {
    const depth = Math.random();
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      ox: 0, oy: 0,
      size: Math.random() * 2 + 0.5 + depth,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.45 + 0.2 + depth * 0.2,
      vy: -(Math.random() * 0.35 + 0.08 + depth * 0.25),
      vx: (Math.random() - 0.5) * 0.15,
      depth,
      twinkle: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.018 + 0.004,
    });
  }

  // expose draw fn to master loop
  window._nebDraw = function() {
    if (!ctx || canvas.width === 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rect = canvas.getBoundingClientRect();
    const mx = lerpMouseX - rect.left;
    const my = lerpMouseY - rect.top;

    particles.forEach(p => {
      // repel from mouse
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const R = 90 + p.depth * 40;
      if (dist < R && dist > 0) {
        const f = (R - dist) / R;
        p.ox = lerp(p.ox, (dx / dist) * f * 25, 0.06);
        p.oy = lerp(p.oy, (dy / dist) * f * 25, 0.06);
      } else {
        p.ox = lerp(p.ox, 0, 0.05);
        p.oy = lerp(p.oy, 0, 0.05);
      }

      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += p.ts;

      // wrap
      if (p.y < -5)              { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      if (p.x < -5)              p.x = canvas.width + 5;
      if (p.x > canvas.width+5)  p.x = -5;

      const wx = p.x + p.ox;
      const wy = p.y + p.oy;
      const ta = p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle));

      // glow halo
      const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, p.size * 3.5);
      g.addColorStop(0,   `rgba(${p.color},${ta})`);
      g.addColorStop(0.4, `rgba(${p.color},${ta * 0.35})`);
      g.addColorStop(1,   `rgba(${p.color},0)`);
      ctx.beginPath();
      ctx.arc(wx, wy, p.size * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // core dot
      ctx.beginPath();
      ctx.arc(wx, wy, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${ta})`;
      ctx.fill();
    });

    // connection lines
    if (!IS_MOBILE) {
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const ddx = (a.x+a.ox)-(b.x+b.ox);
          const ddy = (a.y+a.oy)-(b.y+b.oy);
          const d = Math.sqrt(ddx*ddx + ddy*ddy);
          if (d < 75) {
            ctx.beginPath();
            ctx.moveTo(a.x+a.ox, a.y+a.oy);
            ctx.lineTo(b.x+b.ox, b.y+b.oy);
            ctx.strokeStyle = `rgba(167,139,250,${(1-d/75)*0.12})`;
            ctx.stroke();
          }
        }
      }
    }
  };
}

// ─── SKILL BARS ───────────────────────────────────────────
function initSkillBars() {
  const section = $('#skills');
  if (!section) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.skill-fill').forEach((f, i) => {
        setTimeout(() => { f.style.width = f.dataset.pct + '%'; }, i * 130);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.25 });
  obs.observe(section);
}

// ─── SCROLL REVEAL ────────────────────────────────────────
function initScrollReveal() {
  const els = $$('.about-card,.ach-card,.project-card,.gallery-item,.contact-card,.skill-item,.stag');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
    el.style.transition = `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${(i%5)*85}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${(i%5)*85}ms`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

// ─── 3D TILT ──────────────────────────────────────────────
function initTilt() {
  $$('.tilt-card').forEach(card => {
    let tx = 0, ty = 0, sc = 1;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      tx = lerp(tx, -dy * 11, 0.22);
      ty = lerp(ty,  dx * 11, 0.22);
      sc = lerp(sc, 1.03, 0.16);
      card.style.transform = `perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg) scale(${sc})`;
      const shine = card.querySelector('.tilt-shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${(dx+1)*50}% ${(dy+1)*50}%, rgba(255,255,255,0.18) 0%, transparent 62%)`;
        shine.style.opacity = '1';
      }
    });
    card.addEventListener('mouseleave', () => {
      function spring() {
        tx = lerp(tx, 0, 0.14); ty = lerp(ty, 0, 0.14); sc = lerp(sc, 1, 0.14);
        card.style.transform = `perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg) scale(${sc})`;
        const shine = card.querySelector('.tilt-shine');
        if (shine) shine.style.opacity = '0';
        if (Math.abs(tx)+Math.abs(ty)+Math.abs(sc-1) > 0.01) requestAnimationFrame(spring);
        else card.style.transform = '';
      }
      spring();
    });
  });
}

// ─── MAGNETIC BUTTONS ─────────────────────────────────────
function initMagneticButtons() {
  $$('.btn-primary, .btn-outline').forEach(btn => {
    let bx = 0, by = 0;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top  + r.height/2);
      bx = lerp(bx, dx * 0.36, 0.22);
      by = lerp(by, dy * 0.36, 0.22);
      btn.style.transform = `translate(${bx}px,${by}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      function release() {
        bx = lerp(bx, 0, 0.14); by = lerp(by, 0, 0.14);
        btn.style.transform = `translate(${bx}px,${by}px)`;
        if (Math.abs(bx)+Math.abs(by) > 0.05) requestAnimationFrame(release);
        else btn.style.transform = '';
      }
      release();
    });
  });
}

// ─── PAGE TRANSITIONS ─────────────────────────────────────
function initPageTransitions() {
  // Create overlay
  if ($('#page-transition')) return;
  const ov = document.createElement('div');
  ov.id = 'page-transition';
  ov.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path id="pt-path" d="M0,100 L100,100 L100,100 L0,100 Z"/></svg>`;
  ov.style.cssText = 'position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:0;transition:opacity 0.05s;';
  ov.querySelector('svg').style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  ov.querySelector('path').style.cssText = 'fill:#070511;transition:d 0.32s cubic-bezier(0.76,0,0.24,1);';
  document.body.appendChild(ov);

  $$('.nav-a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const path = $('#pt-path');
      const target = $(href);
      if (!path || !target) return;

      ov.style.opacity = '1';
      ov.style.pointerEvents = 'all';
      setTimeout(() => { path.setAttribute('d','M0,0 L100,0 L100,100 L0,100 Z'); }, 10);
      setTimeout(() => { target.scrollIntoView({ behavior: 'instant' }); }, 320);
      setTimeout(() => { path.setAttribute('d','M0,0 L100,0 L100,0 L0,0 Z'); }, 350);
      setTimeout(() => { ov.style.opacity = '0'; ov.style.pointerEvents = 'none'; path.setAttribute('d','M0,100 L100,100 L100,100 L0,100 Z'); }, 700);
    });
  });
}

// ─── ACTIVE NAV ───────────────────────────────────────────
function updateActiveNav() {
  let cur = '';
  $$('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) cur = s.id;
  });
  $$('.nav-a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}

