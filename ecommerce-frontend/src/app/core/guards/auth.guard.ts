import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    // Check for admin routes
    if (route.data['requireAdmin'] && !authService.isAdmin) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  // Not logged in, redirect to login page
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
