import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Orders';

@Component({
  selector: 'app-order-track-page',
  templateUrl: './order-track-page.component.html',
  styleUrls: ['./order-track-page.component.css']
})
export class OrderTrackPageComponent {
  // Declare a variable to store order details
  order!: Order;

  // Constructor to initialize the component
  constructor(activatedRoute: ActivatedRoute, orderService: OrderService) {
    // Extract orderId from route parameters
    const params = activatedRoute.snapshot.params;

    // Check if orderId is available in the route parameters
    if (!params.orderId) {
      return;
    }

    // Subscribe to the order tracking service to get details of the specified order
    orderService.trackOrderById(params.orderId).subscribe(order => {
      // Assign the retrieved order details to the component variable
      this.order = order;
    });
  }
}
