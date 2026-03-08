import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { NotificationService } from '@core/services/notification.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatInputModule, MatFormFieldModule, MatDialogModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  students: Student[] = [];
  displayedColumns = ['firstName', 'lastName', 'classLevel', 'parentPhone', 'status', 'actions'];
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  loading = false;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getStudents({ page: this.pageIndex, size: this.pageSize }).subscribe({
      next: (response) => {
        this.students = response.content;
        this.totalElements = response.metadata.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  editStudent(id: number): void {
    this.router.navigate(['/students/edit', id]);
  }

  viewStudent(id: number): void {
    this.router.navigate(['/students', id]);
  }

  deleteStudent(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l\'étudiant',
        message: 'Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            this.notificationService.success('Étudiant supprimé');
            this.loadStudents();
          },
          error: (err) => {
            if (err.status === 409) {
              this.notificationService.error('Impossible de supprimer cet étudiant car il a des paiements associés');
            } else {
              this.notificationService.error('Erreur lors de la suppression');
            }
          }
        });
      }
    });
  }

  addStudent(): void {
    this.router.navigate(['/students/new']);
  }
}
