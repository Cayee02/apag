import { gsap } from '../core/gsap.js';

export function initMagneticButtons() {
  const buttons = document.querySelectorAll('[data-magnetic]');
  if (!buttons.length) return () => {};
  const media = gsap.matchMedia();
  media.add('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const disposers = [...buttons].map((button) => {
      const xTo = gsap.quickTo(button, 'x', { duration: .35, ease: 'power3.out' });
      const yTo = gsap.quickTo(button, 'y', { duration: .35, ease: 'power3.out' });
      const reset = () => { xTo(0); yTo(0); };
      const move = (event) => {
        if (event.pointerType === 'touch') return;
        const bounds = button.getBoundingClientRect();
        xTo(gsap.utils.clamp(-4, 4, (event.clientX - bounds.left - bounds.width / 2) * .06));
        yTo(gsap.utils.clamp(-4, 4, (event.clientY - bounds.top - bounds.height / 2) * .06));
      };
      button.addEventListener('pointermove', move);
      button.addEventListener('pointerleave', reset);
      button.addEventListener('focus', reset);
      return () => {
        button.removeEventListener('pointermove', move);
        button.removeEventListener('pointerleave', reset);
        button.removeEventListener('focus', reset);
      };
    });
    return () => disposers.forEach((dispose) => dispose());
  });
  return () => media.revert();
}
