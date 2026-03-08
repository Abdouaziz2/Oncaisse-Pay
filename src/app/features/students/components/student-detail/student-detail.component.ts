import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="student-detail-container" *ngIf="student">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Détails de l'Étudiant</h1>
        <button mat-raised-button color="primary" (click)="editStudent()">
          <mat-icon>edit</mat-icon>
          Modifier
        </button>
      </div>

      <mat-card class="detail-card">
        <div class="status-header">
          <mat-chip [class]="'status-' + student.status?.toLowerCase()">
            {{ student.status }}
          </mat-chip>
        </div>

        <div class="info-section">
          <h3>Informations Personnelles</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Matricule:</span>
              <span class="value">{{ student.matricule }}</span>
            </div>
            <div class="info-item">
              <span class="label">Prénom:</span>
              <span class="value">{{ student.firstName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Nom:</span>
              <span class="value">{{ student.lastName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Classe:</span>
              <span class="value">{{ student.className }}</span>
            </div>
            <div class="info-item" *ngIf="student.email">
              <span class="label">Email:</span>
              <span class="value">{{ student.email }}</span>
            </div>
            <div class="info-item" *ngIf="student.phoneNumber">
              <span class="label">Téléphone:</span>
              <span class="value">{{ student.phoneNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">Date d'inscription:</span>
              <span class="value">{{ student.registrationDate | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item" *ngIf="student.annualTuitionAmount">
              <span class="label">Frais annuels:</span>
              <span class="value amount">{{ student.annualTuitionAmount | number:'1.0-0' }} FCFA</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Informations Parent/Tuteur</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nom:</span>
              <span class="value">{{ student.parentName }}</span>
            </div>
            <div class="info-item">
              <span class="label">Téléphone:</span>
              <span class="value">{{ student.parentPhone }}</span>
            </div>
            <div class="info-item" *ngIf="student.parentEmail">
              <span class="label">Email:</span>
              <span class="value">{{ student.parentEmail }}</span>
            </div>
          </div>
        </div>

        <div class="info-section" *ngIf="student.createdAt">
          <h3>Métadonnées</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Créé le:</span>
              <span class="value">{{ student.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="student.updatedAt">
              <span class="label">Modifié le:</span>
              <span class="value">{{ student.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </div>
      </mat-card>
    </div>

    <div class="loading" *ngIf="!student">Chargement...</div>
  `,
  styles: [`
    .student-detail-container {
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
        flex: 1;
        margin: 0;
        font-size: 28px;
        font-weight: 500;
      }
    }

    .detail-card {
      padding: 24px;
    }

    .status-header {
      margin-bottom: 24px;
      
      mat-chip {
        &.status-active {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        &.status-inactive {
          background-color: #ffebee;
          color: #c62828;
        }
        &.status-graduated {
          background-color: #e3f2fd;
          color: #1565c0;
        }
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
            font-size: 1.1em;
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
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  student: Student | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadStudent(id);
    }
  }

  loadStudent(id: number): void {
    this.studentService.getStudent(id).subscribe({
      next: (data) => this.student = data,
      error: () => this.goBack()
    });
  }

  editStudent(): void {
    this.router.navigate(['/students/edit', this.student?.id]);
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
