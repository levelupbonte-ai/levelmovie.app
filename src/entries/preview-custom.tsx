import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import PreviewCustom from '../pages/PreviewCustom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/preview/custom">
      <PreviewCustom />
    </PageLayout>
  </React.StrictMode>
);
