import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { initPreloader } from '../src/js/components/preloader.js';

const bootstrap = await readFile(new URL('../src/js/core/preloader-bootstrap.js', import.meta.url), 'utf8');

function mount(reducedMotion = false) {
  const classes = new Set();
  const document = new EventTarget();
  document.documentElement = {
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name) },
  };
  const preference = new EventTarget();
  preference.matches = reducedMotion;
  const timers = new Map();
  const window = new EventTarget();
  window.matchMedia = () => preference;
  window.setTimeout = (callback, delay) => { timers.set(1, { callback, delay }); return 1; };
  window.clearTimeout = (id) => timers.delete(id);
  runInNewContext(bootstrap, { document, window, Event });
  return { document, window, preference, timers, isLoading: () => classes.has('is-preloading') };
}

const previousDocument = globalThis.document;
try {
  // If the main bundle fails, the independently registered timeout still releases the page.
  const fallback = mount();
  assert(fallback.isLoading());
  const deadline = [...fallback.timers.values()][0];
  assert(deadline.delay <= 1500, 'La página debe liberarse antes de 1.5 segundos');
  deadline.callback();
  assert(!fallback.isLoading());
  assert.equal(fallback.timers.size, 0);

  const reduced = mount(true);
  assert(!reduced.isLoading());
  assert.equal(reduced.timers.size, 0, 'Movimiento reducido no debe añadir espera');

  for (const key of ['Tab', 'Escape']) {
    const keyboard = mount();
    const event = new Event('keydown', { cancelable: true });
    event.key = key;
    keyboard.document.dispatchEvent(event);
    assert(!keyboard.isLoading(), `${key} debe permitir acceso inmediato`);
    assert(!event.defaultPrevented, 'El teclado conserva su comportamiento nativo');
  }

  const hidden = mount();
  hidden.window.dispatchEvent(new Event('pagehide'));
  assert(!hidden.isLoading(), 'La restauración del historial no debe conservar el overlay');

  const changedPreference = mount();
  changedPreference.preference.matches = true;
  changedPreference.preference.dispatchEvent(new Event('change'));
  assert(!changedPreference.isLoading());

  const coordinated = mount();
  globalThis.document = coordinated.document;
  let starts = 0;
  const dispose = initPreloader(() => starts++);
  assert.equal(starts, 0, 'El Hero espera a la salida del preloader');
  coordinated.document.dispatchEvent(new Event('pointerdown'));
  assert(!coordinated.isLoading());
  assert.equal(starts, 1);
  coordinated.window.dispatchEvent(new Event('pagehide'));
  assert.equal(starts, 1, 'Las animaciones no se inicializan dos veces');
  dispose();

  const late = mount();
  [...late.timers.values()][0].callback();
  globalThis.document = late.document;
  let lateStarts = 0;
  initPreloader(() => lateStarts++);
  assert.equal(lateStarts, 1, 'Un módulo que llega tarde no debe esperar un evento ya emitido');

  const disposed = mount();
  globalThis.document = disposed.document;
  let disposedStarts = 0;
  initPreloader(() => disposedStarts++)();
  [...disposed.timers.values()][0].callback();
  assert(!disposed.isLoading());
  assert.equal(disposedStarts, 0, 'HMR cancela la inicialización pendiente');
  console.log('OK preloader: límite de tiempo, teclado, historial, movimiento reducido y coordinación del Hero');
} finally {
  if (previousDocument === undefined) delete globalThis.document;
  else globalThis.document = previousDocument;
}
