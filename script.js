 const loaderMessages = [
  'Initializing...', 'Loading assets...', 'Rendering portfolio...', 'Almost ready...'
];
const loaderBar = document.getElementById('loader-bar');
const loaderText = document.getElementById('loader-text');
let loadPct = 0;
let msgIdx = 0;
const loaderInterval = setInterval(() => {
  loadPct += Math.random() * 18 + 8;
  if (loadPct > 100) loadPct = 100;
  loaderBcar.style.width = loadPct + '%';
  if (msgIdx < loaderMessages.length - 1 && loadPct > (msgIdx + 1) * 25) {
    msgIdx++;
    loaderText.textContent = loaderMessages[msgIdx];
  }
  if (loadPct >= 100) {
    clearInterval(loaderInterval);
    loaderText.textContent = 'Welcome! ✨';
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
      startParticles();
      startTyping();
      initSkillBars();
    }, 500);
  }
}, 100);

/* ============================
   CURSOR GLOW
   ============================ */
const glow = document.getElementById('cursor-glow');
const dot = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  glow.style.left = glowX + 'px';
  glow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

document.querySelectorAll('a, button, .tilt-card, .stag, .gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.opacity = '0.7';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.width = '10px';
    dot.style.height = '10px';
    dot.style.opacity = '1';
  });
});

/* ============================
   SCROLL PROGRESS BAR
   ============================ */
window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct  = (window.scrollY / docH) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
  updateActiveNav();
  if (window.scrollY > 20) {
    document.getElementById('navbar').classList.add('scrolled');
  } else {
    document.getElementById('navbar').classList.remove('scrolled');
  }
});

/* ============================
   DARK MODE
   ============================ */
const darkBtn = document.getElementById('dark-toggle');
const saved = localStorage.getItem('theme');
if (saved === 'dark') { document.body.classList.add('dark'); darkBtn.textContent = '☀️'; }
darkBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  darkBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ============================
   HAMBURGER
   ============================ */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

/* ============================
   ACTIVE NAV
   ============================ */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-a');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ============================
   TYPING EFFECT
   ============================ */
const typedPhrases = [
  'CSE Student 🎓',
  'Python Learner 🐍',
  'AI Enthusiast 🤖',
  'Web Developer 🌐',
  'Problem Solver 💡',
  'Creative Thinker ✨'
];
let tpIdx = 0, tpChar = 0, tpDeleting = false;
const typedEl = document.getElementById('typed-text');

