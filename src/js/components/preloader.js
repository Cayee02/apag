export function initPreloader(onReady) {
  const root = document.documentElement;
  if (!root.classList.contains('is-preloading')) {
    onReady();
    return () => {};
  }
  const finish = () => {
    document.removeEventListener('apag:preloader-finished', finish);
    onReady();
  };
  document.addEventListener('apag:preloader-finished', finish, { once: true });
  return () => {
    document.removeEventListener('apag:preloader-finished', finish);
    root.classList.remove('is-preloading');
  };
}
