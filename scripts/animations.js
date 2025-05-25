// Initial styles
(() => {
  // Add FontFaceObserver script
  const fontObserverScript = document.createElement('script');
  fontObserverScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.3.0/fontfaceobserver.js';
  document.head.appendChild(fontObserverScript);

  document.head.insertBefore(
    Object.assign(document.createElement('style'), {
      textContent: `
        html.lenis { height: auto; }
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
          opacity: 1; will-change: opacity;
        }
        [data-lenis-prevent] {
          position: relative;
          z-index: 1;
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

  // Wait for FontFaceObserver to load
  const initWithFonts = () => {
    if (typeof FontFaceObserver === 'undefined') {
      return setTimeout(initWithFonts, 50);
    }

    // Get all unique font families used in the document
    const fontFamilies = new Set();
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const fontFamily = window.getComputedStyle(element).fontFamily;
      if (fontFamily) {
        fontFamily.split(',').forEach(font => {
          font = font.trim().replace(/['"]/g, '');
          if (font !== '' && !font.includes('system') && !font.includes('serif') && !font.includes('sans-serif')) {
            fontFamilies.add(font);
          }
        });
      }
    });

    // Create observers for each font
    const fontObservers = Array.from(fontFamilies).map(family => {
      return new FontFaceObserver(family).load(null, 5000); // 5 second timeout
    });

    // Wait for all fonts to load
    Promise.all(fontObservers)
      .then(() => {
        console.log('All fonts loaded successfully');
        initAnimation();
      })
      .catch(err => {
        console.warn('Some fonts failed to load:', err);
        // Initialize anyway after a delay
        setTimeout(initAnimation, 1000);
      });
  };

  initWithFonts();
});

function initAnimation() {
  gsap.registerPlugin(SplitText, ScrollTrigger);
  gsap.config({ force3D: true });
  gsap.defaults({ ease: "power3.out", duration: 1.2 });

  // Cache elements
  const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
  const els = {
    text: gsap.utils.toArray('h1, h2, h3, p, a, .nav'),
    media: gsap.utils.toArray('img, video'),
    mobile: gsap.utils.toArray('.mobile-down'),
    cards: gsap.utils.toArray('.card-project, .fake-nav, .inner-top'),
    hoverLinks: gsap.utils.toArray('.heading.small.link.large-link')
  };

  // Ensure elements exist before proceeding
  if (!els.text.length && !els.media.length && !els.mobile.length && !els.cards.length) {
    console.warn('No target elements found for animations');
    return;
  }

  // Split text setup
  let splitTextInstances = [];
  const createSplitText = () => {
    // Kill old instances
    splitTextInstances.forEach(split => split.revert());
    splitTextInstances = [];
    
    // Create new instances
    const regularElements = document.querySelectorAll(".heading.large:not(.white)");
    const whiteElements = document.querySelectorAll(".heading.large.white");
    
    if (regularElements.length) {
      const regularSplit = SplitText.create(regularElements, { type: "lines" });
      splitTextInstances.push(regularSplit);
      els.splitLinesRegular = regularSplit.lines;
    }
    
    if (whiteElements.length) {
      const whiteSplit = SplitText.create(whiteElements, { type: "lines" });
      splitTextInstances.push(whiteSplit);
      els.splitLinesWhite = whiteSplit.lines;
    }
  };

  // Initial split
  createSplitText();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Ensure fonts are still loaded
      document.fonts.ready.then(createSplitText);
    }, 100);
  });

  // Initial states and intro animation
  if (els.text.length) gsap.set(els.text, { autoAlpha: 0, y: 20 });
  if (els.media.length) gsap.set(els.media, { autoAlpha: 0, y: 20 });
  if (els.cards.length) gsap.set(els.cards, { autoAlpha: 0, y: 20 });
  if (els.mobile.length) {
    gsap.set(els.mobile, { 
      height: "auto", 
      opacity: 0, 
      y: 30,
      visibility: "hidden"
    });
  }

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
    smoothTouch: false
  });

  // Proper Lenis + GSAP ScrollTrigger integration
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Handle scrollbars and sticky elements
  const setupSticky = () => {
    // Find all sticky elements
    document.querySelectorAll('[style*="position: sticky"], [style*="position:sticky"]').forEach(el => {
      // Add data-lenis-prevent attribute
      el.setAttribute('data-lenis-prevent', '');
      
      // Ensure proper stacking context
      if (getComputedStyle(el).zIndex === 'auto') {
        el.style.zIndex = '1';
      }
    });
  };

  // Initial setup
  setupSticky();

  // Watch for new sticky elements
  new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const el = mutation.target;
        const style = getComputedStyle(el);
        if (style.position === 'sticky') {
          el.setAttribute('data-lenis-prevent', '');
        }
      }
      if (mutation.type === 'childList') {
        setupSticky();
      }
    });
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
  });

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

  document.body.classList.add('ready');
  document.documentElement.classList.add('lenis', 'lenis-smooth');
}