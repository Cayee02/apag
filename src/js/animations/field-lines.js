import { gsap } from '../core/gsap.js';

export function initFieldLines() {
  const graphic = document.querySelector('[data-field-lines]');
  if (!graphic) return () => {};
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const paths = [...graphic.querySelectorAll('path')];
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length });
      gsap.fromTo(path, { strokeDashoffset: length * .85 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: graphic.parentElement, start: 'top 85%', end: 'bottom 60%', scrub: .7 },
      });
    });
  });
  return () => media.revert();
}
