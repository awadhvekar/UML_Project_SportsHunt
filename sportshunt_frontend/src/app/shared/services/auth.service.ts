 import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { map } from 'rxjs/operators';
 import { JwtHelperService } from "@auth0/angular-jwt";

 @Injectable({
   providedIn: 'root',
 })
 export class AuthService {
   authUrl = 'http://localhost:8000/';
    helper = new JwtHelperService();
    decodedToken: any;
    loggedInUserName: any;
    loggedInUserId: Number;
    loggedInUserEmail: any;

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
           //store token
           //this.decodedToken = this.helper.decodeToken("pass_token_here");
           //console.log(this.decodedToken);
          localStorage.setItem('message', user.message);

          localStorage.setItem('loggedInUserId', user.response[0].user_id);
          localStorage.setItem('loggedInUserFirstName', user.response[0].first_name);
          localStorage.setItem('loggedInUserLastName', user.response[0].last_name);
          localStorage.setItem('loggedInUserEmail', user.response[0].email_id);

          localStorage.setItem('loggedInUserToken', user.token);

          this.loggedInUserName = user.response[0].first_name + " " + user.response[0].last_name;
          this.loggedInUserEmail = user.response[0].email_id;
          this.loggedInUserId = user.response[0].user_id;
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

   addOrderMakePaymentApi(model: any) {
    return this.http.post(this.authUrl + "confirmTicketMakePayment", model).pipe(
      map((response: any) => {
       const user = response;
       /*
       if(user.error){
         localStorage.setItem('message', user.message);
       }
       else
       {
         localStorage.setItem('message', 'Registration Successful!');
       }
       */
      })
    );
  }

  addEventReviewApi(model: any) {
    return this.http.post(this.authUrl + "addEventReview", model).pipe(
      map((response: any) => {
       const user = response;
       /*
       if(user.error){
         localStorage.setItem('message', user.message);
       }
       else
       {
         localStorage.setItem('message', 'Registration Successful!');
       }
       */
      })
    );
  }

   loggedIn(){
     /*
     const token = localStorage.getItem('token');
     return !this.helper.isTokenExpired(token);
     */

     const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
     const loggedInUserFirstName = localStorage.getItem('loggedInUserFirstName');
     const loggedInUserId = localStorage.getItem('loggedInUserId');
     const loggedInUserLastName = localStorage.getItem('loggedInUserLastName');
     const message = localStorage.getItem('message');
     const token = localStorage.getItem('loggedInUserToken');

     if(token == null || loggedInUserEmail==null || loggedInUserFirstName==null || loggedInUserId==null || loggedInUserLastName==null || message.toLowerCase() != "login successful.")
     {
       return false;
     }
     else
     {
       return true;
     }
   }

   getJwtTokenFromClient(){
     return localStorage.getItem('loggedInUserToken');
   }

  dailyForecast(city:any) {
    return this.http.get("http://api.openweathermap.org/data/2.5/forecast?q="+ city +"&appid=70a5d26982ce6a2f955b54272bdbae4d")
    .pipe(map(result => result));
  }
}
