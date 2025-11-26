import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, PageConfig } from "../types";
import { defaultPageConfig } from "../components/LandingPage";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// Função existente de Email (mantida para compatibilidade ou uso futuro)
export const generateMarketingCopy = async (
  topic: string, 
  tone: string
): Promise<GeneratedContent> => {
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const model = "gemini-2.5-flash";
    const prompt = `Atue como um especialista em copywriting. Escreva um texto de email marketing de alta conversão sobre "${topic}". 
    O tom de voz deve ser ${tone}.
    O idioma DEVE ser Português do Brasil.
    Retorne o resultado em formato JSON com uma linha de assunto ('subject') e o corpo do texto ('body').`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["subject", "body"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Gera a configuração completa da Landing Page
export const generateLandingPageConfig = async (
  productName: string,
  description: string,
  fileContext: string
): Promise<PageConfig> => {
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const model = "gemini-2.5-flash";
    
    // Prompt detalhado instruindo a estrutura exata do JSON
    const prompt = `
      Atue como um especialista em Marketing Digital e Copywriter de elite.
      
      OBJETIVO: Criar o conteúdo completo de uma Landing Page de alta conversão para o produto: "${productName}".
      
      CONTEXTO DO PRODUTO:
      ${description}
      
      INFORMAÇÕES ADICIONAIS (DO ARQUIVO):
      ${fileContext}

      REGRAS:
      1. O idioma DEVE ser Português do Brasil.
      2. O tom deve ser persuasivo, focado em benefícios e quebra de objeções.
      3. Você deve retornar APENAS um objeto JSON.
      4. A estrutura do JSON deve seguir ESTRITAMENTE o modelo abaixo para que funcione no meu aplicativo.
      5. Mantenha 'enabled': true em todas as seções.

      ESTRUTURA JSON ESPERADA (Preencha os campos com textos criativos):
      {
        "colors": {
          "primary": "#cor_hex_principal",
          "secondary": "#cor_hex_secundaria",
          "background": "#ffffff",
          "text": "#111827"
        },
        "hero": {
          "enabled": true,
          "badge": "Texto curto de urgência ou novidade",
          "headline": "Promessa Principal Forte",
          "subheadline": "Explicação da promessa e para quem é",
          "headlineSize": 60,
          "subheadlineSize": 20,
          "ctaButton": "Texto do Botão de Ação",
          "ctaLink": "#pricing",
          "demoButton": "Texto botão secundário",
          "demoLink": "#features"
        },
        "about": {
          "enabled": true,
          "title": "Título da seção 'O que é'",
          "description": "Descrição detalhada do produto/método",
          "image": "https://picsum.photos/600/600?random=1", 
          "checklist": ["Benefício 1", "Benefício 2", "Benefício 3"]
        },
        "targetAudience": {
          "enabled": true,
          "title": "Título da seção 'Para quem é'",
          "subtitle": "Subtítulo curto",
          "items": [
            { "title": "Perfil 1", "description": "Dor desse perfil" },
            { "title": "Perfil 2", "description": "Dor desse perfil" },
            { "title": "Perfil 3", "description": "Dor desse perfil" }
          ]
        },
        "features": {
          "enabled": true,
          "badge": "Diferenciais",
          "title": "Título dos diferenciais",
          "items": [
            { "title": "Diferencial 1", "description": "Descrição" },
            { "title": "Diferencial 2", "description": "Descrição" },
            { "title": "Diferencial 3", "description": "Descrição" }
          ]
        },
        "curriculum": {
          "enabled": true,
          "title": "Título do Cronograma/Conteúdo",
          "description": "Descrição breve",
          "buttonText": "Ver tudo",
          "items": [
            { "title": "Módulo 1", "duration": "Tempo", "lessons": ["Aula 1", "Aula 2"] },
            { "title": "Módulo 2", "duration": "Tempo", "lessons": ["Aula 1", "Aula 2"] },
            { "title": "Módulo 3", "duration": "Tempo", "lessons": ["Aula 1", "Aula 2"] },
            { "title": "Módulo 4", "duration": "Tempo", "lessons": ["Aula 1", "Aula 2"] }
          ]
        },
        "bonus": {
          "enabled": true,
          "title": "Bônus",
          "subtitle": "Se houver bônus",
          "items": [
            { "title": "Bônus 1", "description": "Descrição", "value": "Valor R$" },
            { "title": "Bônus 2", "description": "Descrição", "value": "Valor R$" },
            { "title": "Bônus 3", "description": "Descrição", "value": "Valor R$" }
          ]
        },
        "testimonials": {
          "enabled": true,
          "title": "Depoimentos",
          "subtitle": "O que dizem",
          "items": [
            { "name": "Nome 1", "role": "Cargo 1", "text": "Depoimento curto e positivo", "image": "https://picsum.photos/100/100?random=10" },
            { "name": "Nome 2", "role": "Cargo 2", "text": "Depoimento curto e positivo", "image": "https://picsum.photos/100/100?random=11" },
            { "name": "Nome 3", "role": "Cargo 3", "text": "Depoimento curto e positivo", "image": "https://picsum.photos/100/100?random=12" }
          ]
        },
        "pricing": {
          "enabled": true,
          "title": "Oferta Final",
          "subtitle": "Chamada para ação final",
          "price": "12x R$ XX,XX",
          "buttonText": "Comprar Agora",
          "buttonLink": "#checkout",
          "guarantee": "Garantia de X dias"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    // Mescla o resultado da IA com a configuração padrão para garantir que campos faltantes não quebrem a UI
    const aiConfig = JSON.parse(text);
    return { ...defaultPageConfig, ...aiConfig };

  } catch (error) {
    console.error("Gemini API Error (Full Page):", error);
    throw error;
  }
};