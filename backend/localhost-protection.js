// Proteção para localhost - nunca usar produção em desenvolvimento local
const os = require('os');

function isLocalhost() {
  // Verificar se está rodando em localhost/desenvolvimento
  const hostname = os.hostname();
  const isLocal = 
    hostname.includes('localhost') ||
    hostname.includes('127.0.0.1') ||
    hostname.includes('dev') ||
    hostname.includes('local') ||
    process.env.NODE_ENV === 'development' ||
    !process.env.RAILWAY_ENVIRONMENT; // Se não está no Railway
  
  return isLocal;
}

function getRecommendedEnvironment() {
  if (isLocalhost()) {
    // Em localhost, sempre usar development ou staging
    const hasPostgresUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
    
    if (hasPostgresUrl && process.env.NODE_ENV === 'staging') {
      return 'staging';
    } else {
      return 'development'; // Padrão para localhost
    }
  } else {
    // Em produção (Railway), usar o ambiente configurado
    return process.env.NODE_ENV || 'production';
  }
}

function enforceLocalhostSafety() {
  const isLocal = isLocalhost();
  const currentEnv = process.env.NODE_ENV;
  const recommended = getRecommendedEnvironment();
  
  console.log('🛡️  Verificação de Segurança Localhost');
  console.log('=====================================');
  console.log(`🖥️  Hostname: ${os.hostname()}`);
  console.log(`🌍 NODE_ENV: ${currentEnv || 'não definido'}`);
  console.log(`🏠 É localhost: ${isLocal ? '✅ Sim' : '❌ Não'}`);
  console.log(`🎯 Ambiente recomendado: ${recommended}`);
  
  if (isLocal && currentEnv === 'production') {
    console.log('\n🚨 AVISO DE SEGURANÇA!');
    console.log('=====================================');
    console.log('❌ Você está tentando usar PRODUÇÃO em localhost!');
    console.log('🛡️  Por segurança, forçando ambiente de desenvolvimento');
    console.log('');
    
    // Forçar ambiente de desenvolvimento
    process.env.NODE_ENV = 'development';
    
    // Remover URLs de produção para forçar SQLite
    delete process.env.DATABASE_URL;
    delete process.env.DATABASE_PUBLIC_URL;
    
    console.log('✅ Ambiente alterado para: development');
    console.log('🗄️  Banco: SQLite local (seguro)');
    console.log('');
  }
  
  if (isLocal && recommended !== currentEnv) {
    console.log(`💡 Recomendação: Use 'npm run start:${recommended}' para localhost`);
  }
  
  return {
    isLocalhost: isLocal,
    currentEnvironment: process.env.NODE_ENV,
    recommendedEnvironment: recommended,
    isSafe: !(isLocal && currentEnv === 'production')
  };
}

module.exports = {
  isLocalhost,
  getRecommendedEnvironment,
  enforceLocalhostSafety
};