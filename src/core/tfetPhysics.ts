/**
 * Solid State Physics & Quantum Mechanics Engine for Tunneling Field-Effect Transistors (TFET)
 * Developed for Group A • Solid State Materials
 */

export interface Tunneling1DParams {
  electronEnergyEV: number; // E (e.g. 0.8 eV)
  barrierHeightEV: number; // V_0 (e.g. 1.2 eV)
  barrierWidthNm: number; // L (e.g. 1.5 nm)
  effectiveMassRatio: number; // m* / m_0 (e.g. 0.26 for Si)
}

export interface Tunneling1DResult {
  transmissionCoeff: number; // T in [0, 1]
  reflectionCoeff: number; // R in [0, 1]
  k1Wavevector: number; // nm^-1 in Region 1 & 3
  decayParamKappa: number; // nm^-1 in Region 2 (for E < V_0)
  regime: 'Quantum Tunneling (E < V0)' | 'Over-the-Barrier (E >= V0)';
  penetrationDepthNm: number; // 1 / kappa
  transmissionPercent: number;
}

// Physical Constants
export const HBAR = 1.054571817e-34; // J s
export const Q_ELEC = 1.602176634e-19; // C
export const M_0 = 9.1093837e-31; // kg
export const K_B = 1.380649e-23; // J / K

/**
 * 1D Quantum Potential Barrier Transmission Calculation
 * Solves 1D Time-Independent Schrödinger Equation
 */
export function calculate1DTunneling(params: Tunneling1DParams): Tunneling1DResult {
  const { electronEnergyEV, barrierHeightEV, barrierWidthNm, effectiveMassRatio } = params;

  const mStar = effectiveMassRatio * M_0;
  const L = barrierWidthNm * 1e-9; // convert nm to m
  const E = electronEnergyEV * Q_ELEC;
  const V0 = barrierHeightEV * Q_ELEC;

  let T = 0;
  let k1 = 0;
  let kappa = 0;
  let regime: Tunneling1DResult['regime'] = 'Quantum Tunneling (E < V0)';

  if (electronEnergyEV < barrierHeightEV) {
    regime = 'Quantum Tunneling (E < V0)';
    k1 = Math.sqrt(2 * mStar * E) / HBAR;
    kappa = Math.sqrt(2 * mStar * (V0 - E)) / HBAR;

    const sinhArg = kappa * L;
    // Standard exact analytic quantum transmission for rectangular barrier:
    // T = 1 / [1 + (V0^2 * sinh^2(kappa*L)) / (4 * E * (V0 - E))]
    const denomFactor = (V0 * V0 * Math.pow(Math.sinh(sinhArg), 2)) / (4 * E * (V0 - E));
    T = 1 / (1 + denomFactor);
  } else {
    regime = 'Over-the-Barrier (E >= V0)';
    k1 = Math.sqrt(2 * mStar * E) / HBAR;
    const k2 = Math.sqrt(2 * mStar * (E - V0)) / HBAR;
    const sinArg = k2 * L;
    const denomFactor = (V0 * V0 * Math.pow(Math.sin(sinArg), 2)) / (4 * E * (E - V0));
    T = 1 / (1 + denomFactor);
  }

  // Ensure bounds
  T = Math.max(0, Math.min(1, T));
  const R = 1 - T;

  return {
    transmissionCoeff: T,
    reflectionCoeff: R,
    k1Wavevector: k1 * 1e-9, // convert m^-1 to nm^-1
    decayParamKappa: kappa * 1e-9, // convert m^-1 to nm^-1
    regime,
    penetrationDepthNm: kappa > 0 ? (1 / kappa) * 1e9 : Infinity,
    transmissionPercent: Math.round(T * 10000) / 100
  };
}

/**
 * Subthreshold Swing (SS) calculation
 * Compares classical thermionic MOSFET vs Band-to-Band Tunneling (TFET)
 */
export function calculateSubthresholdSwing(temperatureK: number, gateCapacitanceRatio: number = 1.1) {
  // Boltzmann thermal limit: (k_B * T / q) * ln(10) * (1 + C_dep / C_ox)
  const boltzmannLimitRoomTemp = 59.6; // mV/dec at 300K for ideal factor 1.0
  const boltzmannLimitT = (K_B * temperatureK / Q_ELEC) * Math.log(10) * 1000 * gateCapacitanceRatio; // in mV/dec

  return {
    temperatureK,
    mosfetSS: Math.round(boltzmannLimitT * 100) / 100, // typically 65 - 85 mV/dec
    tfetSS: Math.round((boltzmannLimitT * 0.45) * 100) / 100, // typically 30 - 55 mV/dec (sub-60!)
    isSubBoltzmann: true
  };
}

/**
 * TFET Band-to-Band Tunneling (BTBT) WKB Approximation
 * Calculates Kane / WKB transmission through energy gap
 */
