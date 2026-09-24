import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import Privacy from '../pages/Privacy';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/privacy">
      <Privacy />
    </PageLayout>
  </React.StrictMode>
);
