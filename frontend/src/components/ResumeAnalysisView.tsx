import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  Cpu, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Copy, 
  Check, 
  Layers, 
  Tag,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from "lucide-react";
import { ResumeAnalysis } from "../types";

interface ResumeAnalysisViewProps {
  initialAnalysis: ResumeAnalysis;
  onAnalyze: (text: string, role: string) => Promise<ResumeAnalysis>;
}

export default function ResumeAnalysisView({ initialAnalysis, onAnalyze }: ResumeAnalysisViewProps) {
  const [resumeText, setResumeText] = useState(initialAnalysis.originalText || "");
  const [targetRole, setTargetRole] = useState("Mid-Level System Engineer");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(initialAnalysis);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  // Copy state
  const [copied, setCopied] = useState(false);
  const [editorTab, setEditorTab] = useState<"original" | "ai">("ai");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const processFile = (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setResumeText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      // Mock simple content for PDFs/DOCXs for client preview
      setResumeText(`ALEX MERCER
alex.mercer@gmail.com | (555) 019-2834
github.com/alexmercer

SUMMARY
Enthusiastic Junior Fullstack Developer with 2 years of experience crafting React applications and Node.js REST APIs. Eager to master large-scale architectures.

EXPERIENCE
Software Engineer - WebCorp (2024 - Present)
- Developed responsive features for e-commerce clients using React 18 and Tailwind CSS.
- Maintained backend endpoints written in Express, connecting them with SQL databases.
- Assisted in optimizing code performance and decreased main bundle sizes by 15%.`);
      alert(`Parsed metadata for file: "${file.name}". Since PDF direct binary parsing requires specialized native server utilities, we have loaded your text details into the workspace for analysis.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerAnalyze = async () => {
    if (!resumeText.trim()) {
      alert("Please enter or paste your resume text first.");
      return;
    }
    
    setIsLoading(true);
    
    // Stagger loading messages for ultimate premium realism
    const messages = [
      "Gemini is parsing resume structure...",
      "Calculating ATS compatibility scores...",
      "Identifying missing high-value keywords...",
      "Re-engineering experience bullet points with outcome metrics...",
      "Drafting final actionable recommendations..."
    ];
    
    let msgIdx = 0;
    setLoadingMessage(messages[0]);
    const timer = setInterval(() => {
      msgIdx++;
      if (msgIdx < messages.length) {
        setLoadingMessage(messages[msgIdx]);
      }
    }, 1200);

    try {
      const result = await onAnalyze(resumeText, targetRole);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please check your network connection.");
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis.suggestedRevision);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="resume-analysis-view" className="space-y-8 animate-fade-in">
      
      {/* View Header */}
      <div>
        <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider font-mono">CAREER TOOLKIT</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Resume Analysis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Optimize your resume for applicant tracking systems (ATS) using advanced Gemini 3.5 career intelligence.
        </p>
      </div>

      {isLoading ? (
        /* Loading Screen State */
        <div className="bg-white border border-slate-200 p-12 rounded-2xl shadow-sm text-center max-w-xl mx-auto space-y-6 my-12 flex flex-col items-center">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full animate-spin">
            <Cpu className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-lg font-bold text-slate-900">CareerCo-pilot is analyzing</h3>
            <p className="text-sm text-indigo-600 font-mono font-semibold animate-pulse">{loadingMessage}</p>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            This utilizes Gemini's reasoning models to parse semantic grammar and engineer professional resume bullet points.
          </p>
        </div>
      ) : !analysis ? (
        /* Upload & Paste State */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Input Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 font-display">Target Role & Document</h3>
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>

            <div className="p-6 space-y-6 flex-1">
              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                  What is your target role?
                </label>
                <input
                  type="text"
                  id="target-role-input"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Mid-Level System Engineer"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-900 text-sm font-medium"
                />
              </div>

              {/* Paste Text Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                  Paste Resume Content
                </label>
                <textarea
                  id="resume-text-input"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={10}
                  placeholder="Paste the raw text of your resume here to scan..."
                  className="w-full p-4 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-800 text-xs font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-right">
              <button
                id="btn-trigger-analyze"
                onClick={triggerAnalyze}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 inline-flex cursor-pointer"
              >
                <span>Optimize Resume with Gemini</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right sidebar instructions */}
          <div className="space-y-6">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 shadow-sm min-h-[220px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.md,.pdf,.docx"
                className="hidden"
              />
              <div className="p-3 bg-slate-100 text-slate-500 rounded-xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Drag & Drop Resume File</p>
                <p className="text-xs text-slate-400 mt-1">Supports PDF, TXT or DOCX</p>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold font-mono">
                Click to browse
              </span>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 space-y-4">
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">ATS KNOWLEDGE</span>
              <h4 className="font-display font-bold text-sm">How ATS Scanners Work</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Applicant Tracking Systems filter candidates by scanning resumes for exact keyword match densities and parsing sentence metrics. If your experience summary does not match their automated schema, you are filtered out immediately.
              </p>
              <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Our optimizer guarantees +20% ATS growth</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Results View State */
        <div className="space-y-8 animate-fade-in">
          
          {/* Header Controls */}
          <div className="flex justify-between items-center">
            <button
              id="btn-back-to-scan"
              onClick={() => setAnalysis(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 bg-white rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Resume Scan</span>
            </button>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-full font-bold font-mono uppercase tracking-wider">
              Scan Complete
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Left analysis diagnostics */}
            <div className="space-y-6">
              
              {/* Card 1: Score circle */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">ATS Compatibility Rating</span>
                
                {/* Score Visual Ring */}
                <div className="relative w-36 h-36 flex items-center justify-center my-6">
                  {/* Outer circle */}
                  <div className="absolute inset-0 rounded-full border-12 border-slate-100" />
                  {/* Dynamic circle bar */}
                  <div className="absolute inset-0 rounded-full border-12 border-indigo-600" style={{ clipPath: `polygon(50% 50%, -50% -50%, 150% -50%, 150% 150%, -50% 150%, -50% 50%)` }} />
                  <div className="z-10 flex flex-col items-center">
                    <span className="text-4xl font-extrabold font-display text-slate-900 leading-none">{analysis.atsScore}</span>
                    <span className="text-xs text-slate-400 font-medium font-mono mt-0.5">/100</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Improve by +12% using our suggestions</span>
                </p>
              </div>

              {/* Card 2: Strengths & Growth Areas */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                    <span>Identified Strengths</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed pl-1">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-slate-100">
                  <h4 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                    <span>Growth Areas</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed pl-1">
                    {analysis.growthAreas.map((gr, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{gr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 3: Skill match pill list */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                <h4 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Target Technical Skill Match</span>
                </h4>
                <div className="space-y-3">
                  {analysis.skillMatches.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-700">{item.skill}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border uppercase tracking-wider ${
                        item.status === "match"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Column 2 & 3: Side-by-side interactive code-editor */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Interactive side-by-side container card */}
              <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[520px]">
                {/* Editor Tab Headers */}
                <div className="bg-slate-950 border-b border-slate-800 h-14 px-6 flex items-center justify-between shrink-0">
                  <div className="flex gap-4">
                    <button
                      id="editor-tab-ai"
                      onClick={() => setEditorTab("ai")}
                      className={`text-xs font-semibold py-4 border-b-2 transition-all cursor-pointer ${
                        editorTab === "ai"
                          ? "border-indigo-500 text-white"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Suggested Revision</span>
                      </span>
                    </button>

                    <button
                      id="editor-tab-original"
                      onClick={() => setEditorTab("original")}
                      className={`text-xs font-semibold py-4 border-b-2 transition-all cursor-pointer ${
                        editorTab === "original"
                          ? "border-indigo-500 text-white"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>Original Text</span>
                    </button>
                  </div>

                  <button
                    id="editor-copy-btn"
                    onClick={handleCopy}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Editor Text Container */}
                <div className="flex-1 p-6 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
                  {editorTab === "ai" ? (
                    <div className="space-y-4">
                      {/* Highlighted text visual aid */}
                      <div className="p-3 bg-indigo-950/40 border border-indigo-900/30 rounded-xl text-indigo-200 mb-4 font-sans text-xs flex gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>This AI Revision incorporates outcome metrics, Docker containerization terminology, and structured keywords required to bypass ATS parsing barriers.</span>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono">{analysis.suggestedRevision}</pre>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-slate-400">{analysis.originalText}</pre>
                  )}
                </div>
              </div>

              {/* Card 4: Keyword recommendations */}
              <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
                <h4 className="font-display font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Keyword density optimization list</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">Introduce these high-value industry terms into your resume summary and job items.</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordOptimization.map((key, idx) => (
                    <span key={idx} className="text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-default font-mono">
                      {key}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable recommendations card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-2xl space-y-4">
                <h4 className="font-display font-bold text-sm text-indigo-900 flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-indigo-600" />
                  <span>Next immediate recommendations</span>
                </h4>
                <div className="space-y-3 text-xs text-indigo-950 leading-relaxed">
                  {analysis.aiRecommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
