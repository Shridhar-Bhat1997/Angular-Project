import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  // Intercept method is invoked for every outgoing HTTP request
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Retrieve the current user from the UserService
    const user = this.userService.currentUser;

    // Check if the user has a valid token
    if (user.token) {
      // Clone the request and set the token in the headers
      request = request.clone({
        setHeaders: {
          access_token: user.token
        }
      });
    }

    // Pass the modified request to the next handler in the chain
    return next.handle(request);
  }
}
