# 🚀 Como Executar o Sistema

## Método 1 - Automático (Recomendado)

Abra um terminal e execute:

```bash
cd /home/kir3/sistema-funcionarios
node simple-install.js
```

Depois:

```bash
node start-system.js
```

## Método 2 - Manual

### 1. Instalar dependências do Backend:
```bash
cd /home/kir3/sistema-funcionarios/backend
npm install
```

### 2. Instalar dependências do Frontend:
```bash
cd /home/kir3/sistema-funcionarios/frontend
npm install
```

### 3. Iniciar Backend (Terminal 1):
```bash
cd /home/kir3/sistema-funcionarios/backend
node server.js
```

### 4. Iniciar Frontend (Terminal 2):
```bash
cd /home/kir3/sistema-funcionarios/frontend
npm start
```

## 📍 URLs de Acesso

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

## 🔐 Login Padrão

- **Email:** admin@sistema.com
- **Senha:** admin123

## ⚠️ Problemas Comuns

### Node.js não encontrado:
```bash
# Verificar se Node.js está instalado
node --version
npm --version

# Se não estiver, instalar via nvm (se disponível)
nvm install node
nvm use node
```

### Erro de permissões:
```bash
# Dar permissão aos scripts
chmod +x *.sh
```

### Portas ocupadas:
```bash
# Matar processos nas portas
sudo kill -9 $(sudo lsof -t -i:3000)
sudo kill -9 $(sudo lsof -t -i:3001)
```

## 🎯 Próximos Passos

1. Acesse http://localhost:3000
2. Faça login com admin@sistema.com / admin123
3. Crie alguns cargos primeiro
4. Cadastre funcionários
5. Gere crachás!