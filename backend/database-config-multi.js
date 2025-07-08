// Configuração unificada do banco de dados com suporte a múltiplos ambientes
const config = require('./config-environments');

console.log(`🗄️  Configurando banco para ambiente: ${config.name}`);

if (config.database.type === 'postgres') {
  // Usar PostgreSQL (staging/production)
  const postgres = require('./database-postgres');
  
  // Configurar URL do banco baseada no ambiente
  process.env.DATABASE_URL = config.database.url;
  
  // Inicializar tabelas na primeira execução
  postgres.initializeTables().catch(console.error);
  
  module.exports = {
    type: 'postgres',
    environment: config.environment,
    db: postgres,
    
    // Métodos unificados para compatibilidade
    run: async (sql, params = []) => {
      try {
        const result = await postgres.query(sql, params);
        return result;
      } catch (error) {
        console.error('Erro na query:', error);
        throw error;
      }
    },
    
    get: async (sql, params = []) => {
      try {
        const result = await postgres.query(sql, params);
        return result.rows[0] || null;
      } catch (error) {
        console.error('Erro na query:', error);
        throw error;
      }
    },
    
    all: async (sql, params = []) => {
      try {
        const result = await postgres.query(sql, params);
        return result.rows;
      } catch (error) {
        console.error('Erro na query:', error);
        throw error;
      }
    }
  };
  
} else {
  // Usar SQLite (development)
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const bcrypt = require('bcryptjs');

  const dbPath = path.join(__dirname, config.database.path);
  const db = new sqlite3.Database(dbPath);

  console.log(`📁 Banco SQLite: ${dbPath}`);

  // Inicializar tabelas SQLite
  db.serialize(() => {
    // Tabela de usuários
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de cargos
    db.run(`CREATE TABLE IF NOT EXISTS cargos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      carga_horaria INTEGER NOT NULL,
      tipo_pagamento TEXT NOT NULL CHECK(tipo_pagamento IN ('salario', 'hora')),
      valor DECIMAL(10,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de funcionários
    db.run(`CREATE TABLE IF NOT EXISTS funcionarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      telefone TEXT,
      cpf TEXT UNIQUE NOT NULL,
      data_nascimento DATE,
      endereco TEXT,
      cargo_id INTEGER,
      data_admissao DATE NOT NULL,
      status TEXT DEFAULT 'ativo' CHECK(status IN ('ativo', 'inativo')),
      foto TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cargo_id) REFERENCES cargos (id)
    )`);

    // Inserir dados de desenvolvimento
    const senhaHash = bcrypt.hashSync('admin123', 10);
    
    // Usuário admin para desenvolvimento
    db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo) 
            VALUES ('Admin Dev', 'admin@dev.com', ?, 'admin')`, [senhaHash]);

    // Usuários de teste
    const senhaTesteHash = bcrypt.hashSync('teste123', 10);
    db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo) 
            VALUES ('Usuário Teste', 'teste@dev.com', ?, 'user')`, [senhaTesteHash]);

    // Cargos de exemplo para desenvolvimento
    db.run(`INSERT OR IGNORE INTO cargos (nome, carga_horaria, tipo_pagamento, valor) 
            VALUES 
            ('Desenvolvedor Jr', 40, 'salario', 3500.00),
            ('Desenvolvedor Pleno', 40, 'salario', 5500.00),
            ('Desenvolvedor Senior', 40, 'salario', 8000.00),
            ('Estagiário Dev', 20, 'hora', 20.00),
            ('Analista QA', 40, 'salario', 4500.00)`);

    // Funcionários de teste
    db.run(`INSERT OR IGNORE INTO funcionarios (nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao) 
            VALUES 
            ('João Silva Teste', 'joao.teste@dev.com', '(11) 99999-0001', '000.000.001-01', '1990-01-15', 'Rua Teste, 123', 1, '2024-01-01'),
            ('Maria Santos Demo', 'maria.demo@dev.com', '(11) 99999-0002', '000.000.002-02', '1985-05-20', 'Av Demo, 456', 2, '2024-01-02'),
            ('Pedro Sandbox', 'pedro.sandbox@dev.com', '(11) 99999-0003', '000.000.003-03', '1992-08-10', 'Rua Sandbox, 789', 3, '2024-01-03')`);

    console.log('✅ Banco SQLite de desenvolvimento inicializado com dados de teste');
  });
  
  module.exports = {
    type: 'sqlite',
    environment: config.environment,
    db: db,
    
    // Métodos unificados
    run: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    
    get: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        });
      });
    },
    
    all: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });
    }
  };
}