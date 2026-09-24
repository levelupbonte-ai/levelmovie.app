import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import WebDesignSanDiego from '../pages/WebDesignSanDiego';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/web-design-san-diego">
        <WebDesignSanDiego />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
