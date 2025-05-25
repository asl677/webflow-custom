// Version 1.0.13 - Fix mobile and exit animations timing
// Version 1.0.14 - Fix mobile-down visibility
// Version 1.0.15 - Fix white lines stagger animation
// Version 1.0.16 - Fix mobile-down visibility persistence
document.addEventListener('DOMContentLoaded', () => {
  // Check if required libraries are loaded
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText || !window.Lenis) {
    console.error('Required libraries not loaded. Please check script loading order:',
      '\nGSAP:', !!window.gsap,
      '\nScrollTrigger:', !!window.ScrollTrigger,
      '\nSplitText:', !!window.SplitText,
      '\nLenis:', !!window.Lenis
    );
    return;
  }

  try {
    initAnimation();
  } catch (error) {
    console.error('Error initializing animations:', error);
  }
});

function initAnimation() {
  gsap.registerPlugin(ScrollTrigger);
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

  // Initial states
  if (els.text.length) gsap.set(els.text, { autoAlpha: 0, y: -20 });
  if (els.media.length) gsap.set(els.media, { autoAlpha: 0, y: 20 });
  if (els.cards.length) gsap.set(els.cards, { autoAlpha: 0, y: 20 });
  if (els.mobile.length) {
    gsap.set(els.mobile, { 
      opacity: 0,
      visibility: "hidden",
      y: 30 
    });
  }
  if (els.splitLinesRegular?.length) gsap.set(els.splitLinesRegular, { autoAlpha: 0, y: -20 });
  if (els.splitLinesWhite?.length) gsap.set(els.splitLinesWhite, { autoAlpha: 0, y: 30 });

  // Initialize Lenis
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

  // Lenis + GSAP integration
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
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
      y: -20, 
      opacity: 0,
      stagger: { 
        amount: 0.8,
        from: "start",
        ease: "power2.inOut"
      },
      duration: 1.4,
      ease: "power3.out"
    }, 0.2)
    .from(els.splitLinesWhite, { 
      y: 30,
      opacity: 0,
      stagger: { 
        amount: 0.8,
        from: "end",
        ease: "power2.inOut"
      },
      duration: 1.4,
      ease: "power3.out"
    }, "<0.2")
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
      visibility: "visible",
      y: 0,
      duration: 0.8,
      immediateRender: true,
      stagger: {
        each: 0.15,
        from: "start",
        ease: "power2.inOut"
      },
      onComplete: function() {
        gsap.set(els.mobile, { clearProps: "visibility" }); // Ensure visibility remains after animation
      }
    }, 0.4);

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

  // Navigation handling
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    const href = link?.getAttribute('href');
    if (!link || !href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

    e.preventDefault();
    lenis.stop();
    
    const exitTl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.8 },
      onStart: () => setTimeout(() => window.location = href, 2000)
    });

    // First batch of animations
    exitTl.to(overlay, { opacity: 1 }, 0)
         .to(els.mobile, { 
           opacity: 0,
           visibility: "hidden",
           y: -30,
           stagger: {
             each: 0.1,
             from: "end",
             ease: "power2.inOut"
           }
         }, 0);

    // Second batch - text and cards
    exitTl.to([els.cards, els.text], { 
      autoAlpha: 0, 
      y: -30,
      stagger: {
        each: 0.1,
        from: "end",
        ease: "power2.inOut"
      }
    }, 0.2);

    // Third batch - split lines
    exitTl.to([els.splitLinesWhite, els.splitLinesRegular], { 
      autoAlpha: 0, 
      y: -30,
      stagger: {
        each: 0.1,
        from: "end",
        ease: "power2.inOut"
      }
    }, 0.4);

    // Final batch - media
    exitTl.to(els.media, { 
      autoAlpha: 0, 
      y: -30,
      stagger: {
        each: 0.1,
        from: "end",
        ease: "power2.inOut"
      }
    }, 0.6);
  });

  document.body.classList.add('ready');
  document.documentElement.classList.add('lenis', 'lenis-smooth');
}