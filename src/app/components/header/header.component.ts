import { Component,AfterViewInit,ElementRef,ViewChild } from '@angular/core';

@Component({
  selector: 'app-noise-background',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class Header implements AfterViewInit{

  @ViewChild('noiseCanvas') noiseCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.startNoiseEffect();
  }

  startNoiseEffect() {
    const canvas = this.noiseCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const noise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imageData.data.buffer);

      for (let i = 0; i < buffer.length; i++) {
        const grayscale = Math.random() * 255;
        buffer[i] =
          (255 << 24) | // alpha
          (grayscale << 16) |
          (grayscale << 8) |
          grayscale;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      noise();
      //requestAnimationFrame(loop); // 60fps
      setTimeout(loop, 99); // más lento
    };

    loop();
  }
}
