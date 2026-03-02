# OncaissePay Frontend

Application Angular moderne pour la gestion des paiements scolaires.

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
│   ├── features/       # Modules fonctionnels (students, auth, dashboard)
│   ├── shared/         # Composants réutilisables
│   └── layout/         # Layout principal
├── assets/             # Images et styles
└── environments/       # Configuration environnements
```

## 🎨 Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des étudiants (CRUD)
- ✅ Dashboard avec statistiques
- ✅ Design responsive Material
- ✅ Intercepteurs HTTP
- ✅ Guards de route
- ✅ Notifications toast

## 🔐 Authentification

L'application utilise JWT stocké dans localStorage. Le token est automatiquement ajouté aux requêtes via l'intercepteur.

## 📝 Configuration API

Modifier `src/environments/environment.ts` pour changer l'URL de l'API:

```typescript
export const environment = {
  apiUrl: 'http://localhost:8080/api'
};
```
