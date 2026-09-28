import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import FounderRichelieuBonte from '../pages/FounderRichelieuBonte';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/about/richelieu-bonte">
      <FounderRichelieuBonte />
    </PageLayout>
  </React.StrictMode>
);
