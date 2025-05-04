// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Initialize animations immediately, will check for SplitText inside
  initAnimations();

  // Main animation function
  function initAnimations() {
    // Set default animation parameters
    gsap.defaults({
      ease: "power2.out",
      duration: 0.6
    });

    // Color theme variables
    const colors = {
      dark: {
        background: '#000', // onyx
        text: '#fff'        // gainsboro
      },
      light: {
        background: '#fff', // gainsboro
        text: '#000'        // onyx
      }
    };

    // Detect preferred color scheme
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDarkMode ? 'dark' : 'light';
    
    // Set current theme
    let currentTheme = defaultTheme;
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      currentTheme = e.matches ? 'dark' : 'light';
      updateThemeColors();
    });

    // Function to update colors based on theme
    function updateThemeColors() {
      const themeColors = colors[currentTheme];
      document.documentElement.style.setProperty('--overlay-color', themeColors.background);
      document.documentElement.style.setProperty('--text-color', themeColors.text);
    }
    
    // Initial color setup
    updateThemeColors();
    
    // Function to hide scrollbars on specific elements (not sticky ones)
    function hideScrollbars(element) {
      if (!element) return;
      
      // Skip elements with position:sticky or elements that might be containers for sticky elements
      const style = window.getComputedStyle(element);
      if (style.position === 'sticky' || 
          element.querySelector('[style*="position: sticky"]') || 
          element.querySelector('[style*="position:sticky"]') ||
          element.classList.contains('sticky-element') ||
          element.querySelector('.sticky-element')) {
        console.log('Skipping scrollbar hiding for sticky element or container', element);
        return;
      }
      
      // If it's a scrollable container but not a sticky one, hide scrollbars
      element.style.scrollbarWidth = 'none'; // Firefox
      element.style.msOverflowStyle = 'none'; // IE and Edge
      
      // For dynamic elements, use the CSS class to hide webkit scrollbars
      element.classList.add('no-scrollbar');
    }
    
    // Function to properly handle scrollable areas that have sticky elements
    function setupScrollableWithSticky(container) {
      if (!container) return;
      
      // Check if this container has sticky elements
      if (container.querySelector('[style*="position: sticky"]') || 
          container.querySelector('[style*="position:sticky"]') ||
          container.querySelector('.sticky-element')) {
        
        // Create a wrapper-content structure for proper scrolling with hidden scrollbars
        if (!container.classList.contains('scrollable-wrapper')) {
          // Only apply this transformation if it hasn't been done already
          const content = document.createElement('div');
          content.className = 'scrollable-content';
          
          // Move all children to the new content div
          while (container.firstChild) {
            content.appendChild(container.firstChild);
          }
          
          // Add the content back to the container
          container.appendChild(content);
          container.classList.add('scrollable-wrapper');
        }
      } else {
        // If no sticky elements, use the simple method
        hideScrollbars(container);
      }
    }

    // DOM elements
    const textElements = document.querySelectorAll('h1, h2, h3, p, a, .nav');
    const mediaElements = document.querySelectorAll('img, video');
    const mobileDownElements = document.querySelectorAll('.mobile-down');

    gsap.registerPlugin(SplitText) 

    // split elements with the class "split" into words and characters
    let split = SplitText.create(".heading.large.bold.skinny", { type: "lines, chars" });

    // now animate the characters in a staggered fashion
    gsap.from(split.chars, {
      duration: 1, 
      y: 100,       // animate from 100px below
      autoAlpha: 0, // fade in from opacity: 0 and visibility: hidden
      stagger: 0.05 // 0.05 seconds between each
    });
        
    // Delay in milliseconds - very short for immediate visibility
    const delay = 400;

    setTimeout(() => {
      const cards = document.querySelectorAll('.card-project');
      cards.forEach(card => {
        card.style.opacity = '1';
      });
    }, delay);
    
    // Create and inject overlay
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--overlay-color, #000)',
      zIndex: '9999',
      pointerEvents: 'none'
    });
    overlay.className = 'page-overlay';
    document.body.appendChild(overlay);
    
    // Set initial states
    if (textElements.length > 0) {
      gsap.set(textElements, {
        autoAlpha: 0,
        y: 20,
        visibility: 'hidden'
      });
    }
    
    if (mediaElements.length > 0) {
      gsap.set(mediaElements, {
        autoAlpha: 0,
        y: 40,
        visibility: 'hidden',
        className: "+=media-animate"
      });
    }
    
    // Setup for mobile-down elements - simple height animation
    if (mobileDownElements.length > 0) {
      mobileDownElements.forEach(el => {
        // Just set initial state - height 0
        gsap.set(el, { 
          height: 0,
          y: 30,
          opacity: 0,
          visibility: 'hidden'
        });
      });
    }
    
    // Create main timeline
    const mainTl = gsap.timeline({
      defaults: {
        immediateRender: true // Ensures elements render right away
      }
    });
    
    // Animation sequence
    mainTl
      // Fade out overlay
      .to(overlay, {
        autoAlpha: 0,
        duration: 0.4, // Even faster fade
        delay: 0.01, // Minimal delay
        onComplete: () => document.body.contains(overlay) && document.body.removeChild(overlay)
      })
      // Animate text elements - run immediately with overlay
      .to(textElements, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08, // Faster stagger
        duration: 0.5 // Faster animation
      }, "-=0.4") // Start during overlay fade
      
      // Animate media elements - with minimal delay after overlay fade
      .to(mediaElements, {
        autoAlpha: 1, 
        y: 0,
        stagger: 0.08, // Faster stagger
        duration: 0.5, // Faster animation
        onComplete: () => mediaElements.forEach(el => el.classList.add('visible'))
      }, "<0.05") // Start 0.05 seconds after overlay starts fading, independent of text
      
      // Simple height animation for mobile-down - run immediately
      .to(mobileDownElements, {
        height: "auto",
        opacity: 1,
        y: 0,
        visibility: "visible",
        duration: 0.5, // Faster animation
        stagger: 0.01 // Faster stagger
      }, "-=0.4"); // Start much sooner
    
    // Find and handle existing sticky elements
    const stickyElements = document.querySelectorAll('[style*="position: sticky"], [style*="position:sticky"]');
    stickyElements.forEach(el => {
      el.classList.add('sticky-element');
    });
    
    // Find and process scrollable containers with sticky elements
    document.querySelectorAll('[style*="overflow: auto"], [style*="overflow:auto"], [style*="overflow-y: auto"], [style*="overflow-y:auto"], .scrollable').forEach(container => {
      setupScrollableWithSticky(container);
    });
    
    // Apply simple scrollbar hiding to general scrollable elements without stickies
    document.querySelectorAll('[style*="overflow: scroll"], [style*="overflow:scroll"], [style*="overflow-y: scroll"], [style*="overflow-y:scroll"]').forEach(el => {
      if (!el.querySelector('[style*="position: sticky"], [style*="position:sticky"], .sticky-element')) {
        hideScrollbars(el);
      }
    });
    
    // Create a MutationObserver to watch for new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Check if this is a sticky element
              const style = window.getComputedStyle(node);
              if (style.position === 'sticky') {
                node.classList.add('sticky-element');
                return;
              }
              
              // Check if it's a scrollable container
              if (style.overflow === 'auto' || style.overflow === 'scroll' || 
                  style.overflowY === 'auto' || style.overflowY === 'scroll') {
                setupScrollableWithSticky(node);
              }
              
              // Check children for scrollable and sticky elements
              if (node.querySelectorAll) {
                // Add sticky-element class to any sticky elements
                node.querySelectorAll('[style*="position: sticky"], [style*="position:sticky"]').forEach(el => {
                  el.classList.add('sticky-element');
                });
                
                // Process any scrollable containers
                node.querySelectorAll('[style*="overflow: auto"], [style*="overflow:auto"], [style*="overflow-y: auto"], [style*="overflow-y:auto"], .scrollable').forEach(container => {
                  setupScrollableWithSticky(container);
                });
              }
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // Handle page transitions - simplified approach
    document.querySelectorAll('a[href]').forEach(link => {
      // Only handle internal links
      if (link.hostname !== window.location.hostname || link.target) return;
      
      link.addEventListener('click', e => {
        // Skip same-page links
        if (link.pathname === window.location.pathname) return;
        
        e.preventDefault();
        const targetHref = link.href;
        
        // Create exit overlay
        const exitOverlay = document.createElement('div');
        exitOverlay.className = 'page-exit-overlay';
        Object.assign(exitOverlay.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--overlay-color, #000)',
          zIndex: '9999',
          opacity: '0',
          pointerEvents: 'none'
        });
        document.body.appendChild(exitOverlay);
        
        // Elements to animate out
        const elementsToAnimate = [textElements, mediaElements];
        
        // Handle mobile-down elements during exit
        if (mobileDownElements.length > 0) {
          gsap.to(mobileDownElements, {
            height: 0,
            opacity: 0,
            duration: 0.4, // Faster exit
            ease: "power2.inOut"
          });
        }
        
        // Exit animation
        gsap.timeline({
          onComplete: () => window.location = targetHref
        })
        .to(elementsToAnimate, {
          autoAlpha: 0,
          y: -20,
          duration: 0.3, // Faster exit
          stagger: 0.001, // Minimal stagger
          ease: "power2.inOut"
        })
        .to(exitOverlay, {
          opacity: 1,
          duration: 0.3, // Faster fade
          ease: "power2.inOut"
        });
      });
    });
  }
}); 