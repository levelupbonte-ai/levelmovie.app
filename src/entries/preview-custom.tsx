import React from 'react';
import ReactDOM from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import PreviewCustom from '../pages/PreviewCustom';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/preview/custom">
      <PreviewCustom />
    </PageLayout>
  </React.StrictMode>
);
