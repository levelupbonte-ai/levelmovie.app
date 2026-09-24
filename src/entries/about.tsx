import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import About from '../pages/About';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/about">
        <About />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
