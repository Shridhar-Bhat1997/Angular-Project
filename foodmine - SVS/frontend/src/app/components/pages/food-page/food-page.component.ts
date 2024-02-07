import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {
  // Represents the details of the selected food
  food!: Food;

  constructor(
    // ActivatedRoute provides access to route parameters
    activatedRoute: ActivatedRoute,

    // FoodService is a service for retrieving food data
    foodService: FoodService,

    // CartService is a service for managing the shopping cart
    private cartService: CartService,

    // Router is used for navigation
    private router: Router
  ) {
    // Subscribe to route parameter changes to get the food details
    activatedRoute.params.subscribe((params) => {
      if (params.id)
        // Fetch the food details from the server based on the provided ID
        foodService.getFoodById(params.id).subscribe((serverFood) => this.food = serverFood);
    });
  }

  ngOnInit(): void {
    // ngOnInit is a lifecycle hook called after the component is initialized
  }

  // Method to add the current food item to the shopping cart
  addToCart() {
    // Call the addToCart method of the CartService, passing the current food item
    this.cartService.addToCart(this.food);

    // Navigate to the cart page after adding the item to the cart
    this.router.navigateByUrl('/cart-page');
  }
}
