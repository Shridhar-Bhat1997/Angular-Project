import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Orders';

// Declare the PayPal variable to avoid TypeScript errors
declare var paypal: any;

@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css']
})
export class PaypalButtonComponent implements OnInit {

  // Input property to receive the order details
  @Input() order!: Order;

  // Reference to the PayPal button element in the template
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    // Store the component context
    const self = this;

    // Initialize the PayPal buttons
    paypal
      .Buttons({
        // Function to create the order when the button is clicked
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: self.order.totalPrice,
                },
              },
            ],
          });
        },

        // Function called when the payment is approved
        onApprove: async (data: any, actions: any) => {
          // Capture the payment details
          const payment = await actions.order.capture();

          // Set the payment ID in the order and proceed with payment processing
          self.order.paymentId = payment.id;

          // Call the orderService to complete the payment
          self.orderService.pay(self.order).subscribe({
            next: (orderId) => {
              // Clear the cart, navigate to the order tracking page, and show a success message
              self.cartService.clearCart();
              self.router.navigateByUrl('/track/' + orderId);
              self.toastrService.success('Payment Saved Successfully', 'Success');
            },
            error: (error) => {
              // Show an error message if the payment processing fails
              self.toastrService.error('Payment Save Failed', 'Error');
            }
          });
        },

        // Function called when an error occurs during payment
        onError: (err: any) => {
          // Show an error message and log the error
          self.toastrService.error('Payment Failed', 'Error');
          console.log(err);
        },
      })
      // Render the PayPal button in the specified native element
      .render(this.paypalElement.nativeElement);
  }
}
