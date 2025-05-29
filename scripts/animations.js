// Version 1.1.2 - Fix Lenis scrolling issues
console.log('animations.js version 1.1.2 loading...');

// Create and inject the critical styles
const criticalStyles = document.createElement('style');
criticalStyles.textContent = `
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
  /* Lenis recommended styles */
  html.lenis {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }
  .lenis.lenis-stopped {
    overflow: hidden;
  }
  .lenis.lenis-smooth iframe {
    pointer-events: none;
  }
`;
document.head.appendChild(criticalStyles);

// Create and inject the overlay element
const overlay = document.createElement('div');
overlay.className = 'loading-overlay';
document.body.appendChild(overlay);

// Global initialization flag
window.animationsInitialized = window.animationsInitialized || false;

// Create flags to track initialization and loading
let isInitialized = false;
let lenis = null;
let scriptsLoaded = {
  gsap: false,
  scrollTrigger: false,
  lenis: false
};

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

// Function to check if all required scripts are loaded
function areScriptsLoaded() {
  return scriptsLoaded.gsap && scriptsLoaded.scrollTrigger && scriptsLoaded.lenis;
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
  // Check if already initialized
  if (window.animationsInitialized) {
    console.log('Animations already initialized, skipping element hiding');
    return;
  }

  addInitialHiddenClass();
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
  // Check if already initialized globally
  if (window.animationsInitialized) {
    console.log('Animations already initialized globally, skipping initialization');
    return;
  }

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

// Function to initialize Lenis with proper RAF
function initLenis() {
  try {
    console.log('Initializing Lenis...');
    
    // Add Lenis class to HTML
    document.documentElement.classList.add('lenis');
    
    // Initialize Lenis
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

    // Proper RAF setup for Lenis
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    console.log('Lenis initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Lenis:', error);
    return false;
  }
}

// Function to initialize animations
function initializeAnimations() {
  if (isInitialized || window.animationsInitialized) {
    console.log('Animations already initialized');
    return;
  }
  
  console.log('Initializing animations...');
  isInitialized = true;
  window.animationsInitialized = true;

  // Initialize Lenis first
  if (!initLenis()) {
    console.error('Failed to initialize Lenis, animations may not work properly');
    return;
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