/**
 * TFET Solid State Materials & Quantum Device Data Model
 * Grounded in Group A Academic Presentation & Solid State Physics Literature
 */

export interface SlideData {
  slideNumber: number;
  title: string;
  category: 'Fundamentals' | 'MOSFET Physics' | 'Tunneling Theory' | 'TFET Engineering' | 'Data & Benchmarks';
  summary: string;
  image: string;
  keyConcepts: string[];
}

export const SLIDES_DATA: SlideData[] = [
  {
    slideNumber: 1,
    title: 'Solid State Materials: Tunneling Field Effect Transistors (TFET)',
    category: 'Fundamentals',
    summary: 'Title presentation slide for Group A covering the physics, principles, and solid state engineering of TFETs.',
    image: '/slides/slide_01.png',
    keyConcepts: ['Solid State Materials', 'TFET', 'Group A', 'Quantum Electronics']
  },
  {
    slideNumber: 2,
    title: 'How Transistors Power the Modern World',
    category: 'Fundamentals',
    summary: 'The role of transistors as the fundamental building block of computation, enabling miniaturization, switching, and signal amplification.',
    image: '/slides/slide_02.png',
    keyConcepts: ['Fundamental Building Block', 'Miniaturization', 'Switching & Amplification']
  },
  {
    slideNumber: 3,
    title: 'MOSFET Architecture & Merits',
    category: 'MOSFET Physics',
    summary: 'Overview of planar MOSFET: 3D cross-section showing Source, Gate, Drain, Gate Oxide, and Bulk. Key traits: high thermal stability and zero static input current.',
    image: '/slides/slide_03.png',
    keyConcepts: ['Planar MOSFET', 'Gate Oxide', 'Source/Drain', 'High Thermal Stability']
  },
  {
    slideNumber: 4,
    title: 'Activation Process of MOSFET',
    category: 'MOSFET Physics',
    summary: '3D simulation of channel inversion. Applying gate voltage pulls electrons to form an n-channel between source and drain.',
    image: '/slides/slide_04.png',
    keyConcepts: ['Channel Inversion', 'Inversion Layer', 'Electric Field Formation']
  },
  {
    slideNumber: 5,
    title: 'Bandgap Diagram of MOSFET (Low Gate Voltage)',
    category: 'MOSFET Physics',
    summary: 'Conduction band (Ec) and Fermi energy (Ef) profile in the OFF state. A wide energy barrier prevents electron transit.',
    image: '/slides/slide_05.png',
    keyConcepts: ['Energy Barrier', 'Ec Conduction Band', 'Ef Fermi Level', 'OFF State']
  },
  {
    slideNumber: 6,
    title: 'Bandgap Diagram of MOSFET (ON-State & Thermionic Emission)',
    category: 'MOSFET Physics',
    summary: 'Comparison of low gate voltage vs high gate voltage & high drain voltage. Thermally energetic electrons climb over the lowered potential barrier.',
    image: '/slides/slide_06.png',
    keyConcepts: ['Thermionic Emission', 'Barrier Lowering', 'High Drain Bias', 'ON-State']
  },
  {
    slideNumber: 7,
    title: 'Limitations of MOSFET: The 60 mV/dec Boltzmann Limit',
    category: 'MOSFET Physics',
    summary: 'Mathematical formulation of the subthreshold swing limit: d(log Ids)/dVgs = 1/S. Room temperature thermal spread sets S >= 60 mV/dec, causing high leakage.',
    image: '/slides/slide_07.png',
    keyConcepts: ['Boltzmann Tyranny', 'Subthreshold Swing', '60 mV/dec Limit', 'Leakage Current']
  },
  {
    slideNumber: 8,
    title: 'Why Can’t We Reduce the Size of MOSFETs? (Direct Tunneling)',
    category: 'MOSFET Physics',
    summary: 'Spectral current distributions for gate lengths Lg = 13 nm, 10 nm, 7 nm, and 4 nm. Below 10 nm, direct source-to-drain tunneling causes catastrophic leakage.',
    image: '/slides/slide_08.png',
    keyConcepts: ['Sub-10nm Scaling Limits', 'Direct S/D Tunneling', 'Quantum Confinement', 'Leakage Explosion']
  },
  {
    slideNumber: 9,
    title: 'Moore’s Law & Scaling Trajectory to 1 Trillion Transistors',
    category: 'Fundamentals',
    summary: 'Historical and projected transistor density scaling through 2030 (RibbonFET, PowerVia, High-NA EUV, and 2.5D/3D packaging).',
    image: '/slides/slide_09.png',
    keyConcepts: ['Moore\'s Law', '1 Trillion Transistors', 'RibbonFET', 'PowerVia']
  },
  {
    slideNumber: 10,
    title: 'Tunneling Field Effect Transistor (TFET) Architecture',
    category: 'TFET Engineering',
    summary: 'Introduction of the gated p-i-n junction (p+ source, intrinsic channel, n+ drain) and band bending in OFF vs ON states.',
    image: '/slides/slide_10.png',
    keyConcepts: ['p-i-n Junction', 'Gated Channel', 'Band-to-Band Tunneling', 'TFET Structure']
  },
  {
    slideNumber: 11,
    title: 'TFET Mechanism: Thermionic Emission vs Quantum Tunneling',
    category: 'TFET Engineering',
    summary: 'Direct contrast: MOSFET thermal barrier emission vs TFET quantum mechanical band-to-band tunneling (BTBT).',
    image: '/slides/slide_11.png',
    keyConcepts: ['BTBT', 'Thermal Emission vs BTBT', 'Cold Carrier Injection', 'Reverse-biased p-i-n']
  },
  {
    slideNumber: 12,
    title: '1D Quantum Tunneling & Schrödinger Equation',
    category: 'Tunneling Theory',
    summary: 'Formulation of the 1D finite rectangular potential barrier: Region 1 (E > V), Region 2 (E < V), Region 3 (E > V) with Time-Independent Schrödinger equation.',
    image: '/slides/slide_12.png',
    keyConcepts: ['Schrödinger Equation', '1D Barrier', 'Classically Forbidden Region', 'Wavefunction']
  },
  {
    slideNumber: 13,
    title: '1D Tunneling Wavefunction Solutions & Transmission Probability',
    category: 'Tunneling Theory',
    summary: 'Piecewise wavefunction solutions: psi1(x), evanescent decay psi2(x) = C exp(kappa*x) + D exp(-kappa*x), and transmitted wave psi3(x). Transmission T = |psi3|^2.',
    image: '/slides/slide_13.png',
    keyConcepts: ['Evanescent Decay', 'Wavevector k', 'Decay Parameter kappa', 'Transmission Coefficient T']
  },
  {
    slideNumber: 14,
    title: '1D Quantum Wavepacket Simulation',
    category: 'Tunneling Theory',
    summary: 'Time-dependent wavepacket evolution across a thin barrier (t = 9.00), showing reflected probability density and transmitted evanescent wave emergence.',
    image: '/slides/slide_14.png',
    keyConcepts: ['Wavepacket Propagation', 'Probability Density |psi|^2', 'Evanescent Tail']
  },
  {
    slideNumber: 15,
    title: 'WKB Approximation for Band-to-Band Tunneling',
    category: 'Tunneling Theory',
    summary: 'Wentzel–Kramers–Brillouin (WKB) approximation integral across the forbidden bandgap and E-k dispersion plot for k_perp = 0.',
    image: '/slides/slide_15.png',
    keyConcepts: ['WKB Approximation', 'Transmission Integral', 'E-k Dispersion', 'Bandgap Tunneling Width']
  },
  {
    slideNumber: 16,
    title: 'Advantages of TFET: The Steep-Slope Advantage',
    category: 'TFET Engineering',
    summary: 'Flowchart: Low Subthreshold Swing (<60 mV/dec) -> Low Leakage Current (Ioff) -> Ultra-low Power Consumption (Vdd < 0.5V).',
    image: '/slides/slide_16.png',
    keyConcepts: ['Sub-60 mV/dec Swing', 'Low Off-State Leakage', 'Ultra-Low Voltage Scaling', 'Energy Efficiency']
  },
  {
    slideNumber: 17,
    title: 'Challenges of TFET (Low ON-Current & Fabrication)',
    category: 'TFET Engineering',
    summary: 'Key engineering hurdles: ON current (Ion) insufficient for high-speed ITRS targets due to silicon bandgap, plus sharp junction doping complexity.',
    image: '/slides/slide_17.png',
    keyConcepts: ['Ion Bottleneck', 'ITRS Targets', 'Abrupt Junction Doping', 'Defect Trapping']
  },
  {
    slideNumber: 18,
    title: 'Future Developments: Carbon Nanotubes & Heterojunctions',
    category: 'TFET Engineering',
    summary: 'Heterojunction TFETs (staggered/broken gap band alignment) and Carbon Nanotube TFETs (CNTFET) providing high ballistic current and low subthreshold swing.',
    image: '/slides/slide_18.png',
    keyConcepts: ['Heterojunction TFET', 'CNTFET', 'Type-II Band Alignment', 'Ambipolar Suppression']
  },
  {
    slideNumber: 19,
    title: 'Presentation Conclusion & Group A Acknowledgment',
    category: 'Fundamentals',
    summary: 'Concluding slide of Group A presentation on Solid State Materials.',
    image: '/slides/slide_19.png',
    keyConcepts: ['Group A', 'Solid State Physics', 'Future Transistors']
  },
  {
    slideNumber: 20,
    title: 'Appendix Transition Slide',
    category: 'Fundamentals',
    summary: 'Transition to detailed analytical derivations and quantitative benchmarks.',
    image: '/slides/slide_20.png',
    keyConcepts: ['Analytical Physics', 'Mathematical Derivations']
  },
  {
    slideNumber: 21,
    title: 'Mathematical Derivation of the 60 mV/dec Boltzmann Tyranny',
    category: 'MOSFET Physics',
    summary: 'Subthreshold current equation Ids = 0.1(W/L) exp(-qVt/eta*kT) exp(qVgs/eta*kT) demonstrating 10x current change per 60 mV at room temperature.',
    image: '/slides/slide_21.png',
    keyConcepts: ['Ids Analytical Formula', 'exp(qVgs/kT) Factor', '10x Decade Step', 'Thermal Voltage Vt=26mV']
  },
  {
    slideNumber: 22,
    title: 'Carrier Velocity Saturation in Nanoscale Channels',
    category: 'MOSFET Physics',
    summary: 'Electric field dependence of carrier mobility: mu proportional to 1/E, resulting in velocity saturation v = mu*E -> v_sat.',
    image: '/slides/slide_22.png',
    keyConcepts: ['Mobility Degradation', 'Velocity Saturation', 'High Field Transport']
  },
  {
    slideNumber: 23,
    title: 'Comprehensive Device Benchmark: MOSFET vs Si vs Ge vs SiGe TFET',
    category: 'Data & Benchmarks',
    summary: 'Master quantitative benchmark table comparing Ion, Ioff, Subthreshold Swing at Vdd=0.3V and 1.2V, Transconductance (gm), Power-Delay Product (PDP), and Delay.',
    image: '/slides/slide_23.png',
    keyConcepts: ['Device Benchmarks', 'Ion/Ioff Ratio', 'Subthreshold Swing Table', 'PDP Comparison', 'Switching Delay']
  }
];

