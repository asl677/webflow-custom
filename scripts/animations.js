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
        [data-lenis-prevent] {
          transform: translate3d(0, 0, 0);
          will-change: transform;
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

  gsap.registerPlugin(SplitText, ScrollTrigger);
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
  gsap.set(els.mobile, { 
    height: "auto", 
    opacity: 0, 
    y: 30,
    visibility: "hidden"
  });

  // Helper function to get natural height
  const getHeight = (el) => {
    const height = el.offsetHeight;
    const style = window.getComputedStyle(el);
    return height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  };

  // Store original heights and prepare elements
  els.mobile.forEach(el => {
    el._naturalHeight = getHeight(el);
    // Ensure the element is visible for height calculation
    gsap.set(el, { 
      visibility: "visible",
      height: "auto"
    });
  });

  // Setup sticky elements for Lenis
  document.querySelectorAll('[style*="sticky"]').forEach(el => {
    el.setAttribute('data-lenis-prevent', '');
  });

  // Initialize Lenis with proper configuration
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 0.8,
    infinite: false,
    gestureOrientation: "vertical",
    normalizeWheel: true,
    smoothTouch: false,
    // Custom prevent function for sticky elements
    prevent: ({ currentTarget, target }) => {
      // Check if the element or any of its parents has position: sticky
      const isOrHasSticky = (el) => {
        while (el && el !== document.body) {
          if (getComputedStyle(el).position === 'sticky') return true;
          el = el.parentElement;
        }
        return false;
      };
      return isOrHasSticky(target);
    }
  });

  // Proper Lenis + GSAP ScrollTrigger integration
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Create the intro timeline
  gsap.timeline({ defaults: { ease: "power2.out", duration: 1.2 } })
    .to(overlay, { 
      opacity: 0, 
      duration: 0.4, 
      ease: "power2.inOut" 
    })
    .to(els.media, { 
      autoAlpha: 1, 
      y: 0, 
      stagger: { 
        each: 0.1,
        ease: "power2.inOut"
      }
    }, 0)
    .from(els.splitLinesRegular, { 
      y: 30, 
      autoAlpha: 0, 
      stagger: { 
        amount: 0.6,
        from: "start",
        ease: "power2.inOut"
      },
      duration: 1.4
    }, 0.2)
    .from(els.splitLinesWhite, { 
      y: 30, 
      autoAlpha: 0, 
      stagger: { 
        amount: 0.5,
        from: "start",
        ease: "power2.inOut"
      },
      duration: 1.4
    }, "<0.1")
    .to(els.text, { 
      autoAlpha: 1, 
      y: 0, 
      stagger: { 
        each: 0.05,
        ease: "power2.inOut"
      }
    }, "<0.1")
    .to(els.cards, { 
      autoAlpha: 1, 
      y: 0, 
      stagger: { 
        each: 0.1,
        ease: "power2.inOut"
      }
    }, "<0.1")
    .to(els.mobile, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: {
        each: 0.1,
        ease: "power2.inOut"
      }
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

  // Navigation handling with Lenis smooth scrolling
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    const href = link?.getAttribute('href');
    if (!link || !href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

    e.preventDefault();
    lenis.stop();
    
    gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onStart: () => setTimeout(() => window.location = href, 1500)
    })
    .to(overlay, { opacity: 1, duration: 0.8 }, 0)
    .to(els.mobile, { 
      autoAlpha: 0, 
      y: -60, 
      height: 0,
      duration: 1,
      stagger: 0.1
    }, 0)
    .to(els.cards, { 
      autoAlpha: 0, 
      y: -60, 
      duration: 1,
      stagger: 0.1 
    }, "<0.1")
    .to(els.text, { 
      autoAlpha: 0, 
      y: -60, 
      duration: 1,
      stagger: 0.1 
    }, "<0.1")
    .to(els.splitLinesWhite, { 
      y: -60, 
      autoAlpha: 0, 
      duration: 1,
      stagger: 0.1 
    }, "<0.1")
    .to(els.splitLinesRegular, { 
      y: -60, 
      autoAlpha: 0, 
      duration: 1,
      stagger: 0.1 
    }, "<0.1")
    .to(els.media, { 
      autoAlpha: 0, 
      y: -60, 
      duration: 1,
      stagger: 0.1 
    }, "<0.1");
  });

  // Handle scrollbars and sticky elements
  const setupScroll = container => {
    if (!container) return;
    
    // Find all sticky elements within the container
    const stickyElements = container.querySelectorAll('[style*="sticky"]');
    const isStickyContainer = getComputedStyle(container).position === 'sticky';
    
    if (stickyElements.length > 0 || isStickyContainer) {
      // Add data-lenis-prevent to the container if it contains sticky elements
      container.setAttribute('data-lenis-prevent', '');
      
      if (!container.classList.contains('scrollable-wrapper')) {
        const content = document.createElement('div');
        content.className = 'scrollable-content';
        while (container.firstChild) content.appendChild(container.firstChild);
        container.appendChild(content);
        container.classList.add('scrollable-wrapper');
      }
      
      // Add data-lenis-prevent to all sticky elements
      stickyElements.forEach(el => {
        el.setAttribute('data-lenis-prevent', '');
        el.style.transform = 'translate3d(0, 0, 0)';
        el.style.willChange = 'transform';
      });
    }
  };

  // Initialize and watch for new scrollable elements
  document.querySelectorAll('[style*="sticky"]').forEach(el => {
    el.classList.add('sticky-element');
    el.setAttribute('data-lenis-prevent', '');
    el.style.transform = 'translate3d(0, 0, 0)';
    el.style.willChange = 'transform';
  });
  
  document.querySelectorAll('[style*="overflow"], .scrollable').forEach(setupScroll);
  
  new MutationObserver(mutations => 
    mutations.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      const style = getComputedStyle(node);
      if (style.position === 'sticky') {
        node.classList.add('sticky-element');
        node.setAttribute('data-lenis-prevent', '');
      }
      if (['auto', 'scroll'].includes(style.overflowY)) setupScroll(node);
      node.querySelectorAll?.('[style*="sticky"]').forEach(el => {
        el.classList.add('sticky-element');
        el.setAttribute('data-lenis-prevent', '');
      });
      node.querySelectorAll?.('[style*="overflow"], .scrollable').forEach(setupScroll);
    }))
  ).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

  document.body.classList.add('ready');
  document.documentElement.classList.add('lenis', 'lenis-smooth');
});