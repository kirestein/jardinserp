# 📋 Instruções de Instalação e Execução

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** (geralmente vem com o Node.js)

Para verificar se estão instalados:
```bash
node --version
npm --version
```

## 🚀 Passo a Passo para Executar

### 1. Preparar o Backend

Abra um terminal e execute:

```bash
# Navegar para o diretório do backend
cd /home/kir3/sistema-funcionarios/backend

# Instalar as dependências
npm install

# Iniciar o servidor backend
npm run dev
```

**✅ O backend estará rodando em:** `http://localhost:3001`

Você verá a mensagem: `Servidor rodando na porta 3001`

### 2. Preparar o Frontend

Abra um **NOVO terminal** (mantenha o backend rodando) e execute:

```bash
# Navegar para o diretório do frontend
cd /home/kir3/sistema-funcionarios/frontend

# Instalar as dependências
npm install

# Iniciar a aplicação frontend
npm start
```

**✅ O frontend estará rodando em:** `http://localhost:3000`

O navegador abrirá automaticamente ou você pode acessar manualmente.

## 🔐 Primeiro Acesso

### Dados de Login Padrão:
- **Email:** `admin@sistema.com`
- **Senha:** `admin123`

## 📱 Como Usar o Sistema

### 1. **Tela de Login**
- Use as credenciais padrão para entrar
- Ou crie uma nova conta clicando em "Criar nova conta"

### 2. **Gerenciar Cargos** (Recomendado fazer primeiro)
- Clique em "Cargos" no menu superior
- Clique em "Novo Cargo"
- Preencha:
  - **Nome do Cargo:** Ex: "Desenvolvedor", "Analista"
  - **Carga Horária:** Ex: 40 (horas por semana)
  - **Tipo de Pagamento:** Salário Mensal ou Valor por Hora
  - **Valor:** Ex: 5000.00 (para salário) ou 25.00 (para hora)

### 3. **Gerenciar Funcionários**
- Clique em "Funcionários" no menu superior
- Clique em "Novo Funcionário"
- Preencha os dados obrigatórios:
  - **Nome Completo**
  - **Email**
  - **CPF**
  - **Data de Admissão**
- Dados opcionais:
  - **Telefone**
  - **Data de Nascimento**
  - **Endereço**
  - **Cargo** (selecione um cargo criado anteriormente)
  - **Foto** (para o crachá)

### 4. **Gerar Crachás**
- Na lista de funcionários, clique no ícone verde de crachá (💳)
- Visualize o preview do crachá
- Clique em "Imprimir Crachá" para imprimir

### 5. **Editar/Deletar**
- Use os ícones amarelo (editar) e vermelho (deletar) nas tabelas
- Confirmações de segurança aparecerão antes de deletar

## 🛠️ Funcionalidades Principais

### ✅ **Autenticação**
- Login seguro
- Criação de novos usuários
- Logout automático

### ✅ **Cargos**
- Criar, editar e deletar cargos
- Definir salário mensal ou valor por hora
- Carga horária semanal

### ✅ **Funcionários**
- Cadastro completo com foto
- Status ativo/inativo
- Vinculação com cargos
- Upload de fotos

### ✅ **Crachás**
- Geração automática
- Design profissional
- Impressão direta
- Foto do funcionário

## 🔍 Solução de Problemas

### ❌ **Erro: "EADDRINUSE: address already in use"**
**Solução:** Alguma porta já está em uso
```bash
# Matar processos nas portas
sudo kill -9 $(sudo lsof -t -i:3001)
sudo kill -9 $(sudo lsof -t -i:3000)
```

### ❌ **Erro: "Module not found"**
**Solução:** Dependências não instaladas
```bash
# No diretório backend
cd backend && npm install

# No diretório frontend  
cd frontend && npm install
```

### ❌ **Erro: "Cannot connect to backend"**
**Solução:** Backend não está rodando
- Certifique-se que o backend está rodando na porta 3001
- Verifique se não há erros no terminal do backend

### ❌ **Fotos não aparecem**
**Solução:** Problema de upload
- Certifique-se que a pasta `backend/uploads` existe
- Verifique permissões de escrita

## 📂 Estrutura de Arquivos

```
sistema-funcionarios/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── database.js
│   ├── funcionarios.db (criado automaticamente)
│   └── uploads/ (criado automaticamente)
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
└── README.md
```

## 🎯 Dicas de Uso

1. **Sempre crie cargos antes de funcionários** - facilita a organização
2. **Use fotos quadradas** - ficam melhores nos crachás
3. **Mantenha CPFs únicos** - o sistema não permite duplicatas
4. **Faça backup regular** - o arquivo `funcionarios.db` contém todos os dados

## 📞 Precisa de Ajuda?

Se encontrar problemas:

1. **Verifique os logs** nos terminais do backend e frontend
2. **Reinicie os serviços** (Ctrl+C e execute novamente)
3. **Limpe o cache** do navegador (Ctrl+Shift+R)
4. **Verifique as portas** 3000 e 3001 estão livres

---

**🎉 Pronto! Seu sistema está funcionando!**

Agora você pode gerenciar funcionários, criar cargos e gerar crachás profissionais!