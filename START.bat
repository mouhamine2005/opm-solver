@echo off
echo ========================================
echo   OPM Solver Pro - Demarrage Complet
echo ========================================
echo.
echo Ce script va demarrer les 2 serveurs:
echo   - Backend (FastAPI) sur port 8000
echo   - Frontend (Next.js) sur port 3000
echo.
echo Verification des prerequis...
echo.

cd /d "%~dp0"

REM Verifier backend
if not exist "backend\venv\Scripts\activate.bat" (
    echo [ERREUR] Backend: Environnement virtuel non trouve!
    echo Veuillez installer les dependances du backend:
    echo   cd backend
    echo   python -m venv venv
    echo   .\venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

REM Verifier frontend
if not exist "frontend\node_modules" (
    echo [ERREUR] Frontend: node_modules non trouve!
    echo Veuillez installer les dependances du frontend:
    echo   cd frontend
    echo   npm install
    pause
    exit /b 1
)

echo [OK] Tous les prerequis sont satisfaits!
echo.
echo Demarrage des serveurs...
echo.
echo BACKEND sera demarre dans une nouvelle fenetre
echo FRONTEND sera demarre dans cette fenetre
echo.
pause

REM Demarrer le backend dans une nouvelle fenetre
start "OPM Backend (Port 8000)" cmd /k "%~dp0start_backend.bat"

echo Backend demarre! Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo Demarrage du frontend...
echo.

REM Demarrer le frontend dans cette fenetre
call "%~dp0start_frontend.bat"
