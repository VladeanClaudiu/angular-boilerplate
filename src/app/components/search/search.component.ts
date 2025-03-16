import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = new Subject<string>();
  addresses: any = [];
  //look into alternative here, perhaps a page that asks for a valid api key
  apiKey = 'pub_5e1fec7a-d035-4365-93da-f1700de10c8b';
  isDropdownOpen = false; //control dropdown visibility

  constructor(private http: HttpClient) {
    this.searchTerm
      .pipe(
        debounceTime(100), // short delay to stop api spamming
        distinctUntilChanged(), // only trigger if change in value
        switchMap((term) => this.fetchAddresses(term)), //switch to a new api call
        tap((data) => console.log('Addresses updated:', data)) // log address when changed
      )
      .subscribe((data) => {
        console.log(data);
        this.addresses = data; //store the result of the call
      });
  }

  onKey(event: any) {
    console.log(this.addresses);
    console.log('key press');
    this.searchTerm.next(event.target.value); // value change event
    console.log(this.searchTerm);
  }

  fetchAddresses(query: string) {
    console.log('address fetch');
    if (!query.trim()) {
      //if querry is emty return empty array
      return [];
    }

    const apiUrl = `https://api.autoaddress.com/3.0/autocomplete?address=${query}&key=${this.apiKey}`;
    return this.http.get<any[]>(apiUrl);
  }

  selectAddress(address: string) {
    console.log('Selected Address:', address);
  }

  modifyAddressString(option: string): string {
    if (!option?.trim()) return '';

    const firstCommaIndex = option.indexOf(',');
    if (firstCommaIndex === -1) {
      //here's no comma, make the whole address bold
      return `<span class="bold">${option}</span>`;
    }

    // split at first comma
    const firstPart = option.substring(0, firstCommaIndex + 1); // include the first comma
    const restPart = option.substring(firstCommaIndex + 2); // skip comma and space

    return `<span class="bold">${firstPart}</span> ${restPart}`;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  openDropdown() {
    this.isDropdownOpen = true;
  }

  ngOnInit() {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown_container') && !target.closest('input')) {
      this.isDropdownOpen = false;
    }
  }
}
