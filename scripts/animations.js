document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return console.error('GSAP not loaded');
  
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
    className: 'page-overlay',
    style: 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #fff; z-index: 9999; pointer-events: none;'
  });
  document.body.appendChild(overlay);

  // Cache all elements we'll animate
  const textEls = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaEls = document.querySelectorAll('img, video');
  const mobileEls = document.querySelectorAll('.mobile-down');
  const cardEls = document.querySelectorAll('.card-project');

  // Split text animations
  const splitLines = SplitText.create(".heading.large", { type: "lines" });
  const splitChars = SplitText.create(".heading.huge", { type: "chars" });

  // Initial states
  gsap.set([textEls, mediaEls, cardEls], { autoAlpha: 0, y: 20, visibility: 'hidden' });
  gsap.set(mobileEls, { height: 0, opacity: 0, y: 30, visibility: 'hidden' });

  // Create the main timeline that we'll reverse later
  const mainTl = gsap.timeline();

  // Intro animations
  mainTl
    .to(overlay, {
      autoAlpha: 0,
      duration: 0.4,
      ease: easeInOut
    })
    .from(splitLines.lines, { 
      duration: 1, 
      y: 30, 
      autoAlpha: 0, 
      stagger: 0.1,
      ease: naturalCurve
    }, "<")
    .from(splitChars.chars, { 
      duration: 1.3, 
      y: 30, 
      autoAlpha: 0, 
      stagger: 0.03,
      ease: easeOutStrong
    }, "<")
    .to(textEls, {
      autoAlpha: 1,
      y: 0,
      visibility: 'visible',
      stagger: 0.06,
      duration: 0.9,
      ease: naturalCurve
    }, "<0.1")
    .to(mediaEls, {
      autoAlpha: 1,
      y: 0,
      visibility: 'visible',
      stagger: 0.08,
      duration: 1,
      ease: easeOutBack
    }, "<0.2")
    .to(cardEls, {
      autoAlpha: 1,
      y: 0,
      visibility: 'visible',
      stagger: 0.09,
      duration: 0.85,
      ease: naturalCurve
    }, "<0.1")
    .to(mobileEls, {
      height: "auto",
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.8,
      stagger: 0.05,
      ease: easeOut
    }, "<0.1");

  // Simple link handling - just reverse the timeline
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || 
        href.startsWith('#') || 
        href.startsWith('javascript:') || 
        href.startsWith('tel:') || 
        href.startsWith('mailto:')) return;

    e.preventDefault();
    
    // Reverse the timeline and then navigate
    mainTl.reverse().eventCallback("onReverseComplete", () => {
      window.location.href = href;
    });
  });

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
});