// Version 1.5.2
console.log('animations.js version 1.5.2 loading...');

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
      transform: translateY(10px) !important;
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
      transition: opacity 0.8s ease-out;
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
      }
    });
  }

  // Add the class immediately when the script loads
  addInitialHiddenClass();

  // Function to remove overlay and show content
  function showContent() {
    console.log('Showing content...');
    document.body.classList.add('content-loaded');
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }

  // Function to force style application
  function forceStyles(element, styles) {
    if (!element) return;
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, 'important');
    });
  }

  // Function to ensure elements are hidden
  function ensureElementsHidden() {
    if (isInitialized) return;
    addInitialHiddenClass();
  }

  // Function to start animations
  function startAnimations() {
    console.log('Starting animations');
    
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    const allElements = [];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => allElements.push(el));
    });

    // Make sure GSAP is available
    if (!window.gsap) {
      console.error('GSAP not found');
      showContent();
      return;
    }

    // Create timeline
    const mainTL = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        duration: 0.8
      },
      onStart: () => {
        allElements.forEach(el => {
          el.classList.remove('initial-hidden');
          forceStyles(el, {
            'visibility': 'visible',
            'will-change': 'transform, opacity'
          });
        });
      },
      onComplete: showContent
    });

    // Add staggered animations
    mainTL.to(allElements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: {
        each: 0.05,
        from: "start"
      },
      onComplete: () => {
        allElements.forEach(el => {
          el.style.removeProperty('transform');
          el.style.removeProperty('will-change');
        });
      }
    });
  }

  // Function to initialize animations
  function initializeAnimations() {
    if (isInitialized) return;
    isInitialized = true;

    // Wait for fonts and a small delay
    Promise.all([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 100))
    ]).then(() => {
      startAnimations();
    }).catch(() => {
      startAnimations();
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

  // Event listeners for links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) {
      handlePageTransition(e, href);
    }
  }, true);

  // Export necessary functions
  exports.initializeAnimations = initializeAnimations;
  exports.startAnimations = startAnimations;
  exports.handlePageTransition = handlePageTransition;
  
  // Run initial setup
  ensureElementsHidden();
  
  // Initialize when GSAP is ready
  if (window.gsap) {
    initializeAnimations();
  } else {
    let attempts = 0;
    const maxAttempts = 50;
    const checkInterval = setInterval(() => {
      attempts++;
      if (window.gsap || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (window.gsap) {
          initializeAnimations();
        } else {
          console.error('GSAP not found after maximum attempts');
          showContent();
        }
      }
    }, 100);
  }
})(window.portfolioAnimations);