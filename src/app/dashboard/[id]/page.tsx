"use client";

import { useParams } from "next/navigation";
import { Trophy, Star, TrendingUp, User, Layout, ExternalLink, AlertCircle, Loader2, Share2, Download, MessageCircle, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { id } = useParams();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/student/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        // Fallback to mock data if API fails so the UI still works
        console.error(err);
        setData({
          student: { full_name: "Jane Doe", department: "Engineering" },
          assessments: [{
            dimension_scores: { IQ: 85, EQ: 92, SQ: 78, AQ: 88, SpQ: 70 },
            primary_profile: "The Visionary Architect",
            founder_fit: { Builder: 94 },
            development_report: {
              profile_summary: "Highly adaptive with exceptional emotional intelligence. You thrive in chaotic environments where strategic empathy is required to align stakeholders.",
              actionable_feedback: [
                "Consider supplemental courses or study groups to strengthen core problem-solving (IQ) skills.",
                "Your EQ is excellent. You might make a great peer mentor or team mediator."
              ]
            }
          }]
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleShare = (platform: string) => {
    alert(`Mock sharing to ${platform}! This would open a share dialog.`);
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-cyan-500 font-mono">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin mb-4 drop-shadow-[0_0_10px_#06b6d4]" />
          <div className="animate-pulse">DECRYPTING_PROFILE_DATA...</div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-red-500 font-mono flex-col">
        <AlertCircle className="mb-4 h-12 w-12 animate-pulse" />
        <span className="text-xl">CORRUPTION_DETECTED: {error}</span>
      </div>
    );
  }

  const student = data?.student || {};
  const assessment = data?.assessments?.[0] || {};
  const scores = assessment.dimension_scores || { IQ: 85, EQ: 92, SQ: 78, AQ: 88, SpQ: 70 };
  const report = assessment.development_report || {};
  
  // calculate fit score
  const maxFit = assessment.founder_fit ? Math.max(...Object.values(assessment.founder_fit as Record<string, number>)) : 94;
  
  const profile = {
    name: student.full_name || "Jane Doe",
    type: assessment.primary_profile || "The Visionary Architect",
    description: report.profile_summary || "Highly adaptive with exceptional emotional intelligence.",
    fitScore: maxFit > 100 ? 100 : maxFit,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 pb-20">
      
      {/* Top Banner / Header */}
      <div className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-black/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center text-slate-900 font-black font-mono shadow-[0_0_10px_rgba(6,182,212,0.5)]">C2C</div>
             <span className="font-mono text-cyan-400 font-bold hidden sm:inline-block tracking-widest text-sm">TALENT_MATRIX</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
             <button onClick={() => handleShare('WhatsApp')} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-lg text-sm font-semibold transition-all shadow-inner">
                <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">WhatsApp</span>
             </button>
             <button onClick={() => handleShare('LinkedIn')} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 border border-[#0077b5]/30 rounded-lg text-sm font-semibold transition-all shadow-inner">
                <Linkedin className="w-4 h-4" /> <span className="hidden sm:inline">LinkedIn</span>
             </button>
             <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 rounded-lg text-sm font-semibold transition-all shadow-inner">
                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
             </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Left Column: Profile & Founder Fit */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            
            {/* Main Profile Card */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-6 sm:p-8 pb-0 flex flex-col items-center text-center">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-slate-800 border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] mb-4">
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-mono tracking-tight">{profile.name}</h1>
                <div className="inline-block px-4 py-1.5 bg-cyan-950 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest border border-cyan-800/50 mb-6 shadow-inner">
                  {profile.type}
                </div>
              </div>

              {/* Founder Fit Prominent Section */}
              <div className="bg-slate-950 p-6 sm:p-8 border-t border-slate-800 mt-2 relative overflow-hidden">
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                
                <div className="flex flex-col items-center relative z-10">
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-[0.2em] mb-2 font-mono">Founder_Fit_Index</span>
                  <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] tracking-tighter">
                    {profile.fitScore}%
                  </div>
                  <div className="w-full mt-6 bg-slate-800 rounded-full h-2.5 sm:h-3 overflow-hidden shadow-inner p-[1px] border border-slate-700">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative rounded-full" 
                      style={{ width: `${profile.fitScore}%` }}
                    >
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIvPjwvc3ZnPg==')] opacity-50"></div>
                      <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-r from-transparent to-white/30"></div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-xl relative">
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-cyan-500 rounded-r"></div>
                     <p className="text-center text-sm text-slate-400 leading-relaxed italic pl-2">
                       "{profile.description}"
                     </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Legend Ad */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-100 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="mx-auto h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mb-4 shadow-[0_0_15px_rgba(234,179,8,0.15)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-shadow">
                   <Trophy className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-mono uppercase tracking-wider">Professional Legend</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400">Unlock your verified corporate profile mapped in our legacy 1995 protocol interface.</p>
                <Link
                  href="/index.html"
                  className="mt-6 inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-lg bg-slate-800 border border-slate-700 px-6 py-3 text-sm font-bold text-slate-300 transition-all hover:bg-slate-700 hover:text-white hover:border-slate-500"
                >
                  <ExternalLink className="h-4 w-4" /> ACCESS_LEGEND
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Analytics & Report */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            
            {/* Psychometric Matrix */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                <TrendingUp className="w-64 h-64" />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-800 pb-4 relative z-10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-mono uppercase tracking-widest flex items-center">
                    <span className="text-cyan-500 mr-2 text-3xl leading-none -mt-2">.</span>Intelligence Matrix
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Multi-dimensional cognitive analysis</p>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row items-center justify-center gap-8 sm:gap-12 relative z-10">
                {/* Radar Chart Container */}
                <div className="relative h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] shrink-0 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800/80 shadow-inner">
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]"></div>
                  <div className="relative z-10 w-full h-full p-4 sm:p-6">
                     <RadarChart scores={scores} />
                  </div>
                </div>
                
                {/* Score Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                  {Object.entries(scores).map(([key, value]) => (
                    <div key={key} className="rounded-xl bg-slate-950 border border-slate-800/80 p-4 sm:p-5 group hover:border-cyan-500/30 transition-colors shadow-inner">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-[0.2em] font-mono group-hover:text-cyan-300 transition-colors">{key}</span>
                        <span className="text-2xl sm:text-3xl font-black text-white">{value as React.ReactNode}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="h-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] relative" 
                          style={{ width: `${value}%` }} 
                        >
                           <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personal Development Report */}
            {report.actionable_feedback && report.actionable_feedback.length > 0 && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
                
                <div className="border-b border-slate-800 pb-4 mb-8">
                   <h2 className="text-xl sm:text-2xl font-bold text-white font-mono uppercase tracking-widest mb-1 flex items-center">
                      <span className="text-cyan-500 mr-2 text-3xl leading-none -mt-2">.</span>Dev_Report
                   </h2>
                   <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider font-semibold">Actionable insights from psychometric profile</p>
                </div>
                
                <div className="space-y-8">
                  {/* Summary Callout */}
                  <div className="relative p-5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                    <div className="absolute -top-2.5 left-6 px-3 bg-slate-900 text-cyan-400 text-[10px] sm:text-xs font-bold font-mono tracking-[0.2em] border border-slate-700 rounded shadow-md">
                      EXECUTIVE_SUMMARY
                    </div>
                    <p className="text-slate-300 leading-relaxed pt-2 text-sm sm:text-base">
                      {report.profile_summary}
                    </p>
                  </div>
                  
                  {/* Actionable Feedback List */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-500 font-mono tracking-[0.2em] uppercase mb-4 pl-1">Targeted_Directives</h4>
                    <div className="grid gap-3 sm:gap-4">
                      {report.actionable_feedback.map((feedback: string, idx: number) => (
                        <div key={idx} className="flex items-start p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors shadow-inner group">
                          <div className="flex-shrink-0 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded bg-slate-900 text-cyan-500 font-mono text-xs sm:text-sm font-bold mr-4 border border-slate-700 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-colors">
                            0{idx + 1}
                          </div>
                          <p className="text-slate-400 leading-relaxed text-sm sm:text-base pt-1 sm:pt-1.5 group-hover:text-slate-300 transition-colors">
                            {feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const size = 100;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) * 0.70;
  const categories = Object.keys(scores);
  const data = Object.values(scores);

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
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]">
      {/* Grid */}
      {gridLines.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="currentColor"
          className="text-slate-800"
          strokeWidth="0.5"
          strokeDasharray={i === gridLines.length - 1 ? "none" : "1,2"}
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
            className="text-slate-700"
            strokeWidth="0.5"
          />
        );
      })}
      
      {/* Labels */}
      {categories.map((cat, i) => {
        const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
        const x = centerX + (radius + 15) * Math.cos(angle);
        const y = centerY + (radius + 8) * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[4.5px] font-bold fill-slate-400 font-mono tracking-widest"
          >
            {cat}
          </text>
        );
      })}
      
      {/* Data Polygon Base */}
      <polygon
        points={pointsStr}
        fill="rgba(6, 182, 212, 0.2)"
        stroke="none"
      />
      
      {/* Data Polygon Outline (glow effect) */}
      <polygon
        points={pointsStr}
        fill="none"
        stroke="#06b6d4"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_3px_#06b6d4]"
      />
      
      {/* Data Points */}
      {points.map((p, i) => (
        <circle 
          key={i} 
          cx={p.x} 
          cy={p.y} 
          r="1.8" 
          fill="#0f172a" 
          stroke="#06b6d4" 
          strokeWidth="0.8"
          className="drop-shadow-[0_0_3px_#06b6d4]" 
        />
      ))}
    </svg>
  );
}
