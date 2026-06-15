"use client";

import { useParams } from "next/navigation";
import { Trophy, Star, TrendingUp, User, Layout, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { id } = useParams();

  // Mock data
  const scores = {
    IQ: 85,
    EQ: 92,
    SQ: 78,
    AQ: 88,
    SpQ: 70,
  };

  const profile = {
    name: "Jane Doe",
    type: "The Visionary Architect",
    description: "Highly adaptive with exceptional emotional intelligence. You thrive in chaotic environments where strategic empathy is required to align stakeholders.",
    fitScore: 94,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Profile Summary */}
        <div className="w-full space-y-8 lg:w-1/3">
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900">
            <div className="bg-blue-600 p-8 text-white">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">{profile.name}</h1>
              <p className="text-blue-100">{profile.type}</p>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Founder Fit Score</span>
                <span className="text-3xl font-black text-blue-600">{profile.fitScore}%</span>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-blue-600" style={{ width: `${profile.fitScore}%` }} />
              </div>
              <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                {profile.description}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
            <Trophy className="mx-auto h-12 w-12 text-yellow-500" />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Professional Legend</h3>
            <p className="mt-2 text-sm text-slate-500">View your verified corporate profile in the legendary 1995 interface.</p>
            <Link
              href="/index.html"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Open Legend <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="w-full space-y-8 lg:w-2/3">
          <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900 sm:p-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Psychometric Radar</h2>
              <div className="flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-bold">Top 5% in AQ</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-center lg:flex-row">
              <div className="relative h-[300px] w-[300px]">
                <RadarChart scores={scores} />
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4 lg:ml-12 lg:mt-0 lg:flex-grow">
                {Object.entries(scores).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{key}</div>
                    <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{value}</div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full bg-blue-500" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Key Strength</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Adaptive Intelligence (AQ). You excel at maintaining performance during rapid organizational change.</p>
            </div>
            <div className="rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Growth Area</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Spatial Intelligence (SQ). Consider engaging in architectural thinking exercises to boost 3D problem solving.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const categories = Object.keys(scores);
  const data = Object.values(scores);
  const size = 300;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) * 0.8;

  // Generate points for the radar polygon
  const points = data.map((value, i) => {
    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  });

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Generate grid lines
  const gridLines = [20, 40, 60, 80, 100].map((level) => {
    const r = (level / 100) * radius;
    const gridPoints = categories.map((_, i) => {
      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
      return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
    }).join(" ");
    return gridPoints;
  });

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid */}
      {gridLines.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {categories.map((_, i) => {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos(angle)}
            y2={centerY + radius * Math.sin(angle)}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="1"
          />
        );
      })}
      {/* Labels */}
      {categories.map((cat, i) => {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
        const x = centerX + (radius + 25) * Math.cos(angle);
        const y = centerY + (radius + 20) * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400 uppercase tracking-tighter"
          >
            {cat}
          </text>
        );
      })}
      {/* Data Polygon */}
      <polygon
        points={pointsStr}
        fill="rgba(37, 99, 235, 0.2)"
        stroke="#2563eb"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Data Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2563eb" />
      ))}
    </svg>
  );
}
