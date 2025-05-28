// Version 1.0.13 - Fix mobile and exit animations timing
// Version 1.0.14 - Fix mobile-down visibility
// Version 1.0.15 - Fix white lines stagger animation
// Version 1.0.16 - Fix mobile-down visibility persistence
// Version 1.0.16.1 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.17 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.18 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.19 - Simplify text animations
// Version 1.0.20 - Streamline animations code
// Version 1.0.21 - Fix smooth text animations
// Version 1.0.22 - Fix viewport animations
// Version 1.0.23 - Streamlined code
// Version 1.0.24 - Remove redundant heading animations
// Version 1.0.25 - Consistent animation directions
// Version 1.0.26 - Consistent top-to-bottom animations
// Version 1.0.27 - Fix text animation consistency
// Version 1.0.28 - Fix animation consistency and version compatibility
// Version 1.0.29 - Fix dynamic text animations
// Version 1.0.30 - Fix font loading issues
// Version 1.0.31 - Add SplitText animations
// Version 1.0.32 - Fix font loading for SplitText
// Version 1.0.33 - Fix text selector syntax
// Version 1.0.34 - Improved script loading and animation handling
// Version 1.0.35 - Fix Lenis initialization
// Version 1.0.36 - Fix initial element visibility
// Version 1.0.37 - Fix FOUC with proper initial styles
// Version 1.0.38 - Fix animation triggering
// Version 1.0.39 - Fix initial visibility
// Version 1.0.40 - Fix FOUC with critical CSS
// Version 1.0.41 - Fix visibility restoration
// Version 1.0.42 - Fix Lenis initialization
console.log('animations.js version 1.0.42 loaded');

// Create a flag to track initialization
let isInitialized = false;
let lenis = null;

// Function to ensure elements are hidden
function ensureElementsHidden() {
  const elements = document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down');
  elements.forEach(el => {
    if (getComputedStyle(el).opacity !== '0') {
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('visibility', 'hidden', 'important');
    }
  });
}

// Run immediately
ensureElementsHidden();

// Run again when DOM starts loading
if (document.readyState === 'loading') {
  document.addEventListener('readystatechange', () => {
    ensureElementsHidden();
  });
}

// Simple animations v1.0.12
console.log('Initializing animations.js...');

// Function to initialize Lenis
function initLenis() {
  // Check if Lenis is available
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded yet, waiting...');
    return false;
  }

  try {
    // Add Lenis CSS classes to html element
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false
    });

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Create a single RAF loop
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable smooth scrolling during GSAP animations
    gsap.ticker.lagSmoothing(0);
    
    console.log('Lenis initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Lenis:', error);
    return false;
  }
}

// Check if GSAP is loaded
if (typeof gsap === 'undefined') {
  console.error('GSAP not loaded! Please check script loading order.');
  throw new Error('GSAP not loaded');
}

// Register ScrollTrigger
try {
  gsap.registerPlugin(ScrollTrigger);
  console.log('ScrollTrigger registered successfully');
} catch (error) {
  console.error('Failed to register ScrollTrigger:', error);
  throw error;
}

// Try to initialize Lenis immediately
let lenisInitialized = initLenis();

// If Lenis isn't available yet, wait for it
if (!lenisInitialized) {
  const waitForLenis = setInterval(() => {
    if (typeof Lenis !== 'undefined') {
      lenisInitialized = initLenis();
      if (lenisInitialized) {
        clearInterval(waitForLenis);
      }
    }
  }, 100);

  // Stop trying after 5 seconds
  setTimeout(() => {
    clearInterval(waitForLenis);
    if (!lenisInitialized) {
      console.warn('Could not initialize Lenis after 5 seconds, continuing without smooth scroll');
    }
  }, 5000);
}

// Handle page transitions
function handlePageTransition(e, href) {
  e.preventDefault();
  e.stopPropagation();

  // Stop Lenis scroll during transition
  if (lenis) {
    lenis.stop();
  }

  // Simple fade out and move up
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

// Wait for DOM and fonts to be ready
document.addEventListener('DOMContentLoaded', () => {
  if (isInitialized) return;
  isInitialized = true;
  
  console.log('DOM loaded, waiting for fonts...');

  // Function to start animations
  function startAnimations() {
    console.log('Starting animations');
    
    // Get all elements to animate
    const allElements = gsap.utils.toArray('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down');
    console.log('Found elements to animate:', allElements.length);

    // Remove any inline styles that might interfere
    allElements.forEach(el => {
      // Force remove the important flags
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      el.style.removeProperty('transform');
      // Also remove any inline styles added by CSS
      el.style.cssText = el.style.cssText.replace(/opacity\s*:\s*[^;]+;?/gi, '');
      el.style.cssText = el.style.cssText.replace(/visibility\s*:\s*[^;]+;?/gi, '');
    });

    // Set initial state with GSAP
    gsap.set(allElements, {
      opacity: 0,
      y: 20,
      visibility: 'visible',
      clearProps: 'transform',
      overwrite: 'auto'
    });

    // Create the main timeline
    const mainTL = gsap.timeline({
      defaults: {
        ease: 'power2.out',
        duration: 1
      },
      onStart: () => {
        console.log('Animation timeline started');
        // Ensure elements are visible when animation starts
        allElements.forEach(el => {
          el.style.setProperty('visibility', 'visible', 'important');
        });
      }
    });

    // Add staggered animations to timeline
    mainTL.to(allElements, {
      opacity: 1,
      y: 0,
      stagger: {
        amount: 0.8,
        from: "top"
      },
      onComplete: () => {
        console.log('Initial animations complete');
        // Clear any remaining inline styles
        allElements.forEach(el => {
          gsap.set(el, {clearProps: 'all'});
        });
      }
    });

    // Setup scroll-triggered animations
    allElements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
        onEnter: () => {
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

  // Wait for fonts and a small delay to ensure everything is ready
  Promise.all([
    document.fonts.ready,
    new Promise(resolve => setTimeout(resolve, 100))
  ]).then(() => {
    console.log('Fonts loaded and delay complete, starting animations');
    startAnimations();
  }).catch(error => {
    console.error('Error waiting for fonts:', error);
    // Start animations anyway after a short delay
    setTimeout(startAnimations, 200);
  });

  // Handle all link clicks, including those in sticky elements
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Only handle internal links
    if (href.startsWith('/') || href.startsWith(window.location.origin)) {
      handlePageTransition(e, href);
    }
  }, true);

  // Handle form inputs
  document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (lenis) {
        lenis.stop();
      }
    }
  });

  document.addEventListener('focusout', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (lenis) {
        lenis.start();
      }
    }
  });

  console.log('All animations initialized');
});