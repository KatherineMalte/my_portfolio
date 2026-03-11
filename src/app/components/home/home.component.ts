import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Section } from '../../../../src/app/theme.config';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home {

  currentSection: Section = 'home';

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  goTo(section: Section) {
    this.currentSection = section;
    this.router.navigate(['/' + section]);
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}