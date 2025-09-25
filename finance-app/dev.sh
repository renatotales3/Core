#!/bin/bash

# Finance App Development Script
# Usage: ./dev.sh [command]

set -e

PROJECT_DIR="/workspaces/Core/finance-app"
cd "$PROJECT_DIR"

echo "🏦 Finance App Development Tool"
echo "================================"

case "${1:-start}" in
  "start")
    echo "🚀 Starting Expo development server..."
    npx expo start
    ;;
  
  "web")
    echo "🌐 Starting Expo for web..."
    npx expo start --web
    ;;
    
  "clear")
    echo "🧹 Clearing cache and starting..."
    npx expo start --clear
    ;;
    
  "tunnel")
    echo "🌐 Starting with tunnel (for external access)..."
    npx expo start --tunnel
    ;;
    
  "install")
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    ;;
    
  "reset")
    echo "🔄 Resetting project (clearing cache, reinstalling deps)..."
    npx expo start --clear
    rm -rf node_modules
    npm install
    echo "✅ Project reset complete!"
    ;;
    
  "build:web")
    echo "🏗️ Building for web..."
    npx expo export --platform web
    echo "✅ Web build complete!"
    ;;
    
  "type-check")
    echo "🔍 Running TypeScript type check..."
    npx tsc --noEmit
    echo "✅ Type check complete!"
    ;;
    
  "info")
    echo "📱 Project Information:"
    echo "  - Name: Finance App"
    echo "  - Platform: React Native + Expo"
    echo "  - Web URL: http://localhost:8081"
    echo "  - Mobile: Scan QR code with Expo Go"
    echo ""
    echo "🎯 Available commands:"
    echo "  ./dev.sh start     - Start development server"
    echo "  ./dev.sh web       - Start web-only server"
    echo "  ./dev.sh clear     - Clear cache and start"
    echo "  ./dev.sh tunnel    - Start with tunnel"
    echo "  ./dev.sh install   - Install dependencies"
    echo "  ./dev.sh reset     - Reset project"
    echo "  ./dev.sh build:web - Build for web"
    echo "  ./dev.sh type-check- Check TypeScript"
    echo "  ./dev.sh info      - Show this information"
    ;;
    
  *)
    echo "❌ Unknown command: $1"
    echo "Run './dev.sh info' for available commands"
    exit 1
    ;;
esac