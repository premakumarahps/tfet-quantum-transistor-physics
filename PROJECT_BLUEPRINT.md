# TFET | Tunneling Field-Effect Transistor & Quantum Solid State Physics Platform

**Academic Course:** Solid State Materials & Devices  
**Research Group:** Group A  
**Live Development Port:** `http://localhost:5178/`  
**Primary Defense Document:** `Tunneling fied effect transisitors working analysis.pdf` (23 Slides)

---

## 1. Executive Summary & Problem Formulation

As silicon CMOS technology scales into the sub-10nm regime towards 1 Trillion transistors per package, classical MOSFETs encounter fundamental thermal and quantum limits:
1. **The Boltzmann Tyranny ($60\,\text{mV/dec}$ Limit)**:
   Because MOSFET current depends on thermionic barrier-climbing, the Fermi-Dirac high-energy tail enforces a minimum subthreshold swing:
   $$SS = \left(\frac{d\log_{10} I_{ds}}{dV_{gs}}\right)^{-1} = \frac{k_B T}{q} \ln(10) \left(1 + \frac{C_{\text{dep}}}{C_{\text{ox}}}\right) \ge 59.6\,\text{mV/decade at } 300\,\text{K}$$
   This creates an unsustainable tradeoff between OFF-state standby leakage current and supply voltage ($V_{DD}$) scaling.
2. **Sub-10nm Direct Source-to-Drain Tunneling**:
   Below $L_g \le 10\,\text{nm}$ ($10\,\text{nm} \to 7\,\text{nm} \to 4\,\text{nm}$), electrons quantum-mechanically tunnel directly through the thin channel barrier in the OFF state, destroying transistor gate control.
3. **Carrier Velocity Saturation**:
   High internal electric fields cause carrier mobility degradation ($\mu \propto 1/\mathcal{E}$), saturating carrier velocity at $v_{\text{sat}} \approx 10^7\,\text{cm/s}$.

---

## 2. The TFET Quantum Solution

The **Tunneling Field-Effect Transistor (TFET)** replaces thermionic emission with **Band-to-Band Tunneling (BTBT)** in a gated reverse-biased $p^+-i-n^+$ junction:
- **OFF State**: Conduction band in the channel is higher than the valence band in the source. With no available states at the same energy, tunneling is quantum-mechanically forbidden, resulting in sub-picoampere leakage ($I_{\text{off}} \sim 10^{-13}\,\text{A}/\mu\text{m}$).
- **ON State**: Positive gate bias ($V_{GS}$) pulls the channel conduction band down below the source valence band, opening an energetic tunneling window:
  $$\Delta \Phi = q(V_{GS} - V_{\text{onset}})$$
- **Energy Filtering**: The forbidden semiconductor bandgap physically blocks the high-energy thermal Fermi tail, enabling steep sub-Boltzmann switching ($SS < 60\,\text{mV/dec}$) and allowing ultra-low supply voltage operation ($V_{DD} = 0.3\,\text{V}$).

---

## 3. Mathematical Formulations & Quantum Physics

### 3.1 1D Time-Independent Schrödinger Equation
$$-\frac{\hbar^2}{2m^*} \frac{d^2\psi(x)}{dx^2} + V(x)\psi(x) = E\psi(x)$$
- **Region 1 ($x < 0$, $E > V$)**: $\psi_1(x) = A e^{ikx} + B e^{-ikx}$, $k = \frac{\sqrt{2m^* E}}{\hbar}$
- **Region 2 ($0 \le x \le L$, $E < V_0$)**: $\psi_2(x) = C e^{\kappa x} + D e^{-\kappa x}$, $\kappa = \frac{\sqrt{2m^*(V_0 - E)}}{\hbar}$
- **Region 3 ($x > L$, $E > V$)**: $\psi_3(x) = F e^{ikx}$
- **Transmission Coefficient**:
  $$T = \frac{1}{1 + \frac{V_0^2 \sinh^2(\kappa L)}{4E(V_0 - E)}}$$

