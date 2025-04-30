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
  
  // Set initial state for text elements
  if (textElements.length > 0) {
    gsap.set(textElements, {
      opacity: 0,
      y: 10
    });
    
    // Fade and slide in text elements on page load with stagger
    gsap.to(textElements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out"
    });
  }
  
  // Set initial state for media elements
  if (mediaElements.length > 0) {
    gsap.set(mediaElements, {
      opacity: 0,
      y: 20,
      className: "+=media-animate"
    });
    
    // Fade and slide in media elements with a slight delay after text
    gsap.to(mediaElements, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 1,
      stagger: 0.05,
      ease: "power2.out",
      onComplete: function() {
        // Add visible class for CSS transitions
        mediaElements.forEach(el => el.classList.add('visible'));
      }
    });
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
        
        // Create timeline for smooth exit animations
        const tl = gsap.timeline({
          onComplete: () => {
            window.location = targetHref;
          }
        });
        
        // Animate text elements out
        tl.to(textElements, {
          opacity: 0,
          y: -10,
          duration: 0.4,
          stagger: 0.005,
          ease: "power2.inOut"
        });
        
        // Animate media elements out with slight delay
        tl.to(mediaElements, {
          opacity: 0,
          y: -10,
          duration: 0.5,
          stagger: 0.005,
          ease: "power2.inOut"
        }, "-=0.05"); // Overlap with text animations
      });
    }
  });
}); 