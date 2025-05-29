// Version 1.5.15 - Hover Effects
console.log('animations.js version 1.5.15 loading...');

// Create a global namespace for our functions
window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  // Global initialization flag
  let isInitialized = false;
  let lenis = null;

  // Initialize hover effects
  function initHoverEffects() {
    // Handle heading link hover effects
    const headingLinks = document.querySelectorAll('.heading.small.link.large-link');
    
    headingLinks.forEach(link => {
      // Split text for hover effect if not already split
      if (!link.dataset.splitDone) {
        const text = link.textContent;
        const chars = text.split('');
        link.innerHTML = chars.map(char => 
          `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        link.dataset.splitDone = 'true';
      }

      // Create hover animation timeline
      const hoverTimeline = gsap.timeline({ paused: true });
      const chars = link.querySelectorAll('.char');
      
      // Setup the timeline
      hoverTimeline
        .to(chars, {
          y: -20,
          rotateX: -90,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          stagger: {
            amount: 0.3,
            from: "start",
            ease: "power2.inOut"
          }
        });

      // Add hover event listeners
      link.addEventListener('mouseenter', () => {
        hoverTimeline.play();
      });

      link.addEventListener('mouseleave', () => {
        hoverTimeline.reverse();
      });
    });
  }

  // Initialize Lenis
  function initLenis() {
    if (lenis) return;
    
    // Check if Lenis is available
    if (typeof window.Lenis === 'undefined') {
      console.warn('Lenis not loaded, waiting...');
      return false;
    }

    try {
      // Basic Lenis setup with essential settings
      lenis = new window.Lenis({
        duration: 1.2,
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        infinite: false
      });

      // Add Lenis CSS classes
      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');

      // Ensure proper height setup
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // GSAP ScrollTrigger integration if available
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
      }

      console.log('Lenis initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Lenis:', error);
      return false;
    }
  }

  // Function to add initial-hidden class to elements
  function addInitialHiddenClass() {
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    document.querySelectorAll(selectors.join(',')).forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        // Add will-change for better performance on fixed elements
        if (window.getComputedStyle(el).position === 'fixed') {
          el.style.willChange = 'transform';
          el.style.transform = 'translateZ(0)';
        }
      }
    });
  }

  // Add the class immediately
  addInitialHiddenClass();

  // Function to split text into lines for animation
  function splitTextIntoLines(element) {
    if (!element.dataset.splitDone) {
      const text = element.textContent;
      const words = text.split(' ');
      let lines = [];
      let currentLine = [];
      
      // Create a temporary element to measure text
      const temp = document.createElement('div');
      temp.style.cssText = `
        position: absolute; 
        visibility: hidden; 
        height: auto; 
        width: auto;
        white-space: nowrap;
      `;
      element.parentNode.appendChild(temp);
      
      words.forEach(word => {
        currentLine.push(word);
        temp.textContent = currentLine.join(' ');
        if (temp.offsetWidth > element.offsetWidth) {
          currentLine.pop();
          if (currentLine.length) {
            lines.push(currentLine.join(' '));
          }
          currentLine = [word];
        }
      });
      
      if (currentLine.length) {
        lines.push(currentLine.join(' '));
      }
      
      element.parentNode.removeChild(temp);
      
      // Create spans for each line
      element.innerHTML = lines.map(line => 
        `<span class="split-line"><span class="line-inner">${line}</span></span>`
      ).join('');
      
      element.dataset.splitDone = 'true';
    }
    return element.querySelectorAll('.line-inner');
  }

  // Function to start animations
  function startAnimations() {
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down'];
    const allElements = [];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => allElements.push(el));
    });

    // If GSAP isn't available, just show content
    if (!window.gsap) {
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.remove('initial-hidden');
      });
      return;
    }

    // Create timeline with proper duration
    const mainTL = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.5 },
      onStart: () => {
        document.body.classList.add('content-loaded');
        allElements.forEach(el => {
          el.classList.remove('initial-hidden');
          el.style.visibility = 'visible';
        });
      },
      onComplete: () => {
        // Initialize hover effects after initial animation
        initHoverEffects();
      }
    });

    // Split and animate large headings separately
    const largeHeadings = document.querySelectorAll('.heading.large');
    largeHeadings.forEach(heading => {
      const lines = splitTextIntoLines(heading);
      mainTL.fromTo(lines,
        { 
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: {
            amount: 0.3,
            from: "start"
          }
        },
        "-=0.4" // Overlap with previous animations
      );
    });

    // Group remaining elements by type for better performance
    const headings = allElements.filter(el => /^h[1-3]$/.test(el.tagName.toLowerCase()) && !el.classList.contains('large'));
    const text = allElements.filter(el => el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'a');
    const media = allElements.filter(el => el.tagName.toLowerCase() === 'img' || el.tagName.toLowerCase() === 'video');
    const ui = allElements.filter(el => !headings.includes(el) && !text.includes(el) && !media.includes(el));

    // Animate with proper stagger timing
    mainTL
      .fromTo(headings, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: { amount: 0.3 } }
      )
      .fromTo(text, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: { amount: 0.4 } }, 
        '-=0.2'
      )
      .fromTo(media, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: { amount: 0.3 } }, 
        '-=0.3'
      )
      .fromTo(ui, 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: { amount: 0.2 } }, 
        '-=0.2'
      );
  }

  // Initialize everything
  function initialize() {
    if (isInitialized) return;

    // Try to initialize Lenis
    const lenisInitialized = initLenis();

    // Start animations immediately
    if (window.gsap) {
      startAnimations();
      isInitialized = true;
    } else {
      // Quick GSAP check with shorter timeout
      const maxWaitTime = 100;
      const startTime = Date.now();
      
      function checkGSAP() {
        if (window.gsap || Date.now() - startTime > maxWaitTime) {
          startAnimations();
          isInitialized = true;
        } else {
          requestAnimationFrame(checkGSAP);
        }
      }
      requestAnimationFrame(checkGSAP);
    }

    // If Lenis failed to initialize, retry
    if (!lenisInitialized) {
      const maxRetries = 5;
      let retryCount = 0;
      
      function retryLenis() {
        if (retryCount >= maxRetries) {
          console.warn('Failed to initialize Lenis after', maxRetries, 'attempts');
          // Reset body styles if Lenis fails
          document.body.style.overflow = '';
          document.body.style.height = '';
          document.documentElement.style.height = '';
          return;
        }
        
        if (!initLenis()) {
          retryCount++;
          setTimeout(retryLenis, 100);
        }
      }
      
      setTimeout(retryLenis, 100);
    }
  }

  // Handle page transitions with minimal animation
  function handlePageTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    // Stop Lenis during transition
    if (lenis) {
      document.documentElement.classList.add('lenis-stopped');
      lenis.destroy();
    }

    gsap.to('body', {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        window.location.href = href;
      }
    });
  }

  // Event delegation for link handling
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) {
      handlePageTransition(e, href);
    }
  }, true);

  // Export necessary functions
  exports.initialize = initialize;
  exports.startAnimations = startAnimations;
  exports.handlePageTransition = handlePageTransition;
  
  // Start initialization immediately
  initialize();
})(window.portfolioAnimations);