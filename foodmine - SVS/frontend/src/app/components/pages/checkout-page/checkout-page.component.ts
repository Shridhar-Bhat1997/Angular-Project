import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Orders';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  // Represents the order being processed in the checkout
  order: Order = new Order();

  // Form group for the checkout form
  checkoutForm!: FormGroup;

  constructor(
    cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private router: Router
  ) {
    // Initialize the order with items and total price from the cart
    const cart = cartService.getCart();
    this.order.items = cart.items;
    this.order.totalPrice = cart.totalPrice;
  }

  ngOnInit(): void {
    // Retrieve user's name and address from the UserService and set up the checkout form
    let { name, address } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required]
    });
  }

  // Helper method to access form controls
  get fc() {
    return this.checkoutForm.controls;
  }

  // Method to create the order
  createOrder() {
    // Check if the form is invalid
    if (this.checkoutForm.invalid) {
      this.toastrService.warning("Please fill in all the inputs", "Invalid inputs");
      return;
    }

    // Check if the user has selected their location on the map
    if (!this.order.addressLatLng) {
      this.toastrService.warning("Please select your location on the map", "Invalid inputs");
      return;
    }

    // Update the order with the entered name and address
    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;

    // Subscribe to the OrderService to create the order
    this.orderService.create(this.order).subscribe({
      next: () => {
        // If successful, navigate to the payment page
        this.router.navigateByUrl('/payment');
      },
      error: (errorResponse) => {
        // If there is an error, display a toastr error message
        this.toastrService.error(errorResponse.error, 'Cart');
      }
    });
  }
}
