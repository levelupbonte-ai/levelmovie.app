import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PageLayout from './components/PageLayout';
import Home from './pages/Home';

// Global image protection: prevent right-click copy, drag, and save across desktop & mobile
if (typeof window !== 'undefined') {
  window.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'IMG' || target.tagName === 'PICTURE' || target.closest('picture'))) {
      e.preventDefault();
    }
  });

  window.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'IMG' || target.tagName === 'PICTURE' || target.closest('picture'))) {
      e.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/">
      <Home />
    </PageLayout>
  </React.StrictMode>
);
