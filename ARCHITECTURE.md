# 🏗️ Architecture OncaissePay Frontend

## 📊 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     OncaissePay Frontend                        │
│                    Angular 17+ Standalone                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         App Routes                              │
├─────────────────────────────────────────────────────────────────┤
│  Public Routes (No Auth)                                        │
│  ├─ /auth/login              → LoginComponent                   │
│  ├─ /payment/check           → PaymentCheckComponent            │
│  └─ /payment/process         → PaymentProcessComponent          │
│                                                                  │
│  Protected Routes (AuthGuard + MainLayout)                      │
│  ├─ /dashboard               → DashboardComponent               │
│  ├─ /students                → StudentListComponent             │
│  ├─ /students/new            → StudentFormComponent             │
│  ├─ /students/edit/:id       → StudentFormComponent             │
│  ├─ /payments (RoleGuard)    → PaymentListComponent             │
│  └─ /payments/:id (RoleGuard)→ PaymentDetailComponent           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  Guards                                                         │
│  ├─ authGuard          → Vérifie JWT token                      │
│  └─ roleGuard          → Vérifie rôles (ADMIN/CASHIER)          │
│                                                                  │
│  Interceptors                                                   │
│  ├─ authInterceptor    → Ajoute JWT aux requêtes                │
│  └─ errorInterceptor   → Gère les erreurs HTTP                  │
│                                                                  │
│  Services                                                       │
│  ├─ ApiService         → HTTP client centralisé                 │
│  └─ NotificationService→ Toasts & messages                      │
│                                                                  │
│  Models                                                         │
│  ├─ enums.model.ts     → StudentStatus, Role, PaymentStatus,    │
│  │                        PaymentMethod                         │
│  ├─ auth.model.ts      → User, LoginRequest, AuthResponse       │
│  ├─ response.model.ts  → ApiResponse<T>, PageMetadata           │
│  └─ page-metadata.model.ts                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Features Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Auth Module                                             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Components: LoginComponent                              │  │
│  │  Services:   AuthService                                 │  │
│  │  Models:     (dans core/models/auth.model.ts)            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Dashboard Module                                        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Components: DashboardComponent                          │  │
│  │  Services:   DashboardService                            │  │
│  │  Models:     DashboardStats                              │  │
│  │  Features:   - 6 KPIs en temps réel                      │  │
│  │              - Statistiques étudiants/paiements          │  │
│  │              - Taux de recouvrement                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Students Module                                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Components: StudentListComponent                        │  │
│  │              StudentFormComponent                        │  │
│  │              StudentDetailComponent                      │  │
│  │  Services:   StudentService                              │  │
│  │  Models:     Student, StudentFilter                      │  │
│  │  Features:   - CRUD complet                              │  │
│  │              - Pagination & filtres                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Payments Module                                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Components:                                             │  │
│  │    Public:                                               │  │
│  │    ├─ PaymentCheckComponent   (Vérifier paiement)       │  │
│  │    └─ PaymentProcessComponent (Effectuer paiement)      │  │
│  │    Protected (ADMIN/CASHIER):                            │  │
│  │    ├─ PaymentListComponent    (Liste paginée)           │  │
│  │    └─ PaymentDetailComponent  (Détails)                 │  │
│  │                                                           │  │
│  │  Services:   PaymentService                              │  │
│  │    ├─ checkPayment()                                     │  │
│  │    ├─ processPayment()                                   │  │
│  │    ├─ getPayments()                                      │  │
│  │    ├─ getPayment()                                       │  │
│  │    └─ generateMonthlyPayments()                          │  │
│  │                                                           │  │
│  │  Models:     Payment, PaymentCheck, PaymentProcess,     │  │
│  │              PaymentFilter                               │  │
│  │                                                           │  │
│  │  Features:   - Vérification publique                     │  │
│  │              - 4 méthodes de paiement                    │  │
│  │              - Génération de reçus                       │  │
│  │              - Filtres multiples                         │  │
│  │              - Génération mensuelle                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Layout Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  MainLayoutComponent                                            │
│  ├─ Sidebar (Navigation)                                        │
│  │  ├─ Dashboard                                                │
│  │  ├─ Étudiants                                                │
│  │  └─ Paiements                                                │
│  ├─ Header (Toolbar)                                            │
│  │  ├─ Notifications                                            │
│  │  └─ User Menu (Profil, Déconnexion)                         │
│  └─ Content (router-outlet)                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Shared Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  Components                                                     │
│  ├─ LoadingSpinnerComponent                                    │
│  ├─ ConfirmDialogComponent                                     │
│  └─ PageHeaderComponent                                        │
│                                                                  │
│  Directives                                                     │
│  └─ (à ajouter si nécessaire)                                  │
│                                                                  │
│  Pipes                                                          │
│  └─ (à ajouter si nécessaire)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  Base URL: http://localhost:2001/api-webServices               │
│                                                                  │
│  Auth Endpoints                                                 │
│  └─ POST /auth/login                                            │
│                                                                  │
│  Dashboard Endpoints                                            │
│  └─ GET  /dashboard/statistics                                  │
│                                                                  │
│  Students Endpoints                                             │
│  ├─ GET    /students/all                                        │
│  ├─ GET    /students/{id}                                       │
│  ├─ POST   /students                                            │
│  ├─ PUT    /students/{id}                                       │
│  └─ DELETE /students/{id}                                       │
│                                                                  │
│  Payments Endpoints                                             │
│  ├─ POST /payments/check          (Public)                      │
│  ├─ POST /payments/process        (Public)                      │
│  ├─ GET  /payments/all            (Protected)                   │
│  ├─ GET  /payments/{id}           (Protected)                   │
│  └─ POST /payments/generate       (Protected)                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flux de Données

