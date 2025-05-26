// This is a placeholder file to allow the Next.js build to pass.
import React from 'react';
import Header from './Header'; // Assuming Header is in the same directory
import Sidebar from './Sidebar'; // Assuming Sidebar is in the same directory

interface MainLayoutProps {
  children: React.ReactNode;
  activePage?: string; // From previous error context
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activePage }) => {
  return (
    <div className="main-layout">
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
