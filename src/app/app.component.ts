import { Component,OnInit, OnDestroy } from '@angular/core';
import { RouterModule , Router, NavigationEnd} from '@angular/router';
import { Subject } from 'rxjs';
import { Navbar } from './components/navbar/navbar.component';
import { IntroOverlay } from './intro-overlay/intro-overlay';
import { CommonModule } from '@angular/common';
import { take, filter } from 'rxjs/operators';

import { TRANSITION_COLORS, THEME_CLASSES, Section } from '../../src/app/theme.config';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, Navbar, IntroOverlay, CommonModule]
})
export class AppComponent implements OnInit, OnDestroy { 

  private destroy$ = new Subject<void>();
  transitionColors = TRANSITION_COLORS;
  themeClasses = THEME_CLASSES;
  currentSection!: Section;
  panelThemeClass!: string;
  color: string = '';
  menuOpen = false;
  showOverlay = false;
  isTransitioning = false;
  isFadingOut = false;
  showIntro = true;
  hasPlayedIntro = false;

constructor(private router: Router) { 
  const initialSection = this.getSectionFromUrl();
    this.currentSection = initialSection;
    this.panelThemeClass = this.themeClasses[initialSection];
    this.color = this.transitionColors[initialSection];
}

ngOnInit() {
  this.router.events
    .pipe(
      filter(e => e instanceof NavigationEnd),
      take(1) // solo la primera vez
    )
    .subscribe((event: NavigationEnd) => {
      const path = (event as NavigationEnd).urlAfterRedirects.replace('/', '');
      let section: Section;

      if (path === 'projects') section = 'projects';
      else if (path === 'about') section = 'about';
      else section = 'home';

      console.log('🧭 sección resuelta al cargar:', section);

      // Asigna color y tema
      this.currentSection = section;
      this.panelThemeClass = this.themeClasses[section];
      this.color = this.transitionColors[section];

      // Mostrar overlay solo la primera vez
      if (!this.hasPlayedIntro) {
        this.showIntro = true;
        this.hasPlayedIntro = true;
      }
    });
}



  ngOnDestroy() {
    // limpiar suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getSectionFromUrl(): Section {
    const path = this.router.url.replace('/', '');
    if (path === 'projects') return 'projects';
    if (path === 'about') return 'about';
    return 'home';
  }
  handleMenuAction(event: { section?: Section; open: boolean }) {
  
  if (event.section) {
     console.log('handleMenuAction received:', event);
    this.requestThemeChange(event.section);
  }

  this.menuOpen = event.open;
  console.log('menuOpen now:', this.menuOpen);
}

  // ← EVENTO del navbar
  requestThemeChange(key: Section) {
    
    // 1. Pasar color pastel al fondo permanente
    this.panelThemeClass = this.themeClasses[key] ?? 'theme-home';
   // this.overlayColor = this.transitionColors[key] ?? 'rgba(0,0,0,0.2)';

    // 2. Pasar color temporal a la variable CSS
    this.color = this.transitionColors[key] ?? 'rgba(0,0,0,0.2)';
    document.documentElement.style.setProperty('--transition-color', this.color);
  }

  // ← ACTIVADO cuando se abre un componente por router
  startTransition() {
    this.isTransitioning = true;

    // Espera el tiempo de bajada del overlay
    setTimeout(() => {
      this.isTransitioning = false;
      this.isFadingOut = true;

      // Espera el fade-out para destruir el overlay
      setTimeout(() => {
        this.isFadingOut = false;
        document.documentElement.style.removeProperty('--transition-color');
      }, 400); // duración del fade-out
    }, 800); // duración del descenso
  }
}
