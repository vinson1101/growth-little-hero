@echo off
title Growth Little Hero

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo Starting web server...
start /B cmd /c "npm run dev"

timeout /t 5 /nobreak >nul

echo Starting desktop application...
start npm run electron:dev

timeout /t 2 /nobreak >nul

echo.
echo ==========================================
echo    App Started Successfully!
echo ==========================================
echo.
echo The application is running in a window
echo.
pause
