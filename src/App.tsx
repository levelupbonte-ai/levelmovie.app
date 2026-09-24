import React from 'react';
import PageLayout from './components/PageLayout';
import Home from './pages/Home';

export default function App() {
  return (
    <PageLayout currentPath="/">
      <Home />
    </PageLayout>
  );
}
