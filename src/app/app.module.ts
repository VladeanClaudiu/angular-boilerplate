import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient} from '@angular/common/http';

import { SearchComponent } from './components/search/search.component';

@NgModule({
  imports: [SearchComponent, HttpClientModule],
  // imports: [HttpClientModule], // ✅ Ensure it's in imports
  bootstrap: []
})
export class AppModule { }
