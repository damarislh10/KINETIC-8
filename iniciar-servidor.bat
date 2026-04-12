@echo off
cd /d "%~dp0"
echo.
echo Servidor local KINETIC
echo Abre en tu navegador: http://localhost:5500
echo Cierra esta ventana para detener el servidor.
echo.
py -m http.server 5500 2>nul || python -m http.server 5500
pause
