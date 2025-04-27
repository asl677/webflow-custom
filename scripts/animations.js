// Run this as early as possible
(function() {
  // Initialize page transition
  const bodyWrapper = document.querySelector('.sticky-wrap');
  if (bodyWrapper) {
    // Show content once loaded
    requestAnimationFrame(() => {
      bodyWrapper.style.opacity = '1';
      bodyWrapper.style.visibility = 'visible';
    });
  }
})();

// Initialize GSAP and SplitType animations
function initAnimations() {
    console.log('Initializing animations...');

    // Check if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Split text elements
        const headings = document.querySelectorAll('h1, h2, h3');
        const paragraphs = document.querySelectorAll('p');

        // Split headings
        headings.forEach(heading => {
            const splitHeading = new SplitType(heading, {
                types: 'lines, words, chars',
                tagName: 'span'
            });

            // Animate heading characters
            gsap.from(splitHeading.chars, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                stagger: 0.02,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: heading,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Split paragraphs
        paragraphs.forEach(paragraph => {
            const splitParagraph = new SplitType(paragraph, {
                types: 'lines',
                tagName: 'span'
            });

            // Animate paragraph lines
            gsap.from(splitParagraph.lines, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: paragraph,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // Add any additional animations here
        gsap.from('.fade-in', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.fade-in',
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
});

// Handle complete page load including cached resources
window.addEventListener('load', function() {
    // Remove loading class and set session flag
    requestAnimationFrame(() => {
        document.documentElement.classList.remove('is-loading');
        sessionStorage.setItem('pageLoaded', 'true');
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