// Version 1.0.13 - Fix mobile and exit animations timing
// Version 1.0.14 - Fix mobile-down visibility
// Version 1.0.15 - Fix white lines stagger animation
// Version 1.0.16 - Fix mobile-down visibility persistence
// Version 1.0.16.1 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.17 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.18 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.19 - Simplify text animations
// Version 1.0.20 - Streamline animations code
// Version 1.0.21 - Fix smooth text animations
// Version 1.0.22 - Fix viewport animations
// Cache-buster: 1684968576
console.log('animations.js version 1.0.22 loaded');

document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
    console.error('Missing libraries:', { gsap: !!window.gsap, ScrollTrigger: !!window.ScrollTrigger, Lenis: !!window.Lenis });
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.defaults({ ease: "power3.out", duration: 1.2 });

    // Initialize elements and animations
    const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
    const elements = {
      text: gsap.utils.toArray('h1, h2, h3, p, a, .nav'),
      headings: gsap.utils.toArray('.heading'),
      media: gsap.utils.toArray('img, video'),
      cards: gsap.utils.toArray('.card-project, .fake-nav, .inner-top'),
      mobile: gsap.utils.toArray('.mobile-down'),
      hoverLinks: gsap.utils.toArray('.heading.small.link.large-link')
    };

    // Helper function to check if element is in viewport
    const isInViewport = element => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    // Set initial states and create arrays for in-view and out-of-view elements
    const inViewElements = {
      text: [],
      headings: [],
      media: [],
      cards: [],
      mobile: []
    };
    const outOfViewElements = {
      text: [],
      headings: [],
      media: [],
      cards: [],
      mobile: []
    };

    // Sort elements based on viewport visibility
    Object.keys(elements).forEach(key => {
      if (key !== 'hoverLinks') {
        elements[key].forEach(element => {
          if (isInViewport(element)) {
            inViewElements[key].push(element);
          } else {
            outOfViewElements[key].push(element);
            gsap.set(element, { autoAlpha: 0, y: 30 });
          }
        });
      }
    });

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

    // Initial animation timeline
    const mainTl = gsap.timeline({ 
      defaults: { 
        ease: "power2.out",
        duration: 1.2
      }
    });

    // Fade out overlay
    mainTl.to(overlay, { 
      opacity: 0, 
      duration: 0.4,
      ease: "power2.inOut" 
    });

    // Animate in-view elements with subtle fade
    if (inViewElements.media.length) {
      mainTl.from(inViewElements.media, {
        autoAlpha: 0,
        scale: 1,
        y: 20,
        duration: 1,
        ease: "power2.out"
      }, 0);
    }

    if (inViewElements.text.length) {
      mainTl.from(inViewElements.text, {
        autoAlpha: 0,
        y: -20,
        duration: 1,
        stagger: { each: 0.05, ease: "power2.out" }
      }, 0.2);
    }

    if (inViewElements.headings.length) {
      mainTl.from(inViewElements.headings, {
        autoAlpha: 0,
        y: -20,
        duration: 1,
        stagger: { each: 0.06, ease: "power2.out" }
      }, 0.3);
    }

    if (inViewElements.cards.length) {
      mainTl.from(inViewElements.cards, {
        autoAlpha: 0,
        y: 20,
        duration: 1,
        stagger: { each: 0.1, ease: "power2.out" }
      }, 0.4);
    }

    // Set up scroll triggers for out-of-view elements
    Object.keys(outOfViewElements).forEach(key => {
      if (outOfViewElements[key].length) {
        outOfViewElements[key].forEach(element => {
          gsap.to(element, {
            scrollTrigger: {
              trigger: element,
              start: "top bottom-=100",
              toggleActions: "play none none reverse"
            },
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
          });
        });
      }
    });

    // Hover effects
    elements.hoverLinks.forEach(link => {
      const hoverTl = gsap.timeline({ paused: true })
        .to(link, { 
          opacity: 0.7, 
          duration: 0.3, 
          ease: "power2.inOut" 
        });
      
      link.addEventListener('mouseenter', () => hoverTl.play());
      link.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Navigation
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      const href = link?.getAttribute('href');
      if (!link || !href || /^(?:javascript:|#|tel:|mailto:)/.test(href)) return;

      e.preventDefault();
      lenis.stop();
      
      gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.8 },
        onStart: () => setTimeout(() => window.location = href, 2000)
      })
      .to(overlay, { opacity: 1 }, 0)
      .to([...Object.values(elements)].flat(), { 
        autoAlpha: 0, 
        y: -20,
        stagger: {
          each: 0.02,
          from: "end",
          ease: "power2.inOut"
        }
      }, 0.2);
    });

    // Add classes
    document.body.classList.add('ready');
    document.documentElement.classList.add('lenis', 'lenis-smooth');
  } catch (error) {
    console.error('Animation initialization error:', error);
  }
});