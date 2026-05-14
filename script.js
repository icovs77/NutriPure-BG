// ============================================================
// NutriPure BG – script.js  v2.0
// ============================================================

// ---- 1. CUSTOM CURSOR ----
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

// Ring следва с леко закъснение (smooth lag)
(function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

// Уголемяване при hover на интерактивни елементи
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});


// ---- 2. SCROLL PROGRESS BAR ----
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - innerHeight);
  bar.style.width = (pct * 100) + '%';
}, { passive: true });


// ---- 3. НАВИГАЦИЯ – ЕФЕКТ ПРИ СКРОЛ ----
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


// ---- 4. МОБИЛНО МЕНЮ ----
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
});

// Затваря при клик на линк
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});


// ---- 5. REVEAL АНИМАЦИИ ПРИ СКРОЛ ----
// Наблюдава всички елементи с клас reveal / reveal-l / reveal-r
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Малко закъснение за всеки следващ елемент (stagger ефект)
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('in'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach((el, i) => {
  // Ако няма зададено закъснение, изчисляваме автоматично по позиция
  if (!el.dataset.delay) {
    el.dataset.delay = (i % 4) * 80; // 0, 80, 160, 240ms
  }
  revealObserver.observe(el);
});


// ---- 6. БРОЯЧ НА СТАТИСТИКИТЕ ----
// Анимирано броене от 0 до целевото число
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = parseInt(e.target.dataset.count);
    const suffix = e.target.dataset.suffix || '+';
    let current = 0;
    const step   = target / 55;           // 55 стъпки
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        e.target.textContent = target + suffix;
        clearInterval(timer);
      } else {
        e.target.textContent = Math.floor(current);
      }
    }, 22);                               // ~22ms между стъпките
    counterObserver.unobserve(e.target);
  });
}, { threshold: 0.6 });

counters.forEach(c => counterObserver.observe(c));


// ---- 7. АКТИВЕН ЛИНК В НАВИГАЦИЯТА ----
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });


// ---- 8. ФОРМА – AJAX ИЗПРАЩАНЕ ----
const form    = document.getElementById('inquiryForm');
const formOk  = document.getElementById('formOk');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btnSpan = form.querySelector('.btn-gold span');
    if (btnSpan) btnSpan.textContent = 'Изпращане...';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        formOk.style.display = 'block';
        form.reset();
        if (btnSpan) btnSpan.textContent = 'Изпрати запитване';
        setTimeout(() => formOk.style.display = 'none', 6000);
      } else {
        alert('Грешка при изпращане. Опитайте отново.');
        if (btnSpan) btnSpan.textContent = 'Изпрати запитване';
      }
    } catch {
      alert('Няма интернет връзка. Проверете и опитайте отново.');
      if (btnSpan) btnSpan.textContent = 'Изпрати запитване';
    }
  });
}
