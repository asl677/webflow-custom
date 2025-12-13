// Portfolio Animations v7.5
(function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randChar = () => chars[Math.floor(Math.random() * chars.length)];
  
  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
    #preloader{position:fixed;inset:0;background:transparent;z-index:99999;display:flex;align-items:center;justify-content:center}
    #preloader .counter{color:inherit;letter-spacing:0.1em}
    #preloader .digit{display:inline-block}
    html:not(.loaded) .reveal-wrap,
    html:not(.loaded) img:not(#preloader img),
    html:not(.loaded) video{opacity:0}
  `;
  document.head.appendChild(style);

  // Create preloader
  const p = document.createElement('div');
  p.id = 'preloader';
  p.innerHTML = `<p class="heading small link muted counter"><span class="digit">${randChar()}</span><span class="digit">${randChar()}</span><span class="digit">${randChar()}</span></p>`;
  
  function injectPreloader() {
    if (document.getElementById('preloader')) return;
    if (!document.body) return setTimeout(injectPreloader, 1);
    document.body.prepend(p);
    
    const digits = p.querySelectorAll('.digit');
    let frame = 0;
    
    // Scramble in - smoother timing
    const scrambleIn = setInterval(() => {
      frame++;
      digits.forEach((d, i) => d.textContent = frame > (i + 1) * 4 ? '001'[i] : randChar());
      if (frame >= 15) {
        clearInterval(scrambleIn);
        let count = 1;
        const countUp = setInterval(() => {
          count = Math.min(100, count + 8); // Consistent increment
          const str = count.toString().padStart(3, '0');
          digits[0].textContent = str[0];
          digits[1].textContent = str[1];
          digits[2].textContent = str[2];
          if (count >= 100) clearInterval(countUp);
        }, 50);
      }
    }, 50);
  }
  injectPreloader();
})();

(function() {
  let preloaderComplete = false;

  function runPreloader() {
    setTimeout(completePreloader, 1500);
  }

  function completePreloader() {
    if (preloaderComplete) return;
    preloaderComplete = true;
    
    const preloader = document.getElementById('preloader');
    const digits = preloader?.querySelectorAll('.digit');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    
    const scrambleOut = setInterval(() => {
      frame++;
      digits?.forEach(d => d.textContent = chars[Math.floor(Math.random() * chars.length)]);
      if (frame >= 10) {
        clearInterval(scrambleOut);
        preloader.style.transition = 'opacity 0.3s';
        preloader.style.opacity = '0'; 
        setTimeout(() => { 
          preloader.remove(); 
          document.documentElement.classList.add('loaded');
          startAnimations();
        }, 300);
      }
    }, 40);
  }

  function startAnimations() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Animate nav
    document.querySelectorAll('.nav:not(.fake-nav):not(.nav-middle):not(.nav-bottom)').forEach(nav => {
      nav.style.transition = 'opacity 0.8s ease';
        nav.style.opacity = '1';
    });

    initTextAnimations();
    setTimeout(() => startImageFadeIn(), isMobile ? 300 : 100);
    setTimeout(() => initDraggable(), 1000);
  }

  // Text scrambling
  function initTextAnimations() {
    const elements = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6,.heading,p,span,div,a'))
      .filter(el => {
        const text = el.textContent?.trim();
        return text && text.length > 2 && text.length < 150 && 
               el.children.length === 0 && 
               getComputedStyle(el).display !== 'none' &&
               el.getBoundingClientRect().top < window.innerHeight + 200 &&
               !el.closest('.label-wrap,.w-draggable,[data-draggable]');
      });

    elements.forEach((el, i) => {
      if (el.dataset.animInit) return;
      el.dataset.animInit = 'true';
      el.style.opacity = '0';
      wrapLetters(el);
    setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '1';
        scrambleElement(el, 1000);
      }, i * 80);
    });
    
    // Draggable links
    document.querySelectorAll('.w-draggable a,[data-draggable] a,.menu-link,.shimmer,.accordion,.chip-link').forEach(link => {
      if (link.dataset.animInit || link.querySelector('.letter')) return;
      const text = link.textContent?.trim();
      if (text && text.length > 1 && text.length < 150) {
        link.dataset.animInit = 'true';
        wrapLetters(link);
      }
    });
    
    document.querySelectorAll('.w-draggable,[data-draggable]').forEach(el => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });

    setTimeout(initHoverEffects, 800);

    // Special elements
    const counter = document.querySelector('.counter:not(#preloader .counter)');
    if (counter) setTimeout(() => scrambleLine(counter, 800), 200);
    
    const rotating = document.getElementById('rotating-text');
    if (rotating) setTimeout(() => scrambleLine(rotating, 800), 400);
    
    const timeText = document.getElementById('time-text');
    if (timeText) setTimeout(() => scrambleLine(timeText, 800), 600);

    // Show toggle/yzy
    setTimeout(() => {
      document.querySelectorAll('.toggle').forEach(t => {
        t.classList.add('show-toggle');
        t.style.opacity = '1';
      });
      document.querySelectorAll('.yzy,.flex-grid.yzy').forEach(y => {
        y.style.visibility = 'visible';
        y.style.opacity = '1';
      });
    }, 1500);
  }

  function wrapLetters(el) {
    el.innerHTML = el.textContent.split('').map(c => 
      c === ' ' ? '<span class="letter" style="display:inline-block;width:0.3em">&nbsp;</span>' 
                : `<span class="letter" style="display:inline-block">${c}</span>`
    ).join('');
  }

  function scrambleElement(el, duration) {
    const spans = el.querySelectorAll('.letter');
    if (!spans.length) return;
    const original = Array.from(spans).map(s => s.textContent === '\u00A0' ? ' ' : s.textContent);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frame = 0;
    const totalFrames = duration / 30; // Smoother: 30ms intervals
    
    const interval = setInterval(() => {
      const revealPoint = (frame / totalFrames) * spans.length * 1.2;
      spans.forEach((span, i) => {
        if (i < revealPoint) {
          span.textContent = original[i] === ' ' ? '\u00A0' : original[i];
        } else if (/[a-zA-Z0-9]/.test(original[i])) {
          span.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        spans.forEach((s, i) => s.textContent = original[i] === ' ' ? '\u00A0' : original[i]);
      }
    }, 30);
  }

  function scrambleLine(el, duration) {
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frame = 0;
    const totalFrames = duration / 50;
    
    const interval = setInterval(() => {
      let text = '';
      for (let i = 0; i < original.length; i++) {
        if (frame > i * (original.length / (totalFrames * 0.7))) text += original[i];
        else if (/[a-zA-Z]/.test(original[i])) text += chars[Math.floor(Math.random() * chars.length)];
        else text += original[i];
      }
      el.textContent = text;
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        el.textContent = original;
        if (el.classList.contains('counter')) startTimeCounter(el);
        if (el.id === 'rotating-text') startRotatingText(el);
        if (el.id === 'time-text') startMilitaryTime(el);
      }
    }, 50);
  }

  function initHoverEffects() {
    document.addEventListener('mouseenter', e => {
      if (!e.target?.closest) return;
      const link = e.target.closest('a');
      if (!link) return;
      const letters = link.querySelectorAll('.letter');
      if (letters.length) startLinkScramble(link);
    }, true);
    
    document.addEventListener('mouseleave', e => {
      if (!e.target?.closest) return;
      const link = e.target.closest('a');
      if (!link) return;
      stopLinkScramble(link);
    }, true);
  }

  function startLinkScramble(link) {
    if (link._scrambleInterval) return;
    const letters = link.querySelectorAll('.letter');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    link._originalLetters = Array.from(letters).map(l => l.textContent);
    link._scrambleInterval = setInterval(() => {
      letters.forEach(l => {
        if (/[a-zA-Z0-9]/.test(link._originalLetters?.[Array.from(letters).indexOf(l)] || '')) {
          l.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
    }, 50); // Faster, smoother
  }

  function stopLinkScramble(link) {
    if (link._scrambleInterval) {
      clearInterval(link._scrambleInterval);
      link._scrambleInterval = null;
      link.querySelectorAll('.letter').forEach((l, i) => l.textContent = link._originalLetters?.[i] || l.textContent);
    }
  }

  // Image fade-in using inline styles
  function startImageFadeIn() {
    const elements = [...document.querySelectorAll('.reveal-wrap'), 
                      ...document.querySelectorAll('img:not(.reveal-wrap img),video:not(.reveal-wrap video)')];
    
    console.log('🎭 startImageFadeIn:', elements.length, 'elements');
    if (!elements.length) return;
    
    const viewport = [], below = [];
    elements.forEach(el => {
      if (el.dataset.fadeSetup) return;
      el.dataset.fadeSetup = 'true';
      el.style.opacity = '0';
      el.style.transition = 'opacity 1.2s ease-out';
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) viewport.push(el);
      else below.push(el);
    });

    console.log('🎭 Viewport:', viewport.length, 'Below:', below.length);
    
    // Force reflow
    void document.body.offsetHeight;

    viewport.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    viewport.forEach((el, i) => setTimeout(() => { el.style.opacity = '1'; }, i * 250));

    if (below.length) {
      let queue = [], processing = false;
      const processQueue = () => {
        if (processing || !queue.length) return;
        processing = true;
        const el = queue.shift();
        el.style.opacity = '1';
        setTimeout(() => { processing = false; processQueue(); }, 250);
      };
      
      const obs = new IntersectionObserver(entries => {
        entries.filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach(e => { queue.push(e.target); obs.unobserve(e.target); });
        processQueue();
      }, { rootMargin: '0px', threshold: 0.1 });
      
      below.forEach(el => obs.observe(el));
    }
  }

  // Draggable
  function initDraggable() {
    const draggables = document.querySelectorAll('.w-draggable,[data-draggable="true"]');
    if (!draggables.length || typeof jQuery === 'undefined' || !jQuery.fn.draggable) return;
    
    draggables.forEach(el => {
      const $el = jQuery(el);
      if ($el.data('ui-draggable')) $el.draggable('destroy');
      $el.draggable({
        scroll: false, delay: 0, distance: 0, cursor: 'move',
        start: (e, ui) => { $el.data('clickOffsetX', e.pageX - $el.offset().left); $el.data('clickOffsetY', e.pageY - $el.offset().top); },
        drag: (e, ui) => {
          const ox = $el.data('clickOffsetX'), oy = $el.data('clickOffsetY');
          if (ox !== undefined) {
            ui.position.left = e.pageX - ox - ui.helper.parent().offset().left;
            ui.position.top = e.pageY - oy - ui.helper.parent().offset().top;
          }
        }
      });
    });
  }

  // Special elements
  function startTimeCounter(el) {
    const start = Date.now();
    setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + String(s % 60).padStart(2, '0');
    }, 1000);
  }

  function startRotatingText(el) {
    const texts = ['DC', 'SF', 'LA'];
    let i = 0;
    setInterval(() => { i = (i + 1) % texts.length; el.textContent = texts[i]; }, 2000);
  }

  function startMilitaryTime(el) {
    const update = () => {
      const now = new Date();
      el.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    };
    update();
    setInterval(update, 1000);
  }

  // Init
  document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', runPreloader) 
    : runPreloader();
  })();
  
// Column toggle
  (function() {
  const sizer = document.querySelector('.heading.small.link.muted.disabled.fixed-sizer');
  const grid = document.querySelector('.flex-grid.yzy');
  if (!sizer || !grid) return;
  
  let cols = parseInt(getComputedStyle(grid).columnCount) || 4;
  let increasing = false;
  sizer.textContent = '+';
  
  sizer.addEventListener('click', e => {
    e.preventDefault();
    if (increasing) { cols++; if (cols >= 4) { cols = 4; increasing = false; sizer.textContent = '+'; } }
    else { cols--; if (cols <= 2) { cols = 2; increasing = true; sizer.textContent = '−'; } }
    grid.style.columnCount = cols;
  });
})();
  