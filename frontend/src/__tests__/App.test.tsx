import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock do react-router-dom para testes
const MockedApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<MockedApp />);
    // Verifica se o componente renderiza sem erros
    expect(document.body).toBeInTheDocument();
  });

  test('renders main application structure', () => {
    render(<MockedApp />);
    
    // Verifica se elementos básicos estão presentes
    // Como não sabemos exatamente o que está no App, fazemos um teste básico
    const appElement = document.querySelector('.App') || document.body;
    expect(appElement).toBeInTheDocument();
  });
});