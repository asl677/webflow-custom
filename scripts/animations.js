// Portfolio Animations v7.3 - Streamlined
// REQUIRED: GSAP (loaded from Webflow or CDN)

// INSTANT: Add preloader with scramble effects
(function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randChar = () => chars[Math.floor(Math.random() * chars.length)];
  
  // Inject CSS immediately
  const style = document.createElement('style');
  style.id = 'preloader-styles';
  style.textContent = `
    html:not(.loaded) body>*:not(#preloader):not(script):not(style){opacity:0!important;visibility:hidden!important}
    #preloader{position:fixed;top:0;left:0;width:100vw;height:100vh;background:transparent;z-index:99999;display:flex;align-items:center;justify-content:center;opacity:1!important;visibility:visible!important}
    #preloader .counter{font-family:monospace;font-size:0.8rem;color:inherit;letter-spacing:0.1em}
    #preloader .digit{display:inline-block}
    html.loaded .toggle,html.loaded .toggle.bottom,html.loaded .yzy,html.loaded .flex-grid.yzy{opacity:0}
    .toggle.show-toggle,.toggle.bottom.show-toggle{transition:opacity 0.6s ease}
    .nav:not(.fake-nav){opacity:0}
    .nav-middle,.nav-bottom,.middle-nav,.bottom-nav,.nav[class*="middle"],.nav[class*="bottom"]{opacity:1!important}
    .reveal-wrap:not(.img-visible){opacity:0!important;visibility:hidden!important}
    .reveal-wrap.img-visible{opacity:1!important;visibility:visible!important;transition:opacity 0.8s ease-out,visibility 0s}
    .reveal-wrap.img-visible img,.reveal-wrap.img-visible video{opacity:1!important;visibility:visible!important}
    img:not(.reveal-wrap img):not(#preloader img):not(.img-visible),video:not(.reveal-wrap video):not(.img-visible){opacity:0!important;visibility:hidden!important}
    img.img-visible,video.img-visible{opacity:1!important;visibility:visible!important;transition:opacity 0.8s ease-out,visibility 0s}
    .lenis.lenis-smooth{scroll-behavior:auto}
  `;
  (document.head || document.documentElement).insertBefore(style, (document.head || document.documentElement).firstChild);
  
  // Create preloader with scrambled initial text
  const p = document.createElement('div');
  p.id = 'preloader';
  p.innerHTML = `<div class="counter"><span class="digit">${randChar()}</span><span class="digit">${randChar()}</span><span class="digit">${randChar()}</span></div>`;
  
  function injectAndStart() {
    if (document.getElementById('preloader')) return;
    if (!document.body) {
      setTimeout(injectAndStart, 1);
      return;
    }
    document.body.insertBefore(p, document.body.firstChild);
    
    const digits = p.querySelectorAll('.digit');
    const target = ['0', '0', '1'];
    
    // Phase 1: Scramble-in to "001" (500ms)
    let frame = 0;
    const scrambleIn = setInterval(() => {
      frame++;
      digits.forEach((d, i) => {
        // Reveal each digit progressively
        if (frame > (i + 1) * 3) d.textContent = target[i];
        else d.textContent = randChar();
      });
      if (frame >= 12) {
        clearInterval(scrambleIn);
        // Phase 2: Count up
        let count = 1;
        const countUp = setInterval(() => {
          count += Math.floor(Math.random() * 15) + 5;
          if (count > 100) count = 100;
          const str = count.toString().padStart(3, '0');
          digits[0].textContent = str[0];
          digits[1].textContent = str[1];
          digits[2].textContent = str[2];
          if (count >= 100) {
            clearInterval(countUp);
            p.dataset.complete = 'true'; // Signal ready for scramble-out
          }
        }, 80);
      }
    }, 40);
  }
  injectAndStart();
})();

