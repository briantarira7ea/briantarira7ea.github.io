@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "GHUSER=briantarira7ea"
set "NEWREPO=briantarira7ea.github.io"
set "OLDREPO=CV-Portafolio"

echo ================================================
echo   Desplegando el portafolio en GitHub Pages
echo ================================================

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Falta Git. Instalalo con: winget install --id Git.Git -e
  pause & exit /b 1
)
where gh >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Falta la CLI de GitHub. Instalala con: winget install --id GitHub.cli -e
  echo Cierra y abre de nuevo el CMD despues de instalar.
  pause & exit /b 1
)

echo.
echo [1/6] Comprobando sesion de GitHub...
gh auth status >nul 2>&1
if errorlevel 1 gh auth login --web --git-protocol https
gh auth status >nul 2>&1
if errorlevel 1 (
  echo [ERROR] No hay sesion iniciada en GitHub.
  pause & exit /b 1
)

echo.
echo [2/6] Preparando el repositorio %NEWREPO% ...
gh repo view %GHUSER%/%NEWREPO% >nul 2>&1
if errorlevel 1 (
  gh repo view %GHUSER%/%OLDREPO% >nul 2>&1
  if errorlevel 1 (
    gh repo create %GHUSER%/%NEWREPO% --public --description "Portafolio de Brian Tarira"
  ) else (
    gh repo rename %NEWREPO% --repo %GHUSER%/%OLDREPO% --yes
  )
)
gh repo edit %GHUSER%/%NEWREPO% --visibility public --accept-visibility-change-consequences >nul 2>&1

echo.
echo [3/6] Preparando Git en esta carpeta...
if not exist ".git" git init
git branch -M main
set "GN="
set "GE="
for /f "delims=" %%i in ('git config user.name') do set "GN=%%i"
for /f "delims=" %%i in ('git config user.email') do set "GE=%%i"
if "%GN%"=="" git config user.name "Brian Tarira"
if "%GE%"=="" git config user.email "briandouglas795@gmail.com"
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%GHUSER%/%NEWREPO%.git

echo.
echo [4/6] Subiendo los archivos...
git add .
git commit -m "Portafolio web: mapa interactivo, experiencia y proyectos"
echo (Un aviso "couldn't find remote ref main" es normal si el repo estaba vacio)
git pull origin main --allow-unrelated-histories -X ours --no-edit
git push -u origin main
if errorlevel 1 (
  echo [ERROR] No se pudo subir. Revisa tu sesion de GitHub y vuelve a ejecutar el script.
  pause & exit /b 1
)

echo.
echo [5/6] Activando GitHub Pages (si ya estaba activo, el aviso es normal)...
gh api --method POST repos/%GHUSER%/%NEWREPO%/pages -f "source[branch]=main" -f "source[path]=/" >nul 2>&1

echo.
echo [6/6] Esperando a que la web se publique (hasta 2 minutos)...
set /a N=0
:espera
set "ST="
for /f "delims=" %%s in ('gh api repos/%GHUSER%/%NEWREPO%/pages/builds/latest --jq ".status" 2^>nul') do set "ST=%%s"
echo    estado: %ST%
if /i "%ST%"=="built" goto listo
set /a N+=1
if %N% geq 12 goto listo
timeout /t 10 /nobreak >nul
goto espera

:listo
echo.
echo ================================================
echo   Tu web: https://%NEWREPO%/
echo   Si aun no carga, espera 1-2 minutos y recarga.
echo ================================================
start "" https://%NEWREPO%/
pause
