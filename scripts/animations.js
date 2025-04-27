// Run this as early as possible
(function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  if (bodyWrapper) {
    bodyWrapper.classList.add('initial-load');
    // Force immediate application of initial styles
    bodyWrapper.style.opacity = '0';
    bodyWrapper.style.visibility = 'hidden';
    // Add a class to prevent FOUC
    document.documentElement.classList.add('is-loading');
  }
})();

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  
  if (bodyWrapper) {
    // Initial page load animation
    gsap.to(bodyWrapper, {
      opacity: 1,
      visibility: 'visible',
      duration: 0.6,
      ease: "power2.out",
      onStart: () => {
        bodyWrapper.classList.remove('initial-load');
        bodyWrapper.classList.add('page-loaded');
        document.documentElement.classList.remove('is-loading');
      }
    });

    const links = document.querySelectorAll('a[href]');

    links.forEach(function(link) {
      if (link.closest('.navbar, .nav-menu')) return;
      
      if (link.hostname === window.location.hostname && !link.target) {
        link.addEventListener('click', function(e) {
          const isSamePage = link.pathname === window.location.pathname;
          if (isSamePage) {
            e.preventDefault();
            return;
          }
          
          e.preventDefault();
          
          // Animate out
          gsap.to(bodyWrapper, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
              window.location = link.href;
            }
          });
        });
      }
    });
  }

  // Check if we're on mobile
  const isMobile = window.innerWidth < 768;

  // Initialize GSAP animations only on desktop
  if (!isMobile) {
    if (typeof gsap === 'undefined') {
      console.error('GSAP not loaded');
      return;
    }

    // Register ScrollTrigger plugin
    if (typeof gsap.ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Define our animation targets, being careful not to overlap
    const revealElements = document.querySelectorAll('.reveal');
    const textElements = document.querySelectorAll('.sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading:not(.reveal .heading), .btn-show:not(.reveal .btn-show), .flex-badge:not(.reveal .flex-badge)');
    const standaloneImages = document.querySelectorAll('.sticky-wrap img:not(.navbar img, .nav-menu img, .reveal img)');

    // Set initial states
    gsap.set([...revealElements, ...textElements, ...standaloneImages], {
      opacity: 0,
      y: 20
    });

    // Animate elements above the fold immediately
    const elementsAboveFold = [...textElements].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight;
    });

    if (elementsAboveFold.length) {
      gsap.to(elementsAboveFold, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }

    // Create ScrollTriggers for all elements
    const createScrollTrigger = (element) => {
      ScrollTrigger.create({
        trigger: element,
        start: "top bottom-=100",
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          });
        },
        once: true
      });
    };

    // Apply ScrollTrigger to elements not already animated
    [...revealElements, ...textElements, ...standaloneImages].forEach(element => {
      if (!elementsAboveFold.includes(element)) {
        createScrollTrigger(element);
      }
    });

    // Refresh ScrollTrigger on resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  } else {
    // On mobile, make everything visible without animations
    document.querySelectorAll('.reveal, .sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading, .btn-show, .flex-badge, img').forEach(element => {
      gsap.set(element, {
        opacity: 1,
        y: 0
      });
    });
  }
});

// Handle complete page load
window.addEventListener('load', function() {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('is-loading');
    sessionStorage.setItem('pageLoaded', 'true');
    // Force a final ScrollTrigger refresh after all content is loaded
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
});

/* GSAP code temporarily commented out
window.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  if (typeof gsap.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .heading');

  textElements.forEach((element, index) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top bottom-=100",
          end: "bottom top",
          toggleActions: "play none none reverse",
          markers: false,
        }
      }
    );
  });
});
*/ 