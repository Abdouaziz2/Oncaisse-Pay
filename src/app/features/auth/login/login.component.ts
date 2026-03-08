import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>OncaissePay</mat-card-title>
          <mat-card-subtitle>Connexion</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput formControlName="username" required>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password" required>
              <mat-icon matPrefix>lock</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="!loginForm.valid">
              Se connecter
            </button>
          </form>

          <div class="divider"><span>OU</span></div>

          <button mat-stroked-button class="full-width oauth-btn google-btn" (click)="loginWithGoogle()">
            <mat-icon>login</mat-icon>
            Continuer avec Google
          </button>

          <button mat-stroked-button class="full-width oauth-btn github-btn" (click)="loginWithGithub()">
            <mat-icon>code</mat-icon>
            Continuer avec GitHub
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }

    mat-card-title {
      font-size: 32px;
      text-align: center;
      color: #1976d2;
    }

    mat-card-subtitle {
      text-align: center;
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .divider {
      text-align: center;
      margin: 24px 0;
      position: relative;
    }

    .divider::before, .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #ddd;
    }

    .divider::before { left: 0; }
    .divider::after { right: 0; }
    .divider span { background: white; padding: 0 10px; color: #666; }

    .oauth-btn { margin-bottom: 12px; }
    .google-btn { border-color: #4285f4; color: #4285f4; }
    .github-btn { border-color: #333; color: #333; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.notificationService.success('Connexion réussie');
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:2001/api-webServices/oauth2/authorization/google';
  }

  loginWithGithub(): void {
    window.location.href = 'http://localhost:2001/api-webServices/oauth2/authorization/github';
  }
}
