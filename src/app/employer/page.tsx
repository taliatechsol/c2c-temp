"use client";

import React, { useState } from "react";
import { Search, Zap, Code, Users, TrendingUp, SlidersHorizontal, UserCheck, LayoutGrid, List, Settings2 } from "lucide-react";
import GrowthRadar from "@/components/charts/GrowthRadar";

// Mock Data
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "Full-Stack Engineer",
    profile: "Builder",
    founderFit: true,
    aq: 92,
    eq: 88,
    stats: { code: 95, design: 80, product: 85, leadership: 70 },
    tags: ["React", "Rust", "System Design"],
    image: "https://i.pravatar.cc/150?u=elena",
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Product Growth",
    profile: "Rainmaker",
    founderFit: false,
    aq: 85,
    eq: 95,
    stats: { code: 40, design: 75, product: 95, leadership: 90 },
    tags: ["Go-to-Market", "Analytics", "UX Copy"],
    image: "https://i.pravatar.cc/150?u=marcus",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "AI Researcher",
    profile: "Deep Thinker",
    founderFit: true,
    aq: 98,
    eq: 75,
    stats: { code: 90, design: 40, product: 70, leadership: 60 },
    tags: ["PyTorch", "Transformers", "Math"],
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 4,
    name: "David Okafor",
    role: "Operations Lead",
    profile: "Operator",
    founderFit: true,
    aq: 82,
    eq: 92,
    stats: { code: 30, design: 60, product: 85, leadership: 95 },
    tags: ["Logistics", "Finance", "Strategy"],
    image: "https://i.pravatar.cc/150?u=david",
  },
  {
    id: 5,
    name: "Alex Nguyen",
    role: "Security Engineer",
    profile: "Builder",
    founderFit: false,
    aq: 89,
    eq: 78,
    stats: { code: 92, design: 50, product: 65, leadership: 80 },
    tags: ["Cryptography", "Pentesting", "C++"],
    image: "https://i.pravatar.cc/150?u=alex",
  },
  {
    id: 6,
    name: "Chloe Smith",
    role: "Developer Advocate",
    profile: "Rainmaker",
    founderFit: true,
    aq: 86,
    eq: 94,
    stats: { code: 85, design: 70, product: 80, leadership: 85 },
    tags: ["Community", "Content", "TypeScript"],
    image: "https://i.pravatar.cc/150?u=chloe",
  }
];

