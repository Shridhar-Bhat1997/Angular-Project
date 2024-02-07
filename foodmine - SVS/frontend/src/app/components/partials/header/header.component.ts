import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Orders';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cartQuantity=0;
  user!:User;
  constructor(cartService:CartService,private userService:UserService) {
     // Subscribe to changes in the cart to update cartQuantity
    cartService.getCartObservable().subscribe((newCart) => {
      this.cartQuantity = newCart.totalCount;
    })

    //Subscribe to changes in the user to update user information
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
   }

  ngOnInit(): void {
  }

   // Logout function triggered when the "Logout" link is clicked

  logout(){
    this.userService.logout();
  }

   // Getter to check if the user is authenticated
  get isAuth(){
    return this.user.token;
  }
}