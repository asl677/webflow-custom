// Portfolio Animations v4.0 - Streamlined
// REQUIRED: GSAP (loaded from Webflow or CDN)

console.log('🚀 Portfolio animations v4.0 loading...');

// Immediately hide elements during load
(function() {
  if (document.body) document.body.classList.add('loading');
  else document.addEventListener('DOMContentLoaded', () => document.body.classList.add('loading'));
  
  const style = document.createElement('style');
  style.id = 'immediate-hide';
  style.textContent = `
    body.loading{overflow:hidden}
    body.loading img:not(#preloader img),body.loading video,body.loading .toggle,body.loading .toggle.bottom,body.loading .yzy,body.loading .flex-grid.yzy{opacity:0!important;visibility:hidden!important}
    .toggle.show-toggle,.toggle.bottom.show-toggle{transition:opacity 0.6s ease}
    #preloader{position:fixed;top:0;left:0;width:100vw;height:100vh;background:transparent;z-index:99999;display:flex;align-items:center;justify-content:center}
    #preloader .counter{font-family:monospace;font-size:0.8rem;color:inherit;letter-spacing:0.1em}
    #preloader .digit{display:inline-block;animation:pulse 2s ease-in-out infinite}
    #preloader.counting .digit{animation:none}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
    .nav:not(.fake-nav){opacity:0}
    .nav-middle,.nav-bottom,.middle-nav,.bottom-nav,.nav[class*="middle"],.nav[class*="bottom"]{opacity:1!important}
  `;
  document.head.insertBefore(style, document.head.firstChild);
})();

