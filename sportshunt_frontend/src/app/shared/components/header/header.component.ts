import { Component, OnInit } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { ProgressBarService } from '../../services/progress-bar.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private progress: NgProgress,
    public progressBar: ProgressBarService,
    public authService: AuthService,
    private alertService: AlertService,
    private router: Router ) { }

  ngOnInit(): void {
    this.progressBar.progressRef = this.progress.ref('progressBar');
  }

  logout(){
    this.progressBar.setProgressBarSuccess();

    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('loggedInUserFirstName');
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('loggedInUserLastName');
    localStorage.removeItem('message');
    localStorage.removeItem('loggedInUserToken');

    this.progressBar.completeLoading();
    this.alertService.success("Successfully logged out of the System.");

    this.router.navigate(['/login']);
  }

}
