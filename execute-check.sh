#!/bin/bash

echo "🔍 Executando verificação do sistema..."
echo ""

cd /home/kir3/sistema-funcionarios

# Verificar se Node.js está disponível
if command -v node &> /dev/null; then
    echo "✅ Node.js encontrado: $(node --version)"
    echo ""
    
    # Executar verificação
    node check-system.js
    
else
    echo "❌ Node.js não encontrado!"
    echo ""
    echo "📋 Para instalar Node.js:"
    echo "   1. Baixe de: https://nodejs.org/"
    echo "   2. Ou use nvm se disponível:"
    echo "      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "      nvm install node"
fi