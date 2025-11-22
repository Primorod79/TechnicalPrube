import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private userSubscription?: Subscription;
  isAuthenticated = false;
  isAdmin = false;
  username = '';

  constructor(
    public readonly authService: AuthService,
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
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
