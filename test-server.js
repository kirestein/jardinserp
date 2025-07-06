// Servidor de teste básico usando apenas módulos nativos do Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sistema de Funcionários - Teste</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: #f5f5f5;
                }
                .card {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .success { color: #28a745; }
                .info { color: #007bff; }
                .warning { color: #ffc107; }
                h1 { color: #333; }
                .step { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    margin: 10px 0; 
                    border-radius: 4px;
                    border-left: 4px solid #007bff;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>🚀 Sistema de Funcionários</h1>
                <p class="success">✅ Node.js está funcionando corretamente!</p>
                <p class="info">📍 Servidor de teste rodando na porta ${PORT}</p>
                
                <h2>📋 Próximos Passos:</h2>
                
                <div class="step">
                    <strong>1. Instalar Dependências</strong><br>
                    Abra um terminal e execute:<br>
                    <code>cd /home/kir3/sistema-funcionarios && node simple-install.js</code>
                </div>
                
                <div class="step">
                    <strong>2. Iniciar Sistema</strong><br>
                    Após a instalação, execute:<br>
                    <code>node start-system.js</code>
                </div>
                
                <div class="step">
                    <strong>3. Acessar Sistema</strong><br>
                    Frontend: <a href="http://localhost:3000">http://localhost:3000</a><br>
                    Login: admin@sistema.com / admin123
                </div>
                
                <h2>📁 Arquivos Criados:</h2>
                <ul>
                    <li>✅ Backend (Node.js + Express + SQLite)</li>
                    <li>✅ Frontend (React + TypeScript)</li>
                    <li>✅ Banco de dados (SQLite)</li>
                    <li>✅ Sistema de upload de fotos</li>
                    <li>✅ Geração de crachás</li>
                </ul>
                
                <p class="warning">⚠️ Para parar este servidor de teste, pressione Ctrl+C no terminal</p>
            </div>
        </body>
        </html>
    `);
});

server.listen(PORT, () => {
    console.log('🎉 Servidor de teste iniciado!');
    console.log(`📍 Acesse: http://localhost:${PORT}`);
    console.log('');
    console.log('✅ Node.js está funcionando corretamente!');
    console.log('');
    console.log('📋 Para instalar e executar o sistema completo:');
    console.log('   1. node simple-install.js');
    console.log('   2. node start-system.js');
    console.log('');
    console.log('⚠️  Pressione Ctrl+C para parar este servidor de teste');
});

// Tratar Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Parando servidor de teste...');
    server.close(() => {
        console.log('✅ Servidor parado');
        process.exit(0);
    });
});