import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, MatInputModule, MatFormFieldModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

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
    if (confirm('Confirmer la suppression?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.notificationService.success('Étudiant supprimé');
          this.loadStudents();
        }
      });
    }
  }

  addStudent(): void {
    this.router.navigate(['/students/new']);
  }
}
