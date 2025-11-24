import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-agro-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-agro-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5h2m-1.636 4.5h1.636m-1.636 4.5h1.636m-3.75 3.75h3.75" />
            </svg>
            <span className="font-serif text-2xl font-bold tracking-wide">BANDEIRA AGRO</span>
          </div>
          <div className="text-xs sm:text-sm text-agro-100 hidden sm:block">
            Sistema de Avaliação NBR 14653
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-earth-800 text-agro-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BANDEIRA AGRO. Todos os direitos reservados.</p>
          <p className="mt-1 text-xs opacity-75">Avaliações geradas por IA baseadas em dados públicos de mercado.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;