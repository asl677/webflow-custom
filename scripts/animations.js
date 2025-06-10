// Version 1.5.39 - Real Preloader with Actual Media Loading
console.log('animations.js v1.5.39 loading...');

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, lenis = null, preloaderComplete = false;

  // Create and inject preloader styles and HTML
  function createPreloader() {
    // Create preloader styles
    const style = document.createElement('style');
    style.textContent = `
      #white-line-preloader {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        z-index: 10000;
        border-radius: 1px;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      
      #white-line-preloader.visible {
        opacity: 1;
      }
      
      #white-line-preloader::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 1%;
        background: white;
        border-radius: 1px;
        transition: width 0.1s ease-out;
      }
      
      #white-line-preloader.loading::after {
        width: 100%;
        transition: width 2s ease-out;
      }
      
      #white-line-preloader.complete {
        opacity: 0;
        transition: opacity 0.15s ease-out;
        pointer-events: none;
      }
      
      body.preloader-active {
        overflow: hidden;
      }
      
      /* Bottom nav animation - hidden until preloader completes */
      .nav:not(.fake-nav) {
        transform: translateY(100%);
        opacity: 0;
        transition: transform 0.8s ease-out, opacity 0.8s ease-out;
      }
      
      .nav:not(.fake-nav).nav-loaded {
        transform: translateY(0%);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    // Create preloader element
    const preloader = document.createElement('div');
    preloader.id = 'white-line-preloader';
    document.body.appendChild(preloader);
    
    // Prevent scrolling during preload
    document.body.classList.add('preloader-active');
    
    return preloader;
  }

  // Real media loading detection
  function waitForMediaLoad() {
    return new Promise((resolve) => {
      const mediaElements = document.querySelectorAll('img, video');
      const totalCount = mediaElements.length;
      let loadedCount = 0;
      
      console.log(`Preloader: Found ${totalCount} media elements to load`);
      
      // If no media, resolve after minimum display time
      if (totalCount === 0) {
        console.log('No media found, minimum preloader time');
        setTimeout(resolve, 1000);
        return;
      }
      
      function checkComplete() {
        loadedCount++;
        console.log(`Preloader: ${loadedCount}/${totalCount} media loaded`);
        
        if (loadedCount >= totalCount) {
          console.log('Preloader: All media loaded!');
          // Small delay to ensure everything is ready
          setTimeout(resolve, 300);
        }
      }
      
      // Check each media element properly
      mediaElements.forEach((el, index) => {
        if (el.tagName === 'IMG') {
          // For images - check if already loaded or wait for load
          if (el.complete && el.naturalWidth > 0) {
            console.log(`Image ${index} already loaded`);
            checkComplete();
          } else {
            console.log(`Waiting for image ${index}:`, el.src);
            el.addEventListener('load', () => {
              console.log(`Image ${index} loaded`);
              checkComplete();
            }, { once: true });
            
            el.addEventListener('error', () => {
              console.warn(`Image ${index} failed, continuing`);
              checkComplete();
            }, { once: true });
          }
        } else if (el.tagName === 'VIDEO') {
          // For videos - wait for enough data to play
          if (el.readyState >= 3) {
            console.log(`Video ${index} already loaded`);
            checkComplete();
          } else {
            console.log(`Waiting for video ${index}:`, el.src);
            el.addEventListener('canplaythrough', () => {
              console.log(`Video ${index} loaded`);
              checkComplete();
            }, { once: true });
            
            el.addEventListener('error', () => {
              console.warn(`Video ${index} failed, continuing`);
              checkComplete();
            }, { once: true });
          }
        }
      });
      
      // Safety timeout - but longer to allow real loading
      setTimeout(() => {
        console.log('Preloader: Safety timeout reached');
        resolve();
      }, 8000);
    });
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    console.log('Preloader: Completing...');
    
    const preloader = document.getElementById('white-line-preloader');
    if (preloader) {
      preloader.classList.add('complete');
      
      // Remove preloader after fade completes
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 200);
    }
    
    // Re-enable scrolling
    document.body.classList.remove('preloader-active');
    
    // Start animations sequence after preloader fade completes
    setTimeout(() => {
      console.log('Preloader: Starting animations');
      
      // Animate bottom nav first
      const bottomNav = document.querySelector('.nav:not(.fake-nav)');
      if (bottomNav) {
        bottomNav.classList.add('nav-loaded');
      }
      
      // Start main animations
      if (!isInit) {
        init();
      }
    }, 200); // Wait for preloader fade to complete
  }

  // Initialize preloader
  async function initPreloader() {
    console.log('Preloader: Initializing...');
    const preloader = createPreloader();
    
    // Show preloader
    requestAnimationFrame(() => {
      preloader.classList.add('visible');
      
      // Start loading animation after short delay
      setTimeout(() => {
        preloader.classList.add('loading');
      }, 100);
    });

    try {
      // Actually wait for media to load
      await waitForMediaLoad();
      completePreloader();
    } catch (error) {
      console.error('Media loading error:', error);
      completePreloader();
    }
  }

  function initHover() {
    console.log('Initializing hover effects...');
    const links = document.querySelectorAll('.link');
    console.log('Found links:', links.length);
    
    links.forEach(link => {
      if (link.dataset.hoverInit) {
        console.log('Link already initialized:', link.textContent);
        return;
      }
      
      console.log('Setting up hover for:', link.textContent);
      
      // Store original dimensions
      const rect = link.getBoundingClientRect();
      const height = rect.height;
      
      // Create two layers of text
      const text = link.textContent.trim();
      
      // Set container styles
      Object.assign(link.style, {
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        height: height + 'px',
        lineHeight: height + 'px'
      });
      
      link.innerHTML = `
        <span class="link-text-1" style="display: block; position: relative; height: ${height}px; line-height: ${height}px;">${text}</span>
        <span class="link-text-2" style="display: block; position: absolute; height: ${height}px; line-height: ${height}px; width: 100%; left: 0; top: 100%;">${text}</span>
      `;
      
      // Create timeline with refined easing
      const tl = window.gsap.timeline({ 
        paused: true,
        defaults: {
          duration: 0.5,
          ease: "power3.inOut"
        }
      });
      
      tl.to(link.querySelector('.link-text-1'), {
        yPercent: -100,
      })
      .to(link.querySelector('.link-text-2'), {
        yPercent: -100
      }, 0.15); // Shorter delay for second text
      
      // Add hover events with smoother reversing
      link.addEventListener('mouseenter', () => {
        console.log('Mouse enter:', link.textContent);
        tl.timeScale(1).play();
      });
      
      link.addEventListener('mouseleave', () => {
        console.log('Mouse leave:', link.textContent);
        tl.timeScale(1.2).reverse(); // Slightly faster reverse
      });
      
      link.dataset.hoverInit = 'true';
    });
  }

  function wrapLines(el) {
    if (!el.dataset.splitDone) {
      el.innerHTML = el.innerHTML.split('<br>').map(line => 
        `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${line}</div></div>`
      ).join('');
      el.dataset.splitDone = 'true';
    }
    return el.querySelectorAll('.line-inner');
  }

  function startAnims() {
    // Get all elements upfront
    const largeHeadings = document.querySelectorAll('.heading.large');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img, video');
    const otherEls = document.querySelectorAll('h1:not(.heading.large), h2:not(.heading.large), h3:not(.heading.large), p, a, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    // Initialize hover immediately to prevent delay
    initHover();

    // Create a single timeline for better performance
    const tl = window.gsap.timeline();

    // Set initial state for media elements
    if (mediaEls.length) {
      window.gsap.set(mediaEls, { opacity: 0 });
      
      // Create separate timeline for media elements
      mediaEls.forEach((el, i) => {
        window.gsap.to(el, {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=100",
            end: "bottom top+=100",
            toggleActions: "play none none reverse"
          }
        });
      });
    }

    if (largeHeadings.length) {
      largeHeadings.forEach(h => {
        tl.to(wrapLines(h), { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "power2.out" }, 0);
      });
    }

    if (slideEls.length) {
      window.gsap.set(slideEls, { x: 40, opacity: 0 });
      tl.to(slideEls, { x: 0, opacity: 1, duration: 1.1, stagger: 0.05, ease: "power2.out" }, 0.7);
    }

    // Batch animate other elements for better performance
    const batchSize = 10;
    for (let i = 0; i < otherEls.length; i += batchSize) {
      const batch = Array.from(otherEls).slice(i, i + batchSize);
      tl.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.02, ease: "power2.out" }, 0.1);
    }
  }

  function initLenis() {
    if (lenis || typeof window.Lenis === 'undefined') return;
    
    try {
      lenis = new window.Lenis({
        duration: 1.2, orientation: 'vertical', smoothWheel: true, wheelMultiplier: 1,
        infinite: false, gestureOrientation: 'vertical', normalizeWheel: true, smoothTouch: false
      });

      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');
      document.documentElement.style.height = 'auto';
      document.body.style.minHeight = '100vh';
      document.body.style.position = 'relative';

      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);

      if (window.ScrollTrigger) lenis.on('scroll', () => window.ScrollTrigger?.update());
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.destroy();
    } catch (e) { console.error('Lenis error:', e); }
  }

  function addHidden() {
    // Use a single query for better performance
    document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        if (el.matches('.grid-down.project-down.mobile-down')) {
          el.style.transform = 'translateX(40px)';
          el.style.opacity = '0';
        }
      }
    });
  }

  function handleTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    if (lenis) {
      document.documentElement.classList.add('lenis-stopped');
      lenis.destroy();
    }

    const tl = window.gsap.timeline({ onComplete: () => window.location.href = href });
    const slideOut = document.querySelectorAll('.grid-down.project-down.mobile-down');
    
    if (slideOut.length) {
      tl.to(slideOut, { x: 20, opacity: 0, duration: 0.8, stagger: 0.02, ease: "power2.inOut" }, 0.2);
    }
    tl.to('body', { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.1);
  }

  // Initialize immediately - but block animations until preloader completes
  addHidden();
  initLenis();

  function init() {
    if (isInit || !preloaderComplete) {
      console.log('Init blocked - preloader not complete');
      return;
    }
    console.log('Starting main animations...');
    requestAnimationFrame(() => {
      startAnims();
      isInit = true;
    });
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) handleTransition(e, href);
  }, true);

  exports.initialize = init;
  exports.startAnimations = startAnims;
  exports.handlePageTransition = handleTransition;
  
  // Start preloader - animations will only start after preloader completes
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
  });
  
  // Fallback if DOMContentLoaded already fired
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})(window.portfolioAnimations);