export default function EmployerDashboard() {
  const [founderFit, setFounderFit] = useState(false);
  const [minAQ, setMinAQ] = useState(70);
  const [minEQ, setMinEQ] = useState(70);
  const [profileFilter, setProfileFilter] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const filteredCandidates = MOCK_CANDIDATES.filter(c => {
    if (founderFit && !c.founderFit) return false;
    if (c.aq < minAQ) return false;
    if (c.eq < minEQ) return false;
    if (profileFilter !== "All" && c.profile !== profileFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            c2c / employer
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search talent..." 
              className="bg-gray-900 border border-gray-800 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all w-64"
            />
          </div>
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button className="p-1.5 bg-gray-800 rounded shadow-sm text-white"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-1.5 text-gray-400 hover:text-white transition-colors"><List className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
        {/* Sidebar Filters */}
        <aside className="w-80 bg-gray-950 border-r border-gray-800 p-6 flex flex-col overflow-y-auto z-10">
          <div className="flex items-center space-x-2 mb-8 text-gray-400">
            <SlidersHorizontal className="w-5 h-5" />
            <h2 className="font-semibold text-sm uppercase tracking-wider">Scouting Filters</h2>
          </div>

          <div className="space-y-8">
            {/* Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${founderFit ? 'bg-indigo-600/20 text-indigo-400' : 'bg-gray-900 text-gray-500 group-hover:bg-gray-800'}`}>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">Founder Fit</p>
                    <p className="text-[10px] text-gray-500">Requires high agency</p>
                  </div>
                </div>
                <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${founderFit ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-gray-800'}`} onClick={() => setFounderFit(!founderFit)}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${founderFit ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>

            <hr className="border-gray-800/60" />

            {/* Profile */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Primary Profile</h3>
              <div className="flex flex-wrap gap-2">
                {["All", "Builder", "Rainmaker", "Operator", "Deep Thinker"].map(profile => (
                  <button
                    key={profile}
                    onClick={() => setProfileFilter(profile)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      profileFilter === profile 
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                      : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-gray-200'
                    }`}
                  >
                    {profile}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-800/60" />

            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Minimum AQ</h3>
                  <span className="text-xs font-mono bg-indigo-900/30 px-2 py-0.5 rounded text-indigo-400 border border-indigo-500/20">{minAQ}+</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="100" 
                  value={minAQ} 
                  onChange={(e) => setMinAQ(Number(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className="text-[10px] text-gray-500 mt-2">Adaptability Quotient (Learning Velocity)</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Minimum EQ</h3>
                  <span className="text-xs font-mono bg-emerald-900/30 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/20">{minEQ}+</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="100" 
                  value={minEQ} 
                  onChange={(e) => setMinEQ(Number(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[10px] text-gray-500 mt-2">Emotional Quotient (Team Collaboration)</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black relative">
          
          {/* Candidate Grid */}
          <div className={`flex-1 p-8 overflow-y-auto transition-all duration-500 ${selectedCandidate ? 'pr-96' : ''}`}>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Top Candidates</h2>
                <p className="text-sm text-gray-400 mt-2">Showing <strong className="text-white">{filteredCandidates.length}</strong> matches from the c2c network.</p>
              </div>
              <button className="flex items-center space-x-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/50">
                <Settings2 className="w-4 h-4" />
                <span>Advanced Sort</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredCandidates.map(candidate => (
                <div 
                  key={candidate.id} 
                  className={`group relative bg-gray-950/80 backdrop-blur-sm rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                    ${selectedCandidate === candidate.id 
                      ? 'border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)] transform scale-[1.02]' 
                      : 'border-gray-800 hover:border-gray-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'}`}
                  onClick={() => setSelectedCandidate(candidate.id === selectedCandidate ? null : candidate.id)}
                >
                  {/* Highlight line on top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-opacity duration-300 ${selectedCandidate === candidate.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                  
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex space-x-4 items-center">
                        <div className="relative">
                          <img src={candidate.image} alt={candidate.name} className="w-14 h-14 rounded-full border border-gray-700 object-cover" />
                          {candidate.founderFit && (
                            <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1 rounded-full border-2 border-gray-950" title="Founder Fit">
                              <Zap className="w-3 h-3 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{candidate.name}</h3>
                          <p className="text-xs text-gray-400">{candidate.role}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-gray-900 text-gray-300 border border-gray-800">
                        {candidate.profile}
                      </span>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {candidate.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-gray-800/50 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700/50">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Mini visualization (Stats bars) */}
                    <div className="space-y-3 mb-6 bg-gray-900/30 p-4 rounded-xl border border-gray-800/50">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center w-20"><Code className="w-3 h-3 mr-1.5"/> Code</span>
                        <div className="flex-1 ml-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${candidate.stats.code}%` }}></div>
                        </div>
                        <span className="ml-3 text-[10px] text-gray-500 font-mono w-6 text-right">{candidate.stats.code}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center w-20"><LayoutGrid className="w-3 h-3 mr-1.5"/> Product</span>
                        <div className="flex-1 ml-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${candidate.stats.product}%` }}></div>
                        </div>
                        <span className="ml-3 text-[10px] text-gray-500 font-mono w-6 text-right">{candidate.stats.product}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 flex items-center w-20"><Users className="w-3 h-3 mr-1.5"/> Lead</span>
                        <div className="flex-1 ml-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${candidate.stats.leadership}%` }}></div>
                        </div>
                        <span className="ml-3 text-[10px] text-gray-500 font-mono w-6 text-right">{candidate.stats.leadership}</span>
                      </div>
                    </div>

                    {/* Metrics AQ/EQ */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800/60">
                      <div className="flex space-x-8">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">AQ Score</p>
                          <p className="text-lg font-mono font-semibold text-indigo-400">{candidate.aq}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">EQ Score</p>
                          <p className="text-lg font-mono font-semibold text-emerald-400">{candidate.eq}</p>
                        </div>
                      </div>
                      <div className={`p-2 rounded-full transition-colors ${selectedCandidate === candidate.id ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-gray-400 group-hover:bg-gray-800 group-hover:text-white'}`}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCandidates.length === 0 && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border border-dashed border-gray-800 rounded-2xl bg-gray-950/50">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4 border border-gray-800">
                    <Search className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No candidates found</h3>
                  <p className="text-sm text-gray-500 max-w-md">Adjust your scouting filters to broaden the search. Lowering the AQ/EQ minimums or removing the Founder Fit requirement might reveal hidden gems.</p>
                  <button 
                    onClick={() => { setFounderFit(false); setMinAQ(50); setMinEQ(50); setProfileFilter("All"); }}
                    className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details Overlay Panel (Shows when a candidate is selected) */}
          {selectedCandidate && (
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-gray-950 border-l border-gray-800 p-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Deep Dive</h3>
                <button onClick={() => setSelectedCandidate(null)} className="text-gray-500 hover:text-white p-1 rounded bg-gray-900 hover:bg-gray-800 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              {MOCK_CANDIDATES.filter(c => c.id === selectedCandidate).map(candidate => (
                <div key={candidate.id} className="space-y-8 animate-in fade-in duration-500">
                  <div className="text-center">
                    <img src={candidate.image} alt={candidate.name} className="w-24 h-24 rounded-full border-2 border-indigo-500/50 mx-auto mb-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] object-cover" />
                    <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
                    <p className="text-indigo-400 font-medium text-sm mt-1">{candidate.role}</p>
                  </div>
                  
                  {/* Growth Radar Component Integration */}
                  <div>
                    <GrowthRadar />
                  </div>

                  <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-800">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Core Competencies</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {candidate.name} exhibits strong {candidate.profile.toLowerCase()} traits. Over the 4-year longitudinal period, they demonstrated exceptional growth in technical capability and adaptability, maintaining high EQ under pressure.
                    </p>
                  </div>

                  <button className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4 fill-black" />
                    <span>Request Introduction</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
