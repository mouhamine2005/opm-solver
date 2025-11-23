@echo off
echo ========================================
echo    OPM Solver Pro - Demarrage Frontend
echo ========================================
echo.

cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [ERREUR] node_modules non trouve!
    echo Veuillez d'abord installer les dependances:
    echo   npm install
    pause
    exit /b 1
)

echo Demarrage du serveur Next.js sur http://localhost:3000...
echo.
echo Interface Web: http://localhost:3000
echo Solver: http://localhost:3000/solver
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

npm run dev
