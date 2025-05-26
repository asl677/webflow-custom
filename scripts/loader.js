// Script Loader v1.0.1
console.log('loader.js loaded');

// Add Lenis CSS
function addLenisCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/lenis@1.1.9/dist/lenis.css';
  document.head.appendChild(link);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`Script already loaded: ${src}`);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Keep execution order
    script.onload = () => {
      console.log(`Loaded: ${src}`);
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// Define scripts in loading order
const scripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/SplitText.min.js',
  'https://unpkg.com/lenis@1.3.3/dist/lenis.min.js'
];

// Load scripts in sequence
async function loadScripts() {
  try {
    // Add Lenis CSS first
    addLenisCSS();

    // Load all dependency scripts
    for (const script of scripts) {
      await loadScript(script);
    }

    // Wait a moment for scripts to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Load animations script last
    await loadScript('https://asl677.github.io/webflow-custom/scripts/animations.js');
    
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