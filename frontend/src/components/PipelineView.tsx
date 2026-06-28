import React, { useState } from "react";
import { 
  Layers, 
  Plus, 
  MapPin, 
  DollarSign, 
  Calendar, 
  FileText, 
  X, 
  Trash2, 
  Check, 
  Copy, 
  Sparkles, 
  Cpu, 
  Clock,
  ExternalLink 
} from "lucide-react";
import { PipelineJob } from "../types";
import JobFitExplainerModal from "./JobFitExplainerModal";

interface PipelineViewProps {
  initialJobs: PipelineJob[];
  onAddJob: (role: string, company: string, salary: string, location: string, notes?: string) => Promise<PipelineJob>;
  onMoveJob: (id: string, column: PipelineJob["column"], notes?: string) => Promise<PipelineJob>;
  onDeleteJob: (id: string) => Promise<boolean>;
  onGenerateCoverLetter: (id: string) => Promise<string>;
}

export default function PipelineView({ 
  initialJobs, 
  onAddJob, 
  onMoveJob, 
  onDeleteJob, 
  onGenerateCoverLetter 
}: PipelineViewProps) {
  const [jobs, setJobs] = useState<PipelineJob[]>(initialJobs);
  const [selectedJob, setSelectedJob] = useState<PipelineJob | null>(null);
  
  // Adding Job Modal Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // AI Cover Letter State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [letterCopied, setLetterCopied] = useState(false);

  // AI Fit Explainer State
  const [fitExplainerOpen, setFitExplainerOpen] = useState(false);

  const columns: { id: PipelineJob["column"]; label: string; color: string; bg: string }[] = [
    { id: "saved", label: "Saved Match", color: "text-blue-700 bg-blue-50 border-blue-100", bg: "bg-blue-500/10" },
    { id: "applied", label: "Applied", color: "text-purple-700 bg-purple-50 border-purple-100", bg: "bg-purple-500/10" },
    { id: "interviewing", label: "Interviewing", color: "text-amber-700 bg-amber-50 border-amber-100", bg: "bg-amber-500/10" },
    { id: "offered", label: "Offered", color: "text-emerald-700 bg-emerald-50 border-emerald-100", bg: "bg-emerald-500/10" }
  ];

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;
    try {
      const added = await onAddJob(role, company, salary, location, notes);
      setJobs((prev) => [...prev, added]);
      setRole("");
      setCompany("");
      setSalary("");
      setLocation("");
      setNotes("");
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveJobColumn = async (id: string, col: PipelineJob["column"]) => {
    try {
      const updated = await onMoveJob(id, col);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
      if (selectedJob && selectedJob.id === id) {
        setSelectedJob(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJobClick = async (id: string) => {
    if (!confirm("Are you sure you want to remove this job from your progress pipeline?")) return;
    try {
      const success = await onDeleteJob(id);
      if (success) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setSelectedJob(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateAIResponseLetter = async () => {
    if (!selectedJob) return;
    setIsAiLoading(true);
    try {
      const letter = await onGenerateCoverLetter(selectedJob.id);
      // Update local state job as well
      const updatedJob = { ...selectedJob, coverLetter: letter };
      setJobs((prev) => prev.map((j) => (j.id === selectedJob.id ? updatedJob : j)));
      setSelectedJob(updatedJob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const copyLetterToClipboard = () => {
    if (selectedJob?.coverLetter) {
      navigator.clipboard.writeText(selectedJob.coverLetter);
      setLetterCopied(true);
      setTimeout(() => setLetterCopied(false), 2000);
    }
  };

  return (
    <div id="pipeline-view" className="space-y-8 animate-fade-in relative">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider font-mono">APPLICATION ENGINE</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Progress Tracker
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your target tech applications in a full Kanban board workspace.
          </p>
        </div>

        <button
          id="btn-open-add-job"
          onClick={() => setShowAddForm(true)}
          className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-md shadow-slate-950/10 flex items-center justify-center gap-1.5 text-sm transition-all cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Match Card</span>
        </button>
      </div>

      {/* Add Job Drawer Overlay Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-display font-bold text-slate-900 text-base">Add New Target Job Match</h3>
              <button 
                id="btn-close-add-modal"
                onClick={() => setShowAddForm(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">Job Title *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">Company Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Vercel"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">Salary Range</label>
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $160k - $190k"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">Initial Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Insert links or job details..."
                  className="w-full p-4 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-800 text-xs"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-submit-add-job"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  Add Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board Columns Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colJobs = jobs.filter((j) => j.column === col.id);
          return (
            <div key={col.id} className="bg-slate-100 rounded-2xl border border-slate-200/50 p-4.5 space-y-4 min-h-[500px]">
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                <span className={`px-3 py-1 border rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-lg border border-slate-200">
                  {colJobs.length}
                </span>
              </div>

              {/* Job Card Lists */}
              <div className="space-y-3">
                {colJobs.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50/50 select-none">
                    No cards here
                  </div>
                ) : (
                  colJobs.map((job) => (
                    <button
                      key={job.id}
                      id={`pipeline-job-card-${job.id}`}
                      onClick={() => setSelectedJob(job)}
                      className="w-full text-left bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group space-y-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                          {job.role}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500 mt-1">{job.company}</p>
                      </div>

                      <div className="flex flex-col gap-1 text-[10px] font-semibold text-slate-400">
                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            <span>{job.salary}</span>
                          </span>
                        )}
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{job.location}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-[9px] text-slate-400 mt-1">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          <span>Added: {job.dateAdded}</span>
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Job Detail Modal Drawer overlay */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-100 overflow-hidden animate-scale-up flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold font-display text-sm">
                  {selectedJob.company[0]}
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base leading-none mb-1">{selectedJob.role}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-none">{selectedJob.company}</p>
                </div>
              </div>
              <button 
                id="btn-close-detail-modal"
                onClick={() => setSelectedJob(null)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                {/* Column mover */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Pipeline Status</label>
                  <div className="flex flex-wrap gap-1.5">
                    {columns.map((c) => {
                      const isCurrent = selectedJob.column === c.id;
                      return (
                        <button
                          key={c.id}
                          id={`btn-move-col-${c.id}`}
                          onClick={() => handleMoveJobColumn(selectedJob.id, c.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer uppercase font-mono tracking-wider ${
                            isCurrent
                              ? "bg-slate-900 border-slate-900 text-white"
                              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-500"
                          }`}
                        >
                          {c.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Meta details */}
                <div className="space-y-2 text-xs text-slate-600 font-semibold pl-1">
                  <p className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>Est Salary: <strong className="text-slate-900">{selectedJob.salary || "N/A"}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Location: <strong className="text-slate-900">{selectedJob.location || "N/A"}</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                    <Clock className="w-4 h-4 text-slate-300" />
                    <span>Scanned Date: {selectedJob.dateAdded}</span>
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      id="btn-trigger-fit-explainer"
                      onClick={() => setFitExplainerOpen(true)}
                      className="w-full bg-indigo-50 hover:bg-indigo-100/60 border border-indigo-100 text-indigo-700 rounded-xl py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scan AI Fit Match</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes content */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Job notes & requirements</label>
                <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-mono">
                  {selectedJob.notes || "No notes appended. Select 'Edit' to update descriptions, link parameters, or specific team feedback."}
                </p>
              </div>

              {/* AI Cover Letter block */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
                    <span className="text-sm font-bold text-slate-900">Tailored AI Cover Letter</span>
                  </div>

                  {selectedJob.coverLetter && (
                    <button
                      id="btn-copy-cover-letter"
                      onClick={copyLetterToClipboard}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold border border-slate-200"
                    >
                      {letterCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{letterCopied ? "Copied" : "Copy Letter"}</span>
                    </button>
                  )}
                </div>

                {isAiLoading ? (
                  <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-150 space-y-3 flex flex-col items-center">
                    <Cpu className="w-8 h-8 text-indigo-600 animate-spin" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Gemini is drafting cover letter...</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Matching skills to target company values</p>
                    </div>
                  </div>
                ) : selectedJob.coverLetter ? (
                  <pre className="text-xs text-slate-700 bg-slate-950/20 p-5 rounded-xl border border-slate-100/50 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedJob.coverLetter}
                  </pre>
                ) : (
                  <div className="p-8 text-center bg-indigo-50/50 rounded-xl border border-indigo-100/40 space-y-4 flex flex-col items-center">
                    <div className="p-2.5 bg-indigo-100/60 rounded-xl text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-950">No cover letter created</p>
                      <p className="text-[10px] text-slate-500">Draft a hyper-personalized professional pitch letter tailored to this role using your scanned resume details.</p>
                    </div>
                    <button
                      type="button"
                      id="btn-generate-ai-letter"
                      onClick={generateAIResponseLetter}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Draft with Gemini AI</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <button
                id="btn-delete-job"
                onClick={() => handleDeleteJobClick(selectedJob.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-red-200/55 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Card</span>
              </button>

              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Fit Explainer Modal overlay */}
      {selectedJob && (
        <JobFitExplainerModal
          isOpen={fitExplainerOpen}
          onClose={() => setFitExplainerOpen(false)}
          role={selectedJob.role}
          company={selectedJob.company}
          location={selectedJob.location}
          salary={selectedJob.salary}
          notes={selectedJob.notes}
        />
      )}

    </div>
  );
}
