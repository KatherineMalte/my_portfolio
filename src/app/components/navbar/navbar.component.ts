import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Section, TRANSITION_COLORS } from '../../../../src/app/theme.config';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class Navbar {
  @Input() color!: string;
  @Input() menuOpen = false;
  @Output() menuAction = new EventEmitter<{ section?: Section, open: boolean }>();
  @Input() isTransitioning: boolean = false;
  @Input() hideMenuContent :boolean = false;
  @Input() logo!: string;
  @Input() colorLogo!: string;
  isOpen = false;
  isAnimating = false;
  showLangMenu = false;

  constructor(private translate: TranslateService) {

    translate.setDefaultLang('en');  // idioma por defecto
    translate.use('en');

  }
  toggleLangMenu(event: Event) {
    event.stopPropagation();
    this.showLangMenu = !this.showLangMenu;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.showLangMenu = false;
  }
  // ----------------------------------------------------
  // CLICK EN CUALQUIER LINK DEL NAVBAR
  // ----------------------------------------------------
  nav(section: Section) {
    // El navbar solo emite el evento.
    // El AppComponent se encarga del color, transición y navegación.
    this.menuAction.emit({ section, open: false });
  }

  onMenuLinkClick(section: Section, event: Event) {
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
