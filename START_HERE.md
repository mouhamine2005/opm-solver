# 🚀 Guide de Démarrage Rapide - OPM Solver Pro

## ✅ Installation Complétée!

Votre projet **OPM Solver Pro** est maintenant entièrement fonctionnel! 🎉

---

## 📋 État Actuel

### ✅ Backend (FastAPI)
- **Port**: http://localhost:8000
- **Status**: ✅ En cours d'exécution
- **Documentation API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

### ✅ Frontend (Next.js)
- **Port**: http://localhost:3000
- **Status**: ✅ En cours d'exécution
- **Interface Web**: http://localhost:3000
- **Solver**: http://localhost:3000/solver

---

## 🎯 Fonctionnalités Disponibles

### API Endpoints (Backend)

1. **Résolution de Système Linéaire**: `POST /api/v1/solve`
   - Méthodes: Gauss, LU
   - Entrée: Matrice A, Vecteur b
   - Sortie: Solution x, erreur résiduelle, temps d'exécution

2. **Décomposition LU**: `POST /api/v1/decompose-lu`
   - Décompose A en matrices L et U

3. **Calcul du Déterminant**: `POST /api/v1/determinant`
   - Calcule det(A) via décomposition LU

4. **Inverse de Matrice**: `POST /api/v1/inverse`
   - Calcule A⁻¹

5. **Analyse de Matrice**: `POST /api/v1/analyze`
   - Déterminant, conditionnement, symétrie, valeurs propres, rang
   - Recommandations automatiques

### Interface Web (Frontend)

1. **Page d'Accueil** (`/`)
   - Présentation des fonctionnalités
   - Guide de démarrage rapide
   - Stack technique

2. **Solver Interactif** (`/solver`)
   - Éditeur de matrice dynamique
   - Éditeur de vecteur
   - Boutons de remplissage rapide (random, identity, zeros)
   - Sélection de méthode (Gauss / LU)
   - Affichage des résultats avec métriques
   - 3 exemples prédéfinis (2×2, 3×3, 4×4)

---

## 📝 Exemples d'Utilisation

### 1. Via l'Interface Web

1. Ouvrez http://localhost:3000
2. Cliquez sur "Commencer" ou "Ouvrir le Solver"
3. Configurez la taille de matrice (ex: 3×3)
4. Remplissez les valeurs ou utilisez "Fill Random"
5. Cliquez sur "Solve System"
6. Visualisez les résultats!

### 2. Via API avec Python

```python
import requests

# Résolution d'un système 2x2
data = {
    "matrix_a": {"data": [[2, 1], [1, 3]]},
    "vector_b": {"data": [5, 5]},
    "method": "gauss"
}

response = requests.post("http://localhost:8000/api/v1/solve", json=data)
result = response.json()

print(f"Solution: {result['solution']}")  # [2.0, 1.0]
print(f"Erreur: {result['residual_error']}")  # 0.0
```

### 3. Via API avec PowerShell

```powershell
$body = @{
    matrix_a = @{data = @(@(2,1), @(1,3))}
    vector_b = @{data = @(5,5)}
    method = "gauss"
} | ConvertTo-Json -Depth 10

Invoke-WebRequest `
    -Uri "http://localhost:8000/api/v1/solve" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    | Select-Object -ExpandProperty Content
