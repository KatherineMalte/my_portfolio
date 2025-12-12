import { Component,ViewChild , ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './components/navbar/navbar.component';
import { IntroOverlay } from './intro-overlay/intro-overlay';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, Navbar, IntroOverlay, CommonModule]
})
export class AppComponent { 

panelThemeClass = 'theme-home';
color: string | null = null;
  menuOpen = false;
  showOverlay = false;
  isTransitioning = false;
  isFadingOut = false;
  showIntro = false;

  // Colores de transición temporales
  transitionColors: Record<string, string> = {
    home:  '#C47BE4',
    work:  '#F5C857',
    about: '#C1E59F'
  };

  // Colores pastel permanentes
  themeClasses: Record<string, string> = {
    home: 'theme-home',
    work: 'theme-work',
    about: 'theme-about'
  };
   ngOnInit() {
    // iniciar tenga el estilo de HOME
    //this.panelThemeClass = this.themeClasses['home'];
    this.color = this.transitionColors['home'];
  }
  handleMenuAction(event: { section?: string; open: boolean }) {
  
  if (event.section) {
     console.log('handleMenuAction received:', event);
    this.requestThemeChange(event.section);
  }

  this.menuOpen = event.open;
  console.log('menuOpen now:', this.menuOpen);
}

  // ← EVENTO del navbar
  requestThemeChange(key: string) {
    
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
