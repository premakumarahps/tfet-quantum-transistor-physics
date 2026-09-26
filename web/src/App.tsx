import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuantumTunnelingSimulator } from './components/QuantumTunnelingSimulator';
import { BandgapSimulator } from './components/BandgapSimulator';
import { SubthresholdBenchmark } from './components/SubthresholdBenchmark';
import { TheorySection } from './components/TheorySection';
import { SlideDeckViewer } from './components/SlideDeckViewer';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTabState] = useState<string>('overview');

  const handleSetActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Top Auto-hiding Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={handleSetActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Overview (Hero + Theory Summary + Quick Simulator Preview) */}
        {activeTab === 'overview' && (
          <>
            <Hero setActiveTab={handleSetActiveTab} />
            <TheorySection setActiveTab={handleSetActiveTab} />
          </>
        )}

        {/* Tab 2: 1D Quantum Barrier Tunneling Simulator */}
        {activeTab === 'tunneling-sim' && (
          <div className="pt-24 animate-fadeIn">
            <QuantumTunnelingSimulator />
          </div>
        )}

        {/* Tab 3: Bandgap Inversion & BTBT Simulator */}
        {activeTab === 'bandgap-sim' && (
          <div className="pt-24 animate-fadeIn">
            <BandgapSimulator />
          </div>
        )}

        {/* Tab 4: Subthreshold Swing & Device Benchmarks */}
        {activeTab === 'subthreshold-bench' && (
          <div className="pt-24 animate-fadeIn">
            <SubthresholdBenchmark />
          </div>
        )}

        {/* Tab 5: Complete Solid State Theory */}
        {activeTab === 'theory' && (
          <div className="pt-24 animate-fadeIn">
            <TheorySection setActiveTab={handleSetActiveTab} />
          </div>
        )}

        {/* Tab 6: 23-Slide Defense Presentation Deck */}
        {activeTab === 'slides' && (
          <div className="pt-24 animate-fadeIn">
            <SlideDeckViewer />
          </div>
        )}
      </main>

      {/* Footer Attribution & Artifact Download Hub */}
      <Footer setActiveTab={handleSetActiveTab} />

    </div>
  );
};

export default App;
