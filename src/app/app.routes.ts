import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';
import { LoginComponent } from '@features/auth/login/login.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { StudentListComponent } from '@features/students/components/student-list/student-list.component';
import { StudentFormComponent } from '@features/students/components/student-form/student-form.component';
import { roleGuard } from '@core/guards/role.guard';
import { Role } from '@core/models/enums.model';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'students', component: StudentListComponent },
      { path: 'students/new', component: StudentFormComponent },
      { path: 'students/edit/:id', component: StudentFormComponent },
    ]
  }
];

