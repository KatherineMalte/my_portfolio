import { Routes   } from '@angular/router';
import { Home } from './components/home/home.component';
import { About} from './components/about/about.component';
import { Projects} from './components/projects/projects.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: About},
  { path: 'projects', component: Projects},
  // {path: 'loading', component: Loading},
  { path: '**', redirectTo: 'home' } // cualquier ruta desconocida redirige a Home
];