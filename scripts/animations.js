// Portfolio Animations v17.2 - No flash, faster preloader
(function() {
  // Immediately hide with black background (matches site)
  document.head.insertAdjacentHTML('afterbegin', `<style>
    html.loading{background:#000}
    html.loading body{opacity:0}
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;flex:1;background:rgba(255,255,255,0.1)}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);
  
  document.documentElement.classList.add('loading');

  const bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < 40; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  
  const add = () => document.body ? document.body.prepend(bar) : requestAnimationFrame(add);
  add();

  // Faster: 40 * 15ms = 600ms
  let i = 0;
  const fill = setInterval(() => {
    if (i < 40) bar.children[i++].classList.add('filled');
    else {
      clearInterval(fill);
        setTimeout(() => {
        bar.remove();
        document.documentElement.classList.remove('loading');
        
        // Trigger Webflow
        if (window.Webflow) {
          if (window.Webflow.ready) window.Webflow.ready();
          if (window.Webflow.require) try { window.Webflow.require('ix2').init(); } catch(e) {}
        }
        
        initExtras();
          }, 500);
        }
  }, 15);

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
  