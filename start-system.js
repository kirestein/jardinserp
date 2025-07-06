const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando Sistema de Gerenciamento de Funcionários...\n');

// Iniciar backend
console.log('🔧 Iniciando servidor backend...');
const backendPath = path.join(__dirname, 'backend');
const backend = spawn('node', ['server.js'], {
    cwd: backendPath,
    stdio: 'inherit'
});

// Aguardar um pouco antes de iniciar o frontend
setTimeout(() => {
    console.log('\n🎨 Iniciando aplicação frontend...');
    const frontendPath = path.join(__dirname, 'frontend');
    const frontend = spawn('npm', ['start'], {
        cwd: frontendPath,
        stdio: 'inherit'
    });

    // Mostrar informações
    setTimeout(() => {
        console.log('\n🎉 Sistema iniciado com sucesso!');
        console.log('\n📍 URLs de Acesso:');
        console.log('   Frontend: http://localhost:3000');
        console.log('   Backend:  http://localhost:3001');
        console.log('\n🔐 Dados de Login:');
        console.log('   Email: admin@sistema.com');
        console.log('   Senha: admin123');
        console.log('\n⚠️  Para parar o sistema, pressione Ctrl+C');
    }, 5000);

    // Cleanup quando o processo for interrompido
    process.on('SIGINT', () => {
        console.log('\n🛑 Parando sistema...');
        backend.kill();
        frontend.kill();
        process.exit(0);
    });

}, 3000);

// Tratar erros
backend.on('error', (err) => {
    console.error('❌ Erro no backend:', err.message);
});

backend.on('exit', (code) => {
    if (code !== 0) {
        console.error(`❌ Backend parou com código: ${code}`);
    }
});