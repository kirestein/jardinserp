const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'funcionarios.db');
const db = new sqlite3.Database(dbPath);

// Inicializar tabelas
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

  // Inserir usuário admin padrão
  const bcrypt = require('bcryptjs');
  const senhaHash = bcrypt.hashSync('admin123', 10);
  
  db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, tipo) 
          VALUES ('Administrador', 'admin@sistema.com', ?, 'admin')`, [senhaHash]);

  // Inserir alguns cargos de exemplo
  db.run(`INSERT OR IGNORE INTO cargos (nome, carga_horaria, tipo_pagamento, valor) 
          VALUES 
          ('Desenvolvedor', 40, 'salario', 5000.00),
          ('Analista', 40, 'salario', 4000.00),
          ('Estagiário', 20, 'hora', 15.00)`);
});

module.exports = db;