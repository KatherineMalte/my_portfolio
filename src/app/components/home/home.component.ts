import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Section,TRANSITION_COLORS } from '../../../../src/app/theme.config';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home {
  currentSection: Section = 'home';

  constructor(private router: Router) {}

  goTo(section: Section) {
    this.currentSection = section;
    this.router.navigate(['/' + section]);
  }
}
