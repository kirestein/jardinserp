const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TESTE COMPLETO POSTGRESQL RAILWAY');
console.log('=====================================\n');

const backendPath = path.join(__dirname, 'backend');

try {
  // 1. Verificar estrutura
  console.log('📁 1. Verificando estrutura do projeto...');
  
  if (!fs.existsSync(path.join(backendPath, 'package.json'))) {
    throw new Error('package.json não encontrado no backend');
  }
  console.log('   ✅ package.json encontrado');
  
  if (!fs.existsSync(path.join(backendPath, '.env'))) {
    throw new Error('Arquivo .env não encontrado no backend');
  }
  console.log('   ✅ .env encontrado');
  
  // 2. Instalar dependências
  console.log('\n📦 2. Instalando dependências...');
  process.chdir(backendPath);
  
  execSync('npm install', { stdio: 'pipe' });
  console.log('   ✅ Dependências instaladas com sucesso');
  
  // 3. Verificar se pg foi instalado
  console.log('\n🗄️  3. Verificando módulo PostgreSQL...');
  
  if (!fs.existsSync(path.join(backendPath, 'node_modules', 'pg'))) {
    throw new Error('Módulo pg não foi instalado corretamente');
  }
  console.log('   ✅ Módulo pg instalado');
  
  // 4. Testar conexão
  console.log('\n🔌 4. Testando conexão PostgreSQL...');
  console.log('=====================================');
  
  // Executar teste
  const testResult = execSync('node test-basic.js', { 
    stdio: 'pipe',
    encoding: 'utf8'
  });
  
  console.log(testResult);
  
  console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
  console.log('=====================================');
  console.log('✅ PostgreSQL Railway está funcionando');
  console.log('✅ Todas as dependências estão instaladas');
  console.log('✅ Configuração está correta');
  
} catch (error) {
  console.error('\n❌ ERRO NO TESTE:');
  console.error('=====================================');
  console.error(error.message);
  
  if (error.stdout) {
    console.log('\n📋 Saída do comando:');
    console.log(error.stdout.toString());
  }
  
  if (error.stderr) {
    console.log('\n🚨 Erros:');
    console.log(error.stderr.toString());
  }
  
  console.log('\n🔧 Soluções possíveis:');
  console.log('1. Verifique sua conexão com a internet');
  console.log('2. Verifique se o Railway está ativo');
  console.log('3. Execute: cd backend && npm install');
  console.log('4. Verifique as credenciais no arquivo .env');
  
  process.exit(1);
}