// Portfolio Animations v13.1 - Force text before images
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
  
  // Hide all elements immediately
  function hideElements() {
    document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading').forEach(el => {
      el.classList.add('stagger-hide');
    });
  }
  if (document.body) hideElements();
  else document.addEventListener('DOMContentLoaded', hideElements);

  // Use existing bar from inline script OR create new one
  let bar = document.getElementById('preloader-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'preloader-bar';
    bar.style.width = '100%';
    for (let i = 0; i < SEGMENTS; i++) {
      const seg = document.createElement('div');
      seg.className = 'seg';
      bar.appendChild(seg);
    }
  }

  // Use existing count from inline script OR start fresh
  let filledCount = window._preloaderCount || 0;
  let complete = false;
  const segs = window._preloaderSegs || bar.querySelectorAll('.seg');

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
    // Fill segments quickly - 500ms total
    const interval = setInterval(() => {
      fillSegment();
      if (filledCount >= SEGMENTS) {
          clearInterval(interval);
        finish();
      }
    }, 12); // Fill all 40 segments in ~500ms
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

    // Separate text and images
    const allElements = Array.from(document.querySelectorAll('.stagger-hide'));
    const textElements = allElements.filter(el => !el.classList.contains('reveal-wrap'));
    const imageElements = allElements.filter(el => el.classList.contains('reveal-wrap'));
    
    // Sort both by vertical position
    textElements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    imageElements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    
    // TEXT FIRST - starts at 0ms
    textElements.forEach((el, i) => {
          setTimeout(() => {
        el.classList.remove('stagger-hide');
        el.classList.add('stagger-show');
      }, i * 30);
    });
    
    // IMAGES AFTER - minimum 300ms delay, then start
    const imageStartDelay = Math.max(300, Math.floor(textElements.length * 30 / 2));
    imageElements.forEach((el, i) => {
        setTimeout(() => {
        el.classList.remove('stagger-hide');
        el.classList.add('stagger-show');
      }, imageStartDelay + (i * 50));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
      } else {
    onReady();
  }
  })();
  