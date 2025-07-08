# 🚀 Setup Rápido PostgreSQL Railway

## ✅ O que foi configurado:

1. **Dependências instaladas**: `pg`, `dotenv`
2. **Configuração unificada**: Detecta automaticamente SQLite vs PostgreSQL
3. **Variáveis de ambiente**: Arquivo `.env` criado com dados do Railway
4. **Scripts de migração**: Para transferir dados do SQLite
5. **Scripts de teste**: Para verificar conexão

## 🏃‍♂️ Próximos passos:

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Testar conexão PostgreSQL
```bash
npm run test:db
```

### 3. Migrar dados (se necessário)
```bash
npm run migrate:db
```

### 4. Executar o servidor
```bash
cd backend
npm start
```

## 🔍 Verificar se funcionou:

1. **Health Check**: `http://localhost:3001/health`
2. **Deve retornar**: `"database": "postgres"`

## 📁 Arquivos criados/modificados:

- ✅ `backend/database-postgres.js` - Configuração PostgreSQL
- ✅ `backend/database-config.js` - Configuração unificada
- ✅ `backend/server.js` - Servidor atualizado com suporte PostgreSQL
- ✅ `backend/test-postgres.js` - Script de teste
- ✅ `backend/migrate-to-postgres.js` - Script de migração
- ✅ `.env` - Variáveis de ambiente do Railway
- ✅ `backend/package.json` - Dependências atualizadas

## 🔐 Dados de acesso padrão:

- **Email**: admin@sistema.com
- **Senha**: admin123

## ⚠️ IMPORTANTE:

1. **Altere o JWT_SECRET** em produção!
2. **Não commite o arquivo .env** (já está no .gitignore)
3. **Configure as variáveis no Railway** para produção

## 🆘 Se der erro:

1. Verifique se o Railway está ativo
2. Execute: `npm run test:db`
3. Verifique as variáveis no arquivo `.env`