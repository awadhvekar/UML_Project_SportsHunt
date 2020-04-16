import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(request, next){
    //console.log("Request: " + JSON.stringify(request));
    // console.log(request.url);
    let currentUrlString = request.url;
    if(currentUrlString.includes('https://app.ticketmaster.com/discovery/v2/events.json')){
      console.log("URL: " + currentUrlString);
      let tokenizedRequest = request.clone();
      return next.handle(tokenizedRequest);
    }

    let authService = this.injector.get(AuthService);
    let tokenizedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getJwtTokenFromClient()}`
      }
    });

    return next.handle(tokenizedRequest);
  }
}
