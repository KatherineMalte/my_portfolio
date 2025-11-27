import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class Navbar {
  menuOpen = false;
  @Output() themeChange = new EventEmitter<string>(); // emitirá 'home' | 'work' | 'about'
  @Output() toggleMenuEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.toggleMenuEvent.emit(this.menuOpen);
  }
  onNavClick(colorKey: string) {
    this.themeChange.emit(colorKey);
    this.toggleMenu(); // cierra menú si quieres
  }
}
