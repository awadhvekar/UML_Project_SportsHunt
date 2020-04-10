import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchsportseventComponent } from './components/searchsportsevent/searchsportsevent.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, SearchsportseventComponent],
  imports: [CommonModule, AuthRoutingModule, FormsModule],
  exports: [LoginComponent, RegisterComponent, SearchsportseventComponent],
})
export class AuthModule {}
