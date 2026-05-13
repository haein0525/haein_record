const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  if (!cursor) return;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a,button,.work-card,.about-photo-frame').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
});

const sparkles = document.getElementById('sparkles');
if (sparkles) {
  for (let i = 0; i < 34; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle-dot';
    s.textContent = Math.random() > .55 ? '✦' : '·';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.setProperty('--dur', 4 + Math.random() * 7 + 's');
    s.style.setProperty('--delay', -Math.random() * 9 + 's');
    s.style.fontSize = 6 + Math.random() * 9 + 'px';
    sparkles.appendChild(s);
  }
}

const nav = document.getElementById('nav');
const links = [...document.querySelectorAll('.nav-links a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > 40);
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 180) current = '#' + sec.id;
  });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
});

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  navLinks?.classList.toggle('open');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn?.classList.remove('open');
  navLinks.classList.remove('open');
}));

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('visible');
}), { threshold: .14 });
document.querySelectorAll('.fade').forEach(el => io.observe(el));

const wrap = document.getElementById('windowWrap');
document.addEventListener('mousemove', e => {
  if (innerWidth < 721 || !wrap) return;
  const x = e.clientX / innerWidth - .5;
  const y = e.clientY / innerHeight - .5;
  wrap.style.transform = `translate(${x * 8}px,${y * 6}px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg)`;
});
document.addEventListener('mouseleave', () => {
  if (wrap) wrap.style.transform = '';
});

const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    workCards.forEach(card => {
      const categories = (card.dataset.category || '').split(' ');
      card.hidden = !(filter === 'all' || categories.includes(filter));
    });
  });
});

const works = window.WORKS || WORKS || [];
let currentWork = 0;
const modal = document.getElementById('workModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const modalPeriod = document.getElementById('modalPeriod');
const modalPercentText = document.getElementById('modalPercentText');
const modalGaugeBar = document.getElementById('modalGaugeBar');
const modalRole = document.getElementById('modalRole');

function renderModal(index) {
  if (!works.length) return;
  currentWork = (index + works.length) % works.length;
  const item = works[currentWork];
  modalImage.src = item.image;
  modalTitle.textContent = item.title;
  modalCategory.textContent = item.category;
  modalDesc.textContent = item.desc;
  modalPeriod.textContent = item.period;
  modalPercentText.textContent = item.contribution + '%';
  modalGaugeBar.style.width = item.contribution + '%';
  modalRole.textContent = item.role;
}
function openModal(index) {
  renderModal(index);
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
workCards.forEach(card => {
  card.addEventListener('click', () => {
    const index = Number(card.dataset.index || 0);
    const workId = card.dataset.id || works[index]?.id;

    if (window.innerWidth <= 720 && workId) {
      window.location.href = `detail.html?id=${workId}`;
      return;
    }

    openModal(index);
  });
});
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
document.querySelector('.modal-nav.prev')?.addEventListener('click', () => renderModal(currentWork - 1));
document.querySelector('.modal-nav.next')?.addEventListener('click', () => renderModal(currentWork + 1));
document.addEventListener('keydown', e => {
  if (!modal?.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') renderModal(currentWork - 1);
  if (e.key === 'ArrowRight') renderModal(currentWork + 1);
});
