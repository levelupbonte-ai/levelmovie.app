import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import WebDesignSanDiego from '../pages/WebDesignSanDiego';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/web-design-san-diego">
      <WebDesignSanDiego />
    </PageLayout>
  </React.StrictMode>
);
