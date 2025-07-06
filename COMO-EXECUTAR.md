# 🚀 COMO EXECUTAR O SISTEMA DE FUNCIONÁRIOS

## 🎯 Opções de Execução

### 🔥 OPÇÃO 1 - Teste Rápido (Verificar se Node.js funciona)
```bash
cd /home/kir3/sistema-funcionarios
node test-server.js
```
Acesse: http://localhost:3333

### 🚀 OPÇÃO 2 - Instalação Automática
```bash
cd /home/kir3/sistema-funcionarios
node simple-install.js
node start-system.js
```

### 🛠️ OPÇÃO 3 - Instalação Manual
```bash
# Terminal 1 - Backend
cd /home/kir3/sistema-funcionarios/backend
npm install
node server.js

# Terminal 2 - Frontend
cd /home/kir3/sistema-funcionarios/frontend
npm install
npm start
```

### 📜 OPÇÃO 4 - Script Shell
```bash
cd /home/kir3/sistema-funcionarios
chmod +x quick-start.sh
./quick-start.sh
```

## 📍 URLs do Sistema

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Teste:** http://localhost:3333

## 🔐 Dados de Login

- **Email:** admin@sistema.com
- **Senha:** admin123

## 🎯 Funcionalidades Disponíveis

✅ **Autenticação**
- Login seguro
- Registro de usuários
- JWT tokens

✅ **Funcionários**
- Cadastro completo
- Upload de fotos
- Edição/exclusão
- Status ativo/inativo

✅ **Cargos**
- Cadastro de cargos
- Salário mensal ou por hora
- Carga horária

✅ **Crachás**
- Geração automática
- Design profissional
- Impressão direta

## ⚠️ Solução de Problemas

### Node.js não encontrado:
```bash
# Verificar instalação
node --version
npm --version

# Se não estiver instalado, baixar de: https://nodejs.org/
```

### Portas ocupadas:
```bash
# Verificar processos
lsof -i :3000
lsof -i :3001

# Matar processos se necessário
kill -9 <PID>
```

### Erro de dependências:
```bash
# Limpar cache npm
npm cache clean --force

# Tentar instalação forçada
npm install --force --legacy-peer-deps
```

## 📁 Estrutura do Projeto

```
sistema-funcionarios/
├── backend/           # API Node.js + Express
│   ├── server.js     # Servidor principal
│   ├── database.js   # Configuração SQLite
│   └── package.json  # Dependências backend
├── frontend/         # Interface React
│   ├── src/         # Código fonte
│   └── package.json # Dependências frontend
├── README.md        # Documentação completa
├── EXECUTAR.md      # Instruções de execução
└── *.js            # Scripts de instalação
```

## ��� Sucesso!

Quando tudo estiver funcionando, você verá:

1. **Backend:** "Servidor rodando na porta 3001"
2. **Frontend:** Página de login abrirá automaticamente
3. **Sistema:** Totalmente funcional com todas as features

## 📞 Precisa de Ajuda?

1. Execute primeiro: `node test-server.js`
2. Se funcionar, execute: `node simple-install.js`
3. Depois: `node start-system.js`
4. Acesse: http://localhost:3000

**🎯 O sistema está 100% pronto e funcional!**