import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = 'dashboard' }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/' },
    { id: 'new-journal', label: 'Start Journal', href: '/new-journal' },
    { id: 'entries', label: 'Past Journals', href: '/entries' },
    { id: 'ask', label: 'Ask My Journal', href: '/ask' },
    { id: 'insights', label: 'Insights', href: '/insights' },
    { id: 'settings', label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="bg-white shadow-md w-64 min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">vivere</h1>
        <p className="text-sm text-gray-500 italic">remember to live</p>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link 
                href={item.href}
                className={`block p-2 rounded-md transition-colors ${
                  activePage === item.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="text-xs text-gray-500">
          <p>© 2025 Vivere</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
