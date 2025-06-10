// Version 1.5.41 - Smooth Fade In/Out Preloader Animations
// REQUIRED: Add this script tag to your Webflow site BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
console.log('animations.js v1.5.41 loading...');

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, lenis = null, preloaderComplete = false;

  // Create preloader
  function createPreloader() {
    const style = document.createElement('style');
    style.textContent = `
      #preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.6s ease-out;
      }
      
      #preloader.visible {
        opacity: 1;
      }
      
      #preloader .progress-line {
        width: 50px;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        border-radius: 1px;
        transform: scale(0.8);
        transition: transform 0.8s ease-out;
      }
      
      #preloader.visible .progress-line {
        transform: scale(1);
      }
      
      #preloader .progress-fill {
        width: 0%;
        height: 100%;
        background: white;
        border-radius: 1px;
      }
      
      body.loading {
        overflow: hidden;
      }
      
      /* Bottom nav hidden until loaded */
      .nav:not(.fake-nav) {
        transform: translateY(100%);
        opacity: 0;
      }
    `;
    document.head.appendChild(style);

    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
      <div class="progress-line">
        <div class="progress-fill"></div>
      </div>
    `;
    document.body.appendChild(preloader);
    document.body.classList.add('loading');
    
    // Smooth fade in
    requestAnimationFrame(() => {
      preloader.classList.add('visible');
    });
    
    return preloader;
  }

  // Simple GSAP + imagesLoaded preloader
  function initPreloader() {
    console.log('Starting simple preloader...');
    const preloader = createPreloader();
    const progressFill = preloader.querySelector('.progress-fill');
    
    // Check if imagesLoaded is available, if not use fallback
    if (typeof imagesLoaded === 'function') {
      console.log('Using imagesLoaded library');
      
      // Use imagesLoaded to track all images
      const imgLoad = imagesLoaded(document.body, { background: true });
      let loadedCount = 0;
      const totalImages = imgLoad.images.length;
      
      console.log(`Found ${totalImages} images to load`);
      
      // If no images, complete immediately
      if (totalImages === 0) {
        window.gsap.to(progressFill, { width: '100%', duration: 0.3, onComplete: completePreloader });
        return;
      }
      
      // Update progress as images load
      imgLoad.on('progress', function(instance, image) {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        console.log(`Loading progress: ${Math.round(progress)}%`);
        
        window.gsap.to(progressFill, { 
          width: progress + '%', 
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      // Complete when all images are loaded
      imgLoad.on('always', function() {
        console.log('All images loaded!');
        setTimeout(completePreloader, 200);
      });
      
    } else {
      console.log('imagesLoaded not available, using fallback');
      // Simple fallback - just animate progress and complete
      window.gsap.to(progressFill, { 
        width: '100%', 
        duration: 1.5,
        ease: "power2.out",
        onComplete: completePreloader
      });
    }
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    console.log('Completing preloader...');
    
    const preloader = document.getElementById('preloader');
    const progressLine = preloader.querySelector('.progress-line');
    
    // Smooth fade out with subtle scale effect
    const tl = window.gsap.timeline({
      onComplete: function() {
        preloader.remove();
        document.body.classList.remove('loading');
        
        // Start animations
        console.log('Starting page animations');
        startPageAnimations();
      }
    });
    
    tl.to(progressLine, {
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in"
    })
    .to(preloader, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    }, 0.2); // Start fade out 0.2s after scale begins
  }

  // Start all page animations
  function startPageAnimations() {
    // Animate bottom nav
    const bottomNav = document.querySelector('.nav:not(.fake-nav)');
    if (bottomNav) {
      window.gsap.to(bottomNav, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    // Start main animations
    if (!isInit) {
      init();
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

  // Initialize
  addHidden();
  initLenis();

  function init() {
    if (isInit) return;
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
  
  // Start preloader when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})(window.portfolioAnimations);