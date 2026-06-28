import React, { useState, useEffect } from "react";
import { 
  X, 
  Sparkles, 
  Loader2, 
  Clipboard, 
  Check, 
  ChevronRight, 
  BookOpen, 
  AlertTriangle, 
  Lightbulb,
  CheckCircle2
} from "lucide-react";
import { apiFetch } from "../lib/api";

interface JobFitExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  company: string;
  location?: string;
  salary?: string;
  notes?: string;
}

export default function JobFitExplainerModal({
  isOpen,
  onClose,
  role,
  company,
  location,
  salary,
  notes
}: JobFitExplainerModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    compatibility: string;
    matchScore: number;
    gapAnalysis: string[];
    tailoredBullets: string[];
    targetTips: string[];
  } | null>(null);
  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAnalysis();
    }
  }, [isOpen, role, company]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await apiFetch("/api/jobs/explain-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, location, salary, notes })
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch job match explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div 
        id="job-fit-modal"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Gemini AI Compatibility Audit</span>
            </span>
            <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
              {role}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {company} • {location || "Remote"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner Content scrollable area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3.5">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="font-mono text-xs text-slate-500 animate-pulse">
                Running profile comparison matching scanner...
              </p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              
              {/* Compatibility Score card */}
              <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100/60 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider">Overall Match Level</span>
                  <h4 className="font-display text-base font-bold text-slate-900">
                    {data.compatibility}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Calculated by analyzing your core strengths against requirement points.
                  </p>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-indigo-500 font-display font-black text-lg text-indigo-600 shadow-md">
                  {data.matchScore}%
                </div>
              </div>

              {/* Skills Gaps */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Missing Skills & Requirements Gaps</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {data.gapAnalysis.map((gap, idx) => (
                    <div 
                      key={idx} 
                      className="bg-red-50/50 border border-red-100 p-3 rounded-xl flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span className="text-xs font-medium text-red-800 leading-tight">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom-tailored experience bullets */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Custom-Engineered Resume Bullet Points</span>
                </h5>
                <p className="text-xs text-slate-400 mt-1">
                  Replace some of your current resume bullet points with these high-impact accomplishments, specifically optimized to trigger this role's ATS scanner:
                </p>
                
                <div className="space-y-3">
                  {data.tailoredBullets.map((bullet, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-50 hover:bg-slate-100/50 border border-slate-100 p-4 rounded-xl flex justify-between items-start gap-4 group transition-colors"
                    >
                      <div className="flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-relaxed font-sans">{bullet}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(bullet, idx)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 bg-white hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Clipboard className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[10px] font-bold font-mono uppercase px-0.5">
                          {copiedIndex === idx ? "Copied" : "Copy"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Interview Tips */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h5 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-indigo-500" />
                  <span>{company} Interview Tactics</span>
                </h5>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 space-y-3">
                  {data.targetTips.map((tip, idx) => (
                    <div key={idx} className="flex gap-3 items-start text-xs text-slate-600 leading-relaxed">
                      <span className="font-mono text-indigo-500 font-bold shrink-0">0{idx + 1}.</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 font-mono text-xs">
              Comparison scanner details failed to load.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all cursor-pointer shadow-sm shadow-slate-900/10"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
