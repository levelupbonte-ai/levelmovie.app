import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import About from '../pages/About';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/about">
      <About />
    </PageLayout>
  </React.StrictMode>
);
