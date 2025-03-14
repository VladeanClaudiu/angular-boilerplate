import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = new Subject<string>();
  addresses: any[] = [];
  apiKey = 'pub_5e1fec7a-d035-4365-93da-f1700de10c8b';


  constructor(private http: HttpClient) {
    console.log("constructor")
    console.log(this.searchTerm)
    this.searchTerm.pipe(
      debounceTime(300), // short delay to stop api spamming
      distinctUntilChanged(), // only trigger if change in value
      switchMap((term) => this.fetchAddresses(term)) //switch to a new api call
    ).subscribe((data) => {
      this.addresses = data;
    });
  }

  onKey(event: any) {
    console.log(this.addresses)
    console.log("key press")
    this.searchTerm.next(event.target.value); // value change event
    console.log(this.searchTerm)
  }

  fetchAddresses(query: string) {
    console.log("address fetch")
    if (!query.trim()) {
      //if querry is emty return empty array
      return [];
    }

    const apiUrl = `https://api.autoaddress.com/3.0/autocomplete?address=${query}&key=${this.apiKey}`;
    return this.http.get<any[]>(apiUrl);
  }
}
