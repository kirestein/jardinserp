# Sistema de Gerenciamento de Funcionários

Um sistema completo para gerenciar funcionários, cargos e gerar crachás de identificação.

## 🚀 Funcionalidades

### ✅ Autenticação
- **Tela de Login** - Acesso seguro ao sistema
- **Tela de Registro** - Criação de novos usuários administradores
- **Autenticação JWT** - Tokens seguros para sessões

### 👥 Gerenciamento de Funcionários
- **Cadastro de Funcionários** - Informações completas (nome, email, telefone, CPF, endereço, etc.)
- **Upload de Fotos** - Fotos dos funcionários para crachás
- **Listagem de Funcionários** - Visualização em tabela com filtros
- **Edição de Funcionários** - Atualização de dados
- **Exclusão de Funcionários** - Remoção segura com confirmação
- **Status de Funcionários** - Ativo/Inativo

### 💼 Gerenciamento de Cargos
- **Cadastro de Cargos** - Nome, carga horária, tipo de pagamento
- **Tipos de Pagamento** - Salário mensal ou valor por hora
- **Listagem de Cargos** - Visualização organizada
- **Edição e Exclusão** - Gerenciamento completo

### 🆔 Geração de Crachás
- **Crachás Personalizados** - Com foto, nome, cargo e ID
- **Visualização em Tempo Real** - Preview antes da impressão
- **Impressão Direta** - Função de imprimir integrada
- **Design Profissional** - Layout limpo e corporativo

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **bcryptjs** - Criptografia de senhas

### Frontend
- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **React Router** - Navegação
- **Axios** - Cliente HTTP
- **React Toastify** - Notificações
- **Lucide React** - Ícones

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Backend

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install

# Iniciar o servidor
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### 2. Frontend

```bash
# Navegar para o diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação
npm start
```

O frontend estará rodando em `http://localhost:3000`

## 🔐 Dados de Acesso Padrão

**Usuário Administrador:**
- **Email:** admin@sistema.com
- **Senha:** admin123

## 📊 Estrutura do Banco de Dados

### Tabela: usuarios
- id (INTEGER, PRIMARY KEY)
- nome (TEXT)
- email (TEXT, UNIQUE)
- senha (TEXT, hash)
- tipo (TEXT, default: 'admin')
- created_at (DATETIME)

### Tabela: cargos
- id (INTEGER, PRIMARY KEY)
- nome (TEXT)
- carga_horaria (INTEGER)
- tipo_pagamento (TEXT: 'salario' | 'hora')
- valor (DECIMAL)
- created_at (DATETIME)

### Tabela: funcionarios
- id (INTEGER, PRIMARY KEY)
- nome (TEXT)
- email (TEXT, UNIQUE)
- telefone (TEXT)
- cpf (TEXT, UNIQUE)
- data_nascimento (DATE)
- endereco (TEXT)
- cargo_id (INTEGER, FK)
- data_admissao (DATE)
- status (TEXT: 'ativo' | 'inativo')
- foto (TEXT)
- created_at (DATETIME)

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Acesse `http://localhost:3000`
2. Faça login com as credenciais padrão
3. Crie novos usuários se necessário

### 2. Gerenciar Cargos
1. Acesse "Cargos" no menu
2. Clique em "Novo Cargo"
3. Preencha: nome, carga horária, tipo de pagamento e valor
4. Salve o cargo

### 3. Gerenciar Funcionários
1. Acesse "Funcionários" no menu
2. Clique em "Novo Funcionário"
3. Preencha os dados obrigatórios (nome, email, CPF, data de admiss��o)
4. Adicione foto (opcional)
5. Selecione um cargo
6. Salve o funcionário

### 4. Gerar Crachás
1. Na lista de funcionários, clique no ícone de crachá (💳)
2. Visualize o preview do crachá
3. Clique em "Imprimir Crachá" para imprimir

## 🔧 Funcionalidades Técnicas

### Segurança
- Senhas criptografadas com bcrypt
- Autenticação JWT com expiração
- Validação de dados no frontend e backend
- Proteção contra SQL injection

### Upload de Arquivos
- Suporte a imagens (JPG, PNG, GIF)
- Redimensionamento automático
- Armazenamento seguro no servidor

### Responsividade
- Interface adaptável para desktop e mobile
- Tabelas responsivas
- Modais otimizados para diferentes telas

## 🚀 Próximas Funcionalidades

- [ ] Relatórios em PDF
- [ ] Exportação de dados
- [ ] Histórico de alterações
- [ ] Notificações por email
- [ ] Dashboard com estatísticas
- [ ] Backup automático
- [ ] Integração com sistemas externos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do email: suporte@sistema.com

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de funcionários**