export function calculateWkbBtbtTransmission(
  bandgapEV: number,
  electricFieldMvPerCm: number,
  effectiveMassRatio: number = 0.2
) {
  const mStar = effectiveMassRatio * M_0;
  const EgJ = bandgapEV * Q_ELEC;
  const fieldVm = electricFieldMvPerCm * 1e8; // MV/cm to V/m

  // WKB exponent: -4 * sqrt(2*m*) * Eg^(3/2) / (3 * q * hbar * Field)
  const numerator = 4 * Math.sqrt(2 * mStar) * Math.pow(EgJ, 1.5);
  const denominator = 3 * Q_ELEC * HBAR * fieldVm;
  const exponent = -numerator / denominator;

  const transmission = Math.exp(Math.max(-50, exponent));
  return {
    bandgapEV,
    electricFieldMvPerCm,
    exponent: Math.round(exponent * 100) / 100,
    transmission: Math.max(1e-15, Math.min(1, transmission))
  };
}

/**
 * Semiconductor Material Profiles from Slide 23
 */
export interface MaterialProfile {
  name: string;
  type: string;
  bandgapEV: number;
  effectiveMassRatio: number;
  ionAmpPerUm: number; // A/um
  ioffAmpPerUm: number; // A/um
  subthresholdSwing03V: number; // mV/dec at Vdd = 0.3V
  subthresholdSwing12V: number; // mV/dec at Vdd = 1.2V
  transconductanceGmS: number; // S
  powerDelayProductJ: number; // J/um
  timeDelayS: number; // seconds
  highlight: string;
}

export const MATERIAL_PROFILES: MaterialProfile[] = [
  {
    name: 'Standard Planar MOSFET',
    type: 'Thermionic Barrier-Climbing',
    bandgapEV: 1.12,
    effectiveMassRatio: 0.26,
    ionAmpPerUm: 1.287e-3,
    ioffAmpPerUm: 3.363e-7,
    subthresholdSwing03V: 175.57,
    subthresholdSwing12V: 230.00,
    transconductanceGmS: 4.907e-4,
    powerDelayProductJ: 3.922e-16,
    timeDelayS: 2.538e-13,
    highlight: 'Suffers severe subthreshold leakage (336 nA/um) and degraded swing (>175 mV/dec) at low 0.3V VDD.'
  },
  {
    name: 'Silicon (Si) TFET',
    type: 'Homojunction Band-to-Band Tunneling',
    bandgapEV: 1.12,
    effectiveMassRatio: 0.26,
    ionAmpPerUm: 4.681e-5,
    ioffAmpPerUm: 2.558e-13,
    subthresholdSwing03V: 50.41,
    subthresholdSwing12V: 214.00,
    transconductanceGmS: 7.970e-7,
    powerDelayProductJ: 3.183e-17,
    timeDelayS: 5.666e-13,
    highlight: 'Achieves steep sub-Boltzmann swing of 50.41 mV/dec and 12x lower Power-Delay Product (3.18e-17 J/um).'
  },
  {
    name: 'Germanium (Ge) TFET',
    type: 'Low-Bandgap Homojunction',
    bandgapEV: 0.66,
    effectiveMassRatio: 0.12,
    ionAmpPerUm: 9.737e-5,
    ioffAmpPerUm: 4.522e-11,
    subthresholdSwing03V: 71.76,
    subthresholdSwing12V: 329.00,
    transconductanceGmS: 2.752e-6,
    powerDelayProductJ: 9.449e-16,
    timeDelayS: 8.086e-11,
    highlight: 'Higher ON-current due to lower bandgap (0.66 eV), but suffers slightly elevated ambipolar leakage.'
  },
  {
    name: 'Si0.65Ge0.35 Heterojunction TFET',
    type: 'Type-II Staggered Heterojunction',
    bandgapEV: 0.88,
    effectiveMassRatio: 0.18,
    ionAmpPerUm: 6.997e-5,
    ioffAmpPerUm: 1.483e-12,
    subthresholdSwing03V: 57.56,
    subthresholdSwing12V: 227.00,
    transconductanceGmS: 2.574e-6,
    powerDelayProductJ: 1.036e-15,
    timeDelayS: 1.233e-11,
    highlight: 'Engineered band offsets dramatically boost ON-current while maintaining steep 57.56 mV/dec sub-60 swing.'
  },
  {
    name: 'Carbon Nanotube (CNT) TFET',
    type: '1D Ballistic Cylindrical Gate',
    bandgapEV: 0.60,
    effectiveMassRatio: 0.05,
    ionAmpPerUm: 1.150e-3,
    ioffAmpPerUm: 5.000e-14,
    subthresholdSwing03V: 35.20,
    subthresholdSwing12V: 48.00,
    transconductanceGmS: 1.250e-4,
    powerDelayProductJ: 8.500e-18,
    timeDelayS: 1.100e-13,
    highlight: 'Ultra-thin 1D body provides superior electrostatic control, sub-40 mV/dec swing, and high ballistic current.'
  }
];
