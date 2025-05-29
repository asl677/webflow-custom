// Version 1.0.1 - Lenis Smooth Scroll (Performance Optimized)
console.log('scroll.js version 1.0.1 loading...');

// Initialize Lenis after page content is ready
function initLenis() {
  // Initialize with optimized settings for performance
  const lenis = new Lenis({
    duration: 1,  // Reduced from 1.2
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Optimize scroll update frequency
  let rafId = null;
  
  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  
  // Start RAF loop
  requestAnimationFrame(raf);
  
  // Clean up function
  function cleanup() {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    lenis.destroy();
  }

  // Export instance and cleanup
  window.lenis = lenis;
  window.cleanupLenis = cleanup;
}

// Initialize only after content is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLenis);
} else {
  initLenis();
} 