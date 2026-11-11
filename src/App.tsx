import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Properties from './components/Properties';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import GoogleReviews from './components/GoogleReviews';
import Footer from './components/Footer';

function App() {
  React.useEffect(() => {
    const opts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const legacyObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, opts);
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
      .forEach((el) => legacyObserver.observe(el));

    const newObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); newObserver.unobserve(e.target); } });
    }, opts);
    document.querySelectorAll('.sr, .sr-left, .sr-right')
      .forEach((el) => newObserver.observe(el));

    return () => { legacyObserver.disconnect(); newObserver.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      <Header />
      <Hero />
      <Properties />
      <Services />
      <About />
      <Contact />
      <GoogleReviews />
      <Footer />
    </div>
  );
}

export default App;
