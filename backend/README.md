# OPM Solver Pro - Backend API

API FastAPI professionnelle pour résolution de systèmes linéaires Ax = b.

## 🚀 Installation

### Prérequis
- Python 3.10+
- pip

### Setup

```powershell
# Naviguer vers le backend
cd backend

# Créer environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Copier fichier config
copy .env.example .env
```

## 🏃 Démarrage

### Mode développement

```powershell
# Depuis le dossier backend
uvicorn src.app:app --reload --host 0.0.0.0 --port 8000
```

### Avec Python directement

```powershell
python -m src.app
```

## 📚 Documentation

Une fois l'API lancée:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Tests

```powershell
# Tests unitaires
pytest tests/ -v

# Avec coverage
pytest tests/ --cov=src

# Tests spécifiques
pytest tests/test_api.py -v
```

## 📡 Endpoints principaux

### POST `/api/v1/solve`
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

### POST `/api/v1/decompose-lu`
Décomposition LU d'une matrice

### POST `/api/v1/determinant`
Calculer le déterminant

### POST `/api/v1/inverse`
Calculer l'inverse

### POST `/api/v1/analyze`
Analyse complète d'une matrice

### GET `/api/v1/health`
Health check

## 🏗️ Structure

```
backend/
├── src/
│   ├── app.py              # Application FastAPI
│   ├── config.py           # Configuration
│   ├── models.py           # Schémas Pydantic
│   ├── api/
│   │   └── routes.py       # Routes API
│   └── services/
│       └── matrix_solver.py # Logique métier
├── tests/                  # Tests
├── requirements.txt        # Dépendances
└── .env                    # Configuration
```

## 📊 Algorithmes implémentés

- ✅ Élimination Gaussienne avec pivotage
- ✅ Décomposition LU
- ✅ Calcul déterminant
- ✅ Matrice inverse
- ✅ Analyse numérique (conditionnement, valeurs propres)

## 📝 Exemples d'utilisation

### cURL

```bash
curl -X POST "http://localhost:8000/api/v1/solve" \
  -H "Content-Type: application/json" \
  -d '{
    "matrix_a": {"data": [[3,2],[2,4]]},
    "vector_b": {"data": [5,8]},
    "method": "gauss"
  }'
```

### Python (requests)

```python
import requests

response = requests.post(
    "http://localhost:8000/api/v1/solve",
    json={
        "matrix_a": {"data": [[3,2],[2,4]]},
        "vector_b": {"data": [5,8]},
        "method": "gauss"
    }
)

print(response.json())
```

## 👨‍💻 Auteur

Mohamed Amine Meddour - Licence 3 Informatique - USTHB 2024
