import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import Pricing from '../pages/Pricing';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/pricing">
      <Pricing />
    </PageLayout>
  </React.StrictMode>
);
