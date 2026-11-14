---
title: "Pipe Pressure Loss Calculation: How to Use?"
description: "Step-by-step practical guide to Darcy-Weisbach pipe friction pressure loss calculation."
date: "2026-03-07"
updatedAt: "2026-03-07"
relatedTools:
  - "fluids-hvac"
  - "hydraulic-cylinder"
  - "unit-converter"
  - "torque-power"
---

## Problem Definition

In fluid transport lines, pressure drop directly impacts pump sizing, energy consumption, and operating efficiency.
If pipe diameter or length is incorrectly selected, pump operating costs escalate, and the required design flow rate cannot be maintained.
This calculation validates pipe hydraulic performance at preliminary design stages.

## Formula Explanation

The governing equation is the classic Darcy-Weisbach formula:

`DeltaP = f * (L / D) * (rho * v^2 / 2)`

- `DeltaP`: pressure drop (Pa)
- `f`: Darcy friction factor
- `L`: pipe length (m)
- `D`: inner pipe diameter (m)
- `rho`: fluid density (kg/m^3)
- `v`: mean flow velocity (m/s)

Step 1: Determine flow velocity from volume flow rate and cross-sectional area.

Step 2: Calculate the Reynolds number (`Re = rho * v * D / mu`).

Step 3: Determine the friction factor `f` based on flow regime (laminar or Swamee-Jain turbulent approximation).

Step 4: Compute total frictional pressure drop and compare against system pump head limits.

Flow sequence:

```text
Flow Rate & Geometry -> Velocity -> Reynolds Number -> Friction Factor -> Pressure Drop
```

## Worked Example

Example inputs:

- Flow rate: `12 m^3/h`
- Internal diameter: `80 mm`
- Length: `120 m`
- Density: `998 kg/m^3`
- Kinematic viscosity: `1.0e-6 m^2/s`
- Approximate friction factor: `f = 0.022`

Intermediate steps:

1. Flow rate: `Q = 0.00333 m^3/s`
2. Area: `A = pi * D^2 / 4 = 0.00503 m^2`
3. Velocity: `v = Q / A = 0.66 m/s`
4. Reynolds number: `Re ~ 5.3e4` (turbulent regime)

Pressure drop calculation:

`DeltaP = 0.022 * (120 / 0.08) * (998 * 0.66^2 / 2) ~ 7.2 kPa`

## Common Mistakes

- Using flow rate in `m^3/h` directly without converting to `m^3/s`.
- Using outer pipe diameter instead of internal diameter.
- Mixing dynamic viscosity (Pa·s) with kinematic viscosity (m²/s).
- Evaluating only straight-pipe friction while neglecting fittings, elbows, and valve losses.

## Application Limits and Validation

This tool uses the standard Darcy-Weisbach equation for straight circular pipes. ISO 5167 applies to differential pressure flow metering and is not a piping sizing standard. Minor fitting losses, two-phase flows, transient water hammer, pump curves, and pipe wall structural hoop stress are outside the scope of this calculator.

Final piping designs must be verified against applicable piping codes (ASME B31.3 / EN 13480), manufacturer pump curves, and verified loss coefficients for all fittings.

## Related Tools

- [Fluids and HVAC](/en/tools/fluids-hvac)
- [Hydraulic Cylinder Force & Speed](/en/tools/hydraulic-cylinder)
- [Unit Converter](/en/tools/unit-converter)
- [Power - Torque - Speed](/en/tools/torque-power)
