import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SchoolService } from '../../services/school.service';
import { School } from '../../models/school.model';

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule],
  template: `
    <div class="container">
      <div class="header">
        <h2>Gestion des Écoles</h2>
        <button mat-raised-button color="primary" routerLink="/register-school">
          <mat-icon>add</mat-icon>
          Nouvelle École
        </button>
      </div>
      <table mat-table [dataSource]="schools" class="mat-elevation-z8">
        <ng-container matColumnDef="schoolName"><th mat-header-cell *matHeaderCellDef>École</th><td mat-cell *matCellDef="let s">{{s.schoolName}}</td></ng-container>
        <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let s">{{s.email}}</td></ng-container>
        <ng-container matColumnDef="city"><th mat-header-cell *matHeaderCellDef>Ville</th><td mat-cell *matCellDef="let s">{{s.city}}</td></ng-container>
        <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let s"><mat-chip [color]="s.schoolStatus==='ACTIVE'?'primary':'warn'">{{s.schoolStatus}}</mat-chip></td></ng-container>
        <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th><td mat-cell *matCellDef="let s">
          <button mat-icon-button *ngIf="s.schoolStatus==='ACTIVE'" (click)="suspend(s.id)" color="warn"><mat-icon>block</mat-icon></button>
          <button mat-icon-button *ngIf="s.schoolStatus!=='ACTIVE'" (click)="activate(s.id)" color="primary"><mat-icon>check_circle</mat-icon></button>
        </td></ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </div>
  `,
  styles: [`.container{padding:2rem}.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}table{width:100%;margin-top:1rem}`]
})
export class SchoolListComponent implements OnInit {
  schools: School[] = [];
  columns = ['schoolName', 'email', 'city', 'status', 'actions'];

  constructor(private service: SchoolService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.service.getAllSchools().subscribe({
      next: (res) => this.schools = res.payload,
      error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
    });
  }

  activate(id: number): void {
    this.service.activateSchool(id).subscribe({
      next: () => {
        this.snackBar.open('École activée', 'OK', { duration: 3000 });
        this.loadSchools();
      },
      error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
    });
  }

  suspend(id: number): void {
    this.service.suspendSchool(id).subscribe({
      next: () => {
        this.snackBar.open('École suspendue', 'OK', { duration: 3000 });
        this.loadSchools();
      },
      error: () => this.snackBar.open('Erreur', 'OK', { duration: 3000 })
    });
  }
}
