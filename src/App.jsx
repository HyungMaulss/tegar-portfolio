import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Inspector from './components/Inspector';

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
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function CodeViewerPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [type]);
  // key: switching suites remounts the viewer, resetting view/copy state.
  return <CodeViewer key={type} codeType={type} onBack={() => navigate('/')} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Suspense fallback={<div className="route-loading mono">Loading…</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/code/:type" element={<CodeViewerPage />} />
            </Routes>
            <Chatbot />
          </Suspense>
          <Inspector />
        </BrowserRouter>
      </MotionConfig>
    </LanguageProvider>
  );
}
