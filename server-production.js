const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./backend/database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'seu_jwt_secret_aqui_mude_em_producao';

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (build)
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Servir uploads
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

// Configurar multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'backend/uploads/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'funcionario-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// ROTA DE HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ROTAS DE AUTENTICAÇÃO

// Login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    });
  });
});

// Registro de usuário
app.post('/api/register', (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const senhaHash = bcrypt.hashSync(senha, 10);

  db.run(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro ao criar usuário' });
      }

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        userId: this.lastID
      });
    }
  );
});

// ROTAS DE CARGOS

// Listar cargos
app.get('/api/cargos', authenticateToken, (req, res) => {
  db.all('SELECT * FROM cargos ORDER BY nome', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar cargos' });
    }
    res.json(rows);
  });
});

// Criar cargo
app.post('/api/cargos', authenticateToken, (req, res) => {
  const { nome, carga_horaria, tipo_pagamento, valor } = req.body;

  if (!nome || !carga_horaria || !tipo_pagamento || !valor) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.run(
    'INSERT INTO cargos (nome, carga_horaria, tipo_pagamento, valor) VALUES (?, ?, ?, ?)',
    [nome, carga_horaria, tipo_pagamento, valor],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao criar cargo' });
      }

      res.status(201).json({
        message: 'Cargo criado com sucesso',
        cargoId: this.lastID
      });
    }
  );
});

// Atualizar cargo
app.put('/api/cargos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nome, carga_horaria, tipo_pagamento, valor } = req.body;

  db.run(
    'UPDATE cargos SET nome = ?, carga_horaria = ?, tipo_pagamento = ?, valor = ? WHERE id = ?',
    [nome, carga_horaria, tipo_pagamento, valor, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar cargo' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cargo não encontrado' });
      }

      res.json({ message: 'Cargo atualizado com sucesso' });
    }
  );
});

// Deletar cargo
app.delete('/api/cargos/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM cargos WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar cargo' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cargo não encontrado' });
    }

    res.json({ message: 'Cargo deletado com sucesso' });
  });
});

// ROTAS DE FUNCIONÁRIOS

// Listar funcionários
app.get('/api/funcionarios', authenticateToken, (req, res) => {
  const query = `
    SELECT f.*, c.nome as cargo_nome, c.valor as cargo_valor, c.tipo_pagamento
    FROM funcionarios f
    LEFT JOIN cargos c ON f.cargo_id = c.id
    ORDER BY f.nome
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
    res.json(rows);
  });
});

// Buscar funcionário por ID
app.get('/api/funcionarios/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT f.*, c.nome as cargo_nome, c.valor as cargo_valor, c.tipo_pagamento
    FROM funcionarios f
    LEFT JOIN cargos c ON f.cargo_id = c.id
    WHERE f.id = ?
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json(row);
  });
});

// Criar funcionário
app.post('/api/funcionarios', authenticateToken, upload.single('foto'), (req, res) => {
  const {
    nome, email, telefone, cpf, data_nascimento,
    endereco, cargo_id, data_admissao
  } = req.body;

  const foto = req.file ? req.file.filename : null;

  if (!nome || !email || !cpf || !data_admissao) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cpf, data_admissao' });
  }

  db.run(
    `INSERT INTO funcionarios 
     (nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, foto) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, foto],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
        }
        return res.status(500).json({ error: 'Erro ao criar funcionário' });
      }

      res.status(201).json({
        message: 'Funcionário criado com sucesso',
        funcionarioId: this.lastID
      });
    }
  );
});

// Atualizar funcionário
app.put('/api/funcionarios/:id', authenticateToken, upload.single('foto'), (req, res) => {
  const { id } = req.params;
  const {
    nome, email, telefone, cpf, data_nascimento,
    endereco, cargo_id, data_admissao, status
  } = req.body;

  let query = `UPDATE funcionarios SET 
               nome = ?, email = ?, telefone = ?, cpf = ?, 
               data_nascimento = ?, endereco = ?, cargo_id = ?, 
               data_admissao = ?, status = ?`;
  
  let params = [nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, status];

  if (req.file) {
    query += ', foto = ?';
    params.push(req.file.filename);
  }

  query += ' WHERE id = ?';
  params.push(id);

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ message: 'Funcionário atualizado com sucesso' });
  });
});

// Deletar funcionário
app.delete('/api/funcionarios/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM funcionarios WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar funcionário' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ message: 'Funcionário deletado com sucesso' });
  });
});

// Rota catch-all para servir o frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Aplicação disponível em: http://localhost:${PORT}`);
});