function startTyping() {
  function type() {
    const current = typedPhrases[tpIdx];
    if (tpDeleting) {
      typedEl.textContent = current.substring(0, tpChar - 1);
      tpChar--;
      if (tpChar === 0) {
        tpDeleting = false;
        tpIdx = (tpIdx + 1) % typedPhrases.length;
        setTimeout(type, 400);
        return;
      }
    } else {
      typedEl.textContent = current.substring(0, tpChar + 1);
      tpChar++;
      if (tpChar === current.length) {
        tpDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    }
    setTimeout(type, tpDeleting ? 60 : 90);
  }
  type();
}

/* ============================
   FLOATING PARTICLES (HOME)
   ============================ */
function startParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const colors = ['rgba(167,139,250,0.8)','rgba(244,114,182,0.8)','rgba(34,211,238,0.8)','rgba(251,191,36,0.8)','rgba(255,255,255,0.7)'];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*10+8}s;
      animation-delay:${Math.random()*8}s;
      filter: blur(${Math.random()*0.5}px);
    `;
    container.appendChild(p);
  }
}

/* ============================
   SKILL BARS ANIMATION
   ============================ */
function initSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill').forEach(fill => {
          fill.style.width = fill.dataset.pct + '%';
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const skillsSection = document.getElementById('skills');
  if (skillsSection) obs.observe(skillsSection);
}

/* ============================
   SCROLL REVEAL
   ============================ */
document.querySelectorAll('.about-card, .ach-card, .project-card, .gallery-item, .contact-card, .skill-item, .stag').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = (i % 6) * 80 + 'ms';
});
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================
   3D TILT EFFECT
   ============================ */
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 10;
    const rotY =  dx * 10;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    const shine = card.querySelector('.tilt-shine');
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(dx+1)*50}% ${(dy+1)*50}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
      shine.style.opacity = '1';
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    const shine = card.querySelector('.tilt-shine');
    if (shine) shine.style.opacity = '0';
  });
});

/* ============================
   PARALLAX SCROLLING
   ============================ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  const heroOrb = document.querySelector('.hero-orb');
  const heroPhoto = document.querySelector('.hero-photo-wrap');
  if (heroBg)   heroBg.style.transform   = `translateY(${scrollY * 0.3}px)`;
  if (heroOrb)  heroOrb.style.transform  = `translate(-50%,-50%) translateY(${scrollY * -0.2}px)`;
  if (heroPhoto && scrollY < window.innerHeight)
    heroPhoto.style.transform = `translateY(${scrollY * 0.1}px)`;
});

/* ============================
   APPLE-LIKE SMOOTH INERTIA SCROLLING
   ============================ */
let currentY = 0, targetY = 0, raf = null;
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (!isMobile) {
  document.body.style.overflow = 'hidden';
  const scroller = document.createElement('div');
  scroller.id = 'smooth-scroller';
  scroller.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;overflow-y:scroll;scrollbar-width:none;';
  scroller.style.msOverflowStyle = 'none';
  while (document.body.firstChild) scroller.appendChild(document.body.firstChild);
  document.body.appendChild(scroller);
  const fakeHeight = document.createElement('div');
  fakeHeight.id = 'fake-height';
  document.body.appendChild(fakeHeight);

  function updateHeight() {
    fakeHeight.style.height = scroller.scrollHeight + 'px';
  }
  updateHeight();
  new ResizeObserver(updateHeight).observe(scroller);

  window.addEventListener('scroll', () => { targetY = window.scrollY; });
  window.addEventListener('wheel', e => {
    e.preventDefault();
    targetY += e.deltaY;
    targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));
    window.scrollTo(0, targetY);
  }, { passive: false });

  function smoothLoop() {
    currentY += (targetY - currentY) * 0.1;
    if (Math.abs(targetY - currentY) < 0.5) currentY = targetY;
    scroller.scrollTop = currentY;
    raf = requestAnimationFrame(smoothLoop);
  }
  smoothLoop();
}

/* ============================
   LIGHTBOX
   ============================ */
function openLightbox(src, cap) {
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-cap').textContent = cap;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ============================
   AI CHATBOT
   ============================ */
function toggleChat() {
  const w = document.getElementById('chatbot-window');
  w.classList.toggle('open');
  if (w.classList.contains('open')) {
    document.getElementById('chat-input').focus();
  }
}
document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChat();
});

const botKnowledge = {
  greetings: ['hi','hello','hey','hii','helo'],
  skills: ['skill','know','language','programming','code','tech'],
  projects: ['project','built','made','work','portfolio','program'],
  certificates: ['certificate','cert','coursera','cisco','netacad','ai','python','physics','chemistry'],
  education: ['study','college','university','degree','btech','cse','year'],
  contact: ['contact','email','reach','linkedin','github'],
  about: ['who','about','yourself','shrawasti','introduce'],
};
const botResponses = {
  greetings: "Hi there! 👋 I'm Shrawasti's portfolio assistant. Ask me about her skills, projects, certificates, or how to contact her!",
  skills: "Shrawasti's key skills include:\n🔹 C Programming (80%)\n🔹 HTML & CSS (75%)\n🔹 Python (65%)\n🔹 JavaScript (55%)\n🔹 Discrete Mathematics (70%)\n🔹 AI & Machine Learning (50%)",
  projects: "Shrawasti has worked on:\n🌐 Digital Portfolio Website\n💻 C Programming Exercises\n📐 Discrete Mathematics Solutions\n🐍 Python Programming (Coursera)\n\nCheck the Projects section for details!",
  certificates: "Shrawasti holds these certificates:\n✅ Programming for Everybody — Univ. of Michigan (Coursera)\n✅ Engineering Physics Prerequisites — MIT VPU (Coursera)\n✅ Revisiting Chemistry — MIT VPU (Coursera)\n✅ Introduction to Modern AI — Cisco NetAcad",
  education: "Shrawasti is a 1st-year B.Tech CSE student at MIT Vishwaprayag University, Pune. She studies C Programming, Discrete Mathematics, Engineering Physics, and Chemistry.",
  contact: "You can reach Shrawasti at:\n📧 shrawasti@mitvpu.ac.in\n🐙 github.com/shrawasti\n💼 linkedin.com/in/shrawasti",
  about: "Shrawasti Vijay Dhole is a 1st-year B.Tech CSE student at MIT Vishwaprayag University. She's passionate about AI, web development, and problem-solving — with multiple Coursera and Cisco certifications already completed!",
  default: "I'm not sure about that, but I can answer questions about Shrawasti's skills, projects, certificates, education, or contact info. Try asking one of those! 😊"
};

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  addMsg(msg, 'user');

  // typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot chat-typing';
  typing.innerHTML = '<p>typing...</p>';
  document.getElementById('chat-messages').appendChild(typing);
  scrollChat();

  setTimeout(() => {
    typing.remove();
    const lower = msg.toLowerCase();
    let response = botResponses.default;
    for (const [key, keywords] of Object.entries(botKnowledge)) {
      if (keywords.some(kw => lower.includes(kw))) {
        response = botResponses[key];
        break;
      }
    }
    addMsg(response, 'bot');
  }, 900 + Math.random() * 400);
}

function addMsg(text, role) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
  document.getElementById('chat-messages').appendChild(div);
  scrollChat();
}
function scrollChat() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

