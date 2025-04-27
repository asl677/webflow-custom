// Run this as early as possible
(function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  if (bodyWrapper) {
    // Add class immediately instead of inline styles
    bodyWrapper.classList.add('initial-load');
  }
})();

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  
  if (bodyWrapper) {
    // Show content immediately
    bodyWrapper.classList.remove('initial-load');
    bodyWrapper.classList.add('page-loaded');

    const links = document.querySelectorAll('a[href]');

    links.forEach(function(link) {
      // Skip navigation links from transition effect
      if (link.closest('.navbar, .nav-menu')) return;
      
      if (link.hostname === window.location.hostname && !link.target) {
        link.addEventListener('click', function(e) {
          // Prevent navigation if clicking current page link
          const isSamePage = link.pathname === window.location.pathname;
          if (isSamePage) {
            e.preventDefault();
            return;
          }
          
          e.preventDefault();
          bodyWrapper.classList.add('fade-out');
          
          setTimeout(function() {
            window.location = link.href;
          }, 400); // Reduced from 600ms for faster transitions
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

    // Initial setup for elements
    const textElements = document.querySelectorAll('.sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading, .btn-show, .flex-badge, img, video');
    
    // Immediately show elements above the fold
    textElements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.style.opacity = '1';
        element.style.transform = 'none';
      }
    });

    // Create timeline for each text element
    textElements.forEach((element, index) => {
      // Skip elements that are already visible
      if (element.style.opacity === '1') return;
      
      // Add data attribute to mark element for animation
      element.setAttribute('data-gsap', 'true');
      
      // Create ScrollTrigger for this element
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top bottom-=100", // More aggressive trigger point
        end: "bottom center",     // End when element reaches center
        once: true,              // Animation plays once
        markers: false,
        onEnter: () => animateElement(element, index),
        onEnterBack: () => animateElement(element, index)
      });

      // If element is already in view, animate it immediately
      if (trigger.isActive) {
        animateElement(element, index);
      }
    });

    // Animation function
    function animateElement(element, index) {
      gsap.fromTo(element,
        {
          opacity: 0,
          y: 15  // Reduced from 20 for subtler animation
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,  // Faster animation
          delay: Math.min(index * 0.05, 0.3),  // Cap the delay
          ease: "power2.out",
          overwrite: true
        }
      );
    }

    // Add resize handler to refresh ScrollTrigger
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
  } else {
    // On mobile, make all elements visible without animations
    document.querySelectorAll('.sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading, .btn-show, .flex-badge, img, video').forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }
});

// Handle complete page load
window.addEventListener('load', function() {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('is-loading');
    sessionStorage.setItem('pageLoaded', 'true');
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