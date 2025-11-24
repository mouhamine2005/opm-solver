@echo off
REM ==============================================
REM  Script de Push vers GitHub
REM ==============================================

set REPO_DIR=%~dp0
cd /d "%REPO_DIR%"

echo Vérification remote existant...
git remote -v >nul 2>nul
if errorlevel 1 (
    echo Aucun remote configuré.
) else (
    echo Remote(s) existant(s):
    git remote -v
)

echo.
echo Si aucun remote n'est configuré :
echo 1. Créez un repo sur GitHub: https://github.com/new
ECHO 2. Copiez l'URL HTTPS (ex: https://github.com/USERNAME/opm-solver-pro.git)
ECHO 3. Exécutez la commande ci-dessous (ou laissez le script la faire)
ECHO.

set /p GIT_REMOTE_URL=Entrer l'URL du dépôt GitHub (ou laisser vide pour sauter): 
IF "%GIT_REMOTE_URL%"=="" GOTO skipAdd

echo Ajout du remote origin...
git remote add origin "%GIT_REMOTE_URL%" 2>nul

echo Vérification...
git remote -v

:skipAdd
echo.
echo Création d'un commit (si modifications)...
git add .
git commit -m "chore: update project before push" || echo Aucun changement à committer.

echo Push vers GitHub (branche main)...
git push -u origin main

if errorlevel 1 (
  echo ❌ Le push a échoué. Vérifiez l'URL ou votre connexion.
  pause
  exit /b 1
) else (
  echo ✅ Push réussi !
  echo URL du dépôt: %GIT_REMOTE_URL%
)

echo.
pause
