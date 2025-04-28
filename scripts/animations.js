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
    if (link.hostname === window.location.hostname && !link.target && !link.closest('.nav')) {
      link.addEventListener('click', e => {
        // Skip for same-page links
        if (link.pathname === window.location.pathname) {
          e.preventDefault();
          return;
        }
        
        e.preventDefault();
        // Fade and slide up on exit
        gsap.to(bodyWrapper, {
          opacity: 0,
          y: -10,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => window.location = link.href
        });
      });
    }
  });
}); 