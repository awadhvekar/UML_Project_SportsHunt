import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProgressBarService } from 'src/app/shared/services/progress-bar.service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService,
    public progressBar: ProgressBarService,
    private alertService: AlertService) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {
    //this.alertService.info('this is an info alert');
    this.progressBar.startLoading();

    const loginObserver = {
      next: x => {
        this.progressBar.setProgressBarSuccess();
        console.log('User Logged In API called: ' + JSON.stringify(x));
        this.progressBar.completeLoading();
        this.alertService.success('Login Successful!');
      },
      error: err => {
        this.progressBar.setProgressBarFailure();
        console.log('Error in login: ' + JSON.stringify(err));
        this.progressBar.completeLoading();
        this.alertService.danger('Username and password does not match.');
        //this.alertService.danger(err.error.response);
      },
      
    };

    this.authService.login(f.value).subscribe(loginObserver);


    // console.log(f.value); // { first: '', last: '' }
    // console.log(f.valid); // false
  }
}
