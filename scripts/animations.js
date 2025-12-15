// Portfolio Animations v17.1 - Trigger Webflow after preloader
(function() {
  // Hide content until ready
  document.documentElement.style.opacity = '0';
  
  document.head.insertAdjacentHTML('beforeend', `<style>
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;flex:1;background:rgba(255,255,255,0.1)}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

  const bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < 40; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  
  const add = () => document.body ? document.body.prepend(bar) : requestAnimationFrame(add);
  add();

  let i = 0;
  const fill = setInterval(() => {
    if (i < 40) bar.children[i++].classList.add('filled');
    else {
      clearInterval(fill);
      // Preloader done - wait 500ms then trigger content
      setTimeout(() => {
        bar.remove();
        document.documentElement.style.opacity = '1';
        
        // Trigger Webflow animations
        if (window.Webflow && window.Webflow.ready) {
          window.Webflow.ready();
        }
        if (window.Webflow && window.Webflow.require) {
          try { window.Webflow.require('ix2').init(); } catch(e) {}
        }
        
        initExtras();
      }, 500);
    }
  }, 25);

  function initExtras() {
    const time = document.getElementById('time-text');
    if (time) {
      const tick = () => {
        const d = new Date();
        time.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
      };
      tick();
      setInterval(tick, 1000);
    }

    const rot = document.getElementById('rotating-text');
    if (rot) {
      const cities = ['DC', 'SF', 'LA'];
      let j = 0;
      setInterval(() => { j = (j + 1) % 3; rot.textContent = cities[j]; }, 2000);
    }
  }
})();
