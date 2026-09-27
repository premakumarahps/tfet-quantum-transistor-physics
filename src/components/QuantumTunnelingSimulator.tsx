import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  Sliders, 
  Info, 
  CheckCircle2,
  Atom,
  HelpCircle
} from 'lucide-react';
import { calculate1DTunneling, Tunneling1DParams } from '../core/tfetPhysics';
import { MathView } from './MathView';

export const QuantumTunnelingSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Physical parameter states
  const [energyEV, setEnergyEV] = useState<number>(0.85); // E
  const [barrierHeightEV, setBarrierHeightEV] = useState<number>(1.25); // V_0
  const [barrierWidthNm, setBarrierWidthNm] = useState<number>(1.2); // L in nm
  const [effectiveMass, setEffectiveMass] = useState<number>(0.26); // m* / m_0 (0.26 for Si)
  const [waveMode, setWaveMode] = useState<'wavefunction' | 'probability'>('wavefunction');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Result calculation
  const result = calculate1DTunneling({
    electronEnergyEV: energyEV,
    barrierHeightEV: barrierHeightEV,
    barrierWidthNm: barrierWidthNm,
    effectiveMassRatio: effectiveMass
  });

  // Time evolution loop for wave animation
  const animTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);

  useEffect(() => {
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (!isPaused) {
        // Increment phase speed proportional to electron energy sqrt(E)
        animTimeRef.current += dt * (Math.sqrt(Math.max(0.1, energyEV)) * 7);
      }

      drawCanvas();
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, [energyEV, barrierHeightEV, barrierWidthNm, effectiveMass, waveMode, isPaused]);

  // Canvas drawing routine
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const t = animTimeRef.current;

    // Physical dimensions mapped to screen
    // Total simulated width: 8 nm
    const totalSimNm = 8.0;
    const nmToPx = width / totalSimNm;

    // Barrier position: center of screen
    const barrierStartNm = (totalSimNm - barrierWidthNm) / 2;
    const barrierEndNm = barrierStartNm + barrierWidthNm;

    const barrierStartX = barrierStartNm * nmToPx;
    const barrierEndX = barrierEndNm * nmToPx;
    const barrierWidthPx = barrierEndX - barrierStartX;

    // 1. Draw Background Grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Zero Energy Axis
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 3. Draw Potential Barrier V(x)
    // Scale energy to height: 1 eV = 80 px
    const evScale = 70;
    const barrierTopY = centerY - barrierHeightEV * evScale;
    const energyLevelY = centerY - energyEV * evScale;

    // Barrier Fill
    const barrierGradient = ctx.createLinearGradient(barrierStartX, barrierTopY, barrierStartX, centerY);
    barrierGradient.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
    barrierGradient.addColorStop(1, 'rgba(244, 63, 94, 0.08)');
    ctx.fillStyle = barrierGradient;
    ctx.fillRect(barrierStartX, barrierTopY, barrierWidthPx, centerY - barrierTopY);

    // Barrier Outline
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(barrierStartX, centerY);
    ctx.lineTo(barrierStartX, barrierTopY);
    ctx.lineTo(barrierEndX, barrierTopY);
    ctx.lineTo(barrierEndX, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // 4. Draw Electron Energy Level E Line
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, energyLevelY);
    ctx.lineTo(width, energyLevelY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label on Energy Level
    ctx.fillStyle = '#06b6d4';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(`E = ${energyEV.toFixed(2)} eV`, 15, energyLevelY - 8);

    // Label on Barrier Height
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`V0 = ${barrierHeightEV.toFixed(2)} eV (L = ${barrierWidthNm.toFixed(2)} nm)`, barrierStartX + 6, barrierTopY - 8);

    // 5. Draw Quantum Wavefunction or Probability Density
    const k1 = result.k1Wavevector; // in nm^-1
    const kappa = result.decayParamKappa; // in nm^-1
    const T = result.transmissionCoeff;
    const transAmp = Math.sqrt(T);
    const refAmp = Math.sqrt(result.reflectionCoeff);

    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const stepPx = 1.5;
    for (let px = 0; px <= width; px += stepPx) {
      const xNm = px / nmToPx;
      let val = 0;

      if (xNm < barrierStartNm) {
        // Region 1: Incident + Reflected wave
        const distFromBarrier = barrierStartNm - xNm;
        const incidentPhase = k1 * (xNm - barrierStartNm) - t;
        const reflectedPhase = -k1 * (xNm - barrierStartNm) - t;

        if (waveMode === 'wavefunction') {
          val = Math.cos(incidentPhase) + refAmp * Math.cos(reflectedPhase + Math.PI * 0.5);
        } else {
          // Probability density |psi|^2
          const re = Math.cos(incidentPhase) + refAmp * Math.cos(reflectedPhase + Math.PI * 0.5);
          const im = Math.sin(incidentPhase) + refAmp * Math.sin(reflectedPhase + Math.PI * 0.5);
          val = (re * re + im * im) * 0.5;
        }
      } else if (xNm >= barrierStartNm && xNm <= barrierEndNm) {
        // Region 2: Inside Barrier (Evanescent decay if E < V0)
        const xInside = xNm - barrierStartNm;
        if (energyEV < barrierHeightEV) {
          const decay = Math.exp(-kappa * xInside);
          const reflectedDecay = refAmp * 0.3 * Math.exp(kappa * (xInside - barrierWidthNm));
          if (waveMode === 'wavefunction') {
            val = (decay + reflectedDecay) * Math.cos(-t);
          } else {
            val = Math.pow(decay + reflectedDecay, 2);
          }
        } else {
          // Over barrier oscillating wave
          const k2 = Math.sqrt(Math.max(0.01, energyEV - barrierHeightEV)) * 5.12;
          const phase = k2 * xInside - t;
          val = waveMode === 'wavefunction' ? Math.cos(phase) : 1;
        }
      } else {
        // Region 3: Transmitted wave
        const xRight = xNm - barrierEndNm;
        const transmittedPhase = k1 * xRight - t;
        if (waveMode === 'wavefunction') {
          val = transAmp * Math.cos(transmittedPhase);
        } else {
          val = T; // constant probability density for transmitted plane wave
        }
      }

      // Screen Y coordinate: center around energyLevelY
      const waveAmplitudePx = waveMode === 'wavefunction' ? 45 : 60;
      const yPos = energyLevelY - val * waveAmplitudePx;

      if (px === 0) {
        ctx.moveTo(px, yPos);
      } else {
        ctx.lineTo(px, yPos);
      }
    }

    // Gradient Stroke for Waveform
    const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
    waveGrad.addColorStop(0, '#8b5cf6'); // Violet for incident
    waveGrad.addColorStop(barrierStartX / width, '#ec4899'); // Pink near barrier
    waveGrad.addColorStop(barrierEndX / width, '#06b6d4'); // Cyan for transmitted
    waveGrad.addColorStop(1, '#10b981'); // Emerald
    ctx.strokeStyle = waveGrad;
    ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 6. Region Division Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('Region 1 (Incident/Refl)', 20, height - 15);
    ctx.fillText('Region 2 (Barrier V0)', barrierStartX + 4, height - 15);
    ctx.fillText('Region 3 (Transmitted)', barrierEndX + 20, height - 15);
  };

  return (
    <section className="py-12 bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
              <Waves className="w-3.5 h-3.5" />
              <span>Quantum Transport Simulation</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Schrödinger Wave Mechanics</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              1D Quantum Barrier Tunneling Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Watch real-time wavepacket penetration through an ultra-thin barrier ($E &lt; V_0$). The evanescent decay wave demonstrates why electrons tunnel into the channel in a TFET without thermal barrier climbing.
            </p>
          </div>

          {/* Mode & Pause Controls */}
          <div className="flex items-center gap-3">
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setWaveMode('wavefunction')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  waveMode === 'wavefunction' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wavefunction <MathView latex="\psi(x)" />
              </button>
              <button
                onClick={() => setWaveMode('probability')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  waveMode === 'probability' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Probability <MathView latex="|\psi|^2" />
              </button>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
              title={isPaused ? 'Resume Animation' : 'Pause Animation'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Master Simulation Grid: Interactive Controls + Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Real-time Slider Inputs Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400">
                  Quantum Variables
                </span>
                <Sliders className="w-4 h-4 text-violet-400" />
              </div>

              {/* Electron Energy E */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Electron Energy (<span className="font-mono text-cyan-400">E</span>)</span>
                  <span className="font-mono text-cyan-300 font-bold">{energyEV.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={2.5}
                  step={0.05}
                  value={energyEV}
                  onChange={(e) => setEnergyEV(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.1 eV</span>
                  <span>2.5 eV</span>
                </div>
              </div>

              {/* Barrier Height V0 */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Barrier Height (<span className="font-mono text-rose-400">V_0</span>)</span>
                  <span className="font-mono text-rose-300 font-bold">{barrierHeightEV.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.05}
                  value={barrierHeightEV}
                  onChange={(e) => setBarrierHeightEV(Number(e.target.value))}
                  className="w-full accent-rose-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.5 eV</span>
                  <span>3.0 eV</span>
                </div>
              </div>

              {/* Barrier Thickness L */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Tunneling Distance (<span className="font-mono text-amber-400">L</span>)</span>
                  <span className="font-mono text-amber-300 font-bold">{barrierWidthNm.toFixed(2)} nm</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={3.5}
                  step={0.1}
                  value={barrierWidthNm}
                  onChange={(e) => setBarrierWidthNm(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.4 nm (Ultra-thin)</span>
                  <span>3.5 nm (Opaque)</span>
                </div>
              </div>

              {/* Effective Mass Ratio */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Effective Mass (<span className="font-mono text-emerald-400">m*/m_0</span>)</span>
                  <span className="font-mono text-emerald-300 font-bold">{effectiveMass.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={effectiveMass}
                  onChange={(e) => setEffectiveMass(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Preset Semiconductor Materials */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-2 font-mono">Semiconductor Material Presets:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setEffectiveMass(0.26); setBarrierHeightEV(1.12); setBarrierWidthNm(1.5); setEnergyEV(0.8); }}
                    className="p-2 rounded-xl text-left bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                  >
                    <div>Silicon (Si)</div>
                    <div className="text-[10px] text-slate-400 font-mono">m*=0.26, Eg=1.12eV</div>
                  </button>
                  <button
                    onClick={() => { setEffectiveMass(0.12); setBarrierHeightEV(0.66); setBarrierWidthNm(1.2); setEnergyEV(0.5); }}
                    className="p-2 rounded-xl text-left bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                  >
                    <div>Germanium (Ge)</div>
                    <div className="text-[10px] text-slate-400 font-mono">m*=0.12, Eg=0.66eV</div>
                  </button>
                  <button
                    onClick={() => { setEffectiveMass(0.18); setBarrierHeightEV(0.88); setBarrierWidthNm(1.0); setEnergyEV(0.7); }}
                    className="p-2 rounded-xl text-left bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                  >
                    <div>Si0.65Ge0.35 Hetero</div>
                    <div className="text-[10px] text-slate-400 font-mono">m*=0.18, Eg=0.88eV</div>
                  </button>
                  <button
                    onClick={() => { setEffectiveMass(0.05); setBarrierHeightEV(0.60); setBarrierWidthNm(0.8); setEnergyEV(0.5); }}
                    className="p-2 rounded-xl text-left bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                  >
                    <div>Carbon Nanotube</div>
                    <div className="text-[10px] text-slate-400 font-mono">m*=0.05, Ballistic</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Live Readout Metrics Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Quantum Mechanical Output
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">Transmission (<MathView latex="T" />)</span>
                  <span className="font-mono text-xl font-black text-cyan-300">
                    {result.transmissionPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Probability</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">Reflection (<MathView latex="R" />)</span>
                  <span className="font-mono text-xl font-black text-rose-300">
                    {Math.round(result.reflectionCoeff * 10000) / 100}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Probability</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">Decay Length (<MathView latex="\kappa^{-1}" />)</span>
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {isFinite(result.penetrationDepthNm) ? `${result.penetrationDepthNm.toFixed(3)} nm` : 'Infinite'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-0.5">Decay Param (<MathView latex="\kappa" />)</span>
                  <span className="font-mono text-sm font-bold text-violet-300">
                    {result.decayParamKappa.toFixed(2)} nm⁻¹
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong>Regime:</strong> <span className="text-cyan-400">{result.regime}</span>.
                {energyEV < barrierHeightEV ? (
                  <span> Classic physics predicts <span className="text-rose-400">0%</span> transmission; quantum tunneling yields <strong className="text-emerald-400">{result.transmissionPercent}%</strong> flux.</span>
                ) : (
                  <span> Over-the-barrier quantum interference resonances occur.</span>
                )}
              </div>
            </div>

          </div>

          {/* Interactive Wave Canvas Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative">
              
              {/* Canvas Header Bar */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-mono text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Live Wavepacket Phase Evolution: <code className="text-violet-300">\psi(x, t) = \psi(x) e^{'{ -iEt/\\hbar }'}</code></span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Spatial Domain: 0 to 8 nm</span>
              </div>

              {/* The HTML5 Canvas */}
              <div className="p-3 bg-slate-950">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={420}
                  className="w-full h-auto rounded-xl border border-slate-900 bg-[#070a12]"
                />
              </div>

              {/* Canvas Legend Footer */}
              <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-violet-500" />
                    <span className="text-slate-300">Incident Wave</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-rose-500/40 border border-rose-500" />
                    <span className="text-slate-300">Barrier <MathView latex="V_0" /></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="text-slate-300">Transmitted Wave <MathView latex="T" /></span>
                  </div>
                </div>

                <div className="font-mono text-cyan-300 text-xs">
                  Transmission Probability: <strong>{result.transmissionPercent}%</strong>
                </div>
              </div>

            </div>

            {/* Quantum Theory Equation Box from Slide 12-13 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400">
                Theoretical Piecewise Solution (Slides 12 & 13)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-mono text-cyan-300 mb-1">Region 1 (<MathView latex="x < 0" />):</div>
                  <MathView latex="\psi_1(x) = A e^{ikx} + B e^{-ikx}" />
                  <p className="text-[10px] text-slate-400 mt-1">Superposition of incident & reflected plane waves.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-mono text-rose-300 mb-1">Region 2 (<MathView latex="0 \le x \le L" />):</div>
                  <MathView latex="\psi_2(x) = C e^{\kappa x} + D e^{-\kappa x}" />
                  <p className="text-[10px] text-slate-400 mt-1">Evanescent spatial decay inside classically forbidden barrier.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-mono text-emerald-300 mb-1">Region 3 (<MathView latex="x > L" />):</div>
                  <MathView latex="\psi_3(x) = F e^{ikx}" />
                  <p className="text-[10px] text-slate-400 mt-1">Transmitted quantum wave with probability <MathView latex="T = |F|^2 / |A|^2" />.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
