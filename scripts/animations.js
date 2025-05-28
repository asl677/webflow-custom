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
// Version 1.0.43 - Fix style application
// Version 1.0.44 - Fix script loading and initialization
console.log('animations.js version 1.0.44 loading...');

// Create flags to track initialization and loading
let isInitialized = false;
let lenis = null;
let scriptsLoaded = {
  gsap: false,
  scrollTrigger: false,
  lenis: false
};

// Function to check if all required scripts are loaded
function areScriptsLoaded() {
  return scriptsLoaded.gsap && scriptsLoaded.scrollTrigger && scriptsLoaded.lenis;
}

// Function to force style application with logging
function forceStyles(element, styles) {
  console.log('Forcing styles on:', element, styles);
  Object.entries(styles).forEach(([property, value]) => {
    element.style.setProperty(property, value, 'important');
    console.log(`Applied ${property}: ${value} to`, element);
  });
}

// Function to ensure elements are hidden with improved logging
function ensureElementsHidden() {
  const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
  
  console.log('Ensuring elements are hidden...');
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`Found ${elements.length} ${selector} elements to hide`);
    
    elements.forEach(el => {
      // Store original styles
      const originalStyles = {
        opacity: el.style.opacity,
        visibility: el.style.visibility,
        transform: el.style.transform
      };
      
      console.log('Original styles for element:', originalStyles);
      
      forceStyles(el, {
        'opacity': '0',
        'visibility': 'hidden',
        'transform': 'translateY(20px)',
        'will-change': 'transform, opacity'
      });
      
      // Verify styles were applied
      const computedStyles = getComputedStyle(el);
      console.log('Computed styles after forcing:', {
        opacity: computedStyles.opacity,
        visibility: computedStyles.visibility,
        transform: computedStyles.transform
      });
    });
  });
}

// Check for GSAP and its plugins
function checkScripts() {
  console.log('Checking for required scripts...');
  
  if (typeof gsap !== 'undefined') {
    console.log('GSAP found');
    scriptsLoaded.gsap = true;
    
    if (typeof ScrollTrigger !== 'undefined') {
      console.log('ScrollTrigger found');
      scriptsLoaded.scrollTrigger = true;
      gsap.registerPlugin(ScrollTrigger);
    }
  }
  
  if (typeof Lenis !== 'undefined') {
    console.log('Lenis found');
    scriptsLoaded.lenis = true;
  }
  
  return areScriptsLoaded();
}

// Initialize scripts with retry mechanism
function initializeScripts(retries = 0, maxRetries = 50) {
  console.log(`Attempting to initialize scripts (attempt ${retries + 1}/${maxRetries})`);
  
  if (retries >= maxRetries) {
    console.error('Failed to initialize scripts after maximum retries');
    return;
  }
  
  if (!checkScripts()) {
    console.log('Not all scripts loaded, retrying in 100ms...');
    setTimeout(() => initializeScripts(retries + 1, maxRetries), 100);
    return;
  }
  
  console.log('All scripts loaded, proceeding with initialization');
  initializeAnimations();
}

// Function to initialize animations
function initializeAnimations() {
  if (isInitialized) {
    console.log('Animations already initialized');
    return;
  }
  
  console.log('Initializing animations...');
  isInitialized = true;

  // Initialize Lenis
  try {
    console.log('Initializing Lenis...');
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
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
    console.log('Lenis initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Lenis:', error);
  }

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
    new Promise(resolve => setTimeout(resolve, 500)) // Increased delay for safety
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
  
  // Gather all elements
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`Found ${elements.length} ${selector} elements to animate`);
    elements.forEach(el => allElements.push(el));
  });

  // Create and start the main timeline
  const mainTL = gsap.timeline({
    defaults: {
      ease: 'power2.out',
      duration: 1
    },
    onStart: () => {
      console.log('Animation timeline started');
      allElements.forEach(el => {
        el.style.cssText = ''; // Clear existing inline styles
        forceStyles(el, {
          'visibility': 'visible',
          'will-change': 'transform, opacity'
        });
      });
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

// Run initial setup
console.log('Running initial setup...');
ensureElementsHidden();
initializeScripts();

// Handle page transitions
function handlePageTransition(e, href) {
  e.preventDefault();
  e.stopPropagation();

  if (lenis) lenis.stop();

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

document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    if (lenis) lenis.stop();
  }
});

document.addEventListener('focusout', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    if (lenis) lenis.start();
  }
});

console.log('animations.js setup complete');