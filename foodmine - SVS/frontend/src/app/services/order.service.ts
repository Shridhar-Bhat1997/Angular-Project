import { Injectable } from '@angular/core';
import { Order } from '../shared/models/Orders';
import { HttpClient } from '@angular/common/http';
import {
  ORDER_CREATE_URL,
  ORDER_NEW_FOR_CURRENT_USER_URL,
  ORDER_PAY_URL,
  ORDER_TRACK_URL
} from '../shared/constants/urls';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  // Method to create a new order
  create(order: Order): Observable<Order> {
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  // Method to fetch a new order for the current user
  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }

  // Method to initiate the payment for an order
  pay(order: Order): Observable<string> {
    return this.http.post<string>(ORDER_PAY_URL, order);
  }

  // Method to track an order by its ID
  trackOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(ORDER_TRACK_URL + id);
  }
}
