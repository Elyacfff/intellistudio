@echo off
chcp 65001 >nul
echo ========================================
echo    IntelliStudio - 一键启动器
echo ========================================
echo.

echo [1/3] 检查环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 npm
    pause
    exit /b 1
)
echo ✓ npm 已安装
echo.

echo [2/3] 检查依赖...
if not exist "node_modules\" (
    echo 首次运行，正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
    echo ✓ 依赖安装完成
) else (
    echo ✓ 依赖已存在
)
echo.

echo [3/3] 启动应用...
echo.
echo ========================================
echo    应用即将启动！
echo    请在浏览器中打开: http://localhost:3000
echo ========================================
echo.

call npm run dev

pause