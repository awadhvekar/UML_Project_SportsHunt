import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnOneComponent } from './layouts/column-one/column-one.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { NgProgressModule } from 'ngx-progressbar';

import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { AlertModule } from 'ngx-alerts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { SearchsportseventComponent } from './components/searchsportsevent/searchsportsevent.component';

@NgModule({
  declarations: [ColumnOneComponent,
    HeaderComponent,
    //SearchsportseventComponent
  ],
  imports: [CommonModule,
    RouterModule,
    NgProgressModule,
    BrowserAnimationsModule,
    BrowserModule,
 
    // Specify your library as an import (set timeout to -1 for unlimited timeout, the message can only be closed by the user clicking on it)
    AlertModule.forRoot({maxMessages: 5, timeout: 5000, position: 'left'}),
    BsDropdownModule.forRoot()
  ],
  exports: [ColumnOneComponent,
    //SearchsportseventComponent
  ],
})
export class SharedModule {}
