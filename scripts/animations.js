document.addEventListener('DOMContentLoaded', () => {
  // Add more detailed error checking for GSAP
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded - animations will not work');
    return;
  }
  
  if (!gsap.registerPlugin) {
    console.error('GSAP registerPlugin not available');
    return;
  }

  try {
    gsap.registerPlugin(SplitText);
  } catch (e) {
    console.error('Failed to register SplitText plugin:', e);
    return;
  }
  
  // Define easing variables for consistency
  const easeOut = "power3.out";
  const easeInOut = "power2.inOut";
  const easeIn = "power3.in";
  const easeOutBack = "back.out(1.2)";
  const easeOutStrong = "power4.out";
  
  // Custom natural curves - create more organic, natural motion
  const naturalCurve = gsap.parseEase("0.64, 0, 0.36, 0.6")
  
  gsap.defaults({ ease: easeOut, duration: 0.8 });
  gsap.config({
    force3D: true,
    nullTargetWarn: false // Suppress warnings about null targets
  });

  // Create overlay with specific z-index to ensure it's above other elements
  const overlay = Object.assign(document.createElement('div'), { 
    className: 'page-overlay',
    style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 9999; pointer-events: none;'
  });
  document.body.appendChild(overlay);

  // Cache selectors and check if elements exist
  const textEls = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaEls = document.querySelectorAll('img, video');
  const mobileEls = document.querySelectorAll('.mobile-down');
  const cardEls = document.querySelectorAll('.card-project');

  // Log element counts for debugging
  console.log('Elements found:', {
    text: textEls.length,
    media: mediaEls.length,
    mobile: mobileEls.length,
    cards: cardEls.length
  });

  try {
    // Only create SplitText if elements exist
    const largeHeadings = document.querySelectorAll(".heading.large");
    const hugeHeadings = document.querySelectorAll(".heading.huge");

    if (largeHeadings.length) {
      const splitLines = SplitText.create(".heading.large", { type: "lines" });
      gsap.from(splitLines.lines, { 
        duration: 1, 
        y: 30, 
        autoAlpha: 0, 
        stagger: 0.1,
        ease: naturalCurve
      });
    }

    if (hugeHeadings.length) {
      const splitChars = SplitText.create(".heading.huge", { type: "chars" });
      gsap.from(splitChars.chars, { 
        duration: 1.3, 
        y: 30, 
        autoAlpha: 0, 
        stagger: 0.03,
        ease: easeOutStrong
      });
    }
  } catch (e) {
    console.error('Error in text splitting:', e);
  }

  // Set initial states with visibility
  gsap.set([textEls, mediaEls, cardEls], { 
    autoAlpha: 0, 
    y: 20, 
    visibility: 'hidden',
    immediateRender: true
  });
  
  gsap.set(mobileEls, { 
    height: 0, 
    opacity: 0, 
    y: 30, 
    visibility: 'hidden',
    immediateRender: true
  });

  // Create timeline with callbacks
  const tl = gsap.timeline({
    onStart: () => console.log('Animation timeline started'),
    onComplete: () => console.log('Animation timeline completed')
  });

  // Add animations with proper position parameters
  tl.to(overlay, {
    autoAlpha: 0,
    duration: 0.3,
    ease: easeInOut,
    onComplete: () => {
      overlay.remove();
      document.body.style.willChange = 'auto';
    }
  })
  .to([textEls, mediaEls, cardEls], {
    autoAlpha: 1,
    y: 0,
    visibility: 'visible',
    stagger: 0.04,
    duration: 0.7,
    ease: naturalCurve,
    clearProps: "all"
  }, ">-0.1") // Slight overlap
  .to(mobileEls, {
    height: "auto",
    opacity: 1,
    y: 0,
    visibility: "visible",
    duration: 0.6,
    stagger: 0.03,
    ease: easeOut,
    clearProps: "all"
  }, ">-0.2"); // Slight overlap

  const hideScrollbars = el => {
    if (!el) return;
    const style = getComputedStyle(el);
    const hasSticky = style.position === 'sticky' || el.querySelector('[style*="sticky"], .sticky-element');
    if (hasSticky) return;
    el.style.scrollbarWidth = 'none';
    el.style.msOverflowStyle = 'none';
    el.classList.add('no-scrollbar');
  };

  const setupStickyScroll = container => {
    if (!container) return;
    if (container.querySelector('[style*="sticky"], .sticky-element')) {
      if (!container.classList.contains('scrollable-wrapper')) {
        const content = document.createElement('div');
        content.className = 'scrollable-content';
        while (container.firstChild) content.appendChild(container.firstChild);
        container.appendChild(content);
        container.classList.add('scrollable-wrapper');
      }
    } else hideScrollbars(container);
  };

  document.querySelectorAll('[style*="sticky"]').forEach(el => el.classList.add('sticky-element'));
  document.querySelectorAll('[style*="overflow"], .scrollable').forEach(setupStickyScroll);
  document.querySelectorAll('[style*="overflow: scroll"], [style*="overflow-y: scroll"]').forEach(el => {
    if (!el.querySelector('[style*="sticky"], .sticky-element')) hideScrollbars(el);
  });

  new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        const style = getComputedStyle(node);
        if (style.position === 'sticky') node.classList.add('sticky-element');
        if (['auto', 'scroll'].includes(style.overflowY)) setupStickyScroll(node);
        node.querySelectorAll?.('[style*="sticky"]').forEach(el => el.classList.add('sticky-element'));
        node.querySelectorAll?.('[style*="overflow"], .scrollable').forEach(setupStickyScroll);
      });
    });
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

  // Helper function to check if an element is in the navigation
  const isNavLink = (element) => {
    try {
      return element.closest('.nav, nav, header, .navbar, [class*="navigation"], [class*="menu"]') !== null;
    } catch (e) {
      console.error('Error in isNavLink:', e);
      return false;
    }
  };
 
  // Modify your exit animation to be more performant
  const handleNavigation = (targetUrl) => {
    try {
      if (!targetUrl) {
        console.error('No target URL provided');
        return window.location.reload();
      }

      // Prevent multiple transitions
      if (window._isNavigating) {
        console.log('Navigation already in progress');
        return;
      }
      window._isNavigating = true;
      
      // Create overlay if it was removed
      if (!document.body.contains(overlay)) {
        const newOverlay = Object.assign(document.createElement('div'), { 
          className: 'page-overlay',
          style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 9999; pointer-events: none; opacity: 0;'
        });
        document.body.appendChild(newOverlay);
      }
      
      // Kill any running animations
      gsap.killTweensOf([textEls, mediaEls, cardEls, mobileEls, overlay]);
      
      // Add will-change to improve browser optimization
      document.body.style.willChange = 'opacity, transform';
      
      // Create a single timeline with fewer, more efficient animations
      const exitTl = gsap.timeline({
        onStart: () => console.log('Exit animation started'),
        onComplete: () => {
          console.log('Exit animation completed, navigating to:', targetUrl);
          window._isNavigating = false;
          window.location.href = targetUrl;
        }
      });

      // Batch animations together and use simpler properties
      exitTl
        .set(overlay, { 
          opacity: 0,
          display: 'block',
          immediateRender: true
        })
        .to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: easeInOut
        })
        // Animate all elements together with a single stagger
        .to([textEls, mediaEls, cardEls], {
          autoAlpha: 0,
          y: -10,
          duration: 0.4,
          stagger: 0.02,
          ease: easeIn,
          clearProps: "all"
        }, "<")
        // Separate mobile elements since they have different properties
        .to(mobileEls, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: easeIn,
          clearProps: "all"
        }, "<");

    } catch (e) {
      console.error('Animation error:', e);
      window._isNavigating = false;
      window.location.href = targetUrl;
    }
  };

  // Attach click handlers to all links
  document.querySelectorAll('a[href]').forEach(link => {
    try {
      const href = link.getAttribute('href');
      // Skip external links, anchor links, and javascript: links
      if (!href || 
          href.startsWith('#') || 
          href.startsWith('javascript:') || 
          href.startsWith('tel:') || 
          href.startsWith('mailto:') ||
          (href.includes('://') && !href.includes(window.location.hostname))) {
        return;
      }
      
      link.addEventListener('click', (e) => {
        try {
          e.preventDefault();
          if (!window._isNavigating) {
            handleNavigation(href);
          }
        } catch (error) {
          console.error('Click handling error:', error);
          window.location.href = href;
        }
      });
    } catch (error) {
      console.error('Link setup error:', error);
    }
  });
});