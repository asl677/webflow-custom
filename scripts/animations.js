// Portfolio Animations v10.3 - Preloader starts immediately
document.write('<style>#line-preloader{position:fixed;top:0;left:0;height:1px;background:#fff;z-index:99999;width:0}.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading{opacity:0}.anim-visible{opacity:1!important}</style><div id="line-preloader"></div><script>var _lp=document.getElementById("line-preloader"),_p=0;(function _f(){if(_p<30){_p++;_lp.style.width=_p+"%";setTimeout(_f,30)}})();<\/script>');

(function() {
  const line = document.getElementById('line-preloader');
  if (!line) return;
  
  let complete = false;
  let imagesLoaded = 0;
  let totalImages = 0;

  function getProgress() {
    return parseInt(line.style.width) || 0;
  }

  function setProgress(p) {
    line.style.width = p + '%';
  }

  function updateFromImages() {
    if (complete) return;
    const current = getProgress();
    const imagePercent = totalImages > 0 ? (imagesLoaded / totalImages) * 65 : 65;
    const target = Math.floor(30 + imagePercent);
    if (target > current) setProgress(target);
    if (imagesLoaded >= totalImages && totalImages > 0) finishPreloader();
  }

  function finishPreloader() {
    if (complete) return;
    complete = true;
    setProgress(100);
        setTimeout(() => {
      line.style.opacity = '0';
      setTimeout(() => { line.remove(); startAnimations(); }, 100);
        }, 100);
  }

  function onReady() {
    const current = getProgress();
    if (current < 30) setProgress(30);
    
    const images = document.querySelectorAll('img:not(.preview)');
    totalImages = images.length;
    
    if (totalImages === 0) {
      let p = 30;
      const iv = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 95) { clearInterval(iv); finishPreloader(); }
      }, 40);
      return;
    }
    
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) imagesLoaded++;
      else {
        img.addEventListener('load', () => { imagesLoaded++; updateFromImages(); });
        img.addEventListener('error', () => { imagesLoaded++; updateFromImages(); });
      }
    });
    updateFromImages();
    setTimeout(() => { if (!complete) finishPreloader(); }, 8000);
  }

  function startAnimations() {
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
    }

    const timeText = document.getElementById('time-text');
    if (timeText) {
      (function update() {
        const now = new Date();
        timeText.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      })();
      setInterval(() => {
        const now = new Date();
        timeText.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    }, 1000);
    }

    const rotating = document.getElementById('rotating-text');
    if (rotating) {
    const texts = ['DC', 'SF', 'LA'];
      let i = 0;
      setInterval(() => { i = (i + 1) % texts.length; rotating.textContent = texts[i]; }, 2000);
    }

    document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading').forEach((el, i) => {
      setTimeout(() => el.classList.add('anim-visible'), i * 50);
    });
  }

  const style = document.createElement('style');
  style.textContent = 'html.lenis{height:auto}.lenis.lenis-smooth{scroll-behavior:auto}';
  document.head.appendChild(style);
  
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady);
  else onReady();
  })();
  