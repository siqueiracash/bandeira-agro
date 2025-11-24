import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ValuationResult, PropertyData } from '../types';

interface ReportScreenProps {
  data: ValuationResult;
  property: PropertyData;
  onReset: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ data, property, onReset }) => {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl animate-fade-in pb-10">
      <div className="bg-white shadow-xl p-8 md:p-12 print:shadow-none print:p-0">
        
        {/* Report Header for Print */}
        <div className="border-b-2 border-agro-900 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-serif font-bold text-agro-900">BANDEIRA AGRO</h1>
            <p className="text-sm text-gray-500 mt-1">Soluções em Engenharia de Avaliações</p>
          </div>
          <div className="text-right">
             <div className="text-xs text-gray-400">Referência Norma</div>
             <div className="font-bold text-gray-700">ABNT NBR 14653</div>
          </div>
        </div>

        {/* Dynamic Markdown Content */}
        <article className="prose prose-stone max-w-none prose-headings:text-agro-900 prose-headings:font-serif prose-a:text-agro-700 prose-strong:text-earth-800">
          <ReactMarkdown>{data.reportText}</ReactMarkdown>
        </article>

        {/* Source Links Section (Grounding) */}
        {data.sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200 break-inside-avoid">
            <h3 className="text-lg font-bold text-gray-800 mb-4 font-serif">Fontes de Pesquisa & Amostras</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {data.sources.map((source, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-agro-500 mr-2">•</span>
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                    title={source.title}
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-4 italic">
              * Nota: Os links acima foram utilizados como base de pesquisa para a elaboração deste laudo automatizado em {new Date().toLocaleDateString()}. O conteúdo dos links externos é de responsabilidade de seus autores.
            </p>
          </div>
        )}

        <div className="mt-16 pt-8 border-t-2 border-dashed border-gray-300 text-center break-inside-avoid">
          <p className="font-serif font-bold text-xl text-agro-900">BANDEIRA AGRO</p>
          <p className="text-sm text-gray-500">Avaliação Gerada Automaticamente via Inteligência Artificial</p>
        </div>
      </div>

      {/* Action Buttons - Moved to bottom */}
      <div className="flex justify-between items-center mt-8 no-print">
        <button 
          onClick={onReset}
          className="flex items-center text-gray-600 hover:text-agro-700 font-medium transition-colors border-2 border-transparent hover:border-gray-200 rounded-lg px-4 py-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Nova Avaliação
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center bg-agro-700 text-white px-6 py-3 rounded-xl hover:bg-agro-800 transition-colors shadow-lg font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          Imprimir / Salvar PDF
        </button>
      </div>
    </div>
  );
};

export default ReportScreen;