document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return console.error('GSAP not loaded');
  gsap.defaults({ ease: "power2.out", duration: 1 });
  gsap.registerPlugin(SplitText);

  const overlay = Object.assign(document.createElement('div'), { className: 'page-overlay' });
  document.body.appendChild(overlay);

  const textEls = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaEls = document.querySelectorAll('img, video');
  const mobileEls = document.querySelectorAll('.mobile-down');
  const cardEls = document.querySelectorAll('.card-project');

  const splitLines = SplitText.create(".heading.large.bold.skinny", { type: "lines" });
  gsap.from(splitLines.lines, { duration: 1.5, y: 50, autoAlpha: 0, stagger: 0.5 });

  const splitChars = SplitText.create(".heading.huge", { type: "chars" });
  gsap.from(splitChars.chars, { duration: 1.5, y: 40, autoAlpha: 0, stagger: 0.4 });

  gsap.set([textEls, mediaEls, cardEls], { autoAlpha: 0, y: 20, visibility: 'hidden' });
  gsap.set(mobileEls, { height: 0, opacity: 0, y: 30, visibility: 'hidden' });

  const tl = gsap.timeline();
  tl.to(overlay, {
    autoAlpha: 0,
    duration: 0.3,
    onComplete: () => overlay.remove()
  }, 0)
  .to(textEls, { autoAlpha: 1, y: 0, visibility: 'visible', stagger: 0.1, duration: 0.8 }, 0)
  .to(mediaEls, { autoAlpha: 1, y: 0, visibility: 'visible', stagger: 0.08, delay: 0.2, duration: 0.6 }, 0)
  .to(cardEls, { autoAlpha: 1, y: 0, visibility: 'visible', stagger: 0.12, duration: 0.8 }, 0.2)
  .to(mobileEls, { height: "auto", opacity: 1, y: 0, visibility: "visible", duration: 0.8, stagger: 0.08 }, 0);

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

  document.querySelectorAll('a[href]').forEach(link => {
    if (link.hostname !== location.hostname || link.target) return;
    link.addEventListener('click', e => {
      if (link.pathname === location.pathname || link.getAttribute('href')?.startsWith('#')) return;
      e.preventDefault();
      const target = link.href;
      const exitOverlay = Object.assign(document.createElement('div'), { className: 'page-exit-overlay' });
      Object.assign(exitOverlay.style, {
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "#000", zIndex: "9999", opacity: "0", pointerEvents: "none"
      });
      document.body.appendChild(exitOverlay);

      gsap.timeline({ onComplete: () => location = target })
        .to(mobileEls, { height: 0, opacity: 0 }, 0)
        .to(textEls, { autoAlpha: 0, y: -20 }, 0)
        .to(mediaEls, { autoAlpha: 0, y: -30 }, 0)
        .to('.card-project', { autoAlpha: 0, y: 0 }, 0)
        .to(exitOverlay, { opacity: 1, duration: 0.5 }, 0);
    });
  });
});