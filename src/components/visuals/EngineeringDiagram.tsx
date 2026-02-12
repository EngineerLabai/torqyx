import type { Locale } from "@/utils/locale";
import { formatNumberFixed } from "@/utils/number-format";
import { forwardRef, type ForwardedRef } from "react";

export type GearDiagramParams = {
  pitchDiameter?: number;
  teeth?: number;
  module?: number;
  showGrid?: boolean;
};

export type BoltDiagramParams = {
  diameter?: number;
  pitch?: number;
  washerOuter?: number;
  showGrid?: boolean;
};

export type PipeDiagramParams = {
  diameter?: number;
  length?: number;
  flow?: number;
  showGrid?: boolean;
};

export type EngineeringDiagramType = "gear" | "bolt" | "pipe";

export type EngineeringDiagramProps =
  | {
      type: "gear";
      params: GearDiagramParams;
      locale: Locale;
      className?: string;
    }
  | {
      type: "bolt";
      params: BoltDiagramParams;
      locale: Locale;
      className?: string;
    }
  | {
      type: "pipe";
      params: PipeDiagramParams;
      locale: Locale;
      className?: string;
    };

type DiagramColors = {
  stroke: string;
  muted: string;
  fill: string;
  grid: string;
  dim: string;
  accent: string;
  background: string;
};

const COLORS: DiagramColors = {
  stroke: "#0f172a",
  muted: "#94a3b8",
  fill: "#e2e8f0",
  grid: "#e2e8f0",
  dim: "#64748b",
  accent: "#0ea5e9",
  background: "#ffffff",
};

const t = (locale: Locale, tr: string, en: string) => (locale === "tr" ? tr : en);

const toPositiveNumber = (value?: number) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;

const formatValue = (value: number | null, locale: Locale, unit: string, digits: number) => {
  if (!value || !Number.isFinite(value)) return "-";
  return `${formatNumberFixed(value, locale, digits)} ${unit}`;
};

const formatCount = (value: number | null, locale: Locale) => {
  if (!value || !Number.isFinite(value)) return "-";
  return formatNumberFixed(Math.round(value), locale, 0);
};

const renderGrid = (width: number, height: number, step: number) => {
  const vertical = Array.from({ length: Math.floor(width / step) }, (_, i) => step * (i + 1));
  const horizontal = Array.from({ length: Math.floor(height / step) }, (_, i) => step * (i + 1));

  return (
    <g aria-hidden="true">
      {vertical.map((x) => (
        <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} stroke={COLORS.grid} strokeWidth={0.6} />
      ))}
      {horizontal.map((y) => (
        <line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} stroke={COLORS.grid} strokeWidth={0.6} />
      ))}
    </g>
  );
};

