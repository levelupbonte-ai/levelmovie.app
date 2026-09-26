import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PageLayout from './components/PageLayout';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import PortfolioWebsites from './pages/PortfolioWebsites';
import CreatorWebsites from './pages/CreatorWebsites';
import OnlineStores from './pages/OnlineStores';
import CarePlans from './pages/CarePlans';
import SecurityCheck from './pages/SecurityCheck';
import LocalBusinessWebsites from './pages/LocalBusinessWebsites';
import WebsitesForBarbershops from './pages/WebsitesForBarbershops';
import WebsitesForSalons from './pages/WebsitesForSalons';
import Projects from './pages/Projects';
import CaseStudyFinalStop from './pages/CaseStudyFinalStop';
import PreviewHub from './pages/PreviewHub';
import PreviewInstant from './pages/PreviewInstant';
import PreviewCustom from './pages/PreviewCustom';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Process from './pages/Process';
import Security from './pages/Security';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Sitemap from './pages/Sitemap';
import WebDesignSanDiego from './pages/WebDesignSanDiego';
import NotFound from './pages/NotFound';

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return <PageLayout currentPath={location.pathname}>{children}</PageLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/portfolio-websites" element={<PortfolioWebsites />} />
          <Route path="/services/creator-websites" element={<CreatorWebsites />} />
          <Route path="/services/online-stores" element={<OnlineStores />} />
          <Route path="/services/care-plans" element={<CarePlans />} />
          <Route path="/services/security-check" element={<SecurityCheck />} />
          <Route path="/services/local-business-websites" element={<LocalBusinessWebsites />} />
          <Route path="/websites-for/barbershops" element={<WebsitesForBarbershops />} />
          <Route path="/websites-for/salons" element={<WebsitesForSalons />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/final-stop" element={<CaseStudyFinalStop />} />
          <Route path="/case-studies/final-stop" element={<CaseStudyFinalStop />} />
          <Route path="/preview" element={<PreviewHub />} />
          <Route path="/preview/instant" element={<PreviewInstant />} />
          <Route path="/preview/custom" element={<PreviewCustom />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/process" element={<Process />} />
          <Route path="/security" element={<Security />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/web-design-san-diego" element={<WebDesignSanDiego />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}
