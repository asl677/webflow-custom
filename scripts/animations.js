// Version 1.7.8 - RESTORED ORIGINAL WORKING STAGGER SYSTEM
// REQUIRED: Add this script tag to your Webflow site BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
console.log('🔥 animations.js v1.7.8 - RESTORED ORIGINAL WORKING STAGGER SYSTEM loading...');
console.log('🔍 Current URL:', window.location.href);
console.log('🔍 Document ready state:', document.readyState);

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, lenis = null, preloaderComplete = false;
  let gsapLoaded = false, scrollTriggerLoaded = false, observerLoaded = false;

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
    if (!gsapLoaded || !scrollTriggerLoaded || !observerLoaded) {
      console.log('⏳ GSAP not ready yet, gsapLoaded:', gsapLoaded, 'scrollTriggerLoaded:', scrollTriggerLoaded, 'observerLoaded:', observerLoaded);
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
      // Prevent multiple initializations
      if (window.gsapStaggerInitialized) {
        console.log('⚠️ GSAP stagger already initialized, skipping to prevent conflicts');
        return;
      }
      window.gsapStaggerInitialized = true;
      
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
      
      // Set all images to invisible initially (only if not already animated)
      console.log('🙈 Setting all images to opacity 0');
      allImages.forEach(img => {
        // Skip images inside reveal containers - they need to be visible for mask effect
        if (img.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed')) {
          console.log('🎭 Skipping image in reveal container for mask effect');
          gsap.set(img, { opacity: 1 });
          img.dataset.gsapAnimated = 'reveal-container';
          return;
        }
        
        // Only set opacity if not already animated to prevent conflicts
        if (!img.dataset.gsapAnimated) {
          gsap.set(img, { opacity: 0 });
          img.dataset.gsapAnimated = 'initializing';
        }
      });
      
      // Wait for images to load, then implement stagger system
      if (typeof imagesLoaded === 'function') {
        console.log('📦 Using imagesLoaded library');
        imagesLoaded(document.body, function() {
          console.log('✅ Images loaded, setting up stagger system');
          
          // Find images in viewport (above the fold) - excluding reveal container images
          const viewportImages = Array.from(allImages).filter(img => {
            // Skip reveal container images
            if (img.dataset.gsapAnimated === 'reveal-container') {
              return false;
            }
            
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
              onComplete: () => {
                console.log('✅ Viewport stagger complete');
                // Mark as completed to prevent re-animation
                viewportImages.forEach(img => img.dataset.gsapAnimated = 'completed');
              }
            });
          } else {
            console.log('⚠️ No viewport images found for stagger');
          }
          
          // ScrollTrigger batch for images outside viewport - excluding reveal container images
          const remainingImages = Array.from(allImages).filter(img => {
            // Skip reveal container images
            if (img.dataset.gsapAnimated === 'reveal-container') {
              return false;
            }
            
            const rect = img.getBoundingClientRect();
            return !(rect.top < window.innerHeight && rect.bottom > 0);
          });
          
          console.log(`📜 Setting up scroll triggers for ${remainingImages.length} remaining images`);
          
          if (remainingImages.length > 0) {
            // Create ScrollTrigger for each remaining image (with flicker protection)
            remainingImages.forEach((img, index) => {
              // Skip if already animated
              if (img.dataset.gsapAnimated === 'completed') {
                console.log(`⏭️ Skipping already animated image ${index + 1}`);
                return;
              }
              
              ScrollTrigger.create({
                trigger: img,
                start: "top bottom-=200",
                onEnter: () => {
                  // Double-check to prevent duplicate animations
                  if (img.dataset.gsapAnimated === 'completed') return;
                  
                  console.log(`📍 Scrolled to image ${index + 1}`);
                  img.dataset.gsapAnimated = 'animating';
                  
                  gsap.to(img, {
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: () => {
                      img.dataset.gsapAnimated = 'completed';
                    }
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
        
        // Load Observer plugin for infinite scroll
        loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Observer.min.js', function() {
          console.log('✅ GSAP Observer loaded successfully');
          observerLoaded = true;
          initGSAPStagger();
        });
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
      // Store original text safely
      const originalText = el.textContent.trim();
      
      // Always treat as single line to avoid complications
      el.innerHTML = `<div class="split-line" style="overflow: hidden;"><div class="line-inner" style="transform: translateY(20px); opacity: 0;">${originalText}</div></div>`;
      
      el.dataset.splitDone = 'true';
    }
    return el.querySelectorAll('.line-inner');
  }

  function startAnims() {
    // Get all elements upfront - organized for proper stagger animations
    const largeHeadings = document.querySelectorAll('.heading.large');
    const smallHeadings = document.querySelectorAll('.heading.small');
    const regularHeadings = document.querySelectorAll('h1:not(.heading.large):not(.heading.small), h2:not(.heading.large):not(.heading.small), h3:not(.heading.large):not(.heading.small)');
    const paragraphs = document.querySelectorAll('p');
    const links = document.querySelectorAll('a:not(.nav a):not(.fake-nav a)');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img, video');
    const otherEls = document.querySelectorAll('.nav, .preloader-counter, .card-project, .top-right-nav,.fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    // Initialize hover immediately to prevent delay
    initHover();

    // Create proper mask reveal for ALL images
    const allImages = document.querySelectorAll('img:not(#preloader img), video');
    console.log(`🎬 Found ${allImages.length} media elements for proper mask reveal`);
    
    if (allImages.length) {
      allImages.forEach((element, index) => {
        // Skip if already processed
        if (element.dataset.maskSetup) return;
        
        // Get original dimensions
        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;
        
        if (originalWidth === 0 || originalHeight === 0) return;
        
        console.log(`🎭 Setting up mask for element ${index + 1}: ${originalWidth}x${originalHeight}px`);
        
        const parent = element.parentNode;
        
        // Create mask container
        const maskContainer = document.createElement('div');
        maskContainer.className = 'proper-mask-reveal';
        maskContainer.style.cssText = `
          width: 0px;
          height: ${originalHeight}px;
          overflow: hidden;
          display: block;
          position: relative;
          margin: 0;
          padding: 0;
          line-height: 0;
        `;
        
        // Insert mask and move element
        parent.insertBefore(maskContainer, element);
        maskContainer.appendChild(element);
        
        // Keep element at original size - NO SCALING
        element.style.cssText = `
          width: ${originalWidth}px !important;
          height: ${originalHeight}px !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        
        element.dataset.maskSetup = 'true';
        
        // Animate mask reveal
        window.gsap.to(maskContainer, {
          width: originalWidth + 'px',
          duration: 1.2,
          ease: "power2.out",
          delay: index * 0.1,
          onStart: () => console.log(`🎭 Mask reveal ${index + 1} started`),
          onComplete: () => console.log(`✅ Mask reveal ${index + 1} complete`)
        });
      });
    }

    // Create a single timeline for better performance
    const tl = window.gsap.timeline();

    // Media elements - immediate loading for visible/masked images (with conflict protection)
    if (mediaEls.length) {
      console.log(`📊 Found ${mediaEls.length} media elements for immediate/scroll animation`);
      
      mediaEls.forEach((el, i) => {
        // Skip if already handled by GSAP stagger system
        if (el.dataset.gsapAnimated) {
          console.log(`⏭️ Skipping media element ${i + 1} - already handled by stagger system`);
          return;
        }
        
        // CRITICAL: Skip images inside reveal containers - they should be visible for mask effect
        if (el.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed')) {
          console.log(`🎭 Skipping media element ${i + 1} - inside reveal container (mask effect)`);
          // Ensure these images are visible for the mask reveal effect
          window.gsap.set(el, { opacity: 1 });
          el.dataset.gsapAnimated = 'reveal-container';
          return;
        }
        
        // Check if image is in viewport (visible immediately - like masked images)
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport) {
          // Immediate animation for visible images (masked images, hero images, etc.)
          console.log(`🎭 Immediate animation for visible media element ${i + 1}`);
          window.gsap.set(el, { opacity: 0 });
          window.gsap.to(el, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2 + (i * 0.1), // Small stagger for multiple visible images
            onComplete: () => {
              el.dataset.gsapAnimated = 'completed';
            }
          });
        } else {
          // Scroll trigger for off-screen images
          window.gsap.set(el, { opacity: 0 });
          window.gsap.to(el, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=200",
              toggleActions: "play none none none",
              once: true,
              onEnter: () => {
                console.log(`🎬 Media element ${i + 1} animated via scroll trigger`);
                el.dataset.gsapAnimated = 'completed';
              }
            }
          });
        }
      });
    }

    // Large headings - keep the nice stagger
    if (largeHeadings.length) {
      largeHeadings.forEach(h => {
        tl.to(wrapLines(h), { y: 0, opacity: 1, duration: 1.1, stagger: 0.2, ease: "power2.out" }, 0);
      });
    }

    // Regular headings (h1, h2, h3) - stagger animation
    if (regularHeadings.length) {
      console.log(`📋 Found ${regularHeadings.length} regular headings for stagger animation`);
      window.gsap.set(regularHeadings, { opacity: 0, y: 25 });
      tl.to(regularHeadings, { 
        opacity: 1, 
        y: 0, 
        duration: 0.9, 
        stagger: 0.08, // 0.08s between each heading
        ease: "power2.out" 
      }, 0.2); // Start after 0.2s
    }

    // Small headings - stagger animation  
    if (smallHeadings.length) {
      console.log(`🔤 Found ${smallHeadings.length} small headings for stagger animation`);
      window.gsap.set(smallHeadings, { opacity: 0, y: 20 });
      tl.to(smallHeadings, { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.1, // 0.1s between each heading
        ease: "power2.out" 
      }, 0.3); // Start after 0.3s
    }

    // Paragraphs - stagger animation
    if (paragraphs.length) {
      console.log(`📝 Found ${paragraphs.length} paragraphs for stagger animation`);
      window.gsap.set(paragraphs, { opacity: 0, y: 15 });
      tl.to(paragraphs, { 
        opacity: 1, 
        y: 0, 
        duration: 0.7, 
        stagger: 0.06, // 0.06s between each paragraph
        ease: "power2.out" 
      }, 0.4); // Start after 0.4s
    }

    // Links - stagger animation
    if (links.length) {
      console.log(`🔗 Found ${links.length} links for stagger animation`);
      window.gsap.set(links, { opacity: 0, y: 10 });
      tl.to(links, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.04, // 0.04s between each link
        ease: "power2.out" 
      }, 0.5); // Start after 0.5s
    }

    // Slide elements - subtle but noticeable stagger
    if (slideEls.length) {
      window.gsap.set(slideEls, { x: 40, opacity: 0 });
      tl.to(slideEls, { x: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power2.out" }, 0.6);
    }

    // Other UI elements - simple stagger for nav, cards, etc.
    if (otherEls.length) {
      console.log(`🎛️ Found ${otherEls.length} other UI elements for stagger animation`);
      window.gsap.set(otherEls, { opacity: 0, y: 10 });
      tl.to(otherEls, { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.08, // 0.08s between each element
        ease: "power2.out" 
      }, 0.7); // Start after 0.7s
    }

    // Setup infinite scroll after everything is ready
    setTimeout(() => {
      setupInfiniteScroll();
    }, 1000);
  }

  // CodePen-style infinite scroll implementation
  function setupInfiniteScroll() {
    if (!observerLoaded || typeof Observer === 'undefined') {
      console.log('⚠️ Observer not available for infinite scroll');
      return;
    }

    console.log('🔄 Setting up CodePen-style infinite scroll...');
    
    // Target ONLY the specific container - be very specific
    const container = document.querySelector('.flex-grid');
    
    if (!container) {
      console.log('⚠️ No .flex-grid container found');
      return;
    }

    console.log('✅ Found flex-grid container for infinite scroll');
    
    // Get items using GSAP utils like the CodePen
    const items = gsap.utils.toArray(container.children);
    const wraps = [];

    if (items.length === 0) {
      console.log('⚠️ No items found in container');
      return;
    }

    console.log(`🎯 Found ${items.length} items for infinite scroll`);

    // Setup wraps function with 1vw gap between repeats
    function setupWraps() {
      const containerRect = container.getBoundingClientRect();
      const gapSize = window.innerWidth * 0.01; // 1vw in pixels

      for (let i = 0; i < items.length; i++) {
        const itemRect = items[i].getBoundingClientRect();
        const min = containerRect.top - itemRect.bottom - gapSize;
        const max = containerRect.bottom - itemRect.bottom + gapSize;
        const wrap = gsap.utils.wrap(min, max);

        wraps.push(wrap);
      }
      
      console.log('✅ Wraps setup complete with 1vw gap');
    }

    setupWraps();

    // Register Observer and ScrollTrigger
    gsap.registerPlugin(Observer, ScrollTrigger);

    // Create Observer exactly like CodePen
    Observer.create({
      preventDefault: true,
      target: container,
             onPress: ({ target }) => {
         // No cursor change
       },
       onRelease: ({ target }) => {
         // No cursor change
       },
      onChange: ({ deltaY, isDragging, event }) => {
        const d = event.type === "wheel" ? -deltaY : deltaY;
        const y = isDragging ? d * 5 : d * 10;

        for (let i = 0; i < items.length; i++) {
          gsap.to(items[i], {
            duration: 1,
            ease: "power2.out",
            y: `+=${y}`,
            modifiers: {
              y: gsap.utils.unitize(wraps[i])
            }
          });
        }
      }
    });

         // Add minimal container styles - ONLY affect this specific container
     container.style.cssText += `
       overflow: hidden;
       user-select: none;
       touch-action: none;
     `;

    console.log('✅ CodePen-style infinite scroll setup complete');
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