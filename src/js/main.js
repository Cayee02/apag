import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import 'lenis/dist/lenis.css';
import '../css/main.css';
import { createIcons, ArrowUpRight, ArrowRight, ArrowDown, Menu, X, Sprout, MapPin, UsersRound, Phone, Mail } from 'lucide';
import { initSmoothScroll } from './core/lenis.js';
import { initHeader } from './components/header.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initHero } from './animations/hero.js';
import { initRevealAnimations } from './animations/reveal.js';
import { initPreloader } from './components/preloader.js';
import { initFieldLines } from './animations/field-lines.js';
import { initMagneticButtons } from './animations/magnetic.js';
import { initContactForm } from './components/contact-form.js';
import { initPhotoViewer } from './components/photo-viewer.js';

createIcons({ icons: { ArrowUpRight, ArrowRight, ArrowDown, Menu, X, Sprout, MapPin, UsersRound, Phone, Mail }, attrs: { 'aria-hidden': 'true', 'stroke-width': 1.7 } });
const scroll = initSmoothScroll();
const cleanups = [initHeader(), initMobileMenu(scroll)];
cleanups.push(initPreloader(() => {
  cleanups.push(initHero(), initRevealAnimations(), initFieldLines(), initMagneticButtons(), initContactForm(), initPhotoViewer(scroll));
}));
const skipLink = document.querySelector('.skip-link');
const focusContent = () => document.querySelector('#contenido').focus({ preventScroll: true });
skipLink.addEventListener('click', focusContent);
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanups.forEach((cleanup) => cleanup());
    scroll.destroy();
    skipLink.removeEventListener('click', focusContent);
  });
}
