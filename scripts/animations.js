// Version 1.5.15 - Hover Effects
console.log('animations.js version 1.5.15 loading...');

// Create a global namespace for our functions
window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  // Global initialization flag
  let isInitialized = false;
  let lenis = null;

  // Initialize hover effects
  function initHoverEffects() {
    // Handle heading link hover effects
    const headingLinks = document.querySelectorAll('.heading.small.link.large-link');
    
    headingLinks.forEach(link => {
      // Track mouse position and animation
      let isHovering = false;
      
      // Add mousemove listener
      link.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left; // mouse position within element
        const progress = Math.min(Math.max(x / rect.width, 0), 1); // normalize to 0-1
        
        window.gsap.to(link, {
          opacity: 0.3 + (progress * 0.7), // opacity ranges from 0.3 to 1
          duration: 0.2,
          ease: "power1.out"
        });
      });
      
      // Add hover listeners
      link.addEventListener('mouseenter', () => {
        isHovering = true;
      });
      
      link.addEventListener('mouseleave', () => {
        isHovering = false;
        window.gsap.to(link, {
          opacity: 1,
          duration: 0.3,
          ease: "power1.out"
        });
      });
    });
  }

  // Function to split text into lines
  function wrapLines(element) {
    if (!element.dataset.splitDone) {
      const text = element.innerHTML;
      element.innerHTML = text.split('<br>').map(line => 
        `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${line}</div></div>`
      ).join('');
      element.dataset.splitDone = 'true';
    }
    return element.querySelectorAll('.line-inner');
  }

  // Function to start animations
  function startAnimations() {
    // Split and animate large headings first
    const largeHeadings = document.querySelectorAll('.heading.large');
    if (largeHeadings.length) {
      largeHeadings.forEach(heading => {
        const lines = wrapLines(heading);
        window.gsap.to(lines, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          onComplete: () => initHoverEffects()
        });
      });
    }

    // Animate everything else
    const selectors = ['h1:not(.heading.large)', 'h2:not(.heading.large)', 'h3:not(.heading.large)', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    const elements = document.querySelectorAll(selectors.join(','));
    
    window.gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
    });
  }

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
        infinite: false,
        gestureOrientation: 'vertical',
        normalizeWheel: true,
        smoothTouch: false
      });

      // Add Lenis CSS classes
      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');

      // Ensure proper height setup
      document.documentElement.style.height = 'auto';
      document.body.style.minHeight = '100vh';
      document.body.style.position = 'relative';

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      // Start RAF loop
      requestAnimationFrame(raf);

      // GSAP ScrollTrigger integration if available
      if (window.ScrollTrigger) {
        lenis.on('scroll', () => {
          if (window.ScrollTrigger) {
            window.ScrollTrigger.update();
          }
        });
      }

      // Stop Lenis on low power mode in Safari
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis.destroy();
      }

      return true;
    } catch (error) {
      console.error('Error initializing Lenis:', error);
      return false;
    }
  }

  // Function to add initial-hidden class
  function addInitialHiddenClass() {
    document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
      }
    });
  }

  // Add the class immediately
  addInitialHiddenClass();

  // Initialize everything
  function initialize() {
    if (isInitialized) return;
    
    // Start animations immediately
    startAnimations();
    isInitialized = true;

    // Initialize Lenis
    initLenis();
  }

  // Handle page transitions
  function handlePageTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    if (lenis) {
      document.documentElement.classList.add('lenis-stopped');
      lenis.destroy();
    }

    window.gsap.to('body', {
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