// Run this as early as possible
(function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  if (bodyWrapper) {
    bodyWrapper.classList.add('initial-load');
    // Force immediate application of initial styles
    bodyWrapper.style.opacity = '0';
    bodyWrapper.style.visibility = 'hidden';
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

    // Force a ScrollTrigger refresh
    ScrollTrigger.refresh();

    // Handle .reveal elements with toggleActions
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element) => {
      gsap.fromTo(element, 
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

    // Handle all other elements
    const textElements = document.querySelectorAll('.sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading, .btn-show, .flex-badge, .reveal, video');
    
    // Set initial states
    textElements.forEach(element => {
      // Skip elements that should be visible immediately (like navigation)
      if (element.closest('.navbar, .nav-menu')) return;
      
      element.style.opacity = '0';
      element.style.transform = 'translateY(15px)';
      element.style.visibility = 'visible';
    });

    // Create a timeline for initial animations
    const initialTimeline = gsap.timeline({
      defaults: {
        duration: 0.6,
        ease: "power2.out"
      }
    });

    // Immediately show elements above the fold
    textElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        initialTimeline.to(element, {
          opacity: 1,
          y: 0,
          delay: Math.min(index * 0.05, 0.2)
        }, index * 0.05);
      }
    });

    // Create ScrollTrigger for each text element
    textElements.forEach((element, index) => {
      // Skip elements that are already visible or in navigation
      if (element.style.opacity === '1' || 
          element.closest('.navbar, .nav-menu') || 
          element.classList.contains('reveal')) return;
      
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top bottom", // Trigger as soon as element enters viewport
        end: "top center",   // End animation when element reaches center
        once: true,
        markers: false,
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: Math.min(index * 0.05, 0.2),
            ease: "power2.out",
            overwrite: true
          });
        }
      });

      // If element is already in view, animate it
      if (trigger.isActive) {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: Math.min(index * 0.05, 0.2),
          ease: "power2.out",
          overwrite: true
        });
      }
    });

    // Add resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });

    // Add scroll end detection for reliable ScrollTrigger refresh
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    }, { passive: true });
  } else {
    // On mobile, make all elements visible without animations
    document.querySelectorAll('.sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading, .btn-show, .flex-badge, .reveal, video').forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
      element.style.visibility = 'visible';
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