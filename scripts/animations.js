// Version 1.6.7 - NO SCALING EFFECTS - CDN Cache Bust
// REQUIRED: Add this script tag to your Webflow site BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
console.log('🔥 animations.js v1.6.7 - NO SCALING EFFECTS loading...');
console.log('🔍 Current URL:', window.location.href);
console.log('🔍 Document ready state:', document.readyState);

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, lenis = null, preloaderComplete = false;
  let gsapLoaded = false, scrollTriggerLoaded = false;

  // Add global error handler
  window.addEventListener('error', function(e) {
    console.error('🚨 Global JavaScript error:', e.error);
    console.error('🚨 Error in file:', e.filename, 'at line:', e.lineno);
  });

  // Test function to verify script is running
  function testBasicFunctionality() {
    console.log('🧪 Testing basic functionality...');
    
    // Test element selection
    const allElements = document.querySelectorAll('*');
    console.log(`🔍 Total elements in DOM: ${allElements.length}`);
    
    const images = document.querySelectorAll('img');
    console.log(`🖼️ Total images found: ${images.length}`);
    
    const headings = document.querySelectorAll('h1, h2, h3');
    console.log(`📝 Total headings found: ${headings.length}`);
    
    const paragraphs = document.querySelectorAll('p');
    console.log(`📄 Total paragraphs found: ${paragraphs.length}`);
    
    // Test if jQuery is available
    console.log('💲 jQuery available:', typeof $ !== 'undefined');
    
    // Test if imagesLoaded is available
    console.log('🖼️ imagesLoaded available:', typeof imagesLoaded !== 'undefined');
    
    // Test GSAP availability
    console.log('🎬 GSAP available:', typeof gsap !== 'undefined');
    console.log('🎬 ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');
  }

  // Run basic test immediately
  testBasicFunctionality();

  // GSAP Loader Function
  function loadGSAPScript(src, callback) {
    console.log('📦 Loading GSAP script:', src);
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      console.log('✅ Successfully loaded:', src);
      callback();
    };
    script.onerror = function() {
      console.error('❌ Failed to load GSAP script:', src);
    };
    document.head.appendChild(script);
  }

  // Simplified test animation
  function runSimpleTest() {
    console.log('🧪 Running simple animation test...');
    
    // Find any element to test with
    const testElement = document.querySelector('h1, h2, h3, p');
    if (testElement) {
      console.log('🎯 Found test element:', testElement.tagName, testElement.textContent?.substring(0, 50));
      
      // Simple opacity animation
      testElement.style.opacity = '0.3';
      testElement.style.background = 'rgba(255, 0, 0, 0.1)';
      
      if (typeof gsap !== 'undefined') {
        console.log('🎬 Running GSAP test animation...');
        gsap.to(testElement, {
          opacity: 1,
          duration: 2,
          ease: "power2.out",
          onComplete: () => {
            console.log('✅ GSAP animation completed!');
            testElement.style.background = 'rgba(0, 255, 0, 0.1)';
          }
        });
      } else {
        console.log('❌ GSAP not available for test');
      }
    } else {
      console.log('❌ No test element found');
    }
  }

  // Initialize GSAP Stagger Animations
  function initGSAPStagger() {
    if (!gsapLoaded || !scrollTriggerLoaded) {
      console.log('⏳ GSAP not ready yet, gsapLoaded:', gsapLoaded, 'scrollTriggerLoaded:', scrollTriggerLoaded);
      return;
    }
    
    console.log('🎬 Initializing GSAP stagger animations');
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ ScrollTrigger registered');
    
    // Run simple test first
    runSimpleTest();
    
    // Wait for preloader to complete before starting animations
    function startGSAPAnimations() {
      console.log('🎬 Starting viewport + scroll stagger system');
      
      const allImages = document.querySelectorAll("img:not(#preloader img)");
      console.log(`📊 Found ${allImages.length} total images for stagger`);
      
      if (allImages.length === 0) {
        console.log('⚠️ No images found for stagger animation');
        return;
      }
      
      // Log each image found
      allImages.forEach((img, i) => {
        console.log(`🖼️ Image ${i + 1}:`, img.src, 'visible:', img.offsetParent !== null);
      });
      
      // Set all images to invisible initially
      console.log('🙈 Setting all images to opacity 0');
      gsap.set(allImages, { opacity: 0 });
      
      // Wait for images to load, then implement stagger system
      if (typeof imagesLoaded === 'function') {
        console.log('📦 Using imagesLoaded library');
        imagesLoaded(document.body, function() {
          console.log('✅ Images loaded, setting up stagger system');
          
          // Find images in viewport (above the fold)
          const viewportImages = Array.from(allImages).filter(img => {
            const rect = img.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
            console.log(`🎯 Image viewport check: top=${rect.top}, bottom=${rect.bottom}, inViewport=${inViewport}`);
            return inViewport;
          });
          
          console.log(`🎯 Found ${viewportImages.length} viewport images for immediate stagger`);
          
          // Immediate stagger for viewport images (0.5s between each)
          if (viewportImages.length > 0) {
            console.log('🎬 Starting viewport image stagger...');
                    gsap.to(viewportImages, {
          opacity: 1,
          duration: 1,
          stagger: 0.5, // 0.5s as requested
          ease: "power2.out",
          onStart: () => console.log('🎬 Viewport stagger started'),
          onComplete: () => console.log('✅ Viewport stagger complete')
        });
          } else {
            console.log('⚠️ No viewport images found for stagger');
          }
          
          // ScrollTrigger batch for images outside viewport
          const remainingImages = Array.from(allImages).filter(img => {
            const rect = img.getBoundingClientRect();
            return !(rect.top < window.innerHeight && rect.bottom > 0);
          });
          
          console.log(`📜 Setting up scroll triggers for ${remainingImages.length} remaining images`);
          
          if (remainingImages.length > 0) {
            // Create ScrollTrigger for each remaining image
            remainingImages.forEach((img, index) => {
              ScrollTrigger.create({
                trigger: img,
                start: "top bottom-=100",
                onEnter: () => {
                  console.log(`📍 Scrolled to image ${index + 1}`);
                  gsap.to(img, {
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out"
                  });
                },
                once: true
              });
            });
          }
          
          ScrollTrigger.refresh();
          console.log('🔄 ScrollTrigger refreshed');
        });
      } else {
        console.log('⚠️ imagesLoaded not available, showing all images immediately');
        gsap.set(allImages, { opacity: 1 });
      }
    }
    
    // Wait for existing preloader to complete
    function waitForPreloaderComplete() {
      console.log('⏳ Waiting for preloader to complete, current state:', preloaderComplete);
      if (preloaderComplete) {
        console.log('✅ Preloader complete, starting GSAP animations in 500ms');
        setTimeout(startGSAPAnimations, 500);
      } else {
        setTimeout(waitForPreloaderComplete, 100);
      }
    }
    
    waitForPreloaderComplete();
    
    // Enhanced refresh handling
    window.addEventListener('load', () => {
      console.log('🔄 Window load event triggered');
      setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
          console.log('✅ GSAP ScrollTrigger refreshed after load');
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
          console.log('🔄 ScrollTrigger refreshed after resize');
        }
      }, 250);
    });
  }

  // Load GSAP Dependencies
  function loadGSAP() {
    console.log('📦 Loading GSAP dependencies...');
    
    // Load GSAP core
    loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', function() {
      console.log('✅ GSAP core loaded successfully');
      gsapLoaded = true;
      
      // Test GSAP immediately
      if (typeof gsap !== 'undefined') {
        console.log('🎬 GSAP is now available:', typeof gsap);
        runSimpleTest();
      }
      
      // Load ScrollTrigger plugin
      loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', function() {
        console.log('✅ GSAP ScrollTrigger loaded successfully');
        scrollTriggerLoaded = true;
        initGSAPStagger();
      });
    });
  }

  // Create preloader
  function createPreloader() {
    console.log('🔄 Creating preloader...');
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
      console.log('✅ Preloader visible');
    });
    
    return preloader;
  }

  // Simple GSAP + imagesLoaded preloader
  function initPreloader() {
    console.log('🚀 Starting simple preloader...');
    
    // Load GSAP dependencies
    loadGSAP();
    
    const preloader = createPreloader();
    const progressFill = preloader.querySelector('.progress-fill');
    
    console.log('📦 Checking for imagesLoaded:', typeof imagesLoaded);
    
    // Check if imagesLoaded is available, if not use fallback
    if (typeof imagesLoaded === 'function') {
      console.log('✅ Using imagesLoaded library');
      
      // Use imagesLoaded to track all images
      const imgLoad = imagesLoaded(document.body, { background: true });
      let loadedCount = 0;
      const totalImages = imgLoad.images.length;
      
      console.log(`📊 Found ${totalImages} images to load`);
      
      // If no images, complete immediately
      if (totalImages === 0) {
        console.log('⚠️ No images found, completing preloader immediately');
        if (typeof gsap !== 'undefined') {
          gsap.to(progressFill, { width: '100%', duration: 0.3, onComplete: completePreloader });
        } else {
          setTimeout(completePreloader, 300);
        }
        return;
      }
      
      // Update progress as images load
      imgLoad.on('progress', function(instance, image) {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        console.log(`📈 Loading progress: ${Math.round(progress)}% (${loadedCount}/${totalImages})`);
        
        if (typeof gsap !== 'undefined') {
          gsap.to(progressFill, { 
            width: progress + '%', 
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          progressFill.style.width = progress + '%';
        }
      });
      
      // Complete when all images are loaded
      imgLoad.on('always', function() {
        console.log('✅ All images loaded!');
        setTimeout(completePreloader, 200);
      });
      
    } else {
      console.log('⚠️ imagesLoaded not available, using fallback');
      // Simple fallback - just animate progress and complete
      if (typeof gsap !== 'undefined') {
        gsap.to(progressFill, { 
          width: '100%', 
          duration: 1.5,
          ease: "power2.out",
          onComplete: completePreloader
        });
      } else {
        setTimeout(() => {
          progressFill.style.width = '100%';
          setTimeout(completePreloader, 300);
        }, 1500);
      }
    }
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) {
      console.log('⚠️ Preloader already completed, skipping');
      return;
    }
    preloaderComplete = true;
    
    console.log('🎉 Completing preloader...');
    
    const preloader = document.getElementById('preloader');
    
    // Simple smooth fade out
    if (typeof gsap !== 'undefined') {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: function() {
          preloader.remove();
          document.body.classList.remove('loading');
          console.log('✅ Preloader removed');
          
          // Start animations
          console.log('🎬 Starting page animations');
          startPageAnimations();
        }
      });
    } else {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.remove();
          document.body.classList.remove('loading');
          console.log('✅ Preloader removed (fallback)');
          startPageAnimations();
        }, 400);
      }, 100);
    }
  }

  // Start all page animations
  function startPageAnimations() {
    console.log('🎬 Starting page animations...');
    
    // Animate bottom nav
    const bottomNav = document.querySelector('.nav:not(.fake-nav)');
    if (bottomNav) {
      console.log('🧭 Found bottom nav, animating...');
      if (typeof gsap !== 'undefined') {
        gsap.to(bottomNav, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out"
        });
      } else {
        bottomNav.style.transform = 'translateY(0)';
        bottomNav.style.opacity = '1';
      }
    } else {
      console.log('⚠️ No bottom nav found');
    }
    
    // Start main animations
    if (!isInit) {
      console.log('🎬 Initializing main animations...');
      init();
    } else {
      console.log('⚠️ Animations already initialized');
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
        tl.timeScale(1).reverse();
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
    const otherEls = document.querySelectorAll('h1:not(.heading.large), h2:not(.heading.large), h3:not(.heading.large), p, a, .nav, .preloader-counter, .card-project, .top-right-nav,.fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    // Initialize hover immediately to prevent delay
    initHover();

    // Animate reveal containers width from 0 to 90% on page load
    const revealContainers = document.querySelectorAll('.reveal.reveal-full.thumbnail-container.video-container.video-large.video-fixed');
    console.log(`🎬 Found ${revealContainers.length} reveal containers for width animation`);
    
    if (revealContainers.length) {
      // Set initial states
      window.gsap.set(revealContainers, { width: 0, overflow: 'hidden' });
      
      // Animate width only (no scaling)
      window.gsap.to(revealContainers, {
        width: '70%',
        duration: 1,
        ease: "power2.out",
        delay: 0,
        onStart: () => console.log('🎭 Starting width reveal animations'),
        onComplete: () => console.log('✅ Width reveal animations complete')
      });
    }

    // Create a single timeline for better performance
    const tl = window.gsap.timeline();

    // Set initial state for media elements - FIXED: No more flickering
    if (mediaEls.length) {
      window.gsap.set(mediaEls, { opacity: 0 });
      
      // Create separate timeline for media elements
      mediaEls.forEach((el, i) => {
        window.gsap.to(el, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=100",
            toggleActions: "play none none none", // FIXED: Removed reverse to prevent flickering
            once: true // ADDED: Animation only plays once
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