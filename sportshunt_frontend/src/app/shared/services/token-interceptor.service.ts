import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(request, next){
    let authService = this.injector.get(AuthService);
    let tokenizedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getJwtTokenFromClient()}`
      }
    });

    return next.handle(tokenizedRequest);
  }
}
