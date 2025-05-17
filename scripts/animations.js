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

// Initialize animations immediately
document.addEventListener('DOMContentLoaded', () => {
  // Quick check for GSAP
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
    setTimeout(initAnimation, 50);
    return;
  }

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
    cards: document.querySelectorAll('.card-project, .fake-nav, .inner-top'),
    wrapper: document.querySelector('.page-wrapper'),
    splitLinesWhite: SplitText.create(".heading.large.white", { type: "lines" }).lines,
    splitLinesRegular: SplitText.create(".heading.large:not(.white)", { type: "lines" }).lines,
    splitChars: SplitText.create(".heading.huge", { type: "chars" }).chars
  };

  // Set initial states
  gsap.set([els.text, els.media], { autoAlpha: 0, y: 20 });
  gsap.set(els.cards, { autoAlpha: 0, y: 20 });
  gsap.set(els.mobile, { height: 0, opacity: 0, y: 30, overflow: "hidden" });

  // Start intro animations immediately
  gsap.timeline({ defaults: { ease: "power2.out", duration: 0.4 } })
    .to(overlay, { opacity: 0, duration: 0.4, ease: "power2.inOut" })
    .from(els.splitLinesRegular, { y: 20, autoAlpha: 0, stagger: 0.15 })
    .from(els.splitLinesWhite, { y: 20, autoAlpha: 0, stagger: 0.15 }, "<0.1")
    .to(els.text, { autoAlpha: 1, y: 0, stagger: 0.05 }, "<")
    .to(els.media, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.5 }, "<0.1")
    .to(els.cards, { autoAlpha: 1, y: 0, stagger: 0.15 }, "<0.1")
    .to(els.mobile, { height: "auto", opacity: 1, y: 0, duration: 0.6, stagger: 0.15, clearProps: "height,overflow" }, "<0.1");

  // Handle navigation
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

    e.preventDefault();
    
    // Smooth exit animation with quick navigation
    gsap.timeline({
      defaults: { ease: "power1.inOut", duration: 0.4 },
      onStart: () => {
        // Schedule the navigation to happen very soon
        setTimeout(() => window.location = href, 600);
      }
    })
    .to(overlay, { 
      opacity: 1,
      duration: 0.4,
      ease: "power1.in"
    }, 0)
    .to([els.splitLinesWhite, els.splitLinesRegular, els.text, els.media, els.cards, els.mobile].filter(Boolean), { 
      autoAlpha: 0,
      y: -10,
      duration: 0.4,
      stagger: 0.02,
      ease: "power1.inOut"
    }, 0);
  });

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
});

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  smooth: true,
  smoothTouch: false // disable on mobile if desired
});

// Animation frame loop
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);