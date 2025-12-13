// Portfolio Animations v10.1 - Timer, Rotator, Stagger, Lenis, Instant Preloader
// Immediate CSS + preloader injection with initial progress
document.write(`
<style id="pre-anim">
.reveal-wrap,h1,h2,h3,h4,h5,h6,p:not(#preloader p),a,.heading{opacity:0}
.anim-visible{opacity:1!important}
#line-preloader{position:fixed;top:0;left:0;height:1px;background:#fff;z-index:99999;width:5%}
</style>
<div id="line-preloader"></div>
<script>
(function(){
  var line = document.getElementById('line-preloader');
  var p = 5;
  var iv = setInterval(function(){
    p += 2 + Math.floor(Math.random() * 3);
    if (p > 40) { clearInterval(iv); return; }
    line.style.width = p + '%';
  }, 100);
  window._preloaderInterval = iv;
  window._preloaderProgress = function(){ return p; };
})();
</script>
`);

(function() {
  const line = document.getElementById('line-preloader');
  let loaded = 0;
  let total = 0;
  let complete = false;
  let currentWidth = window._preloaderProgress ? window._preloaderProgress() : 5;

  // Stop the initial animation
  if (window._preloaderInterval) clearInterval(window._preloaderInterval);

  function updateProgress() {
    if (!line || complete) return;
    
    // Map progress: 40% reserved for initial, 40-95% for images
    const imageProgress = total > 0 ? (loaded / total) * 55 : 0;
    const targetWidth = Math.floor(40 + imageProgress);
    
    if (targetWidth > currentWidth) {
      currentWidth = targetWidth;
      line.style.width = currentWidth + '%';
    }
    
    if (loaded >= total && total > 0) {
      setTimeout(completePreloader, 100);
    }
  }

  function completePreloader() {
    if (complete) return;
    complete = true;
    line.style.width = '100%';
    setTimeout(() => {
      line.style.opacity = '0';
      setTimeout(() => line.remove(), 100);
      startAnimations();
    }, 150);
  }

  function trackImages() {
    if (window._preloaderInterval) clearInterval(window._preloaderInterval);
    
    const images = document.querySelectorAll('img:not(.preview)');
    total = images.length;
    
    // Jump to 40% (initial phase done)
    currentWidth = 40;
    line.style.width = '40%';
    
    if (total === 0) {
      // No images, quick fill to complete
      let progress = 40;
      const fakeInterval = setInterval(() => {
        progress += 5 + Math.floor(Math.random() * 8);
        if (progress >= 95) {
          clearInterval(fakeInterval);
          completePreloader();
        } else {
          line.style.width = progress + '%';
        }
      }, 60);
      return;
    }

    // Track image loading
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        loaded++;
      } else {
        img.addEventListener('load', () => { loaded++; updateProgress(); });
        img.addEventListener('error', () => { loaded++; updateProgress(); });
      }
    });
    
    updateProgress();

    // Fallback timeout
    setTimeout(() => {
      if (!complete) completePreloader();
    }, 8000);
  }

  function startAnimations() {
    // Initialize Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
      });
      
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Military time
    const timeText = document.getElementById('time-text');
    if (timeText) {
      const update = () => {
        const now = new Date();
        timeText.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      };
      update();
      setInterval(update, 1000);
    }

    // SF/LA/DC rotator
    const rotating = document.getElementById('rotating-text');
    if (rotating) {
      const texts = ['DC', 'SF', 'LA'];
      let i = 0;
      setInterval(() => {
        i = (i + 1) % texts.length;
        rotating.textContent = texts[i];
      }, 2000);
    }

    // Stagger all elements - instant opacity 0 to 1
    const elements = document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading');
    elements.forEach((el, i) => {
      setTimeout(() => el.classList.add('anim-visible'), i * 50);
    });
  }

  // Additional CSS
  const style = document.createElement('style');
  style.textContent = `
    html.lenis{height:auto}
    .lenis.lenis-smooth{scroll-behavior:auto}
  `;
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackImages);
  } else {
    trackImages();
  }
})();
