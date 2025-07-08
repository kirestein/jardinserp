require('dotenv').config();

// Proteção para localhost
const { enforceLocalhostSafety } = require('./localhost-protection');
const safetyCheck = enforceLocalhostSafety();

// Configuração de ambientes
const environments = {
  development: {
    name: 'Development',
    database: {
      // Usar SQLite local para desenvolvimento
      type: 'sqlite',
      path: './funcionarios-dev.db'
    },
    server: {
      port: 3001,
      cors: '*'
    },
    jwt: {
      secret: 'dev_jwt_secret_simples',
      expiresIn: '24h'
    },
    upload: {
      maxFileSize: 5242880,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    }
  },

  staging: {
    name: 'Staging',
    database: {
      type: 'postgres',
      url: process.env.STAGING_DATABASE_URL || process.env.DATABASE_URL
    },
    server: {
      port: process.env.PORT || 3001,
      cors: process.env.STAGING_CORS_ORIGIN || '*'
    },
    jwt: {
      secret: process.env.STAGING_JWT_SECRET || 'staging_jwt_secret_change_me',
      expiresIn: '24h'
    },
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
      allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif']
    }
  },

  production: {
    name: 'Production',
    database: {
      type: 'postgres',
      url: process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL
    },
    server: {
      port: process.env.PORT || 3001,
      cors: process.env.CORS_ORIGIN || '*'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION',
      expiresIn: '24h'
    },
    upload: {
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
      allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif']
    }
  }
};

// Detectar ambiente atual
const currentEnv = process.env.NODE_ENV || 'development';
const config = environments[currentEnv];

if (!config) {
  throw new Error(`Ambiente '${currentEnv}' não configurado. Ambientes disponíveis: ${Object.keys(environments).join(', ')}`);
}

// Adicionar informações do ambiente atual
config.environment = currentEnv;
config.isDevelopment = currentEnv === 'development';
config.isStaging = currentEnv === 'staging';
config.isProduction = currentEnv === 'production';

// Log do ambiente atual
console.log(`🌍 Ambiente: ${config.name} (${currentEnv})`);
console.log(`🗄️  Banco: ${config.database.type}`);
console.log(`🚀 Porta: ${config.server.port}`);
console.log(`🔑 JWT: ${config.jwt.secret !== 'CHANGE_THIS_IN_PRODUCTION' ? '✅ Configurado' : '⚠️  Padrão'}`);

module.exports = config;