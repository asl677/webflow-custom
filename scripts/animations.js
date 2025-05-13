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
  gsap.defaults({ ease: "power3.out", duration: 0.8 });

  // Cache elements and create overlay
  const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
  const els = {
    text: document.querySelectorAll('h1, h2, h3, p, a, .nav'),
    media: document.querySelectorAll('img, video'),
    mobile: document.querySelectorAll('.mobile-down'),
    cards: document.querySelectorAll('.card-project'),
    wrapper: document.querySelector('.page-wrapper'),
    splitLines: SplitText.create(".heading.large", { type: "lines" }).lines,
    splitChars: SplitText.create(".heading.huge", { type: "chars" }).chars
  };

  // Set initial states
  gsap.set([els.text, els.media], { autoAlpha: 0, y: 20 });
  gsap.set(els.cards, { autoAlpha: 0, y: 20, scale: 0.98, transformOrigin: "center center" });
  gsap.set(els.mobile, { height: 0, opacity: 0, y: 30, overflow: "hidden" });

  // Create exit animation
  const createExitTimeline = () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 0.3 } });
    return tl
      .to(overlay, { opacity: 1, duration: 0.2, ease: "power2.in" })
      .to(els.wrapper, { opacity: 0, duration: 0.2, filter: 'blur(4px)', ease: "power2.out" }, "<0.1")
      .to(els.cards, { scale: 0.98, y: -10, autoAlpha: 0, stagger: 0.01 }, "<")
      .to([els.mobile, els.media, els.text], { autoAlpha: 0, y: -10, stagger: 0.01 }, "<0.1")
      .to([els.splitChars, els.splitLines], { y: -10, autoAlpha: 0, stagger: 0.01, duration: 0.3 }, "<")
      .eventCallback("onComplete", () => window.location.href = href);
  };

  // Start intro animations
  gsap.timeline({ defaults: { ease: "power2.out", duration: 0.4 } })
    .to(overlay, { opacity: 0, duration: 0.3, ease: "power2.inOut" })
    .from(els.splitLines, { y: 20, autoAlpha: 0, stagger: 0.07 }, "<0.1")
    .from(els.splitChars, { y: 30, autoAlpha: 0, stagger: 0.05 }, "<")
    .to([els.text, els.media], { autoAlpha: 1, y: 0, stagger: 0.02 }, "<0.1")
    .to(els.cards, { autoAlpha: 1, scale: 1, y: 0, stagger: 0.04 }, "<0.1")
    .to(els.mobile, { height: "auto", opacity: 1, y: 0, duration: 0.5, stagger: 0.03, clearProps: "height,overflow" }, "<0.2");

  // Handle navigation
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

    e.preventDefault();
    createExitTimeline();
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