#!/bin/bash

echo "🧪 Executando Teste Local do Railway Build"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
print_status "Verificando Node.js..."
if command -v node &> /dev/null; then
    print_success "Node.js encontrado: $(node --version)"
else
    print_error "Node.js não encontrado!"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    print_success "npm encontrado: $(npm --version)"
else
    print_error "npm não encontrado!"
    exit 1
fi

# Verificar arquivos essenciais
echo ""
print_status "🔍 Verificando arquivos essenciais..."

if [ -f "server-production.js" ]; then
    print_success "server-production.js encontrado"
else
    print_error "server-production.js não encontrado!"
    exit 1
fi

if [ -f "package.json" ]; then
    print_success "package.json encontrado"
else
    print_error "package.json não encontrado!"
    exit 1
fi

if [ -f "nixpacks.toml" ]; then
    print_success "nixpacks.toml encontrado"
else
    print_warning "nixpacks.toml não encontrado (opcional)"
fi

# Verificar estrutura de diretórios
if [ -d "backend" ]; then
    print_success "Diretório backend encontrado"
else
    print_error "Diretório backend não encontrado!"
    exit 1
fi

if [ -d "frontend" ]; then
    print_success "Diretório frontend encontrado"
else
    print_error "Diretório frontend não encontrado!"
    exit 1
fi

# Verificar package.json do backend
if [ -f "backend/package.json" ]; then
    print_success "backend/package.json encontrado"
else
    print_error "backend/package.json não encontrado!"
    exit 1
fi

# Verificar package.json do frontend
if [ -f "frontend/package.json" ]; then
    print_success "frontend/package.json encontrado"
else
    print_error "frontend/package.json não encontrado!"
    exit 1
fi

echo ""
print_status "📦 Verificando dependências..."

# Verificar se node_modules existem
if [ -d "backend/node_modules" ]; then
    print_success "Backend node_modules encontrado"
else
    print_warning "Backend node_modules não encontrado - será instalado no deploy"
fi

if [ -d "frontend/node_modules" ]; then
    print_success "Frontend node_modules encontrado"
else
    print_warning "Frontend node_modules não encontrado - será instalado no deploy"
fi

echo ""
print_status "🏗️ Testando build do frontend..."

# Ir para o diretório frontend e tentar build
cd frontend

print_status "Executando npm run build..."
if npm run build; then
    print_success "Build do frontend concluído com sucesso!"
    
    # Verificar se build foi criado
    if [ -d "build" ]; then
        print_success "Diretório build criado"
        BUILD_SIZE=$(du -sh build/ | cut -f1)
        print_success "Tamanho do build: $BUILD_SIZE"
        
        # Listar alguns arquivos do build
        echo ""
        print_status "📁 Conteúdo do build:"
        ls -la build/ | head -10
        
        if [ -d "build/static" ]; then
            print_success "Arquivos estáticos criados"
        fi
        
    else
        print_error "Diretório build não foi criado!"
        exit 1
    fi
else
    print_error "Falha no build do frontend!"
    print_error "Verifique os erros acima"
    exit 1
fi

cd ..

echo ""
print_status "✅ Verificação final..."

# Verificar se tudo está pronto para deploy
READY=true

if [ ! -f "server-production.js" ]; then
    print_error "❌ server-production.js ausente"
    READY=false
fi

if [ ! -f "package.json" ]; then
    print_error "❌ package.json ausente"
    READY=false
fi

if [ ! -d "frontend/build" ]; then
    print_error "❌ frontend/build ausente"
    READY=false
fi

if [ ! -d "backend" ]; then
    print_error "❌ diretório backend ausente"
    READY=false
fi

if [ "$READY" = true ]; then
    echo ""
    echo "🎉 TESTE LOCAL PASSOU!"
    echo "====================="
    echo ""
    print_success "✅ Todos os arquivos necessários estão presentes"
    print_success "✅ Build do frontend foi bem-sucedido"
    print_success "✅ Estrutura está correta para deploy"
    echo ""
    print_status "🚀 Próximos passos:"
    echo "1. git add ."
    echo "2. git commit -m 'fix: corrigir configuração Railway'"
    echo "3. git push origin main"
    echo "4. Acompanhar deploy no Railway"
    echo ""
    print_success "Projeto pronto para deploy no Railway! 🚂"
else
    echo ""
    print_error "❌ TESTE LOCAL FALHOU!"
    print_error "Corrija os problemas acima antes de fazer deploy"
    exit 1
fi