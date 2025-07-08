console.log('🔍 Teste básico de conectividade...');

// Dados de conexão do Railway
const connectionData = {
  host: 'interchange.proxy.rlwy.net',
  port: 20484,
  database: 'railway',
  user: 'postgres',
  password: 'WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu'
};

console.log('📋 Dados de conexão:');
console.log('   Host:', connectionData.host);
console.log('   Port:', connectionData.port);
console.log('   Database:', connectionData.database);
console.log('   User:', connectionData.user);
console.log('   Password:', connectionData.password ? '***' + connectionData.password.slice(-4) : 'Não definida');

// Testar conectividade básica
const net = require('net');

console.log('🔌 Testando conectividade TCP...');

const socket = new net.Socket();
const timeout = 10000; // 10 segundos

socket.setTimeout(timeout);

socket.on('connect', () => {
  console.log('✅ Conexão TCP estabelecida com sucesso!');
  console.log('🌐 O servidor Railway está acessível');
  socket.destroy();
  
  // Agora tentar carregar o módulo pg
  console.log('📦 Verificando módulo PostgreSQL...');
  
  try {
    const pg = require('pg');
    console.log('✅ Módulo pg carregado com sucesso!');
    
    // Testar conexão PostgreSQL
    testPostgreSQL();
    
  } catch (error) {
    console.log('❌ Módulo pg não encontrado:', error.message);
    console.log('📦 Execute: npm install pg');
    console.log('🔧 Ou execute: node install-and-test.js');
  }
});

socket.on('timeout', () => {
  console.log('⏰ Timeout na conexão TCP');
  console.log('🌐 Verifique sua conexão com a internet');
  socket.destroy();
});

socket.on('error', (error) => {
  console.log('❌ Erro na conexão TCP:', error.message);
  
  if (error.code === 'ENOTFOUND') {
    console.log('🌐 Problema de DNS - verifique sua conexão com a internet');
  } else if (error.code === 'ECONNREFUSED') {
    console.log('🚫 Conexão recusada - o Railway pode estar inativo');
  } else if (error.code === 'ETIMEDOUT') {
    console.log('⏰ Timeout - conexão muito lenta ou bloqueada');
  }
  
  socket.destroy();
});

// Conectar
socket.connect(connectionData.port, connectionData.host);

// Função para testar PostgreSQL (se o módulo estiver disponível)
async function testPostgreSQL() {
  try {
    const { Pool } = require('pg');
    
    const pool = new Pool({
      host: connectionData.host,
      port: connectionData.port,
      database: connectionData.database,
      user: connectionData.user,
      password: connectionData.password,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('🔧 Pool PostgreSQL criado');
    console.log('🔌 Tentando conectar ao PostgreSQL...');
    
    const client = await pool.connect();
    console.log('✅ Conexão PostgreSQL estabelecida com sucesso!');
    
    // Testar query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('🕐 Hora do servidor:', result.rows[0].current_time);
    console.log('🗄️  Versão PostgreSQL:', result.rows[0].pg_version.split(' ')[0]);
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 Tabelas existentes:', tables.rows.length);
    if (tables.rows.length > 0) {
      tables.rows.forEach(row => console.log('   -', row.table_name));
    } else {
      console.log('   (Nenhuma tabela encontrada - banco vazio)');
    }
    
    client.release();
    await pool.end();
    
    console.log('🎉 Teste PostgreSQL concluído com sucesso!');
    console.log('✅ Railway PostgreSQL está funcionando perfeitamente!');
    
  } catch (error) {
    console.error('❌ Erro PostgreSQL:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Conexão recusada - verifique se o Railway está ativo');
    } else if (error.message.includes('password')) {
      console.error('🔐 Problema de autenticação - verifique usuário/senha');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Problema de DNS/rede');
    }
  }
}