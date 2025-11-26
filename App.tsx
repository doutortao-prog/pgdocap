import React, { useState, useEffect } from 'react';
import LandingPage, { defaultPageConfig } from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LoginModal from './components/LoginModal';
import { User, ViewState, Page, Plan } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  
  // Persistência do Usuário
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('capitao_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalInitialView, setModalInitialView] = useState<'login' | 'register' | 'signup-free'>('login');

  // Persistência das Páginas
  const [pages, setPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem('capitao_pages');
    if (saved) {
      return JSON.parse(saved);
    }
    // Estado Inicial Padrão
    return [{ 
      id: 1, 
      title: "Páginas do Capitão", 
      thumbnail: "https://picsum.photos/400/250?random=100", 
      url: "/p/paginas-do-capitao", 
      status: "published", 
      lastModified: "Sistema", 
      config: defaultPageConfig 
    }];
  });

  // Persistência dos Planos
  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('capitao_plans');
    if (saved) {
      return JSON.parse(saved);
    }
    // Planos Padrão
    return [
      {
        id: 'weekly',
        name: 'Marinheiro',
        price: 'R$ 27',
        period: '/semana',
        description: 'Ideal para testes rápidos e lançamentos pontuais.',
        features: ['1 Landing Page Ativa', 'Editor Visual Básico', 'Hospedagem Inclusa', 'Suporte via Email'],
        color: 'bg-blue-500',
        popular: false,
        active: true
      },
      {
        id: 'monthly',
        name: 'Capitão',
        price: 'R$ 97',
        period: '/mês',
        description: 'O plano favorito. Potência total para seu negócio escalar.',
        features: ['5 Landing Pages Ativas', 'IA Geradora de Copy', 'Editor Avançado', 'Domínio Personalizado', 'Suporte Prioritário'],
        color: 'bg-indigo-600',
        popular: true,
        active: true
      },
      {
        id: 'annual',
        name: 'Almirante',
        price: 'R$ 997',
        period: '/ano',
        description: 'Economia máxima e acesso vitalício a novas features.',
        features: ['Páginas Ilimitadas', 'IA Ilimitada', 'Consultoria de Conversão', 'Acesso a Beta Features', 'Gerente de Conta'],
        color: 'bg-slate-800',
        popular: false,
        active: true
      }
    ];
  });

  // Efeitos para Salvar Dados Automaticamente
  useEffect(() => {
    localStorage.setItem('capitao_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem('capitao_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('capitao_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('capitao_user');
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const openLogin = () => {
    setModalInitialView('login');
    setIsLoginModalOpen(true);
  };

  const openPricing = () => {
    setModalInitialView('register');
    setIsLoginModalOpen(true);
  };

  const openSignupFree = () => {
    setModalInitialView('signup-free');
    setIsLoginModalOpen(true);
  };

  const closeLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleSimulateUser = () => {
    setCurrentView('hidden-captain');
  };

  const handleBackToAdmin = () => {
    setCurrentView('dashboard');
  };

  // Encontra a configuração da página principal (ID 1) para exibir no frontend
  const homePageConfig = pages.find(p => p.id === 1)?.config || defaultPageConfig;

  return (
    <div className="antialiased text-gray-900 bg-gray-50 min-h-screen">
      {currentView === 'landing' && (
        <>
          <LandingPage 
            onOpenLogin={openLogin} 
            onOpenPricing={openPricing}
            onOpenSignupFree={openSignupFree} 
            config={homePageConfig} 
          />
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={closeLogin} 
            onLogin={handleLogin} 
            plans={plans}
            initialView={modalInitialView}
          />
        </>
      )}

      {/* Renderização do Dashboard (Admin ou Usuário Comum) */}
      {currentView === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
          pages={pages}
          setPages={setPages}
          plans={plans}
          setPlans={setPlans}
          onSimulateUser={handleSimulateUser}
        />
      )}

      {/* Renderização do Dashboard em Modo Simulação (Visualização Oculta) */}
      {currentView === 'hidden-captain' && currentUser && (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          pages={pages}
          setPages={setPages}
          plans={plans}
          setPlans={setPlans}
          isSimulating={true}
          onExitSimulation={handleBackToAdmin}
        />
      )}
    </div>
  );
};

export default App;