import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment.model';
import { PaymentStatus } from '@core/models/enums.model';
import { NotificationService } from '@core/services/notification.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatDialogModule],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  payments: Payment[] = [];
  displayedColumns = ['studentFullName', 'amount', 'paymentPeriod', 'dueDate', 'status', 'paymentDate', 'actions'];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  filterForm: FormGroup;
  paymentStatuses = Object.values(PaymentStatus);

  constructor() {
    this.filterForm = this.fb.group({
      status: [''],
      paymentPeriod: [''],
      studentMatricule: ['']
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.filterForm.valueChanges.subscribe(() => this.loadPayments());
  }

  loadPayments(): void {
    this.loading = true;
    const formValues = this.filterForm.value;
    const filters: any = {
      page: this.pageIndex,
      size: this.pageSize
    };

    // N'ajouter que les filtres non vides
    if (formValues.status) filters.status = formValues.status;
    if (formValues.paymentPeriod) filters.paymentPeriod = formValues.paymentPeriod;
    if (formValues.studentMatricule) filters.studentMatricule = formValues.studentMatricule;

    this.paymentService.getPayments(filters).subscribe({
      next: (response) => {
        this.payments = response.content;
        this.totalElements = response.metadata.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPayments();
  }

  viewPayment(id: number): void {
    this.router.navigate(['/payments', id]);
  }

  generatePayments(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Générer les paiements mensuels',
        message: 'Générer les paiements mensuels pour tous les étudiants actifs ?',
        confirmText: 'Générer',
        cancelText: 'Annuler',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paymentService.generateMonthlyPayments().subscribe({
          next: () => {
            this.notificationService.success('Paiements générés avec succès');
            this.loadPayments();
          },
          error: () => {
            this.notificationService.error('Erreur lors de la génération des paiements');
          }
        });
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }
}
