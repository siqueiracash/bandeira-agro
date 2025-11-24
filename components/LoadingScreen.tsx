import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-agro-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-agro-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-agro-700">
           {/* Standard Magnifying Glass Icon */}
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </div>
      </div>
      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Analisando o Mercado</h2>
      <p className="text-gray-500 max-w-md">
        Estamos buscando amostras comparativas na região e calculando a avaliação conforme a NBR 14653. Isso pode levar alguns segundos.
      </p>
      
      <div className="mt-8 space-y-2 w-64">
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-agro-500 animate-pulse w-2/3"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Coletando dados...</span>
          <span>Processando...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;