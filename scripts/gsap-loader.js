// GSAP Loader for Alex Lakas Portfolio
// This script loads GSAP dependencies and custom animations

(function() {
    'use strict';
    
    // Load GSAP from CDN
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.error('Failed to load script:', src);
        };
        document.head.appendChild(script);
    }
    
    // Load GSAP core
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', function() {
        console.log('GSAP core loaded');
        
        // Load ScrollTrigger plugin
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', function() {
            console.log('ScrollTrigger loaded');
            
            // Load custom stagger animations
            loadScript('https://raw.githubusercontent.com/asl677/webflow-custom/main/scripts/stagger-animations.js', function() {
                console.log('Custom animations loaded');
            });
        });
    });
})(); 