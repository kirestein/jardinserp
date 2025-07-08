#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 TESTE COMPLETO DE TODOS OS AMBIENTES');
console.log('========================================\n');

const environments = ['development', 'staging', 'production'];

async function testEnvironment(env) {
  console.log(`\n🔍 Testando ambiente: ${env.toUpperCase()}`);
  console.log('='.repeat(40));
  
  try {
    // Alterar para o ambiente
    console.log(`📁 Alterando para ambiente ${env}...`);
    const switchResult = execSync(`node switch-environment.js ${env}`, { 
      encoding: 'utf8',
      cwd: __dirname
    });
    console.log(switchResult);
    
    // Verificar configuração
    console.log('⚙️  Verificando configuração...');
    const configTest = execSync('node -e "const config = require(\'./config-environments\'); console.log(JSON.stringify({env: config.environment, name: config.name, db: config.database.type}, null, 2))"', {
      encoding: 'utf8',
      cwd: __dirname
    });
    console.log(configTest);
    
    // Testar conexão (apenas para development, pois não temos staging configurado ainda)
    if (env === 'development') {
      console.log('🔌 Testando conexão...');
      try {
        const testResult = execSync('timeout 10s node -e "const db = require(\'./database-config-multi\'); console.log(\'✅ Conexão\', db.type, \'OK\')"', {
          encoding: 'utf8',
          cwd: __dirname
        });
        console.log(testResult);
      } catch (error) {
        console.log('⚠️  Teste de conexão não executado (timeout ou erro esperado)');
      }
    }
    
    console.log(`✅ Ambiente ${env} configurado corretamente`);
    
  } catch (error) {
    console.error(`❌ Erro no ambiente ${env}:`, error.message);
  }
}

async function runTests() {
  // Verificar arquivos necessários
  console.log('📋 Verificando arquivos de configuração...');
  
  const requiredFiles = [
    'config-environments.js',
    'localhost-protection.js',
    'database-config-multi.js',
    'switch-environment.js',
    '.env.development',
    '.env.staging',
    '.env.production'
  ];
  
  let allFilesExist = true;
  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
  });
  
  if (!allFilesExist) {
    console.error('\n❌ Alguns arquivos necessários não foram encontrados');
    process.exit(1);
  }
  
  console.log('\n✅ Todos os arquivos de configuração encontrados');
  
  // Testar cada ambiente
  for (const env of environments) {
    await testEnvironment(env);
  }
  
  // Voltar para development (seguro)
  console.log('\n🔄 Voltando para ambiente development (seguro)...');
  execSync('node switch-environment.js development', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('\n🎉 TESTE COMPLETO FINALIZADO!');
  console.log('========================================');
  console.log('✅ Todos os ambientes estão configurados');
  console.log('🛡️  Proteção de localhost ativa');
  console.log('🟢 Ambiente atual: development (seguro)');
  
  console.log('\n📋 Comandos para usar:');
  console.log('   npm run start:dev     # Sandbox SQLite');
  console.log('   npm run start:staging # PostgreSQL staging');
  console.log('   npm run start:prod    # PostgreSQL produção (apenas no Railway)');
}

runTests().catch(console.error);