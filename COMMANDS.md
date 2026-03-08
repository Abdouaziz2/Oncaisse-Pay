# 🛠️ Commandes Utiles - OncaissePay Frontend

## 📦 Installation & Démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm start
# ou
ng serve

# Accès: http://localhost:4200
```

## 🏗️ Build

```bash
# Build de production
npm run build
# ou
ng build --configuration production

# Fichiers générés dans: dist/
```

## 🧪 Tests

```bash
# Tests unitaires
ng test

# Tests e2e
ng e2e

# Coverage
ng test --code-coverage
```

## 🔍 Vérifications

```bash
# Linter
ng lint

# Format check
npm run format:check

# Format fix
npm run format:write
```

## 📁 Génération de Composants

```bash
# Nouveau composant
ng generate component features/nom-module/components/nom-composant --standalone

# Nouveau service
ng generate service features/nom-module/services/nom-service

# Nouveau model (interface)
ng generate interface features/nom-module/models/nom-model

# Nouveau guard
ng generate guard core/guards/nom-guard
```

## 🔧 Développement

```bash
# Serveur avec ouverture automatique du navigateur
ng serve --open

# Serveur avec port personnalisé
ng serve --port 4300

# Serveur avec proxy API
ng serve --proxy-config proxy.conf.json

# Mode production en dev
ng serve --configuration production
```

## 📊 Analyse

```bash
# Analyse du bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Taille des modules
ng build --source-map
```

## 🐛 Debug

```bash
# Mode verbose
ng serve --verbose

# Afficher les warnings
ng serve --show-warnings

# Désactiver le cache
ng serve --no-cache
```

## 🔄 Mise à jour

```bash
# Mise à jour Angular CLI
npm install -g @angular/cli@latest

# Mise à jour des dépendances
ng update

# Mise à jour d'un package spécifique
ng update @angular/core @angular/cli

# Vérifier les mises à jour disponibles
npm outdated
```

## 📝 Utilitaires

```bash
# Nettoyer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Nettoyer le cache Angular
ng cache clean

# Vérifier la version
ng version
```

## 🚀 Déploiement

```bash
# Build optimisé
ng build --configuration production --optimization --build-optimizer

# Build avec base href personnalisé
ng build --base-href /app/

# Build avec output path personnalisé
ng build --output-path dist/custom-folder
```

## 🔐 Variables d'Environnement

```bash
# Développement (par défaut)
ng serve
# Utilise: src/environments/environment.ts

# Production
ng build --configuration production
# Utilise: src/environments/environment.prod.ts

# Environnement personnalisé
ng serve --configuration staging
# Nécessite configuration dans angular.json
```

## 📱 Tests Responsive

```bash
# Serveur accessible depuis le réseau local
ng serve --host 0.0.0.0

# Accès depuis mobile: http://[IP-LOCAL]:4200
```

## 🎨 Styles

```bash
# Compiler SCSS
ng build --watch

# Extraire les CSS
ng build --extract-css
```

## 📚 Documentation

```bash
# Générer la documentation avec Compodoc
npm install -g @compodoc/compodoc
compodoc -p tsconfig.json -s

# Accès: http://localhost:8080
```

## 🔍 Recherche dans le Code

```bash
# Rechercher dans tous les fichiers TypeScript
grep -r "searchTerm" src/**/*.ts

# Rechercher dans les templates
grep -r "searchTerm" src/**/*.html

# Compter les lignes de code
find src -name "*.ts" | xargs wc -l
```

## 💾 Git (Rappels)

```bash
# Status
git status

# Commit
git add .
git commit -m "feat: implement payments and dashboard modules"

# Push
git push origin main

# Créer une branche
git checkout -b feature/payments-dashboard

# Merge
git checkout main
git merge feature/payments-dashboard
```

## 🌐 Backend (Rappel)

```bash
# Backend Spring Boot doit être lancé sur:
# http://localhost:2001

# Endpoints disponibles:
# - /api-webServices/dashboard/statistics
# - /api-webServices/payments/all
# - /api-webServices/payments/check
# - /api-webServices/payments/process
```

## 📞 Aide

```bash
# Aide générale
ng help

# Aide sur une commande spécifique
ng serve --help
ng build --help
ng generate --help
```

## ⚡ Raccourcis Utiles

```bash
# Alias recommandés (ajouter dans .bashrc ou .zshrc)
alias ngs="ng serve"
alias ngb="ng build"
alias ngt="ng test"
alias ngg="ng generate"
alias ngc="ng cache clean"
```

## 🎯 Workflow Recommandé

```bash
# 1. Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer
ng serve

# 3. Tester
ng test
ng lint

# 4. Build
ng build --configuration production

# 5. Commit & Push
git add .
git commit -m "feat: description"
git push origin feature/nouvelle-fonctionnalite

# 6. Créer une Pull Request
```
