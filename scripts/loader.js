// Script Loader v1.0.0
console.log('loader.js loaded');

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Keep execution order
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// Define scripts in loading order
const scripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js',
  'https://unpkg.com/lenis@1.3.3/dist/lenis.min.js',
  'https://asl677.github.io/webflow-custom/scripts/animations.js'
];

// Load scripts in sequence
async function loadScripts() {
  try {
    for (const script of scripts) {
      await loadScript(script);
      console.log(`Loaded: ${script}`);
    }
    console.log('All scripts loaded successfully');
  } catch (error) {
    console.error('Script loading error:', error);
  }
}

// Start loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadScripts);
} else {
  loadScripts();
} 