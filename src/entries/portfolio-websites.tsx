import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import PortfolioWebsites from '../pages/PortfolioWebsites';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/services/portfolio-websites">
      <PortfolioWebsites />
    </PageLayout>
  </React.StrictMode>
);