const GearDiagram = (
  params: GearDiagramParams,
  locale: Locale,
  className: string | undefined,
  ref: ForwardedRef<SVGSVGElement>,
) => {
  const width = 360;
  const height = 200;
  const cx = 130;
  const cy = 100;

  const teeth = toPositiveNumber(params.teeth);
  const moduleValue = toPositiveNumber(params.module);
  const pitchDiameter =
    toPositiveNumber(params.pitchDiameter) ?? (moduleValue && teeth ? moduleValue * teeth : null);
  const resolvedModule = moduleValue ?? (pitchDiameter && teeth ? pitchDiameter / teeth : null);

  const pitchDiameterSafe = pitchDiameter ?? 120;
  const moduleSafe = resolvedModule ?? 4;
  const outerDiameter = pitchDiameterSafe + 2 * moduleSafe;
  const outerRadiusMm = outerDiameter / 2;
  const pitchRadiusMm = pitchDiameterSafe / 2;
  const scale = 70 / Math.max(outerRadiusMm, 1);
  const pitchRadius = pitchRadiusMm * scale;
  const outerRadius = outerRadiusMm * scale;
  const innerRadius = Math.max(pitchRadius - moduleSafe * scale * 1.2, outerRadius * 0.6);
  const tickCount = Math.max(8, Math.min(60, Math.round(teeth ?? 24)));

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / tickCount;
    const x1 = cx + (outerRadius - 4) * Math.cos(angle);
    const y1 = cy + (outerRadius - 4) * Math.sin(angle);
    const x2 = cx + (outerRadius + 4) * Math.cos(angle);
    const y2 = cy + (outerRadius + 4) * Math.sin(angle);
    return <line key={`t-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.stroke} strokeWidth={1} />;
  });

  const moduleLabel = t(locale, "Modül m", "Module m");
  const teethLabel = t(locale, "Diş sayısı z", "Tooth count z");
  const pitchLabel = t(locale, "Hatve çapı d", "Pitch diameter d");

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={t(locale, "Dişli diyagramı", "Gear diagram")}
    >
      <rect x={0} y={0} width={width} height={height} fill={COLORS.background} />
      {params.showGrid ? renderGrid(width, height, 18) : null}

      <circle cx={cx} cy={cy} r={outerRadius} fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth={2} />
      <circle
        cx={cx}
        cy={cy}
        r={pitchRadius}
        fill="none"
        stroke={COLORS.muted}
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      <circle cx={cx} cy={cy} r={innerRadius} fill="#f8fafc" stroke={COLORS.muted} strokeWidth={1} />
      {ticks}

      <line x1={cx + pitchRadius} y1={cy} x2={cx + outerRadius} y2={cy} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={cx + pitchRadius} y1={cy - 6} x2={cx + pitchRadius} y2={cy + 6} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={cx + outerRadius} y1={cy - 6} x2={cx + outerRadius} y2={cy + 6} stroke={COLORS.dim} strokeWidth={1} />
      <text x={cx + outerRadius + 8} y={cy + 4} fontSize={10} fill={COLORS.dim}>
        {moduleLabel} = {formatValue(resolvedModule, locale, "mm", 3)}
      </text>

      <line x1={cx - pitchRadius} y1={cy + pitchRadius + 20} x2={cx + pitchRadius} y2={cy + pitchRadius + 20} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={cx - pitchRadius} y1={cy + pitchRadius + 16} x2={cx - pitchRadius} y2={cy + pitchRadius + 24} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={cx + pitchRadius} y1={cy + pitchRadius + 16} x2={cx + pitchRadius} y2={cy + pitchRadius + 24} stroke={COLORS.dim} strokeWidth={1} />
      <text x={cx - pitchRadius} y={cy + pitchRadius + 36} fontSize={10} fill={COLORS.dim}>
        {pitchLabel} = {formatValue(pitchDiameter, locale, "mm", 2)}
      </text>

      <text x={240} y={70} fontSize={11} fill={COLORS.stroke} fontWeight={600}>
        {teethLabel}
      </text>
      <text x={240} y={88} fontSize={12} fill={COLORS.accent} fontWeight={700}>
        z = {formatCount(teeth, locale)}
      </text>
    </svg>
  );
};

const BoltDiagram = (
  params: BoltDiagramParams,
  locale: Locale,
  className: string | undefined,
  ref: ForwardedRef<SVGSVGElement>,
) => {
  const width = 360;
  const height = 160;
  const diameter = toPositiveNumber(params.diameter);
  const pitch = toPositiveNumber(params.pitch);
  const washerOuter = params.washerOuter && params.washerOuter > 0 ? params.washerOuter : 14;

  const diameterLabel = t(locale, "Çap d", "Diameter d");
  const pitchLabel = t(locale, "Hatve P", "Thread pitch P");

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={t(locale, "Civata diyagramı", "Bolt diagram")}
    >
      <rect x={0} y={0} width={width} height={height} fill={COLORS.background} />
      {params.showGrid ? renderGrid(width, height, 20) : null}

      <rect x={30} y={50} width={46} height={60} rx={8} fill={COLORS.fill} stroke={COLORS.muted} />
      <rect x={76} y={60} width={10} height={40} rx={4} fill="#cbd5e1" stroke={COLORS.muted} />
      <rect x={86} y={74} width={4} height={12} rx={3} fill={COLORS.background} />

      <rect x={88} y={70} width={160} height={20} rx={10} fill="#e2e8f0" stroke={COLORS.muted} />
      <rect x={248} y={70} width={40} height={20} rx={10} fill="#cbd5e1" stroke={COLORS.muted} />

      <path d="M250 70 L258 76 L250 82 L258 88 L250 94" fill="none" stroke={COLORS.muted} strokeWidth={2} />
      <path d="M258 70 L266 76 L258 82 L266 88 L258 94" fill="none" stroke={COLORS.muted} strokeWidth={2} />
      <path d="M266 70 L274 76 L266 82 L274 88 L266 94" fill="none" stroke={COLORS.muted} strokeWidth={2} />

      <line x1={304} y1={60} x2={304} y2={100} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={298} y1={60} x2={310} y2={60} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={298} y1={100} x2={310} y2={100} stroke={COLORS.dim} strokeWidth={1} />
      <text x={312} y={84} fontSize={10} fill={COLORS.dim}>
        {diameterLabel} = {formatValue(diameter, locale, "mm", 2)}
      </text>

      <line x1={220} y1={40} x2={250} y2={40} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={220} y1={36} x2={220} y2={44} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={250} y1={36} x2={250} y2={44} stroke={COLORS.dim} strokeWidth={1} />
      <text x={204} y={28} fontSize={10} fill={COLORS.dim}>
        {pitchLabel} = {formatValue(pitch, locale, "mm", 2)}
      </text>

      <circle cx={80} cy={80} r={washerOuter} fill="none" stroke={COLORS.muted} strokeWidth={2} />
    </svg>
  );
};

const PipeDiagram = (
  params: PipeDiagramParams,
  locale: Locale,
  className: string | undefined,
  ref: ForwardedRef<SVGSVGElement>,
) => {
  const width = 360;
  const height = 180;
  const diameter = toPositiveNumber(params.diameter);
  const length = toPositiveNumber(params.length);
  const flow = toPositiveNumber(params.flow);

  const diameterLabel = t(locale, "Çap D", "Diameter D");
  const lengthLabel = t(locale, "Uzunluk L", "Length L");
  const flowLabel = t(locale, "Debi Q", "Flow Q");
  const minorLossLabel = t(locale, "Yerel kayıplar", "Minor losses");

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={t(locale, "Boru diyagramı", "Pipe diagram")}
    >
      <rect x={0} y={0} width={width} height={height} fill={COLORS.background} />
      {params.showGrid ? renderGrid(width, height, 20) : null}

      <rect x={40} y={70} width={260} height={40} rx={20} fill={COLORS.fill} stroke={COLORS.muted} />
      <rect x={52} y={80} width={236} height={20} rx={10} fill="#f8fafc" stroke="#cbd5e1" />

      <line x1={60} y1={90} x2={240} y2={90} stroke={COLORS.accent} strokeWidth={2} />
      <polygon points="240,84 252,90 240,96" fill={COLORS.accent} />
      <text x={120} y={82} fontSize={10} fill={COLORS.accent} fontWeight={600}>
        {flowLabel} = {formatValue(flow, locale, "m3/s", 3)}
      </text>

      <line x1={28} y1={70} x2={28} y2={110} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={24} y1={70} x2={32} y2={70} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={24} y1={110} x2={32} y2={110} stroke={COLORS.dim} strokeWidth={1} />
      <text x={8} y={128} fontSize={10} fill={COLORS.dim}>
        {diameterLabel}
      </text>
      <text x={8} y={140} fontSize={10} fill={COLORS.dim}>
        {formatValue(diameter, locale, "mm", 1)}
      </text>

      <line x1={40} y1={128} x2={300} y2={128} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={40} y1={124} x2={40} y2={132} stroke={COLORS.dim} strokeWidth={1} />
      <line x1={300} y1={124} x2={300} y2={132} stroke={COLORS.dim} strokeWidth={1} />
      <text x={120} y={150} fontSize={10} fill={COLORS.dim}>
        {lengthLabel} = {formatValue(length, locale, "m", 2)}
      </text>

      <path d="M110 46 L110 60 L126 60" fill="none" stroke={COLORS.dim} strokeWidth={2} />
      <path d="M166 46 L178 56 L166 66 L178 76" fill="none" stroke={COLORS.dim} strokeWidth={2} />
      <path d="M212 46 L226 60 L212 74" fill="none" stroke={COLORS.dim} strokeWidth={2} />
      <text x={92} y={38} fontSize={10} fill={COLORS.dim}>
        {minorLossLabel}
      </text>
    </svg>
  );
};

const EngineeringDiagram = forwardRef<SVGSVGElement, EngineeringDiagramProps>((props, ref) => {
  if (props.type === "gear") {
    return GearDiagram(props.params, props.locale, props.className, ref);
  }

  if (props.type === "bolt") {
    return BoltDiagram(props.params, props.locale, props.className, ref);
  }

  return PipeDiagram(props.params, props.locale, props.className, ref);
});

EngineeringDiagram.displayName = "EngineeringDiagram";

export default EngineeringDiagram;
