import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class Navbar {

  @Input() menuOpen = false;
  @Output() menuAction = new EventEmitter<{ section?: string, open: boolean }>();
  @Input() isTransitioning: boolean = false;
  @Input() hideMenuContent :boolean = false;
  isOpen = false;
isAnimating = false;

  // ----------------------------------------------------
  // CLICK EN CUALQUIER LINK DEL NAVBAR
  // ----------------------------------------------------
  nav(section: string) {
    // El navbar solo emite el evento.
    // El AppComponent se encarga del color, transición y navegación.
    this.menuAction.emit({ section, open: false });
  }

  onMenuLinkClick(section: string, event: Event) {
    event.preventDefault();      // 🔥 importante con routerLink
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
