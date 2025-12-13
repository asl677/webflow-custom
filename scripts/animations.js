// Portfolio Animations v9.0 - Minimal (Timer + Rotator only)
(function() {
  function init() {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
