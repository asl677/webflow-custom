// Version 1.0.13 - Fix mobile and exit animations timing
// Version 1.0.14 - Fix mobile-down visibility
// Version 1.0.15 - Fix white lines stagger animation
// Version 1.0.16 - Fix mobile-down visibility persistence
// Version 1.0.16.1 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.17 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.18 - Fix mobile-down visibility and white lines stagger animation
// Version 1.0.19 - Simplify text animations
// Version 1.0.20 - Streamline animations code
// Cache-buster: 1684968576
console.log('animations.js version 1.0.20 loaded');

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
      animated: gsap.utils.toArray('h1, h2, h3, p, a, .nav, .heading, img, video, .card-project, .fake-nav, .inner-top'),
      mobile: gsap.utils.toArray('.mobile-down'),
      hoverLinks: gsap.utils.toArray('.heading.small.link.large-link')
    };

    // Set initial states
    gsap.set(elements.animated, { autoAlpha: 0, y: 20 });
    gsap.set(elements.mobile, { opacity: 0, visibility: "hidden", y: 30 });

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

    // Intro animations
    gsap.timeline({ defaults: { ease: "power2.out" }})
      .to(overlay, { opacity: 0, duration: 0.4 })
      .to(elements.animated, { 
        autoAlpha: 1, 
        y: 0,
        stagger: { each: 0.05, ease: "power2.inOut" }
      }, 0)
      .to(elements.mobile, {
        opacity: 1,
        visibility: "visible",
        y: 0,
        duration: 0.8,
        stagger: { each: 0.15, from: "start" }
      }, 0.4);

    // Hover effects
    elements.hoverLinks.forEach(link => {
      const hoverTl = gsap.timeline({ paused: true })
        .to(link, { opacity: 0.7, duration: 0.3, ease: "power2.inOut" });
      
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
      .to([elements.animated, elements.mobile], { 
        autoAlpha: 0, 
        y: -30,
        stagger: { each: 0.1, from: "end" }
      }, 0);
    });

    // Add classes
    document.body.classList.add('ready');
    document.documentElement.classList.add('lenis', 'lenis-smooth');
  } catch (error) {
    console.error('Animation initialization error:', error);
  }
});