document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return console.error('GSAP not loaded');
  
  // Define easing variables for consistency
  const easeOut = "power3.out";
  const easeInOut = "power2.inOut";
  const easeIn = "power3.in";
  const easeOutBack = "back.out(1.2)";
  const easeOutStrong = "power4.out";
  
  gsap.defaults({ ease: easeOut, duration: 1.2 });
  gsap.registerPlugin(SplitText);

  const overlay = Object.assign(document.createElement('div'), { className: 'page-overlay' });
  document.body.appendChild(overlay);

  const textEls = document.querySelectorAll('h1, h2, h3, p, a, .nav');
  const mediaEls = document.querySelectorAll('img, video');
  const mobileEls = document.querySelectorAll('.mobile-down');
  const cardEls = document.querySelectorAll('.card-project');

  const splitLines = SplitText.create(".heading.large.bold.skinny", { type: "lines" });
  gsap.from(splitLines.lines, { 
    duration: 1.4, 
    y: 50, 
    autoAlpha: 0, 
    stagger: 0.18,
    ease: easeOutBack
  });

  const splitChars = SplitText.create(".heading.huge", { type: "chars" });
  gsap.from(splitChars.chars, { 
    duration: 1.3, 
    y: 35, 
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
    ease: easeOut
  }, 0.1)
  .to(mediaEls, { 
    autoAlpha: 1, 
    y: 0, 
    visibility: 'visible', 
    stagger: 0.08, 
    duration: 1.1,
    ease: easeOutBack
  }, 0.3)
  .to(cardEls, { 
    autoAlpha: 1, 
    y: 0, 
    visibility: 'visible', 
    stagger: 0.09, 
    duration: 0.85,
    ease: easeOutStrong
  }, 0.2)
  .to(mobileEls, { 
    height: "auto", 
    opacity: 1, 
    y: 0, 
    visibility: "visible", 
    duration: 0.8, 
    stagger: 0.05,
    ease: easeOut
  }, 0.15);

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
      const exitOverlay = Object.assign(document.createElement('div'), {
        className: 'exit-overlay',
        style: "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #000; z-index: 9999; opacity: 0; pointer-events: none;"
      });
      document.body.appendChild(exitOverlay);

      gsap.timeline({ onComplete: () => location = target })
        .to(mobileEls, { 
          height: 0, 
          opacity: 0,
          ease: easeInOut,
          duration: 0.6
        }, 0)
        .to(textEls, { 
          autoAlpha: 0, 
          y: -25,
          ease: easeIn,
          stagger: 0.03,
          duration: 0.5
        }, 0)
        .to(mediaEls, { 
          autoAlpha: 0, 
          y: -30,
          ease: easeIn,
          stagger: 0.04,
          duration: 0.6
        }, 0.1)
        .to('.card-project', { 
          autoAlpha: 0, 
          y: -15,
          ease: easeIn,
          stagger: 0.05,
          duration: 0.45
        }, 0.1)
        .to(exitOverlay, { 
          opacity: 1, 
          duration: 0.5,
          ease: easeInOut
        }, 0.2);
    });
  });
});