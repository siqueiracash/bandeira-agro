import { GoogleGenAI } from "@google/genai";
import { PropertyData, PropertyType, ValuationResult, GroundingSource } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Generates a valuation report by searching for comparables and applying ABNT NBR 14653 logic.
 */
export const generateValuationReport = async (data: PropertyData): Promise<ValuationResult> => {
  const modelId = "gemini-2.5-flash"; 

  const areaUnit = data.type === PropertyType.RURAL ? "hectares" : "metros quadrados";
  const nbrStandard = data.type === PropertyType.URBAN ? "ABNT NBR 14653-2 (Imóveis Urbanos)" : "ABNT NBR 14653-3 (Imóveis Rurais)";
  
  let specificDetails = '';
  let searchDescriptors = '';

  if (data.type === PropertyType.URBAN) {
    specificDetails = `
    - Subtipo: ${data.urbanSubType || 'Não especificado'}
    - Quartos: ${data.bedrooms || 'Não informado'}
    - Banheiros: ${data.bathrooms || 'Não informado'}
    - Vagas: ${data.parking || 'Não informado'}
    - Estado de Conservação: ${data.conservationState || 'Não informado'}
    `;
    
    // Construct a more specific search term for Urban
    searchDescriptors = `${data.urbanSubType} ${data.bedrooms ? data.bedrooms + ' quartos' : ''} ${data.neighborhood ? 'bairro ' + data.neighborhood : ''}`;
  } else {
    specificDetails = `
    - Atividade Predominante: ${data.ruralActivity || 'Não informado'}
    - CAR: ${data.carNumber || 'Não informado'}
    - Superfície: ${data.surface || 'Não informado'}
    - Acessibilidade: ${data.access || 'Não informado'}
    - Topografia: ${data.topography || 'Não informado'}
    - Ocupação: ${data.occupation || 'Não informado'}
    - Classificação Benfeitorias: ${data.improvements || 'Não informado'}
    `;

    // Construct a more specific search term for Rural
    searchDescriptors = `fazenda sítio ${data.ruralActivity} ${data.areaTotal} hectares`;
  }

  // Construct optimized search query for Google Search Tool
  const searchTerm = `venda ${searchDescriptors} em ${data.city} ${data.state} valor preço`;

  const prompt = `
    Atue como um Engenheiro de Avaliações Sênior expert na norma ${nbrStandard}.
    
    Sua tarefa é avaliar um IMÓVEL ${data.type} localizado em ${data.city}/${data.state} e gerar um Laudo de Avaliação Completo.
    
    DADOS DO IMÓVEL AVALIANDO:
    - Tipo: ${data.type}
    - Localização: ${data.address || 'Não informado'}, ${data.neighborhood || ''}, ${data.city} - ${data.state}
    - Área Total: ${data.areaTotal} ${areaUnit}
    ${data.areaBuilt ? `- Área Construída: ${data.areaBuilt} m²` : ''}
    ${specificDetails}
    - Detalhes Adicionais: ${data.description}

    PROCEDIMENTO OBRIGATÓRIO (FUNDAMENTAL):
    1. UTILIZE A FERRAMENTA DE BUSCA (Google Search) para encontrar pelo menos 5 (CINCO) ofertas REAIS e ATUAIS de imóveis semelhantes na mesma região (${data.city}/${data.state}).
       - Termo de busca sugerido: "${searchTerm}".
    2. Liste estas 5 amostras em uma tabela detalhada no laudo.
    3. Aplique o Método Comparativo Direto de Dados de Mercado conforme a ${nbrStandard}.
    4. Realize a HOMOGENEIZAÇÃO dos valores (aplique fatores de correção se necessário para local, topografia, padrão construtivo, conservação, etc).
    5. Calcule a média saneada ou mediana para definir o valor unitário (R$/${areaUnit}) e o Valor de Mercado Total.
    
    ESTRUTURA DO LAUDO (FORMATO MARKDOWN):
    Gere um LAUDO TÉCNICO DE AVALIAÇÃO formal contendo:
    
    ### 1. Identificação
    Dados do solicitante e descrição completa do imóvel avaliando (incluindo CAR, Topografia, Conservação, etc).

    ### 2. Diagnóstico de Mercado
    Breve panorama imobiliário da região de ${data.city}.

    ### 3. Pesquisa de Mercado (Amostragem)
    *TABELA OBRIGATÓRIA* com 5 amostras contendo (Inclua o LINK/FONTE na tabela):
    | Descrição | Localização | Área | Valor Oferta | Fonte (Site/Imobiliária) |
    |---|---|---|---|---|
    | ... | ... | ... | ... | ... |
    
    ### 4. Cálculos e Homogeneização
    Explique os fatores de homogeneização utilizados (Ex: Fator Oferta -10%, Fator Localização, Fator Conservação). Mostre a tabela de homogeneização se possível.

    ### 5. Conclusão do Valor de Mercado
    Determine o valor final do imóvel.
    **VALOR DE MERCADO ESTIMADO: R$ X.XXX.XXX,XX**
    
    ### 6. Encerramento
    Local e Data de hoje. Assinado: BANDEIRA AGRO - Inteligência em Avaliações.

    Importante: Seja extremamente técnico. Se não encontrar amostras idênticas na cidade exata, busque na microrregião e aplique fatores de correção, mas MANTENHA O MÍNIMO DE 5 AMOSTRAS. Use links reais encontrados na busca.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é o avaliador chefe da BANDEIRA AGRO. Seu objetivo é fornecer avaliações precisas baseadas na NBR 14653. Você DEVE buscar dados reais na web e fornecer as fontes.",
        temperature: 0.3, 
      },
    });

    const text = response.text;
    
    // Extract grounding chunks (sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title,
          uri: chunk.web.uri,
        });
      }
    });

    // Simple regex to find the last occurrence of a currency value
    const valueMatch = text?.match(/R\$\s?[\d.,]+/g);
    const lastValue = valueMatch ? valueMatch[valueMatch.length - 1] : "Sob Consulta";

    return {
      reportText: text || "Não foi possível gerar o laudo. Tente novamente.",
      sources: sources,
      estimatedValue: lastValue
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao gerar a avaliação. Verifique a conexão ou tente novamente mais tarde.");
  }
};