import React, { useState } from 'react';
import { 
  BarChart3, 
  Thermometer, 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  Sliders, 
  Info,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import { MathView } from './MathView';
import { MATERIAL_PROFILES, calculateSubthresholdSwing } from '../core/tfetPhysics';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const SubthresholdBenchmark: React.FC = () => {
  const [temperatureK, setTemperatureK] = useState<number>(300); // Room Temp (300K)
  const [selectedMaterialIdx, setSelectedMaterialIdx] = useState<number>(1); // Default: Si TFET

  const ssCalc = calculateSubthresholdSwing(temperatureK);
  const activeProfile = MATERIAL_PROFILES[selectedMaterialIdx];

  // Generate Vgs values from 0.0V to 1.0V in 0.05V steps
  const vgsSteps: number[] = [];
  for (let v = 0; v <= 1.0; v += 0.05) {
    vgsSteps.push(Math.round(v * 100) / 100);
  }

  // Calculate synthetic Id (A/um) transfer characteristics
  // MOSFET thermionic model:
  // I_off ~ 3.36e-7 A/um
  // Slope = 1 / (ssCalc.mosfetSS / 1000)
  const mosfetData = vgsSteps.map((v) => {
    const logVal = Math.log10(3.36e-7) + v / (ssCalc.mosfetSS / 1000);
    const iCurrent = Math.pow(10, Math.min(-2.8, logVal));
    return iCurrent;
  });

  // TFET BTBT model:
  // I_off ~ 2.5e-13 A/um
  // Steep sub-Boltzmann slope below V_onset, saturating at material Ion
  const tfetData = vgsSteps.map((v) => {
    if (v < 0.2) {
      return 2.5e-13; // subthreshold leakage floor
    }
    const effV = v - 0.2;
    const logVal = Math.log10(2.5e-13) + effV / (ssCalc.tfetSS / 1000);
    const maxIon = activeProfile.ionAmpPerUm;
    const iCurrent = Math.min(maxIon, Math.pow(10, logVal));
    return Math.max(2.5e-13, iCurrent);
  });

  const chartData = {
    labels: vgsSteps.map((v) => `${v.toFixed(2)}V`),
    datasets: [
      {
        label: `TFET (${activeProfile.name}) - SS: ${ssCalc.tfetSS} mV/dec`,
        data: tfetData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
        fill: true,
      },
      {
        label: `Classical MOSFET - SS: ${ssCalc.mosfetSS} mV/dec`,
        data: mosfetData,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        borderWidth: 2.5,
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
          font: { size: 11, family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#38bdf8',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            return `${context.dataset.label}: ${val.toExponential(3)} A/μm`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Gate Voltage Vgs (V)', color: '#94a3b8', font: { size: 11 } },
        ticks: { color: '#64748b', font: { size: 10 } },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      },
      y: {
        type: 'logarithmic' as const,
        min: 1e-13,
        max: 1e-2,
        title: { display: true, text: 'Drain Current Ids (A/μm) [Log Scale]', color: '#94a3b8', font: { size: 11 } },
        ticks: {
          color: '#94a3b8',
          font: { size: 10, family: 'JetBrains Mono' },
          callback: (value: any) => {
            const exp = Math.log10(value);
            if (Number.isInteger(exp)) return `10^${exp}`;
            return null;
          }
        },
        grid: { color: 'rgba(51, 65, 85, 0.25)' }
      }
    }
  };

  return (
    <section className="py-12 bg-slate-950/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Quantitative Benchmark Analysis</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Slide 7, 21 & 23</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Subthreshold Swing & Device Benchmarks
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect the steep sub-Boltzmann transfer slope (<MathView latex="SS < 60\text{ mV/dec}" />) and discover how TFET suppresses OFF-state leakage current by over <strong>6 orders of magnitude</strong>.
            </p>
          </div>

          {/* Temperature Tuning Slider */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 self-start md:self-auto">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>Chamber Temp:</span>
              <span className="font-mono text-cyan-300 font-bold">{temperatureK} K ({temperatureK - 273}°C)</span>
            </div>
            <input
              type="range"
              min={100}
              max={400}
              step={10}
              value={temperatureK}
              onChange={(e) => setTemperatureK(Number(e.target.value))}
              className="w-28 sm:w-36 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Top 3 Stat Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-violet-500/40 shadow-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">TFET Subthreshold Swing</div>
              <div className="text-2xl font-black text-cyan-400">
                {ssCalc.tfetSS} <span className="text-xs font-normal text-slate-400">mV/dec</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">Sub-Boltzmann Limit Achieved!</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">MOSFET Boltzmann Limit</div>
              <div className="text-2xl font-black text-rose-400">
                {ssCalc.mosfetSS} <span className="text-xs font-normal text-slate-400">mV/dec</span>
              </div>
              <div className="text-[10px] text-slate-400">Bounded by <MathView latex="k_B T \ln(10)/q" /></div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Leakage Reduction</div>
              <div className="text-2xl font-black text-emerald-400">
                &gt;10⁶× <span className="text-xs font-normal text-slate-400">Lower I_off</span>
              </div>
              <div className="text-[10px] text-slate-400">Near-zero standby battery drain</div>
            </div>
          </div>

        </div>

        {/* Master Chart Layout */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Ids – Vgs Transfer Characteristics (Logarithmic Scale)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Notice the dramatically steeper slope of the TFET curve below threshold, switching from <MathView latex="10^{-13}\text{ A}" /> to <MathView latex="10^{-5}\text{ A}" /> within just 0.3V.
              </p>
            </div>
            
            {/* Material Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              {MATERIAL_PROFILES.map((mat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMaterialIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedMaterialIdx === idx
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {mat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-300">
              <strong className="text-cyan-300">Active Profile: {activeProfile.name}</strong> • {activeProfile.highlight}
            </div>
            <div className="font-mono text-slate-400 text-[11px]">
              Ion/Ioff Ratio: <span className="text-emerald-400 font-bold">{(activeProfile.ionAmpPerUm / activeProfile.ioffAmpPerUm).toExponential(2)}</span>
            </div>
          </div>
        </div>

        {/* Slide 23 Master Benchmark Table */}
        <div className="rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">
                Comprehensive Device Benchmark Matrix (Slide 23)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact experimental and numerical figures of merit compiled in Group A presentation.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 self-start sm:self-auto">
              5 Technologies Compared
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] bg-slate-950/60">
                  <th className="py-3 px-4">Technology</th>
                  <th className="py-3 px-4">Operating Principle</th>
                  <th className="py-3 px-4 text-emerald-300">Ion (A/μm) ↑</th>
                  <th className="py-3 px-4 text-cyan-300">Ioff (A/μm) ↓</th>
                  <th className="py-3 px-4 text-violet-300">SS @ 0.3V (mV/dec) ↓</th>
                  <th className="py-3 px-4 text-slate-300">Transconductance gm</th>
                  <th className="py-3 px-4 text-amber-300">PDP (J/μm) ↓</th>
                  <th className="py-3 px-4 text-slate-300">Delay (s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {MATERIAL_PROFILES.map((p, idx) => (
                  <tr 
                    key={idx} 
                    className={`transition-colors ${
                      selectedMaterialIdx === idx ? 'bg-cyan-500/10' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {p.type}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {p.ionAmpPerUm.toExponential(4)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {p.ioffAmpPerUm.toExponential(4)}
                    </td>
                    <td className={`py-3.5 px-4 font-mono font-bold whitespace-nowrap ${
                      p.subthresholdSwing03V < 60 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {p.subthresholdSwing03V.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {p.transconductanceGmS.toExponential(2)} S
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {p.powerDelayProductJ.toExponential(3)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {p.timeDelayS.toExponential(3)} s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
