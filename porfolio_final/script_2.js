// ── Init Lucide icons ──
lucide.createIcons();

// ── Typing animation ──
const roles = ["AI Student", "System Engineer", "ML Enthusiast", "Problem Solver"];
let roleIndex = 0, charIndex = 0, deleting = false;
const el = document.getElementById('typing-text');

function type() {
  const current = roles[roleIndex];
  if (!deleting && charIndex <= current.length) {
    el.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) { setTimeout(() => { deleting = true; type(); }, 2000); return; }
  } else if (deleting && charIndex >= 0) {
    el.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; charIndex = 0; }
  }
  setTimeout(type, deleting ? 40 : 80);
}
type();

// ── Skills ──
const skills = [
  { name: "Python", level: 90 },
  { name: "C++", level: 80 },
  { name: "Java", level: 75 },
  { name: "PyTorch / ML", level: 85 },
  { name: "CNNs / Neural Networks", level: 85 },
  { name: "HTML / DBMS", level: 70 },
  { name: "NumPy / Pandas", level: 88 },
  { name: "XGBoost / Naive Bayes", level: 78 },
];
const grid = document.getElementById('skills-grid');
skills.forEach(s => {
  grid.innerHTML += `
    <div class="skill-item">
      <div class="skill-head"><span>${s.name}</span><span>${s.level}%</span></div>
      <div class="skill-bar-bg"><div class="skill-bar-fill" data-level="${s.level}"></div></div>
    </div>`;
});

// ── Scroll reveal + skill bars ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // animate skill bars when about section becomes visible
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.level + '%';
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

// ── Scroll progress ──
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ── Cursor glow (desktop) ──
const glow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ── Hamburger menu ──
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav-links').classList.remove('open'));
});

// ── Contact form ──
/*
function submitForm() {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-msg').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let ok = true;

  const show = (id, cond) => {
    document.getElementById(id).classList.toggle('show', cond);
    if (cond) ok = false;
  };
  show('err-name',  !name);
  show('err-email', !email || !emailRe.test(email));
  show('err-msg',   !msg);

  if (!ok) return;
  document.getElementById('f-name').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-msg').value = '';

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
*/
function submitForm() {
  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg   = document.getElementById('f-msg').value.trim();

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let ok = true;

  const show = (id, cond) => {
    document.getElementById(id).classList.toggle('show', cond);
    if (cond) ok = false;
  };

  show('err-name',  !name);
  show('err-email', !email || !emailRe.test(email));
  show('err-msg',   !msg);

  if (!ok) return;

  // ✅ SEND EMAIL USING EMAILJS
  emailjs.send("service_sh7px8k", "template_b9w4fp6", {
    name: name,
    email: email,
    message: msg
  })
  .then(() => {
    document.getElementById('f-name').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-msg').value = '';

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  })
  .catch((error) => {
    console.error("FAILED...", error);
    alert("Failed to send message.");
  });
}
// ── Particle background ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    const palette = ['250,90%,65%', '200,100%,55%', '280,80%,60%'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  // draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();
/*
function sendMail(){
  let parms = {
    name : document-getElementById("err-name").value, 
    email: document.getElementById("err-email").value, 
    message : document-getElementById ("err-msg").value,
    }

    emailjs.send("service_sh7px8k","template_b9w4fp6",parms).then(alert("Email sent!!"))
}
*/
// ── macOS Floating Dock ──
(function () {
  const dock = document.getElementById('floating-dock');
  if (!dock) return;
  const items = Array.from(dock.querySelectorAll('.dock-item'));
  const HERO_THRESHOLD = () => (document.getElementById('home')?.offsetHeight ?? 400) * 0.5;

  // Show / hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > HERO_THRESHOLD()) {
      dock.classList.add('dock-visible');
    } else {
      dock.classList.remove('dock-visible');
    }
  }, { passive: true });

  // macOS magnification on mousemove
  const MAX_SCALE   = 1.75;  // max scale for hovered item
  const REACH       = 110;   // px radius of magnification influence

  dock.addEventListener('mousemove', e => {
    items.forEach(item => {
      const rect   = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist   = Math.abs(e.clientX - center);
      const scale  = dist < REACH
        ? 1 + (MAX_SCALE - 1) * Math.cos((dist / REACH) * (Math.PI / 2))
        : 1;
      item.style.transform = `scale(${scale.toFixed(3)})`;
    });
  });

  dock.addEventListener('mouseleave', () => {
    items.forEach(item => { item.style.transform = 'scale(1)'; });
  });
})();
