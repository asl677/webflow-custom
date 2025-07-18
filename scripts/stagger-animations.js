// GSAP Staggered Image Animations for Alex Lakas Portfolio
// Enhanced version that waits for preloader and doesn't conflict with existing animations

document.addEventListener('DOMContentLoaded', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Wait for preloader to complete before initializing animations
    function initAnimations() {
        console.log('Initializing GSAP stagger animations');
        
        // Only animate elements that aren't already visible/animated
        const images = document.querySelectorAll("img, [class*='image']");
        const components = document.querySelectorAll("[id*='component'], [class*='component'], .w-node");
        const headings = document.querySelectorAll(".heading, h1, h2, h3");
        
        // Set initial state only for elements that aren't already visible
        images.forEach(img => {
            if (getComputedStyle(img).opacity !== "0") {
                gsap.set(img, {
                    opacity: 0,
                    y: 60,
                    scale: 0.85,
                    rotation: 0.5
                });
            }
        });
        
        // Enhanced staggered scroll-triggered animation for images
        ScrollTrigger.batch("img, [class*='image']", {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    duration: 1.2,
                    stagger: 0.12,
                    ease: "power3.out"
                });
            },
            start: "top bottom-=80",
            once: true
        });
        
        // Target components but exclude preloader elements
        components.forEach(comp => {
            if (!comp.closest('[class*="preload"]') && !comp.closest('[class*="loader"]')) {
                gsap.set(comp, {
                    opacity: 0,
                    y: 40,
                    scale: 0.92
                });
            }
        });
        
        ScrollTrigger.batch("[id*='component'], [class*='component'], .w-node", {
            onEnter: (elements) => {
                // Filter out preloader elements
                const filteredElements = elements.filter(el => 
                    !el.closest('[class*="preload"]') && !el.closest('[class*="loader"]')
                );
                
                if (filteredElements.length > 0) {
                    gsap.to(filteredElements, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: "power2.out"
                    });
                }
            },
            start: "top bottom-=60",
            once: true
        });
        
        // Target headings but avoid hero text that might be animated elsewhere
        headings.forEach(heading => {
            if (!heading.classList.contains('large') && !heading.classList.contains('large-2')) {
                gsap.set(heading, {
                    opacity: 0,
                    y: 20
                });
            }
        });
        
        ScrollTrigger.batch(".heading:not(.large):not(.large-2), h1, h2, h3", {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power2.out"
                });
            },
            start: "top bottom-=40",
            once: true
        });
        
        // Debug logging
        console.log('GSAP Animations initialized');
        console.log('Images found:', images.length);
        console.log('Components found:', components.length);
        console.log('Headings found:', headings.length);
        
        ScrollTrigger.refresh();
    }
    
    // Wait for preloader to complete
    function waitForPreloader() {
        // Check if preloader exists and is still visible
        const preloader = document.querySelector('[class*="preload"], [class*="loader"], .loading');
        
        if (preloader && getComputedStyle(preloader).display !== 'none') {
            console.log('Waiting for preloader to complete...');
            setTimeout(waitForPreloader, 100);
        } else {
            // Preloader is done, wait a bit more then initialize
            setTimeout(initAnimations, 500);
        }
    }
    
    // Start checking for preloader completion
    waitForPreloader();
    
    // Enhanced refresh handling
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
            console.log('ScrollTrigger refreshed after load');
        }, 1000);
    });
    
    // Optimized resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
    
    // Additional smooth scroll enhancement
    ScrollTrigger.addEventListener("scrollEnd", () => {
        ScrollTrigger.refresh();
    });
}); 