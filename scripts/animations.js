// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Set lag smoothing to improve performance
  gsap.ticker.lagSmoothing(1000, 16);
  
  // Completely exclude all navigation elements (more comprehensive selectors)
  const navSelectors = '.nav, .nav-bar, .navbar, .navigation, .nav-menu, .nav-link, .nav-container, .nav-logo, .nav-button, .menu-button, .nav a, .navbar a, .nav-menu a, .navigation a';
  
  // Make all navigation elements immediately visible
  gsap.set(navSelectors, {
    clearProps: 'all',
    opacity: 1,
    visibility: 'visible'
  });
  
  // Select text elements (explicitly exclude navigation elements)
  const textElements = document.querySelectorAll('h1:not(.nav *):not(.navbar *), h2:not(.nav *):not(.navbar *), h3:not(.nav *):not(.navbar *), p:not(.nav *):not(.navbar *), a:not(.nav a):not(.navbar a):not(.nav-link):not(.menu-button)');
  
  // Select media elements
  const mediaElements = document.querySelectorAll('img:not(.nav img):not(.navbar img):not(.logo), video:not(.nav video):not(.navbar video)');
  
  // Select card project elements
  const cardElements = document.querySelectorAll('.card-project');

  // Ensure all non-nav elements are hidden initially
  gsap.set([textElements, mediaElements, cardElements], {
    opacity: 0,
    visibility: 'hidden'
  });
  
  // Add a delay before starting animations
  setTimeout(() => {
    // Set initial state for text elements
    if (textElements.length > 0) {
      gsap.set(textElements, {
        y: 10,
        visibility: 'visible'
      });
      
      // Fade and slide in text elements on page load with faster stagger
      gsap.to(textElements, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: "power2.out"
      });
    }
    
    // Set initial state for media elements
    if (mediaElements.length > 0) {
      gsap.set(mediaElements, {
        y: 20,
        visibility: 'visible',
        className: "+=media-animate"
      });
      
      // Fade and slide in media elements with a slight delay after text
      gsap.to(mediaElements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: 0.3,
        stagger: 0.03,
        ease: "power2.out",
        onComplete: function() {
          // Add visible class for CSS transitions
          mediaElements.forEach(el => el.classList.add('visible'));
        }
      });
    }
    
    // Set initial state for card elements
    if (cardElements.length > 0) {
      gsap.set(cardElements, {
        y: 30,
        scale: 0.95,
        visibility: 'visible'
      });
      
      // Fade and slide in card elements with a slight delay after media
      gsap.to(cardElements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: function() {
          // Add visible class for CSS transitions
          cardElements.forEach(el => el.classList.add('visible'));
        }
      });
    }
  }, 300); // Add 300ms delay before starting animations
  
  // Handle page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    // More comprehensive check for navigation links
    const isNavLink = link.classList.contains('nav-link') || 
                      link.classList.contains('menu-button') || 
                      link.classList.contains('logo') ||
                      link.closest('.nav') !== null || 
                      link.closest('.navbar') !== null || 
                      link.closest('.navigation') !== null ||
                      link.closest('.nav-menu') !== null ||
                      link.closest('.nav-bar') !== null;
    
    if (link.hostname === window.location.hostname && !link.target && !isNavLink) {
      link.addEventListener('click', function(e) {
        // Skip for same-page links
        if (link.pathname === window.location.pathname) {
          return;
        }
        
        e.preventDefault();
        const targetHref = this.href;
        
        // Create timeline for smooth exit animations
        const tl = gsap.timeline({
          onComplete: () => {
            window.location = targetHref;
          }
        });
        
        // Animate text elements out faster
        tl.to(textElements, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.inOut"
        });
        
        // Animate media elements out with slight delay
        tl.to(mediaElements, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.inOut"
        }, "-=0.2");
        
        // Animate card elements out with slight delay
        tl.to(cardElements, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.3,
          stagger: 0.02,
          ease: "power2.inOut"
        }, "-=0.2");
      });
    }
  });
}); 