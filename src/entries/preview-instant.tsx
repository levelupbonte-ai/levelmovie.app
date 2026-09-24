import React from 'react';
import ReactDOM from 'react-dom/client';
import PageLayout from '../components/PageLayout';
import PreviewInstant from '../pages/PreviewInstant';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/preview/instant">
      <PreviewInstant />
    </PageLayout>
  </React.StrictMode>
);
