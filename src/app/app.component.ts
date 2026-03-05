import { Component,OnInit, OnDestroy } from '@angular/core';
import { RouterModule , Router, NavigationEnd} from '@angular/router';
import { Subject,BehaviorSubject  } from 'rxjs';
import { Injectable } from '@angular/core';
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
@Injectable({ providedIn: 'root' })
export class AppComponent implements OnInit, OnDestroy { 
  section: Section = 'home';

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
  logoColor = '';
  logoPath = 'assets/images/hause.png';
  colorLogo = '#333';

constructor(private router: Router) { 
  const initialSection = this.getSectionFromUrl();
    this.currentSection = initialSection;
    this.panelThemeClass = this.themeClasses[initialSection];
    this.color = this.transitionColors[initialSection];
}

  private colorSubject = new BehaviorSubject<string>(TRANSITION_COLORS['home']);
  color$ = this.colorSubject.asObservable();

  setSection(section: Section) {
    this.colorSubject.next(TRANSITION_COLORS[section]);
  }
ngOnInit() {
  this.router.events
    .pipe(
      filter(e => e instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {

      const path = event.urlAfterRedirects.replace('/', '');
      let section: Section;

      if (path === 'projects') section = 'projects';
      else if (path === 'about') section = 'about';
      else section = 'home';

      this.currentSection = section;
      this.panelThemeClass = this.themeClasses[section];
      this.color = this.transitionColors[section];

      if (!this.hasPlayedIntro) {
        this.showIntro = true;
        this.hasPlayedIntro = true;
      }

      this.setTheme(event.urlAfterRedirects);
    });

  this.setTheme(this.router.url);
}
setTheme(url: string) {

  document.body.classList.remove(
    'theme-home',
    'theme-work',
    'theme-about'
  );

  if (url.includes('projects')) {
    this.logoPath = 'assets/svg/rec.png';
    this.colorLogo = '#f8a425';
    document.body.classList.add('theme-work');
  }

  else if (url.includes('about')) {
    this.logoPath = 'assets/svg/about.png';
    this.colorLogo = '#0bd80b';
    document.body.classList.add('theme-about');
  }

  else {
    this.logoPath = 'assets/svg/hause.png';
    this.colorLogo = '#9907ce';
    document.body.classList.add('theme-home');
  }
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
    this.requestThemeChange(event.section);
  }

  this.menuOpen = event.open;
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
