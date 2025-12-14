// Portfolio Animations v16.0 - Real image preloader
(function() {
  // Block everything until preloader done
  document.documentElement.classList.add('loading');
  
  // CSS - hide content during load
  document.head.insertAdjacentHTML('beforeend', `<style>
    html.loading body>*:not(#preloader-bar){opacity:0!important}
    html.loading *{animation-play-state:paused!important;transition:none!important}
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;background:transparent;flex:1}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

  const SEGMENTS = 40;
  let bar, segs, filled = 0, complete = false;

  // Create bar
  bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < SEGMENTS; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  segs = bar.querySelectorAll('.seg');
  
  (function addBar() { document.body ? document.body.prepend(bar) : requestAnimationFrame(addBar); })();

  function fillTo(target) {
    while (filled < target && filled < SEGMENTS) {
      segs[filled++].classList.add('filled');
    }
  }

  function finish() {
    if (complete) return;
    complete = true;
    fillTo(SEGMENTS);
    bar.remove();
    document.documentElement.classList.remove('loading');
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
    
    // Fallback - max 4 seconds
    setTimeout(finish, 4000);
  }

  function initTimerRotator() {
    // Timer
    const time = document.getElementById('time-text');
    if (time) { const u = () => { const d = new Date(); time.textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':'); }; u(); setInterval(u, 1000); }
    
    // Rotator
    const rot = document.getElementById('rotating-text');
    if (rot) { const t = ['DC','SF','LA']; let i = 0; setInterval(() => { i = (i+1) % 3; rot.textContent = t[i]; }, 2000); }
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', trackImages) : trackImages();
  })();
  