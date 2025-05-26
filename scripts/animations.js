// Version 1.0.13 - Fix mobile and exit animations timing
// Version 1.0.14 - Fix mobile-down visibility
// Version 1.0.15 - Fix white lines stagger animation
// Version 1.0.16 - Fix mobile-down visibility persistence
// Version 1.0.16.1 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.17 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.18 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.19 - Simplify text animations
// Version 1.0.20 - Streamline animations code
// Version 1.0.21 - Fix smooth text animations
// Version 1.0.22 - Fix viewport animations
// Version 1.0.23 - Streamlined code
// Version 1.0.24 - Remove redundant heading animations
// Version 1.0.25 - Consistent animation directions
// Version 1.0.26 - Consistent top-to-bottom animations
// Version 1.0.27 - Fix text animation consistency
// Version 1.0.28 - Fix animation consistency and version compatibility
// Version 1.0.29 - Fix dynamic text animations
// Version 1.0.30 - Fix font loading issues
// Version 1.0.31 - Add SplitText animations
// Version 1.0.32 - Fix font loading for SplitText
// Version 1.0.33 - Fix text selector syntax
// Version 1.0.34 - Improved script loading and animation handling
console.log('animations.js version 1.0.34 loaded');

// Simple animations v1.0.3
console.log('Initializing animations.js...');

// Check if GSAP is loaded
if (typeof gsap === 'undefined') {
  console.error('GSAP not loaded! Please check script loading order.');
  throw new Error('GSAP not loaded');
}

// Register ScrollTrigger
try {
  gsap.registerPlugin(ScrollTrigger);
  console.log('ScrollTrigger registered successfully');
} catch (error) {
  console.error('Failed to register ScrollTrigger:', error);
  throw error;
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting animations');

  // Animate text elements
  const textElements = document.querySelectorAll('h1, h2, h3, p');
  console.log('Found text elements:', textElements.length);
  
  textElements.forEach((element) => {
    gsap.from(element, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
        markers: true, // Enable markers for debugging
        onEnter: () => console.log('Text animation triggered:', element),
      }
    });
  });

  // Animate media elements with stagger
  const mediaElements = document.querySelectorAll('img, video');
  console.log('Found media elements:', mediaElements.length);
  
  gsap.from(mediaElements, {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: mediaElements,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse',
      markers: true, // Enable markers for debugging
      onEnter: () => console.log('Media animation triggered')
    }
  });

  // Animate links and buttons
  const linkElements = document.querySelectorAll('a, button');
  console.log('Found link elements:', linkElements.length);
  
  gsap.from(linkElements, {
    y: 20,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: linkElements,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse',
      markers: true, // Enable markers for debugging
      onEnter: () => console.log('Link animation triggered')
    }
  });

  console.log('All animations initialized');
});