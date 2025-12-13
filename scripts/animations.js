// Portfolio Animations v9.1 - Clean & Simple
(function() {
  // === STYLES ===
    const style = document.createElement('style');
    style.textContent = `
    #preloader{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;transition:opacity 0.4s}
    .will-fade{opacity:0}
    .will-fade.visible{opacity:1;transition:opacity 0.8s ease-out}
    .toggle,.yzy{opacity:0;transition:opacity 0.6s}
    .toggle.show,.yzy.show{opacity:1}
    `;
    document.head.appendChild(style);

  console.log('🚀 Animations v9.1 loaded');

  // === PRELOADER ===
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
  preloader.innerHTML = '<p class="heading small link muted" id="preloader-text">001</p>';
    
  function initPreloader() {
    if (!document.body) return requestAnimationFrame(initPreloader);
    document.body.prepend(preloader);
    
    const text = document.getElementById('preloader-text');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const rand = () => chars[Math.floor(Math.random() * chars.length)];
    
    // Scramble in
    let frame = 0;
    const scrambleIn = setInterval(() => {
      frame++;
      text.textContent = frame > 3 ? '0' + rand() + rand() : rand() + rand() + rand();
      if (frame > 6) text.textContent = '00' + rand();
      if (frame > 9) { clearInterval(scrambleIn); text.textContent = '001'; countUp(); }
    }, 50);
    
    // Count up
    function countUp() {
      let n = 1;
      const counter = setInterval(() => {
        n = Math.min(100, n + Math.floor(Math.random() * 10) + 3);
        text.textContent = String(n).padStart(3, '0');
        if (n >= 100) { clearInterval(counter); scrambleOut(); }
      }, 50);
    }
    
    // Scramble out
    function scrambleOut() {
      let frame = 0;
      const out = setInterval(() => {
        frame++;
        text.textContent = rand() + rand() + rand();
        if (frame > 6) { clearInterval(out); finishPreloader(); }
      }, 50);
    }
  }
  
  function finishPreloader() {
        preloader.style.opacity = '0'; 
        setTimeout(() => { 
          preloader.remove(); 
      startAnimations();
      }, 400); 
  }

  // === MAIN ANIMATIONS ===
  function startAnimations() {
    initTextScramble();
    initImageFade();
    initHoverEffects();
    initSpecialElements();
    initColumnToggle();
    
    // Show toggle/yzy elements
    setTimeout(() => {
      document.querySelectorAll('.toggle, .yzy').forEach(el => el.classList.add('show'));
    }, 800);
  }

  // === TEXT SCRAMBLE ===
  function initTextScramble() {
    try {
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .heading, p:not(#preloader-text), a');
      let count = 0;
      
      elements.forEach((el, i) => {
        if (el.children.length > 0 || !el.textContent.trim()) return;
        if (el.closest('.label-wrap, #preloader, .w-draggable')) return;
        
        const original = el.textContent;
        if (original.length > 200) return; // Skip very long text
        
        const letters = original.split('').map(c => {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = c;
          span.dataset.original = c;
          return span;
        });
        
        el.textContent = '';
        letters.forEach(s => el.appendChild(s));
        count++;
        
        // Stagger scramble reveal
        setTimeout(() => scrambleReveal(el), i * 60);
      });
      
      console.log(`📝 Scrambled ${count} text elements`);
    } catch(err) {
      console.error('Text scramble error:', err);
    }
  }
  
  function scrambleReveal(el) {
    const letters = el.querySelectorAll('.letter');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
      
      const interval = setInterval(() => {
      frame++;
      letters.forEach((span, i) => {
        const orig = span.dataset.original;
        if (frame > i * 2) span.textContent = orig;
        else if (/[a-zA-Z0-9]/.test(orig)) span.textContent = chars[Math.floor(Math.random() * chars.length)];
      });
      if (frame > letters.length * 2) clearInterval(interval);
    }, 40);
  }

  // === IMAGE FADE ===
  function initImageFade() {
    try {
      const elements = document.querySelectorAll('.reveal-wrap, img:not(.reveal-wrap img), video');
      const viewport = [], below = [];
      
      console.log(`🎭 Found ${elements.length} images/videos`);
      
      elements.forEach(el => {
        if (el.closest('#preloader')) return;
        el.classList.add('will-fade');
        
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) viewport.push(el);
        else below.push(el);
      });
      
      // Force browser to render opacity:0 first
      void document.body.offsetHeight;
      
      // Sort by position, stagger viewport
      viewport.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      console.log(`🎭 Staggering ${viewport.length} viewport, ${below.length} below`);
      
      viewport.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 100 + i * 120);
      });
      
      // Scroll observer for below fold
      if (below.length) {
        let queue = [], processing = false;
        
        const processQueue = () => {
          if (processing || !queue.length) return;
          processing = true;
          queue.shift().classList.add('visible');
          setTimeout(() => { processing = false; processQueue(); }, 120);
        };
        
        const obs = new IntersectionObserver(entries => {
          entries.filter(e => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
            .forEach(e => { queue.push(e.target); obs.unobserve(e.target); });
          processQueue();
        }, { rootMargin: '100px', threshold: 0.1 });
        
        below.forEach(el => obs.observe(el));
      }
    } catch(err) {
      console.error('Image fade error:', err);
      // Fallback: show all images
      document.querySelectorAll('.will-fade').forEach(el => el.classList.add('visible'));
    }
  }

  // === HOVER EFFECTS ===
  function initHoverEffects() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    document.addEventListener('mouseenter', e => {
      const link = e.target?.closest?.('a');
      if (!link || link._scrambling) return;
      
      const letters = link.querySelectorAll('.letter');
      if (!letters.length) return;
      
      link._originals = Array.from(letters).map(l => l.textContent);
      link._scrambling = setInterval(() => {
        letters.forEach(l => {
          if (/[a-zA-Z0-9]/.test(l.dataset.original)) 
            l.textContent = chars[Math.floor(Math.random() * chars.length)];
        });
      }, 60);
    }, true);
    
    document.addEventListener('mouseleave', e => {
      const link = e.target?.closest?.('a');
      if (!link || !link._scrambling) return;
      
      clearInterval(link._scrambling);
      link._scrambling = null;
      link.querySelectorAll('.letter').forEach((l, i) => {
        l.textContent = link._originals?.[i] || l.dataset.original;
      });
    }, true);
  }

  // === SPECIAL ELEMENTS ===
  function initSpecialElements() {
    // Military time
    const timeEl = document.getElementById('time-text');
    if (timeEl) {
      const update = () => {
        const now = new Date();
        timeEl.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
          .map(n => String(n).padStart(2, '0')).join(':');
      };
      update();
      setInterval(update, 1000);
    }
    
    // Rotating text
    const rotating = document.getElementById('rotating-text');
    if (rotating) {
      const texts = ['DC', 'SF', 'LA'];
      let i = 0;
      setInterval(() => { i = (i + 1) % texts.length; rotating.textContent = texts[i]; }, 2000);
    }
    
    // Counter
    const counter = document.querySelector('.counter:not(#preloader-text)');
    if (counter) {
      const start = Date.now();
      setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        counter.textContent = String(Math.floor(s / 60)).padStart(2, '0') + String(s % 60).padStart(2, '0');
    }, 1000);
    }
  }

  // === COLUMN TOGGLE ===
  function initColumnToggle() {
    const toggle = document.querySelector('.fixed-sizer');
    const grid = document.querySelector('.flex-grid.yzy');
    if (!toggle || !grid) return;
    
    let cols = 4;
    toggle.addEventListener('click', () => {
      cols = cols === 2 ? 4 : cols - 1;
      grid.style.columnCount = cols;
      toggle.textContent = cols === 2 ? '−' : '+';
    });
  }

  // === PAGE TRANSITIONS ===
  document.addEventListener('click', e => {
    const link = e.target?.closest?.('a[href]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.hasAttribute('data-w-id') || link.closest('[data-w-id]')) return;
    if (!(href.startsWith('/') || href.startsWith(window.location.origin))) return;
    
    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s';
    setTimeout(() => window.location.href = href, 400);
  }, true);

  // === INIT ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
    } else {
      initPreloader();
    }
  })();
  