### Flux Authentification
```
LoginComponent → AuthService → ApiService → Backend
                      ↓
                 localStorage (JWT)
                      ↓
              authInterceptor (ajoute token)
                      ↓
              Toutes les requêtes HTTP
```

### Flux Dashboard
```
DashboardComponent → DashboardService → ApiService → GET /dashboard/statistics
                                                              ↓
                                                        DashboardStats
                                                              ↓
                                                    Affichage 6 KPIs
```

### Flux Payment Check (Public)
```
PaymentCheckComponent → PaymentService → ApiService → POST /payments/check
                                                              ↓
                                                          Payment DTO
                                                              ↓
                                                    Affichage infos
                                                              ↓
                                              Bouton "Payer Maintenant"
                                                              ↓
                                              Navigation vers Process
```

### Flux Payment Process (Public)
```
PaymentProcessComponent → PaymentService → ApiService → POST /payments/process
                                                              ↓
                                                          Payment DTO
                                                              ↓
                                                    Affichage reçu
```

### Flux Payment List (Admin)
```
PaymentListComponent → PaymentService → ApiService → GET /payments/all?filters
                                                              ↓
                                                    PaymentPageResponse
                                                              ↓
                                                    Tableau paginé
                                                              ↓
                                              Click sur paiement
                                                              ↓
                                              Navigation vers Detail
```

## 🔐 Sécurité

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Request → authGuard → Vérifie JWT                              │
│                ↓                                                 │
│              Valid?                                              │
│            ↙       ↘                                             │
│          OUI       NON                                           │
│           ↓         ↓                                            │
│      roleGuard   Redirect                                        │
│           ↓       /login                                         │
│    Vérifie rôle                                                  │
│      ↙     ↘                                                     │
│   ADMIN   CASHIER                                                │
│     ↓       ↓                                                    │
│   Accès autorisé                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📦 Structure des Fichiers

