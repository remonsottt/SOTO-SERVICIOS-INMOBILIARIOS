import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import PropertiesPage from './pages/PropertiesPage.tsx';
import PropertyDetailPage from './pages/PropertyDetailPage.tsx';
import ServicesPage from './pages/ServicesPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import ValuationPage from './pages/ValuationPage.tsx';
import ValuationResultPage from './pages/ValuationResultPage.tsx';
import { BlogIndex } from './pages/BlogIndex.tsx';
import { BlogPost } from './pages/BlogPost.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import CookiesPage from './pages/CookiesPage.tsx';
import LegalPage from './pages/LegalPage.tsx';
import ThankYouPage from './pages/ThankYouPage.tsx';
import SellerPage from './pages/SellerPage.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import WhatsAppFloat from './components/WhatsAppFloat.tsx';
import { CookieConsent } from './components/CookieConsent.tsx';
import { GTMPageViewTracker } from './components/GTMPageViewTracker.tsx';
import { PageTransition, ScrollProgress } from './components/PageTransition.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <GTMPageViewTracker />
      <ScrollProgress />
      <CookieConsent />
      <Header />
      <WhatsAppFloat />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/propiedades" element={<PropertiesPage />} />
          <Route path="/propiedades/:slug" element={<PropertyDetailPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/vender-mi-piso" element={<SellerPage />} />
          <Route path="/valoracion" element={<ValuationPage />} />
          <Route path="/valoracion/resultado" element={<ValuationResultPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/aviso-legal" element={<LegalPage />} />
          <Route path="/gracias" element={<ThankYouPage />} />

          {/* Legacy English / Bolt paths — soft SPA fallback; hard 301s live in vercel.json */}
          <Route path="/valuation" element={<Navigate to="/valoracion" replace />} />
          <Route path="/valuation/result" element={<Navigate to="/valoracion/resultado" replace />} />
          <Route path="/free-valuation" element={<Navigate to="/valoracion" replace />} />
          <Route path="/es/privacidad" element={<Navigate to="/privacidad" replace />} />
          <Route path="/es/cookies" element={<Navigate to="/cookies" replace />} />
          <Route path="/es/aviso-legal" element={<Navigate to="/aviso-legal" replace />} />

          {/* Public unauthenticated admin / editor removed from shipped SPA */}
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="/blog-editor" element={<Navigate to="/blog" replace />} />
          <Route path="/blog-editor/:id" element={<Navigate to="/blog" replace />} />
        </Routes>
      </PageTransition>
      <Footer />
    </Router>
  </StrictMode>
);
