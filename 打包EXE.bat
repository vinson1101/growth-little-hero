@echo off
chcp 65001 >nul
title 成长小英雄 - 打包程序

echo.
echo ======================================
echo       成长小英雄 - 打包成EXE
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

echo [打包] 正在打包项目...
echo.
echo 1. 构建Web资源...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [错误] 构建失败！
    pause
    exit /b 1
)

echo.
echo 2. 使用Electron打包成EXE...
call npm run electron:build
if %errorlevel% neq 0 (
    echo.
    echo [错误] 打包失败！
    pause
    exit /b 1
)

echo.
echo ======================================
echo [成功] 打包完成！
echo.
echo  EXE文件位置: release\成长小英雄 Setup 1.0.0.exe
echo.
echo  双击该文件即可安装应用
echo ======================================
echo.

pause
