#!/bin/bash

# Tornar o script executável
chmod +x "$0"

echo "🚀 Preparando Sistema de Funcionários para Deploy"
echo "=================================================="

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

# Passo 1: Instalar dependências do backend
print_status "Instalando dependências do backend..."
cd backend
if npm install; then
    print_success "Dependências do backend instaladas"
else
    print_error "Falha ao instalar dependências do backend"
    exit 1
fi
cd ..

# Passo 2: Instalar dependências do frontend
print_status "Instalando dependências do frontend..."
cd frontend
if npm install; then
    print_success "Dependências do frontend instaladas"
else
    print_error "Falha ao instalar dependências do frontend"
    exit 1
fi

# Passo 3: Build do frontend
print_status "Fazendo build do frontend para produção..."
if npm run build; then
    print_success "Build do frontend concluído"
else
    print_error "Falha no build do frontend"
    exit 1
fi
cd ..

# Passo 4: Verificar se build foi criado
if [ -d "frontend/build" ]; then
    print_success "Diretório de build encontrado"
else
    print_error "Diretório de build não foi criado"
    exit 1
fi

# Passo 5: Criar package.json de produção
print_status "Criando package.json de produção..."
cat > package.json << 'EOF'
{
  "name": "sistema-funcionarios-production",
  "version": "1.0.0",
  "description": "Sistema de Funcionários - Versão de Produção",
  "main": "server-production.js",
  "scripts": {
    "start": "node server-production.js",
    "postinstall": "cd backend && npm install"
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
    "node": ">=16.0.0"
  }
}
EOF

print_success "package.json de produção criado"

# Passo 6: Testar servidor de produção (opcional)
print_warning "Para testar localmente, execute: npm start"
print_warning "O servidor estará disponível em: http://localhost:3001"

# Passo 7: Instruções finais
echo ""
echo "🎉 PREPARAÇÃO CONCLUÍDA COM SUCESSO!"
echo "===================================="
echo ""
print_status "Próximos passos para deploy:"
echo "1. 📁 Fazer commit e push para GitHub:"
echo "   git add ."
echo "   git commit -m 'feat: preparar para deploy'"
echo "   git push origin main"
echo ""
echo "2. 🚀 Escolher plataforma de deploy:"
echo "   • Railway (recomendado): https://railway.app"
echo "   • Render: https://render.com"
echo ""
echo "3. 🔧 Configurar variáveis de ambiente:"
echo "   JWT_SECRET=sua_chave_super_secreta_aqui"
echo "   NODE_ENV=production"
echo ""
echo "4. 📖 Consultar guia detalhado:"
echo "   cat DEPLOY-GUIDE.md"
echo ""
print_success "Sistema pronto para deploy! 🚀"