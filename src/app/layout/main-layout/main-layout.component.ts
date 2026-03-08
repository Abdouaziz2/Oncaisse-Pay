import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@features/auth/auth.service';
import { Role } from '@core/models/enums.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$ = this.authService.currentUser$;
  
  menuItems$ = this.currentUser$.pipe(
    map(user => {
      const items = [
        { icon: 'dashboard', label: 'Tableau de bord', route: '/dashboard', roles: [] },
        { icon: 'school', label: 'Étudiants', route: '/students', roles: [] },
        { icon: 'class', label: 'Classes', route: '/classes', roles: [Role.ADMIN, Role.SCHOOL_ADMIN] },
        { icon: 'payments', label: 'Paiements', route: '/payments', roles: [Role.ADMIN, Role.CASHIER, Role.SCHOOL_ADMIN] },
        { icon: 'people', label: 'Utilisateurs', route: '/users', roles: [Role.SCHOOL_ADMIN] },
        { icon: 'business', label: 'Écoles', route: '/schools', roles: [Role.SUPER_ADMIN] }
      ];
      
      return items.filter(item => 
        item.roles.length === 0 || (user && item.roles.includes(user.role))
      );
    })
  );

  logout(): void {
    this.authService.logout();
  }
}
