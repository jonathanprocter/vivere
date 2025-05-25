import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activePage = 'dashboard' 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar activePage={activePage} />
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
