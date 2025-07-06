#!/bin/bash

echo "🚀 Iniciando Sistema de Gerenciamento de Funcionários..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Função para instalar dependências se necessário
install_if_needed() {
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências..."
        npm install
    else
        echo "✅ Dependências já instaladas"
    fi
}

# Iniciar backend
echo "🔧 Preparando Backend..."
cd backend
install_if_needed
echo "🚀 Iniciando servidor backend..."
npm run dev &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend inicializar
sleep 3

# Iniciar frontend
echo ""
echo "🎨 Preparando Frontend..."
cd frontend
install_if_needed
echo "🚀 Iniciando aplicação frontend..."
npm start &
FRONTEND_PID=$!
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

# Aguardar interrupção
trap "echo ''; echo '🛑 Parando sistema...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT

# Manter o script rodando
wait