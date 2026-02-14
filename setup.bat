@echo off
REM Setup script for MERN Feedback Hub Application (Windows)

echo 🚀 MERN Feedback Hub - Setup Script (Windows)
echo =============================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14+ from https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected

REM Install server dependencies
echo.
echo 📦 Installing server dependencies...
cd server
call npm install

if %errorlevel% neq 0 (
    echo ❌ Server installation failed
    exit /b 1
)

cd ..
echo ✅ Server dependencies installed

REM Install client dependencies
echo.
echo 📦 Installing client dependencies...
cd client
call npm install

if %errorlevel% neq 0 (
    echo ❌ Client installation failed
    exit /b 1
)

cd ..
echo ✅ Client dependencies installed

REM Create .env file
echo.
echo ⚙️  Setting up environment variables...
if not exist "server\.env" (
    copy "server\.env.example" "server\.env"
    echo ✅ Created server\.env file
    echo ⚠️  Please update server\.env with your MongoDB URI:
    echo    MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-fairness-app
) else (
    echo ✅ server\.env already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo   1. Update server\.env with your MongoDB connection string
echo   2. Open two terminals:
echo      Terminal 1: cd server ^&^& npm run dev
echo      Terminal 2: cd client ^&^& npm start
echo.
echo Then visit http://localhost:3000 in your browser
