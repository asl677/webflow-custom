document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return console.error('GSAP not loaded');
  
  // Define easing variables for consistency
  const easeOut = "power3.out";
  const easeInOut = "power2.inOut";
  const easeIn = "power3.in";
  const easeOutBack = "back.out(1.2)";
  const easeOutStrong = "power4.out";
  
  // Custom natural curves - create more organic, natural motion
  // Parameters: 0.64, 0, 0.36, 1 create a nice natural curve with slight acceleration and gentle deceleration
  const naturalCurve = gsap.parseEase("0.64, 0, 0.36, 0.6")
  
  gsap.defaults({ ease: easeOut, duration: 0.8 });
  gsap.registerPlugin(SplitText);

  const overlay = Object.assign(document.createElement('div'), { className: 'page-overlay' });
  document.body.appendChild(overlay);

  const textEls = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaEls = document.querySelectorAll('img, video');
  const mobileEls = document.querySelectorAll('.mobile-down');
  const cardEls = document.querySelectorAll('.card-project');

  const splitLines = SplitText.create(".heading.large", { type: "lines" });
  gsap.from(splitLines.lines, { 
    duration: 1, 
    y: 50, 
    autoAlpha: 0, 
    stagger: 0.1,
    ease: naturalCurve // Apply natural curve
  });

  const splitChars = SplitText.create(".heading.huge", { type: "chars" });
  gsap.from(splitChars.chars, { 
    duration: 1.3, 
    y: 30, 
    autoAlpha: 0, 
    stagger: 0.03,
    ease: easeOutStrong
  });

  gsap.set([textEls, mediaEls, cardEls], { autoAlpha: 0, y: 20, visibility: 'hidden' });
  gsap.set(mobileEls, { height: 0, opacity: 0, y: 30, visibility: 'hidden' });

  const tl = gsap.timeline();
  tl.to(overlay, {
    autoAlpha: 0,
    duration: 0.4,
    ease: easeInOut,
    onComplete: () => overlay.remove()
  }, 0)
  .to(textEls, { 
    autoAlpha: 1, 
    y: 0, 
    visibility: 'visible', 
    stagger: 0.06, 
    duration: 0.9,
    ease: naturalCurve // Apply natural curve
  }, 0.1)
  .to(mediaEls, { 
    autoAlpha: 1, 
    y: 0, 
    visibility: 'visible', 
    stagger: 0.08, 
    duration: 1,
    ease: easeOutBack
  }, 0.3)
  .to(cardEls, { 
    autoAlpha: 1, 
    y: 0, 
    visibility: 'visible', 
    stagger: 0.09, 
    duration: 0.85,
    ease: naturalCurve // Apply natural curve
  }, 0.2)
  .to(mobileEls, { 
    height: "auto", 
    opacity: 1, 
    y: 0, 
    visibility: "visible", 
    duration: 0.8, 
    stagger: 0.05,
    ease: easeOut
  }, 0.1);

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

  // Helper function to check if an element is in a sticky container
  const isInStickyContainer = (element) => {
    try {
      let parent = element.parentElement;
      let depth = 0;
      const maxDepth = 10; // Prevent infinite loops
      
      while (parent && depth < maxDepth) {
        if (parent.classList.contains('sticky-wrap') || 
            parent.classList.contains('sticky-element') || 
            parent.classList.contains('scrollable-wrapper') ||
            getComputedStyle(parent).position === 'sticky') {
          return true;
        }
        parent = parent.parentElement;
        depth++;
      }
      return false;
    } catch (e) {
      console.error('Error in isInStickyContainer:', e);
      return false; // Default to regular animation on error
    }
  };
 
  // Simple page transition system
  const handleNavigation = (targetUrl, isFromStickyContainer = false) => {
    try {
      // Safety check
      if (!targetUrl) {
        console.error('No target URL provided');
        return window.location.reload(); // Fallback to reload
      }
      
      // Create overlay if it was removed
      if (!document.body.contains(overlay)) {
        document.body.appendChild(overlay);
      }
      
      // Create a new timeline for exit animations
      const exitTl = gsap.timeline({
        onComplete: () => {
          // Navigate to the target URL after animations complete
          window.location.href = targetUrl;
        }
      });
      
      // Fast path for sticky container elements - shorter animations
      if (isFromStickyContainer) {
        exitTl.to(overlay, {
          autoAlpha: 1,
          duration: 0.15, // Faster fade in
          ease: "power1.in"
        }, 0);
        
        // Quick minimal animation for visible feedback when clicking sticky links
        exitTl.to([textEls, mediaEls, cardEls], { 
          autoAlpha: 0, 
          y: -8, 
          duration: 0.2,
          ease: "power1.in"
        }, 0);
        
        return;
      }
      
      // Regular path for non-sticky elements - normal animations
      exitTl.to(overlay, {
        autoAlpha: 1,
        duration: 0.3,
        ease: easeInOut
      }, 0);
      
      // Shorter, simplified animations
      exitTl.to([textEls, mediaEls, cardEls], { 
        autoAlpha: 0, 
        y: -20, 
        duration: 0.4,
        ease: easeIn
      }, 0);
      
      exitTl.to(mobileEls, { 
        height: 0, 
        opacity: 0, 
        duration: 0.3, 
        ease: easeIn
      }, 0);
    } catch (e) {
      console.error('Animation error:', e);
      // Fallback to immediate navigation on error
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
          
          // Determine if link is in sticky container
          const isStickyLink = isInStickyContainer(link);
          
          // Use appropriate animation path
          handleNavigation(href, isStickyLink);
        } catch (error) {
          console.error('Click handling error:', error);
          // Fallback to default navigation
          window.location.href = href;
        }
      });
    } catch (error) {
      console.error('Link setup error:', error);
    }
  });
});