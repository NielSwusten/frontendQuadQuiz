import { Component } from '@angular/core';
import {RouterLinkActive, RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home {

}
