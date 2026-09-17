export function initPhotoViewer(scroll) {
  const dialog = document.querySelector('[data-photo-viewer]');
  if (!dialog || typeof dialog.showModal !== 'function') return () => {};
  const image = dialog.querySelector('[data-photo-full]');
  const caption = dialog.querySelector('[data-photo-caption]');
  const title = dialog.querySelector('#photo-viewer-title');
  const close = dialog.querySelector('[data-photo-close]');
  const previous = dialog.querySelector('[data-photo-prev]');
  const next = dialog.querySelector('[data-photo-next]');
  const error = dialog.querySelector('[data-photo-error]');
  const original = dialog.querySelector('[data-photo-original]');
  let links = [], index = 0, trigger;
  const display = () => {
    const link = links[index];
    image.hidden = false; error.hidden = true;
    image.alt = link.querySelector('img').alt;
    image.src = link.href; original.href = link.href;
    title.textContent = link.closest('[data-album]').querySelector('h3').textContent;
    caption.textContent = `${index + 1} / ${links.length} · ${link.dataset.caption}`;
    previous.disabled = index === 0; next.disabled = index === links.length - 1;
  };
  const open = (event) => {
    const link = event.target.closest('[data-photo-link]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); trigger = link;
    links = [...link.closest('[data-album]').querySelectorAll('[data-photo-link]')];
    index = links.indexOf(link); display();
    dialog.showModal(); scroll.stop(); document.body.classList.add('photo-viewer-open'); close.focus();
  };
  const move = (step) => { const target = index + step; if (target >= 0 && target < links.length) { index = target; display(); } };
  const prev = () => move(-1), following = () => move(1);
  const dismiss = () => dialog.close();
  const restore = () => { document.body.classList.remove('photo-viewer-open'); scroll.start(); image.removeAttribute('src'); trigger?.focus({ preventScroll: true }); };
  const keydown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
  };
  const failed = () => { image.hidden = true; error.hidden = false; };
  document.addEventListener('click', open); close.addEventListener('click', dismiss);
  previous.addEventListener('click', prev); next.addEventListener('click', following);
  dialog.addEventListener('keydown', keydown); dialog.addEventListener('close', restore); image.addEventListener('error', failed);
  return () => {
    if (dialog.open) { dialog.close(); restore(); }
    document.removeEventListener('click', open); close.removeEventListener('click', dismiss);
    previous.removeEventListener('click', prev); next.removeEventListener('click', following);
    dialog.removeEventListener('keydown', keydown); dialog.removeEventListener('close', restore); image.removeEventListener('error', failed);
  };
}
