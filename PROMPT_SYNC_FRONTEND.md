# 🎯 PROMPT: Synchronisation Frontend Angular avec Backend Spring Boot

## Contexte Projet

**Backend**: Spring Boot 3.2.5 + Java 21  
**Frontend**: Angular 17 + Material  
**API Base URL**: `http://localhost:2001/api-webServices`

---

## Objectif

Mettre à jour TOUS les composants, formulaires et templates Angular pour correspondre EXACTEMENT au backend Spring Boot.

---

## 📋 MODÈLE STUDENT BACKEND (Source de Vérité)

```typescript
interface Student {
  id?: number;
  matricule: string;              // OBLIGATOIRE
  firstName: string;              // OBLIGATOIRE
  lastName: string;               // OBLIGATOIRE
  className: string;              // OBLIGATOIRE (pas classLevel)
  phoneNumber?: string;           // OPTIONNEL (pas phone)
  email?: string;                 // OPTIONNEL
  registrationDate: string;       // OBLIGATOIRE (pas enrollmentDate)
  status?: StudentStatus;         // OPTIONNEL (ACTIVE, INACTIVE, SUSPENDED, GRADUATED)
  annualTuitionAmount?: number;   // OPTIONNEL (en centimes)
  parentName?: string;            // OPTIONNEL
  parentPhone?: string;           // OPTIONNEL
  parentEmail?: string;           // OPTIONNEL
  createdAt?: string;             // READ-ONLY
  updatedAt?: string;             // READ-ONLY
  isActive?: boolean;             // READ-ONLY
}
```

---

## ⚠️ CHAMPS À SUPPRIMER (N'existent PAS dans le backend)

```typescript
❌ dateOfBirth
❌ gender
❌ address
❌ phone (utiliser phoneNumber)
❌ enrollmentDate (utiliser registrationDate)
❌ classLevel (utiliser className)
```

---

## 🎯 TÂCHES À EFFECTUER

### 1. Mettre à jour student-form.component.html

**Supprimer les champs:**
- Date de naissance (dateOfBirth)
- Genre (gender)
- Adresse (address)

**Renommer les champs:**
- `phone` → `phoneNumber`
- `enrollmentDate` → `registrationDate`
- `classLevel` → `className`

**Ajouter les champs manquants:**
- `matricule` (OBLIGATOIRE, input text)
- `annualTuitionAmount` (OPTIONNEL, input number, label: "Montant scolarité annuelle")
- `status` (OPTIONNEL, select avec options: ACTIVE, INACTIVE, SUSPENDED, GRADUATED)

**Template HTML attendu:**

```html
<form [formGroup]="studentForm" (ngSubmit)="onSubmit()">
  
  <!-- Matricule - OBLIGATOIRE -->
  <mat-form-field appearance="outline">
    <mat-label>Matricule</mat-label>
    <input matInput formControlName="matricule" required>
    <mat-error *ngIf="studentForm.get('matricule')?.hasError('required')">
      Le matricule est obligatoire
    </mat-error>
  </mat-form-field>

  <!-- Prénom - OBLIGATOIRE -->
  <mat-form-field appearance="outline">
    <mat-label>Prénom</mat-label>
    <input matInput formControlName="firstName" required>
    <mat-error *ngIf="studentForm.get('firstName')?.hasError('required')">
      Le prénom est obligatoire
    </mat-error>
  </mat-form-field>

  <!-- Nom - OBLIGATOIRE -->
  <mat-form-field appearance="outline">
    <mat-label>Nom</mat-label>
    <input matInput formControlName="lastName" required>
    <mat-error *ngIf="studentForm.get('lastName')?.hasError('required')">
      Le nom est obligatoire
    </mat-error>
  </mat-form-field>

  <!-- Classe - OBLIGATOIRE -->
  <mat-form-field appearance="outline">
    <mat-label>Classe</mat-label>
    <input matInput formControlName="className" required>
    <mat-error *ngIf="studentForm.get('className')?.hasError('required')">
      La classe est obligatoire
    </mat-error>
  </mat-form-field>

  <!-- Téléphone - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Téléphone</mat-label>
    <input matInput formControlName="phoneNumber">
  </mat-form-field>

  <!-- Email - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email">
    <mat-error *ngIf="studentForm.get('email')?.hasError('email')">
      Email invalide
    </mat-error>
  </mat-form-field>

  <!-- Date d'inscription - OBLIGATOIRE -->
  <mat-form-field appearance="outline">
    <mat-label>Date d'inscription</mat-label>
    <input matInput [matDatepicker]="picker" formControlName="registrationDate" required>
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
    <mat-error *ngIf="studentForm.get('registrationDate')?.hasError('required')">
      La date d'inscription est obligatoire
    </mat-error>
  </mat-form-field>

  <!-- Montant scolarité - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Montant scolarité annuelle (FCFA)</mat-label>
    <input matInput type="number" formControlName="annualTuitionAmount">
  </mat-form-field>

  <!-- Statut - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Statut</mat-label>
    <mat-select formControlName="status">
      <mat-option value="ACTIVE">Actif</mat-option>
      <mat-option value="INACTIVE">Inactif</mat-option>
      <mat-option value="SUSPENDED">Suspendu</mat-option>
      <mat-option value="GRADUATED">Diplômé</mat-option>
    </mat-select>
  </mat-form-field>

  <!-- Nom parent - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Nom du parent/tuteur</mat-label>
    <input matInput formControlName="parentName">
  </mat-form-field>

  <!-- Téléphone parent - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Téléphone parent</mat-label>
    <input matInput formControlName="parentPhone">
  </mat-form-field>

  <!-- Email parent - OPTIONNEL -->
  <mat-form-field appearance="outline">
    <mat-label>Email parent</mat-label>
    <input matInput type="email" formControlName="parentEmail">
    <mat-error *ngIf="studentForm.get('parentEmail')?.hasError('email')">
      Email invalide
    </mat-error>
  </mat-form-field>

  <!-- Boutons -->
  <div class="form-actions">
    <button mat-raised-button type="button" (click)="cancel()">Annuler</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="!studentForm.valid">
      {{ isEditMode ? 'Modifier' : 'Créer' }}
    </button>
  </div>
</form>
```