```
src/app/
├── core/                           # Singleton services & guards
│   ├── guards/
│   │   ├── auth.guard.ts          ✅
│   │   └── role.guard.ts          ✅
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    ✅
│   │   └── error.interceptor.ts   ✅
│   ├── models/
│   │   ├── auth.model.ts          ✅
│   │   ├── enums.model.ts         ✅ (+ PaymentStatus, PaymentMethod)
│   │   ├── page-metadata.model.ts ✅
│   │   └── response.model.ts      ✅
│   └── services/
│       ├── api.service.ts         ✅
│       └── notification.service.ts✅
│
├── features/                       # Feature modules
│   ├── auth/
│   │   ├── login/
│   │   │   └── login.component.ts ✅
│   │   └── auth.service.ts        ✅
│   │
│   ├── dashboard/
│   │   ├── models/
│   │   │   └── dashboard.model.ts ✅ NEW
│   │   ├── services/
│   │   │   └── dashboard.service.ts ✅ NEW
│   │   └── dashboard.component.ts ✅ UPDATED
│   │
│   ├── students/
│   │   ├── components/
│   │   │   ├── student-list/      ✅
│   │   │   ├── student-form/      ✅
│   │   │   └── student-detail/    ✅
│   │   ├── models/
│   │   │   └── student.model.ts   ✅
│   │   └── services/
│   │       └── student.service.ts ✅
│   │
│   └── payments/                   ✅ NEW MODULE
│       ├── components/
│       │   ├── payment-check/
│       │   │   └── payment-check.component.ts ✅ NEW
│       │   ├── payment-process/
│       │   │   └── payment-process.component.ts ✅ NEW
│       │   ├── payment-list/
│       │   │   ├── payment-list.component.ts ✅ NEW
│       │   │   ├── payment-list.component.html ✅ NEW
│       │   │   └── payment-list.component.scss ✅ NEW
│       │   └── payment-detail/
│       │       └── payment-detail.component.ts ✅ NEW
│       ├── models/
│       │   └── payment.model.ts   ✅ NEW
│       └── services/
│           └── payment.service.ts ✅ NEW
│
├── layout/                         # Layout components
│   ├── main-layout/
│   │   ├── main-layout.component.ts ✅ UPDATED
│   │   ├── main-layout.component.html ✅
│   │   └── main-layout.component.scss ✅
│   ├── header/
│   ├── sidebar/
│   └── footer/
│
├── shared/                         # Shared components
│   ├── components/
│   │   ├── loading-spinner/       ✅
│   │   ├── confirm-dialog/        ✅
│   │   └── page-header/           ✅
│   ├── directives/
│   └── pipes/
│
├── app.component.ts                ✅
├── app.config.ts                   ✅
└── app.routes.ts                   ✅ UPDATED
```

## 📊 Statistiques

- **Modules**: 4 (Auth, Dashboard, Students, Payments)
- **Composants**: 11
- **Services**: 6
- **Guards**: 2
- **Interceptors**: 2
- **Routes**: 10 (4 publiques, 6 protégées)
- **Models**: 8 interfaces
- **Enums**: 4

## 🎯 Patterns Utilisés

1. **Standalone Components** - Angular 17+
2. **Dependency Injection** - inject()
3. **Reactive Forms** - FormBuilder, Validators
4. **Observable Pattern** - RxJS
5. **Service Layer** - Séparation logique métier
6. **DTO Pattern** - Transfert de données
7. **Guard Pattern** - Sécurité des routes
8. **Interceptor Pattern** - Middleware HTTP
9. **Repository Pattern** - ApiService centralisé
10. **Material Design** - UI cohérente

## ✅ Conformité

- ✅ Architecture modulaire
- ✅ Séparation des responsabilités
- ✅ Code réutilisable
- ✅ Type-safe (TypeScript)
- ✅ Reactive programming
- ✅ Security best practices
- ✅ Material Design
- ✅ Responsive design
- ✅ Accessibility (ARIA)
- ✅ Performance optimized
