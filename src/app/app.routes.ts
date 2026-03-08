import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { LoginComponent } from '@features/auth/login/login.component';
import { OAuth2RedirectComponent } from '@features/auth/oauth2-redirect/oauth2-redirect.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { StudentListComponent } from '@features/students/components/student-list/student-list.component';
import { StudentFormComponent } from '@features/students/components/student-form/student-form.component';
import { StudentDetailComponent } from '@features/students/components/student-detail/student-detail.component';
import { PaymentCheckComponent } from '@features/payments/components/payment-check/payment-check.component';
import { PaymentProcessComponent } from '@features/payments/components/payment-process/payment-process.component';
import { PaymentListComponent } from '@features/payments/components/payment-list/payment-list.component';
import { PaymentDetailComponent } from '@features/payments/components/payment-detail/payment-detail.component';
import { ClassListComponent } from '@features/classes/components/class-list.component';
import { SchoolRegistrationComponent } from '@features/schools/components/school-registration/school-registration.component';
import { SchoolListComponent } from '@features/schools/components/school-list/school-list.component';
import { UserListComponent } from '@features/users/components/user-list/user-list.component';
import { UserFormComponent } from '@features/users/components/user-form/user-form.component';
import { roleGuard } from '@core/guards/role.guard';
import { Role } from '@core/models/enums.model';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'oauth2/redirect', component: OAuth2RedirectComponent },
  { path: 'register-school', component: SchoolRegistrationComponent },
  { path: 'payment/check', component: PaymentCheckComponent },
  { path: 'payment/process', component: PaymentProcessComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'students', component: StudentListComponent },
      { path: 'students/new', component: StudentFormComponent },
      { path: 'students/:id', component: StudentDetailComponent },
      { path: 'students/edit/:id', component: StudentFormComponent },
      { 
        path: 'classes', 
        component: ClassListComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.SCHOOL_ADMIN] }
      },
      { 
        path: 'payments', 
        component: PaymentListComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.CASHIER, Role.SCHOOL_ADMIN] }
      },
      { 
        path: 'payments/:id', 
        component: PaymentDetailComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.ADMIN, Role.CASHIER, Role.SCHOOL_ADMIN] }
      },
      { 
        path: 'schools', 
        component: SchoolListComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.SUPER_ADMIN] }
      },
      { 
        path: 'users', 
        component: UserListComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.SCHOOL_ADMIN] }
      },
      { 
        path: 'users/create', 
        component: UserFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.SCHOOL_ADMIN] }
      }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];

