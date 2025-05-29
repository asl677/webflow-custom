// Version 1.5.7
console.log('animations.js version 1.5.7 loading...');

// Create a global namespace for our functions
window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  // Global initialization flag
  let isInitialized = false;
  
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

    // Animate in sequence with minimal delays
    mainTL
      .fromTo(headings, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.02 }
      )
      .fromTo(text, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.01 }, 
        '-=0.3'
      )
      .fromTo(media, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.02 }, 
        '-=0.2'
      )
      .fromTo(ui, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.01 }, 
        '-=0.2'
      );
  }

  // Initialize immediately
  function initialize() {
    if (isInitialized) return;
    isInitialized = true;

    // Start animations immediately if GSAP is available
    if (window.gsap) {
      startAnimations();
    } else {
      // Minimal wait for GSAP
      const startTime = Date.now();
      const checkGSAP = () => {
        if (window.gsap || Date.now() - startTime > 300) {
          startAnimations();
        } else {
          requestAnimationFrame(checkGSAP);
        }
      };
      requestAnimationFrame(checkGSAP);
    }
  }

  // Handle page transitions with minimal animation
  function handlePageTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    gsap.to('body', {
      opacity: 0,
      duration: 0.3,
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
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})(window.portfolioAnimations);