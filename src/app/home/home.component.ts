import { Component } from '@angular/core';
import { SearchComponent } from '../components/search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
 
}
