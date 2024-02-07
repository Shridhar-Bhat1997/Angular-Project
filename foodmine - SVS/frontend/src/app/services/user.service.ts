import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { User } from '../shared/models/User';
import { IUserRegister } from '../shared/interfaces/IUserRegister';

// Local storage key for storing user data
const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject =
  new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient, private toastrService:ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }
  // Getter for the current user
  public get currentUser():User{
    return this.userSubject.value
  }

 // Method to log in a user
  login(userLogin:IUserLogin):Observable<User>{
    
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) =>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}!`,
            'Login Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }

 // Method to register a new user
  register(userRegister:IUserRegister):Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL,userRegister).pipe(
      tap({
        next: (user) =>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}`!,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Register Failed');
        }
      })
    );
  }

   // Method to log out the current user
  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

   // Helper method to set the user data to local storage
  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

    // Helper method to get the user data from local storage

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }
}