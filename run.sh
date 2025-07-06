#!/bin/bash

echo "🚀 Configurando e Iniciando Sistema de Gerenciamento de Funcionários..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Tentando instalar via nvm..."
    
    # Verificar se nvm está disponível
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        nvm use node 2>/dev/null || nvm install node
    else
        echo "❌ Por favor, instale o Node.js primeiro."
        echo "   Download: https://nodejs.org/"
        exit 1
    fi
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do backend"
    exit 1
fi
echo "✅ Dependências do backend instaladas"
cd ..

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do frontend"
    exit 1
fi
echo "✅ Dependências do frontend instaladas"
cd ..

echo ""
echo "🚀 Iniciando o sistema..."
echo ""

# Iniciar backend em background
echo "🔧 Iniciando servidor backend..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"
cd ..

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Iniciar frontend
echo "🎨 Iniciando aplicação frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "🎉 Sistema iniciado com sucesso!"
echo ""
echo "📍 URLs de Acesso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "🔐 Dados de Login Padrão:"
echo "   Email: admin@sistema.com"
echo "   Senha: admin123"
echo ""
echo "⚠️  Para parar o sistema, pressione Ctrl+C"
echo ""

# Função para cleanup quando script for interrompido
cleanup() {
    echo ""
    echo "🛑 Parando sistema..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Sistema parado"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Aguardar até ser interrompido
echo "💡 Aguardando... (Pressione Ctrl+C para parar)"
wait