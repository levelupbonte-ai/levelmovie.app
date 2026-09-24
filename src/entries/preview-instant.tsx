import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import PreviewInstant from '../pages/PreviewInstant';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/preview/instant">
        <PreviewInstant />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
