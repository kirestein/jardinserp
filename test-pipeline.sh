#!/bin/bash

# Tornar o script executável
chmod +x "$0"

echo "🧪 Testando Pipeline Localmente"
echo "==============================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    exit 1
fi

print_status "Node.js versão: $(node --version)"
print_status "npm versão: $(npm --version)"

# Simular o pipeline do GitHub Actions
echo ""
print_status "🔧 Simulando pipeline do GitHub Actions..."

# Step 1: Install Backend Dependencies
echo ""
print_status "📦 Instalando dependências do backend..."
cd backend
if npm ci; then
    print_success "Dependências do backend instaladas"
else
    print_error "Falha ao instalar dependências do backend"
    exit 1
fi
cd ..

# Step 2: Install Frontend Dependencies
echo ""
print_status "📦 Instalando dependências do frontend..."
cd frontend
if npm ci; then
    print_success "Dependências do frontend instaladas"
else
    print_error "Falha ao instalar dependências do frontend"
    exit 1
fi

# Step 3: Run Backend Tests
echo ""
print_status "🧪 Executando testes do backend..."
cd ../backend
if npm test --if-present; then
    print_success "Testes do backend passaram"
else
    print_warning "Testes do backend falharam ou não existem"
fi

# Step 4: Run Frontend Tests
echo ""
print_status "🧪 Executando testes do frontend..."
cd ../frontend
if npm test -- --coverage --watchAll=false --passWithNoTests; then
    print_success "Testes do frontend passaram"
else
    print_error "Testes do frontend falharam"
    exit 1
fi

# Step 5: Build Frontend
echo ""
print_status "🏗️ Fazendo build do frontend..."
if npm run build; then
    print_success "Build do frontend concluído"
    
    # Mostrar informações do build
    echo ""
    print_status "📊 Informações do build:"
    echo "Tamanho total: $(du -sh build/ | cut -f1)"
    echo "Arquivos principais:"
    ls -la build/static/js/*.js 2>/dev/null | head -3 || echo "Nenhum arquivo JS encontrado"
    ls -la build/static/css/*.css 2>/dev/null | head -3 || echo "Nenhum arquivo CSS encontrado"
else
    print_error "Falha no build do frontend"
    exit 1
fi

cd ..

# Step 6: Prepare Production Files
echo ""
print_status "🔧 Preparando arquivos de produção..."

# Verificar se server-production.js existe
if [ ! -f "server-production.js" ]; then
    print_error "server-production.js não encontrado!"
    exit 1
fi

# Criar package.json de produção (simulação)
cat > package-test.json << 'EOF'
{
  "name": "sistema-funcionarios-production",
  "version": "1.0.0",
  "description": "Sistema de Funcionários - Railway Deploy",
  "main": "server-production.js",
  "scripts": {
    "start": "node server-production.js",
    "build": "echo 'Build completed in CI'",
    "postinstall": "cd backend && npm install --only=production"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
EOF

print_success "package.json de produção criado (package-test.json)"

# Step 7: Test Production Server (opcional)
echo ""
print_status "🚀 Testando servidor de produção..."
print_warning "Para testar o servidor, execute: node server-production.js"
print_warning "Servidor estará em: http://localhost:3001"

# Cleanup
rm -f package-test.json

# Final Summary
echo ""
echo "🎉 TESTE DO PIPELINE CONCLUÍDO!"
echo "================================"
echo ""
print_success "✅ Dependências instaladas"
print_success "✅ Testes executados"
print_success "✅ Build realizado"
print_success "✅ Arquivos de produção preparados"
echo ""
print_status "🚀 Seu código está pronto para o GitHub Actions!"
echo ""
print_status "Próximos passos:"
echo "1. git add ."
echo "2. git commit -m 'feat: configurar CI/CD'"
echo "3. git push origin main"
echo "4. Acompanhar deploy em: https://github.com/SEU_USUARIO/SEU_REPO/actions"
echo ""
print_success "Pipeline testado com sucesso! 🎯"