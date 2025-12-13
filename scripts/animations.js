// Portfolio Animations v9.2 - Timer, Rotator, Stagger, Lenis
(function() {
  // Inject stagger CSS
    const style = document.createElement('style');
    style.textContent = `
    .stagger-fade{opacity:0;transform:translateY(10px);transition:opacity 0.6s ease,transform 0.6s ease}
    .stagger-fade.visible{opacity:1;transform:translateY(0)}
    html.lenis{height:auto}
    .lenis.lenis-smooth{scroll-behavior:auto}
    `;
    document.head.appendChild(style);

  function init() {
    // Initialize Lenis smooth scroll
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
      });
      
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Military time
    const timeText = document.getElementById('time-text');
    if (timeText) {
      const update = () => {
        const now = new Date();
        timeText.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      };
      update();
      setInterval(update, 1000);
    }

    // SF/LA/DC rotator
    const rotating = document.getElementById('rotating-text');
    if (rotating) {
    const texts = ['DC', 'SF', 'LA'];
      let i = 0;
    setInterval(() => {
        i = (i + 1) % texts.length;
        rotating.textContent = texts[i];
    }, 2000);
    }

    // Stagger fade-in all elements
    const elements = document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,img,video,.reveal-wrap,.heading');
    elements.forEach((el, i) => {
      el.classList.add('stagger-fade');
      setTimeout(() => el.classList.add('visible'), i * 50);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  })();
  