const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Instalando dependências do sistema...\n');

// Função para executar comandos
function runCommand(command, cwd) {
    try {
        console.log(`📦 Executando: ${command} em ${cwd}`);
        execSync(command, { 
            cwd, 
            stdio: 'inherit',
            timeout: 300000 // 5 minutos
        });
        return true;
    } catch (error) {
        console.error(`❌ Erro ao executar: ${command}`);
        console.error(error.message);
        return false;
    }
}

// Verificar se Node.js está disponível
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    const npmVersion = execSync('npm --version', { encoding: 'utf8' });
    console.log(`✅ Node.js: ${nodeVersion.trim()}`);
    console.log(`✅ npm: ${npmVersion.trim()}\n`);
} catch (error) {
    console.error('❌ Node.js ou npm não encontrado!');
    process.exit(1);
}

// Instalar dependências do backend
console.log('🔧 Instalando dependências do backend...');
const backendPath = path.join(__dirname, 'backend');
if (!runCommand('npm install', backendPath)) {
    console.log('⚠️ Tentando instalação alternativa...');
    runCommand('npm install --legacy-peer-deps', backendPath);
}

// Instalar dependências do frontend
console.log('\n🎨 Instalando dependências do frontend...');
const frontendPath = path.join(__dirname, 'frontend');
if (!runCommand('npm install', frontendPath)) {
    console.log('⚠️ Tentando instalação alternativa...');
    runCommand('npm install --legacy-peer-deps', frontendPath);
}

console.log('\n✅ Instalação concluída!');
console.log('\n🚀 Para iniciar o sistema, execute:');
console.log('   node start-system.js');