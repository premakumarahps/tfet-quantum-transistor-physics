import React from 'react';
import { 
  BookOpen, 
  Atom, 
  Layers, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  TrendingDown,
  Cpu
} from 'lucide-react';
import { MathView } from './MathView';
import { CORE_EQUATIONS } from '../core/tfetData';

interface TheorySectionProps {
  setActiveTab: (tab: string) => void;
}

export const TheorySection: React.FC<TheorySectionProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 py-12">
      
      {/* SECTION 1: THE MOSFET CRISIS & BOLTZMANN TYRANNY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Nanoscale Scaling Bottleneck</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Why Classical MOSFETs Hit a Physical Wall
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                For over five decades, Moore’s Law advanced through geometric scaling of silicon MOSFETs. However, as gate lengths approached the sub-10nm regime, fundamental solid-state physical limits halted supply voltage (<MathView latex="V_{DD}" />) reduction.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase">Limit 1: The Boltzmann Tyranny (60 mV/dec)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    In classical MOSFETs, current conduction relies on <strong>thermionic emission</strong> where electrons must thermally climb over a potential barrier. The thermal distribution of electrons follows the Maxwell-Boltzmann tail <MathView latex="\propto \exp(-E/k_B T)" />, dictating that subthreshold swing cannot drop below:
                  </p>
                  <div className="py-1 text-center font-mono text-cyan-300 text-xs">
                    <MathView latex="SS = \frac{k_B T}{q} \ln(10) \left(1 + \frac{C_{\text{dep}}}{C_{\text{ox}}}\right) \ge 59.6 \text{ mV/dec at } 300\text{ K}" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    To maintain an <MathView latex="I_{\text{on}}/I_{\text{off}}" /> ratio of <MathView latex="10^6" />, <MathView latex="V_{DD}" /> cannot be scaled below ~0.7V–1.0V, causing catastrophic chip power densities.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase">Limit 2: Sub-10nm Direct Source-to-Drain Tunneling (Slide 8)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    When the gate length <MathView latex="L_g" /> is scaled from 13nm down to 10nm, 7nm, and 4nm, the channel barrier becomes so thin that electrons directly quantum-tunnel from source to drain even when the device is OFF, creating unquenchable leakage currents.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-xs font-mono font-bold text-violet-400 uppercase">Limit 3: Carrier Velocity Saturation (Slide 22)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    At high internal electric fields, carrier mobility degrades as <MathView latex="\mu \propto 1/\mathcal{E}" />, capping electron drift velocity at optical phonon scattering limits (<MathView latex="v_{\text{sat}} \approx 10^7\text{ cm/s}" />).
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Graphic from Slide 8 */}
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative group">
                <img
                  src="/slides/slide_08.png"
                  alt="Slide 8: Direct Source-to-Drain Tunneling at Sub-10nm"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center text-[11px] font-mono text-slate-400">
                Defense Slide 08: Direct S/D Tunneling Spectral Current Breakdown
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: 1D SCHRODINGER QUANTUM BARRIER THEORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
            <Atom className="w-3.5 h-3.5" />
            <span>Quantum Mechanical Foundations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            1D Schrödinger Barrier Penetration & WKB
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            In quantum mechanics, particle wavefunctions do not truncate discontinuously at barrier interfaces, but decay exponentially with an evanescent tail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-white">Wavevector & Decay Parameter</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In Region 1 (<MathView latex="E > V" />), wavevector is real: <MathView latex="k = \sqrt{2m^* E}/\hbar" />. In Region 2 inside the barrier (<MathView latex="E < V_0" />), the wavevector becomes imaginary, defined by the decay constant <MathView latex="\kappa" />:
            </p>
            <div className="pt-2 text-center text-xs font-mono text-cyan-300">
              <MathView latex="\kappa = \frac{\sqrt{2m^*(V_0 - E)}}{\hbar}" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-white">Exact Transmission Formula</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Applying continuity of <MathView latex="\psi(x)" /> and its spatial derivative <MathView latex="\frac{d\psi}{dx}" /> at boundaries <MathView latex="x = 0" /> and <MathView latex="x = L" /> yields the transmission probability <MathView latex="T" />:
            </p>
            <div className="pt-2 text-center text-xs font-mono text-emerald-300">
              <MathView latex="T = \frac{1}{1 + \frac{V_0^2 \sinh^2(\kappa L)}{4E(V_0 - E)}}" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-white">WKB Approximation Integral</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For arbitrary or non-uniform potential barriers (like the triangular bandgap barrier in a reverse-biased p-i-n junction), the WKB semi-classical approximation gives:
            </p>
            <div className="pt-2 text-center text-xs font-mono text-violet-300">
              <MathView latex="T_{\text{WKB}} \approx \exp\left(-\frac{4\sqrt{2m^*}E_g^{3/2}}{3q\hbar\mathcal{E}}\right)" />
            </div>
          </div>

        </div>

        <div className="text-center">
          <button
            onClick={() => setActiveTab('tunneling-sim')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-lg shadow-violet-600/20"
          >
            <span>Simulate These Wave Equations in the 1D Tunneling Canvas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 3: TFET OPERATING PRINCIPLE & ENERGY FILTERING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold">
                Device Operating Mechanism
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                How TFET Breaks the Boltzmann Tyranny
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The Tunneling Field-Effect Transistor (TFET) replaces the traditional n-p-n or p-n-p configuration with a gated, reverse-biased <strong>p-i-n junction</strong> (<MathView latex="p^+" /> source, intrinsic <MathView latex="i" /> channel, and <MathView latex="n^+" /> drain).
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">1. The Energy Filtering Effect</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Electrons in the source valence band are energetically cut off at the valence band edge <MathView latex="E_{V,\text{src}}" />. High-energy thermal electrons are physically prevented from contributing to subthreshold leakage by the forbidden bandgap.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">2. Gate-Controlled Band-to-Band Tunneling (BTBT)</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    When <MathView latex="V_{GS} > V_{\text{onset}}" />, the gate pulls channel <MathView latex="E_C" /> below source <MathView latex="E_V" />. This opens an energetic tunneling window <MathView latex="\Delta\Phi" /> through which cold electrons tunnel directly across the thin barrier.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-violet-400">3. True Sub-60 mV/dec Operation</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Because thermionic barrier climbing is eliminated, subthreshold swing can drop well below <MathView latex="60\text{ mV/dec}" /> at room temperature, enabling supply voltage scaling down to <strong>0.3V</strong>!
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
              <img
                src="/slides/slide_11.png"
                alt="Slide 11: TFET Mechanism Thermal Emission vs Tunneling"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: FRONTIER SOLUTIONS (HETEROJUNCTIONS & CNTFET) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overcoming the ON-Current Bottleneck</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frontier Advancements: Heterojunctions & CNTFETs
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2">
            While homojunction Silicon TFETs solve leakage, their ON-current is low due to the wide 1.12 eV bandgap. Emerging research solves this through engineered band alignments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Staggered & Broken Gap Architectures
              </span>
              <span className="text-xs font-mono text-slate-400">Slide 18</span>
            </div>
            <h3 className="text-xl font-bold text-white">Heterojunction TFETs (SiGe / III-V)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              By pairing different semiconductor materials at the junction (e.g. <MathView latex="\text{Si}_{0.65}\text{Ge}_{0.35}" />, InAs/GaSb), a <strong>Type-II staggered</strong> or <strong>Type-III broken</strong> band alignment is established.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Shortened Tunneling Distance:</strong> Band offsets effectively reduce the physical tunneling barrier width, dramatically boosting <MathView latex="I_{\text{on}}" />.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Suppressed Ambipolar Leakage:</strong> Heterojunction band barriers prevent unwanted drain-side tunneling during negative gate swings.</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                1D Ballistic Transport
              </span>
              <span className="text-xs font-mono text-slate-400">Slide 18</span>
            </div>
            <h3 className="text-xl font-bold text-white">Carbon Nanotube TFETs (CNTFET)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Replacing planar bulk silicon with single-wall carbon nanotubes (CNTs) establishes a purely 1D cylindrical gate-all-around quantum transport channel.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Near-Ideal Electrostatic Control:</strong> Cylindrical gate wraparound maximizes gate capacitive coupling, producing sub-40 mV/dec swing.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Ultra-Low Effective Mass:</strong> Light carrier mass (<MathView latex="m^* \approx 0.05 m_0" />) enables high ballistic injection velocity and superior drive current.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: MASTER EQUATIONS SUMMARY REGISTRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Master Mathematical Physics Registry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Analytical equations governing solid-state transport in nanoscale transistors.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 self-start sm:self-auto">
              5 Core Formulations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORE_EQUATIONS.map((eq) => (
              <div key={eq.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{eq.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {eq.domain}
                  </span>
                </div>
                <div className="py-2 text-center overflow-x-auto text-cyan-300">
                  <MathView latex={eq.latex} />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {eq.description}
                </p>
                <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-1.5">
                  <strong className="text-slate-400">Significance:</strong> {eq.significance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
