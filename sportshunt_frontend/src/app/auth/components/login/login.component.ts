import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(f: NgForm) {

    const loginObserver = {
      next: x => console.log('User Logged In API called: '),
      error: err => console.log(err),
      
    };

    this.authService.login(f.value).subscribe(loginObserver);


    // console.log(f.value); // { first: '', last: '' }
    // console.log(f.valid); // false
  }
}
