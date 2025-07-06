#!/bin/bash

echo "🔍 TESTE EXAUSTIVO DO PIPELINE CI/CD"
echo "===================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Contadores
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0
CRITICAL_ISSUES=0

print_test() {
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "${BLUE}[TEST $TESTS_TOTAL]${NC} $1"
}

print_success() {
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo -e "${GREEN}[✅ PASS]${NC} $1"
}

print_fail() {
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo -e "${RED}[❌ FAIL]${NC} $1"
}

print_critical() {
    CRITICAL_ISSUES=$((CRITICAL_ISSUES + 1))
    echo -e "${RED}[🚨 CRITICAL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠️ WARNING]${NC} $1"
}

print_info() {
    echo -e "${PURPLE}[ℹ️ INFO]${NC} $1"
}

# Função para executar comando e capturar resultado
run_test() {
    local test_name="$1"
    local command="$2"
    local expect_success="$3"  # true/false
    
    print_test "$test_name"
    
    if eval "$command" >/dev/null 2>&1; then
        if [ "$expect_success" = "true" ]; then
            print_success "$test_name"
            return 0
        else
            print_fail "$test_name (expected to fail but passed)"
            return 1
        fi
    else
        if [ "$expect_success" = "false" ]; then
            print_success "$test_name (expected to fail)"
            return 0
        else
            print_fail "$test_name"
            return 1
        fi
    fi
}

echo ""
echo "🔍 FASE 1: VERIFICAÇÃO DE AMBIENTE"
echo "=================================="

# Teste 1: Node.js
print_test "Node.js disponível"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION encontrado"
else
    print_critical "Node.js não encontrado!"
    exit 1
fi

# Teste 2: npm
print_test "npm disponível"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION encontrado"
else
    print_critical "npm não encontrado!"
    exit 1
fi

echo ""
echo "🔍 FASE 2: VERIFICAÇÃO DE ESTRUTURA"
echo "==================================="

# Teste 3: Estrutura de diretórios
print_test "Estrutura de diretórios"
if [ -d "backend" ] && [ -d "frontend" ] && [ -d ".github/workflows" ]; then
    print_success "Estrutura básica OK"
else
    print_critical "Estrutura de diretórios incompleta"
fi

# Teste 4: Arquivos package.json
print_test "Arquivos package.json"
missing_packages=""
[ ! -f "package.json" ] && missing_packages="$missing_packages package.json(raiz)"
[ ! -f "backend/package.json" ] && missing_packages="$missing_packages backend/package.json"
[ ! -f "frontend/package.json" ] && missing_packages="$missing_packages frontend/package.json"

if [ -z "$missing_packages" ]; then
    print_success "Todos os package.json encontrados"
else
    print_critical "package.json faltando: $missing_packages"
fi

# Teste 5: Workflows GitHub Actions
print_test "Workflows GitHub Actions"
missing_workflows=""
[ ! -f ".github/workflows/pr-check.yml" ] && missing_workflows="$missing_workflows pr-check.yml"
[ ! -f ".github/workflows/railway-deploy.yml" ] && missing_workflows="$missing_workflows railway-deploy.yml"

if [ -z "$missing_workflows" ]; then
    print_success "Workflows encontrados"
else
    print_fail "Workflows faltando: $missing_workflows"
fi

echo ""
echo "🔍 FASE 3: VERIFICA��ÃO DE DEPENDÊNCIAS"
echo "======================================"

# Teste 6: Backend dependencies
print_test "Dependências do backend"
cd backend
if [ -f "package-lock.json" ]; then
    if npm ci >/dev/null 2>&1; then
        print_success "Dependências do backend instaladas"
    else
        print_critical "Falha ao instalar dependências do backend"
    fi
else
    print_warning "package-lock.json não encontrado no backend, tentando npm install"
    if npm install >/dev/null 2>&1; then
        print_success "Dependências do backend instaladas (npm install)"
    else
        print_critical "Falha ao instalar dependências do backend"
    fi
fi
cd ..

# Teste 7: Frontend dependencies
print_test "Dependências do frontend"
cd frontend
if [ -f "package-lock.json" ]; then
    if npm ci >/dev/null 2>&1; then
        print_success "Dependências do frontend instaladas"
    else
        print_critical "Falha ao instalar dependências do frontend"
    fi
else
    print_warning "package-lock.json não encontrado no frontend, tentando npm install"
    if npm install >/dev/null 2>&1; then
        print_success "Dependências do frontend instaladas (npm install)"
    else
        print_critical "Falha ao instalar dependências do frontend"
    fi
fi
cd ..

echo ""
echo "🔍 FASE 4: TESTES DE BUILD"
echo "========================="

# Teste 8: Frontend build
print_test "Build do frontend"
cd frontend
if npm run build >/dev/null 2>&1; then
    print_success "Build do frontend concluído"
    
    # Verificar se build foi criado
    if [ -d "build" ]; then
        BUILD_SIZE=$(du -sh build/ | cut -f1)
        print_info "Tamanho do build: $BUILD_SIZE"
        
        # Verificar arquivos críticos
        if [ -f "build/index.html" ]; then
            print_success "index.html gerado"
        else
            print_fail "index.html não encontrado no build"
        fi
        
        if [ -d "build/static" ]; then
            print_success "Arquivos estáticos gerados"
        else
            print_fail "Diretório static não encontrado"
        fi
    else
        print_critical "Diretório build não foi criado"
    fi
