// Teste simples de conexão PostgreSQL
console.log('🔍 Iniciando teste de conexão PostgreSQL...');

// Configurar variáveis de ambiente manualmente para teste
process.env.DATABASE_PUBLIC_URL = 'postgresql://postgres:WHoUMuKZgTBOtTGENtkrxWuTYPQNOhQu@interchange.proxy.rlwy.net:20484/railway';
process.env.NODE_ENV = 'production';

console.log('📍 URL configurada:', process.env.DATABASE_PUBLIC_URL ? '✅ Sim' : '❌ Não');

try {
  const { Pool } = require('pg');
  console.log('📦 Módulo pg carregado com sucesso');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_PUBLIC_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  console.log('🔧 Pool PostgreSQL criado');
  
  // Testar conexão
  async function testConnection() {
    try {
      console.log('🔌 Tentando conectar...');
      const client = await pool.connect();
      console.log('✅ Conexão estabelecida com sucesso!');
      
      // Testar query simples
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('🕐 Hora do servidor:', result.rows[0].current_time);
      console.log('🗄️  Versão PostgreSQL:', result.rows[0].pg_version.split(' ')[0]);
      
      // Verificar tabelas existentes
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      console.log('📋 Tabelas existentes:', tables.rows.length);
      tables.rows.forEach(row => console.log('   -', row.table_name));
      
      client.release();
      await pool.end();
      
      console.log('🎉 Teste concluído com sucesso!');
      console.log('✅ PostgreSQL Railway está funcionando perfeitamente!');
      
    } catch (error) {
      console.error('❌ Erro na conexão:', error.message);
      console.error('🔧 Detalhes do erro:', error.code || 'N/A');
      
      if (error.code === 'ENOTFOUND') {
        console.error('🌐 Problema de DNS/rede - verifique sua conexão com a internet');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('🚫 Conexão recusada - verifique se o Railway está ativo');
      } else if (error.message.includes('password')) {
        console.error('🔐 Problema de autenticação - verifique usuário/senha');
      }
      
      process.exit(1);
    }
  }
  
  testConnection();
  
} catch (error) {
  console.error('❌ Erro ao carregar dependências:', error.message);
  console.error('📦 Execute: npm install');
  process.exit(1);
}