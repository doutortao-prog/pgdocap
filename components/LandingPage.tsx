import React, { useState } from 'react';
import { 
  ArrowRight, CheckCircle2, Star, TrendingUp, ShieldCheck, Zap, 
  Target, Users, BookOpen, Gift, Award, Play, Check, ChevronDown, ChevronUp, EyeOff,
  LogIn
} from 'lucide-react';
import { PageConfig } from '../types';

interface LandingPageProps {
  onOpenLogin?: () => void;
  onOpenPricing?: () => void;
  onOpenSignupFree?: () => void;
  config?: PageConfig;
  isPreview?: boolean;
}

// Configuração padrão completa - TEMA: Venda do SaaS Páginas do Capitão
export const defaultPageConfig: PageConfig = {
  colors: {
    primary: '#0f172a', // Navy Blue (Capitão)
    secondary: '#3b82f6', // Ocean Blue
    background: '#ffffff',
    text: '#1e293b'
  },
  hero: {
    enabled: true,
    badge: "Versão 2.0: A Inteligência Artificial chegou ao seu negócio",
    headline: "Crie Páginas de Vendas que Vendem Sozinhas com o Poder da IA",
    subheadline: "O Páginas do Capitão é a plataforma definitiva para quem quer lançar rápido, converter mais e assumir o comando do faturamento. Sem designers caros, sem código.",
    headlineSize: 60, // ~text-6xl
    subheadlineSize: 20, // ~text-xl
    ctaButton: "Começar Agora",
    ctaLink: "#pricing",
    demoButton: "Ver a IA em Ação",
    demoLink: "#features"
  },
  about: {
    enabled: true,
    title: "Assuma o Leme do Seu Negócio Digital",
    description: "Você não precisa mais depender de agências lentas ou ferramentas complexas que exigem um doutorado para usar. O Páginas do Capitão foi desenvolvido para uma única função: converter visitantes em lucro líquido.",
    image: "https://picsum.photos/600/600?random=tech",
    checklist: [
      "IA Generativa que escreve sua copy e monta o layout em segundos",
      "Hospedagem de alta velocidade inclusa (sua página carrega instantaneamente)",
      "Dashboard administrativo seguro para gerenciar múltiplos projetos"
    ]
  },
  targetAudience: {
    enabled: true,
    title: "Quem precisa do Páginas do Capitão?",
    subtitle: "Desenvolvemos esta ferramenta para quem não tem tempo a perder com configurações técnicas.",
    items: [
      {
        title: "Infoprodutores",
        description: "Lance seus cursos e mentorias em tempo recorde. Valide ofertas novas toda semana sem custo adicional de desenvolvimento.",
        active: true
      },
      {
        title: "Agências de Marketing",
        description: "Entregue LPs para seus clientes em minutos, não dias. Aumente sua margem de lucro usando nossa IA para escalar a produção.",
        active: true
      },
      {
        title: "Dropshippers & E-com",
        description: "Crie páginas de produto únicas (Landing Pages) para suas ofertas vencedoras e fuja da concorrência dos marketplaces.",
        active: true
      }
    ]
  },
  features: {
    enabled: true,
    badge: "Tecnologia de Ponta",
    title: "O Arsenal Completo para Suas Vendas",
    items: [
      {
        title: "Geração Instantânea com IA",
        description: "Descreva seu produto e nossa IA escreve os textos, define os benefícios e estrutura a página inteira para você."
      },
      {
        title: "Editor Visual Intuitivo",
        description: "Não gosta de algo? Clique e edite. Altere cores, textos e imagens em tempo real com nosso painel lateral inteligente."
      },
      {
        title: "Foco em Conversão (Mobile First)",
        description: "Nossos modelos são testados exaustivamente. Garantimos que sua página fique perfeita em qualquer celular."
      }
    ]
  },
  curriculum: {
    enabled: true,
    title: "Treinamento Incluso: Aceleração Digital",
    description: "Ao assinar o Páginas do Capitão, você não leva apenas a ferramenta. Receba um treinamento completo de como estruturar sua oferta.",
    buttonText: "Ver Grade do Treinamento",
    items: [
      {
        title: "Fase 1: Configuração Expressa",
        duration: "1h 00m",
        lessons: ["Tour pela Plataforma", "Configurando seu Domínio", "Integração com Pixel"]
      },
      {
        title: "Fase 2: Engenharia de Prompts",
        duration: "2h 30m",
        lessons: ["Como pedir a copy perfeita para a IA", "Refinando personas", "Gerando bônus automáticos"]
      },
      {
        title: "Fase 3: Design & Persuasão",
        duration: "3h 15m",
        lessons: ["Psicologia das Cores", "Escolhendo Imagens que Vendem", "Hierarquia Visual"]
      },
      {
        title: "Fase 4: Tráfego para Landing Pages",
        duration: "4h 00m",
        lessons: ["Google Ads para LPs", "Facebook Ads Essencial", "Análise de Métricas no Dashboard"]
      }
    ]
  },
  bonus: {
    enabled: true,
    title: "Bônus de Lançamento",
    subtitle: "Garanta estes presentes exclusivos ao assinar hoje.",
    items: [
      {
        title: "Pack de Imagens Premium",
        description: "Acesso a um banco de imagens de alta conversão para usar em seus projetos sem direitos autorais.",
        value: "Vendido por: R$ 297"
      },
      {
        title: "50 Prompts Secretos",
        description: "Nossa lista pessoal de comandos para o Gemini criar ofertas irresistíveis em qualquer nicho.",
        value: "Vendido por: R$ 197"
      },
      {
        title: "Consultoria de Análise",
        description: "Uma análise gravada da sua primeira página feita pela nossa equipe de especialistas.",
        value: "Inestimável"
      }
    ]
  },
  testimonials: {
    enabled: true,
    title: "O que a Tripulação diz",
    subtitle: "Resultados reais de quem já está usando o Páginas do Capitão.",
    items: [
      {
        name: "Carlos Mendes",
        role: "Produtor Digital",
        text: "Eu levava 3 dias para subir uma página no WordPress. Com o Capitão, fiz minha página de captura em 15 minutos. A IA é assustadora de tão boa.",
        image: "https://picsum.photos/100/100?random=user1"
      },
      {
        name: "Juliana Paiva",
        role: "Dona de Agência",
        text: "Consegui demitir meu designer freelancer e aumentei meu lucro. O cliente fica impressionado com a velocidade que entregamos.",
        image: "https://picsum.photos/100/100?random=user2"
      },
      {
        name: "Roberto K.",
        role: "E-commerce",
        text: "A simplicidade é o ponto forte. Tudo está onde deveria estar. E o suporte é nota 10. Recomendo para todos.",
        image: "https://picsum.photos/100/100?random=user3"
      }
    ]
  },
  pricing: {
    enabled: true,
    title: "Embarque Agora",
    subtitle: "Escolha o plano ideal e comece a vender ainda hoje.",
    price: "A partir de R$ 97/mês",
    buttonText: "Assinar Agora",
    buttonLink: "#checkout",
    guarantee: "Risco Zero: Teste por 7 dias grátis."
  }
};

