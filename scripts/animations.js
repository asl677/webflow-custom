// Version 1.5.16 - Scramble Hover Effects
console.log('animations.js version 1.5.16 loading...');

// Create a global namespace for our functions
window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  // Global initialization flag
  let isInitialized = false;
  let lenis = null;

  // Characters for scrambling effect
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Initialize hover effects with scramble animation
  function initHoverEffects() {
    console.log('Initializing scramble hover effects...');
    
    // Handle heading link hover effects
    const headingLinks = document.querySelectorAll('.heading.small.link.large-link');
    
    headingLinks.forEach(link => {
      // Only set up the effect if not already done
      if (link.dataset.hoverInit) return;
      
      // Store original text
      const originalText = link.textContent.trim();
      
      // Split text into characters if not already done
      if (!link.dataset.splitDone) {
        const chars = originalText.split('');
        const wrappedChars = chars.map(char => 
          `<span class="char" data-char="${char}" style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        link.innerHTML = wrappedChars;
        link.dataset.splitDone = 'true';
      }

      const chars = link.querySelectorAll('.char');
      let isScrambling = false;
      let scrambleInterval;

      // Scramble function
      function scrambleText(duration = 600) {
        if (isScrambling) return;
        isScrambling = true;
        
        const startTime = Date.now();
        const charElements = Array.from(chars);
        
        // Store original characters
        const originalChars = charElements.map(el => el.dataset.char);
        
        scrambleInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          charElements.forEach((char, index) => {
            if (char.dataset.char === ' ') return; // Skip spaces
            
            // Determine if this character should be resolved
            const charProgress = Math.max(0, (progress - (index * 0.05)) * 2);
            
            if (charProgress >= 1) {
              // Character is resolved
              char.textContent = originalChars[index];
            } else {
              // Character is still scrambling
              const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
              char.textContent = randomChar;
            }
          });
          
          if (progress >= 1) {
            clearInterval(scrambleInterval);
            isScrambling = false;
            // Ensure all characters are correct
            charElements.forEach((char, index) => {
              if (char.dataset.char !== ' ') {
                char.textContent = originalChars[index];
              }
            });
          }
        }, 50); // Update every 50ms for smooth effect
      }

      // Reset to original text
      function resetText() {
        if (scrambleInterval) {
          clearInterval(scrambleInterval);
          isScrambling = false;
        }
        chars.forEach(char => {
          if (char.dataset.char !== ' ') {
            char.textContent = char.dataset.char;
          }
        });
      }

      // Add hover listeners
      link.addEventListener('mouseenter', () => {
        scrambleText();
      });

      link.addEventListener('mouseleave', () => {
        resetText();
      });

      link.dataset.hoverInit = 'true';
    });
  }

  // Function to split text into lines
  function wrapLines(element) {
    if (!element.dataset.splitDone) {
      const text = element.innerHTML;
      element.innerHTML = text.split('<br>').map(line => 
        `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${line}</div></div>`
      ).join('');
      element.dataset.splitDone = 'true';
    }
    return element.querySelectorAll('.line-inner');
  }

  // Function to start animations
  function startAnimations() {
    console.log('Starting animations...');
    
    // Split and animate large headings first
    const largeHeadings = document.querySelectorAll('.heading.large');
    if (largeHeadings.length) {
      console.log('Found large headings:', largeHeadings.length);
      largeHeadings.forEach(heading => {
        const lines = wrapLines(heading);
        window.gsap.to(lines, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          onComplete: () => {
            console.log('Large heading animation complete, initializing hover effects');
            initHoverEffects();
          }
        });
      });
    } else {
      console.log('No large headings found, initializing hover effects directly');
      initHoverEffects();
    }

    // Animate slide-in elements from right
    const slideInElements = document.querySelectorAll('.grid-down.project-down.mobile-down');
    if (slideInElements.length) {
      // Set initial state
      window.gsap.set(slideInElements, {
        x: 40,
        opacity: 0
      });
      
      // Animate to final position
      window.gsap.to(slideInElements, {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.3
      });
    }

    // Animate everything else
    const selectors = ['h1:not(.heading.large)', 'h2:not(.heading.large)', 'h3:not(.heading.large)', 'p', 'a', 'img', 'video', '.nav', '.preloader-counter', '.card-project', '.fake-nav', '.inner-top', '.mobile-down:not(.grid-down.project-down.mobile-down)'];
    const elements = document.querySelectorAll(selectors.join(','));
    
    window.gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out"
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
        infinite: false,
        gestureOrientation: 'vertical',
        normalizeWheel: true,
        smoothTouch: false
      });

      // Add Lenis CSS classes
      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');

      // Ensure proper height setup
      document.documentElement.style.height = 'auto';
      document.body.style.minHeight = '100vh';
      document.body.style.position = 'relative';

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      // Start RAF loop
      requestAnimationFrame(raf);

      // GSAP ScrollTrigger integration if available
      if (window.ScrollTrigger) {
        lenis.on('scroll', () => {
          if (window.ScrollTrigger) {
            window.ScrollTrigger.update();
          }
        });
      }

      // Stop Lenis on low power mode in Safari
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis.destroy();
      }

      return true;
    } catch (error) {
      console.error('Error initializing Lenis:', error);
      return false;
    }
  }

  // Function to add initial-hidden class
  function addInitialHiddenClass() {
    document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
      }
    });
    
    // Set initial state for slide-in elements
    document.querySelectorAll('.grid-down.project-down.mobile-down').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        el.style.transform = 'translateX(40px)';
        el.style.opacity = '0';
      }
    });
  }

  // Add the class immediately
  addInitialHiddenClass();

  // Initialize everything
  function initialize() {
    if (isInitialized) return;
    
    // Start animations immediately
    startAnimations();
    isInitialized = true;

    // Initialize Lenis
    initLenis();
  }

  // Handle page transitions
  function handlePageTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();

    if (lenis) {
      document.documentElement.classList.add('lenis-stopped');
      lenis.destroy();
    }

    window.gsap.to('body', {
      opacity: 0,
      duration: 0.5,
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