else
    print_critical "Falha no build do frontend"
fi
cd ..

echo ""
echo "🔍 FASE 5: TESTES DE TESTE (META!)"
echo "=================================="

# Teste 9: Frontend tests sem --passWithNoTests
print_test "Testes frontend (sem --passWithNoTests)"
cd frontend
if npm test -- --coverage --watchAll=false >/dev/null 2>&1; then
    print_success "Testes passaram (testes existem)"
else
    print_fail "Testes falharam (provavelmente sem testes)"
    print_info "Isso causará falha no pr-check.yml"
fi
cd ..

# Teste 10: Frontend tests com --passWithNoTests
print_test "Testes frontend (com --passWithNoTests)"
cd frontend
if npm test -- --coverage --watchAll=false --passWithNoTests >/dev/null 2>&1; then
    print_success "Testes passaram com --passWithNoTests"
else
    print_fail "Testes falharam mesmo com --passWithNoTests"
fi
cd ..

# Teste 11: Backend tests
print_test "Testes backend"
cd backend
if npm test --if-present >/dev/null 2>&1; then
    print_success "Testes backend passaram (ou não existem)"
else
    print_fail "Testes backend falharam"
fi
cd ..

echo ""
echo "🔍 FASE 6: VERIFICAÇÃO DE ARQUIVOS DE PRODUÇÃO"
echo "=============================================="

# Teste 12: server-production.js
print_test "server-production.js"
if [ -f "server-production.js" ]; then
    print_success "server-production.js encontrado"
else
    print_critical "server-production.js NÃO encontrado (necessário para Railway)"
fi

# Teste 13: nixpacks.toml
print_test "nixpacks.toml"
if [ -f "nixpacks.toml" ]; then
    print_success "nixpacks.toml encontrado"
else
    print_warning "nixpacks.toml não encontrado (recomendado para Railway)"
fi

# Teste 14: .railwayignore
print_test ".railwayignore"
if [ -f ".railwayignore" ]; then
    print_success ".railwayignore encontrado"
else
    print_warning ".railwayignore não encontrado (recomendado para otimização)"
fi

echo ""
echo "🔍 FASE 7: ANÁLISE DE WORKFLOWS"
echo "==============================="

# Teste 15: pr-check.yml analysis
print_test "Análise pr-check.yml"
if grep -q "passWithNoTests" .github/workflows/pr-check.yml; then
    print_success "pr-check.yml tem --passWithNoTests"
else
    print_critical "pr-check.yml NÃO tem --passWithNoTests (causará falha)"
fi

# Teste 16: railway-deploy.yml analysis
print_test "Análise railway-deploy.yml"
if grep -q "passWithNoTests" .github/workflows/railway-deploy.yml; then
    print_success "railway-deploy.yml tem --passWithNoTests"
else
    print_warning "railway-deploy.yml não tem --passWithNoTests"
fi

echo ""
echo "🔍 FASE 8: SIMULAÇÃO DE RAILWAY BUILD"
echo "===================================="

# Teste 17: Simular Railway build process
print_test "Simulação Railway build"
print_info "Simulando: npm install && cd frontend && npm install && npm run build"

# Verificar se package.json raiz tem dependências
if grep -q '"dependencies"' package.json; then
    print_info "package.json raiz tem dependências"
    if npm install >/dev/null 2>&1; then
        print_success "npm install na raiz funcionou"
    else
        print_fail "npm install na raiz falhou"
    fi
else
    print_critical "package.json raiz NÃO tem dependências (Railway falhará)"
fi

echo ""
echo "📊 RELATÓRIO FINAL"
echo "=================="

echo -e "${BLUE}Total de testes:${NC} $TESTS_TOTAL"
echo -e "${GREEN}Testes passaram:${NC} $TESTS_PASSED"
echo -e "${RED}Testes falharam:${NC} $TESTS_FAILED"
echo -e "${RED}Problemas críticos:${NC} $CRITICAL_ISSUES"

echo ""
if [ $CRITICAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 PIPELINE PRONTO PARA PRODUÇÃO!${NC}"
    echo "Todos os problemas críticos foram resolvidos."
else
    echo -e "${RED}🚨 PIPELINE TEM PROBLEMAS CRÍTICOS!${NC}"
    echo "Corrija os $CRITICAL_ISSUES problemas críticos antes do deploy."
fi

echo ""
echo "📋 PRÓXIMAS AÇÕES RECOMENDADAS:"
if [ $CRITICAL_ISSUES -gt 0 ]; then
    echo "1. 🚨 Corrigir problemas críticos identificados"
    echo "2. 🧪 Executar este teste novamente"
    echo "3. 🚀 Fazer deploy apenas após todos os testes passarem"
else
    echo "1. ✅ Fazer commit das correções"
    echo "2. ✅ Criar Pull Request"
    echo "3. ✅ Monitorar GitHub Actions"
    echo "4. ✅ Fazer deploy no Railway"
fi

echo ""
echo "🔍 Para análise detalhada, consulte: COMPREHENSIVE-PIPELINE-ANALYSIS.md"

# Exit code baseado em problemas críticos
exit $CRITICAL_ISSUES