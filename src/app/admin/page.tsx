"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Briefcase, Activity, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        setLeads(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Activity className="h-8 w-8 text-blue-600" />
          Global Admin Dashboard
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Monitor platform metrics and market intelligence leads in real-time.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Universities</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Users className="h-8 w-8" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students Onboarded</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">42</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex items-center">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Briefcase className="h-8 w-8" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Market Leads</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{loading ? "..." : leads.length}</p>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Market Leads Intelligence</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Live Sync
          </span>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-10 flex flex-col items-center justify-center text-red-500">
              <AlertCircle className="h-10 w-10 mb-3" />
              <p>Failed to load leads: {error}</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400">
              <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No market leads found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {leads.map((lead, idx) => (
                  <tr key={lead.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {lead.job_title || lead.title || 'Unknown Title'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      {lead.company || lead.company_name || 'Unknown Company'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                        {lead.ai_score !== undefined ? lead.ai_score : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
