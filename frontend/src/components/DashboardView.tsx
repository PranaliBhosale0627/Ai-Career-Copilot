import React, { useState } from "react";
import { 
  CheckCircle, 
  Layers, 
  Milestone, 
  ArrowUpRight, 
  Award, 
  ExternalLink, 
  Bookmark, 
  TrendingUp, 
  ChevronRight,
  Briefcase,
  Sparkles
} from "lucide-react";
import { UserProfile, JobMatch } from "../types";
import JobFitExplainerModal from "./JobFitExplainerModal";

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (view: string) => void;
  onAddJobToPipeline: (role: string, company: string, salary: string, location: string) => void;
}

export default function DashboardView({ user, onNavigate, onAddJobToPipeline }: DashboardViewProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  // AI Job Fit Explainer States
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [selectedExplainerJob, setSelectedExplainerJob] = useState<JobMatch | null>(null);

  // Top Job Matches static data
  const jobMatches: JobMatch[] = [
    {
      id: "m1",
      role: "Senior Fullstack Engineer",
      company: "Vercel",
      logo: "V",
      matchScore: 94,
      missingSkills: ["Docker", "Redis"],
      salary: "$160k - $190k",
      location: "Remote"
    },
    {
      id: "m2",
      role: "ML Platform Engineer",
      company: "Anthropic",
      logo: "A",
      matchScore: 88,
      missingSkills: ["System Design", "Kubernetes"],
      salary: "$180k - $220k",
      location: "San Francisco, CA"
    },
    {
      id: "m3",
      role: "Frontend Specialist",
      company: "Linear",
      logo: "L",
      matchScore: 85,
      missingSkills: ["Redis"],
      salary: "$155k - $180k",
      location: "Remote (Global)"
    },
    {
      id: "m4",
      role: "Developer Relations",
      company: "Stripe",
      logo: "S",
      matchScore: 82,
      missingSkills: ["CI/CD Platforms"],
      salary: "$140k - $175k",
      location: "New York, NY"
    }
  ];

  // Growth Chart Data Points (Month, Employability Score out of 100)
  const growthData = [
    { x: 30, y: 150, month: "Jan", score: 55 },
    { x: 120, y: 130, month: "Feb", score: 60 },
    { x: 210, y: 110, month: "Mar", score: 68 },
    { x: 300, y: 90, month: "Apr", score: 72 },
    { x: 390, y: 70, month: "May", score: 78 },
    { x: 480, y: 50, month: "Jun", score: 85 }
  ];

  const currentDateString = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div id="dashboard-view" className="space-y-8 animate-fade-in">
      
      {/* 1. Welcoming Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider font-mono">WORKSPACE HOME</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Good Morning, {user.name.split(" ")[0]}!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Today is {currentDateString}. Your profile optimization status is looking strong.
          </p>
        </div>
        
        {/* Next milestone box */}
        <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3.5 max-w-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-600 font-bold uppercase font-mono leading-none mb-1">Upcoming Goal</p>
            <p className="text-xs font-semibold text-slate-800 leading-tight">Docker & Kubernetes Review</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Part of Mid-Level System Engineer path</p>
          </div>
        </div>
      </div>

      {/* 2. Core Stats Grid (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: ATS Compatibility Score */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase font-mono">ATS Resume Score</span>
              <p className="text-3xl font-bold text-slate-950 font-display mt-2 group-hover:text-indigo-600 transition-colors">
                78<span className="text-slate-400 text-lg font-normal">/100</span>
              </p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this month
            </span>
            <button 
              id="dash-link-resume"
              onClick={() => onNavigate("resume")}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer"
            >
              <span>Scan Again</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Active Job Matches */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Job Matches</span>
              <p className="text-3xl font-bold text-slate-950 font-display mt-2">
                24 <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4 new</span>
              </p>
            </div>
            <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Tailored for your interests</span>
            <button 
              id="dash-link-pipeline"
              onClick={() => onNavigate("pipeline")}
              className="font-medium text-slate-500 hover:text-sky-600 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Skills mastered progress */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Skills Mastered</span>
              <p className="text-3xl font-bold text-slate-950 font-display mt-2">
                12<span className="text-slate-400 text-lg font-normal">/18</span>
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold leading-none">
              <span>Path Completion</span>
              <span>66%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[66%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Card 4: Employability Level */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Growth Level</span>
              <p className="text-3xl font-bold text-slate-950 font-display mt-2">
                Elite II
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Top 5% of web candidates</span>
          </div>
        </div>
      </div>

      {/* 3. Employability Growth SVG Chart & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: SVG Growth Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Employability growth</h3>
            <p className="text-xs text-slate-400 mt-1">Track your AI-profile score improvements across your application cycles.</p>
          </div>

          {/* Interactive SVG Chart Container */}
          <div className="mt-6 relative h-48 w-full border-b border-l border-slate-100 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 510 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              <line x1="0" y1="45" x2="510" y2="45" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="510" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="135" x2="510" y2="135" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />

              {/* Shaded Area */}
              <path
                d="M 30,180 L 30,150 L 120,130 L 210,110 L 300,90 L 390,70 L 480,50 L 480,180 Z"
                fill="url(#chart-grad)"
              />

              {/* Line Path */}
              <path
                d="M 30,150 L 120,130 L 210,110 L 300,90 L 390,70 L 480,50"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {growthData.map((pt, index) => (
                <circle
                  key={index}
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint === index ? "7" : "4.5"}
                  fill={hoveredPoint === index ? "#4f46e5" : "#ffffff"}
                  stroke="#4f46e5"
                  strokeWidth="3"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Custom SVG Tooltip */}
            {hoveredPoint !== null && (
              <div 
                className="absolute bg-slate-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl pointer-events-none transition-all duration-150 border border-slate-800 flex flex-col font-mono"
                style={{
                  left: `${growthData[hoveredPoint].x - 45}px`,
                  bottom: `${180 - growthData[hoveredPoint].y + 12}px`
                }}
              >
                <span className="text-slate-400 text-[10px] font-semibold">{growthData[hoveredPoint].month} Audit</span>
                <span className="font-bold text-white text-xs mt-0.5">Score: {growthData[hoveredPoint].score}/100</span>
              </div>
            )}
          </div>

          {/* Month Labels row */}
          <div className="flex justify-between px-3 mt-3 text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Right Side: Pro Recommendations */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">CO-PILOT ADVICE</span>
            <h3 className="font-display text-lg font-bold">Accelerate your progress</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Based on your resume, you have high proficiency in frontend React architectures. To unlock Senior matching roles, focus on mastering caching and deployment orchestration next.
            </p>
          </div>

          <div className="space-y-3.5 mt-6">
            <button 
              id="dash-rec-roadmap"
              onClick={() => onNavigate("roadmap")}
              className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-between px-4 transition-all cursor-pointer"
            >
              <span>Practice Kubernetes Skills</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>

            <button 
              id="dash-rec-resume"
              onClick={() => onNavigate("resume")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-between px-4 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <span>Scan New Resume</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Top Job Matches for Your Profile Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Top Job Matches for Your Profile</h3>
            <p className="text-xs text-slate-400 mt-1">These positions match your career interests and skill profile with high compatibility.</p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-full border border-indigo-100">
            Real-time Scanned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-mono text-slate-400 font-bold tracking-wider uppercase">
                <th className="py-4 px-6">Role & Company</th>
                <th className="py-4 px-4 text-center">Match Score</th>
                <th className="py-4 px-6">Missing Skills</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {jobMatches.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-sm tracking-tight shrink-0 shadow-sm">
                        {job.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 leading-none mb-1">{job.role}</div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                          <span>{job.company}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{job.location}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-indigo-600 font-semibold">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className={`inline-flex items-center justify-center font-mono font-bold text-xs rounded-full w-12 h-8 leading-none ${
                      job.matchScore >= 90 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    }`}>
                      {job.matchScore}%
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {job.missingSkills.map((sk, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right space-x-2">
                    <button
                      id={`btn-explain-${job.id}`}
                      onClick={() => {
                        setSelectedExplainerJob(job);
                        setExplainerOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-100/60 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explain Fit</span>
                    </button>
                    <button
                      id={`btn-track-${job.id}`}
                      onClick={() => {
                        onAddJobToPipeline(job.role, job.company, job.salary, job.location);
                        alert(`Added ${job.role} at ${job.company} to your Progress Tracker pipeline!`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-sm shadow-slate-950/10"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Job Fit Explainer Slide-over Modal */}
      {selectedExplainerJob && (
        <JobFitExplainerModal
          isOpen={explainerOpen}
          onClose={() => {
            setExplainerOpen(false);
            setSelectedExplainerJob(null);
          }}
          role={selectedExplainerJob.role}
          company={selectedExplainerJob.company}
          location={selectedExplainerJob.location}
          salary={selectedExplainerJob.salary}
          notes={`Recommended match with ${selectedExplainerJob.matchScore}% system alignment score.`}
        />
      )}

    </div>
  );
}
