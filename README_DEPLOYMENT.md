# 🚀 Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer **OPM Solver Pro** sur Vercel.

## 📋 Prérequis

1. Un compte [Vercel](https://vercel.com) (gratuit)
2. Un compte [Railway](https://railway.app) ou [Render](https://render.com) pour le backend Python (gratuit)
3. Git installé sur votre machine

## 🎯 Architecture de Déploiement

```
Frontend (Next.js) → Vercel
Backend (FastAPI) → Railway/Render/Python Anywhere
```

---

## 📦 Partie 1 : Déployer le Backend (FastAPI)

### Option A : Railway (Recommandé)

1. **Créer un compte sur [Railway.app](https://railway.app)**

2. **Créer un nouveau projet**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Connectez votre repository GitHub

3. **Configurer le service**
   - Railway détectera automatiquement votre application Python
   - Créez un fichier `railway.json` dans `/backend`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn src.app:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

4. **Variables d'environnement**
   - Dans Railway, ajoutez :
     - `PYTHON_VERSION=3.13`
     - `PORT=8000` (Railway le configure automatiquement)

5. **Déployer**
   - Railway déploiera automatiquement
   - Notez l'URL générée (ex: `https://your-app.railway.app`)

### Option B : Render

1. **Créer un compte sur [Render.com](https://render.com)**

2. **Créer un nouveau Web Service**
   - New → Web Service
   - Connectez votre repository
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn src.app:app --host 0.0.0.0 --port $PORT`

3. **Variables d'environnement**
   - `PYTHON_VERSION=3.13`

4. **Déployer**
   - Cliquez sur "Create Web Service"
   - Notez l'URL générée

---

## 🌐 Partie 2 : Déployer le Frontend (Next.js sur Vercel)

### Étape 1 : Préparer le projet

1. **Créer un repository Git** (si ce n'est pas déjà fait)

```bash
cd "C:\Users\user\Desktop\OPM PROJECT\opm-solver-pro"
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

2. **Pusher sur GitHub**

```bash
# Créez un nouveau repository sur GitHub.com
# Puis :
git remote add origin https://github.com/VOTRE_USERNAME/opm-solver-pro.git
git branch -M main
git push -u origin main
```

### Étape 2 : Configurer Vercel

1. **Aller sur [Vercel.com](https://vercel.com)**
   - Connectez-vous avec votre compte GitHub

2. **Importer le projet**
   - Cliquez sur "Add New" → "Project"
   - Sélectionnez votre repository `opm-solver-pro`

3. **Configuration du projet**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (par défaut)
   - **Output Directory**: `.next` (par défaut)
   - **Install Command**: `npm install` (par défaut)

4. **Variables d'environnement**
   - Cliquez sur "Environment Variables"
   - Ajoutez :
     - **Name**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://votre-backend.railway.app` (l'URL de votre backend)
     - **Environment**: Production

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez 2-3 minutes
   - Votre site sera disponible sur `https://votre-projet.vercel.app`

---

## 🔧 Partie 3 : Configuration Post-Déploiement

### 1. Configurer CORS sur le Backend

Dans `backend/src/app.py`, vérifiez que CORS accepte votre domaine Vercel :

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://votre-projet.vercel.app",  # Ajoutez votre URL Vercel
        "https://*.vercel.app"  # Ou wildcard pour tous les previews
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Tester le déploiement

1. Visitez votre URL Vercel
2. Testez le solveur de matrices
3. Testez la Machine de Turing
4. Vérifiez la console du navigateur (F12) pour les erreurs

---

## 🎨 Partie 4 : Domaine Personnalisé (Optionnel)

### Sur Vercel

1. Allez dans "Settings" → "Domains"
2. Ajoutez votre domaine (ex: `opm-solver.com`)
3. Suivez les instructions DNS

---

## 📊 Fichiers de Configuration Créés

### `vercel.json` (racine du projet)
Configuration pour router correctement vers le frontend

### `frontend/.env.production`
Variables d'environnement pour la production

### `backend/railway.json` (à créer)
Configuration pour Railway

---

## 🔄 Déploiement Automatique

Une fois configuré :

1. **Chaque push sur `main`** déclenchera un déploiement automatique
2. **Les Pull Requests** créeront des previews automatiques
3. **Vercel** gère automatiquement :
   - HTTPS/SSL
   - CDN global
   - Compression d'images
   - Edge caching

---

## 🐛 Dépannage

### Erreur : "API not reachable"
- Vérifiez que `NEXT_PUBLIC_API_URL` est correctement configuré dans Vercel
- Vérifiez que le backend est bien déployé et accessible
- Vérifiez les paramètres CORS du backend

### Erreur : "Module not found"
- Supprimez `node_modules` et `.next`
- Relancez `npm install`
- Redéployez

### Erreur 500 sur le backend
- Vérifiez les logs sur Railway/Render
- Vérifiez que toutes les dépendances sont dans `requirements.txt`
- Vérifiez que Python 3.13 est supporté (sinon utilisez 3.11)

---

## 📞 Support

Pour toute question :
- Documentation Vercel : https://vercel.com/docs
- Documentation Railway : https://docs.railway.app
- Documentation Next.js : https://nextjs.org/docs

---

## ✅ Checklist de Déploiement

- [ ] Backend déployé sur Railway/Render
- [ ] URL du backend notée
- [ ] Repository Git créé et poussé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée
- [ ] CORS configuré sur le backend
- [ ] Premier déploiement réussi
- [ ] Tests fonctionnels effectués
- [ ] Domaine personnalisé configuré (optionnel)

**Félicitations ! Votre application est maintenant en ligne ! 🎉**
