# TORQYX (aiengineerslab) — Comprehensive System Overview & AI Engineering Blueprint

> **Purpose of this document:**  
> This file is the single source of truth (SSOT) designed for **Claude Code** (and agentic AI development workflows). It contains the complete architectural map, tools inventory, content catalog, database models, technical debt analysis, and a structured implementation specification for the **Top 3 Killer Features** and **Product Quality Upgrades**.

---

## 1. Executive Summary & Brand Identity

* **Brand Name:** TORQYX (Domain: `torqyx.com`, Workspace: `aiengineerslab`)
* **Mission:** The modern, standards-compliant mechanical engineering calculation and design platform. Replacing fragile Excel sheets and scattered handbook formulas with traceable, verified, responsive, and ISO/DIN/ASME-compliant digital tools.
* **Target Audience:** Mechanical engineers, design engineers, manufacturing specialists, plant maintenance teams, engineering students, and R&D consultancies.
* **Languages:** Fully bilingual — Turkish (`tr`) and English (`en`), with cookie/prefix routing, localized canonicals, and language alternates.
* **Core Philosophy:** High technical depth, zero AI fluff, traceable mathematical formulas (E-E-A-T compliant), and fast interactive computing.

---

## 2. Technology Stack & Dependencies

| Layer | Technology | Version / Details |
|---|---|---|
| **Framework** | Next.js (App Router) | `16.1.6` (React 19.2.0, Turbopack) |
| **Language** | TypeScript | `^5` (Strict mode) |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss ^4`, `tailwind-merge`, `clsx` |
| **UI Components** | Radix UI + Lucide | Dialog, Dropdown, ScrollArea, Slot, Toast, `lucide-react` (v0.560+) |
| **Animation** | Framer Motion | `^12.23.25` |
| **Math & Symbols** | Math.js & KaTeX | `mathjs ^15.2.0`, `katex ^0.16.8` |
| **MDX Engine** | next-mdx-remote | `^6.0.0` (RSC compatible), `remark-gfm ^4`, `rehype-slug ^6` |
| **Data Layer & ORM** | Prisma + PostgreSQL | Prisma `^5.17.0`, Supabase/PostgreSQL pool |
| **Authentication** | NextAuth.js (Auth.js) | `^5.0.0-beta.30` + Prisma Adapter |
| **State Management**| Zustand & React Context | `zustand ^4.5.2` (global tool state, project state) |
| **Charts & Graphics**| Chart.js & html2canvas | `chart.js ^4.5.1`, `html2canvas ^1.4.1`, `jspdf ^4.2.0` |
| **Testing** | Vitest & Playwright | Vitest `^4.0.18` (259 unit/integration tests), Playwright `^1.51.1` |
| **Quality Gates** | Custom Node CI Scripts | Asset check, i18n check, secret check, encoding, tool docs check |

---

## 3. Repository Architecture & Directory Blueprint

```
aiengineerslab/
├── app/                              # Next.js App Router root
│   ├── (blog)/blog/                  # Engineering blog archive & articles
│   ├── (tools)/tools/                # Main engineering calculators & tools suite
│   │   ├── basic-engineering/        # Fundamental formulas & cross-checks
│   │   ├── bearing-life/             # ISO 281 L10 bearing rating life calculator
│   │   ├── belt-length/              # Open & crossed belt length geometry
│   │   ├── bending-stress/           # Beam bending stress & section modulus
│   │   ├── bolt-calculator/          # VDI 2230 / ISO 898 bolt preload & torque
│   │   ├── bolt-database/            # ISO/DIN metric bolt dimension matrix
│   │   ├── bolt-size-torque/         # Rapid bolt size and tightening torque lookup
│   │   ├── coating-guide/            # Surface treatment & corrosion protection guide
│   │   ├── compressor-cc/            # Compressor displacement and volumetric flow
│   │   ├── fillet-weld/              # ISO 5817 / EN 1993 fillet weld throat stress
│   │   ├── fluids-hvac/              # HVAC & pipe flow fundamentals
│   │   ├── gear-design/              # Complete gear engineering suite (10+ modules)
│   │   │   ├── calculators/          # Ratio, module, force, backlash, viscosity, weight
│   │   │   └── simulations/          # Dynamic contact & mesh simulation views
│   │   ├── heat-energy/              # Heat loss, thermal insulation & conduction
│   │   ├── heat-treatment/           # Hardening, tempering & case depth reference
│   │   ├── hydraulic-cylinder/       # Push/pull forces, flow rate & speed
│   │   ├── machine-elements/         # Machine design component index
│   │   ├── material-cards/           # Interactive material property selector
│   │   ├── materials-manufacturing/  # Machinability & manufacturing guides
│   │   ├── param-chart/              # Parameter sensitivity visualizer
│   │   ├── pipe-pressure-loss/       # Darcy-Weisbach & Colebrook-White friction
│   │   ├── production-project/       # Manufacturing costing & process planning
│   │   ├── sanity-check/             # Engineering sanity check & dimensional verification
│   │   ├── sealing-guide/            # O-ring & rotary seal selection
│   │   ├── shaft-torsion/            # Torsional shear stress & polar moment
│   │   ├── simple-stress/            # Axial tension, compression & safety factors
│   │   ├── strength-statics/         # Mechanics of materials & Mohr's circle
│   │   ├── tolerance-lab/            # ISO 286 fits & RSS tolerance stack analysis
│   │   ├── torque-power/             # Power (kW), Torque (Nm), RPM relationship
│   │   ├── unit-converter/           # Multi-category high-precision unit conversion
│   │   └── [...slug]/                # Dynamic tool routing & metadata injector
│   ├── community/                    # Engineering Q&A and community discussions
│   ├── glossary/                     # Technical dictionary (100+ terms)
│   ├── guides/                       # Flagship E-E-A-T guides (42 comprehensive guides)
│   └── reference/                    # Fast engineering reference tables
├── components/                       # Modular UI & Feature components
│   ├── calculators/                  # Tool calculation forms and interactive outputs
│   ├── content/                      # Content blocks, trust badges, author lines
│   ├── layout/                       # PageShell, Navigation, MegaMenu, Footer
│   ├── mdx/                          # MDXRenderer, Formulas, StepLists, Custom Tables
│   ├── seo/                          # JsonLd, OpenGraph, Canonical injection
│   └── ui/                           # ActionCard, Buttons, Inputs, Modals, Badges
├── config/                           # Application configuration
│   ├── brand.ts                      # Brand copy & i18n metadata
│   ├── nav.ts                        # MegaMenu, header & footer navigation trees
│   ├── performance-budgets.ts        # Performance & bundle size thresholds
│   └── routes.ts                     # Centralized typed route definitions
├── content/                          # Markdown & MDX content repositories
│   ├── blog/                         # 78 Technical engineering blog posts (*.tr.mdx, *.en.mdx)
│   ├── glossary/                     # 102 Engineering dictionary entries
│   └── guides/                       # 42 Flagship E-E-A-T guides (21 TR + 21 EN, 1000+ words each)
├── data/                             # Static reference datasets
│   ├── quality-tools/                # FMEA, Ishikawa, 6-Sigma reference sets
│   ├── reference/                    # Materials, standard threads, roughness tables
│   ├── standards/                    # ISO, DIN, ASME standard definitions
│   └── tool-documentation.ts         # Scopes, formulas, assumptions & validation cases
├── lib/                              # Core engineering calculation logic & solvers
│   ├── sanityCheck/                  # Automated engineering sanity check engine
│   ├── tool-examples.test.ts         # Golden validation test cases for calculators
│   └── utils/                        # Formatting, number parsing, unit engines
├── prisma/                           # Database ORM
│   ├── migrations/                   # PostgreSQL migration history
│   └── schema.prisma                 # User, Calculation, SharedCalculation, Feedback
└── tests/                            # Vitest unit & integration test suites
```

---

## 4. Complete Catalog of Calculators & Engineering Tools

Every tool in TORQYX is designed to compute synchronously on the client, with optional persistence to the database and PDF generation capability.

### A. Mechanical Power & Drive Systems
1. **Power – Torque – Speed (`/tools/torque-power`):**
   * Formula: `P = (T * n) / 9549` or `T = (9549 * P) / n`
   * Inputs: Power (kW, hp), Torque (Nm, lb-ft), Rotational Speed (RPM).
   * Outputs: Angular velocity (`rad/s`), power dissipation, torque rating.
2. **Gear Engineering Suite (`/tools/gear-design/...`):**
   * *Ratio Calculator:* Transmission ratios, multi-stage reductions, center distance.
   * *Module Calculator:* Pitch diameter `d = m * z`, addendum, dedendum, root diameter.
   * *Gear Forces:* Tangential force `Ft = 2000 * T / d`, radial force `Fr = Ft * tan(alpha)`, axial force (helical) `Fa = Ft * tan(beta)`.
   * *Contact Ratio:* Transverse & total contact ratio ensuring continuous meshing (`eps_alpha > 1.2`).
   * *Backlash Calculator:* Thermal expansion & center distance tolerance backlash.
   * *Viscosity Selector:* ISO VG selection based on pitch-line velocity and tooth load.
   * *Weight Optimization:* Webbed and pocketed gear blank mass reduction.
3. **Shaft Torsion & Sizing (`/tools/shaft-torsion`):**
   * Formula: `tau = (16 * T) / (pi * d^3)` (solid), `tau = (16 * T * D) / (pi * (D^4 - d^4))` (hollow).
   * Outputs: Max shear stress, angle of twist `theta = (T * L) / (G * J)`, factor of safety against yield `S_y / tau`.
4. **Belt Length & Center Distance (`/tools/belt-length`):**
   * ISO/DIN open and crossed belt length calculations for unequal pulley diameters.

### B. Structural, Fasteners & Connections
5. **Bolt Preload & Tightening Torque (`/tools/bolt-calculator`):**
   * Standard: VDI 2230 / ISO 898-1.
   * Inputs: Thread size (M3 to M64), property class (4.8, 8.8, 10.9, 12.9), friction coefficient `mu_total` (0.08 to 0.20), tightening technique.
   * Outputs: Proof stress load `Sp`, assembly preload `F_M`, tightening torque `M_A`, thread stress `sigma_v`.
6. **Bolt Database & Metric Pitch (`/tools/bolt-size-torque` & `/tools/bolt-database`):**
   * Coarse and fine thread pitches, tensile stress area `As`, minimum engagement depth in steel, cast iron, and aluminum.
7. **Fillet Weld Throat Stress (`/tools/fillet-weld`):**
   * Standard: Eurocode 3 (EN 1993-1-8).
   * Inputs: Throat thickness `a`, weld length `L`, normal/shear forces.
   * Outputs: Directional stresses `sigma_perp`, `tau_perp`, `tau_parallel`, and von Mises equivalent weld stress.
8. **Simple Stress & Factor of Safety (`/tools/simple-stress`):**
   * Axial tension, compression, shear, and bearing stress with material yield limit comparison.
9. **Beam Bending & Deflection (`/tools/bending-stress`):**
   * Euler-Bernoulli beam theory: simply supported, cantilever, fixed-fixed under point/distributed loads.
   * Outputs: Max bending moment `M_max`, section modulus `W_x`, max bending stress `sigma_b = M / W`, max deflection `delta`.

### C. Fluid Power & Heat Transfer
10. **Pipe Pressure Loss (`/tools/pipe-pressure-loss`):**
    * Equations: Darcy-Weisbach `delta_P = f * (L/D) * (rho * v^2 / 2)`, Reynolds number `Re = rho * v * D / mu`, Colebrook-White iterative solution + Haaland approximation.
    * Minor losses: K-factors for elbows, valves, tees, expansions, contractions.
11. **Hydraulic Cylinder Forces & Speed (`/tools/hydraulic-cylinder`):**
    * Inputs: Bore diameter `D`, rod diameter `d`, working pressure `P`, pump flow rate `Q`.
    * Outputs: Push force `F_push = P * pi * D^2 / 4`, pull force `F_pull = P * pi * (D^2 - d^2) / 4`, extension speed, retraction speed.
12. **Thermal Expansion & Insulation (`/tools/heat-energy`):**
    * Linear thermal expansion: `delta_L = alpha * L0 * delta_T`.
    * Thermal conduction: Fourier's law `Q = (k * A * delta_T) / s`.

### D. Manufacturing, Tolerancing & Quality
13. **Tolerance Lab & Fits (`/tools/tolerance-lab`):**
    * Standard: ISO 286-1 & ISO 286-2.
    * Fits: Clearance (e.g. H7/g6), Transition (e.g. H7/k6, H7/m6), Interference/Press-fit (e.g. H7/p6, H7/r6, H7/s6).
    * Statistical tolerance stack analysis: Worst-Case (linear sum) vs. RSS (Root Sum of Squares: `T_rss = sqrt(sum(T_i^2))`).
14. **Engineering Unit Converter (`/tools/unit-converter`):**
    * High-precision conversions across Pressure (Pa, bar, psi, MPa), Torque, Force, Power, Energy, Velocity, Flow rate, Temperature, Length.
15. **Engineering Sanity Check Engine (`/tools/sanity-check`):**
    * Rule-based heuristic verification that identifies physically unrealistic parameters (e.g., fluid velocity > 15 m/s in liquid pipe, stress exceeding ultimate tensile strength, negative clearances).

---

## 5. Content & Knowledge Engine (E-E-A-T Foundation)

### A. 42 In-Depth Engineering Guides (21 TR + 21 EN)
Every guide has been expanded to **1,000+ words** and strictly adheres to Google's Helpful Content / E-E-A-T standards. Each guide mandatory includes:
* `Problem / Objective` (Scope and design challenges)
* `Assumptions` (Material conditions, thermal limits, boundary constraints)
* `Step by step method` (Formulas, mathematical derivation, worked industrial example)
* `Common mistakes` (Real-world engineering pitfalls)
* `Related calculators` (Direct two-way links to tools)
* Comparative technical tables (materials, tolerances, processes)
* Frequently Asked Questions (FAQ)

**Topics Covered:**
1. Fluid dynamics & pipe/duct flow
2. Bolt head shapes & thread standards
3. CNC machining material selection
4. Rotating equipment balancing & vibration (ISO 10816, ISO 21940)
5. Helical spring design & Goodman diagram (EN 13906-1)
6. Thermal insulation & pipe expansion joints
7. Parallel key design & stress concentrations (DIN 6885)
8. Welded structure design & cost optimization
9. Beam bending & Euler-Bernoulli deflection
10. Corrosion resistance & stainless steel grades (PREN index)
11. Machine component fatigue life & S-N Wöhler curves
12. Multi-criteria material selection matrix
13. Pump selection & system head intersection
14. Press-fit interference connections & Lamé cylinder theory (DIN 7190)
15. Rolling bearing selection & L10 rating life
16. Standard SI & Imperial unit system conversions
17. Titanium alloys & machining (Ti-6Al-4V Grade 5)
18. Tolerance stack analysis: Worst-case vs. RSS
19. GD&T fundamentals & Datum reference frame (ASME Y14.5 / ISO 1101)
20. Viscosity classification (ISO VG, SAE, Kinematic vs. Dynamic)
21. Surface finishing & plating methods (RoHS/REACH, hard chrome, anodizing)

### B. Engineering Blog (78 Articles) & Glossary (102 Terms)
* Technical articles covering practical engineering design questions (e.g., DIN 931 vs DIN 933, bolt loosening causes, motor torque curves, VDI 2230 preload).
* Complete engineering glossary with mathematical definitions and contextual internal links.

---

## 6. Database Models & Persistence Layer (Prisma)

Current models in `prisma/schema.prisma`:
* **`User`:** User profile, email authentication, `UserTier` (`FREE`, `PRO`, `TEAM`), trial dates, Stripe customer mapping.
* **`Calculation`:** Saved user calculations (`userId`, `toolSlug`, `inputs: Json`, `outputs: Json`, `isFavorite`, `createdAt`).
* **`SharedCalculation`:** Public shareable calculation links with unique tokens (`code`, `inputs`, `outputs`, `expiresAt`, `isPublic`).
* **`Favorite`:** Saved tools by user.
* **`AiExplainFeedback`:** Up/down rating and question logs for AI-assisted explanations.
* **`Account` / `Session` / `VerificationToken`:** NextAuth.js session models.

---

## 7. Current Strengths & Identified Product Quality Gaps

### What TORQYX does exceptionally well:
1. **Speed & Reliability:** Static + SSR pages load in under 1 second; zero client hydration bloat on content pages.
2. **Technical Depth:** Calculations use genuine mechanical engineering standards (DIN, ISO, Eurocode, VDI), not oversimplified high-school formulas.
3. **High Content Quality:** 42 bilingual guides exceeding 1,200 words each with real industrial case studies.
4. **Test Coverage:** 259/259 automated vitest tests ensuring zero regression across calculation engines.

### Identified Product Quality Gaps (Actionable for Claude Code):
1. **Isolated Tool Silos (Lack of Workflow Continuity):**  
   Currently, every calculator operates in isolation. An engineer sizing a motor drive must calculate torque in `/tools/torque-power`, write it down on paper, switch to `/tools/shaft-torsion` to size the shaft, then switch to `/tools/bearing-life` to size the bearing. **There is no parameter passing between tools.**
2. **Static Output Presentation (Lack of Visual Interactivity):**  
   Results are currently presented as static numbers in cards. There are no live 2D parametric diagrams showing the bolt being clamped, the beam bending curve, the gear tooth profile, or the pipe velocity profile.
3. **Basic Reporting Capabilities:**  
   The current export to PDF is rudimentary (`html2canvas` screenshot). Professional engineers need formal **Certified Calculation Reports (PDF)** with step-by-step mathematical substitution, engineer name/stamp, PASS/FAIL safety verdict badges, and exportable live **Excel Calculation Sheets**.
4. **No Offline / Local Storage Auto-Save:**  
   If an engineer accidentally refreshes or navigates away from a complex tool (like gear design or tolerance lab), all filled input fields are reset.

---

## 8. The Top 3 Killer Features to Implement (Claude Code Task Specs)

Here are the 3 highest-leverage features that will elevate TORQYX into an enterprise-grade engineering workspace.

---

### FEATURE 1: "Engineering Project Workspace & Connected Pipeline" (Proje Çalışma Alanı & Bağlantılı Hesap Hattı)

#### Concept:
Transform isolated calculators into a **Connected Engineering Pipeline**. Allow users to create an "Engineering Project" (e.g., *"Conveyor Drive Unit Design"* or *"Hydraulic Press Sizing"*) and chain calculators together so outputs from Tool A seamlessly pipe into Tool B.

#### User Flow:
1. User clicks **"New Project"** in `/project-hub` (or starts from a template like *Drive Train Sizing*).
2. The user adds **Step 1: Torque & Power** (`P = 15 kW`, `n = 1450 rpm` → Output: `T = 98.8 Nm`).
3. The user adds **Step 2: Shaft Sizing**. A button appears: `[Link Input to Step 1: Torque]`. Clicking it auto-fills `T = 98.8 Nm`.
4. Shaft calculation yields required diameter `d_min = 32 mm`. The user selects standard size `d = 35 mm`.
5. The user adds **Step 3: Bearing Life**. It automatically pulls shaft diameter `35 mm` and speed `1450 rpm`.
6. User clicks **"Save Project"** (persisted to LocalStorage for Free users, saved to PostgreSQL `Calculation` / `Project` table for logged-in users).
7. One-click **"Export Complete Project Dossier"** generates a multi-page consolidated engineering calculation package.

#### Technical Implementation Path for Claude Code:
* **State Management:** Create a Zustand store `useProjectStore` in `contexts/` or `lib/stores/projectStore.ts` supporting node-based or linear step chaining.
* **Data Structure:**
  ```typescript
  type ProjectStep = {
    id: string;
    toolSlug: string;
    title: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    linkedFrom?: { stepId: string; outputKey: string; inputKey: string };
  };
  type EngineeringProject = {
    id: string;
    name: string;
    description?: string;
    steps: ProjectStep[];
    updatedAt: string;
  };
  ```
* **UI Components:** Add a clean pipeline drawer or top ribbon in tool pages showing active project and allowing "Send output to next tool".

---

### FEATURE 2: "Formal Engineering Calculation Report Generator (PDF & Live Excel)"

#### Concept:
Replace basic screenshot PDFs with a **Formal Audit-Ready Engineering Report** compliant with standard engineering documentation requirements.

#### Key Report Elements:
1. **Document Header:** Company / Project Name, Document ID, Engineer Name, Date, Revision Number.
2. **Problem Statement & Design Criteria:** Clear scope summary.
3. **Input Parameters Table:** With source tags (e.g., "From Customer Spec", "From ISO 898-1").
4. **Step-by-Step Mathematical Formula Render:** Formatted LaTeX with actual numbers substituted into the formula (not just the final answer):
   $$\tau = \frac{16 \cdot 98.8 \cdot 10^3}{\pi \cdot 35^3} = 11.74 \text{ MPa}$$
5. **Verdict Status Badge:** Green **[PASS - Safety Factor: 2.85 > 1.50]** or Red **[FAIL - Stress Exceeds Allowable Yield]**.
6. **Reference Standards Cited:** Exact ISO/DIN/ASME standard clauses.
7. **Sign-off / Approval Block:** Signature line for Prepared By / Approved By.
8. **Live Excel (.xlsx) Export:** Generate an Excel spreadsheet using formulas (e.g. `=A1*A2/9549`), NOT static values, so the engineer's customer can inspect the logic in Excel.

#### Technical Implementation Path for Claude Code:
* Use `@react-pdf/renderer` or fine-tuned `jspdf` template generator in `lib/reports/pdfReportGenerator.ts`.
* Use `xlsx` / `exceljs` library for formula-enabled spreadsheet downloads.
* Build a pre-export modal allowing the user to enter project name, client name, and sign-off details before generating.

---

### FEATURE 3: "Parametric 2D Live Engineering Schematics (Dynamic Canvas/SVG Visualizer)"

#### Concept:
Add a dynamic, interactive parametric diagram to the top 5 calculators. As the user alters numbers in the input fields, the graphical schematic updates in real-time, showing dimension lines, stress concentrations, and force vectors.

#### Initial 5 Tools to Equip with Live Schematics:
1. **Bolt Joint (`/tools/bolt-calculator`):**
   * Real-time 2D cross-section of bolt, washer, nut, and clamped plates.
   * Clamped plate thicknesses change dynamically. Thread engagement depth and grip length `l_k` visually dimensioned.
2. **Beam Deflection (`/tools/bending-stress`):**
   * Real-time elastic deflection curve `w(x)` plotted with bending moment diagram (BMD) and shear force diagram (SFD) beneath it.
3. **Shaft Cross-Section (`/tools/shaft-torsion`):**
   * Solid vs. hollow cross-section view with circular shear stress gradient (radial color gradient from blue at center to red at outer fiber).
4. **Pipe Flow Profile (`/tools/pipe-pressure-loss`):**
   * Parabolic velocity profile for laminar flow vs. flattened logarithmic profile for turbulent flow, with boundary layer visualization.
5. **Hydraulic Cylinder (`/tools/hydraulic-cylinder`):**
   * Transparent cylinder schematic showing piston stroke position, bore diameter, rod diameter, and fluid pressure arrows.

#### Technical Implementation Path for Claude Code:
* Create pure React SVG components in `components/calculators/visualizers/` (e.g. `BoltJointVisualizer.tsx`, `BeamDeflectionVisualizer.tsx`).
* Keep them dependency-free, responsive (SVG `viewBox`), accessible, and smooth using CSS transitions or standard SVG math.

---

## 9. Immediate Product Quality Upgrade Action Plan (Quick Wins)

Claude Code can execute these tactical enhancements right away to immediately improve perceived quality and conversion:

1. **Auto-Save & Form Recovery (LocalStorage Sync):**
   * Wrap calculator inputs with a lightweight `useToolAutoSave(toolSlug)` hook.
   * If an engineer accidentally reloads the page, a subtle prompt appears: *"Restored your last inputs from 5 minutes ago [Reset]"*.
2. **Instant "Quick Presets" Bar on Every Tool:**
   * Instead of starting with blank fields, provide 3 industry presets at the top of each tool:
     * *Bolt Calculator:* [M8 Grade 8.8 (Standard)] [M12 Grade 10.9 (Structural)] [M16 Grade 12.9 (Heavy Duty)]
     * *Pipe Pressure:* [1" Water Cooling Line] [DN50 Compressed Air (6 bar)] [DN100 Steam Supply]
     * *Shaft Torsion:* [Small Stepper Motor Shaft (5 mm)] [Industrial Drive Shaft (50 mm)] [Turbine Shaft (120 mm)]
3. **Interactive Warning & Limit Engine:**
   * If calculated stress $> 0.9 \cdot S_y$, render an amber warning card: *"Warning: Operating within 10% of material yield limit. Increase shaft diameter or specify 42CrMo4."*
   * If pipe water velocity $> 3.0 \text{ m/s}$, render an erosion/noise warning: *"High velocity risk: Recommended max velocity for industrial liquid piping is 2.0 - 2.5 m/s (ASHRAE Fundamentals)."*
4. **Command Palette (`Ctrl + K` / `Cmd + K`):**
   * Global shortcut to search across 30+ tools, 42 guides, 78 blogs, and 100+ materials in under 50ms with instant keyboard navigation.

---

## 10. How Claude Code Should Use This File

When working in the repository:
1. **Always run vitest tests after modifying calculation logic:** `npx vitest run`.
2. **Follow existing styling rules:** Tailwind CSS v4, Slate/Sky color palette, border-slate-200 cards, Lucide icons.
3. **Ensure full bilingual support:** Whenever adding input labels or tool results, provide both `tr` and `en` keys or use the existing `Locale` helpers.
4. **Preserve MDX syntax cleanliness:** In MDX files, never write unescaped `<` or `{` characters outside code backticks.
