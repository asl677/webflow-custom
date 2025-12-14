// Portfolio Animations v15.9 - Block interactions during preload
(function() {
  // Block Webflow interactions until preloader done
  document.documentElement.classList.add('loading');
  
  // CSS
  document.head.insertAdjacentHTML('beforeend', `<style>
    html.loading *{animation-play-state:paused!important;transition:none!important}
    html.loading [data-w-id]{pointer-events:none!important}
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;background:transparent;flex:1}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

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
    const interval = setInterval(() => { fill(); if (count >= 40) { clearInterval(interval); bar.remove(); init(); } }, 10);
  }

  function init() {
    // Unblock Webflow interactions
    document.documentElement.classList.remove('loading');
    
    // Timer
    const time = document.getElementById('time-text');
    if (time) { const u = () => { const d = new Date(); time.textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':'); }; u(); setInterval(u, 1000); }
    
    // Rotator
    const rot = document.getElementById('rotating-text');
    if (rot) { const t = ['DC','SF','LA']; let i = 0; setInterval(() => { i = (i+1) % 3; rot.textContent = t[i]; }, 2000); }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', ready) : ready();
  })();
  