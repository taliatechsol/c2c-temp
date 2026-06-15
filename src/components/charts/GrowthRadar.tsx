"use client";

import React, { useState } from "react";

interface DataPoint {
  label: string;
  year1: number; // 0-100
  year4: number; // 0-100
}

interface GrowthRadarProps {
  data?: DataPoint[];
}

const DEFAULT_DATA: DataPoint[] = [
  { label: "Technical", year1: 40, year4: 92 },
  { label: "Product", year1: 50, year4: 85 },
  { label: "Leadership", year1: 30, year4: 78 },
  { label: "Communication", year1: 60, year4: 95 },
  { label: "Adaptability", year1: 70, year4: 98 },
];

export default function GrowthRadar({ data = DEFAULT_DATA }: GrowthRadarProps) {
  const [view, setView] = useState<"year1" | "year4" | "both">("both");

  // Center and radius for SVG
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4; // leave room for labels

  const getPoint = (value: number, index: number, total: number) => {
    // Start at top (-90 degrees or -PI/2)
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const distance = (value / 100) * r;
    return {
      x: cx + distance * Math.cos(angle),
      y: cy + distance * Math.sin(angle),
    };
  };

  const year1Points = data.map((d, i) => getPoint(d.year1, i, data.length));
  const year4Points = data.map((d, i) => getPoint(d.year4, i, data.length));

  const year1Path = year1Points.map((p) => `${p.x},${p.y}`).join(" ");
  const year4Path = year4Points.map((p) => `${p.x},${p.y}`).join(" ");

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [20, 40, 60, 80, 100];

  return (
    <div className="flex flex-col items-center bg-black p-6 rounded-2xl border border-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-wide">360° Growth Trajectory</h3>
          <p className="text-xs text-gray-500 mt-1">Longitudinal development mapping</p>
        </div>
        <div className="flex space-x-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setView("year1")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              view === "year1" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Year 1
          </button>
          <button
            onClick={() => setView("year4")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              view === "year4" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Year 4
          </button>
          <button
            onClick={() => setView("both")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              view === "both" ? "bg-gray-800 text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
          >
            Compare
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[320px] aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
          {/* Defs for glowing effects */}
          <defs>
            <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Polygons */}
          {levels.map((level, i) => {
            const levelPoints = data.map((_, index) => getPoint(level, index, data.length));
            const path = levelPoints.map((p) => `${p.x},${p.y}`).join(" ");
            return (
              <polygon
                key={`grid-${i}`}
                points={path}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axes */}
          {data.map((_, i) => {
            const end = getPoint(100, i, data.length);
            return (
              <line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Year 1 Data Polygon */}
          {(view === "year1" || view === "both") && (
            <polygon
              points={year1Path}
              fill="rgba(79, 70, 229, 0.25)"
              stroke="rgba(79, 70, 229, 0.9)"
              strokeWidth="2"
              filter="url(#glow-indigo)"
              className="transition-all duration-700 ease-in-out origin-center"
              style={{ transformOrigin: "center", animation: "pulse 3s infinite alternate" }}
            />
          )}

          {/* Year 4 Data Polygon */}
          {(view === "year4" || view === "both") && (
            <polygon
              points={year4Path}
              fill="rgba(16, 185, 129, 0.25)"
              stroke="rgba(16, 185, 129, 0.9)"
              strokeWidth="2"
              filter="url(#glow-emerald)"
              className="transition-all duration-700 ease-in-out"
            />
          )}

          {/* Data Points (Dots) for Year 4 */}
          {(view === "year4" || view === "both") &&
            year4Points.map((p, i) => (
              <circle
                key={`p4-${i}`}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#10b981"
                stroke="#000"
                strokeWidth="1.5"
                className="transition-all duration-700 ease-in-out"
              />
            ))}

          {/* Data Points (Dots) for Year 1 */}
          {(view === "year1" || view === "both") &&
            year1Points.map((p, i) => (
              <circle
                key={`p1-${i}`}
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#4f46e5"
                stroke="#000"
                strokeWidth="1.5"
                className="transition-all duration-700 ease-in-out"
              />
            ))}

          {/* Outer Labels */}
          {data.map((d, i) => {
            const labelPos = getPoint(120, i, data.length);
            // Slight adjustments for text anchoring based on position
            let anchor = "middle";
            if (labelPos.x < cx - 20) anchor = "end";
            if (labelPos.x > cx + 20) anchor = "start";
            
            return (
              <text
                key={`label-${i}`}
                x={labelPos.x}
                y={labelPos.y}
                fill="#9ca3af"
                fontSize="11"
                textAnchor={anchor as "middle" | "end" | "start"}
                dominantBaseline="middle"
                className="font-medium tracking-wide"
              >
                {d.label}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex w-full justify-center space-x-8 mt-8 border-t border-gray-800 pt-6">
        <div className="flex items-center text-xs text-gray-300 font-medium">
          <div className="w-3 h-3 rounded-full bg-indigo-600 mr-2 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
          Baseline (Year 1)
        </div>
        <div className="flex items-center text-xs text-gray-300 font-medium">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          Current (Year 4)
        </div>
      </div>
    </div>
  );
}
