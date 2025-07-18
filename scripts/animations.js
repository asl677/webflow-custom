// Version 1.5.50 - Respect Manual Line Breaks + Natural Detection + GSAP Stagger
// REQUIRED: Add this script tag to your Webflow site BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
console.log('animations.js v1.5.50 with GSAP stagger loading...');

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, lenis = null, preloaderComplete = false;
  let gsapLoaded = false, scrollTriggerLoaded = false;

  // GSAP Loader Function
  function loadGSAPScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load GSAP script:', src);
    };
    document.head.appendChild(script);
  }

  // Initialize GSAP Stagger Animations
  function initGSAPStagger() {
    if (!gsapLoaded || !scrollTriggerLoaded) return;
    
    console.log('Initializing GSAP stagger animations');
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Wait for preloader to complete before starting animations
    function startGSAPAnimations() {
      console.log('🎬 Starting GSAP stagger animations');
      
      // Target images inside reveal containers specifically
      const allImages = document.querySelectorAll(".reveal.reveal-full.thumbnail-container img, img:not(#preloader img)");
      const revealContainers = document.querySelectorAll(".reveal.reveal-full.thumbnail-container");
      
      console.log(`📊 Found ${allImages.length} images and ${revealContainers.length} reveal containers`);
      
      // Disable existing reveal animations by overriding classes
      revealContainers.forEach((container, index) => {
        console.log(`🚫 Disabling reveal ${index + 1}`);
        // Remove reveal classes to prevent default animation
        container.classList.remove('reveal', 'reveal-full');
        container.style.opacity = '1'; // Keep container visible
      });
      
      // Aggressively hide all images immediately
      allImages.forEach((img, index) => {
        console.log(`🖼️ Hiding image ${index + 1}`);
        // Use both GSAP and direct style to ensure they're hidden
        img.style.opacity = '0';
        img.style.visibility = 'visible'; // Ensure not hidden by other CSS
        gsap.set(img, {
          opacity: 0,
          clearProps: false
        });
      });
      
      // Immediate stagger animation for images in viewport (page load effect)
      setTimeout(() => {
        console.log('🔍 Starting viewport check for stagger animation...');
        
        const viewportImages = Array.from(allImages).filter(img => {
          const rect = img.getBoundingClientRect();
          const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
          console.log(`📍 Image ${img.src.split('/').pop()}: top=${Math.round(rect.top)}, inViewport=${inViewport}`);
          return inViewport;
        });
        
        console.log(`🎯 Found ${viewportImages.length} viewport images out of ${allImages.length} total`);
        
        if (viewportImages.length > 0) {
          console.log('🎬 Starting stagger animation...');
          gsap.to(viewportImages, {
            opacity: 1,
            duration: 0.8,
            stagger: 0.8,
            ease: "power2.out",
            onStart: () => console.log('🎬 Page load stagger started'),
            onUpdate: () => console.log('📈 Animation updating...'),
            onComplete: () => console.log('✅ Page load stagger complete')
          });
        } else {
          console.log('⚠️ No viewport images found - trying all images');
          // Fallback: animate all images if viewport detection fails
          gsap.to(allImages, {
            opacity: 1,
            duration: 0.8,
            stagger: 0.8,
            ease: "power2.out",
            onStart: () => console.log('🎬 Fallback stagger started'),
            onComplete: () => console.log('✅ Fallback stagger complete')
          });
        }
      }, 500); // Increased delay to ensure everything is ready
      
      // Scroll-triggered fade-in stagger for other images
      ScrollTrigger.batch(".reveal.reveal-full.thumbnail-container img, img:not(#preloader img)", {
        onEnter: (elements) => {
          // Filter out images that are already animated
          const hiddenElements = elements.filter(img => 
            getComputedStyle(img).opacity === "0" || img.style.opacity === "0"
          );
          
          if (hiddenElements.length > 0) {
            console.log(`🎯 Scroll stagger for ${hiddenElements.length} images`);
            
            gsap.to(hiddenElements, {
              opacity: 1,
              duration: 0.6,
              stagger: 0.8,
              ease: "power2.out"
            });
          }
        },
        start: "top bottom-=100",
        once: true
      });
      
      console.log('✅ GSAP stagger with reveal override initialized');
      ScrollTrigger.refresh();
    }
    
    // Wait for existing preloader to complete
    function waitForPreloaderComplete() {
      if (preloaderComplete) {
        setTimeout(startGSAPAnimations, 500);
      } else {
        setTimeout(waitForPreloaderComplete, 100);
      }
    }
    
    waitForPreloaderComplete();
    
    // Enhanced refresh handling
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
          console.log('GSAP ScrollTrigger refreshed after load');
        }
      }, 1000);
    });
    
    // Optimized resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 250);
    });
  }

  // Load GSAP Dependencies
  function loadGSAP() {
    console.log('Loading GSAP dependencies...');
    
    // Load GSAP core
    loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', function() {
      console.log('GSAP core loaded');
      gsapLoaded = true;
      
      // Load ScrollTrigger plugin
      loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', function() {
        console.log('GSAP ScrollTrigger loaded');
        scrollTriggerLoaded = true;
        initGSAPStagger();
      });
    });
  }

  // Create preloader
  function createPreloader() {
    const style = document.createElement('style');
    style.textContent = `
      #preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.5s ease-out;
      }
      
      #preloader.visible {
        opacity: 1;
      }
      
      #preloader .progress-container {
        text-align: center;
      }
      
      #preloader .progress-line {
        width: 80px;
        height: 2px;
        background: rgba(255, 255, 255, 0.2);
        position: relative;
        border-radius: 1px;
        margin: 0 auto;
      }
      
      #preloader .progress-fill {
        width: 0%;
        height: 100%;
        background: white;
        border-radius: 1px;
        transition: width 0.3s ease;
      }
      
      #preloader .progress-text {
        color: white;
        font-size: 12px;
        margin-top: 10px;
        opacity: 0.7;
        font-family: system-ui, -apple-system, sans-serif;
      }
      
      body.loading {
        overflow: hidden;
      }
      
      /* Bottom nav hidden until loaded */
      .nav:not(.fake-nav) {
        transform: translateY(100%);
        opacity: 0;
      }
    `;
    document.head.appendChild(style);

    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
      <div class="progress-container">
        <div class="progress-line">
          <div class="progress-fill"></div>
        </div>
      </div>
    `;
    document.body.appendChild(preloader);
    document.body.classList.add('loading');
    
    // Smooth fade in
    requestAnimationFrame(() => {
      preloader.classList.add('visible');
    });
    
    return preloader;
  }

  // Simple GSAP + imagesLoaded preloader
  function initPreloader() {
    console.log('Starting simple preloader...');
    
    // Load GSAP dependencies
    loadGSAP();
    
    const preloader = createPreloader();
    const progressFill = preloader.querySelector('.progress-fill');
    
    // Check if imagesLoaded is available, if not use fallback
    if (typeof imagesLoaded === 'function') {
      console.log('Using imagesLoaded library');
      
      // Use imagesLoaded to track all images
      const imgLoad = imagesLoaded(document.body, { background: true });
      let loadedCount = 0;
      const totalImages = imgLoad.images.length;
      
      console.log(`Found ${totalImages} images to load`);
      
      // If no images, complete immediately
      if (totalImages === 0) {
        window.gsap.to(progressFill, { width: '100%', duration: 0.3, onComplete: completePreloader });
        return;
      }
      
      // Update progress as images load
      imgLoad.on('progress', function(instance, image) {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        console.log(`Loading progress: ${Math.round(progress)}%`);
        
        window.gsap.to(progressFill, { 
          width: progress + '%', 
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      // Complete when all images are loaded
      imgLoad.on('always', function() {
        console.log('All images loaded!');
        setTimeout(completePreloader, 200);
      });
      
    } else {
      console.log('imagesLoaded not available, using fallback');
      // Simple fallback - just animate progress and complete
      window.gsap.to(progressFill, { 
        width: '100%', 
        duration: 1.5,
        ease: "power2.out",
        onComplete: completePreloader
      });
    }
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    console.log('Completing preloader...');
    
    const preloader = document.getElementById('preloader');
    
    // Simple smooth fade out
    window.gsap.to(preloader, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: function() {
        preloader.remove();
        document.body.classList.remove('loading');
        
        // Start animations
        console.log('Starting page animations');
        startPageAnimations();
      }
    });
  }

  // Start all page animations
  function startPageAnimations() {
    // Animate bottom nav
    const bottomNav = document.querySelector('.nav:not(.fake-nav)');
    if (bottomNav) {
      window.gsap.to(bottomNav, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    // Start main animations
    if (!isInit) {
      init();
    }
  }

  function initHover() {
    console.log('Initializing hover effects...');
    const links = document.querySelectorAll('.link');
    console.log('Found links:', links.length);
    
    links.forEach(link => {
      if (link.dataset.hoverInit) {
        console.log('Link already initialized:', link.textContent);
        return;
      }
      
      console.log('Setting up hover for:', link.textContent);
      
      // Store original dimensions
      const rect = link.getBoundingClientRect();
      const height = rect.height;
      
      // Create two layers of text
      const text = link.textContent.trim();
      
      // Set container styles
      Object.assign(link.style, {
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        height: height + 'px',
        lineHeight: height + 'px'
      });
      
      link.innerHTML = `
        <span class="link-text-1" style="display: block; position: relative; height: ${height}px; line-height: ${height}px; opacity: 1;">${text}</span>
        <span class="link-text-2" style="display: block; position: absolute; height: ${height}px; line-height: ${height}px; width: 100%; left: 0; top: 50%; opacity: 0;">${text}</span>
      `;
      
      // Create timeline with subtle animation
      const tl = window.gsap.timeline({ 
        paused: true,
        defaults: {
          duration: 0.4,
          ease: "power2.out"
        }
      });
      
      tl.to(link.querySelector('.link-text-1'), {
        yPercent: -50,
        opacity: 0
      })
      .to(link.querySelector('.link-text-2'), {
        yPercent: -50,
        opacity: 1
      }, 0.1); // Small delay for smoother transition
      
      // Add hover events
      link.addEventListener('mouseenter', () => {
        console.log('Mouse enter:', link.textContent);
        tl.timeScale(1).play();
      });
      
      link.addEventListener('mouseleave', () => {
        console.log('Mouse leave:', link.textContent);
        tl.timeScale(1.1).reverse();
      });
      
      link.dataset.hoverInit = 'true';
    });
  }

  function wrapLines(el) {
    if (!el.dataset.splitDone) {
      // First check if element has manual line breaks
      if (el.innerHTML.includes('<br>')) {
        // Use existing BR splitting logic for manual breaks
        el.innerHTML = el.innerHTML.split('<br>').map(line => 
          `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${line}</div></div>`
        ).join('');
      } else {
        // Only use natural line detection for text without manual breaks
        const originalText = el.textContent;
        const computedStyle = window.getComputedStyle(el);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        // If lineHeight is 'normal', estimate it
        const actualLineHeight = isNaN(lineHeight) ? fontSize * 1.2 : lineHeight;
        
        // Create a temporary element to measure text
        const temp = document.createElement('div');
        temp.style.cssText = `
          position: absolute;
          visibility: hidden;
          height: auto;
          width: ${el.offsetWidth}px;
          font-family: ${computedStyle.fontFamily};
          font-size: ${computedStyle.fontSize};
          font-weight: ${computedStyle.fontWeight};
          line-height: ${computedStyle.lineHeight};
          letter-spacing: ${computedStyle.letterSpacing};
          word-spacing: ${computedStyle.wordSpacing};
        `;
        document.body.appendChild(temp);
        
        // Split text into words and find line breaks
        const words = originalText.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
          temp.textContent = testLine;
          
          if (temp.offsetHeight > actualLineHeight && currentLine !== '') {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        // Clean up
        document.body.removeChild(temp);
        
        // If we detected multiple lines, wrap them
        if (lines.length > 1) {
          el.innerHTML = lines.map(line => 
            `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${line}</div></div>`
          ).join('');
        } else {
          // Single line, still wrap for consistency
          el.innerHTML = `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${originalText}</div></div>`;
        }
      }
      
      el.dataset.splitDone = 'true';
    }
    return el.querySelectorAll('.line-inner');
  }

  function startAnims() {
    // Get all elements upfront
    const largeHeadings = document.querySelectorAll('.heading.large');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img, video');
    const otherEls = document.querySelectorAll('h1:not(.heading.large), h2:not(.heading.large), h3:not(.heading.large), p, a, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    // Initialize hover immediately to prevent delay
    initHover();

    // Create a single timeline for better performance
    const tl = window.gsap.timeline();

    // Set initial state for media elements
    if (mediaEls.length) {
      window.gsap.set(mediaEls, { opacity: 0 });
      
      // Create separate timeline for media elements
      mediaEls.forEach((el, i) => {
        window.gsap.to(el, {
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=100",
            end: "bottom top+=100",
            toggleActions: "play none none reverse"
          }
        });
      });
    }

    // Large headings - keep the nice stagger
    if (largeHeadings.length) {
      largeHeadings.forEach(h => {
        tl.to(wrapLines(h), { y: 0, opacity: 1, duration: 1.1, stagger: 0.2, ease: "power2.out" }, 0);
      });
    }

    // Slide elements - subtle but noticeable stagger
    if (slideEls.length) {
      window.gsap.set(slideEls, { x: 40, opacity: 0 });
      tl.to(slideEls, { x: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power2.out" }, 0.7);
    }

    // Other elements - smart batching with better stagger
    if (otherEls.length) {
      const batchSize = 6; // Smaller batches for better flow
      for (let i = 0; i < otherEls.length; i += batchSize) {
        const batch = Array.from(otherEls).slice(i, i + batchSize);
        const delay = 0.2 + (i / batchSize) * 0.1; // Progressive delay between batches
        tl.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.04, ease: "power2.out" }, delay);
      }
    }
  }

  function initLenis() {
    if (lenis || typeof window.Lenis === 'undefined') return;
    
    // Detect iOS for potential fallback
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    try {
      lenis = new window.Lenis({
        autoRaf: true, // Let Lenis handle requestAnimationFrame
        duration: 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Better iOS compatibility
        wheelMultiplier: 1,
        touchMultiplier: isIOS ? 0.8 : 1, // Slightly reduced for iOS
        infinite: false,
        normalizeWheel: true,
        syncTouch: false, // Avoid iOS < 16 issues
        touchInertiaMultiplier: isIOS ? 25 : 35 // Gentler on iOS
      });

      // Add recommended CSS for better iOS support
      const lenisCSS = document.createElement('style');
      lenisCSS.textContent = `
        html.lenis, html.lenis body {
          height: auto;
        }
        
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        
        /* iOS-specific improvements */
        @supports (-webkit-touch-callout: none) {
          html.lenis {
            -webkit-overflow-scrolling: auto;
            overscroll-behavior: none;
          }
        }
      `;
      document.head.appendChild(lenisCSS);

      document.documentElement.classList.add('lenis');
      document.body.classList.add('lenis-smooth');

      // Only set up manual RAF if autoRaf fails
      if (!lenis.options.autoRaf) {
        function raf(time) { 
          lenis.raf(time); 
          requestAnimationFrame(raf); 
        }
        requestAnimationFrame(raf);
      }

      if (window.ScrollTrigger) {
        lenis.on('scroll', () => window.ScrollTrigger?.update());
      }
      
      // Disable on reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        lenis.destroy();
      }
      
      console.log(`Lenis initialized (iOS: ${isIOS})`);
    } catch (e) { 
      console.error('Lenis error:', e);
      // Fallback to native scroll
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  function addHidden() {
    // Use a single query for better performance
    document.querySelectorAll('h1, h2, h3, p, a, img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        if (el.matches('.grid-down.project-down.mobile-down')) {
          el.style.transform = 'translateX(40px)';
          el.style.opacity = '0';
        }
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
      tl.to(slideOut, { x: 20, opacity: 0, duration: 0.8, stagger: 0.02, ease: "power2.inOut" }, 0.2);
    }
    tl.to('body', { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.1);
  }

  // Initialize
  addHidden();
  initLenis();

  function init() {
    if (isInit) return;
    console.log('Starting main animations...');
    requestAnimationFrame(() => {
      startAnims();
      isInit = true;
    });
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
  
  // Start preloader when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})(window.portfolioAnimations);