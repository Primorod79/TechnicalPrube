import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalItems = 0;
  totalPrice = 0;
  private cartSubscription?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      this.loadCart();
    });
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  loadCart(): void {
    const cart = this.cartService.getCart();
    this.cartItems = cart.items;
    this.totalItems = cart.totalItems;
    this.totalPrice = cart.totalPrice;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  increaseQuantity(productId: number, currentQuantity: number): void {
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: number, currentQuantity: number): void {
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    }
  }
}
