# 🧪 Testar GitHub Actions - Guia Completo

## Antes de Testar

### ✅ Checklist Pré-Teste
- [ ] Token do Railway obtido
- [ ] Secret `RAILWAY_TOKEN` configurado no GitHub
- [ ] Repositório commitado e sincronizado

## 🚀 Teste 1: Pipeline Local

Primeiro, vamos testar localmente:

```bash
# Executar teste local
./test-pipeline.sh
```

Se der erro de permissão:
```bash
chmod +x test-pipeline.sh
./test-pipeline.sh
```

## 🚀 Teste 2: Primeiro Deploy

### Fazer Push para Ativar Pipeline

```bash
# 1. Adicionar todos os arquivos
git add .

# 2. Commit com mensagem descritiva
git commit -m "feat: configurar CI/CD com Railway"

# 3. Push para main (isso ativará o pipeline)
git push origin main
```

### Acompanhar Execução

1. **Ir para Actions:**
   - Acesse: https://github.com/SEU_USUARIO/sistema-funcionarios/actions
   - Você verá o workflow "🚂 Railway Deploy" executando

2. **Acompanhar em Tempo Real:**
   - Clique no workflow em execução
   - Clique no job "🚀 Build and Deploy"
   - Veja cada step sendo executado

## 📊 O que Esperar

### ✅ Execução Bem-Sucedida
```
✅ Checkout Repository
✅ Setup Node.js 18
✅ Install Dependencies
✅ Run Tests
✅ Build Frontend
✅ Prepare Production Files
✅ Install Railway CLI
✅ Deploy to Railway
✅ Deployment Summary
```

### ❌ Possíveis Erros

**Erro: "Railway token not found"**
- Verificar se o secret está configurado corretamente
- Nome deve ser exatamente: `RAILWAY_TOKEN`

**Erro: "Build failed"**
- Executar `./test-pipeline.sh` localmente primeiro
- Verificar se todas as dependências estão corretas

**Erro: "Tests failed"**
- Verificar se os testes passam localmente
- Pode ser necessário ajustar configuração de testes

## 🎯 Após Deploy Bem-Sucedido

### 1. Obter URL da Aplicação
- No final do log do GitHub Actions
- Ou no dashboard do Railway: https://railway.app/dashboard

### 2. Testar Aplicação
- Acessar a URL fornecida
- Testar login com: admin@sistema.com / admin123
- Verificar se todas as funcionalidades funcionam

### 3. Configurar Variáveis de Ambiente (Railway)
No Railway dashboard:
```env
JWT_SECRET=sua_chave_super_secreta_aqui_mude_obrigatoriamente
NODE_ENV=production
```

## 🔄 Próximos Deploys

Após o primeiro deploy, qualquer push para main fará deploy automático:

```bash
# Fazer qualquer mudança
echo "# Teste" >> README.md

# Commit e push
git add .
git commit -m "test: testar deploy automático"
git push origin main
```

## 🚨 Troubleshooting

### Se o Deploy Falhar

1. **Verificar Logs:**
   - GitHub Actions > Workflow falhado > Logs detalhados

2. **Testar Localmente:**
   ```bash
   ./test-pipeline.sh
   ```

3. **Verificar Railway:**
   - Dashboard do Railway
   - Logs da aplicação

4. **Recriar Secret (se necessário):**
   - GitHub > Settings > Secrets > Delete > Criar novamente

## 📞 Suporte

Se precisar de ajuda:
1. Compartilhe os logs do GitHub Actions
2. Verifique se o token Railway não expirou
3. Confirme se o repositório está público ou se o Railway tem acesso

---

## 🎉 Sucesso!

Quando tudo funcionar, você terá:
- ✅ Deploy automático a cada push
- ✅ Aplicação sempre atualizada
- ✅ URL estável para compartilhar
- ✅ Pipeline profissional funcionando