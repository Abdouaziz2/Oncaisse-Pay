import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SchoolService } from '../../services/school.service';

@Component({
  selector: 'app-school-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header><mat-card-title>Enregistrer une École</mat-card-title></mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline"><mat-label>Nom de l'école</mat-label><input matInput formControlName="schoolName"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput type="email" formControlName="email"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Téléphone</mat-label><input matInput formControlName="phone"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Adresse</mat-label><input matInput formControlName="address"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Pays</mat-label><input matInput formControlName="country"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Ville</mat-label><input matInput formControlName="city"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Username Admin</mat-label><input matInput formControlName="adminUsername"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Password Admin</mat-label><input matInput type="password" formControlName="adminPassword"></mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">Enregistrer</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.container{max-width:600px;margin:2rem auto;padding:1rem}form{display:flex;flex-direction:column;gap:1rem}mat-form-field{width:100%}`]
})
export class SchoolRegistrationComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: SchoolService, private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog) {
    this.form = this.fb.group({
      schoolName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
      country: ['Senegal', Validators.required],
      city: ['', Validators.required],
      adminUsername: ['', Validators.required],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const credentials = {
        username: this.form.value.adminUsername,
        password: this.form.value.adminPassword
      };
      this.service.register(this.form.value).subscribe({
        next: () => {
          this.dialog.open(CredentialsDialogComponent, {
            data: credentials,
            disableClose: true,
            width: '400px'
          });
        },
        error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
      });
    }
  }
}


@Component({
  selector: 'app-credentials-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>École créée avec succès!</h2>
    <mat-dialog-content>
      <p><strong>Identifiants de connexion :</strong></p>
      <p><strong>Username:</strong> {{data.username}}</p>
      <p><strong>Password:</strong> {{data.password}}</p>
      <p style="color: red; margin-top: 1rem;">⚠️ Notez ces identifiants, ils ne seront plus affichés!</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="close()">J'ai noté, aller à la connexion</button>
    </mat-dialog-actions>
  `,
  styles: [`mat-dialog-content{padding:1rem}p{margin:0.5rem 0}`]
})
export class CredentialsDialogComponent {
  constructor(public dialogRef: MatDialogRef<CredentialsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {}
  
  close(): void {
    this.dialogRef.close();
    this.router.navigate(['/auth/login']);
  }
}
