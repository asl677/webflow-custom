// Portfolio Animations v8.3
(function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = () => chars[Math.floor(Math.random() * chars.length)];
  
  // Inject CSS immediately via document.write for FOUC prevention
  document.write(`<style id="anim-css">
    #preloader{position:fixed;inset:0;background:transparent;z-index:99999;display:flex;align-items:center;justify-content:center;pointer-events:none}
    #preloader .digit{display:inline-block}
    body:not(.loaded) .reveal-wrap,
    body:not(.loaded) img:not(.w-lightbox-image):not([src*="preview"]),
    body:not(.loaded) video{opacity:0!important}
    .stagger-fade{transition:opacity 0.6s ease-out}
  </style>`);
  
  // Create preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
  preloader.innerHTML = `<p class="heading small link muted"><span class="digit">${rand()}</span><span class="digit">${rand()}</span><span class="digit">${rand()}</span></p>`;
  
  function init() {
    if (!document.body) return requestAnimationFrame(init);
    document.body.prepend(preloader);
    runPreloader();
  }
  
  function runPreloader() {
    const digits = preloader.querySelectorAll('.digit');
    let frame = 0;
    
    const scrambleIn = setInterval(() => {
      frame++;
      digits.forEach((d, i) => d.textContent = frame > (i + 1) * 4 ? '001'[i] : rand());
      if (frame >= 15) {
        clearInterval(scrambleIn);
        countUp();
      }
    }, 50);
    
    function countUp() {
      let count = 1;
      const counter = setInterval(() => {
        count = Math.min(100, count + 8);
        const str = count.toString().padStart(3, '0');
        digits[0].textContent = str[0];
        digits[1].textContent = str[1];
        digits[2].textContent = str[2];
        if (count >= 100) {
          clearInterval(counter);
          scrambleOut();
        }
      }, 50);
    }
    
    function scrambleOut() {
      let frame = 0;
      const out = setInterval(() => {
        frame++;
        digits.forEach(d => d.textContent = rand());
        if (frame >= 10) {
          clearInterval(out);
          finishPreloader();
        }
      }, 40);
    }
  }
  
  function finishPreloader() {
    document.body.classList.add('loaded');
    preloader.style.transition = 'opacity 0.3s';
        preloader.style.opacity = '0'; 
        setTimeout(() => { 
          preloader.remove(); 
      startAnimations();
    }, 300);
  }
  
  function startAnimations() {
    initTextScramble();
    initTimer();
    initRotator();
    initImageStagger();
  }
  
  // Image stagger
  function initImageStagger() {
    const selector = '.reveal-wrap,img:not(.w-lightbox-image):not([src*="preview"]),video';
    const images = document.querySelectorAll(selector);
    const viewport = [], below = [];
    
    images.forEach(el => {
      el.classList.add('stagger-fade');
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) viewport.push(el);
      else below.push(el);
    });
    
    viewport.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    viewport.forEach((el, i) => {
      setTimeout(() => { el.style.opacity = '1'; }, i * 80);
    });
    
    if (below.length) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            obs.unobserve(e.target);
          }
        });
      }, { rootMargin: '50px', threshold: 0.1 });
      below.forEach(el => obs.observe(el));
    }
  }
  
  // Timer
  function initTimer() {
    const timer = document.getElementById('time-text');
    if (!timer) return;
    
    function update() {
      const now = new Date();
      timer.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    }
    update();
    setInterval(update, 1000);
    wrapLetters(timer);
    scrambleReveal(timer);
  }
  
  // Rotator
  function initRotator() {
    const el = document.getElementById('rotating-text');
    if (!el) return;
    
    const cities = ['SF', 'LA', 'DC'];
    let idx = 0;
    
    function rotate() {
      idx = (idx + 1) % cities.length;
      el.textContent = cities[idx];
      wrapLetters(el);
      scrambleReveal(el);
    }
    
    el.textContent = cities[0];
    wrapLetters(el);
    scrambleReveal(el);
    setInterval(rotate, 3000);
  }
  
  // Text scramble
  function initTextScramble() {
    const elements = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,.heading,p,a'))
      .filter(el => {
        const text = el.textContent?.trim();
        return text && text.length > 2 && text.length < 150 && 
               el.children.length === 0 && 
               getComputedStyle(el).display !== 'none' &&
               el.getBoundingClientRect().top < window.innerHeight + 200 &&
               !el.closest('#preloader,.w-lightbox');
      });

    elements.forEach((el, i) => {
      if (el.dataset.scrambled) return;
      el.dataset.scrambled = 'true';
      wrapLetters(el);
      setTimeout(() => scrambleReveal(el), i * 60);
    });
    
    setTimeout(initHoverEffects, 500);
  }
  
  function wrapLetters(el) {
    const text = el.textContent;
    el.innerHTML = text.split('').map(c => 
      c === ' ' ? ' ' : `<span class="letter" data-char="${c}">${c}</span>`
    ).join('');
  }
  
  function scrambleReveal(el) {
    const letters = el.querySelectorAll('.letter');
    if (!letters.length) return;
    let frame = 0;
    const total = 30;
    
    const interval = setInterval(() => {
      const reveal = (frame / total) * letters.length * 1.2;
      letters.forEach((span, i) => {
        const orig = span.dataset.char;
        if (i < reveal) span.textContent = orig;
        else if (/[a-zA-Z0-9]/.test(orig)) span.textContent = rand();
      });
      frame++;
      if (frame >= total) {
        clearInterval(interval);
        letters.forEach(s => s.textContent = s.dataset.char);
      }
    }, 30);
  }
  
  // Hover
  function initHoverEffects() {
    document.addEventListener('mouseenter', e => {
      if (!e.target?.closest) return;
      const link = e.target.closest('a');
      if (!link || link._scrambling) return;
      const letters = link.querySelectorAll('.letter');
      if (!letters.length) return;
      
      link._originals = Array.from(letters).map(l => l.textContent);
      link._scrambling = setInterval(() => {
        letters.forEach((l, i) => {
          if (/[a-zA-Z0-9]/.test(link._originals[i])) l.textContent = rand();
          });
        }, 50);
  }, true);

    document.addEventListener('mouseleave', e => {
      if (!e.target?.closest) return;
      const link = e.target.closest('a');
      if (!link || !link._scrambling) return;
      clearInterval(link._scrambling);
      link._scrambling = null;
      link.querySelectorAll('.letter').forEach((l, i) => l.textContent = link._originals?.[i] || l.textContent);
    }, true);
  }
  
  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  })();
  