import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import Sitemap from '../pages/Sitemap';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/sitemap">
        <Sitemap />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
