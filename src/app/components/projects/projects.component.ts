import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface SkillGroup {
  id: string;
  titleKey: string;
  items: string[];
}

interface SpokenLanguage {
  name: string;
  level: string;
  percent: number;
}

@Component({
  selector: 'app-projects',
  // Si tu proyecto usa NgModule, quita "standalone" e "imports"
  // y declara el componente en tu módulo (con CommonModule y TranslateModule).
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class Projects {

  /** Números de las claves ABOUT.STATn_VALUE / ABOUT.STATn_LABEL */
  stats = [1, 2, 3];

  /** Números de las claves ABOUT.JOBn_* (de más reciente a más antigua) */
  jobs = [1, 2, 3, 4, 5, 6];

  /** Tecnologías del trabajo actual (CIALTA) */
  currentTags = ['Python 3.14', 'PySide6', 'SQL Server', 'PyODBC', 'PySerial'];

  skillGroups: SkillGroup[] = [
    {
      id: 'lang',
      titleKey: 'ABOUT.LANGUAGES',
      items: ['Java (8–17)', 'Python', 'C#', '.NET', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'JSF', 'J2EE', 'Android']
    },
    {
      id: 'db',
      titleKey: 'ABOUT.DATABASES',
      items: ['MySQL', 'SQL Server', 'MongoDB', 'AWS S3']
    },
    {
      id: 'fw',
      titleKey: 'ABOUT.FRAMEWORKS',
      items: ['Spring Boot', 'MVC', 'Hibernate', 'Microservices', 'REST APIs', 'SOLID Principles', 'SDLC']
    },
    {
      id: 'tools',
      titleKey: 'ABOUT.TOOLS',
      items: ['Jira', 'Git', 'Bitbucket', 'Azure DevOps', 'Maven', 'Jenkins', 'Selenium', 'Postman', 'Power BI']
    },
    {
      id: 'met',
      titleKey: 'ABOUT.METHODS',
      items: ['Scrum', 'Agile', 'OOP', 'Design Patterns']
    }
  ];

  spoken: SpokenLanguage[] = [
    { name: 'English', level: 'B1', percent: 50 },
    { name: 'German', level: 'A1', percent: 17 }
  ];

  selected = 'all';

  get visibleGroups(): SkillGroup[] {
    return this.selected === 'all'
      ? this.skillGroups
      : this.skillGroups.filter(g => g.id === this.selected);
  }

  select(id: string): void {
    this.selected = id;
  }
}