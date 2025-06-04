import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'vivere' }) => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">
          {title}
        </Link>
        <div className="text-sm italic">remember to live</div>
      </div>
    </header>
  );
};

export default Header;
