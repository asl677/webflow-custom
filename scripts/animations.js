// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  const bodyWrapper = document.querySelector('.body-wrapper');
  if (!bodyWrapper) return;

  // Set initial state
  gsap.set(bodyWrapper, {
    opacity: 0,
    y: 10
  });

  // Fade and slide in on page load
  gsap.to(bodyWrapper, {
    opacity: 1,
    y: 0,
    duration: 0.6,
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
        
        // Fade and slide up on exit with longer duration
        gsap.to(bodyWrapper, {
          opacity: 0,
          y: -10,
          duration: 0.8, // Increased duration
          ease: "power2.inOut", // Smoother easing
          onComplete: () => {
            window.location = targetHref;
          }
        });
      });
    }
  });
}); 