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
    y: 30, 
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
    duration: 0.3,
    ease: easeInOut,
    onComplete: () => {
      overlay.remove();
      document.body.style.willChange = 'auto'; // Clean up will-change
    }
  }, 0)
  .to([textEls, mediaEls, cardEls], {
    autoAlpha: 1,
    y: 0,
    visibility: 'visible',
    stagger: 0.04,
    duration: 0.7,
    ease: naturalCurve,
    clearProps: "all"
  }, 0.1)
  .to(mobileEls, {
    height: "auto",
    opacity: 1,
    y: 0,
    visibility: "visible",
    duration: 0.6,
    stagger: 0.03,
    ease: easeOut,
    clearProps: "all"
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

  // Helper function to check if an element is in the navigation
  const isNavLink = (element) => {
    try {
      return element.closest('.nav, nav, header, .navbar, [class*="navigation"], [class*="menu"]') !== null;
    } catch (e) {
      console.error('Error in isNavLink:', e);
      return false;
    }
  };
 
  // Add this near the top of your file after gsap.defaults
  gsap.config({
    force3D: true // Forces 3D transforms for better performance
  });

  // Modify your exit animation to be more performant
  const handleNavigation = (targetUrl) => {
    try {
      if (!targetUrl) {
        console.error('No target URL provided');
        return window.location.reload();
      }
      
      if (!document.body.contains(overlay)) {
        document.body.appendChild(overlay);
      }
      
      // Add will-change to improve browser optimization
      document.body.style.willChange = 'opacity, transform';
      
      // Create a single timeline with fewer, more efficient animations
      const exitTl = gsap.timeline({
        onComplete: () => {
          window.location.href = targetUrl;
        }
      });

      // Batch animations together and use simpler properties
      exitTl
        .to(overlay, {
          autoAlpha: 1,
          duration: 0.3,
          ease: easeInOut
        }, 0)
        // Animate all elements together with a single stagger
        .to([textEls, mediaEls, cardEls], {
          autoAlpha: 0,
          y: -10,
          duration: 0.4,
          stagger: 0.02,
          ease: easeIn,
          clearProps: "all" // Clean up properties after animation
        }, 0)
        // Separate mobile elements since they have different properties
        .to(mobileEls, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: easeIn,
          clearProps: "all"
        }, 0);

    } catch (e) {
      console.error('Animation error:', e);
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
          // Use consistent animation for all links
          handleNavigation(href);
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