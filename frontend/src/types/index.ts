export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export interface Cargo {
  id: number;
  nome: string;
  carga_horaria: number;
  tipo_pagamento: 'salario' | 'hora';
  valor: number;
  created_at: string;
}

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf: string;
  data_nascimento?: string;
  endereco?: string;
  cargo_id?: number;
  cargo_nome?: string;
  cargo_valor?: number;
  tipo_pagamento?: string;
  data_admissao: string;
  status: 'ativo' | 'inativo';
  foto?: string;
  created_at: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}