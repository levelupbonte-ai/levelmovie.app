import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import CarePlans from '../pages/CarePlans';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/services/care-plans">
        <CarePlans />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
