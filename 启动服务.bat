@echo off
chcp 65001 >nul
title 成长小英雄

echo.
echo ======================================
echo       成长小英雄 - 启动程序
echo ======================================
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [提示] 检测到依赖未安装，正在自动安装...
    echo.
    call npm install
    echo.
    echo [完成] 依赖安装完成！
    echo.
)

echo [模式选择]
echo.
echo  1. 网页模式 - 在浏览器中打开（需要先启动开发服务器）
echo  2. 桌面应用 - 独立窗口运行
echo.
set /p choice="请选择模式 (1/2，默认2): "

if "%choice%"=="1" goto WEB_MODE
if "%choice%"=="2" goto ELECTRON_MODE
goto ELECTRON_MODE

:WEB_MODE
echo.
echo [启动] 正在启动开发服务器...
echo.
start cmd /k "npm run dev"
timeout /t 3 >nul
start http://localhost:3000
goto END

:ELECTRON_MODE
echo.
echo [启动] 正在启动桌面应用...
echo.
echo 提示：首次运行会自动打开Vite开发服务器
echo.
start /B cmd /c "npm run dev"
timeout /t 5 >nul
start npm run electron:dev
goto END

:END
echo.
echo [完成] 程序已启动！
echo.
pause
