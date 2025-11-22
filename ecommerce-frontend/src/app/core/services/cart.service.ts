import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  /**
   * Get current cart items
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  /**
   * Get cart summary
   */
  getCart(): Cart {
    const items = this.cartItemsSubject.value;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return {
      items,
      totalItems,
      totalPrice
    };
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product, quantity: number = 1): void {
    const items = this.cartItemsSubject.value;
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.updateCart(items);
  }

  /**
   * Update quantity of a product in cart
   */
  updateQuantity(productId: number, quantity: number): void {
    const items = this.cartItemsSubject.value;
    const item = items.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.updateCart(items);
      }
    }
  }

  /**
   * Remove product from cart
   */
  removeFromCart(productId: number): void {
    const items = this.cartItemsSubject.value.filter(
      item => item.product.id !== productId
    );
    this.updateCart(items);
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this.updateCart([]);
  }

  /**
   * Update cart and save to localStorage
   */
  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }
}
