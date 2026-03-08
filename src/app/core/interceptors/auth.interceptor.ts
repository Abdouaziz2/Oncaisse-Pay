import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@features/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const schoolId = localStorage.getItem('schoolId');

  if (token) {
    const headers: any = {
      Authorization: `Bearer ${token}`
    };
    
    if (schoolId) {
      headers['X-School-Id'] = schoolId;
    }
    
    req = req.clone({ setHeaders: headers });
  }

  return next(req);
};
