import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import CreatorWebsites from '../pages/CreatorWebsites';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/services/creator-websites">
        <CreatorWebsites />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
