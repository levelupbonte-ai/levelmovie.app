import React from 'react';
import ReactDOM from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import PreviewHub from '../pages/PreviewHub';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/preview">
      <PreviewHub />
    </PageLayout>
  </React.StrictMode>
);
