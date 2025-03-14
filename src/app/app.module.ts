import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient} from '@angular/common/http';

import { SearchComponent } from './components/search/search.component';

@NgModule({
  imports: [SearchComponent, HttpClientModule],
  bootstrap: []
})
export class AppModule { }
