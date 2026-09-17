// Runs in the HTML head so the loader never depends on the module download.
(() => {
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return;

  let finished = false;
  root.classList.add('is-preloading');
  const finish = () => {
    if (finished) return;
    finished = true;
    window.clearTimeout(deadline);
    root.classList.remove('is-preloading');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', finish);
    window.removeEventListener('pagehide', finish);
    preference.removeEventListener('change', onPreference);
    document.dispatchEvent(new Event('apag:preloader-finished'));
  };
  const onKey = (event) => {
    if (event.key === 'Tab' || event.key === 'Escape') finish();
  };
  const onPreference = () => { if (preference.matches) finish(); };
  const deadline = window.setTimeout(finish, 1350);
  document.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', finish, { once: true });
  window.addEventListener('pagehide', finish, { once: true });
  preference.addEventListener('change', onPreference);
})();
