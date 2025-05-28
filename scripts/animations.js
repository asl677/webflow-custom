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
console.log('animations.js version 1.0.37 loaded');

// Add initial CSS to prevent FOUC
const initialStyles = document.createElement('style');
initialStyles.textContent = `
  h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project {
    will-change: transform, opacity;
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
  }

  .card-project, .fake-nav, .inner-top {
    opacity: 0;
    transition: opacity 0.3s ease;
    will-change: transform, opacity;
    overflow: hidden;
  }

  .mobile-down {
    opacity: 0;
  }
`;

// Insert styles at the beginning of head to ensure they're applied first
document.head.insertBefore(initialStyles, document.head.firstChild);

// Simple animations v1.0.12
console.log('Initializing animations.js...');

// Add Lenis CSS classes to html element
document.documentElement.classList.add('lenis', 'lenis-smooth');

// Create and append the transition overlay
const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 0.5s ease;
`;
document.body.appendChild(overlay);

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

// Initialize smooth scroll
let lenis;
try {
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
} catch (error) {
  console.error('Failed to initialize Lenis:', error);
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

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting animations');

  // Initial page load animations with stagger
  const allElements = gsap.utils.toArray('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down');
  console.log('Found elements to animate:', allElements.length);

  gsap.set(allElements, {
    opacity: 0,
    y: 20,
    visibility: 'visible' // Make elements visible before animation
  });

  gsap.to(allElements, {
    opacity: 1,
    y: 0,
    duration: 1,
    visibility: 'visible',
    stagger: {
      amount: 0.8,
      from: "top"
    },
    ease: 'power2.out',
    onStart: () => {
      console.log('Starting initial animations');
      // Remove initial styles once animations begin
      initialStyles.remove();
    },
    onComplete: () => {
      console.log('Initial animations complete');
    }
  });

  // Setup scroll-triggered animations for all elements
  const animatedElements = document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down');
  console.log('Found elements for scroll animations:', animatedElements.length);
  
  animatedElements.forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            visibility: 'visible'
          });
        },
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power1.in'
          });
        }
      }
    });
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