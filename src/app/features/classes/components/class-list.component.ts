import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClassService } from '../services/class.service';
import { Class } from '../models/class.model';
import { NotificationService } from '@core/services/notification.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <div class="class-list-container">
      <div class="header">
        <h1>Gestion des Classes</h1>
        <button mat-raised-button color="primary" (click)="showForm = true">
          <mat-icon>add</mat-icon>
          Nouvelle Classe
        </button>
      </div>

      <mat-card *ngIf="showForm" class="form-card">
        <h2>{{ editingClass ? 'Modifier' : 'Nouvelle' }} Classe</h2>
        <form [formGroup]="classForm" (ngSubmit)="onSubmit()">
          <mat-form-field>
            <mat-label>Nom de la classe</mat-label>
            <input matInput formControlName="name" placeholder="Ex: Terminale S">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Frais annuels (FCFA)</mat-label>
            <input matInput type="number" formControlName="annualTuitionAmount">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Nombre de mois scolaires</mat-label>
            <input matInput type="number" formControlName="schoolMonths" min="1" max="12">
          </mat-form-field>

          <div class="form-actions">
            <button mat-button type="button" (click)="cancelForm()">Annuler</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="classForm.invalid">
              {{ editingClass ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </mat-card>

      <table mat-table [dataSource]="classes" class="classes-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nom</th>
          <td mat-cell *matCellDef="let class">{{ class.name }}</td>
        </ng-container>

        <ng-container matColumnDef="annualTuitionAmount">
          <th mat-header-cell *matHeaderCellDef>Frais Annuels</th>
          <td mat-cell *matCellDef="let class">{{ class.annualTuitionAmount | number:'1.0-0' }} FCFA</td>
        </ng-container>

        <ng-container matColumnDef="schoolMonths">
          <th mat-header-cell *matHeaderCellDef>Mois Scolaires</th>
          <td mat-cell *matCellDef="let class">{{ class.schoolMonths }} mois</td>
        </ng-container>

        <ng-container matColumnDef="monthlyAmount">
          <th mat-header-cell *matHeaderCellDef>Mensualité</th>
          <td mat-cell *matCellDef="let class">
            <strong>{{ class.monthlyAmount | number:'1.0-0' }} FCFA/mois</strong>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let class">
            <button mat-icon-button (click)="editClass(class)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteClass(class.id!)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .class-list-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 500;
      }
    }

    .form-card {
      margin-bottom: 24px;
      padding: 24px;

      h2 {
        margin-top: 0;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;

        mat-form-field {
          width: 100%;
        }
      }

      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
    }

    .classes-table {
      width: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class ClassListComponent implements OnInit {
  private classService = inject(ClassService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  classes: Class[] = [];
  displayedColumns = ['name', 'annualTuitionAmount', 'schoolMonths', 'monthlyAmount', 'actions'];
  showForm = false;
  editingClass: Class | null = null;

  classForm: FormGroup;

  constructor() {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      annualTuitionAmount: [0, [Validators.required, Validators.min(0)]],
      schoolMonths: [10, [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getClasses().subscribe({
      next: (data) => this.classes = data
    });
  }

  onSubmit(): void {
    if (this.classForm.valid) {
      const request = this.editingClass
        ? this.classService.updateClass(this.editingClass.id!, this.classForm.value)
        : this.classService.createClass(this.classForm.value);

      request.subscribe({
        next: () => {
          this.notificationService.success(this.editingClass ? 'Classe modifiée' : 'Classe créée');
          this.loadClasses();
          this.cancelForm();
        }
      });
    }
  }

  editClass(classData: Class): void {
    this.editingClass = classData;
    this.classForm.patchValue(classData);
    this.showForm = true;
  }

  deleteClass(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer la classe',
        message: 'Êtes-vous sûr de vouloir supprimer cette classe ? Tous les étudiants associés devront être réaffectés.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.classService.deleteClass(id).subscribe({
          next: () => {
            this.notificationService.success('Classe supprimée');
            this.loadClasses();
          },
          error: (err) => {
            if (err.status === 409) {
              this.notificationService.error('Impossible de supprimer cette classe car des étudiants y sont inscrits');
            } else {
              this.notificationService.error('Erreur lors de la suppression');
            }
          }
        });
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingClass = null;
    this.classForm.reset({ schoolMonths: 10 });
  }
}
