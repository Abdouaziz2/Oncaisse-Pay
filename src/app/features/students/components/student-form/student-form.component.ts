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
import { NotificationService } from '@core/services/notification.service';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);

  studentForm!: FormGroup;
  isEditMode = false;
  studentId?: number;

  ngOnInit(): void {
    this.initForm();
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
      annualTuitionAmount: [0],
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

      const request = this.isEditMode
        ? this.studentService.updateStudent(this.studentId!, studentData)
        : this.studentService.createStudent(studentData);

      request.subscribe({
        next: () => {
          this.notificationService.success(this.isEditMode ? 'Étudiant modifié' : 'Étudiant créé');
          this.router.navigate(['/students']);
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
