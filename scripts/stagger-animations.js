// GSAP Staggered Image Animations for Alex Lakas Portfolio
// Enhanced version with improved timing and effects

document.addEventListener('DOMContentLoaded', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Set initial state for all images with improved settings
    gsap.set("img", {
        opacity: 0,
        y: 60,
        scale: 0.85,
        rotation: 0.5
    });
    
    // Enhanced staggered scroll-triggered animation for images
    ScrollTrigger.batch("img", {
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
    
    // Enhanced project cards animation
    if (document.querySelectorAll('.project-card, [class*="component"], [class*="card"]').length > 0) {
        gsap.set(".project-card, [class*='component'], [class*='card']", {
            opacity: 0,
            y: 40,
            scale: 0.92
        });
        
        ScrollTrigger.batch(".project-card, [class*='component'], [class*='card']", {
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
    }
    
    // Enhanced text animation for headings
    if (document.querySelectorAll('h1, h2, h3, .heading').length > 0) {
        gsap.set("h1, h2, h3, .heading", {
            opacity: 0,
            y: 20
        });
        
        ScrollTrigger.batch("h1, h2, h3, .heading", {
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
    }
    
    // Enhanced refresh handling
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
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