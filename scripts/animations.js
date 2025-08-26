// Version 2.6: Revert to working custom scramble, ensure counter is included
// REQUIRED: Add these script tags BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
// GSAP, ScrollTrigger, and Observer are loaded dynamically

// Hide images but allow preloader
(function() {
  const emergencyHide = document.createElement('style');
  emergencyHide.id = 'emergency-image-hide';
  emergencyHide.textContent = `
    img:not(#preloader img), video { opacity: 0 !important; }
  `;
  (document.head || document.documentElement).appendChild(emergencyHide);
})();

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, preloaderComplete = false, gsapLoaded = false, scrollTriggerLoaded = false, observerLoaded = false, threejsLoaded = false;

  // Remove the initial hide style when animations start
  const initialHideStyle = document.querySelector('style');

  // Global error handler with Webflow safety
  window.addEventListener('error', e => {
    // Don't interfere with Webflow's error handling
    if (e.filename && e.filename.includes('webflow')) {
      console.warn('Webflow script error detected, not interfering:', e.message);
      return;
    }
    console.error('Global JavaScript error:', e.error);
  });

  // Load GSAP scripts sequentially with error handling
  function loadGSAPScript(src, callback) {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log('Script already loaded:', src);
      callback && callback();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src; 
    script.onload = () => {
      console.log('Successfully loaded:', src);
      callback && callback();
    };
    script.onerror = (e) => {
      console.error('Failed to load GSAP script:', src, e);
      // Don't let GSAP loading errors break Webflow
    };
    document.head.appendChild(script);
  }

  // Load all GSAP dependencies
  function loadGSAP() {
    loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', () => {
      gsapLoaded = true;
      console.log('✅ GSAP loaded');
              loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', () => {
          scrollTriggerLoaded = true;
          console.log('✅ ScrollTrigger script loaded');
          // Wait a moment for ScrollTrigger to initialize, then register
          setTimeout(() => {
            if (window.gsap && window.gsap.registerPlugin) {
              try {
                window.gsap.registerPlugin(window.gsap.ScrollTrigger || ScrollTrigger);
                console.log('✅ ScrollTrigger registered successfully');
                console.log('📊 Available ScrollTrigger:', !!window.gsap.ScrollTrigger);
              } catch (e) {
                console.error('❌ ScrollTrigger registration failed:', e);
              }
            }
          }, 100);
          loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Observer.min.js', () => {
            observerLoaded = true;
            console.log('✅ Observer loaded');
          });
        });
    });
  }

  // Three.js loading disabled

  // Create animated preloader
  function createPreloader() {
    const style = document.createElement('style');
    style.textContent = `
      #preloader{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.5s ease-out}
      #preloader.visible{opacity:1}
      #preloader .counter{font-family:monospace;font-size:0.8rem;color:white;text-align:center;letter-spacing:0.1em;display:inline-block}
      #preloader .digit{display:inline-block;opacity:0}
      body.loading{overflow:hidden}
      body.loading *:not(#preloader):not(#preloader *):not(.nav):not(.nav *):not(.fake-nav):not(.fake-nav *):not([data-mask-setup]):not(.proper-mask-reveal):not(.proper-mask-reveal *){opacity:0!important;visibility:hidden!important}
      body.animations-ready *:not(#preloader):not(#preloader *):not(.nav):not(.nav *):not(.fake-nav):not(.fake-nav *):not([data-mask-setup]):not(.proper-mask-reveal):not(.proper-mask-reveal *){opacity:0!important;visibility:hidden!important}

      .nav:not(.fake-nav){transform:translateY(100%);opacity:0}
      .flex-grid{margin-top:0.2vw!important}
    `;
    document.head.appendChild(style);

    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = '<div class="counter"><span class="digit">0</span><span class="digit">0</span><span class="digit">1</span></div>';
    document.body.appendChild(preloader);
    document.body.classList.add('loading');
    
    // GSAP stagger animation for counter appearance
    requestAnimationFrame(() => {
      preloader.classList.add('visible');
      
      // Animate counter digits with stagger
      if (typeof gsap !== 'undefined') {
        const digits = preloader.querySelectorAll('.digit');
        gsap.set(digits, { opacity: 0, y: 20 });
        gsap.to(digits, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3
        });
      }
    });
    return preloader;
  }

  // Initialize preloader with image loading tracking
  function initPreloader() {
    loadGSAP();
    const preloader = createPreloader();
    const counter = preloader.querySelector('.counter');
    
    function updateCounter(progress) {
      const counterValue = Math.floor(progress);
      const counterString = counterValue.toString().padStart(3, '0');
      const digits = counter.querySelectorAll('.digit');
      
      // Update each digit individually
      for (let i = 0; i < 3; i++) {
        if (digits[i]) {
          digits[i].textContent = counterString[i];
        }
      }
    }
    
    if (typeof imagesLoaded === 'function') {
      const imgLoad = imagesLoaded(document.body, { background: true });
      let loadedCount = 0;
      const totalImages = imgLoad.images.length;
      
      if (totalImages === 0) {
        updateCounter(100);
        setTimeout(completePreloader, 300);
        return;
      }
      
      imgLoad.on('progress', () => {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        updateCounter(progress);
        if (loadedCount >= Math.min(40, Math.ceil(totalImages * 0.8))) setTimeout(completePreloader, 200);
      });
      
      imgLoad.on('always', () => {
        if (!preloaderComplete) {
          updateCounter(100);
          setTimeout(completePreloader, 200);
        }
      });
    } else {
      // Animate counter from 001 to 100 over 1.5 seconds
      let currentValue = 1;
      const interval = setInterval(() => {
        currentValue += 2;
        if (currentValue >= 100) {
          currentValue = 100;
          clearInterval(interval);
          setTimeout(completePreloader, 300);
        }
        updateCounter(currentValue);
      }, 30);
    }
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    const preloader = document.getElementById('preloader');
    
    // Ensure preloader COMPLETELY fades out before starting animations
    if (typeof gsap !== 'undefined') {
      gsap.to(preloader, { 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.out", 
        onComplete: () => { 
          preloader.remove(); 
          document.body.classList.remove('loading');
          document.body.classList.add('animations-ready');
          // Wait additional time after preloader is removed
          setTimeout(() => {
            startPageAnimations();
          }, 500);
        }
      });
    } else {
      setTimeout(() => { 
        preloader.style.opacity = '0'; 
        setTimeout(() => { 
          preloader.remove(); 
          document.body.classList.remove('loading');
          document.body.classList.add('animations-ready');
          setTimeout(() => {
            startPageAnimations();
          }, 1100);
        }, 300); 
      }, 200);
    }
  }

  // Start all page animations after preloader
  function startPageAnimations() {
    const bottomNav = document.querySelector('.nav:not(.fake-nav)');
    if (bottomNav) typeof gsap !== 'undefined' ? gsap.to(bottomNav, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }) : (bottomNav.style.transform = 'translateY(0)', bottomNav.style.opacity = '1');
    
    // Start text animations and other content immediately
    setTimeout(() => {
      console.log('🎬 Starting text animations from preloader completion');
      initTextAndOtherAnimations();
    }, 100);
    
    // Start masked image animations exactly 1s after preloader completion
    setTimeout(() => {
      console.log('🎭 Starting masked image animations 1s after preloader completion');
      startMaskedImageAnimations();
    }, 100); // Reduced delay for faster content display
  }


  // Initialize hover effects for links
  function initHover() {
    document.querySelectorAll('.link').forEach(link => {
      if (link.dataset.hoverInit) return;
      
      const originalHTML = link.innerHTML.trim();
      const hasLineBreaks = originalHTML.includes('<br>') || originalHTML.includes('\n') || link.offsetHeight > 25;
      const rect = link.getBoundingClientRect();
      const height = rect.height;
      
      if (hasLineBreaks) {
        Object.assign(link.style, { position: 'relative', overflow: 'hidden', display: 'block' });
        link.innerHTML = `<span class="link-text-1" style="display:block;position:relative;opacity:1">${originalHTML}</span><span class="link-text-2" style="display:block;position:absolute;width:100%;left:0;top:0;opacity:0">${originalHTML}</span>`;
      } else {
        const text = link.textContent.trim();
        Object.assign(link.style, { position: 'relative', overflow: 'hidden', display: 'inline-block', height: height + 'px', lineHeight: height + 'px' });
        link.innerHTML = `<span class="link-text-1" style="display:block;position:relative;height:${height}px;line-height:${height}px;opacity:1">${text}</span><span class="link-text-2" style="display:block;position:absolute;height:${height}px;line-height:${height}px;width:100%;left:0;top:50%;opacity:0">${text}</span>`;
      }
      
      const tl = window.gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power2.out" }});
      tl.to(link.querySelector('.link-text-1'), { yPercent: -50, opacity: 0 }).to(link.querySelector('.link-text-2'), { yPercent: -50, opacity: 1 }, 0.1);
      link.addEventListener('mouseenter', () => tl.timeScale(1).play());
      link.addEventListener('mouseleave', () => tl.timeScale(1).reverse());
      link.dataset.hoverInit = 'true';
    });
  }

  // Scramble text effect function
  function scrambleText(element, duration = 2000, delay = 0) {
    if (element.classList.contains('counter')) {
      console.log('🔢 scrambleText called for Webflow counter:', element, 'duration:', duration, 'delay:', delay);
    }
    if (element.dataset.scrambled || element.dataset.infiniteClone) return;
    element.dataset.scrambled = 'true';
    
    const originalText = element.textContent.trim();
    if (!originalText) return;
    
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let currentText = originalText;
    let iteration = 0;
    
    // Adjust reveal rate based on text length - shorter text reveals faster
    const textLength = originalText.length;
    const revealRate = Math.max(1 / 3, textLength / 50); // Faster for longer text
    const totalIterations = Math.floor(duration / 80);
    
    setTimeout(() => {
      // Start scramble immediately with element visible
      element.style.opacity = '1';
      
      const interval = setInterval(() => {
        currentText = originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        element.textContent = currentText;
        
        if (iteration >= originalText.length) {
          clearInterval(interval);
          element.textContent = originalText;
          
          // Start counter functionality after scramble completes
          if (element.classList.contains('counter')) {
            console.log('🔢 Scramble complete, starting counter');
            element.dataset.counterStarted = 'true';
            startTimeCounter(element);
          }
        }
        
        iteration += revealRate;
      }, 80);
    }, delay);
  }

  // Wrap text lines for animation (simplified for hover effects only)
  function wrapLines(el) {
    if (el.dataset.splitDone) return el.querySelectorAll('.line-inner');
    const originalHTML = el.innerHTML.trim();
    if (!originalHTML) return [];

    if (originalHTML.includes('<br>')) {
      const lines = originalHTML.split(/<br\s*\/?>/i);
      el.innerHTML = '';
      lines.forEach(lineHTML => {
        if (lineHTML.trim()) {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'split-line';
          lineDiv.style.overflow = 'hidden';
          const lineInner = document.createElement('div');
          lineInner.className = 'line-inner';
          lineInner.innerHTML = lineHTML.trim();
          lineDiv.appendChild(lineInner);
          el.appendChild(lineDiv);
        }
      });
    } else {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'split-line';
      lineDiv.style.overflow = 'hidden';
      const lineInner = document.createElement('div');
      lineInner.className = 'line-inner';
      lineInner.innerHTML = originalHTML;
      lineDiv.appendChild(lineInner);
      el.innerHTML = '';
      el.appendChild(lineDiv);
    }

    el.dataset.splitDone = 'true';
    return el.querySelectorAll('.line-inner');
  }

  // Text and other animations (non-masked content)
  function initTextAndOtherAnimations() {
    isInit = true;
    console.log('🎬 Initializing text animations...');
    
    // Remove the class that keeps content hidden and reset all element visibility
    document.body.classList.remove('animations-ready');
    
    // Don't remove image hiding here - wait for mask animations to start
    
    // Force reset visibility for all elements that were hidden
    if (typeof gsap !== 'undefined') {
      gsap.set('*:not(#preloader):not(#preloader *)', { clearProps: 'visibility,opacity' });
    }
    // Use existing Webflow counter element - will scramble first, then count
    const counterElement = document.querySelector('.counter');
    if (counterElement) {
      console.log('🔢 Found Webflow counter element:', counterElement);
      console.log('🔢 Counter classes:', counterElement.className);
      console.log('🔢 Counter matches .heading.small?', counterElement.matches('.heading.small'));
      // Set initial text for scrambling, counting will start after scramble
      counterElement.textContent = '0000';
    } else {
      console.log('❌ No .counter element found');
    }
    
    // Immediately make any existing cloned content visible (for mid-page loads)
    document.querySelectorAll('[data-infinite-clone="true"]').forEach(el => {
      // Skip the counter element to preserve its positioning
      //if (el.id === 'time-counter' || el.closest('#time-counter')) return;
      
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
      el.classList.remove('initial-hidden');
    });
    
    const largeHeadings = document.querySelectorAll('.heading.large:not([data-infinite-clone])');
    const smallHeadings = document.querySelectorAll('.heading.small:not([data-infinite-clone])');
    const regularHeadings = document.querySelectorAll('h1:not(.heading.large):not(.heading.small):not([data-infinite-clone]), h2:not(.heading.large):not(.heading.small):not([data-infinite-clone]), h3:not(.heading.large):not(.heading.small):not([data-infinite-clone]), h4:not([data-infinite-clone]), h5:not([data-infinite-clone]), h6:not([data-infinite-clone])');
    const paragraphs = document.querySelectorAll('p:not([data-infinite-clone]):not(.label-wrap p):not(.label-wrap .hover-text), .hover-text:not([data-infinite-clone]):not(.label-wrap .hover-text)');
    const links = document.querySelectorAll('a:not(.nav a):not(.fake-nav a):not([data-infinite-clone]), .menu-link:not([data-infinite-clone]), .menu-link.shimmer.accordion.chip-link:not([data-infinite-clone])');
    
    console.log('🔍 SmallHeadings found:', smallHeadings.length, [...smallHeadings].map(el => ({ tag: el.tagName, classes: el.className, text: el.textContent.substring(0, 20) })));
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img:not([data-infinite-clone]), video:not([data-infinite-clone])');
    const otherEls = document.querySelectorAll('.nav, .preloader-counter, .card-project, .top-right-nav,.fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    initHover();
    
    // Continue with all text animations, scrambles, and other content
    const tl = window.gsap.timeline();

    // Media elements - ONLY animate videos, skip ALL images (they use mask animations)
    if (mediaEls.length) {
      mediaEls.forEach((el, i) => {
        if (el.dataset.gsapAnimated) return;
        if (el.dataset.infiniteClone) { window.gsap.set(el, { opacity: 1 }); el.dataset.gsapAnimated = 'infinite-clone'; return; } // Skip cloned content
        
        // SKIP ALL IMAGES - they use mask animations only
        if (el.tagName.toLowerCase() === 'img') {
          window.gsap.set(el, { opacity: 1 });
          el.dataset.gsapAnimated = 'image-skipped';
          return;
        }
        
        // Only animate videos and other media
        if (el.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed')) { window.gsap.set(el, { opacity: 1 }); el.dataset.gsapAnimated = 'reveal-container'; return; }
        if (el.closest('.flex-grid, .container.video-wrap-hide')) { window.gsap.set(el, { opacity: 1 }); el.dataset.gsapAnimated = 'infinite-scroll'; return; }
        
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport) {
          window.gsap.set(el, { opacity: 0, y: 0 });
          window.gsap.to(el, { opacity: 1, y: 0, duration: 1.6, ease: "power2.out", delay: 0.18 + (i * 0.15), onComplete: () => el.dataset.gsapAnimated = 'completed' });
        } else {
          window.gsap.set(el, { opacity: 0, y: 0 });
          if (el.loading !== 'eager') el.loading = 'eager';
          window.gsap.to(el, { opacity: 1, y: 0, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top bottom", end: "top center", toggleActions: "play none none reverse", once: true, onEnter: () => el.dataset.gsapAnimated = 'animating', onComplete: () => el.dataset.gsapAnimated = 'completed' }});
        }
      });
    }

    // Scramble text animations (runs once on page load)
    let textElements = [];
    
    // Collect all text elements (excluding infinite scroll clones)
    largeHeadings.forEach(h => { if (!h.dataset.infiniteClone) textElements.push(h); });
    regularHeadings.forEach(h => { if (!h.classList.contains('link') && !h.dataset.hoverInit && !h.dataset.infiniteClone) textElements.push(h); });
    smallHeadings.forEach(h => { if (!h.dataset.infiniteClone) textElements.push(h); });
    paragraphs.forEach(p => { if (!p.classList.contains('link') && !p.dataset.hoverInit && !p.dataset.infiniteClone) textElements.push(p); });
    links.forEach(link => { if (!link.dataset.hoverInit && !link.dataset.infiniteClone) textElements.push(link); });
    
    // Force add counter if it wasn't picked up by selectors
    const counter = document.querySelector('.counter');
    if (counter) {
      if (!textElements.includes(counter)) {
        console.log('🔢 Force adding counter to textElements');
        textElements.push(counter);
      } else {
        console.log('🔢 Counter already in textElements');
      }
      console.log('🔢 Counter element found:', counter);
      console.log('🔢 Counter classes:', counter.className);
    } else {
      console.log('❌ No .counter element found in DOM');
    }
    
    // Apply scramble effect to all text elements with fallback safety
    console.log('🎯 Total text elements for scramble:', textElements.length);
    textElements.forEach((element, index) => {
      if (element.classList.contains('counter')) {
        console.log('🔢 Processing Webflow counter for scramble at index:', index, element);
      }
      // For hover elements, scramble the visible text span
      const linkText1 = element.querySelector('.link-text-1');
      if (linkText1) {
        linkText1.style.opacity = '0';
        scrambleText(linkText1, 100, 600 + (index * 100));
        // Safety fallback for hover elements
        setTimeout(() => {
          if (linkText1.style.opacity === '0') {
            linkText1.style.opacity = '1';
            console.log('🔧 Fallback: Made hover text visible');
          }
        }, 2000);
      } else {
        element.style.opacity = '0';
        scrambleText(element, 100, 600 + (index * 100));
        // Safety fallback for regular elements
        setTimeout(() => {
          if (element.style.opacity === '0') {
            element.style.opacity = '1';
            console.log('🔧 Fallback: Made element visible', element);
          }
        }, 2000);
      }
    });
    
    // Emergency fallback - ensure all text is visible after x seconds (excluding clones)
    setTimeout(() => {
      const hiddenElements = document.querySelectorAll('[style*="opacity: 0"]:not([data-infinite-clone]), .initial-hidden:not([data-infinite-clone])');
      if (hiddenElements.length > 0) {
        console.log('⚠️ Emergency fallback: Making all hidden text visible');
        hiddenElements.forEach(el => {
          if (!el.dataset.infiniteClone) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.remove('initial-hidden');
        }
      });
    }
    }, 2000);
    
    console.log(`🎯 Scramble effect applied to ${textElements.length} text elements`);
    
    // Fallback: ensure counter starts even if scramble doesn't trigger it
    setTimeout(() => {
      const fallbackCounter = document.querySelector('.counter');
      if (fallbackCounter && !fallbackCounter.dataset.counterStarted) {
        console.log('🔢 Fallback: Starting counter manually');
        fallbackCounter.dataset.counterStarted = 'true';
        startTimeCounter(fallbackCounter);
      }
    }, 3000);

    slideEls.length && (window.gsap.set(slideEls, { x: 40, opacity: 0 }), tl.to(slideEls, { x: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power2.out" }, 1.6));
    otherEls.length && (window.gsap.set(otherEls, { opacity: 0, y: 10 }), tl.to(otherEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 1.7));

    setupInfiniteScroll();
    
    // Three.js disabled due to infinite scroll conflicts
    console.log('🎨 Three.js effects disabled to preserve infinite scroll functionality');
  }
  
  // Masked image animations - called 1s after preloader completion
  function startMaskedImageAnimations() {
    typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && window.gsap.registerPlugin(window.gsap.ScrollTrigger);
    
    // NOW remove the emergency image hiding since mask animations are about to start
    const emergencyHide = document.getElementById('emergency-image-hide');
    if (emergencyHide) {
      emergencyHide.remove();
      console.log('🔧 Removed emergency image hiding for mask animations');
    }
    
    // Mobile-optimized mask reveal for images (exclude clones and preloader)
    const allImages = document.querySelectorAll('img:not(#preloader img):not([data-infinite-clone]), video:not([data-infinite-clone])');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (allImages.length) {
      // On mobile, only animate first 6 images immediately to reduce load
      const maxInitialImages = isMobile ? 6 : allImages.length;
      
      allImages.forEach((element, index) => {
        if (element.dataset.maskSetup) return;
        if (element.dataset.infiniteClone) return; // Skip cloned content
        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;
        
        if (originalWidth === 0 || originalHeight === 0) return;
        
        const parent = element.parentNode;
        const maskContainer = document.createElement('div');
        maskContainer.className = 'proper-mask-reveal';
        maskContainer.style.cssText = `width:0px;height:${originalHeight}px;overflow:hidden;display:block;position:relative;margin:0;padding:0;line-height:0`;
        
        parent.insertBefore(maskContainer, element);
        maskContainer.appendChild(element);
        element.style.cssText = `width:${originalWidth}px!important;height:${originalHeight}px!important;display:block!important;margin:0!important;padding:0!important;opacity:1!important`;
        element.dataset.maskSetup = 'true';
        
        // Force immediate opacity and clear any existing GSAP animations
        if (typeof window.gsap !== 'undefined') {
          window.gsap.set(element, { opacity: 1, clearProps: "opacity" });
        }
        element.style.setProperty('opacity', '1', 'important');
        console.log('🔧 Set mask image opacity to 1:', element);
        
        // Store the target width for animation
        maskContainer.dataset.targetWidth = originalWidth;
        
        const hasParallax = element.classList.contains('img-parallax');
        if (hasParallax) window.gsap.set(element, { scale: 1.2 });
        
        // Check if image is in viewport for immediate animation
        const rect = element.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport && index < maxInitialImages) {
          // Animate images in viewport immediately
          const staggerDelay = isMobile ? index * 0.3 : index * 0.3;
          const duration = isMobile ? 1.5 : 1.5;
          
          console.log(`🎭 Starting mask animation for image ${index}: width 0 → ${maskContainer.dataset.targetWidth}px`);
          window.gsap.to(maskContainer, { 
            width: maskContainer.dataset.targetWidth + 'px', 
            duration: duration, 
            ease: "power2.out", 
            delay: staggerDelay,
            onStart: () => {
              console.log(`🎭 Mask animation started for image ${index}`);
            },
            onComplete: () => {
              console.log(`🎭 Mask animation completed for image ${index}`);
              element.dataset.gsapAnimated = 'mask-revealed';
              element.dataset.maskComplete = 'true';
            }
          });
          
          if (hasParallax) {
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: duration + 1, 
              ease: "power2.out", 
              delay: staggerDelay
            });
          }
        } else if (isMobile) {
          // On mobile, show remaining images with ScrollTrigger to reduce initial load
          window.gsap.set(maskContainer, { width: '0px' });
          window.gsap.to(maskContainer, { 
            width: maskContainer.dataset.targetWidth + 'px', 
            duration: 1, 
            ease: "power2.out",
            scrollTrigger: { 
              trigger: element, 
              start: "top bottom", 
              end: "top center", 
              once: true 
            },
            onComplete: () => {
              element.dataset.gsapAnimated = 'mask-revealed';
              element.dataset.maskComplete = 'true';
            }
          });
          
          if (hasParallax) {
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: 1.0, 
              ease: "power2.out",
              scrollTrigger: { 
                trigger: element, 
                start: "top bottom", 
                end: "top center", 
                once: true 
              }
            });
          }
        } else {
          // Images below fold: use ScrollTrigger for both mobile and desktop
          window.gsap.set(maskContainer, { width: '0px' });
          window.gsap.to(maskContainer, { 
            width: maskContainer.dataset.targetWidth + 'px', 
            duration: isMobile ? 1.5 : 1.5, 
            ease: "power2.out",
            scrollTrigger: { 
              trigger: element, 
              start: "top bottom", 
              end: "top center", 
              once: true 
            },
            onComplete: () => {
              element.dataset.gsapAnimated = 'mask-revealed';
              element.dataset.maskComplete = 'true';
            }
          });
          
          if (hasParallax) {
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: isMobile ? 1.5 : 1.5, 
              ease: "power2.out",
              scrollTrigger: { 
                trigger: element, 
                start: "top bottom", 
                end: "top center", 
                once: true 
              }
            });
          }
        }
      });
      
      // Safety fallback: force completion of any stuck reveals after 5 seconds
      setTimeout(() => {
        allImages.forEach(element => {
          if (element.dataset.maskSetup && !element.dataset.maskComplete) {
            const maskContainer = element.parentNode;
            if (maskContainer && maskContainer.classList.contains('proper-mask-reveal')) {
              // Force reveal completion
              const targetWidth = maskContainer.dataset.targetWidth || element.offsetWidth;
              window.gsap.set(maskContainer, { width: targetWidth + 'px' });
              window.gsap.set(element, { opacity: 1, scale: 1 });
              element.dataset.gsapAnimated = 'mask-revealed-fallback';
              element.dataset.maskComplete = 'true';
              console.log('🔧 Forced reveal completion for stuck element');
            }
          }
        });
      }, 4000);
    }
  }

  // Natural infinite scroll setup
  function setupInfiniteScroll() {
    console.log('🔄 Starting infinite scroll setup...');
    // Back to simpler working selectors
    const selectors = ['.flex-grid', '.w-layout-grid', '[class*="grid"]', '.container', '.main-wrapper', '.page-wrapper', 'main'];
    let container = null;
    
    for (const selector of selectors) {
      const found = document.querySelector(selector);
      if (found && found.children.length > 1) { 
        container = found; 
        console.log(`✅ Found container: ${selector} with ${found.children.length} items`); 
        break; 
      }
    }
    
    if (!container) { 
      console.log('❌ No container found for infinite scroll'); 
      return; 
    }
    
    // Mark infinite scroll as active
    window.infiniteScrollActive = true;
    
    container.style.cssText += 'overflow:visible;height:auto';
    const originalItems = Array.from(container.children);
    const itemHeight = originalItems[0] ? originalItems[0].offsetHeight : 100;
    let isLoading = false;
    
    // Load more items function
    function loadMoreItems() {
      if (isLoading) return;
      isLoading = true;
      console.log('🔄 Loading more items...');
      
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        
        // Mark cloned elements to prevent text animations from affecting them
        clone.dataset.infiniteClone = 'true';
        clone.querySelectorAll('*').forEach(el => {
          el.dataset.infiniteClone = 'true';
          el.dataset.scrambled = 'true'; // Prevent scramble effect
        });
        
        // Force all cloned text content to be immediately visible (no GSAP processing)
        clone.querySelectorAll('*:not(img):not(video)').forEach(el => {
          // Skip the counter element to preserve its positioning
          if (el.id === 'time-counter' || el.closest('#time-counter')) return;
          
          el.dataset.infiniteClone = 'true';
          el.dataset.gsapAnimated = 'infinite-clone';
          el.dataset.maskSetup = 'true'; // Prevent mask animations
          
          // For .label-wrap elements and their children, preserve Webflow interactions
          if (el.classList.contains('label-wrap') || el.closest('.label-wrap')) {
            // Don't force opacity/transform changes on interactive elements
            el.style.visibility = 'visible';
            el.classList.remove('initial-hidden');
          } else {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.visibility = 'visible';
            el.classList.remove('initial-hidden');
          }
          
          // Remove any existing GSAP properties for non-media elements (except .label-wrap)
          if (typeof window.gsap !== 'undefined' && !el.classList.contains('label-wrap') && !el.closest('.label-wrap')) {
            window.gsap.set(el, { clearProps: "transform,opacity" });
          }
        });
        
        // Special handling for images and videos in clones - completely remove mask system
        clone.querySelectorAll('img, video').forEach(el => {
          el.dataset.infiniteClone = 'true';
          el.dataset.maskSetup = 'true'; // Prevent mask animations
          el.dataset.gsapAnimated = 'infinite-clone';
          
          // Remove mask containers from cloned content
          const maskContainer = el.closest('.proper-mask-reveal');
          if (maskContainer) {
            // Get the parent of the mask container
            const parent = maskContainer.parentNode;
            // Move the image out of the mask container
            parent.insertBefore(el, maskContainer);
            // Remove the mask container entirely
            maskContainer.remove();
            console.log('🔧 Removed mask container from cloned image');
          }
          
          // Completely reset image styles - no masks, just natural size
          const naturalWidth = el.naturalWidth || el.offsetWidth || 'auto';
          const naturalHeight = el.naturalHeight || el.offsetHeight || 'auto';
          
          el.style.cssText = `
            opacity: 0 !important; 
            display: block !important; 
            width: ${typeof naturalWidth === 'number' ? naturalWidth + 'px' : naturalWidth} !important;
            height: ${typeof naturalHeight === 'number' ? naturalHeight + 'px' : naturalHeight} !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
          `;
          
          if (typeof window.gsap !== 'undefined') {
            // Clear any GSAP properties and animate only opacity
            window.gsap.set(el, { clearProps: "all" });
            window.gsap.to(el, { 
              opacity: 1, 
              duration: 1.0, 
              ease: "power2.out", 
              delay: 0.1 + (Math.random() * 0.3) 
            });
          } else {
            setTimeout(() => el.style.opacity = '1', 100 + (Math.random() * 300));
          }
        });
        
        // Preserve Webflow hover interactions for .reveal and .label-wrap elements
        const interactiveElements = clone.querySelectorAll('.reveal, .label-wrap');
        interactiveElements.forEach(el => {
          // Ensure Webflow's hover interactions are preserved
          el.style.pointerEvents = 'auto';
          
          // For .label-wrap elements, also ensure child elements maintain interactions
          if (el.classList.contains('label-wrap')) {
            el.querySelectorAll('*').forEach(child => {
              child.style.pointerEvents = 'auto';
            });
          }
        });
        
        if (interactiveElements.length > 0) {
          // Try multiple methods to reinitialize Webflow interactions
          setTimeout(() => {
            // Method 1: Try Webflow IX
            if (typeof window.Webflow !== 'undefined' && window.Webflow.require) {
              try {
                const ix = window.Webflow.require('ix');
                if (ix && ix.init) {
                  ix.init();
                }
              } catch (e) {
                console.log('⚠️ Method 1 failed for Webflow interactions');
              }
            }
            
            // Method 2: Try Webflow IX2
            if (typeof window.Webflow !== 'undefined' && window.Webflow.require) {
              try {
                const ix2 = window.Webflow.require('ix2');
                if (ix2 && ix2.init) {
                  ix2.init();
                }
              } catch (e) {
                console.log('⚠️ Method 2 failed for Webflow interactions');
              }
            }
            
            // Method 3: Trigger Webflow ready event
            if (typeof window.Webflow !== 'undefined' && window.Webflow.ready) {
              try {
                window.Webflow.ready();
              } catch (e) {
                console.log('⚠️ Method 3 failed for Webflow interactions');
              }
            }
            
            console.log(`✅ Attempted to reinitialize Webflow interactions for ${interactiveElements.length} elements (.reveal and .label-wrap)`);
          }, 100);
        }
        
        // Additional safety for the clone container itself
        clone.style.opacity = '1';
        clone.style.transform = 'none';
        clone.style.visibility = 'visible';
        
        container.appendChild(clone);
        console.log('✅ Clone appended with visible text');
        
        // Clean up any orphaned mask containers in the clone
        clone.querySelectorAll('.proper-mask-reveal').forEach(maskContainer => {
          if (!maskContainer.querySelector('img, video')) {
            console.log('🧹 Removing orphaned mask container');
            maskContainer.remove();
          }
        });
      });
      
      console.log(`✅ Added ${originalItems.length} more items with protected visibility`);
      typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && window.gsap.ScrollTrigger.refresh();
      setTimeout(() => isLoading = false, 500);
    }
    
    // Enhanced scroll handler with better detection
    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Prevent immediate triggering on page load
      if (documentHeight <= windowHeight * 1.1) {
        // Page is too short, wait for content to fully load
        return;
      }
      
      const scrollPercent = (scrollTop + windowHeight) / documentHeight;
      const nearBottom = scrollPercent >= 0.85; // Trigger at 85% scroll for more reliable infinite scroll
      
      // Debug logging (only when approaching bottom)
      if (scrollPercent > 0.8 || nearBottom) {
        console.log(`📊 Scroll: ${Math.round(scrollPercent * 100)}% | ScrollTop: ${scrollTop} | DocHeight: ${documentHeight} | WindowHeight: ${windowHeight} | Loading: ${isLoading} | NearBottom: ${nearBottom}`);
      }
      
      if (nearBottom && !isLoading) {
        console.log('🎯 Infinite scroll triggered!');
        loadMoreItems();
      }
    }
    
    // More reliable scroll listener
    let ticking = false;
    const scrollListener = () => { 
      if (!ticking) { 
        requestAnimationFrame(() => { 
          handleScroll(); 
          ticking = false; 
        }); 
        ticking = true; 
      }
    };
    
    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('resize', scrollListener, { passive: true }); // Handle window resize
    console.log('🎯 Infinite scroll listeners attached');
    
    // Set visibility for infinite scroll images
    container.querySelectorAll('img, video').forEach(img => {
      if (typeof window.gsap !== 'undefined' && !img.dataset.gsapAnimated && (img.closest('.flex-grid, .container.video-wrap-hide') || img.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed'))) {
        window.gsap.set(img, { opacity: 1 });
        img.dataset.gsapAnimated = 'infinite-scroll';
      }
    });
    
    // Initial check to see if we need to load content immediately  
    setTimeout(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Only load if page is genuinely too short AND user hasn't scrolled
      if (documentHeight <= windowHeight * 1.3 && scrollTop < 100) {
        console.log('📄 Page too short on load, adding more content');
        loadMoreItems();
      }
    }, 2000); // Longer delay to ensure page is fully loaded
    
    // Clean infinite scroll setup completed
    console.log('✅ Infinite scroll fully initialized');
    
    console.log(`🌊 Natural infinite scroll enabled with ${originalItems.length} base items`);
    typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && setTimeout(() => window.gsap.ScrollTrigger.refresh(), 100);
  }

  // Three.js Scroll Effect Classes
  class ThreeJSScrollEffect {
    constructor() {
      this.scrollable = null;
      this.current = 0;
      this.target = 0;
      this.ease = 0.08; // Reduced for less sensitivity and smoother motion
      this.effectCanvas = null;
      this.init();
    }

    lerp(start, end, t) {
      return start * (1 - t) + end * t;
    }

    init() {
      // Target ONLY the specific container that should have smooth scrolling
      // Look for the content container, not the entire page wrapper
      this.scrollable = document.querySelector('.container.video-wrap-hide') || 
                       document.querySelector('.flex-grid') || 
                       document.querySelector('.w-layout-grid') ||
                       document.querySelector('[class*="grid"]');
      
      if (this.scrollable) {
        // Set body height for smooth scrolling to work
        document.body.style.height = `${this.scrollable.scrollHeight}px`;
        this.effectCanvas = new EffectCanvas();
        console.log('🎨 Three.js scroll effect initialized on container only:', this.scrollable.className);
      } else {
        console.log('🎨 No specific container found, Three.js effects only (no smooth scrolling)');
        this.effectCanvas = new EffectCanvas();
      }
    }

    smoothScroll() {
      this.target = window.scrollY;
      this.current = this.lerp(this.current, this.target, this.ease);
      
      // Apply smooth scrolling ONLY to the specific container
      // Everything else on the page remains untouched
      if (this.scrollable && Math.abs(this.target - this.current) > 0.5) {
        const transformValue = -this.current;
        this.scrollable.style.transform = `translate3d(0,${transformValue}px, 0)`;
      }
    }

    update() {
      this.smoothScroll();
    }
  }

  class EffectCanvas {
    constructor() {
      this.container = document.querySelector('main') || document.body;
      // Target all images on the page - infinite scroll will add new ones dynamically
      this.images = [...document.querySelectorAll('img')];
      this.meshItems = [];
      this.setupCamera();
      this.createMeshItems();
      this.render();
      console.log(`🎨 Three.js canvas created with ${this.images.length} images (all page images)`);
    }

    get viewport() {
      let width = window.innerWidth;
      let height = window.innerHeight;
      let aspectRatio = width / height;
      return { width, height, aspectRatio };
    }

    setupCamera() {
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
      
      this.scene = new THREE.Scene();
      
      let perspective = 1000;
      const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
      this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);
      this.camera.position.set(0, 0, perspective);
      
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(this.viewport.width, this.viewport.height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);
    }

    onWindowResize() {
      if (window.threeScrollEffect) {
        window.threeScrollEffect.init();
      }
      this.camera.aspect = this.viewport.aspectRatio;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.viewport.width, this.viewport.height);
    }

    createMeshItems() {
      this.images.forEach(image => {
        image.dataset.threeMesh = 'true'; // Mark to prevent duplicate meshes
        let meshItem = new MeshItem(image, this.scene);
        this.meshItems.push(meshItem);
      });
    }

    render() {
      if (window.threeScrollEffect) {
        window.threeScrollEffect.update();
      }
      
      // Only update meshes that are potentially visible (performance optimization)
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      for (let i = 0; i < this.meshItems.length; i++) {
        const meshItem = this.meshItems[i];
        const meshY = meshItem.element.getBoundingClientRect().top + scrollY;
        
        // Only render meshes within extended viewport
        if (meshY > scrollY - viewportHeight && meshY < scrollY + viewportHeight * 2) {
          meshItem.render();
        }
      }
      
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.render.bind(this));
    }
  }

  class MeshItem {
    constructor(element, scene) {
      this.element = element;
      this.scene = scene;
      this.offset = new THREE.Vector2(0, 0);
      this.sizes = new THREE.Vector2(0, 0);
      this.createMesh();
    }

    getDimensions() {
      const { width, height, top, left } = this.element.getBoundingClientRect();
      this.sizes.set(width, height);
      this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
    }

    createMesh() {
      const fragmentShader = `
        uniform sampler2D uTexture;
        uniform float uAlpha;
        uniform vec2 uOffset;
        varying vec2 vUv;

        vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
          float r = texture2D(textureImage,uv + offset).r;
          vec2 gb = texture2D(textureImage,uv).gb;
          return vec3(r,gb);
        }

        void main() {
          vec3 color = rgbShift(uTexture,vUv,uOffset);
          gl_FragColor = vec4(color,uAlpha);
        }
      `;

      const vertexShader = `
        uniform sampler2D uTexture;
        uniform vec2 uOffset;
        varying vec2 vUv;

        #define M_PI 3.1415926535897932384626433832795

        vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
          position.x = position.x + (sin(uv.y * M_PI) * offset.x);
          position.y = position.y + (sin(uv.x * M_PI) * offset.y);
          return position;
        }

        void main() {
          vUv = uv;
          vec3 newPosition = deformationCurve(position, uv, uOffset);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
      `;

      this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
      this.imageTexture = new THREE.TextureLoader().load(this.element.src);
      this.uniforms = {
        uTexture: { value: this.imageTexture },
        uOffset: { value: new THREE.Vector2(0.0, 0.0) },
        uAlpha: { value: 1.0 }
      };
      
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.getDimensions();
      this.mesh.position.set(this.offset.x, this.offset.y, 0);
      this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
      this.scene.add(this.mesh);
    }

    render() {
      this.getDimensions();
      this.mesh.position.set(this.offset.x, this.offset.y, 0);
      this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
      
      // Use Three.js smooth scroll values for enhanced shader effects
      const scrollEffect = window.threeScrollEffect;
      if (scrollEffect) {
        const scrollVelocity = scrollEffect.target - scrollEffect.current;
        this.uniforms.uOffset.value.set(
          scrollVelocity * 0.0002, // Horizontal distortion based on smooth scroll velocity
          -scrollVelocity * 0.001   // Vertical distortion 
        );
      } else {
        // Fallback to direct scroll velocity if Three.js not available
        if (!this.lastScrollY) this.lastScrollY = window.scrollY;
        const currentScrollY = window.scrollY;
        const scrollVelocity = currentScrollY - this.lastScrollY;
        this.lastScrollY = currentScrollY;
        
        this.uniforms.uOffset.value.set(
          scrollVelocity * 0.001,  // Horizontal distortion 
          -scrollVelocity * 0.002  // Vertical distortion
        );
      }
    }
  }

  // Hide elements initially
  function addHidden() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .hover-text, a:not(.nav a):not(.fake-nav a)').forEach(el => { 
      // Skip elements inside .label-wrap to preserve Webflow hover interactions
      if (!el.closest('.label-wrap') && !el.classList.contains('initial-hidden')) { 
        el.classList.add('initial-hidden'); 
        el.style.opacity = '0'; 
      }
    });
    document.querySelectorAll('img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => { if (!el.classList.contains('initial-hidden')) { el.classList.add('initial-hidden'); if (el.matches('.grid-down.project-down.mobile-down')) { el.style.transform = 'translateX(40px)'; el.style.opacity = '0'; }}});
  }

  // Page transition handler
  function handleTransition(e, href) {
    e.preventDefault();
    e.stopPropagation();
    const tl = window.gsap.timeline({ onComplete: () => window.location.href = href });
    const slideOut = document.querySelectorAll('.grid-down.project-down.mobile-down');
    slideOut.length && tl.to(slideOut, { x: 20, opacity: 0, duration: 0.8, stagger: 0.02, ease: "power2.inOut" }, 0.2);
    tl.to('body', { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.1);
  }

  // Start time counter functionality on existing Webflow element
  function startTimeCounter(counterElement) {
    // Set initial text
    counterElement.textContent = '0000';
    
    let startTime = Date.now();
    function updateCounter() {
      const elapsed = Date.now() - startTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeString = String(minutes).padStart(2, '0') + String(seconds).padStart(2, '0');
      counterElement.textContent = timeString;
    }
    
    setInterval(updateCounter, 1000);
    updateCounter(); // Initial call
  }

  // Initialize everything (removed addHidden since scramble effect handles visibility)
  console.log('🚀 Portfolio animations initializing...');

  // Enhanced fallback text visibility (excluding clones)
  setTimeout(() => {
    console.log('🔧 Fallback check: ensuring all text is visible');
    document.querySelectorAll('h1:not([data-infinite-clone]), h2:not([data-infinite-clone]), h3:not([data-infinite-clone]), h4:not([data-infinite-clone]), h5:not([data-infinite-clone]), h6:not([data-infinite-clone]), p:not([data-infinite-clone]), .hover-text:not([data-infinite-clone]), a:not(.nav a):not(.fake-nav a):not([data-infinite-clone])').forEach(el => {
      // Skip elements inside .label-wrap to preserve Webflow hover interactions
      if (el.closest('.label-wrap')) return;
      if ((el.style.opacity === '0' || window.getComputedStyle(el).opacity === '0') && !el.dataset.infiniteClone) { 
        el.style.opacity = '1'; 
        el.style.transform = 'none'; 
        el.classList.remove('initial-hidden');
        console.log('🔧 Made visible:', el);
      }
    });
  }, 2000);

  // Fallback init
  setTimeout(() => !isInit && init(), 2000);

  // Main initialization function with error protection
  function init() {
    if (isInit) return;
    
    function waitForGSAP() { 
      if (typeof window.gsap !== 'undefined') {
        requestAnimationFrame(() => { 
          try {
            console.log('✅ GSAP loaded, ready for animations');
          } catch (error) {
            console.error('❌ Animation initialization error:', error);
            // Don't let our errors break Webflow
          }
        }); 
      } else {
        setTimeout(waitForGSAP, 100); 
      }
    }
    waitForGSAP();
  }

  // Global click handler for page transitions with error protection
  document.addEventListener('click', e => {
    try {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    (href.startsWith('/') || href.startsWith(window.location.origin)) && handleTransition(e, href);
    } catch (error) {
      console.error('❌ Click handler error:', error);
      // Don't let our errors break Webflow navigation
    }
  }, true);

  // Export functions
  exports.initialize = init;
  exports.startTextAnimations = initTextAndOtherAnimations;
  exports.startMaskedImages = startMaskedImageAnimations;
  exports.handlePageTransition = handleTransition;
  
  // Wait for Webflow to be ready before starting our animations
  function waitForWebflow() {
    // Check if Webflow is available and ready
    if (typeof window.Webflow !== 'undefined' || document.querySelector('[data-wf-page]') || document.body.classList.contains('w-loading')) {
      console.log('🌐 Webflow detected, waiting for it to be ready...');
      // Give Webflow extra time to initialize
      setTimeout(() => {
        console.log('🌐 Webflow ready, starting animations...');
        initPreloader();
      }, 500); // Reduced from 1000ms to 500ms
    } else {
      console.log('🌐 No Webflow detected, starting animations normally...');
      initPreloader();
    }
  }
  
  // Start preloader with Webflow safety
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', waitForWebflow) : waitForWebflow();
})(window.portfolioAnimations);