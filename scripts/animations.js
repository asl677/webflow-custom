// Portfolio Animations v11.6 - Stagger restored
(function() {
  const SEGMENTS = 40;
  
  // CSS
  const css = document.createElement('style');
  css.textContent = `
    html.lenis{height:auto}
    .lenis.lenis-smooth{scroll-behavior:auto}
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;gap:0;width:100%}
    #preloader-bar .seg{height:1px;background:transparent;flex:1}
    #preloader-bar .seg.filled{background:#fff}
    .stagger-hide{opacity:0!important}
    .stagger-show{opacity:1!important}
  `;
  document.head.appendChild(css);
  
  // Hide elements immediately
  function hideElements() {
    document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading').forEach(el => {
      el.classList.add('stagger-hide');
    });
  }
  if (document.body) hideElements();
  else document.addEventListener('DOMContentLoaded', hideElements);

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
  const segs = bar.querySelectorAll('.seg');

  function fillSegment() {
    if (filledCount >= SEGMENTS || complete) return;
    if (segs[filledCount]) {
      segs[filledCount].classList.add('filled');
      filledCount++;
    }
  }

  function fillRemaining() {
    while (filledCount < SEGMENTS) fillSegment();
  }

  function finish() {
    if (complete) return;
    complete = true;
    fillRemaining();
    bar.remove();
    init();
  }

  // Add bar immediately
  function addBar() {
    if (document.body) {
      document.body.prepend(bar);
      } else {
      requestAnimationFrame(addBar);
    }
  }
  addBar();

  function onReady() {
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

    // Stagger reveal all elements
    const elements = document.querySelectorAll('.stagger-hide');
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove('stagger-hide');
        el.classList.add('stagger-show');
      }, i * 50);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
  })();
  