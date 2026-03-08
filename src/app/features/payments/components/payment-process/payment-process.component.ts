import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment.model';
import { PaymentMethod } from '@core/models/enums.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatRadioModule],
  template: `
    <div class="payment-process-container">
      <mat-card class="process-card" *ngIf="!receipt">
        <h1><mat-icon>payment</mat-icon> Effectuer un Paiement</h1>
        
        <form [formGroup]="processForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Matricule</mat-label>
            <input matInput formControlName="studentMatricule" placeholder="Ex: STU2024001">
            <mat-error *ngIf="processForm.get('studentMatricule')?.hasError('required')">
              Matricule requis
            </mat-error>
          </mat-form-field>

          <div class="payment-methods">
            <label>Moyen de Paiement</label>
            <mat-radio-group formControlName="paymentMethod">
              <mat-radio-button value="ORANGE_MONEY">
                <mat-icon>phone_android</mat-icon> Orange Money
              </mat-radio-button>
              <mat-radio-button value="WAVE">
                <mat-icon>waves</mat-icon> Wave
              </mat-radio-button>
              <mat-radio-button value="MOOV_MONEY">
                <mat-icon>phone_iphone</mat-icon> Moov Money
              </mat-radio-button>
              <mat-radio-button value="CARTE_BANCAIRE">
                <mat-icon>credit_card</mat-icon> Carte Bancaire
              </mat-radio-button>
            </mat-radio-group>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Numéro de Téléphone</mat-label>
            <input matInput formControlName="phoneNumber" placeholder="+221771234567">
            <mat-error *ngIf="processForm.get('phoneNumber')?.hasError('required')">
              Téléphone requis
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loading || processForm.invalid">
            <mat-icon>check_circle</mat-icon>
            {{ loading ? 'Traitement...' : 'Confirmer le Paiement' }}
          </button>
        </form>
      </mat-card>

      <mat-card class="receipt-card" *ngIf="receipt">
        <div class="success-icon">
          <mat-icon>check_circle</mat-icon>
        </div>
        <h1>Paiement Réussi !</h1>
        
        <div class="receipt-details">
          <h2>Reçu de Paiement</h2>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">N° Reçu:</span>
              <span class="value">{{ receipt.receiptNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">Étudiant:</span>
              <span class="value">{{ receipt.studentFullName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Montant:</span>
              <span class="value amount">{{ receipt.amount | number:'1.0-0' }} FCFA</span>
            </div>
            <div class="info-item">
              <span class="label">Période:</span>
              <span class="value">{{ receipt.paymentPeriod }}</span>
            </div>
            <div class="info-item">
              <span class="label">Méthode:</span>
              <span class="value">{{ receipt.paymentMethod }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date:</span>
              <span class="value">{{ receipt.paymentDate | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>

          <button mat-raised-button color="primary" (click)="newPayment()">
            <mat-icon>add</mat-icon>
            Nouveau Paiement
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .payment-process-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .process-card, .receipt-card {
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
      }
    }

    .payment-methods {
      margin: 16px 0;

      label {
        display: block;
        margin-bottom: 12px;
        font-weight: 500;
        color: #666;
      }

      mat-radio-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      mat-radio-button {
        display: flex;
        align-items: center;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          background: #f5f5f5;
        }

        mat-icon {
          margin-right: 8px;
        }
      }
    }

    .receipt-card {
      text-align: center;

      .success-icon {
        mat-icon {
          font-size: 72px;
          width: 72px;
          height: 72px;
          color: #4caf50;
        }
      }

      h1 {
        justify-content: center;
        color: #4caf50;
      }

      .receipt-details {
        margin-top: 24px;

        h2 {
          margin-bottom: 16px;
          color: #333;
        }

        .info-grid {
          text-align: left;
          margin: 24px 0;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 8px;
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
              color: #4caf50;
              font-size: 1.2em;
            }
          }
        }

        button {
          margin-top: 16px;
        }
      }
    }
  `]
})
export class PaymentProcessComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);

  processForm: FormGroup;
  receipt: Payment | null = null;
  loading = false;

  constructor() {
    this.processForm = this.fb.group({
      studentMatricule: ['', Validators.required],
      paymentMethod: [PaymentMethod.ORANGE_MONEY, Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const matricule = this.route.snapshot.queryParamMap.get('matricule');
    if (matricule) {
      this.processForm.patchValue({ studentMatricule: matricule });
    }
  }

  onSubmit(): void {
    if (this.processForm.valid) {
      this.loading = true;
      this.paymentService.processPayment(this.processForm.value).subscribe({
        next: (data) => {
          this.receipt = data;
          this.loading = false;
          this.notificationService.success('Paiement effectué avec succès');
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  newPayment(): void {
    this.receipt = null;
    this.processForm.reset({ paymentMethod: PaymentMethod.ORANGE_MONEY });
  }
}
