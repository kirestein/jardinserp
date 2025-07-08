# Configuração do Banco de Dados PostgreSQL (Railway)

Este projeto foi configurado para usar PostgreSQL em produção (Railway) e SQLite em desenvolvimento local.

## 🗄️ Configuração Automática

O sistema detecta automaticamente qual banco usar baseado nas variáveis de ambiente:

- **PostgreSQL**: Se `DATABASE_URL` ou `DATABASE_PUBLIC_URL` estiver definida
- **SQLite**: Se nenhuma variável de PostgreSQL estiver definida (desenvolvimento local)

## 🚀 Configuração do Railway

### Dados de Conexão
```
DATABASE_PUBLIC_URL: postgresql://postgres:WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu@interchange.proxy.rlwy.net:20484/railway
PGHOST: interchange.proxy.rlwy.net
PGPORT: 20484
PGUSER: postgres
PGPASSWORD: WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu
POSTGRES_DB: railway
```

### Variáveis de Ambiente (.env)
```bash
# Configurações do Banco PostgreSQL (Railway)
DATABASE_PUBLIC_URL=postgresql://postgres:WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu@interchange.proxy.rlwy.net:20484/railway

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_mude_obrigatoriamente_em_producao
NODE_ENV=production
```

## 📦 Dependências Instaladas

- `pg`: Driver PostgreSQL para Node.js
- `dotenv`: Carregamento de variáveis de ambiente
- `sqlite3`: Mantido para desenvolvimento local

## 🔧 Scripts Úteis

### Testar Conexão PostgreSQL
```bash
cd backend
node test-postgres.js
```

### Migrar Dados do SQLite para PostgreSQL
```bash
cd backend
node migrate-to-postgres.js
```

### Instalar Dependências
```bash
cd backend
npm install
```

## 🏃‍♂️ Como Executar

### Desenvolvimento Local (SQLite)
```bash
cd backend
npm start
```

### Produção (PostgreSQL)
```bash
cd backend
# Certifique-se que o arquivo .env está configurado
npm start
```

## 📋 Estrutura das Tabelas

### Usuários
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cargos
```sql
CREATE TABLE cargos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  carga_horaria INTEGER NOT NULL,
  tipo_pagamento VARCHAR(20) CHECK(tipo_pagamento IN ('salario', 'hora')),
  valor DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Funcionários
```sql
CREATE TABLE funcionarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE NOT NULL,
  data_nascimento DATE,
  endereco TEXT,
  cargo_id INTEGER REFERENCES cargos(id),
  data_admissao DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo' CHECK(status IN ('ativo', 'inativo')),
  foto VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Dados Padrão

### Usuário Admin
- **Email**: admin@sistema.com
- **Senha**: admin123
- **Tipo**: admin

### Cargos de Exemplo
- Desenvolvedor (40h, salário: R$ 5.000,00)
- Analista (40h, salário: R$ 4.000,00)
- Estagiário (20h, hora: R$ 15,00)

## 🚨 Segurança

⚠️ **IMPORTANTE**: Altere o `JWT_SECRET` em produção!

```bash
# Gerar um JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🔍 Verificação de Status

Acesse: `http://localhost:3001/health`

Retorna:
```json
{
  "status": "OK",
  "database": "postgres",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### Erro de Conexão PostgreSQL
1. Verifique se as variáveis de ambiente estão corretas
2. Execute `node test-postgres.js` para testar a conexão
3. Verifique se o Railway está ativo

### Erro de SSL
Se houver problemas de SSL, adicione ao `.env`:
```bash
PGSSLMODE=require
```

### Migração de Dados
Se você tem dados no SQLite e quer migrar:
```bash
node migrate-to-postgres.js
```