"use client";

import React from "react";

interface BeamDiagramProps {
  length: number; // Kiriş boyu (L)
  force: number; // Kuvvet (F)
  maxMoment: number; // Hesaplanmış max moment
}

export default function BeamDiagram({ length, force, maxMoment }: BeamDiagramProps) {
  // Kiriş çizimi için SVG boyutları
  const svgWidth = 400;
  const svgHeight = 200;
  const margin = 40;
  const drawWidth = svgWidth - margin * 2;
  
  // Basit mesnetli kirişte yük tam ortada (L/2) kabul edilerek moment diyagramı (Üçgen) çizilir
  const startX = margin;
  const endX = margin + drawWidth;
  const midX = margin + drawWidth / 2;
  
  const baseY = 150; // X ekseni
  const peakY = 50; // Max momentin (üçgenin tepesinin) Y koordinatı

  if (length <= 0 || force <= 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4">
      <h4 className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Eğilme Momenti Diyagramı (BMD)</h4>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-w-md mx-auto drop-shadow-sm">
        {/* X Ekseni (Kiriş Referansı) */}
        <line x1={startX} y1={baseY} x2={endX} y2={baseY} stroke="#94a3b8" strokeWidth="2" />
        
        {/* Moment Diyagramı (Üçgen Poligon) */}
        <path
          d={`M ${startX},${baseY} L ${midX},${peakY} L ${endX},${baseY} Z`}
          fill="rgba(56, 189, 248, 0.2)"
          stroke="#0284c7"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Max Moment Etiketi */}
        <text x={midX} y={peakY - 10} textAnchor="middle" className="fill-sky-700 text-[12px] font-bold">
          {maxMoment.toFixed(2)} N·m
        </text>
      </svg>
    </div>
  );
}