// Portfolio Animations v7.4 - No preloader, fast loading
// REQUIRED: GSAP (loaded from Webflow or CDN)

// Inject CSS for image fade
(function() {
  const style = document.createElement('style');
  style.id = 'anim-styles';
  style.textContent = `
    .img-fade{opacity:0;transition:opacity 0.6s ease-out}
    .img-fade.visible{opacity:1}
    .toggle,.yzy{opacity:0;transition:opacity 0.6s ease}
    .toggle.show,.yzy.show{opacity:1}
  `;
  document.head.appendChild(style);
})();

console.log('🚀 Portfolio animations v7.4 loading...');

(function() {
  // Start animations immediately on DOMContentLoaded
  function startAnimations() {
    console.log('🎬 Starting animations');
    initTextAnimations();
    startImageFadeIn();
    
    // Show toggle/yzy
        setTimeout(() => {
      document.querySelectorAll('.toggle, .yzy').forEach(el => el.classList.add('show'));
    }, 500);
    
    // Init draggable and hover
    setTimeout(() => {
      initHoverEffects();
      initDraggable();
    }, 800);
  }

  // Text scrambling animations with stagger reveal
  function initTextAnimations() {
    const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .heading, p, span, div, a'))
      .filter(el => {
      const text = el.textContent?.trim();
        const noChildren = el.children.length === 0;
        const visible = getComputedStyle(el).display !== 'none';
        const inView = el.getBoundingClientRect().top < window.innerHeight + 200;
        return text && text.length > 2 && text.length < 150 && noChildren && visible && inView;
      });

    console.log(`🔍 Found ${elements.length} text elements`);

    elements.forEach((el, i) => {
      if (el.dataset.animInit || el.closest('.label-wrap')) return;
      // Skip draggable content - handle separately
      if (el.closest('.w-draggable') || el.closest('[data-draggable]')) return;
      
      el.dataset.animInit = 'true';
      
      // Start hidden for stagger effect
      el.style.opacity = '0';
      
      wrapLetters(el);
      
      // Stagger reveal with scramble
          setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease';
        el.style.opacity = '1';
        scrambleElement(el, 1000);
      }, i * 80);
    });
    
    // Wrap letters in draggable links for hover effects (same as other links)
    document.querySelectorAll('.w-draggable a, [data-draggable] a, .menu-link, .shimmer, .accordion, .chip-link').forEach(link => {
      if (link.dataset.animInit) return;
      if (link.querySelector('.letter')) return; // Already wrapped
      
      // Get direct text content only (not from nested elements)
      const directText = Array.from(link.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join('').trim();
      
      // If has direct text, wrap it; otherwise try full textContent for simple links
      const text = directText || (link.children.length === 0 ? link.textContent?.trim() : '');
      
      if (text && text.length > 1 && text.length < 150) {
        link.dataset.animInit = 'true';
        // For links with children, only wrap direct text nodes
        if (link.children.length > 0 && directText) {
          link.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const wrapper = document.createElement('span');
              wrapper.innerHTML = node.textContent.split('').map(c => c === ' ' ? ' ' : `<span class="letter">${c}</span>`).join('');
              node.replaceWith(...wrapper.childNodes);
            }
          });
      } else {
          wrapLetters(link);
        }
        console.log(`🔗 Wrapped draggable link: ${text.substring(0, 30)}`);
      }
    });
    
    // Force draggable content to be visible
    document.querySelectorAll('.w-draggable, [data-draggable]').forEach(el => {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    });

    // Setup hover effects AFTER all letters are wrapped (including draggable)
    setTimeout(initHoverEffects, 800);

    // Special elements
    const counter = document.querySelector('.counter');
    if (counter && !counter.closest('.label-wrap')) setTimeout(() => scrambleLine(counter, 800), 200);
    
    const rotating = document.getElementById('rotating-text');
    if (rotating) setTimeout(() => scrambleLine(rotating, 800), 400);
    
    const timeText = document.getElementById('time-text');
    if (timeText) setTimeout(() => scrambleLine(timeText, 800), 600);

    // Fade in toggle and yzy
    setTimeout(() => {
      document.querySelectorAll('.toggle, .toggle.bottom').forEach(t => {
        t.classList.add('show-toggle');
        t.style.transition = 'opacity 0.6s ease';
        t.style.opacity = '1';
        setTimeout(() => t.style.transition = '', 600);
      });
      
      document.querySelectorAll('.yzy, .flex-grid.yzy').forEach(y => {
        y.style.transition = 'opacity 0.6s ease';
        y.style.visibility = 'visible';
        y.style.opacity = '1';
        setTimeout(() => y.style.transition = '', 600);
      });
    }, 1500);
  }

  // Wrap letters in spans - preserve layout
  function wrapLetters(el) {
    // Store original white-space setting
    const originalWhiteSpace = getComputedStyle(el).whiteSpace;
    
    // Wrap each character including spaces in spans to maintain consistent spacing
    el.innerHTML = el.textContent.split('').map(c => {
      if (c === ' ') {
        return '<span class="letter" style="display:inline-block;width:0.3em">&nbsp;</span>';
      }
      return `<span class="letter" style="display:inline-block">${c}</span>`;
    }).join('');
    
    // Prevent wrapping during animation
    el.style.whiteSpace = 'nowrap';
    el.dataset.originalWhiteSpace = originalWhiteSpace;
  }

  // Scramble element with letter spans
  function scrambleElement(el, duration) {
    const spans = el.querySelectorAll('.letter');
    if (!spans.length) return;
    
    const original = Array.from(spans).map(s => s.textContent === '\u00A0' ? ' ' : s.textContent);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const totalFrames = duration / 60;
      
      const interval = setInterval(() => {
      spans.forEach((span, i) => {
        const reveal = (i / spans.length) * totalFrames * 0.8;
        if (frame > reveal) {
          span.textContent = original[i] === ' ' ? '\u00A0' : original[i];
        } else if (/[a-zA-Z0-9]/.test(original[i])) {
          span.textContent = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      frame++;
      if (frame >= totalFrames) {
          clearInterval(interval);
        spans.forEach((s, i) => s.textContent = original[i] === ' ' ? '\u00A0' : original[i]);
        
        // Restore original white-space after animation
        if (el.dataset.originalWhiteSpace) {
          el.style.whiteSpace = el.dataset.originalWhiteSpace;
        }
      }
    }, 60);
  }

  // Simple line scramble for special elements
  function scrambleLine(el, duration) {
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let frame = 0;
    const totalFrames = duration / 50;
    const revealSpeed = original.length / (totalFrames * 0.7);
    
    const interval = setInterval(() => {
      let text = '';
      for (let i = 0; i < original.length; i++) {
        if (frame > i * revealSpeed) text += original[i];
        else if (/[a-zA-Z]/.test(original[i])) text += chars[Math.floor(Math.random() * chars.length)];
        else text += original[i];
      }
      el.textContent = text;
      frame++;
      
      if (frame >= totalFrames) {
        clearInterval(interval);
        el.textContent = original;
        
        // Start special functionality
        if (el.classList.contains('counter')) startTimeCounter(el);
        if (el.id === 'rotating-text') startRotatingText(el);
        if (el.id === 'time-text') startMilitaryTime(el);
      }
    }, 50);
  }

  // Hover effects - same scramble as page load
  function initHoverEffects() {
    // Use event delegation on document for all links (catches dynamically added/moved elements)
    document.addEventListener('mouseenter', e => {
      const link = e.target.closest('a');
      if (!link) return;
      const letters = link.querySelectorAll('.letter');
      if (letters.length) startLinkScramble(link);
    }, true);
    
    document.addEventListener('mouseleave', e => {
      const link = e.target.closest('a');
      if (!link) return;
      stopLinkScramble(link);
    }, true);
  }

  function startLinkScramble(link) {
    if (link._scrambleInterval) return;
    const letters = link.querySelectorAll('.letter');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    link._originalLetters = Array.from(letters).map(l => l.textContent);
    link._scrambleInterval = setInterval(() => {
      letters.forEach(l => {
        if (/[a-zA-Z0-9]/.test(l.textContent)) l.textContent = chars[Math.floor(Math.random() * chars.length)];
      });
    }, 80);
  }

  function stopLinkScramble(link) {
    if (link._scrambleInterval) {
      clearInterval(link._scrambleInterval);
      link._scrambleInterval = null;
      const letters = link.querySelectorAll('.letter');
      if (link._originalLetters) letters.forEach((l, i) => l.textContent = link._originalLetters[i]);
    }
  }

  // Image fade-in with stagger - SAME timing for viewport and scroll
  function startImageFadeIn() {
    const elements = document.querySelectorAll('.reveal-wrap, img:not(.reveal-wrap img), video');
    const viewport = [], below = [];
    
    elements.forEach(el => {
      el.classList.add('img-fade'); // Start hidden
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) viewport.push(el);
      else below.push(el);
    });
    
    // Force reflow so opacity:0 takes effect
    void document.body.offsetHeight;
    
    // Sort by position
    viewport.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    console.log(`🎭 Staggering ${viewport.length} viewport + ${below.length} scroll images`);
    
    // SAME stagger for both: 100ms between each
    const STAGGER = 100;
    
    // Viewport stagger
    viewport.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * STAGGER);
    });
    
    // Scroll stagger - queue system with same timing
    if (below.length) {
      let queue = [], processing = false;
      
      const processQueue = () => {
        if (processing || !queue.length) return;
        processing = true;
        queue.shift().classList.add('visible');
        setTimeout(() => { processing = false; processQueue(); }, STAGGER);
      };
      
      const obs = new IntersectionObserver(entries => {
        entries.filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach(e => { queue.push(e.target); obs.unobserve(e.target); });
        processQueue();
      }, { rootMargin: '0px', threshold: 0 });
      
      below.forEach(el => obs.observe(el));
    }
  }

  // Draggable optimization
  function initDraggable() {
    const draggables = document.querySelectorAll('.w-draggable, [data-draggable="true"]');
    if (!draggables.length || typeof jQuery === 'undefined' || !jQuery.fn.draggable) return;
    
    draggables.forEach(el => {
      const $el = jQuery(el);
      if ($el.data('ui-draggable')) $el.draggable('destroy');
      
      $el.draggable({
        scroll: false, delay: 0, distance: 0, cursor: 'move',
        start: function(e, ui) {
          const offset = $el.offset();
          $el.data('clickOffsetX', e.pageX - offset.left);
          $el.data('clickOffsetY', e.pageY - offset.top);
        },
        drag: function(e, ui) {
          const ox = $el.data('clickOffsetX'), oy = $el.data('clickOffsetY');
          if (ox !== undefined) {
            ui.position.left = e.pageX - ox - ui.helper.parent().offset().left;
            ui.position.top = e.pageY - oy - ui.helper.parent().offset().top;
          }
        }
      });
    });
  }

  // Special element functions
  function startTimeCounter(el) {
    el.textContent = '0000';
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
    function update() {
      const now = new Date();
      el.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
    update();
    setInterval(update, 1000);
  }

  // Page transition
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') ||
        link.hasAttribute('data-w-id') || link.closest('[data-w-id]') ||
        !(href.startsWith('/') || href.startsWith(window.location.origin))) return;
    
    e.preventDefault();
    if (window.gsap) {
      window.gsap.to('body', { opacity: 0, duration: 0.5, ease: "power2.inOut", onComplete: () => window.location.href = href });
    } else window.location.href = href;
  }, true);

  // Initialize immediately
  function init() {
    startAnimations();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  })();
  
// Column toggle for .yzy grid
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
  
console.log('🚀 Portfolio animations v4.0 ready');
  