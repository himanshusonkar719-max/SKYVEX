import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SolarSystem3D } from './components/SolarSystem3D';
import { CosmosExplorer } from './components/CosmosExplorer';
import { MissionsTimeline } from './components/MissionsTimeline';
import { CosmicObservatory } from './components/CosmicObservatory';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#080B1A] text-[#F5F4FF] selection:bg-[#42D9F5]/30 selection:text-[#42D9F5] font-sans relative">
      {/* Universal Background Subtle Grid */}
      <div className="fixed inset-0 cosmic-grid pointer-events-none z-0 opacity-40" />

      {/* Main Navigation */}
      <Navbar />

      {/* Main Experience Flow */}
      <main className="relative z-10">
        <HeroSection />
        <SolarSystem3D />
        <CosmosExplorer />
        <MissionsTimeline />
        <CosmicObservatory />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
