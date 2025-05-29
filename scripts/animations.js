// Version 1.2.0 - Fix module loading error
console.log('animations.js version 1.2.0 loading...');

// Create a global namespace for our functions
window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  // Create and inject the critical styles
  const criticalStyles = document.createElement('style');
  criticalStyles.textContent = `
    /* Animation styles */
    .initial-hidden {
      opacity: 0 !important;
      visibility: hidden !important;
      transform: translateY(20px) !important;
      will-change: transform, opacity;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      z-index: 9999;
      opacity: 1;
      transition: opacity 0.5s ease-out;
      pointer-events: none;
    }

    .loading-overlay.fade-out {
      opacity: 0;
    }

    body {
      opacity: 0;
      transition: opacity 0.3s ease-out;
    }

    body.content-loaded {
      opacity: 1;
    }

    /* Ensure sticky elements work properly */
    [style*="position: sticky"],
    [style*="position:sticky"] {
      position: sticky !important;
      z-index: 1;
    }
  `;
  document.head.appendChild(criticalStyles);

  // Create and inject the overlay element
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  document.body.appendChild(overlay);

  // Global initialization flag
  let isInitialized = false;
  
  // Function to add initial-hidden class to elements
  function addInitialHiddenClass() {
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    const selectorString = selectors.join(',');
    
    console.log('Adding initial-hidden class to elements...');
    const elements = document.querySelectorAll(selectorString);
    elements.forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        console.log('Added initial-hidden class to:', el);
      }
    });
  }

  // Add the class immediately when the script loads
  addInitialHiddenClass();

  // Also add the class when DOM content loads (backup)
  document.addEventListener('DOMContentLoaded', addInitialHiddenClass);

  // Function to remove overlay and show content
  function showContent() {
    console.log('Showing content...');
    document.body.classList.add('content-loaded');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }

  // Function to force style application with logging
  function forceStyles(element, styles) {
    if (!element) return;
    console.log('Forcing styles on:', element, styles);
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, 'important');
    });
  }

  // Function to ensure elements are hidden with improved logging
  function ensureElementsHidden() {
    if (isInitialized) {
      console.log('Animations already initialized, skipping element hiding');
      return;
    }
    addInitialHiddenClass();
  }

  // Function to initialize animations
  function initializeAnimations() {
    if (isInitialized) {
      console.log('Animations already initialized');
      return;
    }
    
    console.log('Initializing animations...');
    isInitialized = true;

    // Start animations when DOM and fonts are ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startAnimationsWhenReady);
    } else {
      startAnimationsWhenReady();
    }
  }

  // Function to start animations when everything is ready
  function startAnimationsWhenReady() {
    console.log('Preparing to start animations...');
    
    Promise.all([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 500))
    ]).then(() => {
      console.log('Fonts loaded and delay complete, starting animations');
      startAnimations();
    }).catch(error => {
      console.error('Error waiting for fonts:', error);
      setTimeout(startAnimations, 600);
    });
  }

  // Function to start the actual animations
  function startAnimations() {
    console.log('Starting animations');
    
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    const allElements = [];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} ${selector} elements to animate`);
      elements.forEach(el => allElements.push(el));
    });

    const mainTL = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        duration: 1
      },
      onStart: () => {
        console.log('Animation timeline started');
        allElements.forEach(el => {
          el.classList.remove('initial-hidden');
          forceStyles(el, {
            'visibility': 'visible',
            'will-change': 'transform, opacity'
          });
        });
      },
      onComplete: () => {
        showContent();
      }
    });

    // Add staggered animations
    mainTL.to(allElements, {
      opacity: 1,
      y: 0,
      stagger: {
        amount: 0.8,
        from: "top"
      },
      onComplete: () => {
        console.log('Initial animations complete');
        allElements.forEach(el => {
          el.style.removeProperty('transform');
          el.style.removeProperty('will-change');
        });
      }
    });

    // Setup scroll triggers
    allElements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          console.log('Element entering viewport:', element);
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            visibility: 'visible',
            ease: 'power2.out',
            overwrite: 'auto'
          });
        },
        onLeave: () => {
          console.log('Element leaving viewport:', element);
          gsap.to(element, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power1.in',
            overwrite: 'auto'
          });
        }
      });
    });
  }

  // Handle page transitions
  function handlePageTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    gsap.to('body *', {
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        window.location.href = href;
      }
    });
  }

  // Event listeners for links and forms
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) {
      handlePageTransition(e, href);
    }
  }, true);

  // Export necessary functions to the global namespace
  exports.initializeAnimations = initializeAnimations;
  exports.startAnimations = startAnimations;
  exports.handlePageTransition = handlePageTransition;
  
  // Run initial setup
  console.log('Running initial setup...');
  ensureElementsHidden();
  
  // Auto-initialize if GSAP is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    console.log('Dependencies found, auto-initializing...');
    gsap.registerPlugin(ScrollTrigger);
    initializeAnimations();
  } else {
    console.log('Waiting for dependencies...');
    // Check periodically for dependencies
    const checkInterval = setInterval(() => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        console.log('Dependencies loaded, initializing...');
        clearInterval(checkInterval);
        gsap.registerPlugin(ScrollTrigger);
        initializeAnimations();
      }
    }, 100);
  }
})(window.portfolioAnimations);