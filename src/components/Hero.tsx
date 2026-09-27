import React from 'react';
import { 
  Atom, 
  Waves, 
  Activity, 
  Sparkles, 
  ChevronRight, 
  Presentation, 
  BookOpen, 
  BarChart3,
  Layers,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { MathView } from './MathView';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-slate-800/80">
      
      {/* Background Quantum Glows & Atmospheric Field */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-cyan-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Quantum Lattice Coordinate Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b15_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges & Academic Lineage */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span>Solid State Materials & Devices</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Semester 4 Physics Exploration</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Atom className="w-3.5 h-3.5" />
            <span>Quantum Mechanical Band-to-Band Tunneling (BTBT)</span>
          </div>

          {/* Group A Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-950/80 via-slate-900 to-cyan-950/80 border border-violet-500/50 text-violet-200 text-xs font-medium shadow-lg shadow-violet-950/30">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            <span>Theoretical Research: <strong>Group A</strong></span>
            <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200 font-mono text-[10px] font-bold border border-violet-500/40">
              Solid State Physics
            </span>
          </div>
        </div>

        {/* Main Title Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            TUNNELING FIELD-EFFECT{' '}
            <span className="bg-gradient-to-r from-white via-violet-300 to-cyan-400 bg-clip-text text-transparent">
              TRANSISTORS (TFET)
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Breaking the fundamental <strong>60 mV/decade Boltzmann Tyranny</strong> through quantum mechanical band-to-band tunneling. An in-depth solid state materials study exploring 1D Schrödinger barrier penetration, WKB approximations, sub-10nm MOSFET breakdown, and next-generation steep-slope heterojunction architectures.
          </p>

          {/* Governing Physics Teaser Formula Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-violet-400 font-bold">Sub-Boltzmann Swing:</span>
              <MathView latex="SS = \frac{k_B T}{q}\ln(10) < 60\text{ mV/dec}" />
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-cyan-400 font-bold">WKB Tunneling:</span>
              <MathView latex="T_{\text{WKB}} \sim \exp\left(-\frac{4\sqrt{2m^*}E_g^{3/2}}{3q\hbar\mathcal{E}}\right)" />
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('tunneling-sim')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 border border-violet-400/40 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Waves className="w-4 h-4" />
              <span>Launch 1D Tunneling Simulator</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('bandgap-sim')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-violet-300 border border-violet-500/30 hover:border-violet-400/60 shadow-lg shadow-violet-950/30 transition-all hover:scale-[1.02]"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Bandgap & BTBT Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('subthreshold-bench')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 border border-slate-700 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Device Benchmarks</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/70 hover:bg-slate-800/90 text-slate-200 border border-slate-700 transition-all"
            >
              <Presentation className="w-4 h-4 text-amber-400" />
              <span>23-Slide Defense Deck</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Discipline Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: 1D Quantum Tunneling */}
          <div 
            onClick={() => setActiveTab('tunneling-sim')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-violet-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
              <Waves className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
              Quantum Wave Mechanics
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-violet-300 transition-colors">
              1D Potential Barrier Tunneling
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Explore how electrons penetrate classically forbidden energy barriers (<MathView latex="E < V_0" />), calculating real-time wavefunction solutions <MathView latex="\psi(x)" /> and transmission <MathView latex="T" />.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-400">
              <span>Simulate Wavepacket</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Boltzmann Tyranny & MOSFET Limit */}
          <div 
            onClick={() => setActiveTab('subthreshold-bench')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-rose-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Scaling Limitation
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-rose-300 transition-colors">
              The Boltzmann 60 mV/dec Limit
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Why thermionic emission over potential barriers prevents subthreshold swing from dropping below <MathView latex="60\text{ mV/dec}" /> at <MathView latex="300\text{ K}" />, driving excessive heat.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <span>Inspect Subthreshold Slope</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Band-to-Band Tunneling (BTBT) */}
          <div 
            onClick={() => setActiveTab('bandgap-sim')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              TFET Operation
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
              Bandgap Inversion & BTBT
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Observe how gate voltage pulls the channel conduction band below the source valence band, opening an energetic tunneling window <MathView latex="\Delta\Phi" />.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <span>Open Tunneling Window</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Future Architectures & Heterojunctions */}
          <div 
            onClick={() => setActiveTab('theory')}
            className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Frontier Devices
            </div>
            <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
              Heterojunction & CNTFET
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Overcoming the <MathView latex="I_{\text{on}}" /> current bottleneck with engineered Type-II staggered heterojunctions (<MathView latex="\text{Si}_{0.65}\text{Ge}_{0.35}" />) and 1D ballistic Carbon Nanotubes.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span>Discover Nanotube Physics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
