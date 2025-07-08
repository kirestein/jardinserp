require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testando conexão com PostgreSQL...');
  console.log('📍 URL:', process.env.DATABASE_PUBLIC_URL ? 'Configurada' : 'Não configurada');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar uma query simples
    const result = await client.query('SELECT NOW() as current_time');
    console.log('🕐 Hora do servidor:', result.rows[0].current_time);
    
    // Verificar se as tabelas existem
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Tabelas existentes:', tables.rows.map(row => row.table_name));
    
    client.release();
    await pool.end();
    
    console.log('🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('🔧 Verifique as configurações do banco de dados no arquivo .env');
    process.exit(1);
  }
}

testConnection();