import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de Bord</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon>school</mat-icon>
          <h2>1,234</h2>
          <p>Étudiants</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>payments</mat-icon>
          <h2>567</h2>
          <p>Paiements ce mois</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>attach_money</mat-icon>
          <h2>45,678 €</h2>
          <p>Revenus totaux</p>
        </mat-card>

        <mat-card class="stat-card">
          <mat-icon>pending</mat-icon>
          <h2>23</h2>
          <p>En attente</p>
        </mat-card>
      </div>
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
  `]
})
export class DashboardComponent {}
