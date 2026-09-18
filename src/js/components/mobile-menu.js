export function initMobileMenu(scroll) {
  const toggle = document.querySelector('[data-menu-toggle]');
  const dialog = document.querySelector('[data-mobile-menu]');
  if (!toggle || !dialog || typeof dialog.showModal !== 'function') return () => {};
  const close = dialog.querySelector('[data-menu-close]');

  const openMenu = () => {
    scroll.stop();
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    dialog.showModal();
    close.focus();
  };
  const closeMenu = () => dialog.close();
  const restore = () => {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    scroll.start();
    const focusTarget = desktop.matches
      ? document.querySelector('.desktop-nav [aria-current="page"]') || document.querySelector('.desktop-nav a')
      : toggle;
    focusTarget.focus({ preventScroll: true });
  };
  const desktop = window.matchMedia('(min-width: 768px)');
  const onResize = () => { if (desktop.matches && dialog.open) closeMenu(); };
  toggle.hidden = false;
  document.querySelector('[data-header]').classList.add('has-menu');
  toggle.addEventListener('click', openMenu);
  close.addEventListener('click', closeMenu);
  dialog.addEventListener('close', restore);
  desktop.addEventListener('change', onResize);
  return () => {
    if (dialog.open) {
      closeMenu();
      restore();
    }
    toggle.removeEventListener('click', openMenu);
    close.removeEventListener('click', closeMenu);
    dialog.removeEventListener('close', restore);
    desktop.removeEventListener('change', onResize);
    toggle.hidden = true;
    document.querySelector('[data-header]').classList.remove('has-menu');
  };
}
