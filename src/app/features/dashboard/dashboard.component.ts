import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from './services/dashboard.service';
import { DashboardStats } from './models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de Bord</h1>
      
      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card">
          <mat-icon>school</mat-icon>
          <h2>{{ stats.activeStudents }}</h2>
          <p>Étudiants Actifs</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>payments</mat-icon>
          <h2>{{ stats.paidPayments }}</h2>
          <p>Paiements Effectués</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>attach_money</mat-icon>
          <h2>{{ stats.totalRevenue | number:'1.0-0' }} FCFA</h2>
          <p>Revenus Totaux</p>
        </mat-card>

        <mat-card class="stat-card warning">
          <mat-icon>pending</mat-icon>
          <h2>{{ stats.pendingPayments }}</h2>
          <p>En Attente</p>
        </mat-card>

        <mat-card class="stat-card danger">
          <mat-icon>warning</mat-icon>
          <h2>{{ stats.latePayments }}</h2>
          <p>En Retard</p>
        </mat-card>

        <mat-card class="stat-card success">
          <mat-icon>trending_up</mat-icon>
          <h2>{{ stats.collectionRate | number:'1.1-1' }}%</h2>
          <p>Taux de Recouvrement</p>
        </mat-card>
      </div>

      <div *ngIf="!stats" class="loading">Chargement...</div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }

    h1 {
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .stat-card {
      padding: 24px;
      text-align: center;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #1976d2;
      }

      &.warning mat-icon { color: #ff9800; }
      &.danger mat-icon { color: #f44336; }
      &.success mat-icon { color: #4caf50; }

      h2 {
        margin: 16px 0 8px;
        font-size: 32px;
        font-weight: 500;
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .loading {
      text-align: center;
      padding: 48px;
      color: #666;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  stats: DashboardStats | null = null;

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.dashboardService.getStatistics().subscribe({
      next: (data) => this.stats = data,
      error: () => this.stats = null
    });
  }
}
