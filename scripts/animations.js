// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Create black overlay to prevent flickering
  const overlay = document.createElement('div');
  overlay.className = 'page-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = '#000';
  overlay.style.zIndex = '999999';
  overlay.style.pointerEvents = 'none';
  document.body.appendChild(overlay);

  // Select text elements
  const textElements = document.querySelectorAll('h1, h2, h3, p, a');
  
  // Select media elements
  const mediaElements = document.querySelectorAll('img, video');
  
  // Set elements to be immediately visible but with 0 opacity
  if (textElements.length > 0) {
    gsap.set(textElements, {
      autoAlpha: 0,
      y: 10,
      visibility: 'visible' // Set visibility first
    });
  }
  
  if (mediaElements.length > 0) {
    gsap.set(mediaElements, {
      autoAlpha: 0,
      y: 20,
      visibility: 'visible', // Set visibility first
      className: "+=media-animate"
    });
  }
  
  // Create main timeline for all animations
  const mainTl = gsap.timeline();
  
  // First fade out the overlay after a short delay
  mainTl.to(overlay, {
    autoAlpha: 0,
    duration: 0.6,
    delay: 1, // Wait for elements to be properly loaded
    onComplete: () => {
      // Remove overlay after animation
      document.body.removeChild(overlay);
    }
  });
  
  // Then animate in text elements
  if (textElements.length > 0) {
    mainTl.to(textElements, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out"
    }, "-=0.1"); // Start slightly before overlay finishes
  }
  
  // Then animate in media elements
  if (mediaElements.length > 0) {
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
        exitOverlay.style.zIndex = '9999';
        exitOverlay.style.opacity = '0';
        exitOverlay.style.pointerEvents = 'none';
        document.body.appendChild(exitOverlay);
        
        // Create timeline for smooth exit animations
        const tl = gsap.timeline({
          onComplete: () => {
            window.location = targetHref;
          }
        });
        
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