(function() {
  let preloaderComplete = false;

  // Load GSAP if not available
  function loadGSAP(callback) {
    if (typeof window.gsap !== 'undefined') {
      console.log('✅ GSAP available');
      if (!window.gsap.ScrollTrigger) {
        const st = document.createElement('script');
        st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
        st.onload = () => { window.gsap.registerPlugin(ScrollTrigger); callback(); };
        document.head.appendChild(st);
      } else callback();
          return;
        }
    const gsap = document.createElement('script');
    gsap.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    gsap.onload = () => {
      const st = document.createElement('script');
      st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      st.onload = () => { window.gsap.registerPlugin(ScrollTrigger); callback(); };
      document.head.appendChild(st);
    };
    document.head.appendChild(gsap);
  }

  // Create preloader
  function createPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = '<div class="counter"><span class="digit">0</span><span class="digit">0</span><span class="digit">1</span></div>';
    document.body.appendChild(preloader);
    return preloader;
  }

  // Run preloader with image tracking
  function runPreloader() {
    const preloader = createPreloader();
    const counter = preloader.querySelector('.counter');
    const images = document.querySelectorAll('img');
    const total = images.length;
    let loaded = 0;
    
    function updateCounter(progress) {
      const str = Math.floor(progress).toString().padStart(3, '0');
      counter.querySelectorAll('.digit').forEach((d, i) => d.textContent = str[i]);
    }

    function checkLoaded() {
      loaded++;
      updateCounter((loaded / total) * 100);
      if (loaded >= 3 || loaded >= total * 0.4) {
        preloader.className = 'counting';
        setTimeout(completePreloader, 150);
      }
    }

    if (total === 0) {
      updateCounter(100);
      setTimeout(completePreloader, 500);
      return;
    }
    
    images.forEach(img => {
      if (img.complete) checkLoaded();
      else {
        img.addEventListener('load', checkLoaded);
        img.addEventListener('error', checkLoaded);
      }
    });

    // Fallback timeout
    setTimeout(() => {
      if (!preloaderComplete) {
        preloader.className = 'counting';
        updateCounter(100);
        setTimeout(completePreloader, 200);
      }
    }, 5000);
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    const preloader = document.getElementById('preloader');
    if (window.gsap) {
      window.gsap.to(preloader, {
        opacity: 0, duration: 0.4, ease: "power2.out",
        onComplete: () => { 
          preloader.remove(); 
          document.body.classList.remove('loading');
          setTimeout(startAnimations, 300);
        }
      });
    } else {
        preloader.style.opacity = '0'; 
        setTimeout(() => { 
          preloader.remove(); 
          document.body.classList.remove('loading');
        startAnimations();
      }, 400); 
    }
  }

  // Start all animations
  function startAnimations() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Animate nav
    document.querySelectorAll('.nav:not(.fake-nav):not(.nav-middle):not(.nav-bottom):not(.middle-nav):not(.bottom-nav)').forEach(nav => {
      if (window.gsap) window.gsap.to(nav, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
      else { nav.style.transform = 'translateY(0)'; nav.style.opacity = '1'; }
    });

    // Start text scrambling
    initTextAnimations();

    // Start image fade-in after text
    setTimeout(() => startImageFadeIn(), isMobile ? 1500 : 800);
    
    // Init draggable
    setTimeout(() => initDraggable(), 1000);
  }

  // Text scrambling animations
  function initTextAnimations() {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .heading, p, span, div, a'))
      .filter(el => {
        const text = el.textContent?.trim();
        const noChildren = el.children.length === 0;
        const visible = getComputedStyle(el).display !== 'none';
        const inView = el.getBoundingClientRect().top < window.innerHeight + 200;
        return text && text.length > 2 && text.length < 150 && noChildren && visible && inView;
      });

    console.log(`🔍 Found ${elements.length} text elements`);

    elements.forEach((el, i) => {
      if (el.dataset.animInit || el.closest('.label-wrap')) return;
      // Skip draggable content - handle separately without hiding
      if (el.closest('.w-draggable') || el.closest('[data-draggable]')) return;
      
      el.dataset.animInit = 'true';
      el.style.visibility = 'hidden';
      el.style.opacity = '1';
      
      wrapLetters(el);
      
      setTimeout(() => {
        el.style.visibility = 'visible';
        scrambleElement(el, 1000);
      }, i * 80);
    });
    
    // Wrap letters in draggable links for hover effects ONLY (no hiding)
    document.querySelectorAll('.w-draggable a, [data-draggable] a, .menu-link, .shimmer, .accordion, .chip-link, .w-inline-block a, a.menu-link, a.shimmer, a.accordion, a.chip-link, a.w-inline-block').forEach(link => {
      if (link.dataset.animInit) return;
      if (link.querySelector('.letter')) return; // Already wrapped
      
      const text = link.textContent?.trim();
      if (text && text.length > 1 && text.length < 150) {
        link.dataset.animInit = 'true';
        wrapLetters(link);
        // Don't hide - just wrap for hover effects
        console.log(`🔗 Wrapped link for hover: ${text.substring(0, 30)}`);
      }
    });

    // Setup hover effects
    setTimeout(initHoverEffects, 500);

    // Special elements
    const counter = document.querySelector('.counter');
    if (counter && !counter.closest('.label-wrap')) setTimeout(() => scrambleLine(counter, 800), 200);
    
    const rotating = document.getElementById('rotating-text');
    if (rotating) setTimeout(() => scrambleLine(rotating, 800), 400);
    
    const timeText = document.getElementById('time-text');
    if (timeText) setTimeout(() => scrambleLine(timeText, 800), 600);

    // Fade in toggle and yzy
    setTimeout(() => {
      document.querySelectorAll('.toggle, .toggle.bottom').forEach(t => {
        t.classList.add('show-toggle');
        t.style.transition = 'opacity 0.6s ease';
        t.style.opacity = '1';
        setTimeout(() => t.style.transition = '', 600);
      });
      
      document.querySelectorAll('.yzy, .flex-grid.yzy').forEach(y => {
        y.style.transition = 'opacity 0.6s ease';
        y.style.visibility = 'visible';
        y.style.opacity = '1';
        setTimeout(() => y.style.transition = '', 600);
      });
    }, 1500);
  }

  // Wrap letters in spans
  function wrapLetters(el) {
    el.innerHTML = el.textContent.split('').map(c => c === ' ' ? ' ' : `<span class="letter">${c}</span>`).join('');
  }

  // Scramble element with letter spans
  function scrambleElement(el, duration) {
    const spans = el.querySelectorAll('.letter');
    if (!spans.length) return;
    
    const original = Array.from(spans).map(s => s.textContent);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const totalFrames = duration / 60;
      
      const interval = setInterval(() => {
      spans.forEach((span, i) => {
        const reveal = (i / spans.length) * totalFrames * 0.8;
        if (frame > reveal) span.textContent = original[i];
        else if (/[a-zA-Z0-9]/.test(original[i])) span.textContent = chars[Math.floor(Math.random() * chars.length)];
      });
      frame++;
      if (frame >= totalFrames) {
          clearInterval(interval);
        spans.forEach((s, i) => s.textContent = original[i]);
      }
    }, 60);
  }

  // Simple line scramble for special elements
  function scrambleLine(el, duration) {
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frame = 0;
    const totalFrames = duration / 50;
    const revealSpeed = original.length / (totalFrames * 0.7);
    
    const interval = setInterval(() => {
      let text = '';
      for (let i = 0; i < original.length; i++) {
        if (frame > i * revealSpeed) text += original[i];
        else if (/[a-zA-Z]/.test(original[i])) text += chars[Math.floor(Math.random() * chars.length)];
        else text += original[i];
      }
      el.textContent = text;
      frame++;
      
      if (frame >= totalFrames) {
        clearInterval(interval);
        el.textContent = original;
        
        // Start special functionality
        if (el.classList.contains('counter')) startTimeCounter(el);
        if (el.id === 'rotating-text') startRotatingText(el);
        if (el.id === 'time-text') startMilitaryTime(el);
      }
    }, 50);
  }

  // Hover effects
  function initHoverEffects() {
    // Letter bounce for non-links
    document.querySelectorAll('.letter').forEach((letter, i) => {
      if (letter.closest('a')) return;
      letter.addEventListener('mouseenter', () => {
        if (window.gsap) window.gsap.to(letter, { y: -15, duration: 0.3, delay: i * 0.02, ease: "power2.out" });
      });
      letter.addEventListener('mouseleave', () => {
        if (window.gsap) window.gsap.to(letter, { y: 0, duration: 0.3, delay: i * 0.02, ease: "power2.in" });
      });
    });

    // Link scramble on hover
    document.querySelectorAll('a').forEach(link => {
      const letters = link.querySelectorAll('.letter');
      if (!letters.length) return;
      
      link.addEventListener('mouseenter', () => {
        if (window.gsap) letters.forEach((l, i) => window.gsap.to(l, { y: -15, duration: 0.3, delay: i * 0.02, ease: "power2.out" }));
        startLinkScramble(link);
      });
      
      link.addEventListener('mouseleave', () => {
        if (window.gsap) letters.forEach((l, i) => window.gsap.to(l, { y: 0, duration: 0.3, delay: i * 0.02, ease: "power2.in" }));
        stopLinkScramble(link);
          });
        });
      }

  function startLinkScramble(link) {
    if (link._scrambleInterval) return;
    const letters = link.querySelectorAll('.letter');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    link._originalLetters = Array.from(letters).map(l => l.textContent);
    link._scrambleInterval = setInterval(() => {
      letters.forEach(l => {
        if (/[a-zA-Z0-9]/.test(l.textContent)) l.textContent = chars[Math.floor(Math.random() * chars.length)];
      });
    }, 80);
  }

  function stopLinkScramble(link) {
    if (link._scrambleInterval) {
      clearInterval(link._scrambleInterval);
      link._scrambleInterval = null;
      const letters = link.querySelectorAll('.letter');
      if (link._originalLetters) letters.forEach((l, i) => l.textContent = link._originalLetters[i]);
    }
  }

  // Image fade-in with IntersectionObserver
  function startImageFadeIn() {
    const images = document.querySelectorAll('img:not(#preloader img), video');
    if (!images.length) return;
    
    console.log(`🎭 Setting up fade-in for ${images.length} images`);
    
    const viewportImages = [];
    const belowFold = [];
    
    images.forEach((img, i) => {
      if (img.dataset.fadeSetup) return;
      img.dataset.fadeSetup = 'true';
      img.style.opacity = '0';
      img.style.visibility = 'visible';
      img.style.willChange = 'opacity';
      
        const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) viewportImages.push({ img, i });
      else belowFold.push(img);
    });

    // Animate viewport images with stagger
    viewportImages.forEach(({ img }, i) => {
      setTimeout(() => {
        img.style.transition = 'opacity 1s ease';
        img.style.opacity = '1';
        setTimeout(() => { img.style.willChange = 'auto'; img.style.transition = ''; }, 1000);
      }, i * 60);
    });

    // IntersectionObserver for below-fold
    if (belowFold.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.fadeStarted) {
            entry.target.dataset.fadeStarted = 'true';
            setTimeout(() => {
              entry.target.style.transition = 'opacity 1s ease';
              entry.target.style.opacity = '1';
              setTimeout(() => { entry.target.style.willChange = 'auto'; entry.target.style.transition = ''; }, 1000);
            }, 200);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '-80px', threshold: 0.1 });
      
      belowFold.forEach(img => observer.observe(img));
    }
  }

  // Draggable optimization
  function initDraggable() {
    const draggables = document.querySelectorAll('.w-draggable, [data-draggable="true"]');
    if (!draggables.length || typeof jQuery === 'undefined' || !jQuery.fn.draggable) return;
    
    draggables.forEach(el => {
      const $el = jQuery(el);
      if ($el.data('ui-draggable')) $el.draggable('destroy');
      
      $el.draggable({
        scroll: false, delay: 0, distance: 0, cursor: 'move',
        start: function(e, ui) {
          const offset = $el.offset();
          $el.data('clickOffsetX', e.pageX - offset.left);
          $el.data('clickOffsetY', e.pageY - offset.top);
        },
        drag: function(e, ui) {
          const ox = $el.data('clickOffsetX'), oy = $el.data('clickOffsetY');
          if (ox !== undefined) {
            ui.position.left = e.pageX - ox - ui.helper.parent().offset().left;
            ui.position.top = e.pageY - oy - ui.helper.parent().offset().top;
          }
        }
      });
    });
  }

  // Special element functions
  function startTimeCounter(el) {
    el.textContent = '0000';
    const start = Date.now();
    setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + String(s % 60).padStart(2, '0');
    }, 1000);
  }

  function startRotatingText(el) {
    const texts = ['DC', 'SF', 'LA'];
    let i = 0;
    setInterval(() => { i = (i + 1) % texts.length; el.textContent = texts[i]; }, 2000);
  }

  function startMilitaryTime(el) {
    function update() {
      const now = new Date();
      el.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
    update();
    setInterval(update, 1000);
  }

  // Page transition
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
        link.hasAttribute('data-w-id') || link.closest('[data-w-id]') ||
        !(href.startsWith('/') || href.startsWith(window.location.origin))) return;
    
    e.preventDefault();
    if (window.gsap) {
      window.gsap.to('body', { opacity: 0, duration: 0.5, ease: "power2.inOut", onComplete: () => window.location.href = href });
    } else window.location.href = href;
  }, true);

  // Initialize
  function init() {
    loadGSAP(() => {
      if (typeof window.Webflow !== 'undefined') setTimeout(runPreloader, 300);
      else runPreloader();
    });
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  })();
  
// Column toggle for .yzy grid
  (function() {
  const sizer = document.querySelector('.heading.small.link.muted.disabled.fixed-sizer');
  const grid = document.querySelector('.flex-grid.yzy');
  if (!sizer || !grid) return;
  
  let cols = parseInt(getComputedStyle(grid).columnCount) || 4;
  let increasing = false;
  sizer.textContent = '+';
  
  sizer.addEventListener('click', e => {
    e.preventDefault();
    if (increasing) { cols++; if (cols >= 4) { cols = 4; increasing = false; sizer.textContent = '+'; } }
    else { cols--; if (cols <= 2) { cols = 2; increasing = true; sizer.textContent = '−'; } }
    grid.style.columnCount = cols;
  });
})();
  
console.log('🚀 Portfolio animations v4.0 ready');
  