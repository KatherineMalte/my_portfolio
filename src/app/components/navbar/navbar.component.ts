import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class Navbar {

  @Input() menuOpen = false;
  @Output() menuAction = new EventEmitter<{ section?: string, open: boolean }>();

  // controla solo el overlay del menú (no la transición global)
  isOpen = false;
  isAnimating = false;

  constructor() { }

  // ----------------------------------------------------
  // CLICK EN CUALQUIER LINK DEL NAVBAR
  // ----------------------------------------------------
  nav(section: string) {
    // El navbar solo emite el evento.
    // El AppComponent se encarga del color, transición y navegación.
    this.menuAction.emit({ section, open: false });
  }

  onMenuLinkClick(section: string, event: Event) {
    event.stopPropagation();
    this.nav(section);
  }

  // ----------------------------------------------------
  // ANIMACIÓN DEL MENÚ HAMBURGUESA
  // ----------------------------------------------------
  toggleMenu() {
    this.menuAction.emit({ open: !this.menuOpen });  // actualiza estado fuera

    this.isAnimating = true;

    if (!this.isOpen) {
      requestAnimationFrame(() => this.isOpen = true);
    } else {
      this.isOpen = false;
    }

    setTimeout(() => {
      this.isAnimating = false;
    }, 600); // tiempo igual al CSS
  }
}
