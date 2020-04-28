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

@NgModule({
  declarations: [LoginComponent,
    RegisterComponent,
    SearchsportseventComponent,
    ProtecteduserlistComponent,
    EventdetailComponent
  ],
  imports: [CommonModule,
    AuthRoutingModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [LoginComponent,
    RegisterComponent,
    SearchsportseventComponent
  ],
})
export class AuthModule {}
