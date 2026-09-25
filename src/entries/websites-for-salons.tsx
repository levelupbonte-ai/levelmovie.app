import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import WebsitesForSalons from '../pages/WebsitesForSalons';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/websites-for/salons">
      <WebsitesForSalons />
    </PageLayout>
  </React.StrictMode>
);
