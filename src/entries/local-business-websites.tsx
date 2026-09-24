import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import LocalBusinessWebsites from '../pages/LocalBusinessWebsites';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/services/local-business-websites">
        <LocalBusinessWebsites />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
