 import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { map } from 'rxjs/operators';

 @Injectable({
   providedIn: 'root',
 })
 export class AuthService {
   authUrl = 'http://localhost:8000/';
   constructor(private http: HttpClient) {}

   login(model: any) {
     return this.http.post(this.authUrl + "login", model).pipe(  
       map((response: any) => {
         const user = response;
         if (user.error) {
           localStorage.setItem('message', user.message);
         }
         else
         {
          localStorage.setItem('message', user.message);

          localStorage.setItem('loggedInUserId', user.response[0].user_id);
          localStorage.setItem('loggedInUserFirstName', user.response[0].first_name);
          localStorage.setItem('loggedInUserLastName', user.response[0].last_name);
          localStorage.setItem('loggedInUserEmail', user.response[0].email_id);
         }
       })
     );
   }

   register(model: any) {
     return this.http.post(this.authUrl + "register", model).pipe(
       map((response: any) => {
        const user = response;
        if(user.error){
          localStorage.setItem('message', user.message);
        }
        else
        {
          //localStorage.setItem('message', user.message);
          localStorage.setItem('message', 'Registration Successful!');
        }
       })
     );
   }
}
