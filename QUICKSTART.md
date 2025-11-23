# Guide de Démarrage Rapide - OPM Solver Pro

## ⚡ Installation Express (Windows)

### Étape 1 : Backend

```powershell
# Ouvrir PowerShell dans : c:\Users\user\Desktop\OPM PROJECT\opm-solver-pro\backend

# Créer et activer venv
python -m venv venv
.\venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Copier config
copy .env.example .env

# Lancer le serveur
uvicorn src.app:app --reload --port 8000
```

✅ Backend disponible sur : **http://localhost:8000**
📚 Documentation : **http://localhost:8000/docs**

---

### Étape 2 : Frontend

```powershell
# Ouvrir un NOUVEAU PowerShell dans : c:\Users\user\Desktop\OPM PROJECT\opm-solver-pro\frontend

# Installer dépendances
npm install

# Copier config
copy .env.local.example .env.local

# Lancer le serveur
npm run dev
```

✅ Frontend disponible sur : **http://localhost:3000**

---

## 🎯 Utilisation

1. Ouvrir http://localhost:3000
2. Cliquer sur **"Solveur"**
3. Entrer votre matrice A et vecteur b
4. Choisir la méthode (Gauss recommandé)
5. Cliquer **"Résoudre"**
6. Consulter les résultats !

---

## 🧪 Tester l'API directement

```powershell
# Test simple avec curl ou visitez http://localhost:8000/docs

curl -X POST "http://localhost:8000/api/v1/solve" -H "Content-Type: application/json" -d '{\"matrix_a\": {\"data\": [[3,2],[2,4]]}, \"vector_b\": {\"data\": [5,8]}, \"method\": \"gauss\"}'
```

---

## 🚀 Commandes Principales

### Backend
```powershell
cd backend
.\venv\Scripts\activate
uvicorn src.app:app --reload    # Démarrer
pytest tests/ -v                # Tests
```

### Frontend
```powershell
cd frontend
npm run dev                     # Démarrer
npm run build                   # Build production
npm test                        # Tests
```

---

## ❓ Problèmes courants

### Port 8000 déjà utilisé
```powershell
# Changer le port dans backend/.env
PORT=8001

# Puis dans frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Erreur CORS
✅ Vérifier que `ALLOWED_ORIGINS` dans `backend/.env` contient `http://localhost:3000`

### Backend ne démarre pas
```powershell
cd backend
pip install --upgrade -r requirements.txt
```

---

**🎓 Projet OPM - Mohamed Amine Meddour - USTHB 2024**
