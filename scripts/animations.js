// Portfolio Animations v10.2 - Timer, Rotator, Stagger, Lenis, Preloader
// Immediate CSS + preloader
document.write(`
<style id="pre-anim">
.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading{opacity:0}
.anim-visible{opacity:1!important}
#line-preloader{position:fixed;top:0;left:0;height:1px;background:#fff;z-index:99999;width:0}
</style>
<div id="line-preloader"></div>
`);

(function() {
  const line = document.getElementById('line-preloader');
  if (!line) return;
  
  let progress = 0;
  let complete = false;
  let imagesLoaded = 0;
  let totalImages = 0;
  let domReady = false;

  // Start with slow initial progress immediately
  function initialProgress() {
    if (domReady || progress >= 30) return;
    progress += 1;
    line.style.width = progress + '%';
    setTimeout(initialProgress, 50);
  }
  initialProgress();

  function updateFromImages() {
    if (complete) return;
    
    // Calculate progress: 30% initial + 65% from images
    const imagePercent = totalImages > 0 ? (imagesLoaded / totalImages) * 65 : 65;
    const target = Math.floor(30 + imagePercent);
    
    if (target > progress) {
      progress = target;
      line.style.width = progress + '%';
    }
    
    if (imagesLoaded >= totalImages && totalImages > 0) {
      finishPreloader();
    }
  }

  function finishPreloader() {
    if (complete) return;
    complete = true;
    line.style.width = '100%';
        setTimeout(() => {
      line.style.opacity = '0';
    setTimeout(() => {
        line.remove();
        startAnimations();
          }, 100);
    }, 100);
  }

  function onDomReady() {
    domReady = true;
    
    // Jump to at least 30%
    if (progress < 30) {
      progress = 30;
      line.style.width = '30%';
    }
    
    const images = document.querySelectorAll('img:not(.preview)');
    totalImages = images.length;
    
    if (totalImages === 0) {
      // No images - animate to complete
      const fillInterval = setInterval(() => {
        progress += 5;
        line.style.width = progress + '%';
        if (progress >= 95) {
          clearInterval(fillInterval);
          finishPreloader();
        }
      }, 40);
      return;
    }
    
    images.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        imagesLoaded++;
      } else {
        img.addEventListener('load', () => { imagesLoaded++; updateFromImages(); });
        img.addEventListener('error', () => { imagesLoaded++; updateFromImages(); });
      }
    });
    
    updateFromImages();
    
    // Fallback
    setTimeout(() => { if (!complete) finishPreloader(); }, 8000);
  }

  function startAnimations() {
    // Lenis
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
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

    // Rotator
    const rotating = document.getElementById('rotating-text');
    if (rotating) {
    const texts = ['DC', 'SF', 'LA'];
      let i = 0;
      setInterval(() => { i = (i + 1) % texts.length; rotating.textContent = texts[i]; }, 2000);
    }

    // Stagger
    const elements = document.querySelectorAll('.reveal-wrap,h1,h2,h3,h4,h5,h6,p,a,.heading');
    elements.forEach((el, i) => {
      setTimeout(() => el.classList.add('anim-visible'), i * 50);
    });
  }

  // CSS
  const style = document.createElement('style');
  style.textContent = 'html.lenis{height:auto}.lenis.lenis-smooth{scroll-behavior:auto}';
  document.head.appendChild(style);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDomReady);
      } else {
    onDomReady();
  }
  })();
  