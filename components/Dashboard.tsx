import React, { useState, useEffect } from 'react';
import { User, UserRole, Page, PageConfig, Plan } from '../types';
import LandingPage, { defaultPageConfig } from './LandingPage';
import { 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Sparkles, 
  BarChart, 
  PlayCircle, 
  Download,
  TrendingUp,
  Layout,
  Plus,
  Trash2,
  Edit,
  Link as LinkIcon,
  Copy,
  Save,
  AlertTriangle,
  X,
  Palette,
  Image as ImageIcon,
  Type,
  Eye,
  ArrowLeft,
  Upload,
  CreditCard,
  MessageSquare,
  Globe,
  List,
  Gift,
  Star,
  Bot,
  FileJson,
  Ship,
  Lock,
  DollarSign,
  Repeat,
  UserCheck,
  Crown,
  MousePointerClick,
  Menu
} from 'lucide-react';
import { generateMarketingCopy, generateLandingPageConfig } from '../services/geminiService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  plans: Plan[];
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
  isSimulating?: boolean;
  onExitSimulation?: () => void;
  onSimulateUser?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  onLogout, 
  pages, 
  setPages, 
  plans, 
  setPlans, 
  isSimulating = false, 
  onExitSimulation,
  onSimulateUser 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determine the effective role
  const viewRole = isSimulating ? UserRole.USER : user.role;

  // Admin AI State
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [fileContext, setFileContext] = useState('');
  const [fileName, setFileName] = useState('');
  const [generatedPageConfig, setGeneratedPageConfig] = useState<PageConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // Stats
  const [stats, setStats] = useState({ visits: 0, clicks: 0 });

  const [pageToDelete, setPageToDelete] = useState<number | null>(null);

  // Editor State
  const [editingPageId, setEditingPageId] = useState<number | null>(null);
  const [editingPageTitle, setEditingPageTitle] = useState('');
  const [editorConfig, setEditorConfig] = useState<PageConfig>(defaultPageConfig);
  const [activeEditorSection, setActiveEditorSection] = useState<string | null>('global');

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Calculated Stats
  const activePagesCount = pages.filter(p => p.status === 'published').length;
  const draftPagesCount = pages.filter(p => p.status === 'draft').length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        visits: 12450,
        clicks: 3890
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!activeEditorSection) return;
    if (activeEditorSection === 'global') {
      const container = document.getElementById('preview-scroll-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elementId = `preview-section-${activeEditorSection}`;
    const element = document.getElementById(elementId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeEditorSection]);

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // --- Helper Functions ---
  const getTabTitle = (tab: string) => {
      switch(tab) {
          case 'overview': return 'Dashboard';
          case 'marketing-ai': return 'IA Landing Page Generator';
          case 'my-pages': return 'Minhas Páginas';
          case 'plans': return 'Gerenciar Planos';
          default: return 'Dashboard';
      }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContext(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateFullPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || (!productDescription && !fileContext)) {
      setGenerationError("Por favor, forneça o nome do produto e uma descrição ou arquivo.");
      return;
    }

    setIsGenerating(true);
    setGenerationError('');
    setGeneratedPageConfig(null);

    try {
      const config = await generateLandingPageConfig(productName, productDescription, fileContext);
      setGeneratedPageConfig(config);
    } catch (err) {
      setGenerationError('Falha ao gerar página. Tente novamente em instantes.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePageFromAI = () => {
    if (!generatedPageConfig) return;

    const newPage: Page = {
      id: Date.now(),
      title: productName || "Nova Página IA",
      thumbnail: "https://picsum.photos/400/250?random=" + Date.now(),
      url: "/p/ia-" + Date.now(),
      status: 'draft',
      lastModified: 'Gerado por IA',
      config: generatedPageConfig
    };
    
    setPages([newPage, ...pages]);
    setGeneratedPageConfig(null);
    setProductName('');
    setProductDescription('');
    setFileContext('');
    setFileName('');
    
    handleEditPage(newPage);
  };

  const handleDeletePage = (id: number) => {
    if (id === 1) return; 
    setPages(pages.filter(p => p.id !== id));
    setPageToDelete(null);
  };

  const handlePublishPage = (id: number) => {
    if (viewRole === UserRole.FREE_USER) {
      setShowUpgradeModal(true);
      return;
    }

    setPages(pages.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'published' ? 'draft' : 'published' };
      }
      return p;
    }));
  };

  const handleEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setEditingPageTitle(page.title);
    setEditorConfig(page.config || defaultPageConfig);
  };

  const handleSavePage = () => {
    setPages(pages.map(p => p.id === editingPageId ? { 
      ...p, 
      config: editorConfig, 
      title: editingPageTitle,
      lastModified: 'Agora mesmo' 
    } : p));
    setEditingPageId(null);
    alert('Página salva com sucesso!');
  };

  const handleCreatePage = () => {
    if (viewRole === UserRole.FREE_USER && pages.length >= 2) {
      setShowUpgradeModal(true);
      return;
    }

    const newPage: Page = {
      id: Date.now(),
      title: "Nova Landing Page",
      thumbnail: "https://picsum.photos/400/250?random=" + Date.now(),
      url: "/p/nova-pagina-" + Date.now(),
      status: 'draft',
      lastModified: 'Agora mesmo',
      config: defaultPageConfig
    };
    setPages([newPage, ...pages]);
    handleEditPage(newPage);
  }

  const handleUpdatePlan = (id: string, field: keyof Plan, value: any) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id === id) {
        if (field === 'popular' && value === true) {
           return { ...plan, popular: true, active: true };
        }
        if (field === 'active' && value === false && plan.popular) {
           alert("O plano mais popular não pode ser desativado. Defina outro plano como popular primeiro.");
           return plan;
        }
        return { ...plan, [field]: value };
      }
      if (field === 'popular' && value === true) {
         return { ...plan, popular: false };
      }
      return plan;
    }));
  };

  const handleFeaturesChange = (id: string, text: string) => {
     const featuresArray = text.split('\n');
     handleUpdatePlan(id, 'features', featuresArray);
  };

  const updateConfig = (section: keyof PageConfig, key: string, value: any) => {
    setEditorConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };
  
  const updateDeepConfig = (section: keyof PageConfig, index: number, field: string, value: any) => {
     setEditorConfig(prev => {
         const newSection = { ...prev[section] };
         // @ts-ignore
         const newItems = [...newSection.items];
         newItems[index] = { ...newItems[index], [field]: value };
         // @ts-ignore
         newSection.items = newItems;
         return { ...prev, [section]: newSection };
     });
  };

  const handleAddModule = () => {
    setEditorConfig(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        items: [
          ...prev.curriculum.items,
          { title: "Novo Módulo", duration: "0h 0m", lessons: ["Aula 1"] }
        ]
      }
    }));
  };

  const handleDeleteModule = (index: number) => {
    setEditorConfig(prev => {
      const newItems = prev.curriculum.items.filter((_, i) => i !== index);
      return {
        ...prev,
        curriculum: {
          ...prev.curriculum,
          items: newItems
        }
      };
    });
  };

  const handleAddAudienceCard = () => {
    setEditorConfig(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        items: [
          ...prev.targetAudience.items,
          { title: "Novo Perfil", description: "Descrição do perfil...", active: true }
        ]
      }
    }));
  };

  const handleDeleteAudienceCard = (index: number) => {
    setEditorConfig(prev => {
      const newItems = prev.targetAudience.items.filter((_, i) => i !== index);
      return {
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          items: newItems
        }
      };
    });
  };

  const handleImageUpload = (section: keyof PageConfig, key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig(section, key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleDeepImageUpload = (section: keyof PageConfig, index: number, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDeepConfig(section, index, field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );

  // --- RENDER EDITOR MODE ---
  if (editingPageId !== null) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Editor Sidebar */}
        <div className={`w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-20 fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300`}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-indigo-900 text-white">
            <h3 className="font-bold flex items-center gap-2">
              <Edit className="w-4 h-4" /> Editor
            </h3>
            <button onClick={() => setEditingPageId(null)} className="hover:bg-white/10 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white">
             {/* Page Title Editing */}
            <div className="p-4 border-b border-gray-100 bg-indigo-50">
               <label className="text-xs font-bold text-indigo-800 uppercase block mb-1">Nome da Página (Interno)</label>
               <input 
                 type="text" 
                 value={editingPageTitle}
                 onChange={(e) => setEditingPageTitle(e.target.value)}
                 className="w-full p-2 text-sm border border-indigo-200 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900"
                 placeholder="Ex: Página de Vendas Principal"
               />
            </div>

            {/* Styles Widget */}
            <div className="border-b border-gray-100">
              <button 
                onClick={() => setActiveEditorSection(activeEditorSection === 'global' ? null : 'global')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 font-medium text-gray-700"
              >
                <div className="flex items-center gap-2">
                   <Palette className="w-4 h-4 text-indigo-500" /> Estilos Globais
                </div>
                {activeEditorSection === 'global' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}
              </button>
              
              {activeEditorSection === 'global' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                  {['primary', 'secondary', 'background', 'text'].map((colorKey) => (
                    <div key={colorKey}>
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-1 capitalize">{colorKey}</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          // @ts-ignore
                          value={editorConfig.colors[colorKey]}
                          // @ts-ignore
                          onChange={(e) => updateConfig('colors', colorKey, e.target.value)}
                          className="h-8 w-10 cursor-pointer rounded border border-gray-300"
                        />
                         <input 
                           type="text" 
                           // @ts-ignore
                           value={editorConfig.colors[colorKey]}
                           // @ts-ignore
                           onChange={(e) => updateConfig('colors', colorKey, e.target.value)}
                           className="flex-1 text-sm border border-gray-300 rounded px-2 bg-white text-gray-900"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Hero Widget */}
            <div className="border-b border-gray-100">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button 
                    onClick={() => setActiveEditorSection(activeEditorSection === 'hero' ? null : 'hero')}
                    className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"
                 >
                    <Layout className="w-4 h-4 text-indigo-500" /> Seção Hero
                 </button>
                 <div className="flex items-center gap-2">
                    <ToggleSwitch 
                       checked={editorConfig.hero.enabled} 
                       onChange={(val) => updateConfig('hero', 'enabled', val)} 
                    />
                    <button onClick={() => setActiveEditorSection(activeEditorSection === 'hero' ? null : 'hero')}>
                       {activeEditorSection === 'hero' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}
                    </button>
                 </div>
              </div>
              {activeEditorSection === 'hero' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Badge</label>
                    <input type="text" value={editorConfig.hero.badge} onChange={(e) => updateConfig('hero', 'badge', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título ({editorConfig.hero.headlineSize}px)</label>
                    <input type="range" min="24" max="120" value={editorConfig.hero.headlineSize} onChange={(e) => updateConfig('hero', 'headlineSize', Number(e.target.value))} className="w-full mb-2"/>
                    <textarea value={editorConfig.hero.headline} onChange={(e) => updateConfig('hero', 'headline', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-20 bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Subtítulo ({editorConfig.hero.subheadlineSize}px)</label>
                     <input type="range" min="12" max="48" value={editorConfig.hero.subheadlineSize} onChange={(e) => updateConfig('hero', 'subheadlineSize', Number(e.target.value))} className="w-full mb-2"/>
                    <textarea value={editorConfig.hero.subheadline} onChange={(e) => updateConfig('hero', 'subheadline', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-24 bg-white text-gray-900" />
                  </div>
                   <div className="grid grid-cols-2 gap-2">
                     <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Botão Principal</label><input type="text" value={editorConfig.hero.ctaButton} onChange={(e) => updateConfig('hero', 'ctaButton', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                     <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Link CTA</label><input type="text" value={editorConfig.hero.ctaLink} onChange={(e) => updateConfig('hero', 'ctaLink', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Botão Demo</label><input type="text" value={editorConfig.hero.demoButton} onChange={(e) => updateConfig('hero', 'demoButton', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                     <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Link Demo</label><input type="text" value={editorConfig.hero.demoLink} onChange={(e) => updateConfig('hero', 'demoLink', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* About Widget */}
            <div className="border-b border-gray-100">
               <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'about' ? null : 'about')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><FileText className="w-4 h-4 text-indigo-500" /> O que é</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.about.enabled} onChange={(val) => updateConfig('about', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'about' ? null : 'about')}>{activeEditorSection === 'about' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'about' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título</label><input type="text" value={editorConfig.about.title} onChange={(e) => updateConfig('about', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Descrição</label><textarea value={editorConfig.about.description} onChange={(e) => updateConfig('about', 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-32 bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Imagem</label><div className="flex flex-col gap-2"><input type="file" accept="image/*" onChange={(e) => handleImageUpload('about', 'image', e)} className="text-xs"/><input type="text" value={editorConfig.about.image} onChange={(e) => updateConfig('about', 'image', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" placeholder="URL"/><img src={editorConfig.about.image} alt="Preview" className="w-full h-32 object-cover rounded border" /></div></div>
                </div>
              )}
            </div>

            {/* Target Audience */}
             <div className="border-b border-gray-100">
               <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'audience' ? null : 'audience')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><Users className="w-4 h-4 text-indigo-500" /> Público Alvo</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.targetAudience.enabled} onChange={(val) => updateConfig('targetAudience', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'audience' ? null : 'audience')}>{activeEditorSection === 'audience' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'audience' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título da Seção</label><input type="text" value={editorConfig.targetAudience.title} onChange={(e) => updateConfig('targetAudience', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   {editorConfig.targetAudience.items.map((item, idx) => (
                    <div key={idx} className="border-t border-gray-200 pt-3 mt-3">
                       <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-indigo-500 uppercase block">Card {idx + 1}</label>
                          <div className="flex gap-2 items-center">
                             <ToggleSwitch 
                                checked={item.active !== false} 
                                onChange={(val) => updateDeepConfig('targetAudience', idx, 'active', val)} 
                             />
                             <button onClick={() => handleDeleteAudienceCard(idx)} className="text-red-400 hover:text-red-600">
                                <Trash2 className="w-3 h-3" />
                             </button>
                          </div>
                       </div>
                       <input type="text" value={item.title} onChange={(e) => updateDeepConfig('targetAudience', idx, 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Título" />
                       <textarea value={item.description} onChange={(e) => updateDeepConfig('targetAudience', idx, 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-16 bg-white text-gray-900" placeholder="Descrição" />
                    </div>
                  ))}
                  <button 
                    onClick={handleAddAudienceCard}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Card
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="border-b border-gray-100">
               <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'features' ? null : 'features')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><TrendingUp className="w-4 h-4 text-indigo-500" /> Diferenciais</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.features.enabled} onChange={(val) => updateConfig('features', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'features' ? null : 'features')}>{activeEditorSection === 'features' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'features' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Badge</label><input type="text" value={editorConfig.features.badge} onChange={(e) => updateConfig('features', 'badge', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título</label><input type="text" value={editorConfig.features.title} onChange={(e) => updateConfig('features', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   {editorConfig.features.items.map((item, idx) => (
                    <div key={idx} className="border-t border-gray-200 pt-3 mt-3">
                       <label className="text-xs font-bold text-indigo-500 uppercase block mb-1">Diferencial {idx + 1}</label>
                       <input type="text" value={item.title} onChange={(e) => updateDeepConfig('features', idx, 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Título" />
                       <textarea value={item.description} onChange={(e) => updateDeepConfig('features', idx, 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-16 bg-white text-gray-900" placeholder="Descrição" />
                    </div>
                  ))}
                </div>
              )}
            </div>
             {/* Curriculum Widget */}
            <div className="border-b border-gray-100">
               <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'curriculum' ? null : 'curriculum')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><List className="w-4 h-4 text-indigo-500" /> Cronograma</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.curriculum.enabled} onChange={(val) => updateConfig('curriculum', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'curriculum' ? null : 'curriculum')}>{activeEditorSection === 'curriculum' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'curriculum' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título</label><input type="text" value={editorConfig.curriculum.title} onChange={(e) => updateConfig('curriculum', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Descrição</label><textarea value={editorConfig.curriculum.description} onChange={(e) => updateConfig('curriculum', 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-20 bg-white text-gray-900" /></div>
                   {editorConfig.curriculum.items.map((item, idx) => (
                    <div key={idx} className="border-t border-gray-200 pt-3 mt-3">
                       <div className="flex justify-between items-center mb-1"><label className="text-xs font-bold text-indigo-500 uppercase">Módulo {idx + 1}</label><button onClick={() => handleDeleteModule(idx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button></div>
                       <input type="text" value={item.title} onChange={(e) => updateDeepConfig('curriculum', idx, 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Título" />
                       <input type="text" value={item.duration} onChange={(e) => updateDeepConfig('curriculum', idx, 'duration', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Duração" />
                       <label className="text-xs text-gray-400 mb-1 block">Aulas (separadas por vírgula):</label><textarea value={item.lessons.join(', ')} onChange={(e) => updateDeepConfig('curriculum', idx, 'lessons', e.target.value.split(',').map(s => s.trim()))} className="w-full p-2 text-sm border border-gray-300 rounded h-16 bg-white text-gray-900" placeholder="Aulas..." />
                    </div>
                  ))}
                  <button onClick={handleAddModule} className="mt-4 w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"><Plus className="w-4 h-4" /> Adicionar Módulo</button>
                </div>
              )}
            </div>
             {/* Bonus Widget */}
             <div className="border-b border-gray-100">
               <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'bonus' ? null : 'bonus')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><Gift className="w-4 h-4 text-indigo-500" /> Bônus</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.bonus.enabled} onChange={(val) => updateConfig('bonus', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'bonus' ? null : 'bonus')}>{activeEditorSection === 'bonus' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'bonus' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título</label><input type="text" value={editorConfig.bonus.title} onChange={(e) => updateConfig('bonus', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Subtítulo</label><input type="text" value={editorConfig.bonus.subtitle} onChange={(e) => updateConfig('bonus', 'subtitle', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   {editorConfig.bonus.items.map((item, idx) => (
                    <div key={idx} className="border-t border-gray-200 pt-3 mt-3">
                       <label className="text-xs font-bold text-indigo-500 uppercase block mb-1">Bônus {idx + 1}</label>
                       <input type="text" value={item.title} onChange={(e) => updateDeepConfig('bonus', idx, 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Título" />
                       <textarea value={item.description} onChange={(e) => updateDeepConfig('bonus', idx, 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-16 mb-2 bg-white text-gray-900" placeholder="Descrição" />
                       <input type="text" value={item.value} onChange={(e) => updateDeepConfig('bonus', idx, 'value', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" placeholder="Valor" />
                    </div>
                  ))}
                </div>
              )}
            </div>
             {/* Testimonials Widget */}
            <div className="border-b border-gray-100">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'testimonials' ? null : 'testimonials')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><Star className="w-4 h-4 text-indigo-500" /> Depoimentos</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.testimonials.enabled} onChange={(val) => updateConfig('testimonials', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'testimonials' ? null : 'testimonials')}>{activeEditorSection === 'testimonials' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'testimonials' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título</label><input type="text" value={editorConfig.testimonials.title} onChange={(e) => updateConfig('testimonials', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Subtítulo</label><input type="text" value={editorConfig.testimonials.subtitle} onChange={(e) => updateConfig('testimonials', 'subtitle', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   {editorConfig.testimonials.items.map((item, idx) => (
                    <div key={idx} className="border-t border-gray-200 pt-3 mt-3">
                       <label className="text-xs font-bold text-indigo-500 uppercase block mb-1">Depoimento {idx + 1}</label>
                       <input type="text" value={item.name} onChange={(e) => updateDeepConfig('testimonials', idx, 'name', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Nome" />
                       <input type="text" value={item.role} onChange={(e) => updateDeepConfig('testimonials', idx, 'role', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded mb-2 bg-white text-gray-900" placeholder="Cargo" />
                       <textarea value={item.text} onChange={(e) => updateDeepConfig('testimonials', idx, 'text', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-20 mb-2 bg-white text-gray-900" placeholder="Texto" />
                       <label className="text-xs font-bold text-gray-500 block mb-1">Foto</label>
                       <div className="flex items-center gap-2"><img src={item.image} alt="" className="w-10 h-10 rounded-full border" /><input type="file" accept="image/*" onChange={(e) => handleDeepImageUpload('testimonials', idx, 'image', e)} className="text-xs w-full"/></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Pricing Widget */}
            <div className="border-b border-gray-100">
               <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                 <button onClick={() => setActiveEditorSection(activeEditorSection === 'pricing' ? null : 'pricing')} className="flex-1 flex items-center gap-2 font-medium text-gray-700 text-left"><CreditCard className="w-4 h-4 text-indigo-500" /> Preço & Oferta</button>
                 <div className="flex items-center gap-2"><ToggleSwitch checked={editorConfig.pricing.enabled} onChange={(val) => updateConfig('pricing', 'enabled', val)} /><button onClick={() => setActiveEditorSection(activeEditorSection === 'pricing' ? null : 'pricing')}>{activeEditorSection === 'pricing' ? <X className="w-3 h-3"/> : <Plus className="w-3 h-3"/>}</button></div>
              </div>
              {activeEditorSection === 'pricing' && (
                <div className="p-4 bg-gray-50 space-y-4 animate-fadeIn">
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Título</label><input type="text" value={editorConfig.pricing.title} onChange={(e) => updateConfig('pricing', 'title', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Subtítulo</label><input type="text" value={editorConfig.pricing.subtitle} onChange={(e) => updateConfig('pricing', 'subtitle', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Preço</label><input type="text" value={editorConfig.pricing.price} onChange={(e) => updateConfig('pricing', 'price', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Texto Botão</label><input type="text" value={editorConfig.pricing.buttonText} onChange={(e) => updateConfig('pricing', 'buttonText', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Link Checkout</label><input type="text" value={editorConfig.pricing.buttonLink} onChange={(e) => updateConfig('pricing', 'buttonLink', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Garantia</label><input type="text" value={editorConfig.pricing.guarantee} onChange={(e) => updateConfig('pricing', 'guarantee', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900" /></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button onClick={handleSavePage} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md transition-all"><Save className="w-4 h-4" /> Salvar Alterações</button>
          </div>
        </div>
        
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

        <div className="flex-1 flex flex-col h-full relative">
           <div className="bg-gray-200 p-2 flex justify-between items-center shadow-inner">
              <div className="flex items-center gap-2 text-sm text-gray-600 pl-4">
                <button className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-5 h-5" /></button>
                <Eye className="w-4 h-4" /> Preview
              </div>
              <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
           </div>
           <div id="preview-scroll-container" className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth"><div className="bg-white shadow-2xl rounded-xl overflow-hidden min-h-[800px] transform transition-all origin-top scale-95 md:scale-100"><LandingPage config={editorConfig} isPreview={true} /></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-indigo-900 text-white flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Ship className="w-8 h-8 text-indigo-400" />
            <span>Páginas do<br/><span className="text-indigo-400">Capitão</span></span>
          </h2>
          {isSimulating && (
            <div className="mt-2 px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded border border-amber-500/30 inline-block">
              Modo Simulação
            </div>
          )}
          <button className="md:hidden text-indigo-300" onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          
          {/* Menu Items for ADMIN Role */}
          {viewRole === UserRole.ADMIN && (
            <>
              <button 
                onClick={() => setActiveTab('marketing-ai')}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'marketing-ai' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
              >
                <Bot className="w-5 h-5 text-amber-400" />
                IA Landing Page
              </button>
              <button 
                onClick={() => setActiveTab('my-pages')}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'my-pages' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
              >
                <Layout className="w-5 h-5" />
                Minhas Páginas
              </button>
              <button 
                onClick={() => setActiveTab('plans')}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
              >
                <DollarSign className="w-5 h-5 text-green-400" />
                Gerenciar Planos
              </button>
            </>
          )}

          {/* Menu Items for USER Role (Also shown when Admin simulates User) */}
          {(viewRole === UserRole.USER || viewRole === UserRole.FREE_USER) && (
            <>
              <button 
                onClick={() => setActiveTab('my-pages')}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'my-pages' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
              >
                <Layout className="w-5 h-5" />
                Minhas Páginas
              </button>
              
              {/* Show Plans tab for Free Users to upgrade */}
              {viewRole === UserRole.FREE_USER && (
                 <button 
                  onClick={() => setActiveTab('plans')}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'plans' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
                >
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Fazer Upgrade
                </button>
              )}
            </>
          )}

          <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            Configurações
          </button>
        </nav>

        {/* User Profile & Role Switcher */}
        <div className="p-4 border-t border-indigo-800">
           {/* Admin Feature: Switch View Role */}
           {user.role === UserRole.ADMIN && !isSimulating && (
             <div className="mb-4">
               <button 
                 onClick={onSimulateUser}
                 className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-bold transition-all bg-indigo-800 text-indigo-200 hover:bg-indigo-700`}
               >
                 <UserCheck className="w-4 h-4" /> Visualizar como Usuário
               </button>
             </div>
           )}

           {/* EXIT SIMULATION BUTTON */}
           {isSimulating && (
             <div className="mb-4">
               <button 
                 onClick={onExitSimulation}
                 className={`flex items-center justify-center gap-2 w-full py-3 px-3 rounded-lg text-xs font-bold transition-all bg-amber-400 text-indigo-900 hover:bg-amber-300 shadow-lg shadow-amber-900/20 animate-pulse`}
               >
                 <Repeat className="w-4 h-4" /> Voltar para Admin
               </button>
             </div>
           )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 truncate capitalize">
                {user.role === UserRole.ADMIN ? 'Administrador' : (user.role === UserRole.FREE_USER ? 'Usuário Grátis' : 'Usuário')}
              </p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-950 hover:bg-black text-xs font-medium rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Top Banner for Free Users */}
        {viewRole === UserRole.FREE_USER && (
           <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 shadow-md flex flex-col sm:flex-row items-center justify-center gap-4 sticky top-0 z-20">
              <div className="flex items-center gap-2 text-sm font-bold">
                 <Crown className="w-5 h-5 text-yellow-200 animate-pulse" />
                 <span>Você está usando o Plano Gratuito. Limite de 2 páginas e publicação bloqueada.</span>
              </div>
              <button 
                onClick={() => setActiveTab('plans')}
                className="px-4 py-1.5 bg-white text-orange-600 text-xs font-bold rounded-full hover:bg-orange-50 transition-colors shadow-sm"
              >
                 Liberar Acesso Completo
              </button>
           </div>
        )}

        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="w-6 h-6" />
               </button>
               <h1 className="text-2xl font-bold text-gray-800 capitalize">
                 {getTabTitle(activeTab)}
               </h1>
            </div>
            <div className="flex items-center gap-4">
               {/* Contextual Actions Header */}
               {activeTab === 'my-pages' && (
                 <button 
                   onClick={handleCreatePage}
                   className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 >
                   <Plus className="w-4 h-4" />
                   Criar Nova Página
                 </button>
               )}
               
               {/* Mobile FAB for create page */}
               {activeTab === 'my-pages' && (
                 <button onClick={handleCreatePage} className="md:hidden flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full shadow-md">
                    <Plus className="w-5 h-5" />
                 </button>
               )}

               <div className="md:hidden">
                 <button onClick={onLogout} className="text-gray-500"><LogOut className="w-5 h-5"/></button>
               </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Pages */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Páginas Ativas</p>
                      <h3 className="text-2xl font-bold text-gray-900">{activePagesCount}</h3>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                      <Globe className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600">No ar agora</span>
                </div>

                {/* Draft Pages */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rascunhos</p>
                      <h3 className="text-2xl font-bold text-gray-900">{draftPagesCount}</h3>
                    </div>
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">Em edição</span>
                </div>

                {/* Visits */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Visitas à Página</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.visits.toLocaleString('pt-BR')}</h3>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600">+12.5% este mês</span>
                </div>

                {/* Clicks */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cliques no CTA</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stats.clicks.toLocaleString('pt-BR')}</h3>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <MousePointerClick className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-purple-600">Alta conversão</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
                <img src="https://picsum.photos/200/200?blur=5" className="w-32 h-32 rounded-full mb-4 opacity-50 grayscale" alt="Placeholder" />
                <h3 className="text-lg font-medium text-gray-900">Feed de Atividades</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                  {viewRole === UserRole.ADMIN 
                    ? "Bem-vindo de volta, Capitão. Sistemas operacionais." 
                    : "Bem-vindo ao seu dashboard pessoal. Seu conteúdo está pronto."}
                </p>
              </div>
            </div>
          )}

          {/* PLANS TAB (Admin: Manage, Free User: View/Buy) */}
          {activeTab === 'plans' && (
             <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
                   <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5" /> {viewRole === UserRole.ADMIN ? 'Gerenciador de Ofertas' : 'Escolha seu Plano'}
                   </h3>
                   <p className="text-indigo-700 text-sm">
                      {viewRole === UserRole.ADMIN 
                        ? 'Personalize os planos apresentados na tela de registro.' 
                        : 'Desbloqueie recursos exclusivos e remova todos os limites da sua conta.'}
                   </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                   {plans.map((plan) => (
                      <div key={plan.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${plan.popular ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'}`}>
                         <div className={`h-2 w-full ${plan.color}`}></div>
                         <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                               <h4 className="font-bold text-lg text-gray-900">{plan.name}</h4>
                               {plan.popular && <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">Popular</span>}
                            </div>
                            
                            {viewRole === UserRole.ADMIN ? (
                                // ADMIN VIEW: Edit Inputs
                                <div className="space-y-4">
                                   {/* ... (Admin Plan Editing Logic - kept same as before) ... */}
                                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Nome</label><input type="text" value={plan.name} onChange={(e) => handleUpdatePlan(plan.id, 'name', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded"/></div>
                                   <div className="grid grid-cols-2 gap-2">
                                      <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Preço</label><input type="text" value={plan.price} onChange={(e) => handleUpdatePlan(plan.id, 'price', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded"/></div>
                                      <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Período</label><input type="text" value={plan.period} onChange={(e) => handleUpdatePlan(plan.id, 'period', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded"/></div>
                                   </div>
                                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Descrição</label><textarea value={plan.description} onChange={(e) => handleUpdatePlan(plan.id, 'description', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-16"/></div>
                                   <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1">Benefícios</label><textarea value={plan.features.join('\n')} onChange={(e) => handleFeaturesChange(plan.id, e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded h-32 font-mono text-xs"/></div>
                                   <div className="pt-4 border-t border-gray-100 space-y-3">
                                      <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Popular</span><ToggleSwitch checked={plan.popular} onChange={(val) => handleUpdatePlan(plan.id, 'popular', val)} /></div>
                                      <div className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">Ativo</span><ToggleSwitch checked={plan.active} onChange={(val) => handleUpdatePlan(plan.id, 'active', val)} /></div>
                                   </div>
                                </div>
                            ) : (
                                // USER VIEW: Display Only
                                <div className="space-y-4">
                                   <div className="flex items-baseline mb-4"><span className="text-3xl font-extrabold text-gray-900">{plan.price}</span><span className="text-gray-500 font-medium ml-1">{plan.period}</span></div>
                                   <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{plan.description}</p>
                                   <ul className="space-y-3 mb-8">
                                      {plan.features.filter(f => f.trim() !== '').map((f, i) => (
                                         <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-600"><div className="w-1.5 h-1.5 bg-current rounded-full"></div></div>
                                            {f}
                                         </li>
                                      ))}
                                   </ul>
                                   <button className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-600 hover:text-indigo-600'}`}>
                                      Selecionar Plano
                                   </button>
                                </div>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* AI LANDING PAGE GENERATOR (ADMIN ONLY) */}
          {activeTab === 'marketing-ai' && viewRole === UserRole.ADMIN && (
             // ... (Existing AI Tab Content) ...
             <div className="max-w-6xl mx-auto">
               {/* Same content as before */}
               <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-6">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-10 h-10 text-yellow-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Gerador de Landing Pages IA</h2>
                    <p className="text-indigo-100 text-lg max-w-xl">
                      Crie uma página de vendas completa em segundos. Basta descrever seu produto ou fazer upload de um arquivo com o contexto.
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-350px)]">
                {/* Input Column */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-2">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-500" /> Configuração
                    </h3>
                    
                    <form onSubmit={handleGenerateFullPage} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Produto</label>
                        <input 
                          type="text" 
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="Ex: Mentoria Elite 3.0"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição do Produto</label>
                        <textarea 
                          value={productDescription}
                          onChange={(e) => setProductDescription(e.target.value)}
                          placeholder="Descreva o produto, benefícios, dores que resolve, preço, etc..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                        />
                      </div>

                      <div className="relative">
                         <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                         </div>
                         <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OU</span>
                         </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Upload de Contexto (txt/md)</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                          <input 
                            type="file" 
                            accept=".txt,.md,.json"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                          <p className="text-sm text-gray-500 truncate px-2">
                            {fileName || "Clique ou arraste um arquivo"}
                          </p>
                        </div>
                        {fileContext && (
                          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                             <FileText className="w-3 h-3" /> Arquivo lido com sucesso ({fileContext.length} caracteres)
                          </div>
                        )}
                      </div>

                      <button 
                        type="submit" 
                        disabled={isGenerating || !productName}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Criando Estrutura...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" /> Gerar Página
                          </>
                        )}
                      </button>
                      
                      {generationError && (
                        <p className="text-sm text-red-500 mt-2 text-center bg-red-50 p-2 rounded">{generationError}</p>
                      )}
                    </form>
                  </div>
                </div>

                {/* Preview/Result Column */}
                <div className="lg:col-span-8 h-full overflow-hidden flex flex-col">
                  {generatedPageConfig ? (
                    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
                       <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
                          <div className="flex items-center gap-2 text-indigo-900 font-bold">
                             <FileJson className="w-5 h-5" />
                             Página Gerada com Sucesso!
                          </div>
                          <button 
                             onClick={handleCreatePageFromAI}
                             className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-2 animate-pulse"
                          >
                             <Layout className="w-4 h-4" />
                             Criar Página & Editar
                          </button>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto bg-gray-100 p-4 relative">
                          {/* Mini Preview - scaled down */}
                          <div className="transform scale-75 origin-top-left w-[133%] h-[133%] pointer-events-none select-none">
                             <LandingPage config={generatedPageConfig} isPreview={true} />
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 p-8 text-center">
                      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <Layout className="w-10 h-10 text-indigo-300" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-600 mb-2">Aguardando Comando</h3>
                      <p className="max-w-md">
                        Preencha as informações ao lado e clique em "Gerar Página" para ver a mágica acontecer. A IA criará todos os textos, cores e seções automaticamente.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MY PAGES TAB (ADMIN ONLY or USER) */}
          {activeTab === 'my-pages' && (
            <div>
              <div className="flex justify-end md:hidden mb-6">
                <button 
                  onClick={handleCreatePage}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                >
                   <Plus className="w-4 h-4" />
                   Criar Nova Página
                 </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pages.map((page) => (
                  <div key={page.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative h-40 bg-gray-100 overflow-hidden border-b border-gray-100">
                       <img src={page.thumbnail} alt={page.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-2 right-2">
                         <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                           page.status === 'published' 
                           ? 'bg-green-100 text-green-700 border-green-200' 
                           : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                         }`}>
                           {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                         </span>
                       </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 truncate mb-1" title={page.title}>{page.title}</h3>
                      <p className="text-xs text-gray-500 mb-4">Modificado: {page.lastModified}</p>
                      
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <div className="flex gap-1">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                            title="Editar"
                            onClick={() => handleEditPage(page)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Link" onClick={() => alert(`Link copiado: ${page.url}`)}>
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <button 
                            className={`p-1.5 rounded transition-colors ${page.status === 'published' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} 
                            title={viewRole === UserRole.FREE_USER ? "Upgrade para publicar" : "Publicar"} 
                            onClick={() => handlePublishPage(page.id)}
                          >
                            {viewRole === UserRole.FREE_USER ? <Lock className="w-4 h-4 text-amber-500" /> : <Globe className="w-4 h-4" />}
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Salvar como Modelo" onClick={() => alert('Salvo como modelo!')}>
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Protect Frontend Page (ID 1) from deletion */}
                        {page.id !== 1 ? (
                          <button 
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Excluir"
                            onClick={() => setPageToDelete(page.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                           <div className="p-1.5 text-gray-300 cursor-not-allowed" title="Página do Sistema">
                              <Lock className="w-4 h-4" />
                           </div>
                        )}

                      </div>
                    </div>
                  </div>
                ))}

                {/* New Page Card Placeholder */}
                <button 
                  onClick={handleCreatePage}
                  className="flex flex-col items-center justify-center h-full min-h-[250px] rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                >
                   <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                     {viewRole === UserRole.FREE_USER && pages.length >= 2 ? <Lock className="w-6 h-6 text-amber-500" /> : <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />}
                   </div>
                   <span className="font-medium text-gray-500 group-hover:text-indigo-600">
                      {viewRole === UserRole.FREE_USER && pages.length >= 2 ? "Limite Atingido" : "Criar Nova Página"}
                   </span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Delete Confirmation Modal */}
        {pageToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Excluir Página?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita e todo o conteúdo será perdido.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setPageToDelete(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDeletePage(pageToDelete)}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Required Modal */}
        {showUpgradeModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scaleIn text-center">
               <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-8 h-8 text-amber-500" />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Necessário</h3>
               <p className="text-gray-600 mb-8">
                  Você atingiu o limite do plano gratuito ou está tentando acessar um recurso exclusivo para Capitães. 
                  Faça o upgrade agora para desbloquear criações ilimitadas e publicar suas páginas!
               </p>
               <button 
                  onClick={() => { setShowUpgradeModal(false); setActiveTab('plans'); }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
               >
                  Ver Planos de Upgrade
               </button>
               <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-800 underline"
               >
                  Talvez mais tarde
               </button>
            </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;