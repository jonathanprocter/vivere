// This is a placeholder file to allow the Next.js build to pass.
import React from 'react';

interface SidebarProps {
  activePage?: string; // Added activePage prop
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  // The activePage prop is not actually used in this placeholder,
  // but it's added to match the props expected by MainLayout.tsx
  return (
    <aside>
      {/* Placeholder Sidebar. Active page: {activePage} */}
    </aside>
  );
};

export default Sidebar;
