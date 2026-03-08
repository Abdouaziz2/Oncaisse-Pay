import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="payment-detail-container" *ngIf="payment">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails du Paiement</h1>
      </div>

      <mat-card class="detail-card">
        <div class="status-header" [class]="'status-' + payment.status">
          <mat-icon>{{ getStatusIcon() }}</mat-icon>
          <h2>{{ payment.status }}</h2>
        </div>

        <div class="info-section">
          <h3>Informations Étudiant</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nom Complet:</span>
              <span class="value">{{ payment.studentFullName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Matricule:</span>
              <span class="value">{{ payment.studentMatricule }}</span>
            </div>
            <div class="info-item">
              <span class="label">Classe:</span>
              <span class="value">{{ payment.studentClassName }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Informations Paiement</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Montant:</span>
              <span class="value amount">{{ payment.amount | number:'1.0-0' }} FCFA</span>
            </div>
            <div class="info-item">
              <span class="label">Période:</span>
              <span class="value">{{ payment.paymentPeriod }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date Disponible:</span>
              <span class="value">{{ payment.availableDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date Limite:</span>
              <span class="value">{{ payment.dueDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item" *ngIf="payment.paymentDate">
              <span class="label">Date de Paiement:</span>
              <span class="value">{{ payment.paymentDate | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="payment.paymentMethod">
              <span class="label">Méthode:</span>
              <span class="value">{{ payment.paymentMethod }}</span>
            </div>
            <div class="info-item" *ngIf="payment.phoneNumber">
              <span class="label">Téléphone:</span>
              <span class="value">{{ payment.phoneNumber }}</span>
            </div>
            <div class="info-item" *ngIf="payment.receiptNumber">
              <span class="label">N° Reçu:</span>
              <span class="value">{{ payment.receiptNumber }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Métadonnées</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Créé le:</span>
              <span class="value">{{ payment.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="payment.updatedAt">
              <span class="label">Modifié le:</span>
              <span class="value">{{ payment.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>
      </mat-card>
    </div>

    <div class="loading" *ngIf="!payment">Chargement...</div>
  `,
  styles: [`
    .payment-detail-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 500;
      }
    }

    .detail-card {
      padding: 24px;
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }

      h2 {
        margin: 0;
        font-size: 24px;
      }

      &.status-PAYE {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.status-EN_ATTENTE {
        background-color: #fff3e0;
        color: #e65100;
      }

      &.status-EN_RETARD {
        background-color: #ffebee;
        color: #c62828;
      }

      &.status-ANNULE {
        background-color: #f5f5f5;
        color: #616161;
      }
    }

    .info-section {
      margin-bottom: 32px;

      h3 {
        margin-bottom: 16px;
        color: #666;
        font-size: 16px;
        font-weight: 500;
        text-transform: uppercase;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 4px;

        .label {
          font-weight: 500;
          color: #666;
        }

        .value {
          font-weight: 600;
          color: #333;

          &.amount {
            color: #1976d2;
            font-size: 1.2em;
          }
        }
      }
    }

    .loading {
      text-align: center;
      padding: 48px;
      color: #666;
    }
  `]
})
export class PaymentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);

  payment: Payment | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPayment(id);
    }
  }

  loadPayment(id: number): void {
    this.paymentService.getPayment(id).subscribe({
      next: (data) => this.payment = data,
      error: () => this.goBack()
    });
  }

  getStatusIcon(): string {
    switch (this.payment?.status) {
      case 'PAYE': return 'check_circle';
      case 'EN_ATTENTE': return 'pending';
      case 'EN_RETARD': return 'warning';
      case 'ANNULE': return 'cancel';
      default: return 'info';
    }
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }
}
