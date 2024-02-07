import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Orders';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent {
  // Represents the current order being processed
  order: Order = new Order();

  // Constructor is used to initialize the component with necessary services
  constructor(orderService: OrderService, router: Router) {
    // Subscribe to the orderService to get the new order for the current user
    orderService.getNewOrderForCurrentUser().subscribe({
      // If the order is successfully retrieved, assign it to the 'order' property
      next: (order) => {
        this.order = order;
      },
      // If there is an error (e.g., no new order found), navigate to the checkout page
      error: () => {
        router.navigateByUrl('/checkout');
      }
    });
  }
}
