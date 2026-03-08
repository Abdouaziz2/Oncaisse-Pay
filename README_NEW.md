# OncaissePay Frontend

Application Angular moderne pour la gestion des paiements scolaires.

## 🎉 Nouveautés - Modules Payments & Dashboard Intégrés

### ✅ Modules Implémentés

1. **Dashboard** - Statistiques en temps réel
   - 6 KPIs dynamiques
   - Taux de recouvrement
   - Statistiques étudiants/paiements

2. **Payments** - Gestion complète des paiements
   - Vérification publique (sans auth)
   - Traitement de paiement (4 méthodes)
   - Liste paginée avec filtres (admin)
   - Génération mensuelle automatique

### 📍 Routes Disponibles

**Public (Sans authentification)**
- `/payment/check` - Vérifier un paiement
- `/payment/process` - Effectuer un paiement

**Protégé (ADMIN/CASHIER)**
- `/dashboard` - Tableau de bord
- `/students` - Gestion des étudiants
- `/payments` - Liste des paiements
- `/payments/:id` - Détails d'un paiement

## 🚀 Technologies

- Angular 17+ (Standalone Components)
- Angular Material 17+
- RxJS
- TypeScript 5.4+
- SCSS

## 📦 Installation

```bash
npm install
```

## 🛠️ Développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 🏗️ Build Production

```bash
npm run build
```

## 📁 Structure

```
src/
├── app/
│   ├── core/           # Services singleton, guards, interceptors
│   ├── features/       # Modules fonctionnels
│   │   ├── auth/       # Authentification
│   │   ├── dashboard/  # Tableau de bord ✅ NEW
│   │   ├── students/   # Gestion étudiants
│   │   └── payments/   # Gestion paiements ✅ NEW
│   ├── shared/         # Composants réutilisables
│   └── layout/         # Layout principal
├── assets/             # Images et styles
└── environments/       # Configuration environnements
```

## 🎨 Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des étudiants (CRUD)
- ✅ Dashboard avec statistiques en temps réel 🆕
- ✅ Vérification de paiement (public) 🆕
- ✅ Traitement de paiement (4 méthodes) 🆕
- ✅ Gestion des paiements (admin) 🆕
- ✅ Génération mensuelle automatique 🆕
- ✅ Design responsive Material
- ✅ Intercepteurs HTTP
- ✅ Guards de route
- ✅ Notifications toast

## 🔐 Authentification

L'application utilise JWT stocké dans localStorage. Le token est automatiquement ajouté aux requêtes via l'intercepteur.

### Rôles
- **ADMIN** - Accès complet
- **CASHIER** - Gestion des paiements

## 📝 Configuration API

Modifier `src/environments/environment.ts` pour changer l'URL de l'API:

```typescript
export const environment = {
  apiUrl: 'http://localhost:2001/api-webServices'
};
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Guide de démarrage rapide
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Documentation technique détaillée
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Diagrammes d'architecture
- **[CHANGELOG.md](CHANGELOG.md)** - Historique des changements
- **[COMMANDS.md](COMMANDS.md)** - Commandes utiles
- **[CHECKLIST.md](CHECKLIST.md)** - Checklist de vérification

## 🧪 Tests

### Dashboard
```bash
# Se connecter et accéder à /dashboard
# Vérifier l'affichage des 6 KPIs
```

### Payment Check (Public)
```bash
# Accéder à /payment/check (sans auth)
# Saisir un matricule
# Vérifier les informations affichées
```

### Payment Process (Public)
```bash
# Accéder à /payment/process (sans auth)
# Choisir une méthode de paiement
# Confirmer et voir le reçu
```

### Payment List (Admin)
```bash
# Se connecter avec ADMIN/CASHIER
# Accéder à /payments
# Tester les filtres et la pagination
```

## 🛡️ Sécurité

- Routes publiques: `/payment/check`, `/payment/process`
- Routes protégées: `/dashboard`, `/students`, `/payments`
- Guards: `authGuard`, `roleGuard`
- Intercepteurs: JWT automatique, gestion d'erreurs

## 📊 API Backend

### Base URL
```
http://localhost:2001/api-webServices
```

### Endpoints Dashboard
```
GET /dashboard/statistics
```

### Endpoints Payments (Public)
```
POST /payments/check
POST /payments/process
```

### Endpoints Payments (Protégé)
```
GET  /payments/all
GET  /payments/{id}
POST /payments/generate
```

## ✨ Patterns Utilisés

- Standalone Components (Angular 17+)
- Dependency Injection avec `inject()`
- Reactive Forms
- Observable Pattern (RxJS)
- Service Layer Pattern
- Guard Pattern
- Interceptor Pattern
- Material Design

## 📝 Changelog

### Version 1.1.0 - Modules Payments & Dashboard

**Ajouté**
- Module Dashboard avec statistiques en temps réel
- Module Payments complet (public + admin)
- 4 nouveaux composants
- 2 nouveaux services
- 4 nouvelles routes
- Documentation complète

**Modifié**
- Dashboard component (stats dynamiques)
- Routes configuration
- Menu sidebar
- Enums (PaymentStatus, PaymentMethod)

## 🚀 Prochaines Étapes

1. Lancer le backend Spring Boot
2. Lancer le frontend Angular
3. Tester tous les flux
4. Déployer en production

## 👥 Équipe

Développé avec ❤️ pour OncaissePay

## 📄 Licence

Propriétaire - OncaissePay 2024
