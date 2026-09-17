import { gsap } from '../core/gsap.js';

export function initRevealAnimations() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return () => {};
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    elements.forEach((element) => {
      gsap.from(element, {
        y: 20,
        opacity: .65,
        duration: .7,
        ease: 'expo.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
  });
  return () => media.revert();
}
