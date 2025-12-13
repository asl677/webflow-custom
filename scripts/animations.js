// Portfolio Animations v11.3 - Stagger text and links too
(function() {
  const SEGMENTS = 40;
  
  // CSS
  const css = document.createElement('style');
  css.textContent = `
    html.lenis{height:auto}
    .lenis.lenis-smooth{scroll-behavior:auto}
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;gap:0}
    #preloader-bar .seg{height:1px;background:#fff;opacity:0;flex:1}
    #preloader-bar .seg.filled{opacity:1}
    .reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading{opacity:0!important}
    .reveal-wrap.visible,h1.visible,h2.visible,h3.visible,h4.visible,h5.visible,h6.visible,p.visible,a.visible,.heading.visible{opacity:1!important}
  `;
  document.head.appendChild(css);

  // Create segmented bar
  const bar = document.createElement('div');
  bar.id = 'preloader-bar';
  bar.style.width = '100%';
  for (let i = 0; i < SEGMENTS; i++) {
    const seg = document.createElement('div');
    seg.className = 'seg';
    bar.appendChild(seg);
  }

  let filledCount = 0;
  let complete = false;

  function fillSegment() {
    if (filledCount >= SEGMENTS || complete) return;
    const segs = bar.querySelectorAll('.seg');
    if (segs[filledCount]) {
      segs[filledCount].classList.add('filled');
      filledCount++;
    }
  }

  function fillRemaining() {
    while (filledCount < SEGMENTS) {
      fillSegment();
    }
  }

  function finish() {
    if (complete) return;
    complete = true;
    fillRemaining();
    bar.remove(); // Instant removal, no fade
    init();
  }

  function onReady() {
    document.body.prepend(bar);
    
    const images = document.querySelectorAll('img:not(.preview)');
    const total = images.length;
    
    if (total === 0) {
      // No images - fill segments over time
    const interval = setInterval(() => {
        fillSegment();
        if (filledCount >= SEGMENTS) {
          clearInterval(interval);
          finish();
        }
      }, 30);
      return;
    }
    
    let loaded = 0;
    const segsPerImage = SEGMENTS / total;

    function onLoad() {
      loaded++;
      const targetSegs = Math.floor(loaded * segsPerImage);
      while (filledCount < targetSegs && filledCount < SEGMENTS) {
        fillSegment();
      }
      if (loaded >= total) finish();
    }

    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
    } else {
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onLoad);
      }
    });

    setTimeout(finish, 10000); // Fallback
  }

  function init() {
    // Lenis
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
    }

    // Timer
    const timeText = document.getElementById('time-text');
    if (timeText) {
      const update = () => {
        const n = new Date();
        timeText.textContent = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
      };
      update();
      setInterval(update, 1000);
    }

    // Rotator
    const rotating = document.getElementById('rotating-text');
    if (rotating) {
    const texts = ['DC', 'SF', 'LA'];
      let i = 0;
      setInterval(() => { i = (i + 1) % texts.length; rotating.textContent = texts[i]; }, 2000);
    }

    // Stagger all elements
    const elements = document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading');
    elements.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 50);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
  })();
  