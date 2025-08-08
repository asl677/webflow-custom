// Version 2.3.19: Fix counter scramble effect + improve infinite scroll reliability
// REQUIRED: Add these script tags BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, preloaderComplete = false, gsapLoaded = false, scrollTriggerLoaded = false, observerLoaded = false, threejsLoaded = false;

  // Global error handler
  window.addEventListener('error', e => console.error('Global JavaScript error:', e.error));

  // Load GSAP scripts sequentially
  function loadGSAPScript(src, callback) {
    const script = document.createElement('script');
    script.src = src; script.onload = callback; script.onerror = () => console.error('Failed to load GSAP script:', src);
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
    style.textContent = `#preloader{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.5s ease-out}#preloader.visible{opacity:1}#preloader .progress-container{text-align:center}#preloader .progress-line{width:80px;height:2px;background:rgba(255,255,255,0.2);position:relative;border-radius:1px;margin:0 auto}#preloader .progress-fill{width:0%;height:100%;background:white;border-radius:1px;transition:width 0.3s ease}body.loading{overflow:hidden}.nav:not(.fake-nav){transform:translateY(100%);opacity:0}.flex-grid{margin-top:0.2vw!important}`;
    document.head.appendChild(style);

    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = '<div class="progress-container"><div class="progress-line"><div class="progress-fill"></div></div></div>';
    document.body.appendChild(preloader);
    document.body.classList.add('loading');
    requestAnimationFrame(() => preloader.classList.add('visible'));
    return preloader;
  }

  // Initialize preloader with image loading tracking
  function initPreloader() {
    loadGSAP();
    const preloader = createPreloader();
    const progressFill = preloader.querySelector('.progress-fill');
    
    if (typeof imagesLoaded === 'function') {
      const imgLoad = imagesLoaded(document.body, { background: true });
      let loadedCount = 0;
      const totalImages = imgLoad.images.length;
      
      if (totalImages === 0) {
        typeof gsap !== 'undefined' ? gsap.to(progressFill, { width: '100%', duration: 0.3, onComplete: completePreloader }) : setTimeout(completePreloader, 300);
        return;
      }
      
      imgLoad.on('progress', () => {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        typeof gsap !== 'undefined' ? gsap.to(progressFill, { width: progress + '%', duration: 0.3, ease: "power2.out" }) : progressFill.style.width = progress + '%';
        if (loadedCount >= Math.min(40, Math.ceil(totalImages * 0.8))) setTimeout(completePreloader, 200);
      });
      
      imgLoad.on('always', () => !preloaderComplete && setTimeout(completePreloader, 200));
    } else {
      typeof gsap !== 'undefined' ? gsap.to(progressFill, { width: '100%', duration: 1.5, ease: "power2.out", onComplete: completePreloader }) : setTimeout(() => { progressFill.style.width = '100%'; setTimeout(completePreloader, 300); }, 1500);
    }
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    const preloader = document.getElementById('preloader');
    
    typeof gsap !== 'undefined' ? gsap.to(preloader, { opacity: 0, duration: 0.4, ease: "power2.out", onComplete: () => { preloader.remove(); document.body.classList.remove('loading'); startPageAnimations(); }}) : setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.remove(); document.body.classList.remove('loading'); startPageAnimations(); }, 400); }, 100);
  }

  // Start all page animations after preloader
  function startPageAnimations() {
    createTimeCounter();
    const bottomNav = document.querySelector('.nav:not(.fake-nav)');
    if (bottomNav) typeof gsap !== 'undefined' ? gsap.to(bottomNav, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }) : (bottomNav.style.transform = 'translateY(0)', bottomNav.style.opacity = '1');
    
    !isInit && init();
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
    if (element.dataset.scrambled || element.dataset.infiniteClone) return;
    element.dataset.scrambled = 'true';
    
    const originalText = element.textContent.trim();
    if (!originalText) return;
    
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let currentText = originalText;
    let iteration = 0;
    const totalIterations = Math.floor(duration / 50);
    
    setTimeout(() => {
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
        }
        
        iteration += 1 / 3;
      }, 50);
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

  // Main animation function
  function startAnims() {
    typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && window.gsap.registerPlugin(window.gsap.ScrollTrigger);
    
    // Immediately make any existing cloned content visible (for mid-page loads)
    document.querySelectorAll('[data-infinite-clone="true"]').forEach(el => {
      // Skip the counter element to preserve its positioning
      if (el.id === 'time-counter' || el.closest('#time-counter')) return;
      
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
      el.classList.remove('initial-hidden');
    });
    
    const largeHeadings = document.querySelectorAll('.heading.large:not([data-infinite-clone])');
    const smallHeadings = document.querySelectorAll('.heading.small:not([data-infinite-clone])');
    const regularHeadings = document.querySelectorAll('h1:not(.heading.large):not(.heading.small):not([data-infinite-clone]), h2:not(.heading.large):not(.heading.small):not([data-infinite-clone]), h3:not(.heading.large):not(.heading.small):not([data-infinite-clone]), h4:not([data-infinite-clone]), h5:not([data-infinite-clone]), h6:not([data-infinite-clone])');
    const paragraphs = document.querySelectorAll('p:not([data-infinite-clone])');
    const links = document.querySelectorAll('a:not(.nav a):not(.fake-nav a):not([data-infinite-clone]), .menu-link:not([data-infinite-clone]), .menu-link.shimmer.accordion.chip-link:not([data-infinite-clone])');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img, video');
    const otherEls = document.querySelectorAll('.nav, .preloader-counter, .card-project, .top-right-nav,.fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    initHover();

    // Mobile-optimized mask reveal for images
    const allImages = document.querySelectorAll('img:not(#preloader img), video');
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
        element.style.cssText = `width:${originalWidth}px!important;height:${originalHeight}px!important;display:block!important;margin:0!important;padding:0!important`;
        element.dataset.maskSetup = 'true';
        
        const hasParallax = element.classList.contains('img-parallax');
        if (hasParallax) window.gsap.set(element, { scale: 1.2 });
        
        // Limit initial animations on mobile for better performance
        if (index < maxInitialImages) {
          // Increased stagger for mobile to prevent too many simultaneous animations
          const staggerDelay = isMobile ? index * 0.4 : index * 0.2;
          const duration = isMobile ? 0.6 : 1.2;
          
          window.gsap.to(maskContainer, { 
            width: originalWidth + 'px', 
            duration: duration, 
            ease: "power2.out", 
            delay: staggerDelay
          });
          
          if (hasParallax) {
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: duration + 0.3, 
              ease: "power2.out", 
              delay: staggerDelay
            });
          }
        } else if (isMobile) {
          // On mobile, show remaining images with ScrollTrigger to reduce initial load
          window.gsap.set(maskContainer, { width: '0px' });
          window.gsap.to(maskContainer, { 
            width: originalWidth + 'px', 
            duration: 0.8, 
            ease: "power2.out",
            scrollTrigger: { 
              trigger: element, 
              start: "top bottom", 
              end: "top center", 
              once: true 
            }
          });
        } else {
          // Desktop: animate all normally
          const staggerDelay = index * 0.2;
          window.gsap.to(maskContainer, { 
            width: originalWidth + 'px', 
            duration: 1.2, 
            ease: "power2.out", 
            delay: staggerDelay
          });
          
          if (hasParallax) {
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: 1.5, 
              ease: "power2.out", 
              delay: staggerDelay
            });
          }
        }
      });
    }

    const tl = window.gsap.timeline();

    // Media elements fade-in
    if (mediaEls.length) {
      mediaEls.forEach((el, i) => {
        if (el.dataset.gsapAnimated) return;
        if (el.dataset.infiniteClone) { window.gsap.set(el, { opacity: 1 }); el.dataset.gsapAnimated = 'infinite-clone'; return; } // Skip cloned content
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
    
    // Include counter element
    const counter = document.querySelector('#time-counter');
    if (counter && !counter.dataset.infiniteClone) {
      textElements.push(counter);
    }
    
    // Apply scramble effect to all text elements with fallback safety
    textElements.forEach((element, index) => {
      // For hover elements, scramble the visible text span
      const linkText1 = element.querySelector('.link-text-1');
      if (linkText1) {
        linkText1.style.opacity = '0';
        scrambleText(linkText1, 1500, 1200 + (index * 100));
        // Safety fallback for hover elements
        setTimeout(() => {
          if (linkText1.style.opacity === '0') {
            linkText1.style.opacity = '1';
            console.log('🔧 Fallback: Made hover text visible');
          }
        }, 4000);
      } else {
        element.style.opacity = '0';
        scrambleText(element, 1500, 1200 + (index * 100));
        // Safety fallback for regular elements
        setTimeout(() => {
          if (element.style.opacity === '0') {
            element.style.opacity = '1';
            console.log('🔧 Fallback: Made element visible', element);
          }
        }, 4000);
      }
    });
    
    // Emergency fallback - ensure all text is visible after 3 seconds (excluding clones)
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
    }, 3000);
    
    console.log(`🎯 Scramble effect applied to ${textElements.length} text elements`);

    slideEls.length && (window.gsap.set(slideEls, { x: 40, opacity: 0 }), tl.to(slideEls, { x: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power2.out" }, 1.6));
    otherEls.length && (window.gsap.set(otherEls, { opacity: 0, y: 10 }), tl.to(otherEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 1.7));

    setupInfiniteScroll();
    
    // Three.js disabled due to infinite scroll conflicts
    console.log('🎨 Three.js effects disabled to preserve infinite scroll functionality');
  }

  // Natural infinite scroll setup
  function setupInfiniteScroll() {
    const selectors = ['.flex-grid', '.w-layout-grid', '[class*="grid"]', '.container', '.main-wrapper', '.page-wrapper', 'main'];
    let container = null;
    
    for (const selector of selectors) {
      const found = document.querySelector(selector);
      if (found && found.children.length > 1) { container = found; console.log(`✅ Found container: ${selector} with ${found.children.length} items`); break; }
    }
    
    if (!container) { 
      console.log('❌ No container found for infinite scroll'); 
      console.log('Available selectors checked:', selectors.map(s => `${s}: ${document.querySelector(s) ? 'found' : 'not found'}`));
      return; 
    }
    
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
        
        // Mark cloned elements and make them immediately visible
        clone.dataset.infiniteClone = 'true';
        clone.querySelectorAll('*').forEach(el => {
          // Skip the counter element to preserve its positioning
          if (el.id === 'time-counter' || el.closest('#time-counter')) return;
          
          el.dataset.infiniteClone = 'true';
          el.dataset.scrambled = 'true'; // Prevent scramble effect
          el.dataset.gsapAnimated = 'infinite-clone';
          el.dataset.maskSetup = 'true'; // Prevent mask animations
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.visibility = 'visible';
          el.classList.remove('initial-hidden');
          
          // Remove any existing GSAP properties
        if (typeof window.gsap !== 'undefined') {
            window.gsap.set(el, { clearProps: "all" });
          }
        });
        
        // Additional safety for the clone container itself
        clone.style.opacity = '1';
        clone.style.transform = 'none';
        clone.style.visibility = 'visible';
        
        container.appendChild(clone);
        console.log('✅ Clone appended with visible text');
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
      const scrollPercent = (scrollTop + windowHeight) / documentHeight;
      const nearBottom = scrollPercent >= 0.85; // Trigger at 85% scroll
      
      // Debug logging (remove in production)
      if (scrollPercent > 0.7 || nearBottom) {
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
      
      console.log(`📏 Initial state - ScrollTop: ${scrollTop}, WindowHeight: ${windowHeight}, DocHeight: ${documentHeight}`);
      
      // If page is too short, load more content
      if (documentHeight <= windowHeight * 1.5) {
        console.log('📄 Page too short, loading more content');
        loadMoreItems();
      }
      
      // Check if user is already near bottom on load
      handleScroll();
    }, 1000);
    
    // Additional check after Three.js initializes
    setTimeout(() => {
      if (window.threeScrollEffect) {
        console.log('🔄 Three.js active - additional infinite scroll check');
        handleScroll();
      }
    }, 2000);
    
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
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a:not(.nav a):not(.fake-nav a)').forEach(el => { if (!el.classList.contains('initial-hidden')) { el.classList.add('initial-hidden'); el.style.opacity = '0'; }});
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

  // Create time counter display
  function createTimeCounter() {
    const counter = document.createElement('div');
    counter.id = 'time-counter';
    counter.textContent = '0000';
    counter.style.cssText = `position:fixed;bottom:0.8vw;left:50%;transform:translateX(-50%);color:white;font-family:'SF Mono','Monaco','Inconsolata','Roboto Mono','Source Code Pro',monospace;font-size:0.6vw;z-index:9999;pointer-events:none;user-select:none;letter-spacing:0.1em;opacity:0.8`;

    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = '@media (max-width: 768px) {#time-counter{font-size:11px!important;bottom:0.8vw!important}.main-wrapper, main, .page-wrapper{min-height:100vh;height:auto}body > div:first-child{min-height:100vh}}';
    
    if (!document.head.querySelector('#mobile-responsive-styles')) { mobileStyles.id = 'mobile-responsive-styles'; document.head.appendChild(mobileStyles); }
    document.body.appendChild(counter);
    
    const lines = wrapLines(counter);
    lines.length > 0 && (window.gsap.set(lines, { opacity: 0, y: 20 }), window.gsap.to(lines, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.0 }));
    
    let startTime = Date.now();
    function updateCounter() {
      const elapsed = Date.now() - startTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeString = String(minutes).padStart(2, '0') + String(seconds).padStart(2, '0');
      const lineInner = counter.querySelector('.line-inner');
      lineInner ? lineInner.textContent = timeString : counter.textContent = timeString;
    }
    
    setInterval(updateCounter, 1000);
    updateCounter();
    return counter;
  }

  // Initialize everything (removed addHidden since scramble effect handles visibility)
  console.log('🚀 Portfolio animations initializing...');

  // Enhanced fallback text visibility (excluding clones)
  setTimeout(() => {
    console.log('🔧 Fallback check: ensuring all text is visible');
    document.querySelectorAll('h1:not([data-infinite-clone]), h2:not([data-infinite-clone]), h3:not([data-infinite-clone]), h4:not([data-infinite-clone]), h5:not([data-infinite-clone]), h6:not([data-infinite-clone]), p:not([data-infinite-clone]), a:not(.nav a):not(.fake-nav a):not([data-infinite-clone])').forEach(el => {
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

  // Main initialization function
  function init() {
    if (isInit) return;
    function waitForGSAP() { 
      if (typeof window.gsap !== 'undefined') {
        requestAnimationFrame(() => { 
          startAnims(); 
          isInit = true; 

        }); 
      } else {
        setTimeout(waitForGSAP, 100); 
      }
    }
    waitForGSAP();
  }

  // Global click handler for page transitions
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    (href.startsWith('/') || href.startsWith(window.location.origin)) && handleTransition(e, href);
  }, true);

  // Export functions
  exports.initialize = init;
  exports.startAnimations = startAnims;
  exports.handlePageTransition = handleTransition;
  
  // Start preloader
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initPreloader) : initPreloader();
})(window.portfolioAnimations);