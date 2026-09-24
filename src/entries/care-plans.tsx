import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import CarePlans from '../pages/CarePlans';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/services/care-plans">
      <CarePlans />
    </PageLayout>
  </React.StrictMode>
);
