// Theme toggle with prefers-color-scheme and localStorage persistence
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const isLight = stored ? stored === 'light' : systemPrefersLight;
  if (isLight) document.documentElement.classList.add('light');
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
      const nowLight = document.documentElement.classList.contains('light');
      localStorage.setItem('theme', nowLight ? 'light' : 'dark');
    });
  }
})();

// Mobile nav
(function initNav() {
  const btn = document.getElementById('nav-toggle');
  const list = document.getElementById('nav-list');
  if (!btn || !list) return;
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
})();

// Footer year (optional element)
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add('visible');
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// Fetch JSON data and render Publications and Projects
async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

function normalize(str) {
  return (str || '').toLowerCase();
}

// Publications
(async function initPublications() {
  const listEl = document.getElementById('pubs-list');
  if (!listEl) return;
  let publications = [];
  try {
    publications = await fetchJSON('data/publications.json');
  } catch (e) {
    console.warn('Publications missing', e);
  }
  // Populate years
  const yearSelect = document.getElementById('pubs-year');
  const years = Array.from(new Set(publications.map(p => p.year))).sort((a,b) => b - a);
  for (const y of years) {
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    yearSelect.appendChild(opt);
  }
  const typeBoxes = Array.from(document.querySelectorAll('input[name="type"]'));
  const searchInput = document.getElementById('pubs-search');

  function render() {
    const query = normalize(searchInput.value);
    const year = yearSelect.value;
    const activeTypes = new Set(typeBoxes.filter(b => b.checked).map(b => b.value));
    const filtered = publications.filter(p => {
      if (year !== 'all' && String(p.year) !== year) return false;
      if (!activeTypes.has(p.type)) return false;
      const hay = normalize([p.title, p.venue, (p.keywords || []).join(' ')].join(' '));
      return hay.includes(query);
    });
    listEl.innerHTML = '';
    for (const p of filtered) {
      const li = document.createElement('li');
      const authors = p.authors?.join(', ');
      li.innerHTML = `
        <span class="pub-title">${p.title}</span>
        <span class="pub-meta"> — ${authors} • ${p.venue} • ${p.year} • ${p.type}</span>
        <span class="pub-links">
          ${p.doi ? `<a href="${p.doi}" target="_blank" rel="noopener">DOI</a>` : ''}
          ${p.pdf ? `<a href="${p.pdf}" target="_blank" rel="noopener">PDF</a>` : ''}
          ${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code</a>` : ''}
        </span>`;
      listEl.appendChild(li);
    }
  }

  searchInput.addEventListener('input', render);
  yearSelect.addEventListener('change', render);
  typeBoxes.forEach(b => b.addEventListener('change', render));
  render();
})();

// Projects
(async function initProjects() {
  const gridEl = document.getElementById('projects-grid');
  const tagsEl = document.getElementById('projects-tags');
  const searchEl = document.getElementById('projects-search');
  if (!gridEl || !tagsEl || !searchEl) return;
  let projects = [];
  try {
    projects = await fetchJSON('data/projects.json');
  } catch (e) {
    console.warn('Projects missing', e);
  }
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || []))).sort();
  let activeTag = 'All';

  function renderTags() {
    tagsEl.innerHTML = '';
    const tags = ['All', ...allTags];
    for (const tag of tags) {
      const b = document.createElement('button');
      b.className = 'chip' + (tag === activeTag ? ' active' : '');
      b.textContent = tag;
      b.addEventListener('click', () => { activeTag = tag; render(); renderTags(); });
      tagsEl.appendChild(b);
    }
  }

  function render() {
    const query = normalize(searchEl.value);
    const filtered = projects.filter(p => {
      const matchesTag = activeTag === 'All' || (p.tags || []).includes(activeTag);
      if (!matchesTag) return false;
      const hay = normalize([p.title, p.description, (p.tags || []).join(' ')].join(' '));
      return hay.includes(query);
    });
    gridEl.innerHTML = '';
    for (const p of filtered) {
      const card = document.createElement('article');
      card.className = 'project-card reveal visible';
      card.innerHTML = `
        <div class="project-thumb" style="background-image: linear-gradient(135deg, var(--accent), transparent), url('${p.thumbnail || 'assets/placeholder.svg'}')"></div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">${(p.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
          <div class="project-links">
            ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : ''}
            ${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code</a>` : ''}
            ${p.paper ? `<a href="${p.paper}" target="_blank" rel="noopener">Paper</a>` : ''}
          </div>
        </div>`;
      gridEl.appendChild(card);
    }
  }

  searchEl.addEventListener('input', render);
  renderTags();
  render();
})();


