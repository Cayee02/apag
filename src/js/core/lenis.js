import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

export function initSmoothScroll() {
  const media = gsap.matchMedia();
  let instance;
  media.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
    instance = new Lenis({ anchors: true, duration: 1, smoothWheel: true });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      instance = undefined;
    };
  });
  return {
    stop: () => instance?.stop(),
    start: () => instance?.start(),
    destroy: () => media.revert(),
  };
}