```

---

## 🔧 Commandes de Gestion

### Démarrer les Serveurs

**Backend (Terminal 1):**
```powershell
cd "c:\Users\user\Desktop\OPM PROJECT\opm-solver-pro\backend"
.\venv\Scripts\activate
uvicorn src.app:app --reload --port 8000
```

**Frontend (Terminal 2):**
```powershell
cd "c:\Users\user\Desktop\OPM PROJECT\opm-solver-pro\frontend"
npm run dev
```

### Arrêter les Serveurs

- Appuyez sur `Ctrl+C` dans chaque terminal

### Tests

**Tests Backend:**
```powershell
cd "c:\Users\user\Desktop\OPM PROJECT\opm-solver-pro\backend"
.\venv\Scripts\activate
pytest tests/
```

**Test API Manuel:**
```powershell
cd "c:\Users\user\Desktop\OPM PROJECT\opm-solver-pro"
.\backend\venv\Scripts\python.exe test_api.py
```

---

## 📂 Structure du Projet

```
opm-solver-pro/
├── backend/                    # API FastAPI
│   ├── src/
│   │   ├── app.py             # Application principale
│   │   ├── config.py          # Configuration
│   │   ├── models.py          # Modèles Pydantic
│   │   ├── services/
│   │   │   └── matrix_solver.py  # Algorithmes OPM
│   │   └── api/
│   │       └── routes.py      # Endpoints API
│   ├── tests/                 # Tests unitaires
│   ├── venv/                  # Environnement virtuel
│   ├── requirements.txt       # Dépendances Python
│   └── .env                   # Configuration environnement
│
├── frontend/                   # Application Next.js
│   ├── src/
│   │   ├── app/               # Pages Next.js 14
│   │   │   ├── page.tsx       # Page d'accueil
│   │   │   ├── solver/        # Page solver
│   │   │   └── layout.tsx     # Layout principal
│   │   ├── components/        # Composants React
│   │   │   ├── MatrixInput.tsx
│   │   │   ├── VectorInput.tsx
│   │   │   └── ResultsDisplay.tsx
│   │   ├── services/          # Services API
│   │   │   └── api.ts
│   │   └── types/             # Types TypeScript
│   │       └── index.ts
│   ├── node_modules/          # Dépendances npm
│   ├── package.json           # Manifeste npm
│   └── .env.local             # Configuration Next.js
│
├── README.md                   # Documentation complète
├── QUICKSTART.md              # Guide rapide
└── test_api.py                # Script de test API
```

---

## 🎓 Contexte Académique

**Projet**: Système de Résolution d'Équations Linéaires  
**Méthodes Implémentées**:
- ✅ Élimination de Gauss avec pivotement partiel
- ✅ Décomposition LU
- ✅ Calcul de déterminant
- ✅ Inversion de matrice
- ✅ Analyse de stabilité numérique

**Technologies**:
- Backend: Python 3.13, FastAPI 0.115
- Frontend: TypeScript 5.3, Next.js 14, React 18, TailwindCSS 3
- Architecture: RESTful API, CORS-enabled, Type-safe

---

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifiez que le port 8000 n'est pas utilisé
- Activez l'environnement virtuel: `.\venv\Scripts\activate`
- Réinstallez les dépendances: `pip install -r requirements.txt`

### Le frontend ne démarre pas
- Vérifiez que le port 3000 n'est pas utilisé
- Réinstallez les dépendances: `npm install`
- Vérifiez `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Erreurs CORS
- Vérifiez `backend/.env`: `ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]`
- Redémarrez le backend après modification

### Erreurs de validation API
- Le format attendu est: `{"matrix_a": {"data": [[...]]}, "vector_b": {"data": [...]}}`
- Consultez la documentation: http://localhost:8000/docs

---

## 📚 Documentation Complète

Pour une documentation détaillée, consultez:
- **README.md**: Documentation complète du projet
- **QUICKSTART.md**: Guide d'installation pas-à-pas
- **backend/README.md**: Documentation API backend
- **frontend/README.md**: Documentation frontend
- **API Docs**: http://localhost:8000/docs (Swagger UI interactif)

---

## 🎉 Félicitations!

Votre projet OPM Solver Pro est maintenant **opérationnel et prêt à l'emploi**! 

- ✅ Backend FastAPI: Opérationnel sur port 8000
- ✅ Frontend Next.js: Opérationnel sur port 3000
- ✅ 6 Endpoints API documentés
- ✅ Interface utilisateur interactive
- ✅ Documentation complète
- ✅ Tests automatisés

**Accédez à votre application**: http://localhost:3000

---

## 📞 Support

Pour toute question:
1. Consultez la documentation: `README.md`
2. Vérifiez les logs des serveurs
3. Consultez l'API interactive: http://localhost:8000/docs
4. Vérifiez les erreurs dans la console du navigateur (F12)

---

**Version**: 1.0.0  
**Date**: 2024  
**Auteur**: Équipe OPM Solver Pro
