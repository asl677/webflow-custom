// Wait for GSAP to be loaded
window.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Register ScrollTrigger plugin if available
  if (typeof gsap.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Select all h1 elements
  const headings = document.querySelectorAll('h1');

  // Create a stagger animation for each heading
  gsap.from(headings, {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: {
      amount: 0.8,
      ease: "power2.out"
    },
    scrollTrigger: {
      trigger: "body",
      start: "top 80%",
      end: "bottom top",
      toggleActions: "play none none reverse"
    }
  });

  // Optional: Add custom class handling
  headings.forEach(heading => {
    heading.classList.add('gsap-animate');
  });

  const stickyWrap = document.querySelector('.sticky-wrap');
  if (!stickyWrap) return;

  // Set initial state
  gsap.set(stickyWrap, {
    opacity: 0,
    y: 10
  });

  // Fade and slide in on page load
  gsap.to(stickyWrap, {
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
        gsap.to(stickyWrap, {
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