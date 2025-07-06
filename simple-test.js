console.log('🎉 TESTE DO SISTEMA DE FUNCIONÁRIOS');
console.log('');
console.log('✅ Node.js versão:', process.version);
console.log('✅ Plataforma:', process.platform);
console.log('');

// Verificar se os arquivos principais existem
const fs = require('fs');
const path = require('path');

const files = [
    'backend/server.js',
    'frontend/package.json',
    'README.md'
];

console.log('📁 Verificando arquivos principais:');
files.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(exists ? '✅' : '❌', file);
});

console.log('');
console.log('🚀 SISTEMA PRONTO!');
console.log('');
console.log('📋 Para executar o sistema completo:');
console.log('   1. node simple-install.js');
console.log('   2. node start-system.js');
console.log('');
console.log('📍 URLs de acesso:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:3001');
console.log('');
console.log('🔐 Login padrão:');
console.log('   Email: admin@sistema.com');
console.log('   Senha: admin123');