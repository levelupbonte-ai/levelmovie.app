import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import PreviewInstant from '../pages/PreviewInstant';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/preview/instant">
      <PreviewInstant />
    </PageLayout>
  </React.StrictMode>
);
