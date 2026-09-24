import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import OnlineStores from '../pages/OnlineStores';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/services/online-stores">
      <OnlineStores />
    </PageLayout>
  </React.StrictMode>
);
