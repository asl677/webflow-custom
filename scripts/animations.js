// Version 1.5.14 - Scroll Fix + Stagger Animations
console.log('animations.js version 1.5.14 loading...');

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

    try {
      // Basic Lenis setup with essential settings
      lenis = new window.Lenis({
        duration: 1.2,
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        infinite: false
      });

      // Add Lenis CSS classes
      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');

      // Ensure proper height setup
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // GSAP ScrollTrigger integration if available
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
      }

      console.log('Lenis initialized successfully');
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

    // Create timeline with proper duration
    const mainTL = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.5 },
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

    // Animate with proper stagger timing
    mainTL
      .fromTo(headings, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: { amount: 0.3 } }
      )
      .fromTo(text, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: { amount: 0.4 } }, 
        '-=0.2'
      )
      .fromTo(media, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: { amount: 0.3 } }, 
        '-=0.3'
      )
      .fromTo(ui, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: { amount: 0.2 } }, 
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
          // Reset body styles if Lenis fails
          document.body.style.overflow = '';
          document.body.style.height = '';
          document.documentElement.style.height = '';
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