// Simple test to verify JavaScript is loading
console.log('Custom JavaScript is loaded!');

// Initialize animations when DOM is ready
window.addEventListener('DOMContentLoaded', function() {
  // Initialize Swup
  const swup = new Swup({
    animationSelector: '[class*="transition-"]',
    containers: ["#swup"],
    cache: true,
    plugins: [new SwupScrollPlugin()],
    animateHistoryBrowsing: true,
  });

  // Function to initialize GSAP animations
  function initGSAP() {
    // Make sure GSAP is available
    if (typeof gsap === 'undefined') {
      console.error('GSAP not loaded');
      return;
    }

    // Register ScrollTrigger plugin
    if (typeof gsap.ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Select all text elements we want to animate
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .heading');

    // Create timeline for each text element
    textElements.forEach((element, index) => {
      // Add data attribute to mark element for animation
      element.setAttribute('data-gsap', 'true');
      
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
          }
        }
      );
    });
  }

  // Initialize GSAP on first load
  initGSAP();

  // Reinitialize GSAP after Swup page changes
  swup.on('contentReplaced', function() {
    // Kill all existing ScrollTriggers
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    
    // Reinitialize GSAP
    initGSAP();
  });
});

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