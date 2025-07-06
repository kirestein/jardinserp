import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      onLogin(response.token, response.user);
      toast.success('Login realizado com sucesso!');
      navigate('/funcionarios');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          <LogIn size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Entrar no Sistema
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha:</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="form-control"
              required
              placeholder="Sua senha"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', marginBottom: '8px' }}>
            Não tem uma conta?
          </p>
          <Link to="/register" className="btn btn-secondary">
            Criar nova conta
          </Link>
        </div>

        <div style={{ marginTop: '30px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4 style={{ marginBottom: '8px', fontSize: '14px', color: '#333' }}>Dados para teste:</h4>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
            <strong>Email:</strong> admin@sistema.com
          </p>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
            <strong>Senha:</strong> admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;