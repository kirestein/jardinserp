require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// Configuração do SQLite
const dbPath = path.join(__dirname, 'funcionarios.db');
const sqliteDb = new sqlite3.Database(dbPath);

// Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateData() {
  console.log('🔄 Iniciando migração do SQLite para PostgreSQL...');
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Migrar usuários
    console.log('📋 Migrando usuários...');
    const usuarios = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    for (const usuario of usuarios) {
      await client.query(
        'INSERT INTO usuarios (nome, email, senha, tipo, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
        [usuario.nome, usuario.email, usuario.senha, usuario.tipo, usuario.created_at]
      );
    }
    console.log(`✅ ${usuarios.length} usuários migrados`);

    // Migrar cargos
    console.log('📋 Migrando cargos...');
    const cargos = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM cargos', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    for (const cargo of cargos) {
      await client.query(
        'INSERT INTO cargos (nome, carga_horaria, tipo_pagamento, valor, created_at) VALUES ($1, $2, $3, $4, $5)',
        [cargo.nome, cargo.carga_horaria, cargo.tipo_pagamento, cargo.valor, cargo.created_at]
      );
    }
    console.log(`✅ ${cargos.length} cargos migrados`);

    // Migrar funcionários
    console.log('📋 Migrando funcionários...');
    const funcionarios = await new Promise((resolve, reject) => {
      sqliteDb.all('SELECT * FROM funcionarios', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    for (const funcionario of funcionarios) {
      await client.query(
        `INSERT INTO funcionarios 
         (nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, status, foto, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
         ON CONFLICT (email) DO NOTHING`,
        [
          funcionario.nome, funcionario.email, funcionario.telefone, funcionario.cpf,
          funcionario.data_nascimento, funcionario.endereco, funcionario.cargo_id,
          funcionario.data_admissao, funcionario.status, funcionario.foto, funcionario.created_at
        ]
      );
    }
    console.log(`✅ ${funcionarios.length} funcionários migrados`);

    await client.query('COMMIT');
    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro na migração:', error);
    throw error;
  } finally {
    client.release();
    sqliteDb.close();
    await pool.end();
  }
}

// Executar migração se chamado diretamente
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✅ Migração finalizada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na migração:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };