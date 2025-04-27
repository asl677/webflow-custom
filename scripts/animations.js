// Simple test to verify JavaScript is loading
console.log('Custom JavaScript is loaded!');

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