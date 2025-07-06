#!/bin/bash

echo "🧪 Testando Frontend com Testes Simples"
echo "======================================="

cd frontend

echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "⚠️ node_modules não encontrado, instalando..."
    npm install
fi

echo "🧪 Executando testes..."
npm test -- --coverage --watchAll=false --passWithNoTests

echo "✅ Teste concluído!"