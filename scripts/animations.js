// Portfolio Animations v16.6 - Overlay approach for Webflow IX2
(function() {
  // CSS
  document.head.insertAdjacentHTML('beforeend', `<style>
    #preloader-overlay{position:fixed;inset:0;background:#000;z-index:99998}
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;background:transparent;flex:1}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

  const SEGMENTS = 40;
  const MIN_DURATION = 1000;
  let bar, overlay, segs, filled = 0, complete = false, startTime;

  // Create overlay and bar
  overlay = document.createElement('div');
  overlay.id = 'preloader-overlay';
  
  bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < SEGMENTS; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  segs = bar.querySelectorAll('.seg');
  
  // Add immediately
  function addElements() {
    if (document.body) {
      document.body.prepend(bar);
      document.body.prepend(overlay);
      } else {
      requestAnimationFrame(addElements);
    }
  }
  addElements();

  function fillTo(target) {
    while (filled < target && filled < SEGMENTS) {
      segs[filled++].classList.add('filled');
    }
  }

  function finish() {
    if (complete) return;
    complete = true;
    fillTo(SEGMENTS);
    // Wait 500ms then remove overlay
        setTimeout(() => {
      overlay.remove();
      bar.remove();
      initTimerRotator();
          }, 500);
        }

  function trackImages() {
    startTime = Date.now();
    const images = Array.from(document.querySelectorAll('img'));
    
    let loaded = 0;
    const total = images.length || 1;
    let imagesReady = false;
    
    const animateFill = () => {
      if (complete) return;
      const elapsed = Date.now() - startTime;
      const timeProgress = Math.min(elapsed / MIN_DURATION, 1);
      const imageProgress = loaded / total;
      const progress = Math.floor(Math.min(timeProgress, imageProgress) * SEGMENTS);
      fillTo(progress);
      
      if (timeProgress >= 1 && imagesReady) {
        finish();
      } else {
        requestAnimationFrame(animateFill);
      }
    };
    
    const onLoad = () => {
      loaded++;
      if (loaded >= total) imagesReady = true;
    };
    
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
          } else {
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true });
      }
    });
    
    if (images.length === 0) imagesReady = true;
    animateFill();
    
    setTimeout(finish, 4000);
  }

  function initTimerRotator() {
    const time = document.getElementById('time-text');
    if (time) { const u = () => { const d = new Date(); time.textContent = [d.getHours(),d.getMinutes(),d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':'); }; u(); setInterval(u, 1000); }
    
    const rot = document.getElementById('rotating-text');
    if (rot) { const t = ['DC','SF','LA']; let i = 0; setInterval(() => { i = (i+1) % 3; rot.textContent = t[i]; }, 2000); }
  }

  if (document.readyState === 'complete') {
    trackImages();
      } else {
    window.addEventListener('load', trackImages);
  }
  })();
  