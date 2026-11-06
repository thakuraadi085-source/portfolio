import { lazy, Suspense } from 'react';
import { Backdrop } from './components/Backdrop';
import { AgentBuild, GhostCursors, Preloader, SelectionBox } from './components/Fx';
import { CursorTrail } from './components/CursorTrail';
import { BackToTop, Footer, Navbar, StatusBar } from './components/Chrome';
import { About, Build, Contact, Education, Hero, Learning, Projects, Research, Skills, TechStack } from './components/Sections';

// Backdrop is decorative; lazy wrapper kept simple to avoid blocking first paint.
const LazyTrail = lazy(() => Promise.resolve({ default: CursorTrail }));

export default function App() {
  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <Preloader />
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Skills />
        <TechStack />
        <Projects />
        <Research />
        <Build />
        <Learning />
        <Contact />
      </main>
      <Footer />
      <StatusBar />
      <BackToTop />
      <AgentBuild />
      <GhostCursors />
      <SelectionBox />
      <Suspense fallback={null}><LazyTrail /></Suspense>
    </>
  );
}
