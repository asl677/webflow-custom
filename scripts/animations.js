// Wait for GSAP to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make sure GSAP is available
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded');
    return;
  }

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
  
  // Function to hide scrollbars on any scrollable element
  function hideScrollbars(element) {
    if (!element) return;
    
    element.style.scrollbarWidth = 'none'; // Firefox
    element.style.msOverflowStyle = 'none'; // IE and Edge
    
    // For dynamic elements, we need to add a class that has the webkit scrollbar style
    element.classList.add('no-scrollbar');
  }

  // DOM elements
  const textElements = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaElements = document.querySelectorAll('img, video');
  
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
      y: 10,
      visibility: 'hidden'
    });
  }
  
  if (mediaElements.length > 0) {
    gsap.set(mediaElements, {
      autoAlpha: 0,
      y: 20,
      visibility: 'hidden',
      className: "+=media-animate"
    });
  }
  
  // Create main timeline
  const mainTl = gsap.timeline();
  
  // Animation sequence
  mainTl
    // Fade out overlay
    .to(overlay, {
      autoAlpha: 0,
      duration: 0.5,
      delay: 1,
      onComplete: () => document.body.contains(overlay) && document.body.removeChild(overlay)
    })
    // Animate text elements
    .to(textElements, {
      autoAlpha: 1,
      y: 0,
      stagger: 0.03
    }, "-=0.3")
    // Animate media elements
    .to(mediaElements, {
      autoAlpha: 1, 
      y: 0,
      duration: 0.8,
      stagger: 0.05,
      onComplete: () => mediaElements.forEach(el => el.classList.add('visible'))
    }, "-=0.5");
  
  // Apply to all current scrollable divs
  document.querySelectorAll('.scrollable, [style*="overflow"]').forEach(hideScrollbars);
  
  // Create a MutationObserver to watch for new elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if the element is scrollable
            const style = window.getComputedStyle(node);
            if (style.overflow === 'auto' || style.overflow === 'scroll' || 
                style.overflowY === 'auto' || style.overflowY === 'scroll') {
              hideScrollbars(node);
            }
            
            // Check children as well
            if (node.querySelectorAll) {
              node.querySelectorAll('.scrollable, [style*="overflow"]').forEach(hideScrollbars);
            }
          }
        });
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
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
      
      // Exit animation
      gsap.timeline({
        onComplete: () => window.location = targetHref
      })
      .to([textElements, mediaElements], {
        autoAlpha: 0,
        y: -10,
        duration: 0.4,
        stagger: 0.005,
        ease: "power2.inOut"
      })
      .to(exitOverlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
    });
  });
}); 