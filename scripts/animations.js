// Version 1.5.17 - Simplified
console.log('animations.js v1.5.17 loading...');

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, lenis = null;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  function initHover() {
    document.querySelectorAll('.heading.small.link.large-link').forEach(link => {
      if (link.dataset.hoverInit) return;
      
      const text = link.textContent.trim();
      const words = text.split(' ');
      const wrappedText = words.map(word => {
        const wrappedChars = word.split('').map(char => 
          `<span class="char" data-char="${char}" style="display: inline-block;">${char}</span>`
        ).join('');
        return `<span class="word">${wrappedChars}</span>`;
      }).join('<span class="space">&nbsp;</span>');
      
      link.innerHTML = wrappedText;
      
      const charEls = link.querySelectorAll('.char');
      let scrambling = false, interval;

      function scramble(duration = 1200) {
        if (scrambling) {
          clearInterval(interval);
        }
        scrambling = true;
        const start = Date.now();
        const originals = Array.from(charEls).map(el => el.dataset.char);
        
        interval = setInterval(() => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          charEls.forEach((char, i) => {
            if (char.parentElement.classList.contains('space')) return;
            const charProgress = Math.max(0, (progress - (i * 0.1)) * 1.5);
            char.textContent = charProgress >= 1 ? originals[i] : chars[Math.floor(Math.random() * chars.length)];
          });
          
          if (progress >= 1) {
            clearInterval(interval);
            interval = null;
            scrambling = false;
            charEls.forEach((char, i) => char.textContent = originals[i]);
          }
        }, 50);
      }

      function reset() {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        scrambling = false;
        const originals = Array.from(charEls).map(el => el.dataset.char);
        charEls.forEach((char, i) => char.textContent = originals[i]);
      }

      link.addEventListener('mouseenter', () => scramble(1200));
      link.addEventListener('mouseleave', reset);
      link.dataset.hoverInit = 'true';
    });
  }

  function wrapLines(el) {
    if (!el.dataset.splitDone) {
      el.innerHTML = el.innerHTML.split('<br>').map(line => 
        `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${line}</div></div>`
      ).join('');
      el.dataset.splitDone = 'true';
    }
    return el.querySelectorAll('.line-inner');
  }

  function startAnims() {
    const largeHeadings = document.querySelectorAll('.heading.large');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const otherEls = document.querySelectorAll('h1:not(.heading.large), h2:not(.heading.large), h3:not(.heading.large), p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    if (largeHeadings.length) {
      largeHeadings.forEach(h => {
        window.gsap.to(wrapLines(h), { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", onComplete: initHover });
      });
    } else initHover();

    if (slideEls.length) {
      window.gsap.set(slideEls, { x: 40, opacity: 0 });
      window.gsap.to(slideEls, { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.7 });
    }

    window.gsap.to(otherEls, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" });
  }

  function initLenis() {
    if (lenis || typeof window.Lenis === 'undefined') return;
    
    try {
      lenis = new window.Lenis({
        duration: 1.2, orientation: 'vertical', smoothWheel: true, wheelMultiplier: 1,
        infinite: false, gestureOrientation: 'vertical', normalizeWheel: true, smoothTouch: false
      });

      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');
      document.documentElement.style.height = 'auto';
      document.body.style.minHeight = '100vh';
      document.body.style.position = 'relative';

      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);

      if (window.ScrollTrigger) lenis.on('scroll', () => window.ScrollTrigger?.update());
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.destroy();
    } catch (e) { console.error('Lenis error:', e); }
  }

  function addHidden() {
    document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)').forEach(el => {
      if (!el.classList.contains('initial-hidden')) el.classList.add('initial-hidden');
    });
    
    document.querySelectorAll('.grid-down.project-down.mobile-down').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        el.style.transform = 'translateX(40px)';
        el.style.opacity = '0';
      }
    });
  }

  function handleTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    if (lenis) {
      document.documentElement.classList.add('lenis-stopped');
      lenis.destroy();
    }

    const tl = window.gsap.timeline({ onComplete: () => window.location.href = href });
    const slideOut = document.querySelectorAll('.grid-down.project-down.mobile-down');
    
    if (slideOut.length) {
      tl.to(slideOut, { x: 20, opacity: 0, duration: 0.4, stagger: 0.05, delay: 0.3, ease: "power2.inOut" }, 0);
    }
    tl.to('body', { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0.2);
  }

  addHidden();

  function init() {
    if (isInit) return;
    startAnims();
    isInit = true;
    initLenis();
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) handleTransition(e, href);
  }, true);

  exports.initialize = init;
  exports.startAnimations = startAnims;
  exports.handlePageTransition = handleTransition;
  
  init();
})(window.portfolioAnimations);