import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] || [];

  return authService.currentUser$.pipe(
    map(user => {
      if (!user || !allowedRoles.includes(user.role)) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    })
  );
};
