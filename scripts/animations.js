// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

  // Immediately hide elements that should start hidden 
  // Especially card-projects to prevent flickering
  document.querySelectorAll('.card-project').forEach(el => {
    el.style.opacity = "0";
    el.style.visibility = "hidden";
    el.style.transform = "translateY(10px)";
  });

  // Hide mobile-down elements IMMEDIATELY
  document.querySelectorAll('.mobile-down').forEach(el => {
    el.style.height = "0";
    el.style.opacity = "0";
    el.style.visibility = "hidden";
    el.style.overflow = "hidden";
  });

  // Initialize animations immediately
  function initAnimations() {
    // Set default animation parameters
    gsap.defaults({
      ease: "power2.out",
      duration: 0.64
    });
    
    // Track active state
    let animationsActive = false;
    
    // DOM elements
    const textElements = document.querySelectorAll('h1, h2, h3, p, a, .nav');
    const mediaElements = document.querySelectorAll('img, video');
    const mobileDownElements = document.querySelectorAll('.mobile-down');
    const cardProjects = document.querySelectorAll('.card-project');
    
    gsap.registerPlugin(SplitText); 
    
    // split elements with the class "split" into lines
    let splitElements = document.querySelectorAll(".heading.large.bold.skinny");
    if (splitElements.length > 0) {
      let split = SplitText.create(".heading.large.bold.skinny", { type: "lines" });
      
      // now animate the characters in a staggered fashion
      gsap.from(split.lines, {
        duration: 1.04, 
        y: 50,       // animate from
        autoAlpha: 0, // fade in
        ease: "power2.out", // easing
        stagger: 0.24 // seconds between each
      });
    }
    
    // Character by character animation for .heading.huge
    let hugeHeadings = document.querySelectorAll(".heading.huge");
    if (hugeHeadings.length > 0) {
      let splitHuge = SplitText.create(".heading.huge", { type: "chars" });
      
      // Animate characters individually
      gsap.from(splitHuge.chars, {
        duration: 1.24,
        y: 40,
        autoAlpha: 0,
        ease: "power3.out",
        stagger: 0.07 // Faster stagger for characters
      });
    }
      
    // Create and inject overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-overlay';
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "#000";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);
    
    // Set initial states
    if (textElements.length > 0) {
      gsap.set(textElements, {
        autoAlpha: 0,
        y: 20,
        visibility: 'hidden'
      });
    }
    
    if (cardProjects.length > 0) {
      gsap.set(cardProjects, {
        autoAlpha: 0,
        y: 90,
        opacity: 0,
        visibility: 'hidden'
      });
    }
    
    if (mediaElements.length > 0) {
      gsap.set(mediaElements, {
        autoAlpha: 0,
        y: 50,
        visibility: 'hidden',
        className: "+=media-animate"
      });
    }
    
    // Setup for mobile-down elements - ensure they're fully hidden before animation
    if (mobileDownElements.length > 0) {
      mobileDownElements.forEach(el => {
        // Force inline styles directly to ensure they take effect
        el.style.height = "0";
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        el.style.overflow = "hidden";
        
        // Also use GSAP set for good measure
        gsap.set(el, { 
          height: 0,
          y: 30,
          opacity: 0,
          visibility: 'hidden'
        });
      });
    }
    
    // Start main animations
    startMainAnimations();
    
    // Function to start the main animations
    function startMainAnimations() {
      // Prevent multiple calls
      if (animationsActive) return;
      animationsActive = true;
      
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
          duration: 0.24, // Faster fade
          delay: 0.04, // No delay
          onComplete: () => document.body.contains(overlay) && document.body.removeChild(overlay)
        })
        
        // Animate text elements - run immediately with overlay
        .to(textElements, {
          autoAlpha: 1,
          y: 0,
          visibility: 'visible',
          stagger: 0.08, // Faster stagger
          duration: 0.34 // Faster animation
        }, 0) // Start at the very beginning
        
        // Animate media elements - start immediately
        .to(mediaElements, {
          autoAlpha: 1, 
          y: 0,
          visibility: 'visible',
          stagger: 0.08, // Faster stagger
          duration: 0.04, // Very fast animation
          onComplete: () => mediaElements.forEach(el => el.classList.add('visible'))
        }, 0) // Start at the very beginning
        
        // Animate card projects with proper easing and duration - start immediately
        .to(cardProjects, {
          autoAlpha: 1,
          y: 0, 
          visibility: 'visible',
          stagger: 0.08,
          duration: 0.34,
          ease: "power2.out"
        }, 0) // Start at the very beginning
        
        // Simple height animation for mobile-down - run immediately
        .to(mobileDownElements, {
          height: "auto",
          opacity: 1,
          y: 0,
          visibility: "visible",
          duration: 0.34, // Faster animation
          stagger: 0.05 // Faster stagger
        }, 0); // Start at the very beginning
      
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
      const allLinks = document.querySelectorAll('a[href]');
      console.log('Found ' + allLinks.length + ' links to attach exit animations to');
      
      allLinks.forEach(link => {
        // Only handle internal links
        if (link.hostname !== window.location.hostname || link.target) return;
        
        // Check if link is in a sticky container
        const isInSticky = link.closest('.sticky-element, [style*="position: sticky"], [style*="position:sticky"], .sticky-wrap, .navbar, .nav, header, [class*="sticky"]') !== null;
        
        if (isInSticky) {
          console.log('Found sticky link:', link.href);
        }
        
        // DON'T clone and replace links - it breaks their display
        // Instead, attach event listener directly to original link
        link.addEventListener('click', e => {
          // Skip same-page links
          if (link.pathname === window.location.pathname || link.getAttribute('href')?.startsWith('#')) return;
          
          console.log('Exit animation triggered for:', link.href, isInSticky ? '(sticky link)' : '');
          
          e.preventDefault();
          const targetHref = link.href;
          
          // Create exit overlay
          const exitOverlay = document.createElement('div');
          exitOverlay.className = 'page-exit-overlay';
          exitOverlay.style.position = "fixed";
          exitOverlay.style.top = "0";
          exitOverlay.style.left = "0";
          exitOverlay.style.width = "100%";
          exitOverlay.style.height = "100%";
          exitOverlay.style.backgroundColor = "#000";
          exitOverlay.style.zIndex = "9999";
          exitOverlay.style.opacity = "0";
          exitOverlay.style.pointerEvents = "none";
          document.body.appendChild(exitOverlay);
          
          // Handle different element types separately to ensure they all fade out properly
          const exitTl = gsap.timeline({
            onComplete: () => window.location = targetHref,
            defaults: {
              duration: 0.44,
              ease: "power2.inOut"
            }
          });
          
          // Handle mobile-down elements during exit
          if (mobileDownElements.length > 0) {
            exitTl.to(mobileDownElements, {
              height: 0,
              opacity: 0
            }, 0); // Start at the beginning of the timeline
          }

          // Fade out text elements
          if (textElements.length > 0) {
            exitTl.to(textElements, {
              autoAlpha: 0,
              y: -20
            }, 0); // Start at the beginning of the timeline
          }

          // Fade out media elements
          if (mediaElements.length > 0) {
            exitTl.to(mediaElements, {
              autoAlpha: 0,
              y: -10
            }, 0); // Start at the beginning of the timeline
          }
          
          // Fade out card projects - run unconditionally
          exitTl.to('.card-project', {
            autoAlpha: 0,
            y: 0
          }, 0); // Start at the beginning of the timeline

          // Fade in the exit overlay as the last step
          exitTl.to(exitOverlay, {
            opacity: 1,
            duration: 0.44
          }, 0); 
        });
      });
    }
  }
  
  // Call the function to initialize animations
  initAnimations();
}); 
// Force update: Sat May 4 23:00:00 PDT 2025
