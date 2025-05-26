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
// Version 1.0.27 - Fix text animation consistency
// Version 1.0.28 - Fix animation consistency and version compatibility
// Version 1.0.29 - Fix dynamic text animations
// Version 1.0.30 - Fix font loading issues
// Version 1.0.31 - Add SplitText animations
console.log('animations.js version 1.0.31 loaded');

document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis || !window.SplitText) {
    console.error('Missing libraries:', { 
      gsap: !!window.gsap, 
      ScrollTrigger: !!window.ScrollTrigger, 
      Lenis: !!window.Lenis,
      SplitText: !!window.SplitText 
    });
    return;
  }

  // Wait for fonts to load before initializing animations
  document.fonts.ready.then(() => {
    try {
      gsap.registerPlugin(ScrollTrigger, SplitText);
      gsap.config({ force3D: true });

      // Initialize elements and overlay
      const overlay = document.body.appendChild(Object.assign(document.createElement('div'), { className: 'page-overlay' }));
      
      // Define animation defaults
      const animationDefaults = {
        y: -30,
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out"
      };

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

      // Function to handle text splitting and animation
      function setupSplitTextAnimations() {
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach(heading => {
          if (heading.hasAttribute('data-split-animated')) return;

          const split = new SplitText(heading, {
            type: "chars,words,lines",
            linesClass: "split-line",
            wordsClass: "split-word",
            charsClass: "split-char"
          });

          // Set initial state
          gsap.set(split.chars, {
            y: 30,
            autoAlpha: 0
          });

          // Create animation
          gsap.to(split.chars, {
            scrollTrigger: {
              trigger: heading,
              start: "top bottom-=100",
              toggleActions: "play none none reverse"
            },
            duration: 1,
            y: 0,
            autoAlpha: 1,
            stagger: 0.02,
            ease: "power2.out",
            onComplete: () => heading.setAttribute('data-split-animated', 'true')
          });
        });
      }

      // Function to handle element animations
      function setupElementAnimations() {
        const elements = {
          text: document.querySelectorAll('p, a, .nav'),
          media: document.querySelectorAll('img, video'),
          cards: document.querySelectorAll('.card-project, .fake-nav, .inner-top'),
          mobile: document.querySelectorAll('.mobile-down')
        };

        // Set initial state for all elements that haven't been animated yet
        Object.values(elements).forEach(group => {
          group.forEach(el => {
            if (!el.hasAttribute('data-animated')) {
              gsap.set(el, {
                y: animationDefaults.y,
                autoAlpha: animationDefaults.autoAlpha
              });
              el.setAttribute('data-animated', 'true');
            }
          });
        });

        // Animate elements
        Object.values(elements).forEach(group => {
          group.forEach(el => {
            if (el.hasAttribute('data-animated-complete')) return;

            const rect = el.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInView) {
              gsap.to(el, {
                y: 0,
                autoAlpha: 1,
                duration: animationDefaults.duration,
                ease: animationDefaults.ease,
                delay: 0.2,
                onComplete: () => el.setAttribute('data-animated-complete', 'true')
              });
            } else {
              gsap.to(el, {
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom-=100",
                  toggleActions: "play none none reverse",
                  onEnter: () => el.setAttribute('data-animated-complete', 'true')
                },
                y: 0,
                autoAlpha: 1,
                duration: animationDefaults.duration,
                ease: animationDefaults.ease
              });
            }
          });
        });
      }

      // Initial setup
      setupSplitTextAnimations();
      setupElementAnimations();

      // Watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0) {
            shouldUpdate = true;
          }
        });
        if (shouldUpdate) {
          setupSplitTextAnimations();
          setupElementAnimations();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Hover animations
      document.querySelectorAll('.heading.small.link.large-link').forEach(link => {
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
        .to(document.querySelectorAll('[data-animated]'), { 
          y: animationDefaults.y,
          autoAlpha: 0,
          stagger: { each: 0.02, from: "end" }
        }, 0.2);
      });

      // Add classes
      document.body.classList.add('ready');
      document.documentElement.classList.add('lenis', 'lenis-smooth');
    } catch (error) {
      console.error('Animation initialization error:', error);
    }
  }).catch(error => {
    console.error('Font loading error:', error);
  });
});