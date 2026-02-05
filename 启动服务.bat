@echo off
title Growth Little Hero

echo.
echo ======================================
echo    Growth Little Hero Launcher
echo ======================================
echo.

if not exist "node_modules\" (
    echo [Info] Dependencies not found, installing...
    echo.
    call npm install
    echo.
    echo [Done] Dependencies installed!
    echo.
)

echo [Select Mode]
echo.
echo  1. Web Mode - Open in browser
echo  2. Desktop App - Run in standalone window
echo.
set /p choice="Select mode (1/2, default 2): "

if "%choice%"=="1" goto WEB_MODE
if "%choice%"=="2" goto ELECTRON_MODE
goto ELECTRON_MODE

:WEB_MODE
echo.
echo [Starting] Launching development server...
echo.
start cmd /k "npm run dev"
timeout /t 3 >nul
start http://localhost:3000
goto END

:ELECTRON_MODE
echo.
echo [Starting] Launching desktop application...
echo.
echo Note: Vite dev server will start automatically
echo.
start /B cmd /c "npm run dev"
timeout /t 5 >nul
start npm run electron:dev
goto END

:END
echo.
echo [Done] Application launched!
echo.
pause
