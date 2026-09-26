import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

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
    <App />
  </React.StrictMode>
);
