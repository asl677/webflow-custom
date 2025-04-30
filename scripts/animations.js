// Add loading class to HTML element immediately
document.documentElement.classList.add('loading');

// Create preloader div immediately
const preloader = document.createElement('div');
preloader.className = 'page-preloader';
document.addEventListener('DOMContentLoaded', function() {
  document.body.appendChild(preloader);
});

// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Select text elements
  const textElements = document.querySelectorAll('h1, h2, h3, p, a');
  
  // Select media elements
  const mediaElements = document.querySelectorAll('img, video');
  
  // Create main timeline for all animations
  const mainTl = gsap.timeline({
    onComplete: () => {
      // Remove loading class when animations are complete
      document.documentElement.classList.remove('loading');
    }
  });
  
  // Wait for images to load
  let imagesLoaded = 0;
  const imageElements = document.querySelectorAll('img');
  const totalImages = imageElements.length;
  
  // If no images, proceed immediately
  if (totalImages === 0) {
    startAnimations();
  } else {
    // Wait for images to load before starting animations
    imageElements.forEach(img => {
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded); // Handle error too
      }
    });
  }
  
  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded >= totalImages) {
      startAnimations();
    }
  }
  
  function startAnimations() {
    // First fade out the overlay
    mainTl.to(preloader, {
      autoAlpha: 0,
      duration: 0.6,
      onComplete: () => {
        // Remove preloader after animation
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }
    });
    
    // Set initial state for text elements
    if (textElements.length > 0) {
      gsap.set(textElements, {
        autoAlpha: 0,
        y: 10,
        visibility: 'visible' // Ensure visibility is set
      });
      
      // Then animate in text elements
      mainTl.to(textElements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.out"
      }, "-=0.1"); // Start slightly before overlay finishes
    }
    
    // Set initial state for media elements
    if (mediaElements.length > 0) {
      gsap.set(mediaElements, {
        autoAlpha: 0,
        y: 20,
        visibility: 'visible', // Ensure visibility is set
        className: "+=media-animate"
      });
      
      // Then animate in media elements
      mainTl.to(mediaElements, {
        autoAlpha: 1, 
        y: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power2.out",
        onComplete: function() {
          // Add visible class for CSS transitions
          mediaElements.forEach(el => el.classList.add('visible'));
        }
      }, "-=0.7"); // Start before text animations finish
    }
  }
  
  // Handle page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.hostname === window.location.hostname && !link.target) {
      link.addEventListener('click', e => {
        // Skip for same-page links
        if (link.pathname === window.location.pathname) {
          return;
        }
        
        e.preventDefault();
        const targetHref = link.href;
        
        // Create black overlay for page exit
        const exitOverlay = document.createElement('div');
        exitOverlay.className = 'page-exit-overlay';
        exitOverlay.style.position = 'fixed';
        exitOverlay.style.top = '0';
        exitOverlay.style.left = '0';
        exitOverlay.style.width = '100%';
        exitOverlay.style.height = '100%';
        exitOverlay.style.backgroundColor = '#000';
        exitOverlay.style.zIndex = '9999999';
        exitOverlay.style.opacity = '0';
        exitOverlay.style.pointerEvents = 'none';
        document.body.appendChild(exitOverlay);
        
        // Create timeline for smooth exit animations
        const tl = gsap.timeline({
          onComplete: () => {
            window.location = targetHref;
          }
        });
        
        // Add loading class back to HTML
        document.documentElement.classList.add('loading');
        
        // Animate text and media elements out
        tl.to([textElements, mediaElements], {
          autoAlpha: 0,
          y: -10,
          duration: 0.3,
          stagger: 0.005,
          ease: "power2.inOut"
        })
        // Fade in the black overlay last
        .to(exitOverlay, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.inOut"
        });
      });
    }
  });
}); 