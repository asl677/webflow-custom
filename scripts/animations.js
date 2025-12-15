// Portfolio Animations v19.1 - LCP optimization
(function() {
  // Optimize LCP - find and prioritize .img-parallax
  const preloadLCP = () => {
    const lcp = document.querySelector('.img-parallax');
    if (lcp && lcp.src) {
      // Preload the image
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = lcp.src;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      
      // Set high priority on the image itself
      lcp.setAttribute('fetchpriority', 'high');
      lcp.loading = 'eager';
    }
  };
  
  // Run immediately
  if (document.body) preloadLCP();
  else document.addEventListener('DOMContentLoaded', preloadLCP);

  // Preloader bar CSS
  document.head.insertAdjacentHTML('afterbegin', `<style>
    #preloader-bar{position:fixed;top:0;left:0;height:1px;z-index:99999;display:flex;width:100%}
    #preloader-bar .seg{height:1px;flex:1;background:rgba(255,255,255,0.1)}
    #preloader-bar .seg.filled{background:#fff}
  </style>`);

  const bar = document.createElement('div');
  bar.id = 'preloader-bar';
  for (let i = 0; i < 40; i++) bar.appendChild(Object.assign(document.createElement('div'), {className: 'seg'}));
  
  if (document.body) document.body.prepend(bar);
  else document.addEventListener('DOMContentLoaded', () => document.body.prepend(bar));

  let i = 0;
  const fill = setInterval(() => {
    if (i < 40) bar.children[i++].classList.add('filled');
    else { clearInterval(fill); bar.remove(); }
  }, 25);

  // Timer + Rotator
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
  