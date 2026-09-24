import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import CreatorWebsites from '../pages/CreatorWebsites';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/services/creator-websites">
      <CreatorWebsites />
    </PageLayout>
  </React.StrictMode>
);
