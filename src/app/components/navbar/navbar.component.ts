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
  @Output() themeChange = new EventEmitter<string>();      // 'home' | 'work' | 'about'
  @Output() toggleMenuEvent = new EventEmitter<boolean>(); // true/false

  // 🔵 Se usa para cambiar la sección activa y cerrar menú
  nav(section: string) {
    this.themeChange.emit(section);   // Notifica al padre -> cambia color/tema
    this.toggleMenuEvent.emit(false); // Fuerza cerrar menú
  }

  // 🔵 Botón MENU / CLOSE
  toggleMenu() {
    const newState = !this.menuOpen;
    this.toggleMenuEvent.emit(newState);
  }
}
