// Inject initial styles
(() => {
  document.head.insertBefore(
    Object.assign(document.createElement('style'), {
      textContent: `
        html, body { background: #000 !important; }
        body { opacity: 0 !important; }
        body.ready { opacity: 1 !important; transition: opacity 0.4s ease-out; }
        .page-overlay {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100%;
          background: #000; z-index: 9999;
          pointer-events: none; opacity: 1;
          will-change: opacity;
          transform: translateZ(0);
        }
      `
    }),
    document.head.firstChild
  );
})();

// Initialize animations when GSAP is ready
const initAnimation = () => {
  if (typeof gsap === 'undefined') return requestAnimationFrame(initAnimation);

  // Setup GSAP
  gsap.registerPlugin(SplitText);
  gsap.config({ force3D: true });
  gsap.defaults({ ease: "power3.out", duration: 1.1 });

  // Cache elements and create overlay
  const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
  const els = {
    text: document.querySelectorAll('h1, h2, h3, p, a, .nav'),
    media: document.querySelectorAll('img, video'),
    mobile: document.querySelectorAll('.mobile-down'),
    cards: document.querySelectorAll('.card-project'),
    wrapper: document.querySelector('.page-wrapper'),
    splitLinesWhite: SplitText.create(".heading.large.white", { type: "lines" }).lines,
    splitLinesRegular: SplitText.create(".heading.large:not(.white)", { type: "lines" }).lines,
    splitChars: SplitText.create(".heading.huge", { type: "chars" }).chars
  };

  // Set initial states
  gsap.set([els.text, els.media], { autoAlpha: 0, y: 20 });
  gsap.set(els.cards, { autoAlpha: 0, y: 20 });
  gsap.set(els.mobile, { height: 0, opacity: 0, y: 30, overflow: "hidden" });

  // Create exit animation
  const createExitTimeline = (href) => {
    // Ensure navigation happens after 0.6s no matter what
    gsap.delayedCall(0.6, () => window.location.href = href);

    const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 0.6 } });
    return tl
      .to(els.splitLinesWhite, { y: 0, autoAlpha: 0, stagger: 0.22, duration: 0.6 })
      //.to([els.splitChars, els.splitLinesRegular], { y: -10, autoAlpha: 0, stagger: 0.02, duration: 0.4 }, "<0.1")
      .to([els.mobile, els.media, els.text], { autoAlpha: 0, y: -10, stagger: 0.22 }, "<0.1")
      //.to(els.cards, { y: 0, autoAlpha: 0, stagger: 0.03 }, "<")
      .to(overlay, { opacity: 1, duration: 0.6, ease: "power2.in" }, "<0.3")
      .to(els.wrapper, { opacity: 0, duration: 0.6, ease: "power2.out" }, "<");
  };

  // Start intro animations
  gsap.timeline({ defaults: { ease: "power2.out", duration: 0.7 } })
    .to(overlay, { opacity: 0, duration: 0.6, ease: "power2.inOut" })
    .from(els.splitLinesWhite, { y: 20, autoAlpha: 0, stagger: 0.26, duration: 0.7 }, "<0.1")
    .from(els.splitLinesRegular, { y: 20, autoAlpha: 0, stagger: 0.29 }, "<0.1")
    //.from(els.splitChars, { y: 30, autoAlpha: 0, stagger: 0.05 }, "<")
    .to([els.text, els.media], { autoAlpha: 1, y: 0, stagger: 0.22 }, "<0.1")
    .to(els.cards, { autoAlpha: 1, y: 0, stagger: 0.24 }, "<0.1")
    .to(els.mobile, { height: "auto", opacity: 1, y: 0, duration: 0.8, stagger: 0.23, clearProps: "height,overflow" }, "<0.2");

  // Handle navigation
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

    e.preventDefault();
    createExitTimeline(href);
  }, true);

  // Setup scrollbar handling
  const setupScroll = container => {
    if (!container) return;
    const hasSticky = container.querySelector('[style*="sticky"], .sticky-element');
    if (hasSticky) {
      if (!container.classList.contains('scrollable-wrapper')) {
        const content = document.createElement('div');
        content.className = 'scrollable-content';
        while (container.firstChild) content.appendChild(container.firstChild);
        container.appendChild(content);
        container.classList.add('scrollable-wrapper');
      }
    } else {
      container.style.scrollbarWidth = 'none';
      container.style.msOverflowStyle = 'none';
      container.classList.add('no-scrollbar');
    }
  };

  // Initialize scrollbars
  document.querySelectorAll('[style*="sticky"]').forEach(el => el.classList.add('sticky-element'));
  document.querySelectorAll('[style*="overflow"], .scrollable').forEach(setupScroll);
  
  // Watch for new elements
  new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        const style = getComputedStyle(node);
        if (style.position === 'sticky') node.classList.add('sticky-element');
        if (['auto', 'scroll'].includes(style.overflowY)) setupScroll(node);
        node.querySelectorAll?.('[style*="sticky"]').forEach(el => el.classList.add('sticky-element'));
        node.querySelectorAll?.('[style*="overflow"], .scrollable').forEach(setupScroll);
      });
    });
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

  document.body.classList.add('ready');
};

initAnimation();