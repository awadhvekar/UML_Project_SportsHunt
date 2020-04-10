import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService,
    public progressBar: ProgressBarService,
    private alertService: AlertService,
    private router: Router) {}

  ngOnInit(): void {}
  onSubmit(f: NgForm) {
    this.progressBar.startLoading();
    
    const registerObserver = {
      next: x => {
        this.progressBar.setProgressBarSuccess();
        console.log('User Registration Successful');
        this.progressBar.completeLoading();
        this.alertService.success('User Registration Successful!');
        this.router.navigate(['/login']);

      },
      error: err => {
        this.progressBar.setProgressBarFailure();
        console.log('Error in registration: ' + JSON.stringify(err));
        this.progressBar.completeLoading();
        this.alertService.danger('Error in user registration.');
        this.alertService.danger(err.error.response.detail);
      },
    };
    this.authService.register(f.value).subscribe(registerObserver);
  }
}
