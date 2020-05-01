import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import {  } from '@angular/compiler';
import '@angular/compiler';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchsportseventComponent } from './components/searchsportsevent/searchsportsevent.component';
import { ProtecteduserlistComponent } from './components/protecteduserlist/protecteduserlist.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
// import { from } from 'rxjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventdetailComponent } from './components/eventdetail/eventdetail.component';
import { MyeventsComponent } from './components/myevents/myevents.component';
import { DataTablesModule } from 'angular-datatables';
import { WritereviewComponent } from './components/writereview/writereview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ChicagoDivvyStationsComponent } from './components/chicago-divvy-stations/chicago-divvy-stations.component';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

@NgModule({
  declarations: [LoginComponent,
    RegisterComponent,
    SearchsportseventComponent,
    ProtecteduserlistComponent,
    EventdetailComponent,
    MyeventsComponent,
    WritereviewComponent,
    ChicagoDivvyStationsComponent
  ],
  imports: [CommonModule,
    AuthRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BsDatepickerModule.forRoot(),
    DataTablesModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDdMHt-mrO06qcH0_4nIVhTLnk6-UNgC20'+ '&libraries=visualization'})
  ],
  exports: [LoginComponent,
    RegisterComponent,
    SearchsportseventComponent
  ],
  providers: [GoogleMapsAPIWrapper]
})
export class AuthModule {}
