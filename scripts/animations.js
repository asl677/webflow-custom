// Portfolio Animations v15.1 - Simplified
(function() {
  // CSS
  document.head.insertAdjacentHTML('beforeend', `<style>
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;background:transparent;flex:1}
    #preloader-bar .seg.filled{background:#fff}
    .stagger-hide{opacity:0!important}
    .stagger-show{opacity:1!important}
  </style>`);

  // Hide elements
  const hideAll = () => document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading').forEach(el => el.classList.add('stagger-hide'));
  document.body ? hideAll() : document.addEventListener('DOMContentLoaded', hideAll);

  // Preloader bar
  let bar = document.getElementById('preloader-bar'), count = window._preloaderCount || 0;
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'preloader-bar';
    for (let i = 0; i < 40; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  }
  const segs = window._preloaderSegs || bar.querySelectorAll('.seg');
  const fill = () => { if (count < 40) segs[count++].classList.add('filled'); };
  
  // Add bar and start filling
  (function addBar() { document.body ? document.body.prepend(bar) : requestAnimationFrame(addBar); })();
  
  function ready() {
    const interval = setInterval(() => { fill(); if (count >= 40) { clearInterval(interval); bar.remove(); stagger(); } }, 25);
  }

  function stagger() {
    // Timer
    const time = document.getElementById('time-text');
    if (time) { const u = () => { const d = new Date(); time.textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':'); }; u(); setInterval(u, 1000); }
    
    // Rotator
    const rot = document.getElementById('rotating-text');
    if (rot) { const t = ['DC','SF','LA']; let i = 0; setInterval(() => { i = (i+1) % 3; rot.textContent = t[i]; }, 2000); }
    
    // Sort elements by position
    const sort = (a,b) => { const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect(); return Math.abs(ar.top - br.top) < 10 ? ar.left - br.left : ar.top - br.top; };
    const all = Array.from(document.querySelectorAll('.stagger-hide'));
    const txt = all.filter(e => !e.classList.contains('reveal-wrap')).sort(sort);
    const img = all.filter(e => e.classList.contains('reveal-wrap')).sort(sort);
    
    // Text stagger (2.5s), then images (2.5s)
    const show = el => { el.classList.remove('stagger-hide'); el.classList.add('stagger-show'); };
    txt.forEach((el, i) => setTimeout(() => show(el), i * (2500 / Math.max(txt.length - 1, 1))));
    img.forEach((el, i) => setTimeout(() => show(el), 2500 + i * (2500 / Math.max(img.length - 1, 1))));
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready();
  })();
  