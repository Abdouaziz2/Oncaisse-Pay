import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { LoginRequest, JwtResponse, User } from '@core/models/auth.model';
import { ApiResponse } from '@core/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
  currentUser$ = this.currentUserSubject.asObservable();
  
  isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.apiService.post<ApiResponse<JwtResponse>>('auth/login', credentials).pipe(
      map(response => response.payload!),
      tap(jwtResponse => {
        localStorage.setItem('access_token', jwtResponse.token);
        localStorage.setItem('username', jwtResponse.username);
        localStorage.setItem('role', jwtResponse.role);
        this.currentUserSubject.next({
          username: jwtResponse.username,
          role: jwtResponse.role
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getUserFromToken(): User | null {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role') as any;
    return username && role ? { username, role } : null;
  }
}
