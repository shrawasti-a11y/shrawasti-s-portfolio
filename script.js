// ===== GALAXY BACKGROUND =====
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: Math.random(),
    vy: Math.random()
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x > canvas.width || p.x < 0) p.vx *= -1;
    if (p.y > canvas.height || p.y < 0) p.vy *= -1;

    ctx.fillRect(p.x, p.y, 2, 2);

    for (let j = i + 1; j < particles.length; j++) {
      let dx = p.x - particles[j].x;
      let dy = p.y - particles[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = "rgba(56,189,248,0.1)";
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(draw);
}
draw();

// CURSOR
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e=>{
  cursor.style.top = e.clientY + 'px';
  cursor.style.left = e.clientX + 'px';
});

// DARK MODE
function toggleDark(){
  document.body.classList.toggle('dark');
}

// TYPING
let text = "AI Developer | Creative Engineer | Future Innovator";
let index = 0;

function type(){
  if(index < text.length){
    document.getElementById("typing").innerHTML += text[index++];
    setTimeout(type, 40);
  }
}
type();

// SCROLL
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth'});
}

// GITHUB PROJECTS
const username = "YOUR_GITHUB_USERNAME";

fetch(`https://api.github.com/users/${username}/repos`)
.then(res => res.json())
.then(data => {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = "";

  data.slice(0,6).forEach(repo => {
    let div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description"}</p>
      <a href="${repo.html_url}" target="_blank">View 🔗</a>
    `;
    grid.appendChild(div);
  });
});

// GAME
let score = 0;
function increaseScore(){
  score++;
  document.getElementById("score").innerText = score;
}

// CHATBOT
function toggleChat(){
  let box = document.getElementById('chatbox');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

function reply(){
  let input = document.getElementById('userInput').value.toLowerCase();
  let response = "";

  if(input.includes("skills")) response = "C, Python, HTML, CSS, JS";
  else if(input.includes("projects")) response = "Check the projects section!";
  else if(input.includes("ai")) response = "She builds AI-based solutions";
  else response = "Ask about skills, projects or AI";

  document.getElementById('botReply').innerText = response;
}

// SKILL ANIMATION
const bars = document.querySelectorAll('.bar div');
window.addEventListener('scroll', ()=>{
  bars.forEach(bar=>{
    bar.style.width = bar.getAttribute('style').replace('width:', '');
  });
});
