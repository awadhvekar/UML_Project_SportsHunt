import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-protecteduserlist',
  templateUrl: './protecteduserlist.component.html',
  styleUrls: ['./protecteduserlist.component.css']
})
export class ProtecteduserlistComponent implements OnInit {
  allUserList: any;

  constructor(private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllUsersApi();
  }

  getAllUsersApi(){
    return this.http.get('http://localhost:8000/getUsers').subscribe(response => {
      console.log(response['response']);
      this.allUserList = response['response'];
    },
    error => {
      console.log(error);
      if(error instanceof HttpErrorResponse){
        if(error.status === 401 || error.status === 403){
          this.router.navigate(['login']);
        }
      }
    });
  }

}
