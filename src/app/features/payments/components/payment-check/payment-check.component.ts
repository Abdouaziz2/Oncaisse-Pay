import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-payment-check',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="payment-check-container">
      <mat-card class="check-card">
        <h1><mat-icon>search</mat-icon> Vérifier mon Paiement</h1>
        
        <form [formGroup]="checkForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Matricule</mat-label>
            <input matInput formControlName="matricule" placeholder="Ex: STU2024001">
            <mat-error *ngIf="checkForm.get('matricule')?.hasError('required')">
              Matricule requis
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Téléphone (optionnel)</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="Ex: +221771234567">
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loading || checkForm.invalid">
            <mat-icon>search</mat-icon>
            {{ loading ? 'Vérification...' : 'Vérifier' }}
          </button>
        </form>

        <div class="payment-result" *ngIf="payment">
          <h2>Informations de Paiement</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Étudiant:</span>
              <span class="value">{{ payment.studentFullName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Classe:</span>
              <span class="value">{{ payment.studentClassName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Montant:</span>
              <span class="value amount">{{ payment.amount | number:'1.0-0' }} FCFA</span>
            </div>
            <div class="info-item">
              <span class="label">Période:</span>
              <span class="value">{{ payment.paymentPeriod }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date limite:</span>
              <span class="value">{{ payment.dueDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Statut:</span>
              <span class="value" [class]="'status-' + payment.status">{{ payment.status }}</span>
            </div>
          </div>

          <button mat-raised-button color="accent" (click)="goToPayment()" *ngIf="payment.status !== 'PAYE'">
            <mat-icon>payment</mat-icon>
            Payer Maintenant
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .payment-check-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .check-card {
      max-width: 600px;
      width: 100%;
      padding: 32px;

      h1 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
        color: #333;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;

        mat-form-field {
          width: 100%;
        }

        button {
          margin-top: 8px;
        }
      }
    }

    .payment-result {
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid #e0e0e0;

      h2 {
        margin-bottom: 16px;
        color: #333;
      }

      .info-grid {
        display: grid;
        gap: 12px;
        margin-bottom: 24px;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;

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

        .status-PAYE { color: #4caf50; }
        .status-EN_ATTENTE { color: #ff9800; }
        .status-EN_RETARD { color: #f44336; }
      }
    }
  `]
})
export class PaymentCheckComponent {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  checkForm: FormGroup;
  payment: Payment | null = null;
  loading = false;

  constructor() {
    this.checkForm = this.fb.group({
      matricule: ['', Validators.required],
      phoneNumber: ['']
    });
  }

  onSubmit(): void {
    if (this.checkForm.valid) {
      this.loading = true;
      this.paymentService.checkPayment(this.checkForm.value).subscribe({
        next: (data) => {
          this.payment = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.payment = null;
        }
      });
    }
  }

  goToPayment(): void {
    this.router.navigate(['/payment/process'], { 
      queryParams: { matricule: this.payment?.studentMatricule } 
    });
  }
}
