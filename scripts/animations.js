// Version 1.8.8 - Fixed max-height issue on case study pages, no Lenis/smooth scrolling
// REQUIRED: Add this script tag to your Webflow site BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, preloaderComplete = false;
  let gsapLoaded = false, scrollTriggerLoaded = false, observerLoaded = false;

  // Global error handler
  window.addEventListener('error', function(e) {
    console.error('Global JavaScript error:', e.error);
  });

  // GSAP Loader Function
  function loadGSAPScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error('Failed to load GSAP script:', src);
    document.head.appendChild(script);
  }

  // Load GSAP Dependencies
  function loadGSAP() {
    loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', function() {
      gsapLoaded = true;
      loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', function() {
        scrollTriggerLoaded = true;
        loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Observer.min.js', function() {
          observerLoaded = true;
        });
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
      
      #preloader.visible { opacity: 1; }
      
      #preloader .progress-container { text-align: center; }
      
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
      
      body.loading { overflow: hidden; }
      
      .nav:not(.fake-nav) {
        transform: translateY(100%);
        opacity: 0;
      }
      
      .flex-grid { margin-top: 0.2vw !important; }
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
    
    requestAnimationFrame(() => preloader.classList.add('visible'));
    return preloader;
  }

  // Initialize preloader
  function initPreloader() {
    loadGSAP();
    const preloader = createPreloader();
    const progressFill = preloader.querySelector('.progress-fill');
    
    if (typeof imagesLoaded === 'function') {
      const imgLoad = imagesLoaded(document.body, { background: true });
      let loadedCount = 0;
      const totalImages = imgLoad.images.length;
      
      if (totalImages === 0) {
        if (typeof gsap !== 'undefined') {
          gsap.to(progressFill, { width: '100%', duration: 0.3, onComplete: completePreloader });
        } else {
          setTimeout(completePreloader, 300);
        }
        return;
      }
      
      imgLoad.on('progress', function() {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        
        if (typeof gsap !== 'undefined') {
          gsap.to(progressFill, { width: progress + '%', duration: 0.3, ease: "power2.out" });
        } else {
          progressFill.style.width = progress + '%';
        }

        const minImagesForSmooth = Math.min(40, Math.ceil(totalImages * 0.8));
        if (loadedCount >= minImagesForSmooth) {
          setTimeout(completePreloader, 200);
        }
      });
      
      imgLoad.on('always', function() {
        if (!preloaderComplete) {
          setTimeout(completePreloader, 200);
        }
      });
      
    } else {
      if (typeof gsap !== 'undefined') {
        gsap.to(progressFill, { width: '100%', duration: 1.5, ease: "power2.out", onComplete: completePreloader });
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
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    const preloader = document.getElementById('preloader');
    
    if (typeof gsap !== 'undefined') {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: function() {
          preloader.remove();
          document.body.classList.remove('loading');
          startPageAnimations();
        }
      });
    } else {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.remove();
          document.body.classList.remove('loading');
          startPageAnimations();
        }, 400);
      }, 100);
    }
  }

  // Start all page animations
  function startPageAnimations() {
    createTimeCounter();
    
    const bottomNav = document.querySelector('.nav:not(.fake-nav)');
    if (bottomNav) {
      if (typeof gsap !== 'undefined') {
        gsap.to(bottomNav, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
      } else {
        bottomNav.style.transform = 'translateY(0)';
        bottomNav.style.opacity = '1';
      }
    }
    
    if (!isInit) {
      init();
    }
  }

  function initHover() {
    const links = document.querySelectorAll('.link');
    
    links.forEach(link => {
      if (link.dataset.hoverInit) return;
      
      const originalHTML = link.innerHTML.trim();
      const hasLineBreaks = originalHTML.includes('<br>') || originalHTML.includes('\n') || link.offsetHeight > 25;
      const rect = link.getBoundingClientRect();
      const height = rect.height;
      
      if (hasLineBreaks) {
        Object.assign(link.style, {
          position: 'relative',
          overflow: 'hidden',
          display: 'block'
        });
        
        link.innerHTML = `
          <span class="link-text-1" style="display: block; position: relative; opacity: 1;">${originalHTML}</span>
          <span class="link-text-2" style="display: block; position: absolute; width: 100%; left: 0; top: 0; opacity: 0;">${originalHTML}</span>
        `;
      } else {
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
      
      const tl = window.gsap.timeline({ 
        paused: true,
        defaults: { duration: 0.4, ease: "power2.out" }
      });
      
      tl.to(link.querySelector('.link-text-1'), { yPercent: -50, opacity: 0 })
        .to(link.querySelector('.link-text-2'), { yPercent: -50, opacity: 1 }, 0.1);
      
      link.addEventListener('mouseenter', () => tl.timeScale(1).play());
      link.addEventListener('mouseleave', () => tl.timeScale(1).reverse());
      
      link.dataset.hoverInit = 'true';
    });
  }

  function wrapLines(el) {
    if (el.dataset.splitDone) return el.querySelectorAll('.line-inner');

    const originalHTML = el.innerHTML.trim();
    if (!originalHTML) return [];

    if (originalHTML.includes('<br>')) {
      const lines = originalHTML.split(/<br\s*\/?>/i);
      el.innerHTML = '';
      
      lines.forEach((lineHTML) => {
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
    return el.querySelectorAll('.line-inner');
  }

  function startAnims() {
    const largeHeadings = document.querySelectorAll('.heading.large');
    const smallHeadings = document.querySelectorAll('.heading.small');
    const regularHeadings = document.querySelectorAll('h1:not(.heading.large):not(.heading.small), h2:not(.heading.large):not(.heading.small), h3:not(.heading.large):not(.heading.small), h4, h5, h6');
    const paragraphs = document.querySelectorAll('p');
    const links = document.querySelectorAll('a:not(.nav a):not(.fake-nav a)');
    const slideEls = document.querySelectorAll('.grid-down.project-down.mobile-down');
    const mediaEls = document.querySelectorAll('img, video');
    const otherEls = document.querySelectorAll('.nav, .preloader-counter, .card-project, .top-right-nav,.fake-nav, .inner-top, .mobile-down:not(.grid-down.project-down.mobile-down)');

    initHover();

    // Create proper mask reveal for ALL images
    const allImages = document.querySelectorAll('img:not(#preloader img), video');
    
    if (allImages.length) {
      allImages.forEach((element, index) => {
        if (element.dataset.maskSetup) return;
        
        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;
        
        if (originalWidth === 0 || originalHeight === 0) return;
        
        const parent = element.parentNode;
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
        
        parent.insertBefore(maskContainer, element);
        maskContainer.appendChild(element);
        
        element.style.cssText = `
          width: ${originalWidth}px !important;
          height: ${originalHeight}px !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
        `;
        
        element.dataset.maskSetup = 'true';
        
        const hasParallax = element.classList.contains('img-parallax');
        if (hasParallax) {
          window.gsap.set(element, { scale: 1.2 });
        }
        
        window.gsap.to(maskContainer, {
          width: originalWidth + 'px',
          duration: 1.2,
          ease: "power2.out",
          delay: index * 0.1
        });
        
        if (hasParallax) {
          window.gsap.to(element, {
            scale: 1.0,
            duration: 1.5,
            ease: "power2.out",
            delay: index * 0.1
          });
        }
      });
    }

    const tl = window.gsap.timeline();

    // Media elements - simple fade-in
    if (mediaEls.length) {
      mediaEls.forEach((el, i) => {
        if (el.dataset.gsapAnimated) return;
        
        if (el.closest('.reveal, .reveal-full, .thumbnail-container, .video-container, .video-large, .video-fixed')) {
          window.gsap.set(el, { opacity: 1 });
          el.dataset.gsapAnimated = 'reveal-container';
          return;
        }
        
        if (el.closest('.flex-grid, .container.video-wrap-hide')) {
          window.gsap.set(el, { opacity: 1 });
          el.dataset.gsapAnimated = 'infinite-scroll';
          return;
        }
        
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport) {
          window.gsap.set(el, { opacity: 0, y: 30 });
          window.gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.2 + (i * 0.1),
            onComplete: () => el.dataset.gsapAnimated = 'completed'
          });
        } else {
          window.gsap.set(el, { opacity: 0, y: 40 });
          if (el.loading !== 'eager') el.loading = 'eager';
          
          window.gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top center",
              toggleActions: "play none none reverse",
              once: true,
              onEnter: () => el.dataset.gsapAnimated = 'animating',
              onComplete: () => el.dataset.gsapAnimated = 'completed'
            }
          });
        }
      });
    }

    // Text animations
    if (largeHeadings.length) {
      largeHeadings.forEach((h, index) => {
        const lines = wrapLines(h);
        if (lines.length > 0) {
          tl.to(lines, { y: 0, opacity: 1, duration: 1.1, stagger: 0.2, ease: "power2.out" }, 0.1 + (index * 0.1));
        }
      });
    }

    if (regularHeadings.length) {
      regularHeadings.forEach((heading, index) => {
        if (heading.classList.contains('link') || heading.dataset.hoverInit) return;
        
        const lines = wrapLines(heading);
        if (lines.length > 0) {
          tl.to(lines, { y: 0, opacity: 1, duration: 1.0, stagger: 0.15, ease: "power2.out" }, 0.2 + (index * 0.1));
        }
      });
    }

    if (smallHeadings.length) {
      smallHeadings.forEach((heading, index) => {
        const linkText1 = heading.querySelector('.link-text-1');
        const linkText2 = heading.querySelector('.link-text-2');
        
        if (linkText1 && linkText2) {
          const lines = wrapLines(linkText1);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 20 });
            tl.to(lines, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 0.3 + (index * 0.1));
          }
        } else {
          const lines = wrapLines(heading);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 20 });
            tl.to(lines, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 0.3 + (index * 0.1));
          }
        }
      });
    }

    if (paragraphs.length) {
      paragraphs.forEach((paragraph, index) => {
        if (paragraph.classList.contains('link') || paragraph.dataset.hoverInit) return;
        
        const lines = wrapLines(paragraph);
        if (lines.length > 0) {
          tl.to(lines, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power2.out" }, 0.4 + (index * 0.08));
        }
      });
    }

    if (links.length) {
      links.forEach((link, index) => {
        const linkText1 = link.querySelector('.link-text-1');
        const linkText2 = link.querySelector('.link-text-2');
        
        if (linkText1 && linkText2) {
          const lines = wrapLines(linkText1);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 10 });
            tl.to(lines, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.5 + (index * 0.04));
          }
        } else {
          const lines = wrapLines(link);
          if (lines.length > 0) {
            window.gsap.set(lines, { opacity: 0, y: 10 });
            tl.to(lines, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.5 + (index * 0.04));
          }
        }
      });
    }

    if (slideEls.length) {
      window.gsap.set(slideEls, { x: 40, opacity: 0 });
      tl.to(slideEls, { x: 0, opacity: 1, duration: 1.1, stagger: 0.06, ease: "power2.out" }, 0.6);
    }

    if (otherEls.length) {
      window.gsap.set(otherEls, { opacity: 0, y: 10 });
      tl.to(otherEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.7);
    }

    setupInfiniteScroll();
  }

  // Simple infinite scroll - works exactly the same on ALL pages
  function setupInfiniteScroll() {
    // Find ANY container with content - treat ALL the same as home page
    const selectors = [
      '.flex-grid',
      '.w-layout-grid', 
      '[class*="grid"]',
      '.container',
      '.main-wrapper',
      '.page-wrapper',
      'main'
    ];
    
    let container = null;
    for (const selector of selectors) {
      const found = document.querySelector(selector);
      if (found && found.children.length > 1) {
        container = found;
        console.log(`✅ Using container: ${selector}`);
        break;
      }
    }
    
    if (!container) {
      console.log('❌ No container found');
      return;
    }
    
    // Apply EXACT same styles as home page to ALL containers
    container.style.cssText += `
      overflow-y: auto;
      // max-height: 100vh;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
    `;

    // Hide scrollbars
    const scrollbarStyles = document.createElement('style');
    const containerClass = container.className.split(' ')[0] || 'scroll-container';
    scrollbarStyles.textContent = `
      .${containerClass}::-webkit-scrollbar { display: none; }
      .${containerClass} { scrollbar-width: none; -ms-overflow-style: none; }
    `;
    
    if (!document.head.querySelector('#infinite-scroll-styles')) {
      scrollbarStyles.id = 'infinite-scroll-styles';
      document.head.appendChild(scrollbarStyles);
    }

    let itemsScrolled = 0;
    let itemsMax = 0;
    let cloned = false;
    
    const listOpts = {
      itemCount: null,
      itemHeight: null,
      items: [],
    };

    function scrollWrap() {
      const scrollTop = container.scrollTop;
      
      if (listOpts.itemHeight) {
        itemsScrolled = Math.ceil((scrollTop + listOpts.itemHeight / 2) / listOpts.itemHeight);
        
        if (scrollTop < 1) itemsScrolled = 0;
        
        if (itemsScrolled > listOpts.items.length - 3) {
          let node;
          for (let x = 0; x <= itemsMax - 1; x++) {
            node = listOpts.items[x];
            if (!cloned) {
              node = listOpts.items[x].cloneNode(true);
            }
            container.appendChild(node);
          }
          
          initItems(cloned);
          cloned = true;
          itemsScrolled = 0;
        }
      }
    }

    function initItems(scrollSmooth) {
      listOpts.items = Array.from(container.children);
      
      if (listOpts.items.length > 0) {
        listOpts.itemHeight = listOpts.items[0].offsetHeight;
        listOpts.itemCount = listOpts.items.length;
        
        if (!itemsMax) itemsMax = listOpts.itemCount;
        
        if (scrollSmooth && itemsMax > 3) {
          const seamlessScrollPoint = (itemsMax - 3) * listOpts.itemHeight;
          container.scrollTop = seamlessScrollPoint;
        }
      }
    }

    initItems();
    container.onscroll = scrollWrap;
    
    container.querySelectorAll('img, video').forEach(img => {
      if (typeof window.gsap !== 'undefined') {
        window.gsap.set(img, { opacity: 1 });
      }
      img.dataset.gsapAnimated = 'infinite-scroll';
    });
    
    console.log(`🔄 Infinite scroll active with ${container.children.length} items`);
  }

  function addHidden() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a:not(.nav a):not(.fake-nav a)').forEach(el => {
      if (!el.classList.contains('initial-hidden')) {
        el.classList.add('initial-hidden');
        el.style.opacity = '0';
      }
    });
    
    document.querySelectorAll('img, video, .nav, .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => {
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

    const tl = window.gsap.timeline({ onComplete: () => window.location.href = href });
    const slideOut = document.querySelectorAll('.grid-down.project-down.mobile-down');
    
    if (slideOut.length) {
      tl.to(slideOut, { x: 20, opacity: 0, duration: 0.8, stagger: 0.02, ease: "power2.inOut" }, 0.2);
    }
    tl.to('body', { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 0.1);
  }

  function createTimeCounter() {
    const counter = document.createElement('div');
    counter.id = 'time-counter';
    counter.textContent = '0000';
    
    counter.style.cssText = `
      position: fixed;
      bottom: 0.8vw;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
      font-size: 0.6vw;
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      letter-spacing: 0.1em;
      opacity: 0.8;
    `;

    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
      @media (max-width: 768px) {
        #time-counter { font-size: 11px !important; bottom: 0.8vw !important; }
        .main-wrapper, [data-w-id], main, .page-wrapper { min-height: 100vh; height: auto; }
        body > div:first-child { min-height: 100vh; }
      }
    `;
    
    if (!document.head.querySelector('#mobile-responsive-styles')) {
      mobileStyles.id = 'mobile-responsive-styles';
      document.head.appendChild(mobileStyles);
    }
    
    document.body.appendChild(counter);
    
    const lines = wrapLines(counter);
    if (lines.length > 0) {
      window.gsap.set(lines, { opacity: 0, y: 20 });
      window.gsap.to(lines, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.0
      });
    }
    
    let startTime = Date.now();
    
    function updateCounter() {
      const elapsed = Date.now() - startTime;
      const totalSeconds = Math.floor(elapsed / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const timeString = String(minutes).padStart(2, '0') + String(seconds).padStart(2, '0');
      
      const lineInner = counter.querySelector('.line-inner');
      if (lineInner) {
        lineInner.textContent = timeString;
      } else {
        counter.textContent = timeString;
      }
    }
    
    setInterval(updateCounter, 1000);
    updateCounter();
    
    return counter;
  }

  // Initialize
  addHidden();

  // Safety: Ensure text is visible after 1 second
  setTimeout(() => {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a:not(.nav a):not(.fake-nav a)').forEach(el => {
      if (el.style.opacity === '0' || window.getComputedStyle(el).opacity === '0') {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.remove('initial-hidden');
      }
    });
  }, 1000);

  // Fallback: Ensure init() runs even if preloader fails
  setTimeout(() => {
    if (!isInit) {
      init();
    }
  }, 2000);

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

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('/') || href.startsWith(window.location.origin)) handleTransition(e, href);
  }, true);

  exports.initialize = init;
  exports.startAnimations = startAnims;
  exports.handlePageTransition = handleTransition;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})(window.portfolioAnimations);