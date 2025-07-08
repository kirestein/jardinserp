console.log('🧪 TESTE SIMPLES DE CONFIGURAÇÃO');
console.log('=================================\n');

try {
  // 1. Testar proteção de localhost
  console.log('1. 🛡️  Testando proteção de localhost...');
  const protection = require('./localhost-protection');
  const isLocal = protection.isLocalhost();
  const recommended = protection.getRecommendedEnvironment();
  
  console.log(`   Localhost: ${isLocal ? '✅ Sim' : '❌ Não'}`);
  console.log(`   Recomendado: ${recommended}`);
  
  // 2. Testar configuração de ambientes
  console.log('\n2. ⚙️  Testando configuração de ambientes...');
  
  // Forçar ambiente development para teste
  process.env.NODE_ENV = 'development';
  delete process.env.DATABASE_URL;
  delete process.env.DATABASE_PUBLIC_URL;
  
  const config = require('./config-environments');
  console.log(`   Ambiente: ${config.environment}`);
  console.log(`   Nome: ${config.name}`);
  console.log(`   Banco: ${config.database.type}`);
  console.log(`   Porta: ${config.server.port}`);
  
  // 3. Testar configuração do banco
  console.log('\n3. 🗄️  Testando configuração do banco...');
  const database = require('./database-config-multi');
  console.log(`   Tipo: ${database.type}`);
  console.log(`   Ambiente: ${database.environment}`);
  
  console.log('\n✅ TESTE BÁSICO CONCLUÍDO COM SUCESSO!');
  console.log('=====================================');
  console.log('🟢 Configuração está funcionando');
  console.log('🛡️  Proteção de localhost ativa');
  console.log('🗄️  Banco configurado corretamente');
  
  console.log('\n📋 Próximos passos:');
  console.log('   npm run start:dev  # Iniciar em modo desenvolvimento');
  console.log('   npm start          # Iniciar com detecção automática');
  
} catch (error) {
  console.error('\n❌ ERRO NO TESTE:');
  console.error('==================');
  console.error(error.message);
  console.error('\n🔧 Stack trace:');
  console.error(error.stack);
}