@echo off
REM Script de déploiement rapide pour Windows

echo ================================
echo 🚀 Déploiement OPM Solver Pro
echo ================================
echo.

REM Vérifier Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé
    echo Téléchargez-le sur : https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Initialiser Git si nécessaire
if not exist .git (
    echo 📦 Initialisation du repository Git...
    git init
    git add .
    git commit -m "Initial commit - Ready for deployment"
    echo ✅ Repository Git créé
) else (
    echo ✅ Repository Git existant
)

REM Instructions
echo.
echo 📝 Prochaines étapes :
echo.
echo 1️⃣  Créer un repository sur GitHub :
echo     https://github.com/new
echo.
echo 2️⃣  Ajouter le remote :
echo     git remote add origin https://github.com/USERNAME/REPO.git
echo     git branch -M main
echo     git push -u origin main
echo.
echo 3️⃣  Déployer le backend sur Railway :
echo     https://railway.app
echo     - New Project → Deploy from GitHub
echo     - Sélectionner votre repo
echo.
echo 4️⃣  Déployer le frontend sur Vercel :
echo     https://vercel.com
echo     - New Project → Import Git Repository
echo     - Root Directory: frontend
echo     - Ajouter NEXT_PUBLIC_API_URL avec l'URL Railway
echo.
echo 📖 Guide complet : README_DEPLOYMENT.md
echo.

pause
