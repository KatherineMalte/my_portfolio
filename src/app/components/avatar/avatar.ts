import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FaceState, buildFace } from './avatar-geometry';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar implements OnInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);

  /** Estado actual (suavizado) de la cara */
  private state = signal<FaceState>({ lookX: 0, lookY: 0, smile: 0, blink: 0 });

  /** Todos los paths ya calculados, listos para el template */
  face = computed(() => buildFace(this.state()));

  // objetivos hacia los que se interpola cada frame
  private target = { lookX: 0, lookY: 0, smile: 0 };
  private blinkStart = -1;
  private nextBlink = 0;
  private raf = 0;

  ngOnInit() {
    this.nextBlink = performance.now() + 2000;
    // el bucle de animación corre fuera de la zona para no disparar CD global
    this.zone.runOutsideAngular(() => {
      const tick = (now: number) => {
        this.step(now);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const r = this.host.nativeElement.getBoundingClientRect();
    // centro aproximado de la cara dentro del SVG (viewBox 320 × 420)
    const cx = r.left + r.width * 0.5;
    const cy = r.top + r.height * (200 / 420);

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // mirada: normalizada y saturada
    const reach = Math.max(r.width, 300);
    this.target.lookX = Math.max(-1, Math.min(1, dx / reach));
    this.target.lookY = Math.max(-1, Math.min(1, dy / reach));

    // sonrisa: crece cuanto más cerca está el cursor de la cara
    const dist = Math.hypot(dx, dy);
    const near = Math.max(0, 1 - dist / (reach * 1.1));
    this.target.smile = Math.min(1, near * 1.35);
  }

  @HostListener('document:mouseleave')
  onLeave() {
    this.target = { lookX: 0, lookY: 0, smile: 0 };
  }

  private step(now: number) {
    const s = this.state();

    // parpadeo aleatorio (150 ms)
    let blink = 0;
    if (this.blinkStart < 0 && now >= this.nextBlink) this.blinkStart = now;
    if (this.blinkStart >= 0) {
      const t = (now - this.blinkStart) / 150;
      if (t >= 1) {
        this.blinkStart = -1;
        this.nextBlink = now + 2200 + Math.random() * 3500;
      } else {
        blink = Math.sin(t * Math.PI);
      }
    }

    const k = 0.14; // suavizado
    const next: FaceState = {
      lookX: s.lookX + (this.target.lookX - s.lookX) * k,
      lookY: s.lookY + (this.target.lookY - s.lookY) * k,
      smile: s.smile + (this.target.smile - s.smile) * 0.09,
      blink,
    };

    const same =
      Math.abs(next.lookX - s.lookX) < 0.0005 &&
      Math.abs(next.lookY - s.lookY) < 0.0005 &&
      Math.abs(next.smile - s.smile) < 0.0005 &&
      next.blink === s.blink;
    if (same) return;

    // volver a la zona solo cuando hay cambios reales
    this.zone.run(() => this.state.set(next));
  }
}