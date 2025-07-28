// Version 1.8.4 - IMG-PARALLAX SCALING: Added smooth scale animation (1.2 → 1.0) for .img-parallax elements during mask reveals
// REQUIRED: Add this script tag to your Webflow site BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
console.log('🔥 animations.js v1.8.4 - IMG-PARALLAX SCALING: Added smooth scale animation (1.2 → 1.0) for .img-parallax elements during mask reveals loading...');
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
    
    console.log('🎬 *** STARTING initGSAPStagger() - THIS MIGHT BE OVERRIDING EVERYTHING ***');
    
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
        console.log('🙈 Setting all images to opacity 0 for smooth loading');
        allImages.forEach(img => {
          // Skip images inside reveal containers - they need to be visible for mask effect AND load early
          if (img.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed')) {
            console.log('🎭 Reveal container image - setting visible and preloading');
            gsap.set(img, { opacity: 1 });
            img.dataset.gsapAnimated = 'reveal-container';
            // Ensure reveal images are fully loaded early
            if (img.loading !== 'eager') {
              img.loading = 'eager';
            }
            return;
          }
          
          // CRITICAL: Skip images inside infinite scroll containers
          if (img.closest('.flex-grid, .container.video-wrap-hide')) {
            console.log('🔄 Skipping image in infinite scroll container:', img.src?.substring(0, 50));
            gsap.set(img, { opacity: 1 });
            img.dataset.gsapAnimated = 'infinite-scroll';
            // Ensure infinite scroll images load eagerly too
            if (img.loading !== 'eager') {
              img.loading = 'eager';
            }
            return;
          }
          
          // Only set opacity if not already animated to prevent conflicts
          if (!img.dataset.gsapAnimated) {
            gsap.set(img, { opacity: 0, y: 20 }); // Add initial Y position for smooth movement
            img.dataset.gsapAnimated = 'initializing';
          }
        });
      
      // Wait for images to load, then implement stagger system
      if (typeof imagesLoaded === 'function') {
        console.log('📦 Using imagesLoaded library');
        imagesLoaded(document.body, function() {
          console.log('✅ Images loaded, setting up stagger system');
          
          // Find images in viewport (above the fold) - excluding reveal container and infinite scroll images
          const viewportImages = Array.from(allImages).filter(img => {
            // Skip reveal container images
            if (img.dataset.gsapAnimated === 'reveal-container') {
              return false;
            }
            
            // Skip infinite scroll images
            if (img.dataset.gsapAnimated === 'infinite-scroll') {
              return false;
            }
            
            const rect = img.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
            console.log(`🎯 Image viewport check: top=${rect.top}, bottom=${rect.bottom}, inViewport=${inViewport}`);
            return inViewport;
          });
          
          console.log(`🎯 Found ${viewportImages.length} viewport images for immediate stagger`);
          
                    // Immediate smooth stagger for viewport images
          if (viewportImages.length > 0) {
            console.log('🎬 Starting smooth viewport image stagger...');
            // Set initial state with subtle Y position
            gsap.set(viewportImages, { y: 20 });
            gsap.to(viewportImages, {
              opacity: 1,
              y: 0,
              duration: 1.2, // Longer duration for smoother effect
              stagger: 0.3, // Reduced stagger for smoother flow
              ease: "power2.out",
              onStart: () => console.log('✨ Smooth viewport stagger started'),
              onComplete: () => {
                console.log('✅ Smooth viewport stagger complete');
                // Mark as completed to prevent re-animation
                viewportImages.forEach(img => img.dataset.gsapAnimated = 'completed');
              }
            });
          } else {
            console.log('⚠️ No viewport images found for stagger');
          }
          
          // ScrollTrigger batch for images outside viewport - excluding reveal container and infinite scroll images
          const remainingImages = Array.from(allImages).filter(img => {
            // Skip reveal container images
            if (img.dataset.gsapAnimated === 'reveal-container') {
              return false;
            }
            
            // Skip infinite scroll images
            if (img.dataset.gsapAnimated === 'infinite-scroll') {
              return false;
            }
            
            const rect = img.getBoundingClientRect();
            return !(rect.top < window.innerHeight && rect.bottom > 0);
          });
          
                console.log(`📜 Setting up scroll triggers for ${remainingImages.length} remaining images`);
      console.log('🔍 DEBUGGING: Remaining images for GSAP stagger:', remainingImages.map(img => ({
        src: img.src?.substring(0, 50) + '...',
        classes: img.className,
        gsapAnimated: img.dataset.gsapAnimated
      })));
      
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
                start: "top bottom", // Trigger when top of image hits bottom of viewport
                onEnter: () => {
                  // Double-check to prevent duplicate animations
                  if (img.dataset.gsapAnimated === 'completed') return;
                  
                  console.log(`✨ Image fade triggered when top hits bottom of viewport: ${index + 1}`);
                  img.dataset.gsapAnimated = 'animating';
                  
                  // Set eager loading
                  if (img.loading !== 'eager') {
                    img.loading = 'eager';
                  }
                  
                  gsap.set(img, { y: 30 }); // Add subtle Y movement
                  gsap.to(img, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2, // Longer duration for smoother effect
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
          // DISABLED: initGSAPStagger(); // This was conflicting with startAnims text animations
          console.log('🚫 GSAP Stagger disabled to prevent conflicts with text animations');
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
      
      /* Fix margin spacing for video container in infinite scroll */
      .container.video-wrap-hide.huge.narrow {
        margin-top: 0 !important;
      }
      
      /* Add 0.5vw gap at top of page for infinite scroll */
      .flex-grid {
        margin-top: 0.2vw !important;
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

        // Complete preloader when we have enough images for smooth infinite scroll
        const minImagesForSmooth = Math.min(40, Math.ceil(totalImages * 0.8)); // At least 40 images or 80% of total
        if (loadedCount >= minImagesForSmooth) {
          console.log(`✅ Enough images loaded for smooth scroll: ${loadedCount}/${totalImages}`);
          setTimeout(completePreloader, 200);
        }
      });
      
      // Fallback: Complete when all images are loaded (if we haven't hit the threshold)
      imgLoad.on('always', function() {
        if (!preloaderComplete) {
          console.log('✅ All images loaded!');
          setTimeout(completePreloader, 200);
        }
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
    
    // Create time counter
    createTimeCounter();
    
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
      
      // PRESERVE ORIGINAL HTML: Use innerHTML to keep line breaks and formatting
      const originalHTML = link.innerHTML.trim();
      const hasLineBreaks = originalHTML.includes('<br>') || originalHTML.includes('\n') || link.offsetHeight > 25;
      
      // Store original dimensions
      const rect = link.getBoundingClientRect();
      const height = rect.height;
      
      if (hasLineBreaks) {
        console.log('🔗 Multi-line link detected, preserving natural flow:', originalHTML);
        
        // For multi-line elements, don't set fixed heights - let text flow naturally
        Object.assign(link.style, {
          position: 'relative',
          overflow: 'hidden',
          display: 'block' // Use block for multi-line text
        });
        
        link.innerHTML = `
          <span class="link-text-1" style="display: block; position: relative; opacity: 1;">${originalHTML}</span>
          <span class="link-text-2" style="display: block; position: absolute; width: 100%; left: 0; top: 0; opacity: 0;">${originalHTML}</span>
        `;
      } else {
        // For single-line elements, use the original approach
        const text = link.textContent.trim();
        
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
      }
      
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
    if (el.dataset.splitDone) return el.querySelectorAll('.line-inner');

    // Preserve the original HTML content
    const originalHTML = el.innerHTML.trim();
    if (!originalHTML) return [];

    console.log(`🔤 Preserving original HTML for: "${el.textContent?.trim()?.substring(0, 50)}"`);

    // For elements that already have line breaks (<br> tags), split on those
    if (originalHTML.includes('<br>')) {
      const lines = originalHTML.split(/<br\s*\/?>/i);
      el.innerHTML = '';
      
      lines.forEach((lineHTML, index) => {
        if (lineHTML.trim()) {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'split-line';
          lineDiv.style.overflow = 'hidden';

          const lineInner = document.createElement('div');
          lineInner.className = 'line-inner';
          lineInner.style.transform = 'translateY(100%)';
          lineInner.style.opacity = '0';
          lineInner.innerHTML = lineHTML.trim();

          lineDiv.appendChild(lineInner);
          el.appendChild(lineDiv);
        }
      });
    } else {
      // For single-line content, wrap the entire thing
      const lineDiv = document.createElement('div');
      lineDiv.className = 'split-line';
      lineDiv.style.overflow = 'hidden';

      const lineInner = document.createElement('div');
      lineInner.className = 'line-inner';
      lineInner.style.transform = 'translateY(100%)';
      lineInner.style.opacity = '0';
      lineInner.innerHTML = originalHTML;

      lineDiv.appendChild(lineInner);
      el.innerHTML = '';
      el.appendChild(lineDiv);
    }

    el.dataset.splitDone = 'true';
    const lineInners = el.querySelectorAll('.line-inner');
    console.log(`🔤 Created ${lineInners.length} lines while preserving original HTML.`);
    return lineInners;
  }

  function startAnims() {
    console.log('🚀 STARTING startAnims() function');
    
    // Get all elements upfront - organized for proper stagger animations
    const largeHeadings = document.querySelectorAll('.heading.large');
    const smallHeadings = document.querySelectorAll('.heading.small');
    const regularHeadings = document.querySelectorAll('h1:not(.heading.large):not(.heading.small), h2:not(.heading.large):not(.heading.small), h3:not(.heading.large):not(.heading.small), h4, h5, h6');
    const paragraphs = document.querySelectorAll('p');
    const links = document.querySelectorAll('a:not(.nav a):not(.fake-nav a)');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img, video');
    const otherEls = document.querySelectorAll('.nav, .preloader-counter, .card-project, .top-right-nav,.fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    console.log('🔍 ELEMENT COUNTS:');
    console.log(`📝 Media elements (img, video): ${mediaEls.length}`);
    console.log(`🖼️ All images in DOM: ${document.querySelectorAll('img').length}`);
    console.log(`🎬 Videos in DOM: ${document.querySelectorAll('video').length}`);

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
        
        // Check if element has img-parallax class for scaling effect
        const hasParallax = element.classList.contains('img-parallax');
        if (hasParallax) {
          console.log(`🎚️ Setting up parallax scaling for element ${index + 1}`);
          // Set initial scale to 1.2 for parallax effect
          window.gsap.set(element, { scale: 1.2 });
        }
        
        // Animate mask reveal
        window.gsap.to(maskContainer, {
          width: originalWidth + 'px',
          duration: 1.2,
          ease: "power2.out",
          delay: index * 0.1,
          onStart: () => console.log(`🎭 Mask reveal ${index + 1} started`),
          onComplete: () => console.log(`✅ Mask reveal ${index + 1} complete`)
        });
        
        // Animate parallax scaling if element has img-parallax class
        if (hasParallax) {
          window.gsap.to(element, {
            scale: 1.0,
            duration: 1.5, // 1.5s duration as requested
            ease: "power2.out",
            delay: index * 0.1, // Same delay as mask reveal for coordination
            onStart: () => console.log(`🎚️ Parallax scale ${index + 1} started (1.2 → 1.0)`),
            onComplete: () => console.log(`✅ Parallax scale ${index + 1} complete`)
          });
        }
      });
    }

    // Create a single timeline for better performance
    const tl = window.gsap.timeline();

    // Media elements - SMOOTH CODEPEN-STYLE FADE-IN (no abrupt loading)
    if (mediaEls.length) {
      console.log(`📊 Found ${mediaEls.length} media elements for smooth fade-in animation`);
      console.log('🔍 DEBUGGING: Media elements found:', Array.from(mediaEls).map(el => ({
        tag: el.tagName,
        src: el.src?.substring(0, 50) + '...',
        classes: el.className,
        closest_reveal: !!el.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed'),
        closest_infinite: !!el.closest('.flex-grid, .container.video-wrap-hide'),
        gsapAnimated: el.dataset.gsapAnimated
      })));
      
      mediaEls.forEach((el, i) => {
        // Skip if already handled by GSAP stagger system
        if (el.dataset.gsapAnimated) {
          console.log(`⏭️ Skipping media element ${i + 1} - already handled by stagger system:`, el.dataset.gsapAnimated, el.src?.substring(0, 50));
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
        
        // Skip images inside infinite scroll containers
        if (el.closest('.flex-grid, .container.video-wrap-hide')) {
          console.log(`🔄 Skipping media element ${i + 1} - inside infinite scroll container`);
          window.gsap.set(el, { opacity: 1 });
          el.dataset.gsapAnimated = 'infinite-scroll';
          return;
        }
        
        console.log(`🎯 Processing media element ${i + 1}:`, el.tagName, el.src?.substring(0, 50), 'classes:', el.className);
        
        // Check if image is in viewport (visible immediately)
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport) {
          // Immediate smooth animation for visible images
          console.log(`🎭 Immediate smooth fade for visible media element ${i + 1}`);
          window.gsap.set(el, { opacity: 0, y: 30 });
          window.gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.2 + (i * 0.1),
            onComplete: () => {
              el.dataset.gsapAnimated = 'completed';
            }
          });
                  } else {
            // SMOOTH CODEPEN-STYLE scroll trigger for off-screen images
            console.log(`🎬 Setting up early scroll fade for media element ${i + 1}:`, el.src?.substring(0, 50), 'classes:', el.className);
            window.gsap.set(el, { opacity: 0, y: 40 });
            
            // Set eager loading for early loading
            if (el.loading !== 'eager') {
              el.loading = 'eager';
            }
            
            window.gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 1.5, // Longer duration for smoother effect
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top bottom", // Trigger when top of element hits bottom of viewport
                end: "top center",
                toggleActions: "play none none reverse",
                once: true,
                onEnter: () => {
                  console.log(`✨ Media element fade triggered when top hits bottom of viewport: ${i + 1}:`, el.src?.substring(0, 50));
                  el.dataset.gsapAnimated = 'animating';
                },
                onComplete: () => {
                  el.dataset.gsapAnimated = 'completed';
                }
              }
            });
          }
      });
    }

    // Large headings - line-by-line stagger
    if (largeHeadings.length) {
      console.log(`📝 Processing ${largeHeadings.length} large headings for line-by-line stagger`);
      largeHeadings.forEach((h, index) => {
        console.log(`📝 Large heading ${index + 1}: "${h.textContent?.trim()?.substring(0, 30)}"`);
        const lines = wrapLines(h);
        if (lines.length > 0) {
          tl.to(lines, { 
            y: 0, 
            opacity: 1, 
            duration: 1.1, 
            stagger: 0.2, 
            ease: "power2.out" 
          }, 0.1 + (index * 0.1));
        }
      });
    }

    // Regular headings (h1, h2, h3, h4, h5, h6) - line-by-line stagger
    if (regularHeadings.length) {
      console.log(`📋 Found ${regularHeadings.length} regular headings for line-by-line stagger`);
      regularHeadings.forEach((heading, index) => {
        // Skip elements that have hover effects (links)
        if (heading.classList.contains('link') || heading.dataset.hoverInit) {
          console.log(`📋 Skipping heading ${index + 1} - has hover effects`);
          return;
        }
        
        console.log(`📋 Processing regular heading ${index + 1}: "${heading.textContent?.trim()?.substring(0, 30)}"`);
        const lines = wrapLines(heading);
        if (lines.length > 0) {
          tl.to(lines, { 
            y: 0, 
            opacity: 1, 
            duration: 1.0, 
            stagger: 0.15,
            ease: "power2.out" 
          }, 0.2 + (index * 0.1));
        }
      });
    }

    // Small headings - line-by-line stagger with hover coordination
    if (smallHeadings.length) {
      console.log(`🔤 Found ${smallHeadings.length} small headings for line-by-line stagger`);
      
      smallHeadings.forEach((heading, index) => {
        // Check if this element has been processed by hover system
        const linkText1 = heading.querySelector('.link-text-1');
        const linkText2 = heading.querySelector('.link-text-2');
        
        if (linkText1 && linkText2) {
          // Element has hover structure - animate the visible .link-text-1 span
          console.log(`🔗 Animating hover-processed small heading ${index + 1}`);
          const lines = wrapLines(linkText1);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 20 });
            tl.to(lines, { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out" 
            }, 0.3 + (index * 0.1));
          }
        } else {
          // Element doesn't have hover structure - animate normally
          console.log(`📝 Animating normal small heading ${index + 1}`);
          const lines = wrapLines(heading);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 20 });
            tl.to(lines, { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out" 
            }, 0.3 + (index * 0.1));
          }
        }
      });
    }

    // Paragraphs - line-by-line stagger
    if (paragraphs.length) {
      console.log(`📝 Found ${paragraphs.length} paragraphs for line-by-line stagger`);
      paragraphs.forEach((paragraph, index) => {
        // Skip elements that have hover effects (links)
        if (paragraph.classList.contains('link') || paragraph.dataset.hoverInit) {
          console.log(`📝 Skipping paragraph ${index + 1} - has hover effects`);
          return;
        }
        
        console.log(`📝 Processing paragraph ${index + 1}: "${paragraph.textContent?.trim()?.substring(0, 30)}"`);
        const lines = wrapLines(paragraph);
        if (lines.length > 0) {
          tl.to(lines, { 
            y: 0, 
            opacity: 1, 
            duration: 0.9, 
            stagger: 0.12,
            ease: "power2.out" 
          }, 0.4 + (index * 0.08));
        }
      });
    }

    // Links - line-by-line stagger with hover coordination
    if (links.length) {
      console.log(`🔗 Found ${links.length} links for line-by-line stagger`);
      
      links.forEach((link, index) => {
        // Check if this element has been processed by hover system
        const linkText1 = link.querySelector('.link-text-1');
        const linkText2 = link.querySelector('.link-text-2');
        
        if (linkText1 && linkText2) {
          // Element has hover structure - animate the visible .link-text-1 span
          console.log(`🔗 Animating hover-processed link ${index + 1}`);
          const lines = wrapLines(linkText1);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 10 });
            tl.to(lines, { 
              opacity: 1, 
              y: 0, 
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out" 
            }, 0.5 + (index * 0.04));
          }
        } else {
          // Element doesn't have hover structure - animate normally
          console.log(`📝 Animating normal link ${index + 1}`);
          const lines = wrapLines(link);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 10 });
            tl.to(lines, { 
              opacity: 1, 
              y: 0, 
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out" 
            }, 0.5 + (index * 0.04));
          }
        }
      });
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

    // Setup infinite scroll FIRST to mark images before stagger system processes them
    setupInfiniteScroll();
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

    // Setup wraps function with 0.5vw gap between repeats
    function setupWraps() {
      const containerRect = container.getBoundingClientRect();
      const gapSize = window.innerWidth * 0.005; // 0.5vw in pixels

      for (let i = 0; i < items.length; i++) {
        const itemRect = items[i].getBoundingClientRect();
        const min = containerRect.top - itemRect.bottom - gapSize;
        const max = containerRect.bottom - itemRect.bottom + gapSize;
        const wrap = gsap.utils.wrap(min, max);

        wraps.push(wrap);
      }
      
      console.log('✅ Wraps setup complete with 0.5vw gap');
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

    // Ensure images in infinite scroll are visible and marked (no fade conflicts)
    const scrollImages = container.querySelectorAll('img, video');
    scrollImages.forEach(img => {
      gsap.set(img, { opacity: 1 });
      img.dataset.gsapAnimated = 'infinite-scroll'; // Mark to prevent other systems from processing
    });

    console.log('✅ CodePen-style infinite scroll setup complete');
  }

  function initLenis() {
    if (lenis || typeof window.Lenis === 'undefined') return;
    
    // Detect mobile devices including Safari mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768 ||
                     /Safari/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent) ||
                     'ontouchstart' in window ||
                     navigator.maxTouchPoints > 0;
    
    // Additional Safari mobile check
    const isSafariMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
    
    if (isMobile || isSafariMobile) {
      console.log('📱 Mobile device or Safari mobile detected - Lenis disabled for native scroll behavior');
      return;
    }
    
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

      // Add recommended CSS for better iOS support + infinite scroll exclusion
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
        
        /* Prevent Lenis from interfering with infinite scroll container */
        .flex-grid {
          overscroll-behavior: none;
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
      
      // Add data-lenis-prevent to infinite scroll container to exclude it from Lenis
      const infiniteScrollContainer = document.querySelector('.flex-grid');
      if (infiniteScrollContainer) {
        infiniteScrollContainer.setAttribute('data-lenis-prevent', 'true');
        console.log('✅ Infinite scroll container excluded from Lenis');
      }

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
      
      console.log(`💻 Lenis initialized on desktop (iOS: ${isIOS}) with infinite scroll exclusion`);
    } catch (e) { 
      console.error('Lenis error:', e);
      // Fallback to native scroll
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }

  function addHidden() {
    console.log('🙈 Setting initial hidden states for animations...');
    
    // Hide text elements that will be animated
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a:not(.nav a):not(.fake-nav a)').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        // Set initial opacity to 0 for text elements that will be animated
        el.style.opacity = '0';
      }
    });
    
    // Handle other elements
    document.querySelectorAll('img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        if (el.matches('.grid-down.project-down.mobile-down')) {
          el.style.transform = 'translateX(40px)';
          el.style.opacity = '0';
        }
      }
    });
    
    console.log('✅ Initial hidden states applied');
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

  // Create time counter
  function createTimeCounter() {
    console.log('⏱️ Creating time counter...');
    
    const counter = document.createElement('div');
    counter.id = 'time-counter';
    counter.textContent = '00:00';
    
    // Add styles
    counter.style.cssText = `
      position: fixed;
      bottom: 1vw;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
      font-size: 0.8vw;
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      letter-spacing: 0.1em;
      opacity: 0.8;
    `;
    
    document.body.appendChild(counter);
    
    // Apply GSAP line animation like other text
    const lines = wrapLines(counter);
    if (lines.length > 0) {
      window.gsap.set(lines, { opacity: 0, y: 20 });
      window.gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.0 // Delay so it appears after other elements
      });
    }
    
    // Start the timer
    let startTime = Date.now();
    
    function updateCounter() {
      const elapsed = Date.now() - startTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      const timeString = 
        String(minutes).padStart(2, '0') + ':' +
        String(seconds).padStart(2, '0');
      
      // Update the content inside the line wrapper
      const lineInner = counter.querySelector('.line-inner');
      if (lineInner) {
        lineInner.textContent = timeString;
      } else {
        counter.textContent = timeString;
      }
    }
    
    // Update every second
    setInterval(updateCounter, 1000);
    updateCounter(); // Initial update
    
    console.log('✅ Time counter created with GSAP animation');
    return counter;
  }

  // Initialize
  addHidden();
  initLenis();

  function init() {
    if (isInit) {
      console.log('⚠️ Animations already initialized, skipping to prevent conflicts');
      return;
    }
    
    console.log('Starting main animations...');
    
    // Wait for GSAP to be available before starting animations
    function waitForGSAP() {
      if (typeof window.gsap !== 'undefined') {
        console.log('✅ GSAP is available, starting text animations');
        requestAnimationFrame(() => {
          startAnims();
          isInit = true;
        });
      } else {
        console.log('⏳ Waiting for GSAP to load...');
        setTimeout(waitForGSAP, 100);
      }
    }
    
    waitForGSAP();
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