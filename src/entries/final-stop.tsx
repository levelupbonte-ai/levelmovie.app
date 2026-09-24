import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '../index.css';
import PageLayout from '../components/PageLayout';
import CaseStudyFinalStop from '../pages/CaseStudyFinalStop';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PageLayout currentPath="/projects/final-stop">
        <CaseStudyFinalStop />
      </PageLayout>
    </BrowserRouter>
  </React.StrictMode>
);
