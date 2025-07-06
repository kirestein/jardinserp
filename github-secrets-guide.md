# 🔐 Configurar Secrets no GitHub - Guia Visual

## Passo a Passo Detalhado

### 1. Acessar seu Repositório
- Vá para: https://github.com/SEU_USUARIO/sistema-funcionarios
- (Substitua SEU_USUARIO pelo seu username do GitHub)

### 2. Acessar Configurações
- Clique na aba **"Settings"** (última aba no topo do repositório)
- ⚠️ Se não vir "Settings", você pode não ter permissões de admin

### 3. Navegar para Secrets
- No menu lateral esquerdo, procure por **"Secrets and variables"**
- Clique em **"Secrets and variables"**
- Selecione **"Actions"**

### 4. Adicionar Novo Secret
- Clique no botão verde **"New repository secret"**
- Você verá um formulário com dois campos

### 5. Preencher o Secret
**Campo "Name":**
```
RAILWAY_TOKEN
```

**Campo "Secret":**
```
[Cole aqui o token que você copiou do Railway]
```

### 6. Salvar
- Clique em **"Add secret"**
- O secret será criado e você verá na lista

## ✅ Verificação
Após criar, você deve ver:
- Nome: `RAILWAY_TOKEN`
- Status: "Updated X seconds ago"
- Valor: `•••••••••••���••••••••••••••••••••••••••••`

## 🚨 Importante
- ⚠️ O valor do secret ficará oculto (••••••••)
- ⚠️ Você não conseguirá ver o valor novamente
- ⚠️ Se errar, delete e crie novamente

## 🎯 Próximo Passo
Com o secret configurado, podemos testar o pipeline!