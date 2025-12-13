// Portfolio Animations v9.7 - Timer, Rotator, Stagger, Lenis, Real Preloader
// Immediate CSS + preloader injection
document.write(`
<style id="pre-anim">
.reveal-wrap,h1,h2,h3,h4,h5,h6,p:not(#preloader p),a,.heading{opacity:0}
.anim-visible{opacity:1!important}
#line-preloader{position:fixed;top:0;left:0;height:1px;background:#fff;z-index:99999;width:0;transition:width 0.3s ease-out}
</style>
<div id="line-preloader"></div>
`);

(function() {
  const line = document.getElementById('line-preloader');
  let loaded = 0;
  let total = 0;
  let complete = false;

  function updateProgress() {
    if (!line || complete) return;
    const progress = total > 0 ? (loaded / total) * 100 : 0;
    line.style.width = progress + '%';
    
    if (loaded >= total && total > 0) {
      completePreloader();
    }
  }

  function completePreloader() {
    if (complete) return;
    complete = true;
    line.style.width = '100%';
        setTimeout(() => {
      line.style.transition = 'opacity 0.3s';
      line.style.opacity = '0';
      setTimeout(() => line.remove(), 300);
      startAnimations();
    }, 200);
  }

  function trackImages() {
    const images = document.querySelectorAll('img:not(.preview)');
    total = images.length;
    
    if (total === 0) {
      completePreloader();
          return;
        }
        
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        loaded++;
        updateProgress();
      } else {
        img.addEventListener('load', () => {
          loaded++;
          updateProgress();
        });
        img.addEventListener('error', () => {
          loaded++;
          updateProgress();
        });
      }
    });
    
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
  