@echo off
setlocal
cd /d "%~dp0"
echo ==============================================
echo   Subiendo CV-Portafolio a GitHub
echo ==============================================

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git no esta instalado.
  echo Instalalo con:  winget install --id Git.Git -e
  echo Despues cierra y vuelve a abrir el CMD y ejecuta este script otra vez.
  pause
  exit /b 1
)

if not exist ".git" git init
git branch -M main

set "GN="
set "GE="
for /f "delims=" %%i in ('git config user.name') do set "GN=%%i"
for /f "delims=" %%i in ('git config user.email') do set "GE=%%i"
if "%GN%"=="" git config user.name "Brian Tarira"
if "%GE%"=="" git config user.email "briandouglas795@gmail.com"

git remote remove origin >nul 2>&1
git remote add origin https://github.com/briantarira7ea/CV-Portafolio.git

git add .
git commit -m "Portafolio CV: README, web y CV en PDF"

echo.
echo (Si ves un aviso "couldn't find remote ref main", es normal: el repo estaba vacio)
git pull origin main --allow-unrelated-histories -X ours --no-edit

git push -u origin main
if errorlevel 1 (
  echo.
  echo [ERROR] No se pudo subir. Revisa que el repo existe y que has iniciado sesion en GitHub.
  pause
  exit /b 1
)

echo.
echo ==============================================
echo   LISTO. Mira tu repo:
echo   https://github.com/briantarira7ea/CV-Portafolio
echo ==============================================
pause
