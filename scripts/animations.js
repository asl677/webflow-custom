// Portfolio Animations v17 - Simple
(function() {
  document.head.insertAdjacentHTML('beforeend', `<style>
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;flex:1;background:rgba(255,255,255,0.1)}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

  // Create bar
  const bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < 40; i++) {
    const seg = document.createElement('div');
    seg.className = 'seg';
    bar.appendChild(seg);
  }
  
  // Add to page
  const add = () => document.body ? document.body.prepend(bar) : requestAnimationFrame(add);
  add();

  // Fill segments over 1 second
  let i = 0;
  const fill = setInterval(() => {
    if (i < 40) bar.children[i++].classList.add('filled');
    else { clearInterval(fill); setTimeout(() => bar.remove(), 500); }
  }, 25);

  // Timer + Rotator
  window.addEventListener('load', () => {
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
  });
})();
