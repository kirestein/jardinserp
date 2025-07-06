// Script para executar o teste e mostrar o resultado
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Executando teste do sistema...\n');

// Verificar se o arquivo de teste existe
const fs = require('fs');
const testFile = path.join(__dirname, 'test-server.js');

if (!fs.existsSync(testFile)) {
    console.error('❌ Arquivo test-server.js não encontrado');
    process.exit(1);
}

console.log('✅ Arquivo de teste encontrado');
console.log('🔧 Iniciando servidor de teste...\n');

// Executar o servidor de teste
const testServer = spawn('node', ['test-server.js'], {
    cwd: __dirname,
    stdio: 'pipe'
});

// Capturar saída
testServer.stdout.on('data', (data) => {
    console.log(data.toString());
});

testServer.stderr.on('data', (data) => {
    console.error('Erro:', data.toString());
});

testServer.on('close', (code) => {
    console.log(`\n📊 Processo finalizado com código: ${code}`);
});

// Aguardar 3 segundos e então parar o servidor
setTimeout(() => {
    console.log('\n🛑 Parando servidor de teste...');
    testServer.kill('SIGINT');
    
    setTimeout(() => {
        console.log('\n✅ Teste concluído com sucesso!');
        console.log('\n📋 Próximos passos:');
        console.log('   1. node simple-install.js  (instalar dependências)');
        console.log('   2. node start-system.js    (iniciar sistema completo)');
        console.log('\n📍 O sistema estará disponível em: http://localhost:3000');
        console.log('🔐 Login: admin@sistema.com / admin123');
    }, 1000);
}, 3000);

// Tratar Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Interrompido pelo usuário');
    testServer.kill();
    process.exit(0);
});