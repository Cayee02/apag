import { gsap } from '../core/gsap.js';

export function initSugarCane() {
  const cane = document.querySelector('[data-sugar-cane]');
  const start = document.querySelector('#asociacion');
  const end = document.querySelector('.gallery-section');
  if (!cane || !start || !end) return () => {};

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    cane.classList.add('is-active');
    const journey = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: start,
        start: 'top bottom',
        endTrigger: end,
        end: 'bottom top',
        scrub: .8,
        invalidateOnRefresh: true,
      },
    });
    journey.fromTo(cane,
      { y: -240, rotation: -16 },
      { y: () => window.innerHeight + 240, rotation: 20, duration: 1 }, 0);
    journey.fromTo(cane, { opacity: 0 }, { opacity: .72, duration: .1 }, 0);
    journey.to(cane, { opacity: 0, duration: .12 }, .88);
    journey.to(cane.querySelector('[data-cane-leaves]'), {
      rotation: -8,
      svgOrigin: '45 84',
      duration: .5,
      repeat: 1,
      yoyo: true,
      ease: 'sine.inOut',
    }, 0);
    return () => cane.classList.remove('is-active');
  });
  return () => media.revert();
}