### 3.2 WKB Approximation for Band-to-Band Tunneling
$$T_{\text{WKB}} \approx \exp\left[-2 \left(\int_a^{x_0} \kappa_{vx} \, dx + \int_{x_0}^b \kappa_{cx} \, dx\right)\right] \approx \exp\left(-\frac{4 \sqrt{2 m^*} E_g^{3/2}}{3 q \hbar \mathcal{E}}\right)$$

---

## 4. Master Device Benchmarking Matrix (Slide 23)

| Device | Principle | $I_{\text{on}}$ ($\text{A}/\mu\text{m}$) | $I_{\text{off}}$ ($\text{A}/\mu\text{m}$) | $SS_{0.3\text{V}}$ ($\text{mV/dec}$) | $SS_{1.2\text{V}}$ ($\text{mV/dec}$) | $g_m$ ($\text{S}$) | PDP ($\text{J}/\mu\text{m}$) | Delay ($\text{s}$) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **MOSFET** | Thermionic | $1.287 \times 10^{-3}$ | $3.363 \times 10^{-7}$ | 175.57 | 230.00 | $4.907 \times 10^{-4}$ | $3.922 \times 10^{-16}$ | $2.539 \times 10^{-13}$ |
| **Si TFET** | Homojunction BTBT | $4.681 \times 10^{-5}$ | $\mathbf{2.559 \times 10^{-13}}$ | $\mathbf{50.41}$ | 214.00 | $7.970 \times 10^{-7}$ | $\mathbf{3.183 \times 10^{-17}}$ | $5.666 \times 10^{-13}$ |
| **Ge TFET** | Narrow Gap | $9.737 \times 10^{-5}$ | $4.522 \times 10^{-11}$ | 71.76 | 329.00 | $2.752 \times 10^{-6}$ | $9.449 \times 10^{-16}$ | $8.087 \times 10^{-11}$ |
| **$\text{Si}_{0.65}\text{Ge}_{0.35}$ TFET** | Type-II Hetero | $6.997 \times 10^{-5}$ | $1.484 \times 10^{-12}$ | $\mathbf{57.56}$ | 227.00 | $2.574 \times 10^{-6}$ | $1.036 \times 10^{-15}$ | $1.233 \times 10^{-11}$ |
| **CNTFET** | 1D Ballistic | $1.150 \times 10^{-3}$ | $5.000 \times 10^{-14}$ | $\mathbf{35.20}$ | $\mathbf{48.00}$ | $1.250 \times 10^{-4}$ | $\mathbf{8.500 \times 10^{-18}}$ | $1.100 \times 10^{-13}$ |

---

## 5. Web Platform Architecture

- **Path**: `d:\1.Antigravity Projects\8_TFET_Quantum_Transistor_Solid_State\web`
- **Framework**: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Chart.js + KaTeX
- **Modules**:
  1. `QuantumTunnelingSimulator.tsx`: Live phase evolution of 1D wavepacket through barrier ($E, V_0, L, m^*$).
  2. `BandgapSimulator.tsx`: Dynamic energy band bending ($E_C, E_V, E_F$) under $V_{GS}$ and $V_{DS}$ showing the opening of the tunneling window $\Delta \Phi$.
  3. `SubthresholdBenchmark.tsx`: Logarithmic $I_{DS}-V_{GS}$ transfer curve comparison with temperature slider ($100\,\text{K}-400\,\text{K}$) and Slide 23 benchmark data table.
  4. `TheorySection.tsx`: In-depth breakdown of MOSFET crisis, Schrödinger mechanics, BTBT filtering, and Heterojunction/CNT solutions.
  5. `SlideDeckViewer.tsx`: 23-slide defense presentation deck reader with category filters and full-screen lightbox.
  6. `Navbar.tsx` & `Footer.tsx`: Portfolio-matched aesthetic with Google-grade easing and luxury spectrum cards.
