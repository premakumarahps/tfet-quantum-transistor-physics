import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Sparkles, 
  Layers, 
  Zap, 
  ChevronRight, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { MathView } from './MathView';
import { calculateWkbBtbtTransmission } from '../core/tfetPhysics';

export const BandgapSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // User input states
  const [deviceType, setDeviceType] = useState<'tfet' | 'mosfet'>('tfet');
  const [vgs, setVgs] = useState<number>(0.85); // Gate Voltage in V
  const [vds, setVds] = useState<number>(0.60); // Drain Voltage in V
  const [material, setMaterial] = useState<'si' | 'ge' | 'sige'>('si');

  // Material properties
  const materialData = {
    si: { name: 'Silicon (Si)', bandgapEV: 1.12, mStar: 0.26, color: '#38bdf8' },
    ge: { name: 'Germanium (Ge)', bandgapEV: 0.66, mStar: 0.12, color: '#a855f7' },
    sige: { name: 'Si0.65Ge0.35 Heterojunction', bandgapEV: 0.88, mStar: 0.18, color: '#34d399' }
  }[material];

  const eg = materialData.bandgapEV;

  // Onset voltage for TFET tunneling window
  const vOnset = 0.35; // V
  const isTunnelingActive = deviceType === 'tfet' ? vgs > vOnset : vgs > 0.45;
  const tunnelingWindowEV = deviceType === 'tfet' ? Math.max(0, (vgs - vOnset) * 0.75) : 0;

  // WKB calculation
  const electricFieldMvPerCm = Math.max(0.1, (vgs * 1.8) + (vds * 0.5));
  const wkbResult = calculateWkbBtbtTransmission(eg, electricFieldMvPerCm, materialData.mStar);

  // Animation frame loop
  const animTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      animTimeRef.current += dt * (isTunnelingActive ? 3.0 : 0.8);
      drawBandDiagram();
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, [deviceType, vgs, vds, material, isTunnelingActive]);

  // Canvas drawing routine for energy bands
  const drawBandDiagram = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const t = animTimeRef.current;

    // Regions: Source (0 to 30%), Channel (30% to 70%), Drain (70% to 100%)
    const xSrcEnd = width * 0.30;
    const xDrnStart = width * 0.70;

    // Background Region Dividers
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(0, 0, xSrcEnd, height);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.6)';
    ctx.fillRect(xSrcEnd, 0, xDrnStart - xSrcEnd, height);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(xDrnStart, 0, width - xDrnStart, height);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xSrcEnd, 0); ctx.lineTo(xSrcEnd, height);
    ctx.moveTo(xDrnStart, 0); ctx.lineTo(xDrnStart, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Baseline Reference Heights
    const baseMidY = height * 0.48;
    const egPx = eg * 75; // bandgap height in pixels

    // Energy band profiles
    const ecPoints: { x: number; y: number }[] = [];
    const evPoints: { x: number; y: number }[] = [];

    const numPoints = 120;
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width;
      let ecY = 0;
      let evY = 0;

      if (deviceType === 'tfet') {
        // TFET p-i-n: Source is p+ (high bands), Channel is i (pulled down by Vgs), Drain is n+ (low bands, pulled down by Vds)
        const srcEc = baseMidY - egPx * 0.4;
        const chEc = srcEc + (vgs * 110); // gate voltage pulls channel DOWN
        const drnEc = chEc + (vds * 65); // drain voltage pulls drain further DOWN

        if (x < xSrcEnd) {
          // Source region
          ecY = srcEc;
        } else if (x >= xSrcEnd && x <= xDrnStart) {
          // Channel region transition
          const prog = (x - xSrcEnd) / (xDrnStart - xSrcEnd);
          // Sigmoidal transition into channel
          const smooth = 0.5 - 0.5 * Math.cos(prog * Math.PI);
          ecY = srcEc + (chEc - srcEc) * smooth;
        } else {
          // Drain region
          const prog = (x - xDrnStart) / (width - xDrnStart);
          const smooth = 0.5 - 0.5 * Math.cos(Math.min(1, prog * 1.5) * Math.PI);
          ecY = chEc + (drnEc - chEc) * smooth;
        }
        evY = ecY + egPx;
      } else {
        // MOSFET n-p-n: Source is n+ (low), Channel has barrier (pulled down by Vgs), Drain is n+ (low, pulled down by Vds)
        const srcEc = baseMidY + 30;
        const maxBarrierEc = baseMidY - 90 + Math.max(0, (1.2 - vgs) * 90);
        const drnEc = srcEc + (vds * 70);

        if (x < xSrcEnd) {
          ecY = srcEc;
        } else if (x >= xSrcEnd && x <= xDrnStart) {
          // Parabolic potential barrier in channel
          const prog = (x - xSrcEnd) / (xDrnStart - xSrcEnd);
          const barrierShape = Math.sin(prog * Math.PI);
          ecY = srcEc - (srcEc - maxBarrierEc) * barrierShape;
        } else {
          const prog = (x - xDrnStart) / (width - xDrnStart);
          ecY = srcEc + (drnEc - srcEc) * Math.min(1, prog * 1.8);
        }
        evY = ecY + egPx;
      }

      ecPoints.push({ x, y: ecY });
      evPoints.push({ x, y: evY });
    }

    // Draw Shaded Valence Band (Full of electrons in Source)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.beginPath();
    ctx.moveTo(evPoints[0].x, evPoints[0].y);
    for (let p of evPoints) ctx.lineTo(p.x, p.y);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Draw Conduction Band (Ec)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ecPoints[0].x, ecPoints[0].y);
    for (let p of ecPoints) ctx.lineTo(p.x, p.y);
    ctx.stroke();

    // Draw Valence Band (Ev)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(evPoints[0].x, evPoints[0].y);
    for (let p of evPoints) ctx.lineTo(p.x, p.y);
    ctx.stroke();

    // Labels for Ec and Ev
    ctx.fillStyle = '#06b6d4';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('Conduction Band (Ec)', 15, ecPoints[0].y - 12);
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText('Valence Band (Ev)', 15, evPoints[0].y + 20);

    // If TFET and Tunneling Window is open, draw horizontal tunneling energy window
    if (deviceType === 'tfet' && isTunnelingActive) {
      const srcEvY = evPoints[5].y;
      const chEcY = ecPoints[Math.floor(numPoints * 0.45)].y;

      if (srcEvY > chEcY) {
        // Energetic tunneling window exists between srcEvY and chEcY
        const windowTopY = chEcY;
        const windowBottomY = srcEvY;

        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fillRect(xSrcEnd - 30, windowTopY, 60, windowBottomY - windowTopY);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(xSrcEnd - 30, windowTopY, 60, windowBottomY - windowTopY);
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`ΔΦ = ${tunnelingWindowEV.toFixed(2)} eV (BTBT Window)`, xSrcEnd - 25, windowTopY - 8);

        // Animated Horizontal Tunneling Electrons
        ctx.fillStyle = '#34d399';
        for (let eIdx = 0; eIdx < 6; eIdx++) {
          const eProg = ((t * 0.8 + eIdx * 0.2) % 1);
          const eX = (xSrcEnd - 25) + eProg * 140;
          const eY = windowTopY + ((windowBottomY - windowTopY) * 0.5) + Math.sin(eIdx * 2) * 8;

          ctx.beginPath();
          ctx.arc(eX, eY, 4, 0, Math.PI * 2);
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    } else if (deviceType === 'mosfet' && vgs > 0.6) {
      // MOSFET Thermionic Emission Particles climbing over barrier
      ctx.fillStyle = '#f59e0b';
      for (let eIdx = 0; eIdx < 5; eIdx++) {
        const eProg = ((t * 0.6 + eIdx * 0.22) % 1);
        const eX = 40 + eProg * (width - 80);
        // Follow Ec curve height
        const ptIdx = Math.min(numPoints, Math.floor((eX / width) * numPoints));
        const eY = ecPoints[ptIdx].y - 6;

        ctx.beginPath();
        ctx.arc(eX, eY, 3.5, 0, Math.PI * 2);
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('Thermionic Barrier Climbing (Over Ec)', width * 0.35, baseMidY - 110);
    }

    // Region Header Tags
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px "Outfit", sans-serif';
    if (deviceType === 'tfet') {
      ctx.fillText('SOURCE (p+ Region)', xSrcEnd * 0.3, 30);
      ctx.fillText('CHANNEL (Intrinsic i)', xSrcEnd + (xDrnStart - xSrcEnd) * 0.25, 30);
      ctx.fillText('DRAIN (n+ Region)', xDrnStart + (width - xDrnStart) * 0.35, 30);
    } else {
      ctx.fillText('SOURCE (n+ Region)', xSrcEnd * 0.3, 30);
      ctx.fillText('CHANNEL (p-Substrate)', xSrcEnd + (xDrnStart - xSrcEnd) * 0.25, 30);
      ctx.fillText('DRAIN (n+ Region)', xDrnStart + (width - xDrnStart) * 0.35, 30);
    }
  };

  return (
    <section className="py-12 bg-slate-950/40 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Semiconductor Bandgap Dynamics</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Slides 5, 6, 10 & 11</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Bandgap Inversion & BTBT Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Compare the thermionic barrier of a MOSFET against the gated reverse-biased $p^+-i-n^+$ junction of a TFET. See how positive gate bias opens an energetic tunneling window $\Delta\Phi$.
            </p>
          </div>

          {/* Device Type Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setDeviceType('tfet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                deviceType === 'tfet'
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>TFET (Band-to-Band Tunneling)</span>
            </button>

            <button
              onClick={() => setDeviceType('mosfet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                deviceType === 'mosfet'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg shadow-amber-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>MOSFET (Thermionic Emission)</span>
            </button>
          </div>
        </div>

        {/* Master Simulator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Voltage Sliders Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Terminal Electrostatic Biases
                </span>
                <Sliders className="w-4 h-4 text-cyan-400" />
              </div>

              {/* Gate Voltage Vgs */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Gate Bias (<span className="font-mono text-cyan-400">V_GS</span>)</span>
                  <span className="font-mono text-cyan-300 font-bold">{vgs.toFixed(2)} V</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={1.5}
                  step={0.05}
                  value={vgs}
                  onChange={(e) => setVgs(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.0 V (OFF State)</span>
                  <span className="text-emerald-400">Onset ~0.35V</span>
                  <span>1.5 V (Strong ON)</span>
                </div>
              </div>

              {/* Drain Voltage Vds */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Drain Bias (<span className="font-mono text-violet-400">V_DS</span>)</span>
                  <span className="font-mono text-violet-300 font-bold">{vds.toFixed(2)} V</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={1.2}
                  step={0.05}
                  value={vds}
                  onChange={(e) => setVds(Number(e.target.value))}
                  className="w-full accent-violet-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.0 V</span>
                  <span>1.2 V</span>
                </div>
              </div>

              {/* Material Selector */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2 font-mono">Semiconductor Material:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['si', 'ge', 'sige'] as const).map((mat) => {
                    const isActive = material === mat;
                    return (
                      <button
                        key={mat}
                        onClick={() => setMaterial(mat)}
                        className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/60 shadow-md shadow-cyan-500/20'
                            : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                        }`}
                      >
                        <div className="uppercase font-bold">{mat}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                          {mat === 'si' ? '1.12 eV' : mat === 'ge' ? '0.66 eV' : '0.88 eV'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Tunneling Window & Physics Readout */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Operating Status & WKB Flux
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Device State</div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isTunnelingActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                    <span>{isTunnelingActive ? 'ON State (Active Current)' : 'OFF State (Subthreshold)'}</span>
                  </div>
                </div>
                {deviceType === 'tfet' && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-400">Tunneling Window</div>
                    <div className="text-sm font-bold font-mono text-emerald-400">
                      ΔΦ = {tunnelingWindowEV.toFixed(2)} eV
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Junction Field (<MathView latex="\mathcal{E}" />)</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {electricFieldMvPerCm.toFixed(2)} MV/cm
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">WKB Exponent</span>
                  <span className="font-mono font-bold text-violet-300">
                    {wkbResult.exponent}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                {deviceType === 'tfet' ? (
                  isTunnelingActive ? (
                    <span className="text-emerald-300">
                      ✓ Bandgap inversion active: Channel <code className="text-white">Ec</code> is pulled below Source <code className="text-white">Ev</code>, allowing cold electrons to tunnel directly across the junction!
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Channel Ec is higher than Source Ev. No available density of states for tunneling, leading to near-zero leakage current (<MathView latex="I_{\text{off}} \sim 10^{-13}\text{ A}/\mu\text{m}" />).
                    </span>
                  )
                ) : (
                  <span className="text-amber-300">
                    MOSFET thermionic mode: current relies on carriers having sufficient thermal energy <MathView latex="k_B T" /> to climb above the barrier peak, subjecting it to the <MathView latex="60\text{ mV/dec}" /> subthreshold limit.
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Energy Band Diagram Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
              
              {/* Canvas Header */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dynamic Energy Band Profile: <span className="text-cyan-300">{materialData.name}</span> ({eg} eV Bandgap)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Mode: {deviceType === 'tfet' ? 'TFET Band-to-Band' : 'MOSFET Thermionic'}
                </span>
              </div>

              {/* Canvas */}
              <div className="p-3 bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={420}
                  className="w-full h-auto rounded-xl border border-slate-900 bg-[#070a12]"
                />
              </div>

              {/* Diagram Legend */}
              <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="text-slate-300">Conduction Band (<MathView latex="E_C" />)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-violet-400" />
                    <span className="text-slate-300">Valence Band (<MathView latex="E_V" />)</span>
                  </div>
                  {deviceType === 'tfet' && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500" />
                      <span className="text-emerald-300">Tunneling Window (<MathView latex="\Delta\Phi" />)</span>
                    </div>
                  )}
                </div>

                <div className="font-mono text-slate-400 text-xs">
                  {deviceType === 'tfet' ? 'Horizontal Quantum Tunneling' : 'Vertical Thermal Emission'}
                </div>
              </div>

            </div>

            {/* Mechanism Comparison Callout (Slide 11) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Physical Mechanism Contrast (Slide 11)
                </span>
                <span className="text-xs font-mono text-slate-400">Thermal vs Quantum</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400">Classical MOSFET Thermionic Emission</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Electrons overcome the barrier via thermal excitation. The Maxwell-Boltzmann high-energy tail decays as <MathView latex="\exp(-E/k_B T)" />, which mathematically locks the subthreshold swing to <MathView latex="\ge 60\text{ mV/dec}" /> at room temperature.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-1">
                  <div className="font-bold text-emerald-400">TFET Band-to-Band Tunneling (BTBT)</div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Electrons tunnel horizontally from the valence band of the $p^+$ source into the conduction band of the channel. The bandgap acts as an energy filter, eliminating thermal tails and breaking the <MathView latex="60\text{ mV/dec}" /> limit!
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
