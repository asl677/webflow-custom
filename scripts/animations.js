// Immediately inject styles before anything else
(() => {
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      background: #000 !important;
    }
    body {
      opacity: 0 !important;
    }
    body.ready {
      opacity: 1 !important;
      transition: opacity 0.2s ease-out;
    }
    .page-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 9999;
      pointer-events: none;
      opacity: 1;
      will-change: opacity;
      transform: translateZ(0);
    }
  `;
  document.head.insertBefore(style, document.head.firstChild);
})();

// Wait for GSAP before doing anything
const initAnimation = () => {
  if (typeof gsap === 'undefined') {
    requestAnimationFrame(initAnimation);
    return;
  }

  // Define easing variables for consistency
  const easeOut = "power3.out";
  const easeInOut = "power2.inOut";
  const easeIn = "power3.in";
  const easeOutBack = "back.out(1.2)";
  const easeOutStrong = "power4.out";
  
  // Custom natural curves
  const naturalCurve = gsap.parseEase("0.64, 0, 0.36, 0.6");
  
  gsap.defaults({ ease: easeOut, duration: 0.8 });
  gsap.registerPlugin(SplitText);
  gsap.config({ force3D: true });

  // Create overlay
  const overlay = Object.assign(document.createElement('div'), { 
    className: 'page-overlay'
  });
  document.body.appendChild(overlay);

  // Cache all elements we'll animate
  const textEls = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaEls = document.querySelectorAll('img, video');
  const mobileEls = document.querySelectorAll('.mobile-down');
  const cardEls = document.querySelectorAll('.card-project');
  const pageWrapper = document.querySelector('.page-wrapper');

  // Split text animations
  const splitLines = SplitText.create(".heading.large", { type: "lines" });
  const splitChars = SplitText.create(".heading.huge", { type: "chars" });

  // Initial states
  gsap.set([textEls, mediaEls], { autoAlpha: 0, y: 20 });
  gsap.set(cardEls, { 
    autoAlpha: 0, 
    y: 20,
    scale: 0.98,
    // filter: 'blur(8px)',
    transformOrigin: "center center"
  });
  gsap.set(mobileEls, { 
    height: 0, 
    opacity: 0, 
    y: 30,
    overflow: "hidden",
    transformOrigin: "top center"
  });

  // Add ready class immediately to prevent flash
  document.body.classList.add('ready');

  // Create the main timeline
  const mainTl = gsap.timeline({
    defaults: {
      ease: naturalCurve,
      duration: 0.6
    }
  });

  // Create exit timeline
  const createExitTimeline = () => {
    const exitTl = gsap.timeline({
      defaults: {
        ease: "power2.inOut",
        duration: 0.3
      }
    });
    
    exitTl
      .to(pageWrapper, {
        opacity: 0,
        duration: 0.2,
        filter: 'blur(4px)',
        ease: "power2.in"
      })
      .to(cardEls, {
        scale: 0.98,
        // filter: 'blur(8px)',
        y: -10,
        autoAlpha: 0,
        stagger: 0.02,
        ease: "power2.in"
      }, "<")
      .to([mobileEls, mediaEls, textEls], {
        autoAlpha: 0,
        y: -10,
        stagger: 0.01
      }, "<0.1")
      .to([splitChars.chars, splitLines.lines], {
        y: -10,
        autoAlpha: 0,
        stagger: 0.01,
        duration: 0.2
      }, "<");
      
    return exitTl;
  };

  // Start animations
  mainTl
    .to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    })
    .from(splitLines.lines, { 
      y: 20, 
      autoAlpha: 0, 
      stagger: 0.07
    }, "<0.1")
    .from(splitChars.chars, { 
      y: 30, 
      autoAlpha: 0, 
      stagger: 0.05,
      ease: easeOutStrong
    }, "<")
    .to([textEls, mediaEls], {
      autoAlpha: 1,
      y: 0,
      stagger: 0.02
    }, "<0.1")
    .to(cardEls, {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: 0.04,
      ease: "power2.out"
    }, "<0.1")
    .to(mobileEls, {
      height: "auto",
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.03,
      clearProps: "height,overflow"
    }, "<0.2");

  // Handle all link clicks
  const handleLinkClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || 
        href.startsWith('#') || 
        href.startsWith('javascript:') || 
        href.startsWith('tel:') || 
        href.startsWith('mailto:')) return;

    e.preventDefault();
    e.stopPropagation();

    // Run exit animations then navigate
    const exitTl = createExitTimeline();
    exitTl.eventCallback("onComplete", () => {
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          window.location.href = href;
        }
      });
    });
  };

  // Attach click handler to document once
  document.addEventListener('click', handleLinkClick, true);

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
};

// Start initialization immediately
initAnimation();