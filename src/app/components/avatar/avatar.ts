import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
 // 👀 Pupilas
  leftPupil = { x: 140, y: 180 };
  rightPupil = { x: 180, y: 180 };

  // 👃 Nariz (curva dinámica)
  noseOffset = 0;

  // 👄 Boca
  mouthPath = "M140 250 Q160 250 180 250";

  // 😠 Cejas (gruesas)
  leftBrow = "M130 155 Q140 145 150 155";
  rightBrow = "M170 155 Q180 145 190 155";

  // 💋 Lunar
  mole = { x: 178, y: 242 };

  lastX = 0;
  lastY = 0;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {

    const x = event.clientX;
    const y = event.clientY;

    const moveX = (x - window.innerWidth / 2) * 0.02;
    const moveY = (y - window.innerHeight / 2) * 0.02;

    // 👀 Pupilas
    this.leftPupil.x = 140 + moveX;
    this.leftPupil.y = 180 + moveY;

    this.rightPupil.x = 180 + moveX;
    this.rightPupil.y = 180 + moveY;

    // 👃 Nariz (curva se mueve)
    this.noseOffset = moveX * 0.5;

    // 😠 Cejas reaccionan
    this.leftBrow = `M130 ${155 + moveY} Q140 ${145 + moveY} 150 ${155 + moveY}`;
    this.rightBrow = `M170 ${155 + moveY} Q180 ${145 + moveY} 190 ${155 + moveY}`;

    // 👄 Boca leve movimiento
    this.mouthPath = `M140 ${250 + moveY} Q160 ${250 + moveY + 5} 180 ${250 + moveY}`;

    // 💋 Lunar se mueve sutil
    this.mole.x = 178 + moveX * 0.2;
    this.mole.y = 242 + moveY * 0.2;
  }
}
