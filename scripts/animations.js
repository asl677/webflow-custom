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

  // Select all text elements we want to animate
  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .heading');

  // Create timeline for each text element
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
        delay: index * 0.1, // Stagger based on index
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top bottom-=100",
          end: "bottom top",
          toggleActions: "play none none reverse",
          markers: false, // Set to true for debugging
        }
      }
    );
  });
}); 