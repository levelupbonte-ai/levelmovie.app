import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import PreviewHub from '../pages/PreviewHub';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/preview">
      <PreviewHub />
    </PageLayout>
  </React.StrictMode>
);
