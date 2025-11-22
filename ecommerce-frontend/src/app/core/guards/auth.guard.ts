import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.token;
  const user = authService.currentUserValue;

  console.log('AuthGuard - Token:', !!token, 'User:', !!user, 'Path:', state.url);

  if (token && user) {
    // Check for admin routes
    if (route.data['requireAdmin'] && !authService.isAdmin) {
      console.log('AuthGuard - User is not admin, redirecting to home');
      router.navigate(['/']);
      return false;
    }
    console.log('AuthGuard - Access granted');
    return true;
  }

  // Not logged in, redirect to login page
  console.log('AuthGuard - Not authenticated, redirecting to login');
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
