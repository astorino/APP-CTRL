import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import GlobalStyles from './styles/GlobalStyles';
import Navigation from './components/Navigation/Navigation';
import Modal from './components/Modal/Modal';
import AccessibilitySettings from './components/AccessibilitySettings/AccessibilitySettings';
import ReactDOM from 'react-dom';

// Importar páginas (placeholders por enquanto)
const Dashboard = () => <div style={{ padding: '20px' }}><h1>Dashboard</h1><p>Conteúdo do Dashboard virá aqui.</p></div>;
const Transactions = () => <div style={{ padding: '20px' }}><h1>Transações</h1><p>Conteúdo de Transações virá aqui.</p></div>;
const Debts = () => <div style={{ padding: '20px' }}><h1>Dívidas</h1><p>Conteúdo de Dívidas virá aqui.</p></div>;
const Reports = () => <div style={{ padding: '20px' }}><h1>Relatórios</h1><p>Conteúdo de Relatórios virá aqui.</p></div>;
const Profile = () => <div style={{ padding: '20px' }}><h1>Perfil</h1><p>Conteúdo de Perfil virá aqui.</p></div>;
const NotFound = () => <div style={{ padding: '20px' }}><h1>Página não encontrada</h1><p>A página que você está procurando não existe.</p></div>;

const App: React.FC = () => {
  // Estado para controlar a exibição do modal de configurações de acessibilidade
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  
  // Efeito para inicializar o axe-core para testes de acessibilidade em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const axe = require('@axe-core/react');
      axe.default(React, ReactDOM, 1000);
    }
  }, []);
  
  // Função para abrir o modal de configurações de acessibilidade
  const openAccessibilityModal = () => {
    setIsAccessibilityModalOpen(true);
  };
  
  // Função para fechar o modal de configurações de acessibilidade
  const closeAccessibilityModal = () => {
    setIsAccessibilityModalOpen(false);
  };
  
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <Router>
          <GlobalStyles />
          
          <div className="app-container">
            <Navigation onOpenAccessibilitySettings={openAccessibilityModal} />
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Modal
              isOpen={isAccessibilityModalOpen}
              onClose={closeAccessibilityModal}
              title="Configurações de Acessibilidade"
              ariaLabel="Configurações de acessibilidade"
              size="medium"
            >
              <AccessibilitySettings />
            </Modal>
          </div>
        </Router>
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

export default App;