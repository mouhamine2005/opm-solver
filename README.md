# 🚀 OPM Solver Pro

**Plateforme Interactive de Résolution de Systèmes Linéaires**

Application web fullstack professionnelle pour résoudre des systèmes linéaires Ax = b, développée dans le cadre du module OPM (Outils de Programmation Mathématiques) - USTHB Licence 1
Informatique.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Next.js](https://img.shields.io/badge/next.js-14.0-black)
![License](https://img.shields.io/badge/license-Academic-green)

---

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Auteur](#auteur)

---

## 🎯 Vue d'ensemble

OPM Solver Pro est une plateforme web complète qui permet de :

- ✅ **Résoudre** des systèmes linéaires avec plusieurs algorithmes (Gauss, LU)
- ✅ **Analyser** des matrices (déterminant, conditionnement, valeurs propres)
- ✅ **Visualiser** les résultats avec des métriques détaillées
- ✅ **Comparer** les performances des différentes méthodes
- ✅ **Exporter** les résultats et analyses

### Cas d'usage

- 📚 **Étudiants** : Apprendre et comprendre les algorithmes d'algèbre linéaire
- 👨‍🏫 **Enseignants** : Démontrer les méthodes de résolution
- 🔬 **Chercheurs** : Tester et valider des systèmes complexes
- 💼 **Ingénieurs** : Résoudre rapidement des problèmes pratiques

---

## ✨ Fonctionnalités

### Backend (FastAPI)

| Fonctionnalité | Description |
|---|---|
| **Élimination Gaussienne** | Implémentation avec pivotage partiel |
| **Décomposition LU** | Factorisation A = LU et résolution |
| **Calcul Déterminant** | Via décomposition LU optimisée |
| **Matrice Inverse** | Calcul par résolution de n systèmes |
| **Analyse Complète** | Conditionnement, symétrie, valeurs propres |
| **API REST** | Endpoints documentés avec Swagger |
| **Validation** | Vérification des dimensions et singularité |
| **Métriques** | Temps d'exécution, erreur résiduelle |

### Frontend (Next.js)

| Fonctionnalité | Description |
|---|---|
| **Interface Interactive** | Édition dynamique des matrices |
| **Visualisations** | Heatmaps et graphiques des résultats |
| **Exemples Prédéfinis** | Systèmes 2×2, 3×3, matrices spéciales |
| **Responsive Design** | Compatible mobile, tablette, desktop |
| **Gestion d'Erreurs** | Messages clairs et informatifs |
| **Dark Mode** | (Optionnel, à activer) |

---

## 🏗️ Architecture

```
opm-solver-pro/
├── backend/                    # API FastAPI (Python)
│   ├── src/
│   │   ├── app.py             # Application principale
│   │   ├── config.py          # Configuration
│   │   ├── models.py          # Schémas Pydantic
│   │   ├── api/
│   │   │   └── routes.py      # Routes API
│   │   └── services/
│   │       └── matrix_solver.py # Algorithmes OPM
│   ├── tests/                 # Tests unitaires
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                   # Interface Next.js (React/TypeScript)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Layout principal
│   │   │   ├── page.tsx       # Page d'accueil
│   │   │   └── solver/
│   │   │       └── page.tsx   # Page solveur
│   │   ├── components/
│   │   │   ├── MatrixInput.tsx
│   │   │   ├── VectorInput.tsx
│   │   │   └── ResultsDisplay.tsx
│   │   ├── services/
│   │   │   └── api.ts         # Client API
│   │   └── types/
│   │       └── index.ts       # Types TypeScript
│   ├── package.json
│   └── README.md
│
└── README.md                   # Ce fichier
```

### Stack Technologique

**Backend**
- FastAPI 0.104+
- Python 3.10+
- Pydantic
- Uvicorn

**Frontend**
- Next.js 14
- React 18
- TypeScript 5
- TailwindCSS 3
- Axios

---

## 🚀 Installation

### Prérequis

- Python 3.10+
- Node.js 18+
- npm ou yarn
- Git

### Installation complète

#### 1. Cloner le repository

```powershell
cd "c:\Users\user\Desktop\OPM PROJECT"
cd opm-solver-pro
```

#### 2. Setup Backend

```powershell
# Naviguer vers le backend
cd backend

# Créer environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier de configuration
copy .env.example .env
```

#### 3. Setup Frontend

```powershell
# Dans un nouveau terminal, naviguer vers le frontend
cd frontend

# Installer les dépendances
npm install

# Copier le fichier de configuration
copy .env.local.example .env.local
```

---

## 🏃 Utilisation

### Démarrer le Backend

```powershell
# Depuis le dossier backend, avec venv activé
cd backend
venv\Scripts\activate
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

Le backend sera disponible sur **http://localhost:8000**
Documentation API : **http://localhost:8000/docs**

### Démarrer le Frontend

```powershell
# Depuis le dossier frontend
cd frontend
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

### Workflow complet

1. **Démarrer le backend** (terminal 1) → http://localhost:8000
2. **Démarrer le frontend** (terminal 2) → http://localhost:3000
3. **Ouvrir le navigateur** → http://localhost:3000
4. **Aller sur "Solveur"**
5. **Saisir votre système** :
   - Matrice A (coefficients)
   - Vecteur b (résultats)
6. **Choisir une méthode** (Gauss, LU)
7. **Cliquer "Résoudre"**
8. **Analyser les résultats** (solution, erreur, métriques)

---

## 📡 API Documentation

### Endpoints principaux

#### `POST /api/v1/solve`
Résoudre un système linéaire Ax = b

**Request:**
```json
{
  "matrix_a": {
    "data": [[3, 2], [2, 4]]
  },
  "vector_b": {
    "data": [5, 8]
  },
  "method": "gauss"
}
```

**Response:**
```json
{
  "success": true,
  "solution": [0.2857, 1.7857],
  "residual_error": 1.5e-15,
  "method": "gauss",
  "execution_time": 0.0012,
  "matrix_condition": 7.23,
  "determinant": 8.0
}
```

#### `POST /api/v1/analyze`
Analyser une matrice complètement

#### `POST /api/v1/decompose-lu`
Décomposition LU

#### `GET /api/v1/health`
Health check de l'API

**Documentation complète** : http://localhost:8000/docs

---

## 🧪 Tests

### Backend

```powershell
cd backend
venv\Scripts\activate
pytest tests/ -v
```

### Frontend

```powershell
cd frontend
npm test
```

---

## 📊 Exemples

### Exemple 1 : Système 2×2 simple

```python
A = [[3, 2],
     [2, 4]]
b = [5, 8]

# Solution: x = [0.286, 1.786]
```

### Exemple 2 : Système 3×3

```python
A = [[10, -1, 2],
     [-1, 11, -1],
     [2, -1, 10]]
b = [6, 25, -11]

# Solution: x = [1.0, 2.0, -1.0]
```

### Exemple 3 : Matrice symétrique

```python
A = [[2, -1, 0],
     [-1, 2, -1],
     [0, -1, 2]]
b = [1, 0, 1]

# Matrice définie positive
```

---

## 🎨 Screenshots

### Page d'accueil
![Accueil](docs/screenshots/home.png)

### Solveur interactif
![Solveur](docs/screenshots/solver.png)

### Résultats détaillés
![Résultats](docs/screenshots/results.png)

---

## 🔧 Configuration

### Backend (.env)

```env
API_VERSION=v1
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
MAX_MATRIX_SIZE=1000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚢 Déploiement

### Backend → Railway.app

1. Connecter votre repo GitHub
2. Sélectionner le dossier `backend/`
3. Railway détecte automatiquement Python
4. Déployer

### Frontend → Vercel

1. Connecter votre repo GitHub
2. Importer le projet
3. Root directory: `frontend/`
4. Ajouter la variable : `NEXT_PUBLIC_API_URL=https://votre-api.railway.app`
5. Déployer

---

## 📚 Documentation supplémentaire

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](http://localhost:8000/docs)
- [Rapport de Projet](docs/rapport_projet.md)

---

## 🎓 Contexte Académique

Ce projet a été développé dans le cadre du module **OPM (Outils de Programmation Mathématiques)** de la Licence 3 Informatique à l'USTHB (Université des Sciences et de la Technologie Houari Boumediene), Alger.

### Objectifs pédagogiques

- ✅ Implémenter des algorithmes d'algèbre linéaire
- ✅ Maîtriser Python scientifique
- ✅ Développer une API REST professionnelle
- ✅ Créer une interface web moderne
- ✅ Appliquer les bonnes pratiques de développement

---

## 🤝 Contribution

Ce projet est académique et personnel. Pour toute question ou suggestion :

- 📧 Email : meddour.amine@example.com
- 🔗 LinkedIn : [Mohamed Amine Meddour](https://linkedin.com/in/meddour-amine)
- 🐙 GitHub : [@meddouramine](https://github.com/meddouramine)

---

## 📄 Licence

Projet à usage **académique uniquement**. 
© 2024 Mohamed Amine Meddour - USTHB

---

## 🙏 Remerciements

- **USTHB** - Formation en Informatique
- **Module OPM** - Enseignants et encadrement
- **Communauté Open Source** - FastAPI, Next.js

---

## 📈 Statistiques

- **Lignes de code** : ~3000+
- **Fichiers** : 30+
- **Tests** : 15+
- **Endpoints API** : 6
- **Pages Frontend** : 3

---

## 🎯 Roadmap (Améliorations futures)

- [ ] Visualisations graphiques avancées (heatmaps interactives)
- [ ] Export PDF des résultats
- [ ] Historique des calculs
- [ ] Comparaison de méthodes côte-à-côte
- [ ] Support de matrices creuses
- [ ] Mode batch (plusieurs systèmes)
- [ ] API d'authentification
- [ ] Dashboard d'administration

---

## ⭐ Si ce projet vous aide

Si vous trouvez ce projet utile pour vos études ou projets, n'hésitez pas à :

- ⭐ **Star** le repository
- 🔀 **Fork** pour vos propres modifications
- 📢 **Partager** avec vos collègues
- 💬 **Laisser un commentaire**

---

**Développé avec ❤️ par Mohamed Amine Meddour**

*Pour les Masters en France - Cybersécurité, IA & Développement Logiciel*

---

## 🔗 Liens Utiles

- [Documentation FastAPI](https://fastapi.tiangolo.com)
- [Documentation Next.js](https://nextjs.org/docs)
- [Algèbre Linéaire - MIT OCW](https://ocw.mit.edu/courses/mathematics/)

---

*Dernière mise à jour : Novembre 2024*
