import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HomeComponent],
  template: `
   <app-home></app-home>
  `
})
export class AppComponent {
  title = 'autoaddress-task';
}