const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Função para inicializar as tabelas
async function initializeTables() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Tabela de usuários
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de cargos
    await client.query(`
      CREATE TABLE IF NOT EXISTS cargos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        carga_horaria INTEGER NOT NULL,
        tipo_pagamento VARCHAR(20) NOT NULL CHECK(tipo_pagamento IN ('salario', 'hora')),
        valor DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de funcionários
    await client.query(`
      CREATE TABLE IF NOT EXISTS funcionarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        cpf VARCHAR(14) UNIQUE NOT NULL,
        data_nascimento DATE,
        endereco TEXT,
        cargo_id INTEGER,
        data_admissao DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'ativo' CHECK(status IN ('ativo', 'inativo')),
        foto VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cargo_id) REFERENCES cargos (id)
      )
    `);

    // Verificar se já existe usuário admin
    const adminExists = await client.query(
      'SELECT id FROM usuarios WHERE email = $1',
      ['admin@sistema.com']
    );

    if (adminExists.rows.length === 0) {
      // Inserir usuário admin padrão
      const senhaHash = bcrypt.hashSync('admin123', 10);
      await client.query(
        'INSERT INTO usuarios (nome, email, senha, tipo) VALUES ($1, $2, $3, $4)',
        ['Administrador', 'admin@sistema.com', senhaHash, 'admin']
      );
    }

    // Verificar se já existem cargos
    const cargosExist = await client.query('SELECT COUNT(*) FROM cargos');
    
    if (parseInt(cargosExist.rows[0].count) === 0) {
      // Inserir alguns cargos de exemplo
      await client.query(`
        INSERT INTO cargos (nome, carga_horaria, tipo_pagamento, valor) VALUES 
        ('Desenvolvedor', 40, 'salario', 5000.00),
        ('Analista', 40, 'salario', 4000.00),
        ('Estagiário', 20, 'hora', 15.00)
      `);
    }

    await client.query('COMMIT');
    console.log('✅ Tabelas PostgreSQL inicializadas com sucesso!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao inicializar tabelas PostgreSQL:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Função para executar queries
async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Função para obter um cliente do pool
async function getClient() {
  return await pool.connect();
}

module.exports = {
  pool,
  query,
  getClient,
  initializeTables
};