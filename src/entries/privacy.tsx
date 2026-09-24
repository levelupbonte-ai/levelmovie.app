import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import Privacy from '../pages/Privacy';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/privacy">
        <Privacy />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
