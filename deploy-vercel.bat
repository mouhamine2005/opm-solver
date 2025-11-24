@echo off
setlocal EnableDelayedExpansion

echo ================================================
echo 🚀 DÉPLOIEMENT AUTOMATIQUE - OPM SOLVER PRO
echo ================================================
echo.

REM Vérifier si Vercel CLI est installé
where vercel >nul 2>&1
if errorlevel 1 (
    echo 📦 Installation de Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation de Vercel CLI
        echo.
        echo Installez manuellement avec: npm install -g vercel
        pause
        exit /b 1
    )
    echo ✅ Vercel CLI installé
) else (
    echo ✅ Vercel CLI déjà installé
)

echo.
echo ================================================
echo 📋 INSTRUCTIONS DE DÉPLOIEMENT
echo ================================================
echo.
echo Vous allez devoir :
echo.
echo 1️⃣  Vous connecter à Vercel (navigateur va s'ouvrir)
echo 2️⃣  Autoriser l'accès
echo 3️⃣  Choisir un nom pour votre projet
echo.
echo Appuyez sur une touche pour continuer...
pause >nul

echo.
echo ================================================
echo 🌐 DÉPLOIEMENT DU FRONTEND
echo ================================================
echo.

cd frontend

echo 📦 Connexion à Vercel...
call vercel login

echo.
echo 🚀 Déploiement en production...
echo.
echo ⚠️  Configuration requise :
echo    - Framework: Next.js
echo    - Root Directory: Utiliser le répertoire actuel
echo    - Build Command: npm run build
echo.

call vercel --prod

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du déploiement
    echo.
    echo Essayez manuellement :
    echo   cd frontend
    echo   vercel --prod
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo ✅ DÉPLOIEMENT FRONTEND RÉUSSI !
echo ================================================
echo.
echo 🎯 Prochaines étapes :
echo.
echo 1️⃣  Notez l'URL de votre site (affichée ci-dessus)
echo.
echo 2️⃣  Déployez le BACKEND sur Railway :
echo     • Allez sur https://railway.app
echo     • New Project ^> Deploy from GitHub
echo     • Importez votre repository
echo     • Configurez Python 3.13
echo.
echo 3️⃣  Ajoutez l'URL du backend dans Vercel :
echo     • Allez sur https://vercel.com/dashboard
echo     • Sélectionnez votre projet
echo     • Settings ^> Environment Variables
echo     • Ajoutez : NEXT_PUBLIC_API_URL = [URL_RAILWAY]
echo     • Redéployez
echo.
echo 📖 Guide complet : README_DEPLOYMENT.md
echo.

cd ..

pause
