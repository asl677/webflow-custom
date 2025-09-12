// Version 2.7: Revert to working custom scramble, ensure counter is included
// REQUIRED: Add these script tags BEFORE this script:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js"></script>
// GSAP, ScrollTrigger, and Observer are loaded dynamically

// IMMEDIATE SCRIPT LOAD TEST
console.log('🚀 SCRIPT LOADED: Portfolio animations starting...');
console.log('🚀 URL:', window.location.href);
window.scriptLoadTest = function() {
  console.log('✅ SCRIPT IS DEFINITELY LOADED');
  return 'SUCCESS: Script loaded and working';
};
console.log('🚀 Try: window.scriptLoadTest()');

// Hide images but allow preloader
(function() {
  const emergencyHide = document.createElement('style');
  emergencyHide.id = 'emergency-image-hide';
  emergencyHide.textContent = `
    img:not(#preloader img):not([data-infinite-clone]), video:not([data-infinite-clone]) { opacity: 0 !important; }
  `;
  (document.head || document.documentElement).appendChild(emergencyHide);
})();

window.portfolioAnimations = window.portfolioAnimations || {};

(function(exports) {
  let isInit = false, preloaderComplete = false, gsapLoaded = false, scrollTriggerLoaded = false, observerLoaded = false, threejsLoaded = false;
  
  // Global mobile detection (used across multiple functions)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

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

  // Check for Webflow's built-in GSAP first, then load externally if needed
  function loadGSAP() {
    // Check if GSAP is already available from Webflow
    if (typeof window.gsap !== 'undefined') {
      console.log('✅ Using Webflow\'s built-in GSAP');
      gsapLoaded = true;
      
      // Check for ScrollTrigger
      if (window.gsap.ScrollTrigger) {
        console.log('✅ Using Webflow\'s built-in ScrollTrigger');
        scrollTriggerLoaded = true;
      } else {
        // Load ScrollTrigger if not available
        loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', () => {
          scrollTriggerLoaded = true;
          console.log('✅ ScrollTrigger loaded externally');
          if (window.gsap && window.gsap.registerPlugin) {
            try {
              window.gsap.registerPlugin(ScrollTrigger);
              console.log('✅ ScrollTrigger registered');
            } catch (e) {
              console.error('❌ ScrollTrigger registration failed:', e);
            }
          }
        });
      }
      
      // Load Observer plugin
      loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Observer.min.js', () => {
        observerLoaded = true;
        console.log('✅ Observer loaded');
      });
      
      return;
    }
    
    // Fallback: Load GSAP externally if not provided by Webflow
    console.log('ℹ️ Webflow GSAP not found, loading externally...');
    loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', () => {
      gsapLoaded = true;
      console.log('✅ GSAP loaded externally');
              loadGSAPScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', () => {
          scrollTriggerLoaded = true;
        console.log('✅ ScrollTrigger loaded externally');
          setTimeout(() => {
            if (window.gsap && window.gsap.registerPlugin) {
              try {
              window.gsap.registerPlugin(ScrollTrigger);
              console.log('✅ ScrollTrigger registered');
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
      #preloader{position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:1}
      #preloader .counter{font-family:monospace;font-size:0.8rem;color:white;text-align:center;letter-spacing:0.1em;display:inline-block}
      #preloader .digit{display:inline-block;opacity:1;animation:pulse 2s ease-in-out infinite}
      #preloader.loading .digit{animation:pulse 2s ease-in-out infinite}
      #preloader.counting .digit{animation:none}
      @keyframes pulse{0%,100%{opacity:1} 50%{opacity:0.5}}
      body.loading{overflow:hidden}
      body.loading *:not(#preloader):not(#preloader *):not(.nav):not(.nav *):not(.fake-nav):not(.fake-nav *):not(.w-layout-grid.nav):not(.w-layout-grid.nav *):not([data-mask-setup]):not(.mask-wrap):not(.mask-wrap *){opacity:0!important;visibility:hidden!important}
      
      /* REMOVE animations-ready hiding to prevent slide-up effects */
      
      .nav:not(.fake-nav){opacity:0}
      .nav-middle, .nav-bottom, .middle-nav, .bottom-nav, .nav[class*="middle"], .nav[class*="bottom"]{opacity:1!important}
      .flex-grid{margin-top:0.2vw!important}
    `;
    document.head.appendChild(style);

    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.className = 'loading';
    preloader.innerHTML = '<div class="counter"><span class="digit">0</span><span class="digit">0</span><span class="digit">1</span></div>';
    document.body.appendChild(preloader);
    document.body.classList.add('loading');
    
    // Show immediately, no delay
    console.log('🎬 Preloader visible immediately with pulsing digits');
    return preloader;
  }

  // Initialize preloader with image loading tracking
  function initPreloader() {
    loadGSAP();
    
    // Wait for GSAP to load before starting preloader
    function waitForGSAPThenStart() {
      if (typeof window.gsap !== 'undefined') {
        console.log('✅ GSAP ready, starting preloader');
        console.log('📊 GSAP version:', window.gsap.version);
        console.log('📊 ScrollTrigger available:', !!window.gsap.ScrollTrigger);
        startActualPreloader();
      } else {
        console.log('⏳ Still waiting for GSAP...', {
          gsap: typeof window.gsap,
          Webflow: typeof window.Webflow,
          readyState: document.readyState
        });
        setTimeout(waitForGSAPThenStart, 100);
      }
    }
    
    // Fallback: if GSAP doesn't load in 5 seconds, continue without it
    setTimeout(() => {
      if (!gsapLoaded) {
        console.warn('⚠️ GSAP failed to load in 5 seconds - continuing without enhanced animations');
        startActualPreloader();
      }
    }, 5000);
    
    waitForGSAPThenStart();
  }
  
  function startActualPreloader() {
    
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
    
    // Custom image preloading implementation
    const images = document.querySelectorAll('img');
    const totalImages = images.length;
    let loadedCount = 0;
    
    console.log(`🖼️ Preloader starting: Found ${totalImages} images to preload`);
    
    if (totalImages === 0) {
      console.log(`🖼️ No images found, completing preloader after brief delay`);
      preloader.className = 'counting';
      updateCounter(100);
      setTimeout(completePreloader, 1000); // Slight delay even with no images
      return;
    }
    
    function checkImageLoaded() {
      loadedCount++;
      const progress = (loadedCount / totalImages) * 100;
      updateCounter(progress);
      
      // Switch from pulsing to counting mode when images start loading
      if (loadedCount === 1) {
        preloader.className = 'counting';
        console.log('🎬 Images loading detected - switching to counting mode');
      }
      
      console.log(`🖼️ Image ${loadedCount}/${totalImages} loaded (${Math.round(progress)}%)`);
      
      // Wait for at least 10 images AND 80% of total before completing
      const minImagesLoaded = loadedCount >= 10;
      const majorityLoaded = loadedCount >= Math.ceil(totalImages * 0.8);
      const minThreshold = Math.ceil(totalImages * 0.8);
      
      console.log(`🔍 Progress check: ${loadedCount} loaded, need min 10 (${minImagesLoaded}) and ${minThreshold} for 80% (${majorityLoaded})`);
      
      if (minImagesLoaded && majorityLoaded) {
        console.log(`✅ Preloader completing: ${loadedCount}/${totalImages} images loaded (min 10 ✓, 80% ✓)`);
        setTimeout(completePreloader, 200);
      }
    }
    
    // Set up loading listeners for each image
    images.forEach((img, index) => {
      if (img.complete && img.naturalHeight !== 0) {
        // Image already loaded
        checkImageLoaded();
      } else {
        // Image not loaded yet
        img.addEventListener('load', checkImageLoaded);
        img.addEventListener('error', () => {
          console.warn(`⚠️ Image ${index + 1} failed to load:`, img.src);
          checkImageLoaded(); // Count failed images as "loaded" to prevent hanging
        });
        
        // Force load by setting src if it's not set
        if (!img.src && img.dataset.src) {
          img.src = img.dataset.src;
        }
      }
    });
    
    // Switch to counting mode after 3 seconds even if no images load (slow connection)
    setTimeout(() => {
      if (loadedCount === 0) {
        preloader.className = 'counting';
        console.log('🐌 Slow connection detected - switching to counting mode anyway');
      }
    }, 3000);
    
    // Fallback: complete after 10 seconds regardless
    setTimeout(() => {
      if (!preloaderComplete) {
        console.log(`⏰ Preloader timeout: Completing after 10 seconds`);
        preloader.className = 'counting';
        updateCounter(100);
        setTimeout(completePreloader, 200);
      }
    }, 10000);
  }

  // Complete preloader and start animations
  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    const preloader = document.getElementById('preloader');
    
    // Stop pulsing animation before fade out
    preloader.className = 'counting';
    
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
      // CSS transition fallback when GSAP isn't loaded
      preloader.style.transition = 'opacity 0.4s ease-out';
        preloader.style.opacity = '0'; 
        setTimeout(() => { 
          preloader.remove(); 
          document.body.classList.remove('loading');
          document.body.classList.add('animations-ready');
          setTimeout(() => {
            console.log('🚀 Starting animations after preloader');
            startPageAnimations();
            console.log('🚀 startPageAnimations completed');
            
            console.log('🚀 About to call initImageToggle...');
            try {
              initImageToggle();
              console.log('🚀 initImageToggle call completed successfully');
            } catch (error) {
              console.error('🚀 ERROR calling initImageToggle:', error);
            }
        }, 500);
      }, 400); 
    }
  }

  // Start all page animations after preloader with mobile optimization
  function startPageAnimations() {
    
    // Animate nav elements (excluding fake, middle, and bottom nav)
    const allNavElements = document.querySelectorAll('.nav:not(.fake-nav):not(.nav-middle):not(.nav-bottom):not(.middle-nav):not(.bottom-nav):not([class*="middle"]):not([class*="bottom"])');
    allNavElements.forEach(nav => {
      if (typeof gsap !== 'undefined') {
        gsap.to(nav, { y: 0, opacity: 1, duration: isMobile ? 0.5 : 0.8, ease: "power2.out" });
      } else {
        nav.style.transform = 'translateY(0)';
        nav.style.opacity = '1';
      }
    });
    
    // Start text animations immediately
    console.log('🎬 Starting text animations');
    console.log('🎬 About to call initTextAndOtherAnimations()');
    try {
      initTextAndOtherAnimations();
      console.log('✅ initTextAndOtherAnimations() completed');
    } catch (error) {
      console.error('❌ initTextAndOtherAnimations() failed:', error);
    }
    
    // Wait for text animations to mostly complete before starting images
    const imageDelay = 800; // Same delay for all devices
    setTimeout(() => {
      console.log('🎭 Starting masked image animations after text completion');
      startMaskedImageAnimations();
      
    }, imageDelay);
  }


  // Initialize hover effects - now handled by initLetterHoverEffects
  function initHover() {
    // Hover effects are now handled by initLetterHoverEffects() in initHeadingAnimations
    console.log('🔗 Hover effects handled by letter-based system');
  }

  // Simple scramble effect for individual lines - much slower
  function scrambleLine(element, duration = 800) {
    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frame = 0;
    const totalFrames = Math.floor(duration / 50); // 50ms per frame (faster)
    const revealSpeed = originalText.length / (totalFrames * 0.7); // Reveal 70% through animation
    
    const interval = setInterval(() => {
      let scrambledText = '';
      
      for (let i = 0; i < originalText.length; i++) {
        const revealPoint = i * revealSpeed;
        
        if (frame > revealPoint) {
          scrambledText += originalText[i];
        } else if (/[a-zA-Z]/.test(originalText[i])) {
          scrambledText += chars[Math.floor(Math.random() * chars.length)];
      } else {
          scrambledText += originalText[i]; // Keep spaces and punctuation
        }
      }
      
      element.textContent = scrambledText;
      frame++;
      
      if (frame >= totalFrames) {
          clearInterval(interval);
          element.textContent = originalText;
          
        // Handle special elements
    if (element.classList.contains('counter')) {
            element.dataset.counterStarted = 'true';
            startTimeCounter(element);
          }
          if (element.id === 'rotating-text') {
            element.dataset.rotatingStarted = 'true';
            try {
              startRotatingText(element);
            } catch (error) {
              console.error('🔄 Error starting rotating text:', error);
            }
          }
        }
    }, 100); // Slower interval to match frame rate
  }

  // Generate initial scrambled text
  function scrambleText(text) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return text.replace(/[a-zA-Z0-9]/g, () => chars[Math.floor(Math.random() * chars.length)]);
  }

  // Simple working scrambling for all visible text elements
  function initHeadingAnimations() {
    if (typeof window.gsap === 'undefined') {
      console.log('⚠️ GSAP not loaded yet, will try again...');
      return;
    }
    
    console.log('🎭 Starting SIMPLE working scrambling...');
    
    // Find all text elements - cast wide net
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .heading, p, span, div, a');
    const validElements = Array.from(textElements).filter(el => {
      const text = el.textContent?.trim();
      const hasChildren = el.children.length === 0; // No child elements
      const isVisible = window.getComputedStyle(el).display !== 'none';
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight + 200; // Include elements slightly below fold
      
      return text && text.length > 2 && text.length < 150 && hasChildren && isVisible && inViewport;
    });
    
    console.log(`🔍 Found ${validElements.length} text elements for scrambling`);
    
    // Apply line-by-line stagger reveal with scrambling (no fading)
    validElements.forEach((element, index) => {
      if (element.dataset.animationInit || element.dataset.infiniteClone) return;
      if (element.closest('.label-wrap')) return;
      
      element.dataset.animationInit = 'true';
      console.log(`🎯 [${index}] LINE-BY-LINE:`, element.textContent.substring(0, 40));
      
      // Start invisible for line-by-line reveal
      element.style.visibility = 'hidden';
      element.style.opacity = '1'; // No fading, just visibility
      
      // Prepare element for hover effects by wrapping letters in spans
      wrapLettersInSpans(element);
      
      // Line-by-line reveal with scrambling (faster stagger for clean sequential feel)
      const staggerDelay = index * 80; // 80ms between each line
    setTimeout(() => {
        console.log(`📍 Revealing line ${index}`);
        element.style.visibility = 'visible'; // Show immediately, no fade
        simpleScrambleText(element, 1000); // 1 second scramble
      }, staggerDelay);
    });
    
    // Setup hover effects after wrapping letters
    setTimeout(() => {
      initLetterHoverEffects();
    }, 500);
  }
  
  // Wrap individual letters in spans for hover effects
  function wrapLettersInSpans(element) {
    const text = element.textContent;
    let wrappedHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === ' ') {
        wrappedHTML += ' '; // Keep spaces unwrapped
      } else {
        wrappedHTML += `<span class="letter">${char}</span>`;
      }
    }
    
    element.innerHTML = wrappedHTML;
    console.log(`📝 Wrapped letters for: ${text.substring(0, 20)}`);
  }
  
  // Simple, reliable text scrambling
  function simpleScrambleText(element, duration = 1200) {
    const spans = element.querySelectorAll('.letter');
    if (spans.length === 0) return;
    
    const originalLetters = Array.from(spans).map(span => span.textContent);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    console.log(`🎬 Starting scramble for ${originalLetters.length} letters`);
    
    let frame = 0;
    const totalFrames = duration / 60; // 60ms intervals
      
      const interval = setInterval(() => {
      spans.forEach((span, i) => {
        const revealPoint = (i / spans.length) * totalFrames * 0.8;
        
        if (frame > revealPoint) {
          span.textContent = originalLetters[i]; // Revealed
    } else {
          if (/[a-zA-Z0-9]/.test(originalLetters[i])) {
            span.textContent = chars[Math.floor(Math.random() * chars.length)]; // Scrambled
          } else {
            span.textContent = originalLetters[i]; // Keep punctuation
          }
        }
      });
      
      frame++;
      
      if (frame >= totalFrames) {
          clearInterval(interval);
        // Ensure all letters are revealed
        spans.forEach((span, i) => {
          span.textContent = originalLetters[i];
        });
        console.log(`✅ Completed scrambling`);
      }
    }, 60);
  }
  
  // Letter hover effects + whole-word link scrambling
  function initLetterHoverEffects() {
    
    if (isMobile) {
      console.log('📱 Mobile detected - skipping hover effects for touch devices');
      return; // Exit early, no hover effects on mobile (touch doesn't need hover)
    }
    
    const letterElements = document.querySelectorAll('.letter');
    console.log(`🎯 Setting up hover effects for ${letterElements.length} letters`);
    
    // Regular letter bouncing for non-links
    letterElements.forEach((letter, i) => {
      const parentElement = letter.closest('a, .link');
      const isLink = parentElement && parentElement.tagName === 'A';
      
      if (!isLink) {
        letter.addEventListener('mouseenter', () => {
          if (window.gsap) {
            window.gsap.to(letter, {
              y: -15,
              duration: 0.3,
              delay: i * 0.02, // Stagger delay
              ease: "power2.out"
            });
          }
        });
        
        letter.addEventListener('mouseleave', () => {
          if (window.gsap) {
            window.gsap.to(letter, {
              y: 0,
              duration: 0.3,
              delay: i * 0.02, // Stagger delay
              ease: "power2.in"
            });
          }
        });
      }
    });
    
    // Whole-word hover scrambling for links
    const linkElements = document.querySelectorAll('a');
    linkElements.forEach(link => {
      const letters = link.querySelectorAll('.letter');
      if (letters.length === 0) return; // Skip links without letter spans
      
      console.log(`🔗 Setting up whole-word scramble for: "${link.textContent.trim()}"`);
      
      link.addEventListener('mouseenter', () => {
        console.log(`🔥 Scrambling entire link: "${link.textContent.trim()}"`);
        
        // Bouncy movement for all letters in the link
        if (window.gsap) {
          letters.forEach((letter, i) => {
            window.gsap.to(letter, {
              y: -15,
              duration: 0.3,
              delay: i * 0.02,
              ease: "power2.out"
            });
          });
        }
        
        // Start scrambling the entire word
        startWordScramble(link);
      });
      
      link.addEventListener('mouseleave', () => {
        console.log(`🔥 Stopping scramble for: "${link.textContent.trim()}"`);
        
        // Return letters to original position
        if (window.gsap) {
          letters.forEach((letter, i) => {
            window.gsap.to(letter, {
              y: 0,
              duration: 0.3,
              delay: i * 0.02,
              ease: "power2.in"
            });
          });
        }
        
        // Stop scrambling the word
        stopWordScramble(link);
      });
    });
  }
  
  // Start scrambling entire word on hover
  function startWordScramble(linkElement) {
    if (linkElement.wordScrambleInterval) return; // Already scrambling
    
    const letters = linkElement.querySelectorAll('.letter');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Store original text
    linkElement.originalLetters = Array.from(letters).map(letter => letter.textContent);
    
    linkElement.wordScrambleInterval = setInterval(() => {
      letters.forEach(letter => {
        if (/[a-zA-Z0-9]/.test(letter.textContent)) {
          letter.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
    }, 80); // Fast scramble
  }
  
  // Stop scrambling and restore original word
  function stopWordScramble(linkElement) {
    if (linkElement.wordScrambleInterval) {
      clearInterval(linkElement.wordScrambleInterval);
      linkElement.wordScrambleInterval = null;
      
      // Restore original letters
      if (linkElement.originalLetters) {
        const letters = linkElement.querySelectorAll('.letter');
        letters.forEach((letter, i) => {
          if (linkElement.originalLetters[i] !== undefined) {
            letter.textContent = linkElement.originalLetters[i];
          }
        });
      }
    }
  }
  
  // Visible line scrambling that handles multiple simultaneous lines
  function scrambleTextLineVisible(element, lineText, lineIndex, duration = 800, originalText) {
    // Initialize element scramble state if not exists
    if (!element.scrambleState) {
      element.scrambleState = {
        originalText: originalText || element.textContent,
        lines: [],
        activeScrambles: new Map(),
        updateInterval: null
      };
    }
    
    const state = element.scrambleState;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const totalFrames = Math.floor(duration / 80); // 80ms per frame for visible effect
    const revealSpeed = lineText.length / (totalFrames * 0.7);
    
    // Add this line to active scrambles
    state.activeScrambles.set(lineIndex, {
      text: lineText,
      frame: 0,
      totalFrames: totalFrames,
      revealSpeed: revealSpeed,
      startTime: Date.now()
    });
    
    console.log(`🎬 Started line scrambling ${lineIndex}: "${lineText}" for ${duration}ms`);
    
    // Start the update loop if not already running
    if (!state.updateInterval) {
      state.updateInterval = setInterval(() => {
        let displayText = state.originalText;
        let completedScrambles = [];
        
        // Process each active scramble
        state.activeScrambles.forEach((scramble, index) => {
          const lineStart = state.originalText.indexOf(scramble.text);
          if (lineStart !== -1) {
            let scrambledLine = '';
            
            // Generate scrambled version of this line
            for (let i = 0; i < scramble.text.length; i++) {
              const revealPoint = i * scramble.revealSpeed;
              
              if (scramble.frame > revealPoint) {
                scrambledLine += scramble.text[i]; // Revealed character
              } else if (/[a-zA-Z0-9]/.test(scramble.text[i])) {
                scrambledLine += chars[Math.floor(Math.random() * chars.length)]; // Scrambled character
    } else {
                scrambledLine += scramble.text[i]; // Keep spaces and punctuation
              }
            }
            
            // Replace this line in the display text
            displayText = displayText.substring(0, lineStart) + scrambledLine + displayText.substring(lineStart + scramble.text.length);
          }
          
          scramble.frame++;
          
          // Check if this scramble is complete
          if (scramble.frame >= scramble.totalFrames) {
            completedScrambles.push(index);
          }
        });
        
        // Update the element with combined scrambled text
        element.textContent = displayText;
        
        // Remove completed scrambles
        completedScrambles.forEach(index => {
          console.log(`✅ Completed line scrambling ${index}`);
          state.activeScrambles.delete(index);
        });
        
        // Stop the update loop if no more active scrambles
        if (state.activeScrambles.size === 0) {
          clearInterval(state.updateInterval);
          state.updateInterval = null;
          element.textContent = state.originalText; // Final restore
          
          // Handle special elements
          if (element.classList.contains('counter')) {
            element.dataset.counterStarted = 'true';
            startTimeCounter(element);
          }
          
          if (element.id === 'rotating-text') {
            element.dataset.rotatingStarted = 'true';
              startRotatingText(element);
          }
          
          console.log(`🎉 All line scrambles completed for: ${element.textContent.substring(0, 30)}`);
        }
      }, 80); // 80ms update interval for smooth effect
    }
  }
  
  // Simple, super visible element scrambling (backup function)
  function scrambleEntireElement(element, duration = 2000) {
    const originalText = element.textContent.trim();
    if (!originalText) return;
    
    console.log(`🎬 SCRAMBLING "${originalText}" for ${duration}ms`);
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let frame = 0;
    const totalFrames = Math.floor(duration / 100); // 100ms per frame for very visible effect
    const revealSpeed = originalText.length / (totalFrames * 0.6); // Slower reveal
    
    const interval = setInterval(() => {
      let scrambledText = '';
      
      for (let i = 0; i < originalText.length; i++) {
        const revealPoint = i * revealSpeed;
        
        if (frame > revealPoint) {
          scrambledText += originalText[i]; // Revealed character
        } else if (/[a-zA-Z0-9]/.test(originalText[i])) {
          scrambledText += chars[Math.floor(Math.random() * chars.length)]; // Scrambled character
        } else {
          scrambledText += originalText[i]; // Keep spaces and punctuation
        }
      }
      
      element.textContent = scrambledText;
      frame++;
      
      if (frame >= totalFrames) {
        clearInterval(interval);
        element.textContent = originalText;
        console.log(`✅ COMPLETED scrambling "${originalText}"`);
        
        // Handle special elements
        if (element.classList.contains('counter')) {
          element.dataset.counterStarted = 'true';
          startTimeCounter(element);
        }
        
        if (element.id === 'rotating-text') {
          element.dataset.rotatingStarted = 'true';
          startRotatingText(element);
        }
      }
    }, 100); // Slower update for visibility
  }
  
  // Detect text lines without DOM manipulation
  function detectTextLines(element) {
    const text = element.textContent.trim();
    const words = text.split(' ');
    const style = window.getComputedStyle(element);
    const elementWidth = element.offsetWidth;
    
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.cssText = `
      visibility: hidden;
      position: absolute;
      white-space: nowrap;
      font-family: ${style.fontFamily};
      font-size: ${style.fontSize};
      font-weight: ${style.fontWeight};
      letter-spacing: ${style.letterSpacing};
    `;
    document.body.appendChild(tempSpan);
    
    const lines = [];
    let currentLine = '';
    
    words.forEach((word, index) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      tempSpan.textContent = testLine;
      
      if (tempSpan.offsetWidth > elementWidth && currentLine) {
        // Start new line
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    // Add the last line
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    
    document.body.removeChild(tempSpan);
    
    // If no lines detected or single line, return the full text as one line
    return lines.length > 0 ? lines : [text];
  }
  
  // Enhanced line scrambling that handles multiple simultaneous lines
  function scrambleTextLine(element, lineText, lineIndex, duration = 600) {
    // Initialize element scramble state if not exists
    if (!element.scrambleState) {
      element.scrambleState = {
        originalText: element.textContent,
        lines: [],
        activeScrambles: new Map(),
        updateInterval: null
      };
    }
    
    const state = element.scrambleState;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const totalFrames = Math.floor(duration / 50); // 50ms per frame for smoother effect
    const revealSpeed = lineText.length / (totalFrames * 0.75);
    
    // Add this line to active scrambles
    state.activeScrambles.set(lineIndex, {
      text: lineText,
      frame: 0,
      totalFrames: totalFrames,
      revealSpeed: revealSpeed,
      startTime: Date.now()
    });
    
    console.log(`🎬 Started scrambling line ${lineIndex}: "${lineText.substring(0, 20)}" for ${duration}ms`);
    
    // Start the update loop if not already running
    if (!state.updateInterval) {
      state.updateInterval = setInterval(() => {
        let displayText = state.originalText;
        let completedScrambles = [];
        
        // Process each active scramble
        state.activeScrambles.forEach((scramble, index) => {
          const lineStart = state.originalText.indexOf(scramble.text);
          if (lineStart !== -1) {
            let scrambledLine = '';
            
            // Generate scrambled version of this line
            for (let i = 0; i < scramble.text.length; i++) {
              const revealPoint = i * scramble.revealSpeed;
              
              if (scramble.frame > revealPoint) {
                scrambledLine += scramble.text[i]; // Revealed character
              } else if (/[a-zA-Z]/.test(scramble.text[i])) {
                scrambledLine += chars[Math.floor(Math.random() * chars.length)]; // Scrambled character
      } else {
                scrambledLine += scramble.text[i]; // Keep spaces and punctuation
              }
            }
            
            // Replace this line in the display text
            displayText = displayText.substring(0, lineStart) + scrambledLine + displayText.substring(lineStart + scramble.text.length);
          }
          
          scramble.frame++;
          
          // Check if this scramble is complete
          if (scramble.frame >= scramble.totalFrames) {
            completedScrambles.push(index);
          }
        });
        
        // Update the element with combined scrambled text
        element.textContent = displayText;
        
        // Remove completed scrambles
        completedScrambles.forEach(index => {
          console.log(`✅ Completed scrambling line ${index}`);
          state.activeScrambles.delete(index);
        });
        
        // Stop the update loop if no more active scrambles
        if (state.activeScrambles.size === 0) {
          clearInterval(state.updateInterval);
          state.updateInterval = null;
          element.textContent = state.originalText; // Final restore
          
          // Handle special elements
      if (element.classList.contains('counter')) {
            element.dataset.counterStarted = 'true';
            startTimeCounter(element);
          }
          
          if (element.id === 'rotating-text') {
            element.dataset.rotatingStarted = 'true';
            startRotatingText(element);
          }
          
          console.log(`🎉 All lines completed for element: ${element.textContent.substring(0, 30)}`);
        }
      }, 50); // 50ms update interval
    }
  }

  // Wrap text lines for animation (simplified for hover effects only)
  function wrapLines(el) {
    // DISABLED: This function was creating text duplication by modifying innerHTML
    console.log('🚫 wrapLines disabled to prevent text duplication');
    el.dataset.splitDone = 'true';
    return [el]; // Return the original element, no DOM manipulation
  }

  // Fix container responsiveness and window coverage issues
  function fixContainerResponsiveness() {
    console.log('📐 Fixing container responsiveness');
    
    // Target main containers that might have responsiveness issues
    const containers = document.querySelectorAll('.container, .main-wrapper, .page-wrapper, .flex-grid, .w-layout-grid, main, body');
    
    containers.forEach((container, index) => {
      if (!container) return;
      
      console.log(`📐 Processing container ${index}: ${container.className || container.tagName}`);
      
      // Ensure containers are responsive and cover window properly
      const currentStyle = getComputedStyle(container);
      
      // Fix common responsiveness issues
      if (container.tagName.toLowerCase() === 'body') {
        // Ensure body covers full viewport
        container.style.cssText += `
          min-height: 100vh !important;
          width: 100% !important;
          overflow-x: hidden !important;
        `;
      } else if (container.classList.contains('container') || container.classList.contains('main-wrapper') || container.classList.contains('page-wrapper')) {
        // Main content containers
        container.style.cssText += `
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100vh !important;
          box-sizing: border-box !important;
        `;
      } else if (container.classList.contains('flex-grid') || container.classList.contains('w-layout-grid')) {
        // Grid containers
        container.style.cssText += `
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        `;
      }
      
      // Add resize listener to maintain responsiveness
      if (index === 0) { // Only add once
        window.addEventListener('resize', () => {
          console.log('📐 Window resized, updating container dimensions');
          // Force recalculation of container dimensions
          containers.forEach(c => {
            if (c && c.style) {
              c.style.width = '100%';
              c.style.maxWidth = '100%';
            }
          });
        });
      }
    });
    
    // Also fix any fixed-positioned elements that might cause issues
    const fixedElements = document.querySelectorAll('.fixed-full, [style*="position: fixed"], [style*="position:fixed"]');
    fixedElements.forEach((element, index) => {
      console.log(`📐 Fixing fixed element ${index}: ${element.className}`);
      element.style.cssText += `
        width: 100vw !important;
        height: 100vh !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
      `;
    });
    
    console.log(`📐 Fixed ${containers.length} containers and ${fixedElements.length} fixed elements`);
  }

  // Text and other animations (non-masked content) - SIMPLIFIED TO PREVENT DUPLICATION
  function initTextAndOtherAnimations() {
    isInit = true;
    console.log('🎬 SIMPLIFIED: Starting text scrambling only...');
    
    if (isMobile) {
      console.log('📱 Mobile detected - using text scrambling (keeping desktop parity)');
      // Continue with normal text animations on mobile for parity
    }
    
    // Remove the class that keeps content hidden
    document.body.classList.remove('animations-ready');
    
    // DO NOT reset all element visibility - this was causing issues
    console.log('🚫 Skipping global visibility reset to prevent conflicts');
    // SUPER SIMPLE: Just start heading animations, nothing else
    console.log('✨ SIMPLIFIED: Only doing heading scrambling to prevent duplication');
    
    // Start heading animations immediately
    setTimeout(() => {
      console.log('🎯 Starting initHeadingAnimations...');
      initHeadingAnimations();
    }, 100);
    
    // EMERGENCY FALLBACK: If no headings found, try to scramble ANY visible text
        setTimeout(() => {
      console.log('🚨 EMERGENCY FALLBACK: Looking for ANY text elements...');
      const allTextElements = document.querySelectorAll('*');
      const textElements = Array.from(allTextElements).filter(el => {
        const text = el.textContent?.trim();
        const hasChildren = el.children.length > 0;
        const isVisible = window.getComputedStyle(el).display !== 'none';
        return text && text.length > 3 && text.length < 100 && !hasChildren && isVisible;
      });
      
      console.log(`🚨 EMERGENCY: Found ${textElements.length} potential text elements:`, 
        textElements.slice(0, 10).map(el => el.textContent.substring(0, 30))
      );
      
      // Scramble the first few elements as a test
      textElements.slice(0, 5).forEach((el, i) => {
        if (!el.dataset.animationInit) {
          console.log(`🚨 EMERGENCY scrambling:`, el.textContent.substring(0, 30));
    setTimeout(() => {
            scrambleEntireElement(el, 3000);
          }, i * 500);
        }
      });
    }, 2000);
    
    // Start a few special elements but SKIP everything else that causes duplication
    const counter = document.querySelector('.counter');
    if (counter && !counter.closest('.label-wrap') && !counter.dataset.infiniteClone) {
      console.log('🔢 Scrambling counter');
      setTimeout(() => scrambleLine(counter, 800), 200);
    }
    
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText && !rotatingText.dataset.infiniteClone) {
      console.log('🔄 Scrambling rotating text');
      setTimeout(() => scrambleLine(rotatingText, 800), 400);
    }
    
    console.log('✅ Text animations complete - now setting up infinite scroll');
    
    // Fix container responsiveness
    fixContainerResponsiveness();
    
    // Setup infinite scroll after text animations
    
    console.log('🔄 About to call setupInfiniteScroll()');
    try {
      setupInfiniteScroll();
      console.log('✅ setupInfiniteScroll() completed successfully');
        } catch (error) {
      console.error('❌ setupInfiniteScroll() failed:', error);
    }
  }
  
  // Masked image animations - unified for all devices
  function startMaskedImageAnimations() {
    console.log('🎭 Starting mask animations (unified for all devices)');
    
    typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && window.gsap.registerPlugin(window.gsap.ScrollTrigger);
    
    // Mobile-optimized mask reveal for images (include clones, exclude preloader)  
    const allImages = document.querySelectorAll('img:not(#preloader img), video');
    console.log(`🎭 Found ${allImages.length} images to process for mask animations`);
    console.log(`📱 Mobile device detected: ${isMobile}`);
  
  // Mobile optimization: animate above fold, preload below fold
  if (isMobile) {
    console.log('📱 Mobile detected - selective optimization (above fold animations, below fold preload)');
    
    // Animate first ~5 images above the fold with masks like desktop
    const aboveFoldImages = Array.from(allImages).slice(0, 5);
    const belowFoldImages = Array.from(allImages).slice(5, 15); // Preload next 10
    const remainingImages = Array.from(allImages).slice(15);
    
    // Show below fold and remaining images with smooth fade stagger (no heavy mask animations)
    [...belowFoldImages, ...remainingImages].forEach((img, index) => {
      console.log(`📱 Setting up fade stagger for image ${index}:`, img.src || img.tagName);
      
      // Mark as mobile fade processed to prevent other systems from interfering
      img.dataset.mobileFadeProcessed = 'true';
      
      // Start hidden then fade in with stagger
      img.style.setProperty('opacity', '0', 'important');
      img.style.setProperty('visibility', 'visible', 'important');
      img.style.setProperty('display', 'block', 'important');
      
      // Simple fade in with stagger delay
      const delay = index * 150 + 500; // Increased stagger and delay for visibility
      console.log(`📱 Image ${index} will fade in after ${delay}ms`);
      
      setTimeout(() => {
        console.log(`📱 Starting fade for image ${index}`);
        if (window.gsap) {
          window.gsap.to(img, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
              console.log(`📱 Fade complete for image ${index}`);
            }
          });
        } else {
          // Fallback without GSAP
          console.log(`📱 GSAP not available, showing image ${index} immediately`);
          img.style.setProperty('opacity', '1', 'important');
        }
      }, delay);
    });
    
    console.log(`📱 Mobile: Animating ${aboveFoldImages.length} above fold, preloading ${belowFoldImages.length}, showing ${remainingImages.length} remaining`);
    
    // NOW remove the emergency image hiding for mobile after fade stagger is set up
    const emergencyHide = document.getElementById('emergency-image-hide');
    if (emergencyHide) {
      emergencyHide.remove();
      console.log('🔧 Removed emergency image hiding for mobile fade stagger');
    }
    
    // Continue with mask animations only for above fold images
    // Update allImages to only include above fold for mask processing
    const originalAllImages = allImages;
    const aboveFoldNodeList = document.querySelectorAll('img:not(#preloader img), video');
    const filteredImages = Array.from(aboveFoldNodeList).slice(0, 5);
    
    // Replace allImages reference for the rest of this function
    allImages = filteredImages;
  } else {
    // Desktop: remove emergency hide normally
    const emergencyHide = document.getElementById('emergency-image-hide');
    if (emergencyHide) {
      emergencyHide.remove();
      console.log('🔧 Removed emergency image hiding for desktop mask animations');
    }
  }
    
    // Debug: Check if any images are already hidden
    const hiddenImages = Array.from(allImages).filter(img => {
      const computed = getComputedStyle(img);
      return computed.visibility === 'hidden' || computed.opacity === '0';
    });
    console.log(`🔍 Found ${hiddenImages.length} initially hidden images that need mask setup`);
    
    if (allImages.length) {
      // On mobile, only animate first 2 images immediately to reduce load even more
      const maxInitialImages = isMobile ? 2 : allImages.length;
      
      allImages.forEach((element, index) => {
        if (element.dataset.maskSetup) return;
        // Process both original and cloned images the same way
        const originalWidth = element.offsetWidth;
        const originalHeight = element.offsetHeight;
        
        if (originalWidth === 0 || originalHeight === 0) return;
        
        const parent = element.parentNode;
        const maskContainer = document.createElement('div');
        maskContainer.className = 'mask-wrap';
        maskContainer.style.cssText = `width:0px;height:${originalHeight}px;overflow:hidden;display:block;position:relative;margin:0;padding:0;line-height:0`;
        
        parent.insertBefore(maskContainer, element);
        maskContainer.appendChild(element);
        // Store original Webflow dimensions and styles before applying mask styles
        const computedStyle = getComputedStyle(element);
        element.dataset.webflowWidth = element.style.width || (computedStyle.width !== 'auto' ? computedStyle.width : '');
        element.dataset.webflowHeight = element.style.height || (computedStyle.height !== 'auto' ? computedStyle.height : '');
        element.dataset.webflowObjectFit = element.style.objectFit || computedStyle.objectFit;
        
        // Also store original CSS classes to preserve Webflow responsive behavior
        element.dataset.webflowClasses = element.className;
        
        // Preserve object-fit and other important properties while setting dimensions
        const objectFit = element.dataset.webflowObjectFit || 'cover';
        element.style.cssText = `width:${originalWidth}px!important;height:${originalHeight}px!important;display:block!important;margin:0!important;padding:0!important;opacity:1!important;visibility:visible!important;object-fit:${objectFit}!important`;
        element.dataset.maskSetup = 'true';
        element.dataset.originalMaskWidth = originalWidth;
        element.dataset.originalMaskHeight = originalHeight;
        
        // Force immediate opacity and visibility and clear any existing GSAP animations
        if (typeof window.gsap !== 'undefined') {
          window.gsap.set(element, { opacity: 1, clearProps: "opacity" });
        }
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('visibility', 'visible', 'important');
        console.log('🔧 Set mask image opacity to 1:', element);
        
        // Store the target width for animation
        maskContainer.dataset.targetWidth = originalWidth;
        
        const hasParallax = element.classList.contains('img-parallax');
        if (hasParallax) {
          window.gsap.set(element, { 
            scale: 1.2,
            onComplete: () => {
              // Ensure object-fit is preserved after scaling
              element.style.setProperty('object-fit', objectFit, 'important');
            }
          });
        }
        
        // Check if image is in viewport for immediate animation
        const rect = element.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inViewport && index < maxInitialImages) {
          // Animate images in viewport immediately with proper top-to-bottom order
          const staggerDelay = index * 0.2; // Consistent, slower stagger
          const duration = 1.2; // Same duration across all devices
          
          // Consistent easing for stability
          const easing = "power2.out";
          
          console.log(`🎭 Starting mask animation for image ${index}: width 0 → ${maskContainer.dataset.targetWidth}px`);
          window.gsap.to(maskContainer, { 
            width: maskContainer.dataset.targetWidth + 'px', 
            duration: duration, 
            ease: easing, 
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
          
          if (hasParallax && !isMobile) { // Disable parallax on mobile for performance
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: duration + 0.5, 
              ease: easing, 
              delay: staggerDelay,
              onComplete: () => {
                // Ensure object-fit is preserved after scaling animation
                element.style.setProperty('object-fit', objectFit, 'important');
                console.log('🎭 Preserved object-fit after parallax scaling:', objectFit);
              }
            });
          }
        } else {
          // Mobile: Skip scroll-based mask animations for better performance
          if (isMobile) {
            console.log('📱 Skipping scroll mask animations on mobile for performance');
            // Just show the image immediately on mobile
            window.gsap.set(maskContainer, { width: maskContainer.dataset.targetWidth + 'px' });
            element.dataset.gsapAnimated = 'mask-revealed-mobile';
            element.dataset.maskComplete = 'true';
          } else if (!isMobile) {
            // Desktop only: use optimized ScrollTrigger
          window.gsap.set(maskContainer, { width: '0px' });
          window.gsap.to(maskContainer, { 
            width: maskContainer.dataset.targetWidth + 'px', 
              duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { 
              trigger: element, 
              start: "top 90%", // Consistent trigger point
              end: "top center", 
              once: true,
              toggleActions: "play none none none"
            },
            onComplete: () => {
              element.dataset.gsapAnimated = 'mask-revealed';
              element.dataset.maskComplete = 'true';
            }
          });
          } else {
            // Mobile: show mask immediately without ScrollTrigger to prevent flickering
            console.log(`📱 Mobile: Showing mask immediately for image ${index} to prevent scroll flickering`);
            window.gsap.set(maskContainer, { width: maskContainer.dataset.targetWidth + 'px' });
            element.dataset.gsapAnimated = 'mask-revealed-mobile';
            element.dataset.maskComplete = 'true';
          }
          
          // Only add parallax on desktop
          if (hasParallax && !isMobile) {
            window.gsap.to(element, { 
              scale: 1.0, 
              duration: 1.2, 
              ease: "power2.out",
              scrollTrigger: { 
                trigger: element, 
                start: "top bottom", 
                end: "top center", 
                once: true 
              },
              onComplete: () => {
                // Ensure object-fit is preserved after ScrollTrigger scaling animation
                element.style.setProperty('object-fit', objectFit, 'important');
                console.log('🎭 Preserved object-fit after ScrollTrigger scaling:', objectFit);
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
    console.log('🔄 STARTING INFINITE SCROLL SETUP - DEBUG MODE');
    console.log('🔄 Document ready state:', document.readyState);
    console.log('🔄 Body exists:', !!document.body);
    
    // Back to simpler working selectors
    const selectors = ['.flex-grid', '.w-layout-grid', '[class*="grid"]', '.container', '.main-wrapper', '.page-wrapper', 'main'];
    let container = null;
    
    console.log('🔍 Searching for infinite scroll container...');
    for (const selector of selectors) {
      const found = document.querySelector(selector);
      console.log(`🔍 Checking ${selector}:`, found ? `Found with ${found.children.length} children` : 'Not found');
      if (found && found.children.length > 1) { 
        container = found; 
        console.log(`✅ SELECTED container: ${selector} with ${found.children.length} items`); 
        break; 
      }
    }
    
    if (!container) { 
      console.log('❌ NO CONTAINER FOUND for infinite scroll');
      console.log('🔍 Available elements with classes:', 
        [...document.querySelectorAll('[class]')].slice(0, 10).map(el => el.className)
      );
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
        // Exclude items that contain .reveal-full.new-fixed elements from cloning
        if (item.classList.contains('reveal-full') && item.classList.contains('new-fixed')) {
          console.log('🚫 Skipping cloning of .reveal-full.new-fixed element:', item.className);
          return;
        }
        
        // Also check if the item contains any .reveal-full.new-fixed descendants
        if (item.querySelector('.reveal-full.new-fixed')) {
          console.log('🚫 Skipping cloning of item containing .reveal-full.new-fixed descendant:', item.className);
          return;
        }
        
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
          // Don't mark as animated or mask setup - let them get proper mask animations
          
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
        
        // Special handling for images and videos in clones - prevent flickering
          clone.querySelectorAll('img, video').forEach((el, imgIndex) => {
            el.dataset.infiniteClone = 'true';
          
          // On mobile, show cloned images with fade stagger (no heavy mask animations)
          // On desktop, allow mask animations for cloned images
          if (isMobile) {
            // Start hidden then fade in with stagger
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('visibility', 'visible', 'important');
            el.style.setProperty('display', 'block', 'important');
            
            // Fade in with stagger delay
            setTimeout(() => {
              if (window.gsap) {
                window.gsap.to(el, {
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out"
                });
            } else {
                el.style.setProperty('opacity', '1', 'important');
              }
            }, imgIndex * 80 + 300); // 80ms stagger for cloned images
            
            console.log(`📱 Mobile: Clone image ${imgIndex} will fade in smoothly`);
          } else {
            // Desktop: prepare for mask animations but don't show yet
            console.log(`🖥️ Desktop: Clone image ${imgIndex} prepared for mask animation`);
          }
        });
        
        // Add slight delay for mask system processing
            setTimeout(() => {
          clone.querySelectorAll('img, video').forEach((el, imgIndex) => {
            // Remove any existing mask setup flags so they get fresh animations
            delete el.dataset.maskSetup;
            delete el.dataset.gsapAnimated;
            
            // Remove mask container so clones get fresh setup like original images
            const maskContainer = el.closest('.mask-wrap');
            if (maskContainer) {
              // Unwrap the image from existing mask
              const parent = maskContainer.parentNode;
              parent.insertBefore(el, maskContainer);
              maskContainer.remove();
            }
            
            console.log(`🔧 Clone image ${imgIndex} prepared for mask system`);
          });
        }, 50); // Small delay to ensure layout is complete
        
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
        
        // Let the main mask animation system handle cloned images naturally
        // Trigger mask animations for any new images that weren't processed yet
        setTimeout(() => {
          console.log('🎭 Triggering mask animations for any unprocessed images...');
          if (typeof window.gsap !== 'undefined') {
            const unprocessedImages = document.querySelectorAll('img:not([data-mask-setup]):not(#preloader img), video:not([data-mask-setup])');
            console.log(`🎭 Found ${unprocessedImages.length} unprocessed images for mask setup`);
            
            unprocessedImages.forEach((img, i) => {
              console.log(`🎭 Processing unprocessed image ${i}:`, img.src?.substring(0, 50) + '...');
            });
            
            // Call the main mask animation function to process any new images
            if (unprocessedImages.length > 0) {
              startMaskedImageAnimations();
            }
          }
        }, 500);
      });
      
      console.log(`✅ Added ${originalItems.length} more items with protected visibility`);
      
      // Refresh ScrollTrigger with nav protection (desktop only)
      if (typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && !isMobile) {
        // Store nav element styles before refresh (exclude middle/bottom nav)
        const navElements = document.querySelectorAll('.nav:not(.fake-nav):not(.nav-middle):not(.nav-bottom):not(.middle-nav):not(.bottom-nav):not([class*="middle"]):not([class*="bottom"]), .w-layout-grid.nav, .top-right-nav');
        console.log(`🔍 Found ${navElements.length} nav elements for infinite scroll protection:`, [...navElements].map(el => el.className));
        const navStyles = [];
        navElements.forEach((nav, index) => {
          navStyles[index] = {
            opacity: nav.style.opacity || getComputedStyle(nav).opacity,
            transform: nav.style.transform || getComputedStyle(nav).transform,
            visibility: nav.style.visibility || getComputedStyle(nav).visibility
          };
        });
        
        window.gsap.ScrollTrigger.refresh();
        
        // Restore nav element styles after refresh
        setTimeout(() => {
          navElements.forEach((nav, index) => {
            if (navStyles[index]) {
              nav.style.setProperty('opacity', '1', 'important');
              nav.style.setProperty('transform', 'translateY(0)', 'important');
              nav.style.setProperty('visibility', 'visible', 'important');
              console.log('🔧 Restored nav element:', nav.className, 'opacity:', nav.style.opacity);
            }
          });
          console.log('🔧 Protected nav elements during infinite scroll refresh');
        }, 50);
      }
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
    console.log('🔄 Infinite scroll event listener attached to window');
    
    // Test scroll immediately
    setTimeout(() => {
      console.log('🔄 Testing initial scroll state...');
      handleScroll();
    }, 1000);
    
    // Separate resize handler with nav protection (desktop only)
    window.addEventListener('resize', () => {
      if (typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && !isMobile) {
        // Store nav element styles before refresh - exclude middle/bottom nav
        const navElements = document.querySelectorAll('.nav:not(.fake-nav):not(.nav-middle):not(.nav-bottom):not(.middle-nav):not(.bottom-nav):not([class*="middle"]):not([class*="bottom"]), .w-layout-grid.nav, .top-right-nav, .nav-left, .left-nav');
        console.log(`🔍 Found ${navElements.length} nav elements for resize protection:`, [...navElements].map(el => el.className));
        const navStyles = [];
        navElements.forEach((nav, index) => {
          navStyles[index] = {
            opacity: nav.style.opacity || getComputedStyle(nav).opacity,
            transform: nav.style.transform || getComputedStyle(nav).transform,
            visibility: nav.style.visibility || getComputedStyle(nav).visibility
          };
        });
        
        // Refresh ScrollTrigger
        setTimeout(() => {
          window.gsap.ScrollTrigger.refresh();
          
          // Restore nav element styles after refresh
          navElements.forEach((nav, index) => {
            if (navStyles[index]) {
              nav.style.setProperty('opacity', '1', 'important');
              nav.style.setProperty('transform', 'translateY(0)', 'important');
              nav.style.setProperty('visibility', 'visible', 'important');
              nav.style.setProperty('display', 'block', 'important');
              console.log('🔧 Restored resize nav element:', nav.className, 'opacity:', nav.style.opacity);
            }
          });
          
          // EXTRA PROTECTION: Force navigation to stay visible during resize (exclude middle/bottom nav)
          document.querySelectorAll('[class*="nav"], [id*="nav"], .navigation, .menu').forEach(el => {
            if (!el.classList.contains('fake-nav') && 
                !el.classList.contains('nav-middle') && 
                !el.classList.contains('nav-bottom') && 
                !el.classList.contains('middle-nav') && 
                !el.classList.contains('bottom-nav') &&
                !el.className.includes('middle') &&
                !el.className.includes('bottom')) {
              el.style.setProperty('opacity', '1', 'important');
              el.style.setProperty('visibility', 'visible', 'important');
            }
          });
          
          console.log('🔧 Protected nav elements during ScrollTrigger refresh');
        }, 100);
      }
    }, { passive: true });
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
    
    // Add manual test function
    window.testInfiniteScroll = function() {
      console.log('🔄 Manual infinite scroll test triggered');
      loadMoreItems();
      return 'Infinite scroll test completed';
    };
    
    window.getInfiniteScrollStatus = function() {
      return {
        active: window.infiniteScrollActive,
        container: container ? container.className : 'none',
        containerChildren: container ? container.children.length : 0,
        isLoading: isLoading
      };
    };
    
    console.log('🔄 Added window.testInfiniteScroll() and window.getInfiniteScrollStatus() for debugging');
    
    // Add function to fix hidden cloned images
    window.fixHiddenClonedImages = function() {
      console.log('🔧 Checking for hidden cloned images...');
      const clonedImages = document.querySelectorAll('img[data-infinite-clone="true"], video[data-infinite-clone="true"]');
      let fixedCount = 0;
      
      clonedImages.forEach((img, index) => {
        const computedStyle = getComputedStyle(img);
        if (computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
          console.log(`🔧 Fixing hidden cloned image ${index}:`, img.src?.substring(0, 50) + '...');
          img.style.setProperty('opacity', '1', 'important');
          img.style.setProperty('visibility', 'visible', 'important');
          img.style.setProperty('display', 'block', 'important');
          fixedCount++;
        }
      });
      
      console.log(`✅ Fixed ${fixedCount} hidden cloned images out of ${clonedImages.length} total`);
      return `Fixed ${fixedCount}/${clonedImages.length} hidden cloned images`;
    };
    
    console.log('🔧 Added window.fixHiddenClonedImages() for manual debugging');
    
    // Add mobile image debugging function
    window.fixMobileImages = function() {
      console.log('📱 Checking and fixing mobile image visibility...');
      const allImages = document.querySelectorAll('img:not(#preloader img), video');
      let fixedCount = 0;
      
      allImages.forEach((img, index) => {
        const computedStyle = getComputedStyle(img);
        const isHidden = computedStyle.visibility === 'hidden' || 
                        computedStyle.opacity === '0' || 
                        computedStyle.display === 'none';
        
        if (isHidden) {
          console.log(`📱 Fixing hidden mobile image ${index}:`, img.src?.substring(0, 50) + '...');
          img.style.setProperty('opacity', '1', 'important');
          img.style.setProperty('visibility', 'visible', 'important');
          img.style.setProperty('display', 'block', 'important');
          fixedCount++;
        }
      });
      
      console.log(`✅ Fixed ${fixedCount} hidden images out of ${allImages.length} total on mobile`);
      return `Fixed ${fixedCount}/${allImages.length} mobile images`;
    };
    
    console.log('📱 Added window.fixMobileImages() for mobile debugging');
    
    // Final ScrollTrigger refresh with nav protection (desktop only)
    if (typeof window.gsap !== 'undefined' && window.gsap.ScrollTrigger && !isMobile) {
      setTimeout(() => {
        // Store nav element styles before refresh (exclude middle/bottom nav)
        const navElements = document.querySelectorAll('.nav:not(.fake-nav):not(.nav-middle):not(.nav-bottom):not(.middle-nav):not(.bottom-nav):not([class*="middle"]):not([class*="bottom"]), .w-layout-grid.nav, .top-right-nav');
        console.log(`🔍 Found ${navElements.length} nav elements for final protection:`, [...navElements].map(el => el.className));
        const navStyles = [];
        navElements.forEach((nav, index) => {
          navStyles[index] = {
            opacity: nav.style.opacity || getComputedStyle(nav).opacity,
            transform: nav.style.transform || getComputedStyle(nav).transform,
            visibility: nav.style.visibility || getComputedStyle(nav).visibility
          };
        });
        
        window.gsap.ScrollTrigger.refresh();
        
        // Restore nav element styles after refresh
        setTimeout(() => {
          navElements.forEach((nav, index) => {
            if (navStyles[index]) {
              nav.style.setProperty('opacity', '1', 'important');
              nav.style.setProperty('transform', 'translateY(0)', 'important');
              nav.style.setProperty('visibility', 'visible', 'important');
              console.log('🔧 Restored final nav element:', nav.className, 'opacity:', nav.style.opacity);
            }
          });
          console.log('🔧 Protected nav elements during infinite scroll final refresh');
        }, 50);
      }, 100);
    }
  }

  // Cloned images now handled by main mask system - no separate function needed

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
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .hover-text, a:not(.nav a):not(.fake-nav a):not(.w-layout-grid.nav a)').forEach(el => { 
      // Skip elements inside .label-wrap to preserve Webflow hover interactions
      if (!el.closest('.label-wrap') && !el.classList.contains('initial-hidden')) { 
        el.classList.add('initial-hidden'); 
        el.style.opacity = '0'; 
      }
    });
    document.querySelectorAll('img, video, .nav:not(.w-layout-grid), .preloader-counter, .card-project, .fake-nav, .inner-top, .mobile-down').forEach(el => { if (!el.classList.contains('initial-hidden')) { el.classList.add('initial-hidden'); if (el.matches('.grid-down.project-down.mobile-down')) { el.style.transform = 'translateX(40px)'; el.style.opacity = '0'; }}});
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
    document.querySelectorAll('h1:not([data-infinite-clone]), h2:not([data-infinite-clone]), h3:not([data-infinite-clone]), h4:not([data-infinite-clone]), h5:not([data-infinite-clone]), h6:not([data-infinite-clone]), p:not([data-infinite-clone]), .hover-text:not([data-infinite-clone]), a:not(.nav a):not(.fake-nav a):not(.w-layout-grid.nav a):not([data-infinite-clone])').forEach(el => {
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

  // Fallback init - removed since main flow now waits for GSAP properly

  // Main initialization function with error protection
  function init() {
    if (isInit) return;
    
    function waitForGSAP() { 
      if (typeof window.gsap !== 'undefined') {
        requestAnimationFrame(() => { 
          try {
            console.log('✅ GSAP loaded, starting text animations');
            initTextAndOtherAnimations();
          } catch (error) {
            console.error('❌ Animation initialization error:', error);
            // Don't let our errors break Webflow
          }
        }); 
      } else {
        console.log('⏳ Waiting for GSAP...');
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
  
  // Rotating text functionality - called after scramble completes
  function startRotatingText(element) {
    if (!element) {
      console.error('🔄 No element provided to startRotatingText');
      return;
    }
    
    const texts = ['DC', 'SF', 'LA'];
    let currentIndex = 0;
    
    setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      element.textContent = texts[currentIndex];
    }, 2000);
    
    console.log('🔄 Rotating text started after scramble');
  }
  
  // Toggle functionality removed - was causing issues with cloned images
  
  // Start preloader with Webflow safety
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', waitForWebflow) : waitForWebflow();
  
  console.log('🚀 SCRIPT END: Animation system initialization completed');
})(window.portfolioAnimations);

console.log('🚀 SCRIPT FULLY EXECUTED: Animation script finished loading');