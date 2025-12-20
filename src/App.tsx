import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ChibiProvider } from './context/ChibiContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

import Achievements from './pages/Achievements';
import Experience from './pages/Experience';
import NotFound from './pages/NotFound';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { TransitionProvider } from './context/TransitionContext';


import { initDevToolsNotice } from './utils/devtoolsNotice';

const App = () => {
  React.useEffect(() => {
    initDevToolsNotice();
  }, []);

  return (
    <Router>
      <ChibiProvider>
        <TransitionProvider>
          <ScrollToTop />
          <Layout>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </TransitionProvider>
      </ChibiProvider>
    </Router>
  );
};

export default App;
