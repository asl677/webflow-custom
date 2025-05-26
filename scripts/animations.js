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
// Version 1.0.23 - Streamlined code
// Version 1.0.24 - Remove redundant heading animations
// Version 1.0.25 - Consistent animation directions
// Version 1.0.26 - Consistent top-to-bottom animations
// Cache-buster: 1684968576
console.log('animations.js version 1.0.26 loaded');

document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis) {
    console.error('Missing libraries:', { gsap: !!window.gsap, ScrollTrigger: !!window.ScrollTrigger, Lenis: !!window.Lenis });
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.defaults({ ease: "power2.out", duration: 1 });

    // Initialize elements and overlay
    const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
    const elementGroups = {
      text: gsap.utils.toArray('h1, h2, h3, p, a, .nav'),
      media: gsap.utils.toArray('img, video'),
      cards: gsap.utils.toArray('.card-project, .fake-nav, .inner-top'),
      mobile: gsap.utils.toArray('.mobile-down')
    };

    // Sort elements by viewport visibility
    const { inView, outOfView } = Object.entries(elementGroups).reduce((acc, [key, elements]) => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        (isVisible ? acc.inView : acc.outOfView).push(el);
        if (!isVisible) gsap.set(el, { autoAlpha: 0, y: -30 });
      });
      return acc;
    }, { inView: [], outOfView: [] });

    // Initialize smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 0.8,
      infinite: false
    });

    // GSAP + Lenis integration
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Initial animations
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(overlay, { opacity: 0, duration: 0.4 })
      .from(inView, {
        autoAlpha: 0,
        y: -30,
        stagger: { each: 0.05, ease: "power2.out" }
      }, 0.2);

    // Scroll animations
    outOfView.forEach(element => {
      gsap.fromTo(element, 
        { autoAlpha: 0, y: -30 },
        {
          scrollTrigger: {
            trigger: element,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          },
          autoAlpha: 1,
          y: 0,
          ease: "power2.out"
        }
      );
    });

    // Hover animations
    gsap.utils.toArray('.heading.small.link.large-link').forEach(link => {
      const hoverTl = gsap.timeline({ paused: true })
        .to(link, { opacity: 0.7, duration: 0.3 });
      
      link.addEventListener('mouseenter', () => hoverTl.play());
      link.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Page transitions
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
      .to([...Object.values(elementGroups)].flat(), { 
        autoAlpha: 0, 
        y: 30,
        stagger: { each: 0.02, from: "end" }
      }, 0.2);
    });

    // Add classes
    document.body.classList.add('ready');
    document.documentElement.classList.add('lenis', 'lenis-smooth');
  } catch (error) {
    console.error('Animation initialization error:', error);
  }
});