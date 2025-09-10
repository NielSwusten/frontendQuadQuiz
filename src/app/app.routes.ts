import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Game} from './game/game';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'game/:difficulty', component: Game }
];
