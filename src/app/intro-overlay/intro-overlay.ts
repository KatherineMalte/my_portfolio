import { Component, Input, Output, EventEmitter,SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-intro-overlay',
  standalone: true,
  imports: [CommonModule,Loading],
  templateUrl: './intro-overlay.html',
  styleUrl: './intro-overlay.css',
})
export class IntroOverlay  {
  @Output() finished = new EventEmitter<void>();

  isErasing = false;
  showLoader = true;
 @Input() introColor: string = '#E9D3F2'; // color por defecto

ngOnChanges(changes: SimpleChanges) {
  if (changes['introColor'] && this.introColor) {
    this.startIntro(); // dispara la animación usando este color
  }
}


  startIntro() {
    // aplicar color inicial
    document.documentElement.style.setProperty(
      '--intro-color',
       this.introColor
      );
    this.showLoader = true;

    // 🔹 Forzar frame para animación
    requestAnimationFrame(() => {
      this.isErasing = true; // dispara la transición CSS
    });

    // loader desaparece después de 2s
    setTimeout(() => {
      this.showLoader = false;
    }, 2000);

    // limpieza completa después de 10s (2s quieto + 8s animación)
    setTimeout(() => {
      document.documentElement.style.removeProperty('--intro-color');
      this.finished.emit(); // avisa al padre
    }, 3000);
  }

}
