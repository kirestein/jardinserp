#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build para deploy...\n');

try {
  // 1. Instalar dependências do backend
  console.log('📦 Instalando dependências do backend...');
  execSync('cd backend && npm install', { stdio: 'inherit' });

  // 2. Instalar dependências do frontend
  console.log('📦 Instalando dependências do frontend...');
  execSync('cd frontend && npm install', { stdio: 'inherit' });

  // 3. Build do frontend
  console.log('🔨 Fazendo build do frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit' });

  // 4. Verificar se o build foi criado
  const buildPath = path.join(__dirname, 'frontend', 'build');
  if (!fs.existsSync(buildPath)) {
    throw new Error('Build do frontend não foi criado!');
  }

  // 5. Copiar dependências necessárias para a raiz
  console.log('📋 Preparando arquivos para deploy...');
  
  // Criar package.json para produção
  const productionPackage = {
    "name": "sistema-funcionarios-production",
    "version": "1.0.0",
    "description": "Sistema de Funcionários - Versão de Produção",
    "main": "server-production.js",
    "scripts": {
      "start": "node server-production.js",
      "postinstall": "cd backend && npm install"
    },
    "dependencies": {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "sqlite3": "^5.1.6",
      "bcryptjs": "^2.4.3",
      "jsonwebtoken": "^9.0.2",
      "multer": "^1.4.5-lts.1",
      "uuid": "^9.0.1"
    },
    "engines": {
      "node": ">=16.0.0"
    }
  };

  fs.writeFileSync('package-production.json', JSON.stringify(productionPackage, null, 2));

  console.log('✅ Build concluído com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Renomear package-production.json para package.json');
  console.log('2. Fazer commit e push para o GitHub');
  console.log('3. Conectar repositório com Railway/Render');
  console.log('4. Configurar variáveis de ambiente');
  console.log('5. Fazer deploy!');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}