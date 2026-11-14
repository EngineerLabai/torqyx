---
title: "Bolt Sizing and Preload Calculation: How to Use?"
description: "Practical engineering guide to calculate bolt preload, tightening torque, and safety margins step-by-step."
date: "2026-03-07"
updatedAt: "2026-03-07"
standards:
  - "ISO 898-1"
  - "ISO 68-1"
relatedTools:
  - "torque-power"
  - "shaft-torsion"
  - "fillet-weld"
  - "pipe-pressure-loss"
---

## Problem Definition

Bolted joints face two critical failure modes: insufficient clamping force and over-tightening.
Insufficient preload causes joint separation, fatigue failure, and vibration loosening. Over-tightening causes thread stripping or bolt shank yielding during assembly.
This calculator allows rapid, reproducible checks of bolted connection integrity.

## Formula Explanation

Step 1: Compute stress area `As` from nominal diameter and thread pitch:

`As = (pi / 4) * (d - 0.9382 * P)^2`

Step 2: Establish the target clamping preload `F_preload` as a percentage of bolt yield strength (typically 65% to 85% of proof/yield stress).

Step 3: Calculate the estimated tightening torque using the empirical torque factor relation:

`T = K * F_preload * d`

- `T`: tightening torque (N·m)
- `K`: dimensionless torque factor (nut factor representing combined thread and under-head friction)
- `F_preload`: clamp preload force (N)
- `d`: nominal bolt diameter (m)

Step 4: Check resulting bolt tensile stress against material yield limits to determine the safety factor.

Decision workflow:

```text
Material & Geometry -> Stress Area As -> Target Preload -> Tightening Torque -> Stress Verification
```

## Worked Example

Example inputs:

- Nominal diameter: `M12`
- Thread pitch: `1.75 mm`
- Property class: `8.8` (Yield strength ~ 640 MPa)
- Target preload: `35 kN`
- Torque factor: `K = 0.20` (as-received standard steel bolt)

Calculations:

1. Nominal diameter in meters: `d = 0.012 m`
2. Tightening torque: `T = 0.20 * 35000 * 0.012 = 84 N·m`
3. Result: Required assembly tightening torque is approximately `84 N·m`.

In field assembly, verify this value using calibrated torque wrenches according to lubricant and surface conditions.

## Common Mistakes

- Confusing millimetres (`mm`) and metres (`m`) in the torque formula.
- Assuming torque factor `K` is a universal constant (it varies widely with lubrication, zinc plating, or wax coating).
- Neglecting thread tolerance classes (e.g., 6g/6H vs loose fits).
- Failing to verify bolt tensile stress against minimum proof strength.

## Application Limits and Validation

This tool uses the simplified `T = K * F_preload * d` relationship for quick preliminary sizing checks. It does not replace full VDI 2230 systematic joint design, which accounts for joint elasticity, clamp length ratios, embedment relaxation, thermal gradients, or eccentric external loads.

Verify applicable editions of ISO 898-1 and ISO 68-1 in project specifications. For safety-critical designs, refer to full licensed standard documents, certified supplier technical datasheets, and calibrated tool calibration records.

## Related Tools

- [Power - Torque - Speed](/en/tools/torque-power)
- [Shaft Torsion](/en/tools/shaft-torsion)
- [Fillet Weld Sizing](/en/tools/fillet-weld)
- [Pipe Pressure Loss](/en/tools/pipe-pressure-loss)
