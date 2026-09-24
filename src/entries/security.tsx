import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import Security from '../pages/Security';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/security">
      <Security />
    </PageLayout>
  </React.StrictMode>
);
