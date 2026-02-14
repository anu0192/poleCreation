#!/bin/bash

# Setup script for MERN Feedback Hub Application

echo "🚀 MERN Feedback Hub - Setup Script"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Server installation failed"
    exit 1
fi

cd ..
echo "✅ Server dependencies installed"

# Install client dependencies
echo ""
echo "📦 Installing client dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Client installation failed"
    exit 1
fi

cd ..
echo "✅ Client dependencies installed"

# Create .env file
echo ""
echo "⚙️  Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env file"
    echo "⚠️  Please update server/.env with your MongoDB URI:"
    echo "   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-fairness-app"
else
    echo "✅ server/.env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Update server/.env with your MongoDB connection string"
echo "  2. Open two terminals:"
echo "     Terminal 1: cd server && npm run dev"
echo "     Terminal 2: cd client && npm start"
echo ""
echo "Then visit http://localhost:3000 in your browser"
