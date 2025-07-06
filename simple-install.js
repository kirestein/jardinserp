const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Sistema de Funcionários - Instalação Simples\n');

// Verificar Node.js
try {
    const version = process.version;
    console.log(`✅ Node.js ${version} detectado`);
} catch (error) {
    console.error('❌ Node.js não encontrado');
    process.exit(1);
}

// Verificar estrutura
const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

if (!fs.existsSync(backendDir)) {
    console.error('❌ Diretório backend não encontrado');
    process.exit(1);
}

if (!fs.existsSync(frontendDir)) {
    console.error('❌ Diretório frontend não encontrado');
    process.exit(1);
}

console.log('✅ Estrutura do projeto verificada');

// Função para instalar dependências
function installDeps(dir, name) {
    console.log(`\n📦 Instalando dependências do ${name}...`);
    
    try {
        process.chdir(dir);
        
        // Tentar diferentes métodos de instalação
        const commands = [
            'npm install',
            'npm install --legacy-peer-deps',
            'npm install --force'
        ];
        
        for (const cmd of commands) {
            try {
                console.log(`   Tentando: ${cmd}`);
                execSync(cmd, { stdio: 'pipe', timeout: 180000 });
                console.log(`✅ ${name} instalado com sucesso!`);
                return true;
            } catch (error) {
                console.log(`   ⚠️ Falhou: ${cmd}`);
                continue;
            }
        }
        
        console.error(`❌ Falha ao instalar ${name}`);
        return false;
        
    } catch (error) {
        console.error(`❌ Erro ao instalar ${name}:`, error.message);
        return false;
    } finally {
        process.chdir(__dirname);
    }
}

// Instalar backend
const backendOk = installDeps(backendDir, 'backend');

// Instalar frontend
const frontendOk = installDeps(frontendDir, 'frontend');

if (backendOk && frontendOk) {
    console.log('\n🎉 Instalação concluída com sucesso!');
    console.log('\n🚀 Para iniciar o sistema:');
    console.log('   node start-system.js');
} else {
    console.log('\n⚠️ Instalação parcial. Tente executar manualmente:');
    console.log('   cd backend && npm install');
    console.log('   cd frontend && npm install');
}