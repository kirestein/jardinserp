require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Usar configuração de ambientes
const config = require('./config-environments');
const database = require('./database-config-multi');

const app = express();
const PORT = config.server.port;
const JWT_SECRET = config.jwt.secret;

console.log(`🚀 Iniciando servidor na porta ${PORT}`);
console.log(`🌍 Ambiente: ${config.name} (${config.environment})`);
console.log(`🔑 JWT Secret: ${JWT_SECRET !== 'CHANGE_THIS_IN_PRODUCTION' && JWT_SECRET !== 'seu_jwt_secret_aqui' ? '✅ Configurado' : '⚠️  Padrão'}`);

// Middleware
app.use(cors({
  origin: config.server.cors
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configurar multer para upload de fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
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

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  }
});

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

// ROTAS DE AUTENTICAÇÃO

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await database.get('SELECT * FROM usuarios WHERE email = $1', [email]);

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
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registro de usuário
app.post('/api/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);

    const result = await database.run(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, senhaHash]
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      userId: result.lastID || result.insertId
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    if (error.message.includes('duplicate key') || error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// ROTAS DE CARGOS

// Listar cargos
app.get('/api/cargos', authenticateToken, async (req, res) => {
  try {
    const cargos = await database.all('SELECT * FROM cargos ORDER BY nome');
    res.json(cargos);
  } catch (error) {
    console.error('Erro ao buscar cargos:', error);
    res.status(500).json({ error: 'Erro ao buscar cargos' });
  }
});

// Criar cargo
app.post('/api/cargos', authenticateToken, async (req, res) => {
  try {
    const { nome, carga_horaria, tipo_pagamento, valor } = req.body;

    if (!nome || !carga_horaria || !tipo_pagamento || !valor) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = await database.run(
      'INSERT INTO cargos (nome, carga_horaria, tipo_pagamento, valor) VALUES ($1, $2, $3, $4)',
      [nome, carga_horaria, tipo_pagamento, valor]
    );

    res.status(201).json({
      message: 'Cargo criado com sucesso',
      cargoId: result.lastID || result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar cargo:', error);
    res.status(500).json({ error: 'Erro ao criar cargo' });
  }
});

// Atualizar cargo
app.put('/api/cargos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, carga_horaria, tipo_pagamento, valor } = req.body;

    const result = await database.run(
      'UPDATE cargos SET nome = $1, carga_horaria = $2, tipo_pagamento = $3, valor = $4 WHERE id = $5',
      [nome, carga_horaria, tipo_pagamento, valor, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cargo não encontrado' });
    }

    res.json({ message: 'Cargo atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error);
    res.status(500).json({ error: 'Erro ao atualizar cargo' });
  }
});

// Deletar cargo
app.delete('/api/cargos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.run('DELETE FROM cargos WHERE id = $1', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cargo não encontrado' });
    }

    res.json({ message: 'Cargo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cargo:', error);
    res.status(500).json({ error: 'Erro ao deletar cargo' });
  }
});

// ROTAS DE FUNCIONÁRIOS

// Listar funcionários
app.get('/api/funcionarios', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT f.*, c.nome as cargo_nome, c.valor as cargo_valor, c.tipo_pagamento
      FROM funcionarios f
      LEFT JOIN cargos c ON f.cargo_id = c.id
      ORDER BY f.nome
    `;

    const funcionarios = await database.all(query);
    res.json(funcionarios);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

// Buscar funcionário por ID
app.get('/api/funcionarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT f.*, c.nome as cargo_nome, c.valor as cargo_valor, c.tipo_pagamento
      FROM funcionarios f
      LEFT JOIN cargos c ON f.cargo_id = c.id
      WHERE f.id = $1
    `;

    const funcionario = await database.get(query, [id]);

    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json(funcionario);
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ error: 'Erro ao buscar funcionário' });
  }
});

// Criar funcionário
app.post('/api/funcionarios', authenticateToken, upload.single('foto'), async (req, res) => {
  try {
    const {
      nome, email, telefone, cpf, data_nascimento,
      endereco, cargo_id, data_admissao
    } = req.body;

    const foto = req.file ? req.file.filename : null;

    if (!nome || !email || !cpf || !data_admissao) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cpf, data_admissao' });
    }

    const result = await database.run(
      `INSERT INTO funcionarios 
       (nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, foto) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, foto]
    );

    res.status(201).json({
      message: 'Funcionário criado com sucesso',
      funcionarioId: result.lastID || result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    if (error.message.includes('duplicate key') || error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar funcionário' });
  }
});

// Atualizar funcionário
app.put('/api/funcionarios/:id', authenticateToken, upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome, email, telefone, cpf, data_nascimento,
      endereco, cargo_id, data_admissao, status
    } = req.body;

    let query = `UPDATE funcionarios SET 
                 nome = $1, email = $2, telefone = $3, cpf = $4, 
                 data_nascimento = $5, endereco = $6, cargo_id = $7, 
                 data_admissao = $8, status = $9`;
    
    let params = [nome, email, telefone, cpf, data_nascimento, endereco, cargo_id, data_admissao, status];

    if (req.file) {
      query += ', foto = $10';
      params.push(req.file.filename);
    }

    query += ` WHERE id = $${params.length + 1}`;
    params.push(id);

    const result = await database.run(query, params);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ message: 'Funcionário atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});

// Deletar funcionário
app.delete('/api/funcionarios/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await database.run('DELETE FROM funcionarios WHERE id = $1', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado' });
    }

    res.json({ message: 'Funcionário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);
    res.status(500).json({ error: 'Erro ao deletar funcionário' });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    environment: config.environment,
    environmentName: config.name,
    database: database.type,
    server: {
      port: PORT,
      cors: config.server.cors
    },
    upload: {
      maxFileSize: config.upload.maxFileSize,
      allowedTypes: config.upload.allowedTypes
    },
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🗄️  Banco de dados: ${database.type}`);
  console.log(`🌐 CORS Origin: ${config.server.cors}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  
  if (config.isDevelopment) {
    console.log(`👤 Usuários de teste:`);
    console.log(`   • admin@dev.com / admin123 (admin)`);
    console.log(`   • teste@dev.com / teste123 (user)`);
  }
});