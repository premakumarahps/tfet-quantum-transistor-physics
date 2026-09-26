import React from 'react';
import { 
  Atom, 
  ShieldCheck, 
  Download, 
  Presentation, 
  Waves, 
  Activity, 
  BarChart3, 
  BookOpen 
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#05080f] border-t border-slate-800/80 pt-16 pb-24 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Project Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-violet-500/40 p-1 bg-white shadow-md shadow-violet-950/40">
                <img 
                  src="/tfet_logo.svg" 
                  alt="TFET Quantum Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-violet-200 to-cyan-400 bg-clip-text text-transparent">
                TFET QUANTUM
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs">
              A solid-state semiconductor physics and quantum transport research platform exploring Tunneling Field-Effect Transistors (TFETs) to overcome the fundamental 60 mV/decade Boltzmann Tyranny.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Academic Research Team</span>
              </div>
              <div className="text-white font-bold text-sm">
                Group A
              </div>
              <div className="font-mono text-violet-400 text-xs">
                Solid State Materials Curriculum
              </div>
            </div>
          </div>

          {/* Quick Simulation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono">
              Interactive Simulators
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('tunneling-sim')} 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1D Quantum Tunneling Canvas</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('bandgap-sim')} 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-violet-400" />
                  <span>Bandgap Inversion & BTBT</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('subthreshold-bench')} 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Subthreshold Swing & Benchmarks</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('theory')} 
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Solid State Physics Theory</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Theoretical Domains */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono">
              Physics Topics
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>• The 60 mV/dec Boltzmann Limit</li>
              <li>• 1D Time-Independent Schrödinger Eq.</li>
              <li>• Wentzel–Kramers–Brillouin (WKB) Integral</li>
              <li>• Reverse-Biased p-i-n Junctions</li>
              <li>• Sub-10nm Direct S/D Tunneling</li>
              <li>• Type-II Staggered Heterojunctions</li>
              <li>• Carbon Nanotube Ballistic TFETs</li>
            </ul>
          </div>

          {/* Artifact Downloads */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] font-mono">
              Presentation Document
            </h4>
            <p className="text-[11px] text-slate-400">
              Download the complete 23-slide defense presentation prepared by Group A.
            </p>
            <a
              href="/docs/TFET_Working_Analysis_Presentation.pdf"
              download="TFET_Solid_State_Materials_Presentation_Group_A.pdf"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-lg shadow-violet-600/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF (3.71 MB)</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright & Citation Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © Academic Engineering Project • Solid State Materials Curriculum
          </div>
          <div className="flex items-center gap-2">
            <span>Authored by</span>
            <strong className="text-slate-300">Group A • Tunneling Field-Effect Transistors</strong>
          </div>
        </div>

      </div>
    </footer>
  );
};
