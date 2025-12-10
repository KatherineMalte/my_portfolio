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

  introActive = false;
  introFadeOut = false;
  private alreadyStarted = false;

  ngAfterViewInit() {
    queueMicrotask(() => this.startTransitionIntro());
  }

  startTransitionIntro() {

    if (this.alreadyStarted) return;
    this.alreadyStarted = true;

    // ESTABLECER EL COLOR DESDE TS
    document.documentElement.style.setProperty('--home-color', '#f305f3');

    this.introActive = true;

    setTimeout(() => {
      this.introActive = false;
      this.introFadeOut = true;

      setTimeout(() => {
        this.introFadeOut = false;

        // ELIMINAR EL COLOR DESPUÉS DE LA ANIMACIÓN
        document.documentElement.style.removeProperty('--home-color');
      }, 800);

    }, 800);
  }
}
