import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import SecurityCheck from '../pages/SecurityCheck';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/services/security-check">
      <SecurityCheck />
    </PageLayout>
  </React.StrictMode>
);
