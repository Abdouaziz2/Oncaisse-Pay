# Frontend SaaS Multi-Tenant - OncaissePay

## Composants Créés

### 1. Models
- `school.model.ts` - Interfaces School et SchoolRegistration

### 2. Services
- `school.service.ts` - Service pour gérer les écoles (CRUD + activation/suspension)

### 3. Components
- `school-registration.component.ts` - Formulaire d'enregistrement d'école (public)
- `school-list.component.ts` - Liste des écoles avec gestion (SUPER_ADMIN)

## Routes à Ajouter

Dans `app.routes.ts`:

```typescript
{
  path: 'register-school',
  component: SchoolRegistrationComponent
},
{
  path: 'schools',
  component: SchoolListComponent,
  canActivate: [AuthGuard] // Réservé SUPER_ADMIN
}
```

## Utilisation

### Enregistrement d'une École (Public)
- URL: `/register-school`
- Accessible sans authentification
- Crée l'école + admin automatiquement

### Gestion des Écoles (SUPER_ADMIN)
- URL: `/schools`
- Liste toutes les écoles
- Actions: Activer / Suspendre

## Prochaines Étapes

1. Ajouter les routes dans `app.routes.ts`
2. Mettre à jour le menu de navigation
3. Ajouter un guard pour vérifier le rôle SUPER_ADMIN
4. Tester l'enregistrement et la gestion des écoles
