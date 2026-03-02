# 🎨 ANALYSE FRONTEND - Synchronisation avec Backend

**Date**: 01 Mars 2026  
**Framework**: Angular 17 + Material  
**Backend**: Spring Boot 3.2.5

---

## 🔍 ÉTAT ACTUEL FRONTEND

### Structure Existante
```
✅ Angular 17 + Material
✅ Architecture modulaire (features)
✅ Services API centralisés
✅ Guards & Interceptors
✅ Models TypeScript
```

### Services Existants
- ✅ `ApiService` - HTTP client centralisé
- ✅ `AuthService` - Authentification basique
- ✅ `StudentService` - CRUD étudiants
- ✅ `NotificationService` - Notifications

---

## ⚠️ INCOHÉRENCES DÉTECTÉES

### 1. Configuration API
```typescript
// ❌ ACTUEL (environment.ts)
apiUrl: 'http://localhost:8080/api'

// ✅ BACKEND RÉEL
apiUrl: 'http://localhost:2001/api-webServices'
```

### 2. Modèle Student
```typescript
// ❌ FRONTEND ACTUEL
interface Student {
  dateOfBirth: string;      // N'existe pas backend
  gender: 'MALE' | 'FEMALE'; // N'existe pas backend
  address?: string;          // N'existe pas backend
  enrollmentDate: string;    // Backend = registrationDate
  classLevel: string;        // Backend = className
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED'; // Backend = SUSPENDED aussi
}

// ✅ BACKEND RÉEL (StudentDTO)
interface Student {
  id?: number;
  matricule: string;                    // MANQUANT frontend
  firstName: string;
  lastName: string;
  className: string;                    // Frontend = classLevel
  phoneNumber?: string;                 // Frontend = phone
  email?: string;
  registrationDate: string;             // Frontend = enrollmentDate
  status: StudentStatus;                // Enum enrichi
  annualTuitionAmount?: number;         // NOUVEAU (enrichissement)
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;                   // NOUVEAU
}
```

### 3. Modèle Response
```typescript
// ❌ FRONTEND ACTUEL
interface ApiResponse<T> {
  success: boolean;    // Backend n'a pas ce champ
  message: string;
  data: T;            // Backend = payload
  timestamp: string;  // Backend n'a pas ce champ
}

// ✅ BACKEND RÉEL (Response.java)
interface ApiResponse<T> {
  status: 'OK' | 'CREATED' | 'BAD_REQUEST' | 'NOT_FOUND' | 'EXCEPTION';
  payload: T;
  metadata?: any;
  message?: any;
}
```

### 4. Authentification
```typescript
// ❌ FRONTEND ACTUEL
interface AuthResponse {
  token: string;
  user: any;
}

// ✅ BACKEND RÉEL (JwtResponse)
interface JwtResponse {
  token: string;
  type: string;      // "Bearer"
  username: string;
  role: string;      // "ADMIN" | "CASHIER"
}
```

### 5. Endpoints
```typescript
// ❌ FRONTEND ACTUEL
POST /auth/login
GET /students
GET /students/:id

// ✅ BACKEND RÉEL
POST /auth/login          ✅ OK
GET /students/all         ❌ Frontend utilise /students
GET /students/:id         ✅ OK
POST /students            ✅ OK
PUT /students/:id         ✅ OK
DELETE /students/:id      ✅ OK
```

---

## 🎯 PLAN DE SYNCHRONISATION

### Phase 1: Configuration & Models (PRIORITAIRE)

#### 1.1 Mettre à jour environment.ts
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:2001/api-webServices',
  appName: 'OncaissePay',
  version: '1.0.0'
};
```

#### 1.2 Créer enums.model.ts
```typescript
export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  GRADUATED = 'GRADUATED'
}

export enum Role {
  ADMIN = 'ADMIN',
  CASHIER = 'CASHIER'
}
```

#### 1.3 Mettre à jour response.model.ts
```typescript
export type ResponseStatus = 
  | 'OK' 
  | 'CREATED' 
  | 'BAD_REQUEST' 
  | 'UNAUTHORIZED'
  | 'NOT_FOUND' 
  | 'DUPLICATE_ENTITY'
  | 'EXCEPTION';

