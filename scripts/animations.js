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
console.log('animations.js version 1.0.34 loaded');

// Simple animations v1.0.9
console.log('Initializing animations.js...');

// Add Lenis CSS classes to html element
document.documentElement.classList.add('lenis', 'lenis-smooth');

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
    document.documentElement.classList.add('lenis-stopped');
  }

  // Kill any existing GSAP animations
  gsap.killTweensOf('*');
  
  // Simple fade out all elements at once
  gsap.to('body *', {
    opacity: 0,
    y: -10,
    duration: 0.3,
    ease: 'power3.inOut',
    onComplete: () => {
      window.location.href = href;
    }
  });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting animations');

  // Initial page load animations with stagger
  const allElements = gsap.utils.toArray('h1, h2, h3, p, img, video');
  gsap.from(allElements, {
    opacity: 0,
    y: 20,
    duration: 1,
    stagger: {
      amount: 0.5,
      from: "top"
    },
    ease: 'power2.out'
  });

  // Setup scroll-triggered animations
  const textElements = document.querySelectorAll('h1, h2, h3, p');
  console.log('Found text elements:', textElements.length);
  
  textElements.forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power1.in'
          });
        },
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      }
    });
  });

  // Animate media elements with stagger
  const mediaElements = document.querySelectorAll('img, video');
  console.log('Found media elements:', mediaElements.length);
  
  mediaElements.forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        end: 'bottom top+=100',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: 'power1.in'
          });
        },
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
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
        document.documentElement.classList.add('lenis-stopped');
      }
    }
  });

  document.addEventListener('focusout', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (lenis) {
        lenis.start();
        document.documentElement.classList.remove('lenis-stopped');
      }
    }
  });

  console.log('All animations initialized');
});