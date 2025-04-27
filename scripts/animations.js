// Add loading class to html element
if (!sessionStorage.getItem('pageLoaded')) {
  document.documentElement.classList.add('is-loading');
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  
  if (bodyWrapper) {
    // Show content once DOM is ready
    requestAnimationFrame(() => {
      bodyWrapper.classList.add('page-loaded');
    });

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
          // Only fade the main content
          bodyWrapper.classList.add('fade-out');
          
          setTimeout(function() {
            window.location = link.href;
          }, 600); // match CSS transition time
        });
      }
    });
  }

  // Initialize GSAP animations
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Register ScrollTrigger plugin
  if (typeof gsap.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Select all text elements we want to animate (excluding navigation)
  const textElements = document.querySelectorAll('.sticky-wrap h1, .sticky-wrap h2, .sticky-wrap h3, .sticky-wrap h4, .sticky-wrap h5, .sticky-wrap h6, .sticky-wrap p, .sticky-wrap .heading, .btn-show, a, .flex-badge');

  // Create timeline for each text element
  textElements.forEach((element, index) => {
    // Add data attribute to mark element for animation
    element.setAttribute('data-gsap', 'true');
    
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
          start: "top bottom-=50", 
          end: "top center", // End animation when element reaches center of viewport
          toggleActions: "play none none reverse",
          markers: false,
        }
      }
    );
  });
});

// Handle complete page load including cached resources
window.addEventListener('load', function() {
  // Remove loading class and set session flag
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