#!/usr/bin/env node

const { execSync } = require('child_process');
const { isLocalhost, getRecommendedEnvironment } = require('./localhost-protection');

console.log('🚀 SMART START - Detecção Automática de Ambiente');
console.log('================================================\n');

const isLocal = isLocalhost();
const recommended = getRecommendedEnvironment();

console.log(`🖥️  Localhost detectado: ${isLocal ? '✅ Sim' : '❌ Não'}`);
console.log(`🎯 Ambiente recomendado: ${recommended}`);

if (isLocal) {
  console.log('\n🛡️  PROTEÇÃO LOCALHOST ATIVA');
  console.log('============================');
  
  if (recommended === 'development') {
    console.log('🟢 Usando ambiente DEVELOPMENT (SQLite)');
    console.log('   • Banco SQLite local');
    console.log('   • Dados de teste inclusos');
    console.log('   • 100% seguro para desenvolvimento');
    console.log('   • Não afeta produção');
  } else if (recommended === 'staging') {
    console.log('🟡 Usando ambiente STAGING (PostgreSQL)');
    console.log('   • PostgreSQL Railway staging');
    console.log('   • Dados de teste');
    console.log('   • Seguro para testes');
    console.log('   • Não afeta produção');
  }
  
  console.log('\n🔄 Configurando ambiente...');
  
  try {
    // Configurar ambiente recomendado
    execSync(`node switch-environment.js ${recommended}`, { 
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('\n🚀 Iniciando servidor...');
    console.log('========================');
    
    // Iniciar servidor
    execSync('node server.js', { 
      stdio: 'inherit',
      cwd: __dirname
    });
    
  } catch (error) {
    console.error('\n❌ Erro ao iniciar:', error.message);
    process.exit(1);
  }
  
} else {
  console.log('\n🌐 AMBIENTE DE PRODUÇÃO DETECTADO');
  console.log('=================================');
  console.log('🔴 Usando configuração de produção');
  console.log('⚠️  Certifique-se de que as variáveis estão corretas');
  
  try {
    // Em produção, usar o ambiente configurado
    execSync('node server.js', { 
      stdio: 'inherit',
      cwd: __dirname
    });
  } catch (error) {
    console.error('\n❌ Erro ao iniciar:', error.message);
    process.exit(1);
  }
}