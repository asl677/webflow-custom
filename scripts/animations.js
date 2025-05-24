// Initial styles
(() => {
  document.head.insertBefore(
    Object.assign(document.createElement('style'), {
      textContent: `
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lenis.lenis-smooth iframe { pointer-events: none; }
        html, body { background: #000 !important; }
        body { opacity: 0 !important; }
        body.ready { opacity: 1 !important; transition: opacity 0.4s ease-out; }
        .page-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: #000; z-index: 9999; pointer-events: none;
          opacity: 1; will-change: opacity; transform: translateZ(0);
        }
      `
    }),
    document.head.firstChild
  );
})();

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
    return setTimeout(initAnimation, 50);
  }

  gsap.registerPlugin(SplitText);
  gsap.config({ force3D: true });
  gsap.defaults({ ease: "power3.out", duration: 1.2 });

  // Cache elements
  const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
  const els = {
    text: document.querySelectorAll('h1, h2, h3, p, a, .nav'),
    media: document.querySelectorAll('img, video'),
    mobile: document.querySelectorAll('.mobile-down'),
    cards: document.querySelectorAll('.card-project, .fake-nav, .inner-top'),
    hoverLinks: document.querySelectorAll('.heading.small.link.large-link')
  };

  // Split text setup
  let splitTextInstances = [];
  const createSplitText = () => {
    // Kill old instances
    splitTextInstances.forEach(split => split.revert());
    splitTextInstances = [];
    
    // Create new instances
    const regularSplit = SplitText.create(".heading.large:not(.white)", { type: "lines" });
    const whiteSplit = SplitText.create(".heading.large.white", { type: "lines" });
    splitTextInstances.push(regularSplit, whiteSplit);
    
    // Update element references
    els.splitLinesRegular = regularSplit.lines;
    els.splitLinesWhite = whiteSplit.lines;
  };

  // Initial split
  createSplitText();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createSplitText, 100);
  });

  // Initial states and intro animation
  gsap.set([els.text, els.media, els.cards], { autoAlpha: 0, y: 20 });
  gsap.set(els.mobile, { height: 0, opacity: 0, y: 30, overflow: "hidden" });

  gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
    .to(overlay, { opacity: 0, duration: 0.4, ease: "power2.inOut" })
    .to(els.media, { autoAlpha: 1, y: 0, stagger: 0.05 }, 0)
    .from(els.splitLinesRegular, { y: 20, autoAlpha: 0, stagger: 0.3 }, 0.2)
    .from(els.splitLinesWhite, { y: 20, autoAlpha: 0, stagger: 0.2 }, "<0.1")
    .to(els.text, { autoAlpha: 1, y: 0, stagger: 0.05 }, "<0.1")
    .to(els.cards, { autoAlpha: 1, y: 0, stagger: 0.1 }, "<0.1")
    .to(els.mobile, { 
      autoAlpha: 1, 
      y: 0, 
      height: "auto",
      stagger: 0.1,
      clearProps: "height,overflow"
    }, "<0.1");

  // Hover effects
  els.hoverLinks.forEach(link => {
    const chars = SplitText.create(link, { type: "chars" }).chars;
    const tl = gsap.timeline({ paused: true })
      .to(chars, {
        yPercent: -20, opacity: 0, duration: 0.5,
        stagger: { amount: 0.1, from: "start" },
        ease: "power2.in"
      })
      .set(chars, { yPercent: 20 })
      .to(chars, {
        yPercent: 0, opacity: 1, duration: 0.5,
        stagger: { amount: 0.1, from: "start" },
        ease: "power2.out"
      });
    
    link.addEventListener('mouseenter', () => tl.restart());
    link.addEventListener('mouseleave', () => tl.reverse());
  });

  // Initialize Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 0.8
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('resize', () => lenis.resize());

  // Navigation handling
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    const href = link?.getAttribute('href');
    if (!link || !href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

    e.preventDefault();
    lenis.stop();
    
    gsap.timeline({
      defaults: { ease: "power2.in" },
      onStart: () => setTimeout(() => window.location = href, 800)
    })
    .to(overlay, { opacity: 1, duration: 0.4 }, 0)
    .to([els.media, els.splitLinesWhite, els.splitLinesRegular, els.text, els.cards, els.mobile], {
      y: -50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.04,
      ease: "power3.in"
    }, 0);
  });

  // Handle scrollbars
  const setupScroll = container => {
    if (!container) return;
    const hasSticky = container.querySelector('[style*="sticky"], .sticky-element');
    if (hasSticky && !container.classList.contains('scrollable-wrapper')) {
      const content = document.createElement('div');
      content.className = 'scrollable-content';
      while (container.firstChild) content.appendChild(container.firstChild);
      container.appendChild(content);
      container.classList.add('scrollable-wrapper');
    } else {
      Object.assign(container.style, { scrollbarWidth: 'none', msOverflowStyle: 'none' });
      container.classList.add('no-scrollbar');
    }
  };

  // Initialize and watch for new scrollable elements
  document.querySelectorAll('[style*="sticky"]').forEach(el => el.classList.add('sticky-element'));
  document.querySelectorAll('[style*="overflow"], .scrollable').forEach(setupScroll);
  
  new MutationObserver(mutations => 
    mutations.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      const style = getComputedStyle(node);
      if (style.position === 'sticky') node.classList.add('sticky-element');
      if (['auto', 'scroll'].includes(style.overflowY)) setupScroll(node);
      node.querySelectorAll?.('[style*="sticky"]').forEach(el => el.classList.add('sticky-element'));
      node.querySelectorAll?.('[style*="overflow"], .scrollable').forEach(setupScroll);
    }))
  ).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

  document.body.classList.add('ready');
  document.documentElement.classList.add('lenis', 'lenis-smooth');
});