// Portfolio Animations v10.7 - No content hiding
(function() {
  // Lenis CSS only
  const css = document.createElement('style');
  css.textContent = `
    html.lenis{height:auto}
    .lenis.lenis-smooth{scroll-behavior:auto}
  `;
  document.head.appendChild(css);

  // Get existing preloader (created in Webflow head code) or create one
  let line = document.getElementById('line-preloader');
  if (!line) {
    line = document.createElement('div');
    line.id = 'line-preloader';
    line.style.cssText = 'position:fixed;top:0;left:0;height:1px;background:#fff;z-index:99999;width:0%';
    document.body ? document.body.prepend(line) : document.addEventListener('DOMContentLoaded', () => document.body.prepend(line));
  }

  // Use global progress from inline script if exists, otherwise start fresh
  let progress = window._p || 0;
  let complete = false;

  function finish() {
    if (complete) return;
    complete = true;
    line.style.width = '100%';
        setTimeout(() => {
      line.style.opacity = '0';
      setTimeout(() => line.remove(), 150);
      startAnimations();
        }, 100);
  }

  function onReady() {
    const images = document.querySelectorAll('img:not(.preview)');
    let loaded = 0;
    const total = images.length;

    if (total === 0) {
      setTimeout(finish, 500);
          return;
        }
        
    function checkComplete() {
      loaded++;
      const imgProgress = 30 + (loaded / total) * 60;
      if (imgProgress > progress) {
        progress = imgProgress;
        line.style.width = progress + '%';
      }
      if (loaded >= total) finish();
    }

    images.forEach(img => {
      if (img.complete) checkComplete();
      else {
        img.addEventListener('load', checkComplete);
        img.addEventListener('error', checkComplete);
      }
    });

    setTimeout(finish, 8000); // Fallback
  }

  function startAnimations() {
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

    // Content is visible by default - no stagger needed
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
  })();
  