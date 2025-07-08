const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Instalando dependências e testando PostgreSQL...');

try {
  // Verificar se package.json existe
  const packagePath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packagePath)) {
    console.error('❌ package.json não encontrado');
    process.exit(1);
  }

  console.log('📦 Instalando dependências...');
  
  // Instalar dependências
  execSync('npm install', { 
    stdio: 'inherit', 
    cwd: __dirname 
  });
  
  console.log('✅ Dependências instaladas com sucesso!');
  console.log('🔍 Testando conexão PostgreSQL...');
  
  // Agora executar o teste
  require('./test-connection-simple.js');
  
} catch (error) {
  console.error('❌ Erro durante instalação:', error.message);
  process.exit(1);
}