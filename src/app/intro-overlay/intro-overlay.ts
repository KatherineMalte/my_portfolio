import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-overlay.html',
  styleUrl: './intro-overlay.css',
})
export class IntroOverlay {

  introFadeOut = false;
  private alreadyStarted = false;

  ngAfterViewInit() {
    queueMicrotask(() => this.startTransitionIntro());
  }

startTransitionIntro() {
  if (this.alreadyStarted) return;
  this.alreadyStarted = true;

  // 1️⃣ Color inicial
  document.documentElement.style.setProperty('--home-color', '#E9D3F2');

  // 2️⃣ Espera 2 segundos quieto
  setTimeout(() => {

    // Forzar recalc. de estilo antes de activar transición
    requestAnimationFrame(() => {
      this.introFadeOut = true; // activa animación CSS
    });

    // 3️⃣ Limpieza al final de la animación (igual duración que CSS)
    setTimeout(() => {
      this.introFadeOut = false;
      document.documentElement.style.removeProperty('--home-color');
    }, 800); // misma duración que CSS

  }, 800);
}


}
