import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

const CodeViewer = lazy(() => import('./components/CodeViewer'));
const Chatbot = lazy(() => import('./components/Chatbot'));

function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function CodeViewerPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  // Braces matter: scrollTo returns a Promise in recent Chrome, and an effect must not return one.
  useEffect(() => { window.scrollTo({ top: 0 }); }, [type]);
  // key: switching suites remounts the viewer, resetting view/copy state.
  return <CodeViewer key={type} codeType={type} onBack={() => navigate('/')} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Suspense fallback={<div className="route-loading">Loading…</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/code/:type" element={<CodeViewerPage />} />
            </Routes>
            <Chatbot />
          </Suspense>
        </BrowserRouter>
      </MotionConfig>
    </LanguageProvider>
  );
}
