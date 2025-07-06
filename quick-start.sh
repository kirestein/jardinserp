#!/bin/bash

echo "🚀 Iniciando Sistema de Funcionários - Instalação Rápida"
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js não encontrado!"
    echo "Por favor, instale o Node.js primeiro: https://nodejs.org/"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm não encontrado!"
    exit 1
fi

echo ""
echo "📦 Instalando dependências..."

# Backend
echo "🔧 Backend..."
cd backend
npm install --no-optional --legacy-peer-deps 2>/dev/null || npm install --force
cd ..

# Frontend  
echo "🎨 Frontend..."
cd frontend
npm install --no-optional --legacy-peer-deps 2>/dev/null || npm install --force
cd ..

echo ""
echo "🚀 Iniciando serviços..."

# Iniciar backend
echo "🔧 Iniciando backend na porta 3001..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

sleep 3

# Iniciar frontend
echo "🎨 Iniciando frontend na porta 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Sistema iniciado!"
echo ""
echo "📍 Acesse: http://localhost:3000"
echo "🔐 Login: admin@sistema.com / admin123"
echo ""
echo "Pressione Ctrl+C para parar"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Parando sistema..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT
wait