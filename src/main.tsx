import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PageLayout from './components/PageLayout';
import Home from './pages/Home';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/">
      <Home />
    </PageLayout>
  </React.StrictMode>
);
