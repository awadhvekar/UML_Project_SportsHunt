import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SearchsportseventComponent } from './components/searchsportsevent/searchsportsevent.component';
import { ProtecteduserlistComponent } from './components/protecteduserlist/protecteduserlist.component';
import { AuthguardGuard } from '../shared/authguard.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'searchSportsEvents', component: SearchsportseventComponent },
  { 
    path: 'protectedUserList',
    component: ProtecteduserlistComponent,
    canActivate: [AuthguardGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
