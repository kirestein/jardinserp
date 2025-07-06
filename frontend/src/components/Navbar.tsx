import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Users, Briefcase, UserPlus } from 'lucide-react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/funcionarios" className="navbar-brand">
          Sistema de Funcionários
        </Link>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/funcionarios" 
              className={isActive('/funcionarios') ? 'active' : ''}
            >
              <Users size={16} />
              Funcionários
            </Link>
          </li>
          <li>
            <Link 
              to="/cargos" 
              className={isActive('/cargos') ? 'active' : ''}
            >
              <Briefcase size={16} />
              Cargos
            </Link>
          </li>
          <li>
            <Link 
              to="/register" 
              className={isActive('/register') ? 'active' : ''}
            >
              <UserPlus size={16} />
              Novo Usuário
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              <LogOut size={16} />
              Sair ({user?.nome})
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;