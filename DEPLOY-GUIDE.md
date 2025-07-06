# 🚀 Guia Completo de Deploy - Sistema de Funcionários

## 📋 Resumo da Estratégia

**✅ RECOMENDAÇÃO: Deploy Unificado**
- Frontend e Backend no mesmo servidor
- Mais simples para MVP/POC
- Menos custos e configurações
- Ideal para demonstrações

## 🎯 Plataformas Recomendadas (em ordem de preferência)

### 1. 🥇 RAILWAY (Mais Recomendado)
- **Custo:** $5 crédito mensal (gratuito para MVP)
- **Vantagens:** Muito fácil, suporte completo a Node.js + SQLite
- **URL:** https://railway.app

### 2. 🥈 RENDER
- **Custo:** Plano gratuito disponível
- **Vantagens:** Boa documentação, PostgreSQL gratuito
- **URL:** https://render.com

### 3. 🥉 VERCEL (Limitado)
- **Limitação:** Melhor para frontend, backend tem restrições
- **Uso:** Apenas se quiser separar front/back

## 🔧 Preparação para Deploy

### Passo 1: Preparar o Código
```bash
# 1. Executar script de build
node build-for-deploy.js

# 2. Renomear arquivo de produção
mv package-production.json package.json

# 3. Testar localmente (opcional)
npm start
```

### Passo 2: Configurar Repositório GitHub
```bash
# 1. Inicializar git (se não existir)
git init

# 2. Adicionar arquivos
git add .

# 3. Commit inicial
git commit -m "feat: preparar para deploy"

# 4. Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/sistema-funcionarios.git

# 5. Push para GitHub
git push -u origin main
```

## 🚀 Deploy no Railway (Recomendado)

### Passo 1: Criar Conta
1. Acesse https://railway.app
2. Faça login com GitHub
3. Autorize o Railway

### Passo 2: Criar Projeto
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha o repositório `sistema-funcionarios`
4. Railway detectará automaticamente que é Node.js

### Passo 3: Configurar Variáveis de Ambiente
1. Vá em "Variables"
2. Adicione:
   ```
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui
   NODE_ENV=production
   ```

### Passo 4: Deploy Automático
- Railway fará o deploy automaticamente
- Aguarde alguns minutos
- Acesse a URL fornecida

## 🚀 Deploy no Render (Alternativa)

### Passo 1: Criar Conta
1. Acesse https://render.com
2. Faça login com GitHub

### Passo 2: Criar Web Service
1. Clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** sistema-funcionarios
   - **Environment:** Node
   - **Build Command:** `npm install && cd frontend && npm install && npm run build`
   - **Start Command:** `node server-production.js`

### Passo 3: Configurar Variáveis
1. Vá em "Environment"
2. Adicione:
   ```
   JWT_SECRET=seu_jwt_secret_super_seguro_aqui
   NODE_ENV=production
   ```

## 🔒 Configurações de Segurança

### Variáveis de Ambiente Obrigatórias
```env
JWT_SECRET=uma_chave_muito_segura_e_aleatoria_aqui
NODE_ENV=production
PORT=3001
```

### Opcional (para melhor segurança)
```env
CORS_ORIGIN=https://seu-dominio.com
MAX_FILE_SIZE=5242880
```

## 🗄️ Banco de Dados

### Para MVP (SQLite - Atual)
- ✅ Funciona perfeitamente
- ✅ Sem configuração adicional
- ⚠️ Dados podem ser perdidos em redeploys

### Para Produção (PostgreSQL - Recomendado)
- Railway: PostgreSQL automático
- Render: PostgreSQL gratuito
- Migração necessária no código

## 📱 Testando o Deploy

### Checklist Pós-Deploy
- [ ] Aplicação carrega corretamente
- [ ] Login funciona
- [ ] Cadastro de usuário funciona
- [ ] CRUD de funcionários funciona
- [ ] CRUD de cargos funciona
- [ ] Upload de fotos funciona
- [ ] Geração de crachás funciona

### URLs de Teste
```
https://seu-app.railway.app/
https://seu-app.railway.app/api/health (se implementar)
```

## 🔄 Atualizações Futuras

### Deploy Automático
- Qualquer push para `main` fará redeploy automático
- Ideal para desenvolvimento contínuo

### Comandos Úteis
```bash
# Atualizar aplicação
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Ver logs (Railway)
railway logs

# Ver logs (Render)
# Acessar dashboard > Logs
```

## 💡 Dicas Importantes

### Performance
- Frontend buildado é servido como arquivos estáticos
- Muito mais rápido que desenvolvimento
- Otimizado para produção

### Monitoramento
- Railway: Dashboard com métricas
- Render: Logs em tempo real
- Ambos: Alertas por email

### Custos
- Railway: $5/mês (suficiente para MVP)
- Render: Gratuito com limitações
- Ambos: Escalam conforme uso

## 🆘 Troubleshooting

### Erro: "Application failed to start"
1. Verificar logs da plataforma
2. Confirmar variáveis de ambiente
3. Testar localmente primeiro

### Erro: "Cannot find module"
1. Verificar package.json
2. Executar `npm install` localmente
3. Fazer novo commit/push

### Erro: Upload de fotos não funciona
1. Verificar permissões de pasta
2. Considerar usar serviço externo (Cloudinary)

## 🎉 Próximos Passos

Após deploy bem-sucedido:
1. ✅ Testar todas as funcionalidades
2. ✅ Compartilhar URL com stakeholders
3. ✅ Coletar feedback
4. ✅ Planejar melhorias
5. ✅ Considerar domínio personalizado

---

**🚀 Boa sorte com o deploy! O sistema está pronto para produção.**