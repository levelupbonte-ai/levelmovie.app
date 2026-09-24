import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageLayoutProps {
  currentPath?: string;
  children: React.ReactNode;
}

export default function PageLayout({ currentPath, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#A1A1B5] font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col">
      <Navbar currentPath={currentPath} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
