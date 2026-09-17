import { gsap } from '../core/gsap.js';

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return () => {};
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ defaults: { duration: .8, ease: 'expo.out' } })
      .from('[data-hero-title]', { y: 28, opacity: .35 })
      .from('[data-hero-description]', { y: 15, opacity: .35 }, .15)
      .from('[data-hero-actions]', { y: 12, opacity: .5 }, .25);
  });
  media.add('(prefers-reduced-motion: no-preference) and (min-width: 768px) and (pointer: fine)', () => {
    gsap.to('[data-hero-photo]', {
      yPercent: 5,
      scale: 1.06,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
    });
  });
  return () => media.revert();
}
