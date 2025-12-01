import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, Navbar, CommonModule]
})
export class AppComponent {

  panelThemeClass = 'theme-home';
  menuOpen = false;
  showOverlay = false;
  isTransitioning = false;

  // Colores de transición temporales
  transitionColors: Record<string, string> = {
    home:  '#ffb7ffde',
    work:  '#57f826ff',
    about: '#c9d612ea'
  };

  // Colores pastel permanentes
  themeClasses: Record<string, string> = {
    home: 'theme-home',
    work: 'theme-work',
    about: 'theme-about'
  };

  // ← EVENTO del navbar
  requestThemeChange(key: string) {

    // 1. Pasar color pastel al fondo permanente
    this.panelThemeClass = this.themeClasses[key] ?? 'theme-home';

    // 2. Pasar color temporal a la variable CSS
    const color = this.transitionColors[key] ?? '#00000040';
    document.documentElement.style.setProperty('--transition-color', color);
  }

  // ← ACTIVADO cuando se abre un componente por router
 startTransition() {
  this.showOverlay = true;
  this.isTransitioning = true;

  setTimeout(() => {
    this.isTransitioning = false;

    // Desaparece el overlay
    setTimeout(() => {
      this.showOverlay = false;

      // 🧹 LIMPIA el color de transición (IMPORTANTE)
      document.documentElement.style.removeProperty('--transition-color');

    }, 400);

  }, 400);
}


}