---

### 2. Mettre à jour student-list.component.ts

**Vérifier que les colonnes affichées correspondent:**

```typescript
displayedColumns: string[] = [
  'matricule',           // Ajouter si manquant
  'firstName',
  'lastName',
  'className',           // Pas classLevel
  'phoneNumber',         // Pas phone
  'email',
  'registrationDate',    // Pas enrollmentDate
  'status',
  'actions'
];
```

---

### 3. Mettre à jour student-list.component.html

**Template table attendu:**

```html
<table mat-table [dataSource]="dataSource">
  
  <!-- Matricule -->
  <ng-container matColumnDef="matricule">
    <th mat-header-cell *matHeaderCellDef>Matricule</th>
    <td mat-cell *matCellDef="let student">{{ student.matricule }}</td>
  </ng-container>

  <!-- Prénom -->
  <ng-container matColumnDef="firstName">
    <th mat-header-cell *matHeaderCellDef>Prénom</th>
    <td mat-cell *matCellDef="let student">{{ student.firstName }}</td>
  </ng-container>

  <!-- Nom -->
  <ng-container matColumnDef="lastName">
    <th mat-header-cell *matHeaderCellDef>Nom</th>
    <td mat-cell *matCellDef="let student">{{ student.lastName }}</td>
  </ng-container>

  <!-- Classe -->
  <ng-container matColumnDef="className">
    <th mat-header-cell *matHeaderCellDef>Classe</th>
    <td mat-cell *matCellDef="let student">{{ student.className }}</td>
  </ng-container>

  <!-- Téléphone -->
  <ng-container matColumnDef="phoneNumber">
    <th mat-header-cell *matHeaderCellDef>Téléphone</th>
    <td mat-cell *matCellDef="let student">{{ student.phoneNumber || '-' }}</td>
  </ng-container>

  <!-- Email -->
  <ng-container matColumnDef="email">
    <th mat-header-cell *matHeaderCellDef>Email</th>
    <td mat-cell *matCellDef="let student">{{ student.email || '-' }}</td>
  </ng-container>

  <!-- Date inscription -->
  <ng-container matColumnDef="registrationDate">
    <th mat-header-cell *matHeaderCellDef>Date inscription</th>
    <td mat-cell *matCellDef="let student">{{ student.registrationDate | date:'dd/MM/yyyy' }}</td>
  </ng-container>

  <!-- Statut -->
  <ng-container matColumnDef="status">
    <th mat-header-cell *matHeaderCellDef>Statut</th>
    <td mat-cell *matCellDef="let student">
      <span [class]="'status-badge status-' + student.status?.toLowerCase()">
        {{ getStatusLabel(student.status) }}
      </span>
    </td>
  </ng-container>

  <!-- Actions -->
  <ng-container matColumnDef="actions">
    <th mat-header-cell *matHeaderCellDef>Actions</th>
    <td mat-cell *matCellDef="let student">
      <button mat-icon-button (click)="editStudent(student.id)">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button color="warn" (click)="deleteStudent(student.id)">
        <mat-icon>delete</mat-icon>
      </button>
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

**Ajouter méthode pour labels statut:**

```typescript
getStatusLabel(status?: string): string {
  const labels: Record<string, string> = {
    'ACTIVE': 'Actif',
    'INACTIVE': 'Inactif',
    'SUSPENDED': 'Suspendu',
    'GRADUATED': 'Diplômé'
  };
  return labels[status || 'ACTIVE'] || status || '-';
}
```

---

### 4. Ajouter styles pour les badges de statut

**Dans student-list.component.scss:**

```scss
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  &.status-active {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  &.status-inactive {
    background-color: #f5f5f5;
    color: #757575;
  }
  
  &.status-suspended {
    background-color: #fff3e0;
    color: #e65100;
  }
  
  &.status-graduated {
    background-color: #e3f2fd;
    color: #1565c0;
  }
}
```

---

### 5. Mettre à jour les filtres (si existants)

**Dans student-list.component.ts:**

```typescript
applyFilter(filterValue: string): void {
  const filter: StudentFilter = {
    firstName: filterValue,
    lastName: filterValue,
    className: filterValue,
    page: 0,
    size: 10
  };
  
  this.loadStudents(filter);
}
```

---

## 🔍 CHECKLIST DE VÉRIFICATION

### Formulaire (student-form.component)
- [ ] Champ `matricule` présent et OBLIGATOIRE
- [ ] Champ `className` (pas `classLevel`)
- [ ] Champ `phoneNumber` (pas `phone`)
- [ ] Champ `registrationDate` (pas `enrollmentDate`)
- [ ] Champ `annualTuitionAmount` présent
- [ ] Champ `status` avec select (ACTIVE, INACTIVE, SUSPENDED, GRADUATED)
- [ ] Champs supprimés: `dateOfBirth`, `gender`, `address`
- [ ] Validation: matricule, firstName, lastName, className, registrationDate OBLIGATOIRES

### Liste (student-list.component)
- [ ] Colonne `matricule` affichée
- [ ] Colonne `className` (pas `classLevel`)
- [ ] Colonne `phoneNumber` (pas `phone`)
- [ ] Colonne `registrationDate` (pas `enrollmentDate`)
- [ ] Colonne `status` avec badge coloré
- [ ] Labels français pour statuts

### Services
- [ ] `student.service.ts` utilise endpoint `/students/all`
- [ ] Extraction `response.payload` dans tous les appels
- [ ] Gestion `metadata` pour pagination

### Interceptor
- [ ] `auth.interceptor.ts` enregistré dans `app.config.ts`
- [ ] Header `Authorization: Bearer <token>` ajouté automatiquement

### Guards
- [ ] `auth.guard.ts` protège les routes
- [ ] `role.guard.ts` vérifie ADMIN ou CASHIER pour `/students`

---

## 🧪 TESTS À EFFECTUER

### 1. Test Création Étudiant
```json
{
  "matricule": "TEST001",
  "firstName": "Jean",
  "lastName": "Dupont",
  "className": "L3 Info",
  "phoneNumber": "771234567",
  "email": "jean@test.com",
  "registrationDate": "2026-03-01",
  "status": "ACTIVE",
  "annualTuitionAmount": 50000000,
  "parentName": "Marie Dupont",
  "parentPhone": "775555555",
  "parentEmail": "marie@test.com"
}
```

**Résultat attendu:** 201 Created

### 2. Test Validation
Essayer de créer sans `matricule` → Erreur "Matricule is required"  
Essayer de créer sans `className` → Erreur "Class name is required"  
Essayer de créer sans `registrationDate` → Erreur "Registration date is required"

### 3. Test Liste
Vérifier que tous les champs s'affichent correctement  
Vérifier que le statut a un badge coloré  
Vérifier que la pagination fonctionne

---

## 📝 COMMANDES

```bash
# Backend
cd e:\ONCAISSE-PAY\Oncaissepay
mvn spring-boot:run

# Frontend
cd e:\ONCAISSE-PAY\frontEnd
npm start

# Accès
Backend: http://localhost:2001/api-webServices
Frontend: http://localhost:4200
Swagger: http://localhost:2001/api-webServices/swagger-ui.html
```

---

## ✅ RÉSULTAT ATTENDU

- ✅ Formulaire avec TOUS les champs backend
- ✅ Aucun champ inexistant (dateOfBirth, gender, address)
- ✅ Validation correcte (matricule, className, registrationDate obligatoires)
- ✅ Liste affiche matricule, className, phoneNumber, registrationDate
- ✅ Statut avec badge coloré
- ✅ Création/modification/suppression fonctionnent
- ✅ Aucune erreur 400 Bad Request

---

**Priorité**: CRITIQUE  
**Temps estimé**: 2-3 heures  
**Blocage**: Frontend inutilisable tant que non corrigé
