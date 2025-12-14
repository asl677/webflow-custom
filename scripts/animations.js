// Portfolio Animations v12.2 - Smoother row-based stagger
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
    .p-line{display:inline}
  `;
  document.head.appendChild(css);
  
  // Split paragraphs into lines and hide all elements
  function hideElements() {
    // Split paragraphs with <br> into line spans
    document.querySelectorAll('p').forEach(p => {
      if (p.innerHTML.includes('<br>')) {
        const lines = p.innerHTML.split(/<br\s*\/?>/gi);
        p.innerHTML = lines.map(line => `<span class="p-line stagger-hide">${line}</span>`).join('<br>');
      } else if (p.children.length === 0 && p.textContent.trim()) {
        // Simple paragraph - wrap content
        p.innerHTML = `<span class="p-line stagger-hide">${p.innerHTML}</span>`;
      } else {
        p.classList.add('stagger-hide');
      }
    });
    // Hide other elements
    document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,a,.heading').forEach(el => {
      if (!el.closest('.stagger-hide') && !el.classList.contains('p-line')) {
        el.classList.add('stagger-hide');
      }
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
    // Just fill segments over time - don't wait for images
    const interval = setInterval(() => {
      fillSegment();
      if (filledCount >= SEGMENTS) {
          clearInterval(interval);
        finish();
      }
    }, 25); // Fill all 40 segments in ~1 second
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

    // Stagger reveal all elements - sorted by vertical position
    const elements = Array.from(document.querySelectorAll('.stagger-hide'));
    elements.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    
    // Reveal in batches based on vertical position
    let delay = 0;
    let lastTop = -1000;
    elements.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      // If same row (within 20px), use tiny delay; otherwise bigger delay
      if (Math.abs(top - lastTop) < 20) {
        delay += 10; // Same row - tiny gap
  } else {
        delay += 40; // New row - bigger gap
      }
      lastTop = top;
          setTimeout(() => {
        el.classList.remove('stagger-hide');
        el.classList.add('stagger-show');
      }, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
      } else {
    onReady();
  }
  })();
  