export interface ApiResponse<T> {
  status: ResponseStatus;
  payload?: T;
  metadata?: PageMetadata;
  message?: string | any;
}

export interface PageMetadata {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
```

#### 1.4 Mettre à jour student.model.ts
```typescript
import { StudentStatus } from '@core/models/enums.model';

export interface Student {
  id?: number;
  matricule: string;
  firstName: string;
  lastName: string;
  className: string;
  phoneNumber?: string;
  email?: string;
  registrationDate: string;
  status?: StudentStatus;
  annualTuitionAmount?: number;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface StudentFilter {
  firstName?: string;
  lastName?: string;
  className?: string;
  registrationDate?: string;
  page?: number;
  size?: number;
}
```

#### 1.5 Créer auth.model.ts
```typescript
import { Role } from '@core/models/enums.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  username: string;
  role: Role;
}

export interface User {
  username: string;
  role: Role;
}
```

### Phase 2: Services

#### 2.1 Mettre à jour auth.service.ts
```typescript
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
```

#### 2.2 Mettre à jour student.service.ts
```typescript
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { Student, StudentFilter } from '../models/student.model';
import { ApiResponse, PageMetadata } from '@core/models/response.model';

export interface StudentPageResponse {
  content: Student[];
  metadata: PageMetadata;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiService = inject(ApiService);
  private endpoint = 'students';

  getStudents(filter?: StudentFilter): Observable<StudentPageResponse> {
    return this.apiService.get<ApiResponse<Student[]>>(`${this.endpoint}/all`, filter).pipe(
      map(response => ({
        content: response.payload || [],
        metadata: response.metadata!
      }))
    );
  }

  getStudent(id: number): Observable<Student> {
    return this.apiService.get<ApiResponse<Student>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.payload!)
    );
  }

  createStudent(student: Student): Observable<Student> {
    return this.apiService.post<ApiResponse<Student>>(this.endpoint, student).pipe(
      map(response => response.payload!)
    );
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.apiService.put<ApiResponse<Student>>(`${this.endpoint}/${id}`, student).pipe(
      map(response => response.payload!)
    );
  }

  deleteStudent(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<void>>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
```

### Phase 3: Interceptor JWT

#### 3.1 Créer auth.interceptor.ts
```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@features/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

#### 3.2 Enregistrer dans app.config.ts
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### Phase 4: Guards

#### 4.1 Créer auth.guard.ts
```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@features/auth/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => {
      if (!isAuth) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};
```

#### 4.2 Créer role.guard.ts
```typescript
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
```

---

## 📋 CHECKLIST IMPLÉMENTATION

### Configuration
- [ ] Mettre à jour environment.ts (port 2001)
- [ ] Créer enums.model.ts
- [ ] Mettre à jour response.model.ts
- [ ] Créer auth.model.ts

### Models
- [ ] Mettre à jour student.model.ts
- [ ] Supprimer champs inexistants (dateOfBirth, gender, address)
- [ ] Ajouter champs manquants (matricule, annualTuitionAmount, isActive)

### Services
- [ ] Mettre à jour AuthService
- [ ] Mettre à jour StudentService (endpoint /all)
- [ ] Gérer extraction payload dans responses

### Sécurité
- [ ] Créer auth.interceptor.ts
- [ ] Enregistrer interceptor dans app.config
- [ ] Créer auth.guard.ts
- [ ] Créer role.guard.ts
- [ ] Protéger routes dans app.routes.ts

### Tests
- [ ] Tester login admin
- [ ] Tester login cashier
- [ ] Tester CRUD students avec token
- [ ] Tester accès sans token (403)
- [ ] Tester guards

---

## 🚀 COMMANDES

```bash
# Installer dépendances
npm install

# Démarrer dev
npm start

# Build production
npm run build
```

---

**Prochaine étape**: Implémenter Phase 1 (Configuration & Models) ?
