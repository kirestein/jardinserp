// Teste simples para verificar se Node.js está funcionando
console.log('✅ Node.js está funcionando!');
console.log('📍 Versão:', process.version);
console.log('📍 Plataforma:', process.platform);

// Verificar se podemos acessar os diretórios
const fs = require('fs');
const path = require('path');

try {
    const backendExists = fs.existsSync(path.join(__dirname, 'backend'));
    const frontendExists = fs.existsSync(path.join(__dirname, 'frontend'));
    
    console.log('📁 Backend existe:', backendExists);
    console.log('📁 Frontend existe:', frontendExists);
    
    if (backendExists && frontendExists) {
        console.log('✅ Estrutura do projeto OK!');
        console.log('\n🚀 Execute: node install-deps.js');
    }
} catch (error) {
    console.error('❌ Erro:', error.message);
}