import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import PropertiesPage from './pages/PropertiesPage.tsx';
import PropertyDetailPage from './pages/PropertyDetailPage.tsx';
import ServicesPage from './pages/ServicesPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import ValuationPage from './pages/ValuationPage.tsx';
import ValuationResultPage from './pages/ValuationResultPage.tsx';
import AdminDataPage from './pages/AdminDataPage.tsx';
import AdminUploadPage from './pages/AdminUploadPage.tsx';
import { BlogIndex } from './pages/BlogIndex.tsx';
import { BlogPost } from './pages/BlogPost.tsx';
import { BlogEditor } from './pages/BlogEditor.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import CookiesPage from './pages/CookiesPage.tsx';
import LegalPage from './pages/LegalPage.tsx';
import ThankYouPage from './pages/ThankYouPage.tsx';
import SellerPage from './pages/SellerPage.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import WhatsAppFloat from './components/WhatsAppFloat.tsx';
import { CookieConsent } from './components/CookieConsent.tsx';
import { EdgeDiagnostics } from './components/EdgeDiagnostics.tsx';
import { GTMPageViewTracker } from './components/GTMPageViewTracker.tsx';
import { PageTransition, ScrollProgress } from './components/PageTransition.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <GTMPageViewTracker />
      <ScrollProgress />
      <CookieConsent />
      <EdgeDiagnostics />
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
          <Route path="/valuation" element={<ValuationPage />} />
          <Route path="/valuation/result" element={<ValuationResultPage />} />
          <Route path="/free-valuation" element={<ValuationPage />} />
          <Route path="/admin/data" element={<AdminDataPage />} />
          <Route path="/admin/upload" element={<AdminUploadPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog-editor" element={<BlogEditor />} />
          <Route path="/blog-editor/:id" element={<BlogEditor />} />
          <Route path="/es/privacidad" element={<PrivacyPage />} />
          <Route path="/es/cookies" element={<CookiesPage />} />
          <Route path="/es/aviso-legal" element={<LegalPage />} />
          <Route path="/gracias" element={<ThankYouPage />} />
        </Routes>
      </PageTransition>
      <Footer />
    </Router>
  </StrictMode>
);
