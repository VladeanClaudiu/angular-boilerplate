import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = new Subject<string>();
  addresses: any = [];
  //look into alternative here, perhaps a page that asks for a valid api key
  apiKey = 'pub_5e1fec7a-d035-4365-93da-f1700de10c8b';
  isDropdownOpen = false; //control dropdown visibility
  isMouseDownOutside = false; //check is mouse down happend outisde
  searchLength: String = '';
  searchQuery: string = '';

  // ref to the dropdown container
  @ViewChild('dropdownContainer') dropdownContainer: ElementRef | undefined;

  constructor(private http: HttpClient) {
    this.searchTerm
      .pipe(
        debounceTime(100), // short delay to stop api spamming
        distinctUntilChanged(), // only trigger if change in value
        switchMap((term) => this.fetchAddresses(term)), //switch to a new api call
        tap((data) => console.log('Addresses updated:', data)) // log address when changed
      )
      .subscribe((data) => {
        // console.log(data);
        this.addresses = data; //store the result of the call
      });
  }

  //filtering for drilldown options
  get filteredOptions(): any[] {
    if (!this.addresses?.options) return [];
    const searchQuery = this.searchQuery.toLowerCase().replace(/\s/g, '');
    return this.addresses.options.filter((option: any) => {
      const optionValue = option.value?.toLowerCase().replace(/\s/g, '') || '';
      return optionValue.includes(searchQuery);
    });
  }


  onKey(event: any) {
    this.searchTerm.next(event.target.value); // value change event
    this.searchLength = event.target.value;
  }

  fetchAddresses(query: string) {
    if (!query.trim()) {
      //if querry is emty return empty array
      return [];
    }

    const apiUrl = `https://api.autoaddress.com/3.0/autocomplete?address=${query}&key=${this.apiKey}`;
    return this.http.get<any[]>(apiUrl);
  }

  selectAddress(address: { link: { href: string } }) {
    console.log('Selected Address:', address);

    const apiUrl = address.link.href; //the API url from the address object

    //the dropdown container to the top
    if (this.dropdownContainer) {
      this.dropdownContainer.nativeElement.scrollTop = 0;
    }

    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        console.log('Data from selected address API call:', data);
        this.addresses = data; // storing the result of the call
      },
      (error) => {
        // console.error('Error fetching selected address:', error); // erorr handle
      }
    );
  }

  processAddress(address: any) {
    // if the value starts with '<' and remove it
    let value = address?.value; //the value property from the address object
    if (value && value.startsWith('<')) {
      value = value.slice(1); // remove the first character (the '<')
    }

    //object with both the modified value and the HTML for the new div
    return {
      modifiedValue: value,
      additionalDiv: `<div class="header_back"></div>`,
    };
  }

  modifyAddressString(option: string, highlights: [number, number]): string {
    if (!option?.trim()) return '';

    const [start, end] = highlights;

    // if the highlight range is valid
    if (start < 0 || end > option.length || start >= end) {
      return option; // unchanged if range is invalid
    }

    // adding the bold span to the highlighted portion
    const beforeHighlight = option.substring(0, start);
    const highlightedPart = option.substring(start, end);
    const afterHighlight = option.substring(end);

    return `${beforeHighlight}<span class="bold">${highlightedPart}</span>${afterHighlight}`;
  }
  
  //used by the back button when clicked addres is a drilldown
  back() {
    this.selectAddress(this.addresses?.options?.[0]);
    this.searchQuery = ""
  }

  openDropdown() {
    this.isDropdownOpen = true;
    this.searchQuery = ""
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.searchQuery = ""
  }

  // mouse interaction fixes for usecases that may cause issues
  ngOnInit() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  handleMouseDown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const insideDropdown = target.closest('.dropdown_container');
    const insideInput = target.closest('input');

    // mousedown outside both input and dropdown
    if (!insideDropdown && !insideInput) {
      this.isMouseDownOutside = true;
    }
  }

  handleMouseUp(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const inputElement = document.querySelector('input');

    //both mousedown and mouseup happened outside, close dropdown & blur input
    if (this.isMouseDownOutside) {
      this.isDropdownOpen = false;

      if (inputElement) {
        (inputElement as HTMLInputElement).blur();
      }
    }

    // reset variable
    this.isMouseDownOutside = false;
  }
}
