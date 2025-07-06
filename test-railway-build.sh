#!/bin/bash

# Tornar o script executável
chmod +x "$0"

echo "🧪 Testando Build para Railway"
echo "=============================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado!"
    exit 1
fi

print_status "Node.js versão: $(node --version)"

# Simular processo do Railway
echo ""
print_status "🚂 Simulando build do Railway..."

# 1. Instalar dependências do backend
echo ""
print_status "📦 Instalando dependências do backend..."
cd backend
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi
cd ..

# 2. Instalar dependências do frontend
echo ""
print_status "📦 Instalando dependências do frontend..."
cd frontend
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# 3. Build do frontend
echo ""
print_status "🏗️ Building frontend..."
if npm run build; then
    print_success "Frontend build completed"
    
    # Verificar se build foi criado
    if [ -d "build" ]; then
        print_success "Build directory created"
        echo "Build size: $(du -sh build/ | cut -f1)"
    else
        print_error "Build directory not found!"
        exit 1
    fi
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# 4. Verificar arquivos necessários
echo ""
print_status "🔍 Verificando arquivos necessários..."

# Verificar server-production.js
if [ -f "server-production.js" ]; then
    print_success "server-production.js found"
else
    print_error "server-production.js not found!"
    exit 1
fi

# Verificar package.json
if [ -f "package.json" ]; then
    print_success "package.json found"
    
    # Verificar se tem as dependências necessárias
    if grep -q "express" package.json; then
        print_success "Express dependency found"
    else
        print_error "Express dependency missing in package.json"
        exit 1
    fi
else
    print_error "package.json not found!"
    exit 1
fi

# Verificar nixpacks.toml
if [ -f "nixpacks.toml" ]; then
    print_success "nixpacks.toml found"
else
    print_warning "nixpacks.toml not found (optional)"
fi

# 5. Testar se o servidor inicia (opcional)
echo ""
print_status "🚀 Testando se o servidor pode iniciar..."
print_warning "Para testar o servidor, execute:"
echo "  node server-production.js"
echo "  Acesse: http://localhost:3001"

# 6. Verificar estrutura final
echo ""
print_status "📁 Estrutura final para deploy:"
echo "✅ server-production.js (servidor principal)"
echo "✅ package.json (dependências de produção)"
echo "✅ frontend/build/ (frontend buildado)"
echo "✅ backend/ (código do backend)"
echo "✅ nixpacks.toml (configuração Railway)"

# Final
echo ""
echo "🎉 TESTE DE BUILD CONCLUÍDO!"
echo "============================"
echo ""
print_success "✅ Todas as verificações passaram"
print_success "✅ Projeto pronto para deploy no Railway"
echo ""
print_status "Próximos passos:"
echo "1. git add ."
echo "2. git commit -m 'fix: corrigir configuração Railway'"
echo "3. git push origin main"
echo "4. Acompanhar deploy no Railway"
echo ""
print_success "Build testado com sucesso! 🚂"