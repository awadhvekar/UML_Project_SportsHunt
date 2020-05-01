import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { SearchsportseventComponent } from './components/searchsportsevent/searchsportsevent.component';
import { ProtecteduserlistComponent } from './components/protecteduserlist/protecteduserlist.component';
import { AuthguardGuard } from '../shared/authguard.guard';
import { EventdetailComponent } from './components/eventdetail/eventdetail.component';
import { MyeventsComponent } from './components/myevents/myevents.component';
import { WritereviewComponent } from './components/writereview/writereview.component';
import { ChicagoDivvyStationsComponent } from './components/chicago-divvy-stations/chicago-divvy-stations.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'searchSportsEvents', component: SearchsportseventComponent },
  { 
    path: 'eventDetail/:eventId',
    component: EventdetailComponent,
    canActivate: [AuthguardGuard]
  },
  { 
    path: 'writeReview/:eventId',
    component: WritereviewComponent,
    canActivate: [AuthguardGuard]
  },
  { 
    path: 'myEvents',
    component: MyeventsComponent,
    canActivate: [AuthguardGuard]
  },
  { 
    path: 'chicagoDivvyStations/:stadiumName/:lat/:long',
    component: ChicagoDivvyStationsComponent,
    canActivate: [AuthguardGuard]
  },
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
