import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, RouterModule } from '@angular/router';
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

  title = 'Mi Portafolio';
  panelThemeClass = '';
  menuOpen: boolean = false;

  isTransitioning = false; 
  isLeaving = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.triggerTransition();   // ← aquí activamos la animación
      }
    });
  }

  // ⭐ Animación de transición completa (baja → sube → limpia)
  triggerTransition() {

    this.isLeaving = false;
    this.isTransitioning = true;  // baja el panel

    setTimeout(() => {
      this.isLeaving = true;      // sube el panel
    }, 300);

    setTimeout(() => {
      this.isTransitioning = false;
      this.isLeaving = false;     // lo deja reset
    }, 600);
  }

  // ⭐ Cambia colores y temas del panel
 onThemeChange(key: string) {
  const map: Record<string,string> = {
    home: 'theme-home',
    work: 'theme-work',
    about: 'theme-about'
  };

  const colorMap: Record<string,string> = {
    home: '#3498db',
    work: '#e67e22',
    about: '#b300ffff'
  };

  // Cambia SOLO el color del overlay (inmediato)
  document.documentElement.style.setProperty(
    '--transition-color',
    colorMap[key] ?? '#ff3d3d'
  );

  // ❗ Espera a que la animación termine
  setTimeout(() => {
    this.panelThemeClass = map[key] ?? '';
  }, 600); // coincide con triggerTransition()
}

}
