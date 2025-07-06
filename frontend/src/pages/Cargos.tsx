import React, { useState, useEffect } from 'react';
import { cargoService } from '../services/api';
import { Cargo } from '../types';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';

const Cargos: React.FC = () => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    carga_horaria: '',
    tipo_pagamento: 'salario' as 'salario' | 'hora',
    valor: ''
  });

  useEffect(() => {
    loadCargos();
  }, []);

  const loadCargos = async () => {
    try {
      const data = await cargoService.getAll();
      setCargos(data);
    } catch (error) {
      toast.error('Erro ao carregar cargos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cargoData = {
        nome: formData.nome,
        carga_horaria: parseInt(formData.carga_horaria),
        tipo_pagamento: formData.tipo_pagamento,
        valor: parseFloat(formData.valor)
      };

      if (editingCargo) {
        await cargoService.update(editingCargo.id, cargoData);
        toast.success('Cargo atualizado com sucesso!');
      } else {
        await cargoService.create(cargoData);
        toast.success('Cargo criado com sucesso!');
      }

      setShowModal(false);
      setEditingCargo(null);
      resetForm();
      loadCargos();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar cargo');
    }
  };

  const handleEdit = (cargo: Cargo) => {
    setEditingCargo(cargo);
    setFormData({
      nome: cargo.nome,
      carga_horaria: cargo.carga_horaria.toString(),
      tipo_pagamento: cargo.tipo_pagamento,
      valor: cargo.valor.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este cargo?')) {
      try {
        await cargoService.delete(id);
        toast.success('Cargo deletado com sucesso!');
        loadCargos();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao deletar cargo');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      carga_horaria: '',
      tipo_pagamento: 'salario',
      valor: ''
    });
  };

  const openModal = () => {
    resetForm();
    setEditingCargo(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCargo(null);
    resetForm();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return <div className="loading">Carregando cargos...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          <Briefcase size={32} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Gerenciar Cargos
        </h1>
        <button onClick={openModal} className="btn btn-primary">
          <Plus size={16} />
          Novo Cargo
        </button>
      </div>

      <div className="card">
        {cargos.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum cargo cadastrado</h3>
            <p>Clique em "Novo Cargo" para começar</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome do Cargo</th>
                <th>Carga Horária</th>
                <th>Tipo de Pagamento</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {cargos.map((cargo) => (
                <tr key={cargo.id}>
                  <td>{cargo.nome}</td>
                  <td>{cargo.carga_horaria}h/semana</td>
                  <td>
                    {cargo.tipo_pagamento === 'salario' ? 'Salário Mensal' : 'Valor por Hora'}
                  </td>
                  <td>
                    {cargo.tipo_pagamento === 'salario' 
                      ? formatCurrency(cargo.valor)
                      : `${formatCurrency(cargo.valor)}/hora`
                    }
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => handleEdit(cargo)}
                        className="btn btn-warning"
                        style={{ padding: '6px 12px' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cargo.id)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px' }}
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCargo ? 'Editar Cargo' : 'Novo Cargo'}
              </h2>
              <button onClick={closeModal} className="close-btn">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do Cargo:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="form-control"
                  required
                  placeholder="Ex: Desenvolvedor, Analista, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Carga Horária (horas/semana):</label>
                  <input
                    type="number"
                    value={formData.carga_horaria}
                    onChange={(e) => setFormData({ ...formData, carga_horaria: e.target.value })}
                    className="form-control"
                    required
                    min="1"
                    max="60"
                    placeholder="40"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Pagamento:</label>
                  <select
                    value={formData.tipo_pagamento}
                    onChange={(e) => setFormData({ ...formData, tipo_pagamento: e.target.value as 'salario' | 'hora' })}
                    className="form-control"
                    required
                  >
                    <option value="salario">Salário Mensal</option>
                    <option value="hora">Valor por Hora</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {formData.tipo_pagamento === 'salario' ? 'Salário Mensal (R$):' : 'Valor por Hora (R$):'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="form-control"
                  required
                  min="0"
                  placeholder={formData.tipo_pagamento === 'salario' ? '5000.00' : '25.00'}
                />
              </div>

              <div className="actions" style={{ marginTop: '24px' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCargo ? 'Atualizar' : 'Criar'} Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cargos;