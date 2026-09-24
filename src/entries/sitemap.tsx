import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import Sitemap from '../pages/Sitemap';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/sitemap">
      <Sitemap />
    </PageLayout>
  </React.StrictMode>
);
