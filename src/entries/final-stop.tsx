import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import PageLayout from '../components/PageLayout';
import CaseStudyFinalStop from '../pages/CaseStudyFinalStop';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PageLayout currentPath="/projects/final-stop">
      <CaseStudyFinalStop />
    </PageLayout>
  </React.StrictMode>
);
