// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

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
      duration: 0.6
    });
    
    // Create preloader counter (but don't append to DOM yet)
    const preloaderCounter = document.createElement('div');
    preloaderCounter.className = 'preloader-counter';
    Object.assign(preloaderCounter.style, {
      position: 'fixed',
      top: '1vw',
      left: '1vw',
      color: 'white',
      fontSize: '2rem', // Larger font for single digit
      fontWeight: 'bold',
      zIndex: '10000',
      opacity: '0',
      visibility: 'visible'
    });
    
    // Create the counter text element
    const counterText = document.createElement('span');
    counterText.textContent = '1';
    preloaderCounter.appendChild(counterText);
    
    // Track loaded resources
    let totalResources = 0;
    let loadedResources = 0;
    let preloaderActive = false;
    let animationInProgress = false;
    
    // Find all resources that need loading
    function countResources() {
      // Get all images and videos
      const images = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      
      // Only count incomplete images and videos with data-size="large"
      const loadingImages = images.filter(img => !img.complete);
      const loadingVideos = videos.filter(video => 
        video.getAttribute('data-size') === 'large' || 
        video.hasAttribute('preload'));
      
      console.log(`Found ${loadingImages.length} loading images and ${loadingVideos.length} loading videos`);
      
      // Calculate total resources
      totalResources = loadingImages.length + loadingVideos.length;
      loadedResources = 0;
      
      // If no resources or very few, force at least a brief animation
      return totalResources > 0;
    }
    
    // Simulate counting progress based on time for more reliable animation
    function simulateProgress(duration) {
      animationInProgress = true;
      
      // Create a timeline for smoother counting
      const countTl = gsap.timeline({
        onComplete: () => {
          finishPreloaderAnimation();
          animationInProgress = false;
        }
      });
      
      // Animate from 1 to 9
      countTl.to(counterText, {
        duration: duration,
        innerText: 9,
        snap: { innerText: 1 },
        ease: "power1.in"
      });
    }
    
    // Setup resource tracking
    function setupResourceTracking() {
      if (totalResources === 0) return;
      
      // Start a simulated counter for better visual effect
      simulateProgress(1.5);
      
      // Track image loading
      document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
          img.addEventListener('load', () => {
            loadedResources++;
            // We won't update the counter here as the animation handles it
          });
          
          img.addEventListener('error', () => {
            loadedResources++;
            // We won't update the counter here as the animation handles it
          });
        }
      });
      
      // Track video loading (basic)
      document.querySelectorAll('video').forEach(video => {
        if (video.getAttribute('data-size') === 'large' || video.hasAttribute('preload')) {
          video.addEventListener('canplaythrough', () => {
            loadedResources++;
            // We won't update the counter here as the animation handles it
          });
          
          video.addEventListener('error', () => {
            loadedResources++;
            // We won't update the counter here as the animation handles it
          });
        }
      });
    }
    
    // Complete the preloader animation
    function finishPreloaderAnimation() {
      if (!preloaderActive) return;
      
      // Fade out the preloader
      gsap.to(preloaderCounter, {
        autoAlpha: 0,
        duration: 0.3,
        onComplete: () => {
          if (document.body.contains(preloaderCounter)) {
            document.body.removeChild(preloaderCounter);
          }
          startMainAnimations();
        }
      });
    }
    
    // Start preloader function
    function startPreloader() {
      // Add preloader to DOM
      document.body.appendChild(preloaderCounter);
      preloaderActive = true;
      
      // Fade in the preloader
      gsap.to(preloaderCounter, {
        autoAlpha: 1,
        duration: 0.3,
        onComplete: () => {
          // After fade in, start tracking resources
          setupResourceTracking();
        }
      });
      
      // Add a fallback in case resource loading gets stuck
      setTimeout(() => {
        if (preloaderActive && !animationInProgress) {
          console.log("Preloader fallback triggered");
          simulateProgress(0.8); // Quick simulation to finish
        }
      }, 1500); // Shorter fallback timeout
    }
    
    // Check if preloader is needed
    const resourcesLoading = countResources();
    
    // Start either preloader or skip to animations depending on loading state
    if (resourcesLoading && document.readyState !== 'complete') {
      console.log("Resources loading, showing preloader");
      startPreloader();
    } else {
      console.log("No resources loading, skipping preloader");
      startMainAnimations();
    }
    
    // Function to start the main animations
    function startMainAnimations() {
      preloaderActive = false;
      
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
      const cardProjects = document.querySelectorAll('.card-project');
      
      gsap.registerPlugin(SplitText); 
      
      // split elements with the class "split" into lines
      let splitElements = document.querySelectorAll(".heading.large.bold.skinny");
      if (splitElements.length > 0) {
        let split = SplitText.create(".heading.large.bold.skinny", { type: "lines" });
        
        // now animate the characters in a staggered fashion
        gsap.from(split.lines, {
          duration: 1.5, 
          y: 50,       // animate from
          autoAlpha: 0, // fade in
          stagger: 0.12 // seconds between each
        });
      }
        
      // Create and inject overlay
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--overlay-color)',
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
      
      if (cardProjects.length > 0) {
        gsap.set(cardProjects, {
          autoAlpha: 0,
          y: 30,
          opacity: 0,
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
          visibility: 'visible',
          stagger: 0.08, // Faster stagger
          duration: 0.5 // Faster animation
        }, "-=0.4") // Start during overlay fade
        
        // Animate media elements - with minimal delay after overlay fade
        .to(mediaElements, {
          autoAlpha: 1, 
          y: 0,
          visibility: 'visible',
          stagger: 0.08, // Faster stagger
          duration: 0.5, // Faster animation
          onComplete: () => mediaElements.forEach(el => el.classList.add('visible'))
        }, "<0.05") // Start 0.05 seconds after overlay starts fading, independent of text
        
        // Animate card projects with proper easing and duration
        .to(cardProjects, {
          autoAlpha: 1,
          y: 0, 
          visibility: 'visible',
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out"
        }, "<0.1") // Start slightly after media elements
        
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
            backgroundColor: 'var(--overlay-color)',
            zIndex: '9999',
            opacity: '0',
            pointerEvents: 'none'
          });
          document.body.appendChild(exitOverlay);
          
          // Elements to animate out
          const elementsToAnimate = [textElements, mediaElements, cardProjects];
          
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
            y: -10,
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
  }
  
  // Call the function to initialize animations
  initAnimations();
}); 
// Force update: Sat May 4 17:22:17 PDT 2025
