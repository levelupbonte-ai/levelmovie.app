import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import PreviewCustom from '../pages/PreviewCustom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/preview/custom">
        <PreviewCustom />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