const SectionWrapper: React.FC<{ id?: string; enabled: boolean; isPreview: boolean; children: React.ReactNode }> = ({ id, enabled, isPreview, children }) => {
  if (!enabled && !isPreview) return null;

  return (
    <div id={id} className={`relative transition-all duration-300 ${!enabled ? 'filter grayscale blur-sm opacity-40 pointer-events-none select-none' : ''}`}>
      {!enabled && isPreview && (
         <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="bg-black/80 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-xl">
               <EyeOff className="w-5 h-5" /> Seção Oculta
            </div>
         </div>
      )}
      {children}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenPricing, onOpenSignupFree, config = defaultPageConfig, isPreview = false }) => {
  const [activeModule, setActiveModule] = useState<number | null>(0);
  const [isCurriculumExpanded, setIsCurriculumExpanded] = useState(false);

  const primaryStyle = { color: config.colors.primary };
  const bgPrimaryStyle = { backgroundColor: config.colors.primary };
  const bgSecondaryStyle = { backgroundColor: config.colors.secondary };
  const gradientText = {
    backgroundImage: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.primary})`
  };

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    if (isPreview) {
      e.preventDefault();
      // Em modo preview, não faz nada ou mostra um alerta sutil
      return;
    }
    // Comportamento normal do link
  };

  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Logic to show only 4 items or all items
  const displayedModules = isCurriculumExpanded 
    ? config.curriculum.items 
    : config.curriculum.items.slice(0, 4);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: config.colors.background, color: config.colors.text }}>
      {/* Sticky Header */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={bgPrimaryStyle}
              >
                C
              </div>
              <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
                Páginas do<span style={primaryStyle}>Capitão</span>
              </span>
            </div>
            
            {/* Navigation Menu */}
            {!isPreview && onOpenLogin && (
              <div className="hidden md:flex items-center gap-8">
                <button 
                  onClick={onOpenSignupFree || onOpenLogin}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Quero testar grátis
                </button>
                <button 
                  onClick={onOpenPricing || onOpenLogin}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cadastrar
                </button>
                <button 
                  onClick={onOpenLogin}
                  className="px-5 py-2 rounded-lg text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  style={bgPrimaryStyle}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              </div>
            )}

            {/* Mobile Menu Button / Fallback for Preview */}
            {(isPreview || !onOpenLogin) && (
               <div className="w-8"></div> // Spacer
            )}
            
            {/* Mobile Hamburger (Simplified) */}
            {!isPreview && onOpenLogin && (
              <div className="md:hidden flex items-center gap-4">
                 <button 
                  onClick={onOpenLogin}
                  className="text-sm font-bold text-indigo-600"
                >
                  Entrar
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <SectionWrapper id="preview-section-hero" enabled={config.hero.enabled} isPreview={isPreview}>
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(ellipse at top right, ${config.colors.primary}15, transparent)` }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-semibold mb-8 hover:bg-indigo-100 transition-colors cursor-default" style={{ color: config.colors.primary, borderColor: `${config.colors.primary}30`, backgroundColor: `${config.colors.primary}10` }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={bgPrimaryStyle}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={bgSecondaryStyle}></span>
                </span>
                {config.hero.badge}
              </div>
              <h1 
                className="font-black tracking-tight mb-8 leading-tight" 
                style={{ 
                  color: config.colors.text,
                  fontSize: `${config.hero.headlineSize}px`
                }}
              >
                {config.hero.headline.split(' ').slice(0, -3).join(' ')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r animate-gradient-x" style={gradientText}>
                  {config.hero.headline.split(' ').slice(-3).join(' ')}
                </span>
              </h1>
              <p 
                className="text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                style={{ fontSize: `${config.hero.subheadlineSize}px` }}
              >
                {config.hero.subheadline}
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <a 
                  href={config.hero.ctaLink}
                  onClick={(e) => handleLinkClick(e, config.hero.ctaLink)}
                  className="w-full sm:w-auto px-10 py-5 text-white font-bold rounded-2xl shadow-xl transform transition hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 text-lg"
                  style={bgPrimaryStyle}
                >
                  {config.hero.ctaButton}
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href={config.hero.demoLink}
                  onClick={(e) => handleLinkClick(e, config.hero.demoLink)}
                  className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold rounded-2xl flex items-center justify-center gap-3 text-lg transition-colors shadow-sm hover:shadow-md"
                >
                  <Play className="w-5 h-5 fill-current" />
                  {config.hero.demoButton}
                </a>
              </div>
              <div className="mt-10 flex items-center justify-center gap-4 text-sm font-medium text-gray-500">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=1" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=2" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/100/100?random=3" alt="User" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-bold">+2k</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p>Aprovado por +2.000 Capitães</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* O QUE É (What is it) */}
      <SectionWrapper id="preview-section-about" enabled={config.about.enabled} isPreview={isPreview}>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-5/12 relative">
                <div className="absolute -inset-4 bg-indigo-600/10 rounded-3xl transform -rotate-2" style={{ backgroundColor: `${config.colors.primary}15` }}></div>
                <img 
                  src={config.about.image} 
                  alt="Overview" 
                  className="relative rounded-2xl shadow-xl w-full h-96 object-cover"
                />
              </div>
              <div className="md:w-7/12">
                <span className="font-bold tracking-wider uppercase text-sm" style={primaryStyle}>Tecnologia Embarcada</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4" style={{ color: config.colors.text }}>
                  {config.about.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {config.about.description}
                </p>
                
                <ul className="space-y-4 mt-8">
                  {config.about.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full text-white shrink-0" style={{ backgroundColor: '#22c55e' }}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* PARA QUEM (Target Audience) */}
      <SectionWrapper id="preview-section-audience" enabled={config.targetAudience.enabled} isPreview={isPreview}>
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{config.targetAudience.title}</h2>
              <p className="text-lg text-gray-600">{config.targetAudience.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {config.targetAudience.items.filter(item => item.active !== false).map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 hover:transform hover:-translate-y-2 transition-all duration-300" style={{ borderColor: idx === 0 ? config.colors.primary : idx === 1 ? config.colors.secondary : '#db2777' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: idx === 0 ? `${config.colors.primary}15` : idx === 1 ? `${config.colors.secondary}15` : '#db277715' }}>
                    {idx === 0 && <Target className="w-7 h-7" style={primaryStyle} />}
                    {idx === 1 && <Users className="w-7 h-7" style={{ color: config.colors.secondary }} />}
                    {idx >= 2 && <BookOpen className="w-7 h-7 text-pink-600" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* DIFERENCIAIS (Features) */}
      <SectionWrapper id="preview-section-features" enabled={config.features.enabled} isPreview={isPreview}>
        <section id="features" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 -skew-x-12 z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="font-bold tracking-wider uppercase text-sm" style={primaryStyle}>{config.features.badge}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">{config.features.title}</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {config.features.items.map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300">
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    style={{ backgroundColor: idx === 0 ? config.colors.primary : idx === 1 ? config.colors.secondary : '#2563eb' }}
                  >
                    {idx === 0 && <TrendingUp className="w-8 h-8 text-white" />}
                    {idx === 1 && <ShieldCheck className="w-8 h-8 text-white" />}
                    {idx === 2 && <Zap className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* CONTEÚDO DO PRODUTO (Curriculum) */}
      <SectionWrapper id="preview-section-curriculum" enabled={config.curriculum.enabled} isPreview={isPreview}>
        <section className="py-24 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3">
                <span className="font-bold tracking-wider uppercase text-sm" style={{ color: config.colors.primary }}>Conteúdo Incluso</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">{config.curriculum.title}</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  {config.curriculum.description}
                </p>
                {config.curriculum.items.length > 4 ? (
                  <button 
                    onClick={() => setIsCurriculumExpanded(!isCurriculumExpanded)}
                    className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    {isCurriculumExpanded ? "Ver Menos" : config.curriculum.buttonText}
                    {isCurriculumExpanded ? <ChevronUp className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                ) : (
                  <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-default">
                    Detalhes Abaixo
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="md:w-2/3">
                <div className="space-y-4">
                  {displayedModules.map((module, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 border border-gray-700 hover:border-indigo-500">
                      <button 
                        onClick={() => setActiveModule(activeModule === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeModule === idx ? 'text-white' : 'bg-gray-700 text-gray-400'}`}
                            style={activeModule === idx ? bgPrimaryStyle : {}}
                          >
                            {idx + 1}
                          </div>
                          <h3 className={`text-lg font-bold ${activeModule === idx ? 'text-white' : 'text-gray-300'}`}>{module.title}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono text-gray-500 hidden sm:block">{module.duration}</span>
                          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${activeModule === idx ? 'transform rotate-180' : ''}`} />
                        </div>
                      </button>
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeModule === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-6 pt-0 pl-16 border-t border-gray-700/50">
                          <ul className="space-y-3 mt-4">
                            {module.lessons.map((lesson, lIdx) => (
                              <li key={lIdx} className="flex items-center gap-3 text-gray-400 text-sm">
                                <Play className="w-3 h-3 fill-current" style={{ color: config.colors.primary }} />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!isCurriculumExpanded && config.curriculum.items.length > 4 && (
                    <div className="text-center pt-4 text-gray-500 text-sm italic">
                      + {config.curriculum.items.length - 4} outros módulos
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* BONUS */}
      <SectionWrapper id="preview-section-bonus" enabled={config.bonus.enabled} isPreview={isPreview}>
        <section className="py-24 text-white relative overflow-hidden" style={{ backgroundImage: `linear-gradient(to bottom right, ${config.colors.primary}, ${config.colors.secondary})` }}>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{config.bonus.title}</h2>
              <p className="text-indigo-100 text-lg">{config.bonus.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {config.bonus.items.map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                  {idx === 0 && <Gift className="w-10 h-10 text-yellow-300 mb-6" />}
                  {idx === 1 && <BookOpen className="w-10 h-10 text-yellow-300 mb-6" />}
                  {idx === 2 && <Award className="w-10 h-10 text-yellow-300 mb-6" />}
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-indigo-100 text-sm mb-4">{item.description}</p>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* DEPOIMENTOS (Testimonials) */}
      <SectionWrapper id="preview-section-testimonials" enabled={config.testimonials.enabled} isPreview={isPreview}>
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{config.testimonials.title}</h2>
              <p className="text-lg text-gray-600">{config.testimonials.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {config.testimonials.items.map((t, idx) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-2xl relative">
                  <div className="absolute -top-4 left-8 text-6xl font-serif leading-none" style={{ color: `${config.colors.primary}30` }}>"</div>
                  <p className="text-gray-700 italic mb-6 relative z-10 pt-4">{t.text}</p>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* Pricing CTA */}
      <SectionWrapper id="preview-section-pricing" enabled={config.pricing.enabled} isPreview={isPreview}>
        <section id="pricing" className="py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-[100px] opacity-30" style={bgPrimaryStyle}></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full blur-[100px] opacity-30" style={bgSecondaryStyle}></div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{config.pricing.title}</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              {config.pricing.subtitle}
            </p>
            <div className="flex flex-col items-center">
              <a 
                href={config.pricing.buttonLink}
                onClick={(e) => handleLinkClick(e, config.pricing.buttonLink)}
                className="px-12 py-6 bg-white text-gray-900 font-bold text-xl rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:bg-gray-100 hover:scale-105 transition-all duration-300 mb-6"
              >
                {config.pricing.buttonText} - {config.pricing.price}
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>{config.pricing.guarantee}</span>
              </div>
            </div>
          </div>
        </section>
      </SectionWrapper>

      {/* Footer */}
      <footer className="bg-white text-gray-500 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs" style={bgPrimaryStyle}>P</div>
            <span className="font-bold text-gray-900">Páginas do Capitão</span>
            <span className="text-xs ml-2">&copy; 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
