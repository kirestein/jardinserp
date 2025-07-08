// Configuração unificada do banco de dados
// Usa PostgreSQL se DATABASE_URL estiver definida, senão usa SQLite

const usePostgres = !!(process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL);

console.log(`🗄️  Usando banco de dados: ${usePostgres ? 'PostgreSQL' : 'SQLite'}`);

if (usePostgres) {
  // Usar PostgreSQL
  const postgres = require('./database-postgres');
  
  // Inicializar tabelas na primeira execução
  postgres.initializeTables().catch(console.error);
  
  module.exports = {
    type: 'postgres',
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
  // Usar SQLite (desenvolvimento local)
  const sqlite = require('./database');
  
  module.exports = {
    type: 'sqlite',
    db: sqlite,
    
    // Métodos unificados
    run: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqlite.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    
    get: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqlite.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        });
      });
    },
    
    all: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqlite.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });
    }
  };
}