console.log('🚀 Portfolio animations v6.7 loading...');

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

  // Create preloader (or use existing one from immediate injection)
  function createPreloader() {
    let preloader = document.getElementById('preloader');
    if (preloader) return preloader;
    
    preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = '<div class="counter"><span class="digit">0</span><span class="digit">0</span><span class="digit">1</span></div>';
    document.body.appendChild(preloader);
    return preloader;
  }

  // Run preloader - simple timed completion (counter already animating from immediate IIFE)
  function runPreloader() {
    // Just complete after 1.5s - counter animation is already running
    setTimeout(completePreloader, 1500);
  }

  // Complete preloader with scramble-out effect
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    const preloader = document.getElementById('preloader');
    const digits = preloader?.querySelectorAll('.digit');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randChar = () => chars[Math.floor(Math.random() * chars.length)];
    
    // Phase 3: Scramble-out effect (400ms)
    let frame = 0;
    const scrambleOut = setInterval(() => {
      frame++;
      if (digits) {
        digits.forEach(d => d.textContent = randChar());
      }
      if (frame >= 10) {
        clearInterval(scrambleOut);
        // Fade out
        if (window.gsap) {
          window.gsap.to(preloader, {
            opacity: 0, duration: 0.3, ease: "power2.out",
            onComplete: () => { 
              preloader.remove(); 
              document.documentElement.classList.add('loaded');
              setTimeout(startAnimations, 200);
            }
          });
        } else {
          preloader.style.opacity = '0'; 
          setTimeout(() => { 
            preloader.remove(); 
            document.documentElement.classList.add('loaded');
            startAnimations();
          }, 300); 
        }
      }
    }, 40);
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

    // Start image fade-in shortly after text starts
    setTimeout(() => startImageFadeIn(), isMobile ? 300 : 100);
    
    // Init draggable
    setTimeout(() => initDraggable(), 1000);
  }

  // Text scrambling animations with stagger reveal
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
      // Skip draggable content - handle separately
      if (el.closest('.w-draggable') || el.closest('[data-draggable]')) return;
      
      el.dataset.animInit = 'true';
      
      // Start hidden for stagger effect
      el.style.opacity = '0';
      
      wrapLetters(el);
      
      // Stagger reveal with scramble
    setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '1';
        scrambleElement(el, 1000);
      }, i * 80);
    });
    
    // Wrap letters in draggable links for hover effects (same as other links)
    document.querySelectorAll('.w-draggable a, [data-draggable] a, .menu-link, .shimmer, .accordion, .chip-link').forEach(link => {
      if (link.dataset.animInit) return;
      if (link.querySelector('.letter')) return; // Already wrapped
      
      // Get direct text content only (not from nested elements)
      const directText = Array.from(link.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join('').trim();
      
      // If has direct text, wrap it; otherwise try full textContent for simple links
      const text = directText || (link.children.length === 0 ? link.textContent?.trim() : '');
      
      if (text && text.length > 1 && text.length < 150) {
        link.dataset.animInit = 'true';
        // For links with children, only wrap direct text nodes
        if (link.children.length > 0 && directText) {
          link.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const wrapper = document.createElement('span');
              wrapper.innerHTML = node.textContent.split('').map(c => c === ' ' ? ' ' : `<span class="letter">${c}</span>`).join('');
              node.replaceWith(...wrapper.childNodes);
            }
          });
    } else {
          wrapLetters(link);
        }
        console.log(`🔗 Wrapped draggable link: ${text.substring(0, 30)}`);
      }
    });
    
    // Force draggable content to be visible
    document.querySelectorAll('.w-draggable, [data-draggable]').forEach(el => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });

    // Setup hover effects AFTER all letters are wrapped (including draggable)
    setTimeout(initHoverEffects, 800);

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

  // Wrap letters in spans - preserve layout
  function wrapLetters(el) {
    // Store original white-space setting
    const originalWhiteSpace = getComputedStyle(el).whiteSpace;
    
    // Wrap each character including spaces in spans to maintain consistent spacing
    el.innerHTML = el.textContent.split('').map(c => {
      if (c === ' ') {
        return '<span class="letter" style="display:inline-block;width:0.3em">&nbsp;</span>';
      }
      return `<span class="letter" style="display:inline-block">${c}</span>`;
    }).join('');
    
    // Prevent wrapping during animation
    el.style.whiteSpace = 'nowrap';
    el.dataset.originalWhiteSpace = originalWhiteSpace;
  }

  // Scramble element with letter spans
  function scrambleElement(el, duration) {
    const spans = el.querySelectorAll('.letter');
    if (!spans.length) return;
    
    const original = Array.from(spans).map(s => s.textContent === '\u00A0' ? ' ' : s.textContent);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const totalFrames = duration / 60;
      
    const interval = setInterval(() => {
      spans.forEach((span, i) => {
        const reveal = (i / spans.length) * totalFrames * 0.8;
        if (frame > reveal) {
          span.textContent = original[i] === ' ' ? '\u00A0' : original[i];
        } else if (/[a-zA-Z0-9]/.test(original[i])) {
          span.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        spans.forEach((s, i) => s.textContent = original[i] === ' ' ? '\u00A0' : original[i]);
        
        // Restore original white-space after animation
        if (el.dataset.originalWhiteSpace) {
          el.style.whiteSpace = el.dataset.originalWhiteSpace;
        }
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

  // Hover effects - same scramble as page load
  function initHoverEffects() {
    // Use event delegation on document for all links (catches dynamically added/moved elements)
    document.addEventListener('mouseenter', e => {
      const link = e.target.closest('a');
      if (!link) return;
      const letters = link.querySelectorAll('.letter');
      if (letters.length) startLinkScramble(link);
    }, true);
    
    document.addEventListener('mouseleave', e => {
      const link = e.target.closest('a');
      if (!link) return;
      stopLinkScramble(link);
    }, true);
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

  // Image fade-in with IntersectionObserver - optimized for scroll performance
  function startImageFadeIn() {
    // Only fade reveal-wrap containers OR standalone images (not images inside reveal-wrap)
    const revealWraps = document.querySelectorAll('.reveal-wrap');
    const standaloneImages = document.querySelectorAll('img:not(#preloader img):not(.reveal-wrap img), video:not(.reveal-wrap video)');
    const elements = [...revealWraps, ...standaloneImages];
    if (!elements.length) return;
    
    console.log(`🎭 Setting up fade-in for ${revealWraps.length} reveal-wraps + ${standaloneImages.length} standalone images`);
    
    const viewportElements = [];
    const belowFold = [];
    
    elements.forEach((el, i) => {
      if (el.dataset.fadeSetup) return;
      el.dataset.fadeSetup = 'true';
      
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) viewportElements.push({ el, i });
      else belowFold.push(el);
    });

    // Sort viewport elements by vertical position for sequential cascade
    viewportElements.sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top);
    
    // Animate viewport elements with consistent stagger
    viewportElements.forEach(({ el }, i) => {
      setTimeout(() => el.classList.add('img-visible'), i * 150);
    });

    // Scroll-triggered fade - stagger matching viewport behavior
    if (belowFold.length) {
      let scrollQueue = [];
      let isProcessing = false;
      
      function processQueue() {
        if (isProcessing || !scrollQueue.length) return;
        isProcessing = true;
        const el = scrollQueue.shift();
        el.classList.add('img-visible');
        setTimeout(() => {
          isProcessing = false;
          processQueue();
        }, 150); // Same 150ms stagger as viewport
      }
      
      const observer = new IntersectionObserver((entries) => {
        // Sort entries by vertical position
        const sorted = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        sorted.forEach(entry => {
          scrollQueue.push(entry.target);
          observer.unobserve(entry.target);
        });
        processQueue();
      }, { rootMargin: '-50px', threshold: 0.1 });
      
      belowFold.forEach(el => observer.observe(el));
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

  // Initialize - show preloader IMMEDIATELY, load GSAP in parallel
  function init() {
    // Show preloader right away - don't wait for anything
    runPreloader();
    
    // Load GSAP in parallel for animations later
    loadGSAP(() => {
      console.log('✅ GSAP ready for animations');
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
  