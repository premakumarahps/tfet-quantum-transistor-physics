import React, { useState, useEffect } from 'react';
import { 
  Atom, 
  Activity, 
  Layers, 
  Presentation, 
  BookOpen, 
  Cpu, 
  Download, 
  Menu, 
  X,
  Sparkles,
  BarChart3,
  Waves
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
          setIsVisible(false); // Scrolling down
        } else if (lastScrollY - currentScrollY > 10) {
          setIsVisible(true); // Scrolling up
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Atom },
    { id: 'tunneling-sim', label: '1D Tunneling Simulator', icon: Waves, badge: 'Live Quantum' },
    { id: 'bandgap-sim', label: 'Bandgap & Inversion', icon: Activity, badge: 'BTBT' },
    { id: 'subthreshold-bench', label: 'Subthreshold & Benchmark', icon: BarChart3, badge: 'Sub-60mV' },
    { id: 'theory', label: 'Solid State Theory', icon: BookOpen },
    { id: 'slides', label: 'Defense Deck', icon: Presentation, badge: '23 Slides' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } bg-[#070a12]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/80`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-violet-500/40 p-1 bg-white group-hover:border-cyan-400 transition-colors shadow-lg shadow-violet-950/40">
              <img 
                src="/tfet_logo.svg" 
                alt="TFET Quantum Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-violet-200 to-cyan-400 bg-clip-text text-transparent">
                  TFET QUANTUM
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-violet-500/20 text-violet-300 rounded border border-violet-500/30">
                  SOLID STATE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Tunneling Field-Effect Transistors • Group A
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Downloads & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="/docs/TFET_Working_Analysis_Presentation.pdf"
              download="TFET_Solid_State_Materials_Presentation_Group_A.pdf"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-600/30 border border-violet-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Defense Deck (PDF)</span>
              <span className="sm:hidden">PDF</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-3 pb-6 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium text-left transition-all ${
                      isActive
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                        : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Quick Dock for Desktop */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-full shadow-2xl shadow-black/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
