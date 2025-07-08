# 🚂 Railway Multi-Environment Setup

## 🎯 Estratégia de Ambientes

### 🔴 **PRODUCTION**
- **Banco**: Atual (railway)
- **Uso**: Dados reais, usuários finais
- **Deploy**: Branch `main`
- **URL**: `https://jardinserp-production.up.railway.app`

### 🟡 **STAGING** 
- **Banco**: Novo banco PostgreSQL
- **Uso**: Testes finais antes da produção
- **Deploy**: Branch `staging`
- **URL**: `https://jardinserp-staging.up.railway.app`

### 🟢 **DEVELOPMENT**
- **Banco**: Novo banco PostgreSQL
- **Uso**: Sandbox, testes, desenvolvimento
- **Deploy**: Branch `development`
- **URL**: `https://jardinserp-dev.up.railway.app`

## 🚀 Como Configurar no Railway

### 1. Criar Novos Serviços
```bash
# No Railway Dashboard:
1. Criar novo serviço "jardinserp-staging"
2. Criar novo serviço "jardinserp-development"
3. Cada um com seu próprio banco PostgreSQL
```

### 2. Configurar Variáveis por Ambiente

#### 🔴 Production (atual)
```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu@interchange.proxy.rlwy.net:20484/railway
JWT_SECRET=production_secret_super_seguro
```

#### 🟡 Staging (novo)
```env
NODE_ENV=staging
DATABASE_URL=postgresql://postgres:NOVA_SENHA_STAGING@novo-host:porta/railway
JWT_SECRET=staging_secret_diferente
```

#### 🟢 Development (novo)
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:NOVA_SENHA_DEV@novo-host:porta/railway
JWT_SECRET=dev_secret_simples
```

### 3. Configurar Deploy por Branch
```yaml
# railway.toml
[environments.production]
branch = "main"

[environments.staging]
branch = "staging"

[environments.development]
branch = "development"
```

## 🔧 Configuração Local

### Arquivo .env por Ambiente
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://postgres:WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu@interchange.proxy.rlwy.net:20484/railway

# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://postgres:STAGING_CREDENTIALS@staging-host:porta/railway

# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://postgres:DEV_CREDENTIALS@dev-host:porta/railway
```

### Scripts no package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "start:prod": "NODE_ENV=production node server.js",
    "start:staging": "NODE_ENV=staging node server.js",
    "start:dev": "NODE_ENV=development node server.js",
    "test:prod": "NODE_ENV=production node test-postgres.js",
    "test:staging": "NODE_ENV=staging node test-postgres.js",
    "test:dev": "NODE_ENV=development node test-postgres.js"
  }
}
```

## 🎯 Vantagens desta Abordagem

### ✅ **Isolamento Completo**
- Cada ambiente tem seu próprio banco
- Dados não se misturam
- Testes seguros

### ✅ **Deploy Automático**
- Push para `main` → Production
- Push para `staging` → Staging
- Push para `development` → Development

### ✅ **Configuração Simples**
- Apenas variáveis de ambiente diferentes
- Mesmo código, ambientes diferentes

### ✅ **Custo Eficiente**
- Railway oferece múltiplos serviços
- Sem necessidade de infraestrutura local

## 🔄 Workflow de Desenvolvimento

```mermaid
graph LR
    A[Local Dev] --> B[Push to development]
    B --> C[Deploy to Dev Environment]
    C --> D[Testes no Dev]
    D --> E[Merge to staging]
    E --> F[Deploy to Staging]
    F --> G[Testes Finais]
    G --> H[Merge to main]
    H --> I[Deploy to Production]
```

## 🛡️ Dados de Teste

### Usuários de Teste (Development)
```sql
-- Usuários para sandbox
INSERT INTO usuarios (nome, email, senha, tipo) VALUES 
('Admin Dev', 'admin@dev.com', 'hash_senha', 'admin'),
('Teste User', 'teste@dev.com', 'hash_senha', 'user'),
('Demo User', 'demo@dev.com', 'hash_senha', 'user');
```

### Dados Fictícios (Development)
```sql
-- Funcionários de teste
INSERT INTO funcionarios (nome, email, cpf, data_admissao) VALUES 
('João Teste', 'joao@teste.com', '000.000.000-01', '2024-01-01'),
('Maria Demo', 'maria@demo.com', '000.000.000-02', '2024-01-02'),
('Pedro Sandbox', 'pedro@sandbox.com', '000.000.000-03', '2024-01-03');
```

## 🎮 Como Usar

### Para Desenvolvimento
```bash
# Usar ambiente de desenvolvimento
export NODE_ENV=development
npm run start:dev

# Ou localmente com SQLite
# (sem variável DATABASE_URL)
npm start
```

### Para Testes de Staging
```bash
# Usar ambiente de staging
export NODE_ENV=staging
npm run start:staging
```

### Para Produção
```bash
# Usar ambiente de produção
export NODE_ENV=production
npm run start:prod
```