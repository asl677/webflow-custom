// GSAP Staggered Image Animations for Alex Lakas Portfolio
// Enhanced version targeting actual site elements

document.addEventListener('DOMContentLoaded', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Set initial state for all images (including those in your grid)
    gsap.set("img, [class*='image']", {
        opacity: 0,
        y: 60,
        scale: 0.85,
        rotation: 0.5
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
    
    // Target your actual component instances and elements
    gsap.set("[id*='component'], [class*='component'], .w-node", {
        opacity: 0,
        y: 40,
        scale: 0.92
    });
    
    ScrollTrigger.batch("[id*='component'], [class*='component'], .w-node", {
        onEnter: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "power2.out"
            });
        },
        start: "top bottom-=60",
        once: true
    });
    
    // Target your specific heading classes
    gsap.set(".heading, h1, h2, h3", {
        opacity: 0,
        y: 20
    });
    
    ScrollTrigger.batch(".heading, h1, h2, h3", {
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
    
    // Specifically target text elements that might be split
    gsap.set(".heading.large, .heading.large-2", {
        opacity: 0,
        y: 30
    });
    
    ScrollTrigger.batch(".heading.large, .heading.large-2", {
        onEnter: (elements) => {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        },
        start: "top bottom-=50",
        once: true
    });
    
    // Debug logging to see what's being targeted
    console.log('GSAP Animations initialized');
    console.log('Images found:', document.querySelectorAll("img, [class*='image']").length);
    console.log('Components found:', document.querySelectorAll("[id*='component'], [class*='component'], .w-node").length);
    console.log('Headings found:', document.querySelectorAll(".heading, h1, h2, h3").length);
    
    // Enhanced refresh handling
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
            console.log('ScrollTrigger refreshed after load');
        }, 100);
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