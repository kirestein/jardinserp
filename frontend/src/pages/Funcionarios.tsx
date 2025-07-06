import React, { useState, useEffect } from 'react';
import { funcionarioService, cargoService } from '../services/api';
import { Funcionario, Cargo } from '../types';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Users, CreditCard, Eye } from 'lucide-react';

const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    data_nascimento: '',
    endereco: '',
    cargo_id: '',
    data_admissao: '',
    status: 'ativo' as 'ativo' | 'inativo'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [funcionariosData, cargosData] = await Promise.all([
        funcionarioService.getAll(),
        cargoService.getAll()
      ]);
      setFuncionarios(funcionariosData);
      setCargos(cargosData);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      if (selectedFile) {
        formDataToSend.append('foto', selectedFile);
      }

      if (editingFuncionario) {
        await funcionarioService.update(editingFuncionario.id, formDataToSend);
        toast.success('Funcionário atualizado com sucesso!');
      } else {
        await funcionarioService.create(formDataToSend);
        toast.success('Funcionário criado com sucesso!');
      }

      setShowModal(false);
      setEditingFuncionario(null);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar funcionário');
    }
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      email: funcionario.email,
      telefone: funcionario.telefone || '',
      cpf: funcionario.cpf,
      data_nascimento: funcionario.data_nascimento || '',
      endereco: funcionario.endereco || '',
      cargo_id: funcionario.cargo_id?.toString() || '',
      data_admissao: funcionario.data_admissao,
      status: funcionario.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este funcionário?')) {
      try {
        await funcionarioService.delete(id);
        toast.success('Funcionário deletado com sucesso!');
        loadData();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao deletar funcionário');
      }
    }
  };

  const handleShowBadge = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setShowBadgeModal(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      data_nascimento: '',
      endereco: '',
      cargo_id: '',
      data_admissao: '',
      status: 'ativo'
    });
    setSelectedFile(null);
  };

  const openModal = () => {
    resetForm();
    setEditingFuncionario(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFuncionario(null);
    resetForm();
  };

  const closeBadgeModal = () => {
    setShowBadgeModal(false);
    setSelectedFuncionario(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const printBadge = () => {
    window.print();
  };

  if (loading) {
    return <div className="loading">Carregando funcionários...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <Users size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Gerenciar Funcionários
        </h1>
        <button onClick={openModal} className="btn btn-primary">
          <Plus size={16} />
          Novo Funcionário
        </button>
      </div>

      <div className="card">
        {funcionarios.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum funcionário cadastrado</h3>
            <p>Clique em "Novo Funcionário" para começar</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Data Admissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>
                    {funcionario.foto ? (
                      <img
                        src={`http://localhost:3001/uploads/${funcionario.foto}`}
                        alt={funcionario.nome}
                        className="employee-photo"
                      />
                    ) : (
                      <div className="employee-photo" style={{ 
                        backgroundColor: '#f0f0f0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#666'
                      }}>
                        <Users size={24} />
                      </div>
                    )}
                  </td>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.email}</td>
                  <td>{funcionario.cargo_nome || 'Não definido'}</td>
                  <td>
                    <span className={`status-badge status-${funcionario.status}`}>
                      {funcionario.status}
                    </span>
                  </td>
                  <td>{formatDate(funcionario.data_admissao)}</td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => handleShowBadge(funcionario)}
                        className="btn btn-success"
                        style={{ padding: '6px 12px' }}
                        title="Gerar Crachá"
                      >
                        <CreditCard size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(funcionario)}
                        className="btn btn-warning"
                        style={{ padding: '6px 12px' }}
                        title="Editar"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(funcionario.id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px' }}
                        title="Deletar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Funcionário */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h2>
              <button onClick={closeModal} className="close-btn">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome Completo:</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Telefone:</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="form-control"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CPF:</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="form-control"
                    required
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Endereço:</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="form-control"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div className="form-row three-cols">
                <div className="form-group">
                  <label className="form-label">Data de Nascimento:</label>
                  <input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Admissão:</label>
                  <input
                    type="date"
                    value={formData.data_admissao}
                    onChange={(e) => setFormData({ ...formData, data_admissao: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ativo' | 'inativo' })}
                    className="form-control"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cargo:</label>
                  <select
                    value={formData.cargo_id}
                    onChange={(e) => setFormData({ ...formData, cargo_id: e.target.value })}
                    className="form-control"
                  >
                    <option value="">Selecione um cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>
                        {cargo.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Foto:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="actions" style={{ marginTop: '24px' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFuncionario ? 'Atualizar' : 'Criar'} Funcionário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Crachá */}
      {showBadgeModal && selectedFuncionario && (
        <div className="modal-overlay" onClick={closeBadgeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Crachá do Funcionário</h2>
              <button onClick={closeBadgeModal} className="close-btn">
                ×
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <button onClick={printBadge} className="btn btn-primary">
                Imprimir Crachá
              </button>
            </div>

            <div className="badge-preview">
              <div className="badge-header">
                <div className="badge-company">EMPRESA LTDA</div>
                <div className="badge-title">CRACHÁ DE IDENTIFICAÇÃO</div>
              </div>
              
              <div className="badge-content">
                {selectedFuncionario.foto ? (
                  <img
                    src={`http://localhost:3001/uploads/${selectedFuncionario.foto}`}
                    alt={selectedFuncionario.nome}
                    className="badge-photo"
                  />
                ) : (
                  <div className="badge-photo" style={{ 
                    backgroundColor: '#f0f0f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#666'
                  }}>
                    <Users size={32} />
                  </div>
                )}
                
                <div className="badge-name">{selectedFuncionario.nome}</div>
                <div className="badge-position">{selectedFuncionario.cargo_nome || 'Funcionário'}</div>
                <div className="badge-id">ID: {selectedFuncionario.id.toString().padStart(6, '0')}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              <p><strong>CPF:</strong> {formatCPF(selectedFuncionario.cpf)}</p>
              <p><strong>Email:</strong> {selectedFuncionario.email}</p>
              <p><strong>Data de Admissão:</strong> {formatDate(selectedFuncionario.data_admissao)}</p>
              {selectedFuncionario.telefone && (
                <p><strong>Telefone:</strong> {selectedFuncionario.telefone}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funcionarios;