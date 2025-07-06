#!/bin/bash

# Script para testar o build local
echo "🔧 Testando build local..."

# Verificar se estamos na raiz do projeto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto"
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf frontend/build
rm -rf backend/node_modules/.cache
rm -rf frontend/node_modules/.cache

# Instalar dependências
echo "📦 Instalando dependências do backend..."
cd backend && npm install

echo "📦 Instalando dependências do frontend..."
cd ../frontend && npm install

# Verificar estrutura
echo "📁 Verificando estrutura..."
ls -la public/
echo "index.html exists:" && ls -la public/index.html

# Tentar build
echo "🏗️ Construindo frontend..."
npm run build

# Verificar resultado
if [ -d "build" ]; then
    echo "✅ Build concluído com sucesso!"
    echo "📊 Conteúdo do build:"
    ls -la build/
else
    echo "❌ Build falhou!"
    exit 1
fi

echo "🎉 Teste local concluído!"
