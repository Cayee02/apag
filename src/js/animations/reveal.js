import { gsap } from '../core/gsap.js';

export function initRevealAnimations() {
  const elements = document.querySelectorAll('[data-reveal]');
  const groups = document.querySelectorAll('[data-reveal-group]');
  if (!elements.length && !groups.length) return () => {};
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const reveal = (element, delay = 0) => {
      gsap.from(element, {
        y: 18,
        opacity: .72,
        duration: .85,
        delay,
        ease: 'expo.out',
        immediateRender: false,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    };
    elements.forEach((element) => reveal(element));
    groups.forEach((group) => {
      const items = group.matches('[data-cms-services]')
        ? group.querySelectorAll('.cms-service-card') : group.children;
      Array.from(items).forEach((element, index) => reveal(element, (index % 3) * .07));
    });
  });
  return () => media.revert();
}
