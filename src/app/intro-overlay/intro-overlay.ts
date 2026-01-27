import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Loading} from '../loading/loading';

@Component({
  selector: 'app-intro-overlay',
  standalone: true,
  imports: [CommonModule,Loading],
  templateUrl: './intro-overlay.html',
  styleUrl: './intro-overlay.css',
})
export class IntroOverlay {
   isErasing = false;
  showLoader = true;
  ngAfterViewInit() {
    this.startIntro();
  }

 startIntro() {
    // 🎨 color definido desde TS
    document.documentElement.style.setProperty(
      '--intro-color',
      '#E9D3F2'
    );
  this.showLoader = true;
    // 🔥 forzar un frame para que el navegador
    // registre el estado inicial (height: 100%)
    requestAnimationFrame(() => {
      this.isErasing = true; // dispara transición CSS
    });
 setTimeout(() => {
      this.showLoader = false;
    }, 2000);
    // 🧹 limpieza opcional cuando TODO termina
    // (2s delay + 8s animación = 10s)
    setTimeout(() => {
      document.documentElement.style.removeProperty('--intro-color');
    }, 3000);
  }  

}
