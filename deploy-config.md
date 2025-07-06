# 🚀 Guia de Deploy - Sistema de Funcionários

## Estratégia Recomendada: Deploy Unificado

### Por que Deploy Unificado para MVP?
- ✅ Mais simples de configurar
- ✅ Menos custos (um servidor)
- ✅ Sem problemas de CORS
- ✅ Ideal para testes e demonstrações
- ✅ Manutenção mais fácil

## 🎯 Plataformas Recomendadas

### 1. RAILWAY (Melhor opção)
- **Custo:** $5 crédito mensal (gratuito para MVP)
- **Suporte:** Node.js + SQLite + arquivos estáticos
- **Deploy:** Automático via GitHub
- **URL:** https://railway.app

### 2. RENDER
- **Custo:** Plano gratuito disponível
- **Suporte:** Node.js + PostgreSQL gratuito
- **Deploy:** Automático via GitHub
- **URL:** https://render.com

### 3. HEROKU (Alternativa paga)
- **Custo:** ~$7/mês (não tem mais plano gratuito)
- **Suporte:** Completo para Node.js
- **Deploy:** Via Git ou GitHub

## 🔧 Configuração Necessária

### Modificações no Backend
1. Servir arquivos estáticos do frontend
2. Configurar variáveis de ambiente
3. Ajustar porta dinâmica
4. Configurar banco de dados para produção

### Modificações no Frontend
1. Build para produção
2. Configurar URLs da API
3. Otimizar assets

## 📋 Checklist de Deploy

### Preparação
- [ ] Configurar variáveis de ambiente
- [ ] Modificar backend para servir frontend
- [ ] Criar script de build unificado
- [ ] Testar localmente
- [ ] Configurar banco para produção

### Deploy
- [ ] Criar repositório no GitHub
- [ ] Conectar com plataforma escolhida
- [ ] Configurar variáveis de ambiente
- [ ] Fazer primeiro deploy
- [ ] Testar funcionalidades

## 🚨 Considerações Importantes

### Banco de Dados
- SQLite funciona para MVP, mas considere PostgreSQL para produção
- Railway e Render oferecem PostgreSQL gratuito

### Arquivos de Upload
- Para MVP: armazenar no servidor
- Para produção: considerar AWS S3 ou Cloudinary

### Segurança
- Configurar HTTPS (automático nas plataformas)
- Variáveis de ambiente para secrets
- Validar todas as entradas

## 💡 Próximos Passos

1. Escolher plataforma (recomendo Railway)
2. Modificar código para deploy unificado
3. Configurar repositório GitHub
4. Fazer deploy inicial
5. Testar e ajustar conforme necessário