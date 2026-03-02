import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { Role } from '@core/models/enums.model';
import { map } from 'rxjs';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      map(user => {
        if (!user || !allowedRoles.includes(user.role)) {
          router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      })
    );
  };
};
