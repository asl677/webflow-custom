// Portfolio Animations v16.1 - Fast preloader overlay
(function() {
  // CSS - preloader overlay on top, content visible underneath
  document.head.insertAdjacentHTML('beforeend', `<style>
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;background:transparent;flex:1}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

  const SEGMENTS = 40;
  let bar, segs, filled = 0, complete = false;

  // Create and add bar immediately
  bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < SEGMENTS; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  segs = bar.querySelectorAll('.seg');
  
  // Add bar as soon as possible
  if (document.body) {
    document.body.prepend(bar);
      } else {
    document.addEventListener('DOMContentLoaded', () => document.body.prepend(bar));
  }

  function fillTo(target) {
    while (filled < target && filled < SEGMENTS) {
      segs[filled++].classList.add('filled');
    }
  }

  function finish() {
    if (complete) return;
    complete = true;
    fillTo(SEGMENTS);
    setTimeout(() => bar.remove(), 100);
    initTimerRotator();
  }

  function trackImages() {
    const images = Array.from(document.querySelectorAll('img'));
    if (images.length === 0) { finish(); return; }
    
    let loaded = 0;
    const total = images.length;
    
    const onLoad = () => {
      loaded++;
      const progress = Math.floor((loaded / total) * SEGMENTS);
      fillTo(progress);
      if (loaded >= total) finish();
    };
    
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true });
      }
    });
    
    // Fallback - max 3 seconds
    setTimeout(finish, 3000);
  }

  function initTimerRotator() {
    // Timer
    const time = document.getElementById('time-text');
    if (time) { const u = () => { const d = new Date(); time.textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':'); }; u(); setInterval(u, 1000); }
    
    // Rotator
    const rot = document.getElementById('rotating-text');
    if (rot) { const t = ['DC','SF','LA']; let i = 0; setInterval(() => { i = (i+1) % 3; rot.textContent = t[i]; }, 2000); }
  }

  // Start tracking immediately
  if (document.readyState === 'complete') {
    trackImages();
      } else {
    window.addEventListener('load', trackImages);
  }
  })();
  