import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class About implements AfterViewInit {

// visiblePhotos: boolean[] = [];
  userHasScrolled = false;
  images = [
  'photo1.jpg',
  'photo2.jpg',
  'photo3.jpg',
  'photo4.jpeg',
  'photo5.jpg',
  'photo6.jpg'
];

visiblePhotos = new Array(this.images.length).fill(false);

  @ViewChildren('photoElement') photoElements!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.setupObserver();
  }

  /* Detecta scroll REAL del usuario */
  @HostListener('window:scroll')
  onScroll() {
    this.userHasScrolled = true;
  }

  setupObserver() {
   const elements = this.photoElements.toArray();
  this.visiblePhotos = new Array(elements.length).fill(false);

  const observer = new IntersectionObserver(entries => {
    if (!this.userHasScrolled) return;

    entries.forEach(entry => {
      const index = elements.findIndex(el => el.nativeElement === entry.target);

      if (entry.isIntersecting && index !== -1) {
        this.visiblePhotos[index] = true;
      }
    });
  }, {
    threshold: 0.2,

    /* 🔥 CLAVE: activa solo cuando el elemento está en la mitad inferior */
    rootMargin: '0px 0px -40% 0px'
  });

  elements.forEach(el => observer.observe(el.nativeElement));
}}