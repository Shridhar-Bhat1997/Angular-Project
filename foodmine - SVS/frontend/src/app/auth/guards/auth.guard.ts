import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Check if there is a valid user token in the UserService
    if (this.userService.currentUser.token) {
      return true; // Allow access to the route
    }

    // If no valid token, redirect to the login page and store the intended URL as a query parameter
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Deny access to the route
  }
}
