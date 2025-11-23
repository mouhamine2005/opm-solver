# OPM Solver Pro - Frontend

Interface web Next.js/React pour la résolution de systèmes linéaires.

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Setup

```powershell
# Naviguer vers le frontend
cd frontend

# Installer les dépendances
npm install

# Copier le fichier de configuration
copy .env.local.example .env.local

# Éditer .env.local et configurer l'URL de l'API backend
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🏃 Démarrage

### Mode développement

```powershell
npm run dev
```

L'application sera disponible sur http://localhost:3000

### Build production

```powershell
npm run build
npm start
```

## 📁 Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── solver/
│   │   │   └── page.tsx        # Page solveur
│   │   └── globals.css         # Styles globaux
│   ├── components/
│   │   ├── MatrixInput.tsx     # Input matrice
│   │   ├── VectorInput.tsx     # Input vecteur
│   │   └── ResultsDisplay.tsx  # Affichage résultats
│   ├── services/
│   │   └── api.ts              # Client API
│   └── types/
│       └── index.ts            # Types TypeScript
├── public/                     # Fichiers statiques
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎨 Features

- ✅ Interface responsive avec TailwindCSS
- ✅ Édition interactive des matrices
- ✅ Choix de méthode de résolution
- ✅ Affichage détaillé des résultats
- ✅ Métriques en temps réel
- ✅ Exemples prédéfinis
- ✅ Gestion d'erreurs

## 🔧 Configuration

### Variables d'environnement (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧪 Pages

### `/` - Accueil
- Présentation du projet
- Fonctionnalités principales
- Démarrage rapide

### `/solver` - Solveur
- Input matrice A et vecteur b
- Sélection de méthode (Gauss, LU)
- Affichage résultats détaillés
- Exemples prédéfinis

### `/analysis` - Analyse (à venir)
- Analyse complète de matrices
- Visualisations graphiques

## 📝 Utilisation

1. Accéder à http://localhost:3000
2. Aller sur la page "Solveur"
3. Saisir votre matrice A et vecteur b
4. Choisir une méthode de résolution
5. Cliquer sur "Résoudre"
6. Consulter les résultats

## 🎯 Technologies

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Axios
- Recharts (visualisations)

## 👨‍💻 Développement

```powershell
# Linter
npm run lint

# Formatter (si configuré)
npm run format
```

## 🚢 Déploiement

### Vercel (recommandé)

1. Connecter votre repo GitHub
2. Importer le projet dans Vercel
3. Configurer `NEXT_PUBLIC_API_URL` dans les variables d'environnement
4. Déployer

### Build manuel

```powershell
npm run build
npm start
```

## 👨‍💻 Auteur

Mohamed Amine Meddour - Licence 3 Informatique - USTHB 2024
