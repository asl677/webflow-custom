// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Select text elements
  const textElements = document.querySelectorAll('h1, h2, h3, p, a');
  
  // Skip if no elements found
  if (textElements.length === 0) return;
  
  // Set initial state
  gsap.set(textElements, {
    opacity: 0,
    y: 20
  });
  
  // Fade and slide in text elements on page load with stagger
  gsap.to(textElements, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
  });
  
  // Handle page transitions
  document.querySelectorAll('a[href]').forEach(link => {
    // Skip navigation links by checking for nav class or parent with nav class
    const isNavLink = link.closest('.nav') !== null;
    
    if (link.hostname === window.location.hostname && !link.target && !isNavLink) {
      link.addEventListener('click', e => {
        // Skip for same-page links
        if (link.pathname === window.location.pathname) {
          return;
        }
        
        e.preventDefault();
        const targetHref = link.href;
        
        // Animate text elements out before navigation
        gsap.to(textElements, {
          opacity: 0,
          y: -10,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.inOut",
          onComplete: () => {
            window.location = targetHref;
          }
        });
      });
    }
  });
}); 