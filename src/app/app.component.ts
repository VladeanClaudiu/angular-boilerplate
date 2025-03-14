import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, SearchComponent]
})
export class AppComponent {
  title = 'autoaddress-task';
}