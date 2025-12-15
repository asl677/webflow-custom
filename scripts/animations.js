// Portfolio Animations v18 - Just preloader, timer, rotator
(function() {
  // CSS
  const style = document.createElement('style');
  style.textContent = `
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;flex:1;background:rgba(255,255,255,0.1)}
    #preloader-bar .seg.filled{background:#fff}
  `;
  document.head.appendChild(style);

  // Preloader bar
  const bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < 40; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  
  if (document.body) document.body.prepend(bar);
  else document.addEventListener('DOMContentLoaded', () => document.body.prepend(bar));

  // Fill over 1s, then remove
  let i = 0;
  const fill = setInterval(() => {
    if (i < 40) bar.children[i++].classList.add('filled');
    else { clearInterval(fill); bar.remove(); }
  }, 25);

  // Timer + Rotator on load
  window.addEventListener('load', () => {
    const time = document.getElementById('time-text');
    if (time) {
      setInterval(() => {
        const d = new Date();
        time.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2,'0')).join(':');
      }, 1000);
    }

    const rot = document.getElementById('rotating-text');
    if (rot) {
      const cities = ['DC', 'SF', 'LA'];
      let j = 0;
      setInterval(() => { rot.textContent = cities[j = (j + 1) % 3]; }, 2000);
    }
  });
})();
