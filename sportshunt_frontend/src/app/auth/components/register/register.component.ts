import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
  onSubmit(f: NgForm) {
    const registerObserver = {
      next: x => console.log('User Registration Successful'),
      error: err => console.log('Error in registration: ' + err),
    };
    this.authService.register(f.value).subscribe(registerObserver);
  }
}
