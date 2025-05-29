// Version 1.5.10 - Lenis Loading Fix
console.log('animations.js version 1.5.10 loading...');

// Create a global namespace for our functions
window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  // Global initialization flag
  let isInitialized = false;
  let lenis = null;

  // Initialize Lenis
  function initLenis() {
    if (lenis) return;
    
    // Check if Lenis is available
    if (typeof window.Lenis === 'undefined') {
      console.warn('Lenis not loaded, waiting...');
      return false;
    }
    
    // Check for Safari and low power mode
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    try {
      // Initialize with optimized settings
      lenis = new window.Lenis({
        wrapper: document.body, // Fix for Safari flickering
        duration: isSafari ? 1.2 : 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: isSafari ? 0.8 : 1,
        smoothTouch: false,
        touchMultiplier: 2
      });

      // Add Lenis CSS classes
      document.documentElement.classList.add('lenis', 'lenis-smooth');

      // Basic RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // GSAP ScrollTrigger integration if available
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }

      return true;
    } catch (error) {
      console.error('Error initializing Lenis:', error);
      return false;
    }
  }
  
  // Function to add initial-hidden class to elements
  function addInitialHiddenClass() {
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        // Add will-change for better performance on fixed elements
        if (window.getComputedStyle(el).position === 'fixed') {
          el.style.willChange = 'transform';
          el.style.transform = 'translateZ(0)';
        }
      }
    });
  }

  // Add the class immediately
  addInitialHiddenClass();

  // Function to start animations
  function startAnimations() {
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    const allElements = [];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => allElements.push(el));
    });

    // If GSAP isn't available, just show content
    if (!window.gsap) {
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.remove('initial-hidden');
      });
      return;
    }

    // Create timeline with reduced duration
    const mainTL = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.3 },
      onStart: () => {
        document.body.classList.add('content-loaded');
        allElements.forEach(el => {
          el.classList.remove('initial-hidden');
          el.style.visibility = 'visible';
        });
      }
    });

    // Group elements by type for better performance
    const headings = allElements.filter(el => /^h[1-3]$/.test(el.tagName.toLowerCase()));
    const text = allElements.filter(el => el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'a');
    const media = allElements.filter(el => el.tagName.toLowerCase() === 'img' || el.tagName.toLowerCase() === 'video');
    const ui = allElements.filter(el => !headings.includes(el) && !text.includes(el) && !media.includes(el));

    // Animate with minimal delays
    mainTL
      .fromTo(headings.concat(text),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.01 }
      )
      .fromTo(media.concat(ui),
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.2, stagger: 0.01 }, 
        '-=0.2'
      );
  }

  // Initialize everything
  function initialize() {
    if (isInitialized) return;

    // Try to initialize Lenis
    const lenisInitialized = initLenis();

    // Start animations immediately
    if (window.gsap) {
      startAnimations();
      isInitialized = true;
    } else {
      // Quick GSAP check with shorter timeout
      const maxWaitTime = 100;
      const startTime = Date.now();
      
      function checkGSAP() {
        if (window.gsap || Date.now() - startTime > maxWaitTime) {
          startAnimations();
          isInitialized = true;
        } else {
          requestAnimationFrame(checkGSAP);
        }
      }
      requestAnimationFrame(checkGSAP);
    }

    // If Lenis failed to initialize, retry
    if (!lenisInitialized) {
      const maxRetries = 5;
      let retryCount = 0;
      
      function retryLenis() {
        if (retryCount >= maxRetries) {
          console.warn('Failed to initialize Lenis after', maxRetries, 'attempts');
          return;
        }
        
        if (!initLenis()) {
          retryCount++;
          setTimeout(retryLenis, 100);
        }
      }
      
      setTimeout(retryLenis, 100);
    }
  }

  // Handle page transitions with minimal animation
  function handlePageTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    // Stop Lenis during transition
    if (lenis) {
      document.documentElement.classList.add('lenis-stopped');
      lenis.destroy();
    }

    gsap.to('body', {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        window.location.href = href;
      }
    });
  }

  // Event delegation for link handling
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) {
      handlePageTransition(e, href);
    }
  }, true);

  // Export necessary functions
  exports.initialize = initialize;
  exports.startAnimations = startAnimations;
  exports.handlePageTransition = handlePageTransition;
  
  // Start initialization immediately
  initialize();
})(window.portfolioAnimations);