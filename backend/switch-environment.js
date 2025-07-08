#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const environments = ['development', 'staging', 'production'];
const envArg = process.argv[2];

if (!envArg || !environments.includes(envArg)) {
  console.log('🌍 Alternador de Ambientes');
  console.log('========================\n');
  console.log('Uso: node switch-environment.js <ambiente>');
  console.log('');
  console.log('Ambientes disponíveis:');
  console.log('  🟢 development  - SQLite local com dados de teste');
  console.log('  🟡 staging      - PostgreSQL Railway (testes)');
  console.log('  🔴 production   - PostgreSQL Railway (produção)');
  console.log('');
  console.log('Exemplos:');
  console.log('  node switch-environment.js development');
  console.log('  node switch-environment.js staging');
  console.log('  node switch-environment.js production');
  process.exit(1);
}

const sourceFile = path.join(__dirname, `.env.${envArg}`);
const targetFile = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ Arquivo ${sourceFile} não encontrado`);
    process.exit(1);
  }

  // Copiar arquivo de ambiente
  fs.copyFileSync(sourceFile, targetFile);
  
  console.log(`✅ Ambiente alterado para: ${envArg}`);
  console.log(`📁 Arquivo copiado: .env.${envArg} → .env`);
  
  // Mostrar configurações
  const envContent = fs.readFileSync(targetFile, 'utf8');
  const nodeEnv = envContent.match(/NODE_ENV=(.+)/)?.[1] || 'não definido';
  const hasDatabase = envContent.includes('DATABASE_URL') || envContent.includes('DATABASE_PUBLIC_URL');
  
  console.log('\n📋 Configurações ativas:');
  console.log(`   NODE_ENV: ${nodeEnv}`);
  console.log(`   Banco: ${hasDatabase ? 'PostgreSQL' : 'SQLite'}`);
  
  if (envArg === 'development') {
    console.log('\n🟢 AMBIENTE DE DESENVOLVIMENTO');
    console.log('   • Banco SQLite local (funcionarios-dev.db)');
    console.log('   • Dados de teste inclusos');
    console.log('   • JWT secret simples');
    console.log('   • Debug habilitado');
    console.log('\n🔐 Usuários de teste:');
    console.log('   • admin@dev.com / admin123 (admin)');
    console.log('   • teste@dev.com / teste123 (user)');
  } else if (envArg === 'staging') {
    console.log('\n🟡 AMBIENTE DE STAGING');
    console.log('   • PostgreSQL Railway (staging)');
    console.log('   • Configure STAGING_DATABASE_URL no Railway');
    console.log('   • JWT secret diferente da produção');
    console.log('   • Para testes finais');
  } else if (envArg === 'production') {
    console.log('\n🔴 AMBIENTE DE PRODUÇÃO');
    console.log('   • PostgreSQL Railway (produção)');
    console.log('   • Dados reais');
    console.log('   • ⚠️  ALTERE O JWT_SECRET!');
    console.log('   • Debug desabilitado');
  }
  
  console.log('\n🚀 Para iniciar o servidor:');
  console.log('   npm start');
  console.log('\n🧪 Para testar a conexão:');
  console.log('   node test-postgres.js');
  
} catch (error) {
  console.error('❌ Erro ao alterar ambiente:', error.message);
  process.exit(1);
}