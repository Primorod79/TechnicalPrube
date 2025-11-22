import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSubscription?: Subscription;
  private cartSubscription?: Subscription;
  isAuthenticated = false;
  isAdmin = false;
  username = '';
  cartItemCount = 0;

  constructor(
    public readonly authService: AuthService,
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      console.log('Navbar - User changed:', user);
      this.isAuthenticated = !!user;
      this.isAdmin = user?.role === 'Admin';
      this.username = user?.username || '';
      console.log('Navbar - isAuthenticated:', this.isAuthenticated, 'isAdmin:', this.isAdmin);
      this.cdr.detectChanges();
    });

    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(() => {
      const cart = this.cartService.getCart();
      this.cartItemCount = cart.totalItems;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
