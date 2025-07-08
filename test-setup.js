console.log('🚀 Testando setup do PostgreSQL Railway...');
console.log('📍 Diretório atual:', process.cwd());

// Verificar se estamos no diretório correto
const fs = require('fs');
const path = require('path');

const backendPath = path.join(__dirname, 'backend');
const packagePath = path.join(backendPath, 'package.json');

console.log('📁 Verificando estrutura do projeto...');
console.log('   Backend path:', backendPath);
console.log('   Package.json:', fs.existsSync(packagePath) ? '✅ Existe' : '❌ Não encontrado');

if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json não encontrado no backend');
  process.exit(1);
}

// Ler package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log('📦 Dependências no package.json:');
Object.keys(packageJson.dependencies || {}).forEach(dep => {
  console.log('   -', dep, packageJson.dependencies[dep]);
});

// Verificar se pg está listado
const hasPg = packageJson.dependencies && packageJson.dependencies.pg;
console.log('🗄️  Módulo pg:', hasPg ? '✅ Listado' : '❌ Não listado');

// Verificar se node_modules existe
const nodeModulesPath = path.join(backendPath, 'node_modules');
const hasNodeModules = fs.existsSync(nodeModulesPath);
console.log('📂 node_modules:', hasNodeModules ? '✅ Existe' : '❌ Não existe');

if (hasNodeModules) {
  const pgPath = path.join(nodeModulesPath, 'pg');
  const hasPgInstalled = fs.existsSync(pgPath);
  console.log('🗄️  Módulo pg instalado:', hasPgInstalled ? '✅ Sim' : '❌ Não');
}

// Verificar arquivo .env
const envPath = path.join(backendPath, '.env');
const hasEnv = fs.existsSync(envPath);
console.log('⚙️  Arquivo .env:', hasEnv ? '✅ Existe' : '❌ Não existe');

if (hasEnv) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasDbUrl = envContent.includes('DATABASE_PUBLIC_URL');
  console.log('🔗 DATABASE_PUBLIC_URL:', hasDbUrl ? '✅ Configurada' : '❌ Não configurada');
}

console.log('\n🔧 Próximos passos recomendados:');
console.log('1. cd backend');
console.log('2. npm install');
console.log('3. node test-basic.js');

// Tentar executar teste básico se tudo estiver ok
if (hasPg && hasNodeModules && hasEnv) {
  console.log('\n🚀 Executando teste básico...');
  try {
    process.chdir(backendPath);
    require('./backend/test-basic.js');
  } catch (error) {
    console.error('❌ Erro ao executar teste:', error.message);
  }
} else {
  console.log('\n⚠️  Configuração incompleta. Execute os passos acima primeiro.');
}