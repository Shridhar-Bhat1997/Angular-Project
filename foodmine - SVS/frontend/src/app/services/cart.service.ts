import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../shared/models/Cart';
import { CartItem } from '../shared/models/CartItem';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Initialize cart with data from local storage or create a new one
  private cart: Cart = this.getCartFromLocalStorage();

  // Subject to hold the current state of the cart and notify subscribers
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  // Constructor for the CartService
  constructor() { }

  // Method to add a food item to the cart
  addToCart(food: Food): void {
    // Check if the item is already in the cart
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if (cartItem)
      return; // If it exists, do nothing

    // If not, add a new CartItem to the cart
    this.cart.items.push(new CartItem(food));

    // Update local storage and notify subscribers
    this.setCartToLocalStorage();
  }

  // Method to remove a food item from the cart based on its ID
  removeFromCart(foodId: string): void {
    // Filter out the item with the specified ID
    this.cart.items = this.cart.items.filter(item => item.food.id != foodId);

    // Update local storage and notify subscribers
    this.setCartToLocalStorage();
  }

  // Method to change the quantity of a specific food item in the cart
  changeQuantity(foodId: string, quantity: number) {
    // Find the item with the specified ID
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if (!cartItem) return; // If not found, do nothing

    // Update quantity and price based on the new quantity
    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;

    // Update local storage and notify subscribers
    this.setCartToLocalStorage();
  }

  // Method to clear the entire cart
  clearCart() {
    // Create a new Cart object
    this.cart = new Cart();

    // Update local storage and notify subscribers
    this.setCartToLocalStorage();
  }

  // Method to get an Observable that emits the current state of the cart
  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  // Method to get the current state of the cart synchronously
  getCart(): Cart {
    return this.cartSubject.value;
  }

  // Private method to update local storage with the current cart state
  private setCartToLocalStorage(): void {
    // Calculate total price and total count
    this.cart.totalPrice = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    // Convert cart object to JSON and store in local storage
    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('Cart', cartJson);

    // Notify subscribers with the updated cart
    this.cartSubject.next(this.cart);
  }

  // Private method to get the cart from local storage during initialization
  private getCartFromLocalStorage(): Cart {
    // Retrieve cart data from local storage or create a new cart
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }
}
