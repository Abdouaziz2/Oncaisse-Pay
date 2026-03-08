import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { ClassService } from '@features/classes/services/class.service';
import { NotificationService } from '@core/services/notification.service';
import { Observable } from 'rxjs';
import { Class } from '@features/classes/models/class.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private classService = inject(ClassService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  studentForm!: FormGroup;
  isEditMode = false;
  studentId?: number;
  classes$!: Observable<Class[]>;

  ngOnInit(): void {
    this.initForm();
    this.classes$ = this.classService.getClasses();
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.isEditMode = true;
      this.loadStudent();
    }
  }

  initForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      className: ['', Validators.required],
      phoneNumber: [''],
      email: ['', Validators.email],
      registrationDate: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      parentName: ['', Validators.required],
      parentPhone: ['', Validators.required],
      parentEmail: ['', Validators.email]
    });
  }

  loadStudent(): void {
    this.studentService.getStudent(this.studentId!).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const studentData = { ...this.studentForm.value };
      
      // Convertir la date en format ISO string
      if (studentData.registrationDate instanceof Date) {
        studentData.registrationDate = studentData.registrationDate.toISOString().split('T')[0];
      }

      const request = this.isEditMode
        ? this.studentService.updateStudent(this.studentId!, studentData)
        : this.studentService.createStudent(studentData);

      request.subscribe({
        next: (student) => {
          this.notificationService.success(
            this.isEditMode 
              ? 'Étudiant modifié' 
              : `Étudiant créé avec le matricule: ${student.matricule}`
          );
          this.router.navigate(['/students']);
        },
        error: (err) => {
          if (err.error?.payload) {
            const errors = Object.entries(err.error.payload)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
            this.notificationService.error(`Erreur: ${errors}`);
          } else {
            this.notificationService.error('Une erreur est survenue');
          }
        }
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif',
      'GRADUATED': 'Diplômé'
    };
    return labels[status] || status;
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }
}
