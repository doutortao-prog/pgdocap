import React, { useState, useEffect } from 'react';
import { User, UserRole, Plan } from '../types';
import { X, Lock, User as UserIcon, AlertCircle, Anchor, Ship, Compass, Check, ArrowRight, ArrowLeft, Mail, Phone } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  plans: Plan[];
  initialView?: 'login' | 'register' | 'signup-free';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, plans, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register' | 'signup-free'>(initialView);
  
  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup Free States
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync view when initialView or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);

  const iconMap: Record<string, any> = {
    'weekly': Anchor,
    'monthly': Ship,
    'annual': Compass
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin({
          username: 'admin',
          role: UserRole.ADMIN,
          name: 'Administrador'
        });
        onClose();
      } else if (username === 'user' && password === 'user123') {
        onLogin({
          username: 'user',
          role: UserRole.USER,
          name: 'Cliente Vip'
        });
        onClose();
      } else if (username === 'capitao' && password === 'capitao123') {
        onLogin({
          username: 'capitao',
          role: UserRole.USER,
          name: 'Capitão Usuário'
        });
        onClose();
      } else {
        setError('Credenciais inválidas');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleFreeSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      onLogin({
        username: newEmail.split('@')[0],
        role: UserRole.FREE_USER,
        name: newName,
        email: newEmail,
        phone: newPhone
      });
      onClose();
      setIsLoading(false);
    }, 1000);
  };

  const handleRegisterSelect = (planName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        username: 'novousuario',
        role: UserRole.USER,
        name: `Novo ${planName}`
      });
      onClose();
      setIsLoading(false);
    }, 1500);
  };

  const activePlans = plans.filter(p => p.active);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full overflow-hidden transform transition-all duration-500 ease-in-out ${
          view === 'register' ? 'max-w-5xl' : 'max-w-md'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {view === 'login' && <><Lock className="w-5 h-5 text-indigo-600" /> Acesso Seguro</>}
            {view === 'register' && <><Ship className="w-6 h-6 text-indigo-600" /> Escolha seu Plano</>}
            {view === 'signup-free' && <><Anchor className="w-5 h-5 text-indigo-600" /> Teste Grátis</>}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-0">
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="p-6">
               <form onSubmit={handleLoginSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Usuário</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
                      placeholder="Digite seu usuário" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><label className="text-sm font-medium text-gray-700">Senha</label></div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all flex justify-center items-center">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Entrar no Sistema'}
                </button>
                
                <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
                  <button type="button" onClick={() => setView('signup-free')} className="w-full py-2.5 px-4 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                    Quero testar Grátis
                  </button>
                  <button type="button" onClick={() => setView('register')} className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors">
                    Ver planos completos
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SIGNUP FREE VIEW */}
          {view === 'signup-free' && (
            <div className="p-6">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Conta Gratuita:</strong> Crie até 2 páginas (rascunho) para testar nossa plataforma. Publicação requer upgrade.
                </p>
              </div>
              <form onSubmit={handleFreeSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
                      placeholder="Seu nome" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
                      placeholder="seu@email.com" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel" 
                      value={newPhone} 
                      onChange={(e) => setNewPhone(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
                      placeholder="(XX) 9XXXX-XXXX" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Crie uma Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900" 
                      placeholder="••••••••" 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all flex justify-center items-center mt-4">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Começar Teste Grátis'}
                </button>

                <div className="mt-4 text-center">
                   <button type="button" onClick={() => setView('login')} className="text-sm text-gray-500 hover:text-indigo-600 font-medium flex items-center justify-center gap-1 mx-auto">
                     <ArrowLeft className="w-3 h-3" /> Voltar para Login
                   </button>
                </div>
              </form>
            </div>
          )}

          {/* PRICING VIEW */}
          {view === 'register' && (
            <div className="bg-gray-50 p-6 md:p-8">
               <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-900">Selecione seu período de navegação</h2>
                 <p className="text-gray-500">Comece hoje mesmo a transformar visitantes em tesouros.</p>
               </div>
               <div className="grid md:grid-cols-3 gap-6">
                 {activePlans.map((plan) => {
                   const Icon = iconMap[plan.id] || Ship;
                   return (
                     <div key={plan.id} className={`relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-20 transform scale-105 z-10' : 'border-gray-200'}`}>
                       {plan.popular && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Mais Popular</div>}
                       <div className="p-6">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white ${plan.color}`}><Icon className="w-6 h-6" /></div>
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          <div className="flex items-baseline mt-2"><span className="text-3xl font-extrabold text-gray-900">{plan.price}</span><span className="text-gray-500 font-medium ml-1">{plan.period}</span></div>
                          <p className="text-sm text-gray-500 mt-4 leading-relaxed">{plan.description}</p>
                          <ul className="mt-6 space-y-3">
                            {plan.features.filter(f => f.trim() !== '').map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />{feature}</li>
                            ))}
                          </ul>
                          <button onClick={() => handleRegisterSelect(plan.name)} disabled={isLoading} className={`mt-8 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-700'}`}>
                            {isLoading ? 'Processando...' : 'Escolher este Plano'}
                          </button>
                       </div>
                     </div>
                   );
                 })}
               </div>
               <div className="mt-8 text-center">
                 <button onClick={() => initialView === 'register' ? onClose() : setView('login')} className="text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-2 mx-auto transition-colors">
                   <ArrowLeft className="w-4 h-4" /> {initialView === 'register' ? 'Voltar para o Site' : 'Voltar para Login'}
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;