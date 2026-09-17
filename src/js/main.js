import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import 'lenis/dist/lenis.css';
import '../css/main.css';
import { createIcons, ArrowUpRight, ArrowRight, ArrowDown, Menu, X } from 'lucide';
import { initSmoothScroll } from './core/lenis.js';
import { initHeader } from './components/header.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initHero } from './animations/hero.js';

createIcons({ icons: { ArrowUpRight, ArrowRight, ArrowDown, Menu, X }, attrs: { 'aria-hidden': 'true', 'stroke-width': 1.7 } });
const scroll = initSmoothScroll();
const cleanups = [initHeader(), initMobileMenu(scroll), initHero()];
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanups.forEach((cleanup) => cleanup());
    scroll.destroy();
  });
}