export interface CoreEquationItem {
  id: string;
  name: string;
  domain: string;
  latex: string;
  description: string;
  significance: string;
}

export const CORE_EQUATIONS: CoreEquationItem[] = [
  {
    id: 'schrodinger_1d',
    name: '1D Time-Independent Schrödinger Equation',
    domain: 'Quantum Mechanics',
    latex: '-\\frac{\\hbar^2}{2m^*} \\frac{d^2\\psi(x)}{dx^2} + V(x)\\psi(x) = E\\psi(x)',
    description: 'Governs the spatial distribution of the electron wavefunction psi(x) across semiconductor potential barriers.',
    significance: 'Reveals that quantum probability does not vanish inside a barrier (E < V0), producing evanescent decay and finite transmission.'
  },
  {
    id: 'wkb_transmission',
    name: 'WKB Approximation for Band-to-Band Tunneling',
    domain: 'Quantum Tunneling',
    latex: 'T_{\\text{WKB}} \\approx \\exp\\left[-2 \\left(\\int_a^{x_0} \\kappa_{vx}\\,dx + \\int_{x_0}^b \\kappa_{cx}\\,dx\\right)\\right] \\approx \\exp\\left(-\\frac{4\\sqrt{2m^*}E_g^{3/2}}{3q\\hbar \\mathcal{E}}\\right)',
    description: 'Estimates electron tunneling probability through the triangular forbidden bandgap barrier in a reverse-biased p-i-n junction.',
    significance: 'Shows that tunneling probability increases exponentially with narrower bandgaps (Eg) and higher junction electric fields (E).'
  },
  {
    id: 'boltzmann_subthreshold',
    name: 'Subthreshold Swing (Boltzmann Tyranny)',
    domain: 'MOSFET Limitation',
    latex: 'SS = \\left(\\frac{d\\log_{10} I_{ds}}{dV_{gs}}\\right)^{-1} = \\ln(10) \\cdot \\frac{k_B T}{q} \\left(1 + \\frac{C_{\\text{dep}}}{C_{\\text{ox}}}\\right) \\ge 59.6 \\text{ mV/dec at } 300\\text{ K}',
    description: 'Quantifies the gate voltage required to increase drain current by one order of magnitude (one decade) in the subthreshold regime.',
    significance: 'Fundamental thermionic barrier limit preventing classical MOSFETs from scaling supply voltage VDD below ~0.7V without explosive leakage.'
  },
  {
    id: 'tfet_current',
    name: 'TFET Band-to-Band Tunneling Current',
    domain: 'TFET Device Physics',
    latex: 'I_{\\text{TFET}} = a \\cdot A \\cdot T_{\\text{WKB}} \\cdot \\Delta\\Phi = a \\cdot A \\cdot T_{\\text{WKB}} \\cdot q(V_{GS} - V_{\\text{onset}})',
    description: 'Current generated when positive gate voltage pulls the channel conduction band below the source valence band, opening the energy window Delta Phi.',
    significance: 'Because only cold electrons within Delta Phi tunnel, thermal high-energy tails are filtered out, breaking the 60 mV/dec limit.'
  },
  {
    id: 'velocity_saturation',
    name: 'Carrier Velocity Saturation in Nanoscale Channels',
    domain: 'Transport Physics',
    latex: 'v(E) = \\frac{\\mu_0 \\mathcal{E}}{\\left[1 + \\left(\\frac{\\mu_0 \\mathcal{E}}{v_{\\text{sat}}}\\right)^\\beta\\right]^{1/\\beta}} \\xrightarrow{\\mathcal{E} \\gg \\mathcal{E}_c} v_{\\text{sat}} \\approx 10^7 \\text{ cm/s}',
    description: 'At high longitudinal electric fields in scaled MOSFETs, optical phonon scattering caps carrier speed at ~10^7 cm/s.',
    significance: 'Prevents drive current from increasing linearly with channel reduction, accelerating the need for steep-slope alternative devices.'
  }
];
