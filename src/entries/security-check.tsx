import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import SecurityCheck from '../pages/SecurityCheck';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/services/security-check">
        <SecurityCheck />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
