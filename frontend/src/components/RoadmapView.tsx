import React, { useState } from "react";
import { 
  Milestone, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Send, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  BookOpen,
  Cpu,
  Award,
  TrendingUp,
  RotateCcw,
  Check,
  AlertCircle,
  ArrowRightCircle,
  HelpCircle,
  Loader2
} from "lucide-react";
import { RoadmapStep, ChatMessage } from "../types";
import { apiFetch } from "../lib/api";

interface RoadmapViewProps {
  initialSteps: RoadmapStep[];
  onToggleSkill: (stepId: string, skillId: string) => Promise<RoadmapStep[]>;
  onSendCoachMessage: (messages: ChatMessage[], role: string) => Promise<string>;
}

export default function RoadmapView({ initialSteps, onToggleSkill, onSendCoachMessage }: RoadmapViewProps) {
  const [steps, setSteps] = useState<RoadmapStep[]>(initialSteps);
  const [selectedStepId, setSelectedStepId] = useState<string>("step-2"); // Mid-Level is active
  
  // Coach states
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isCoachLoading, setIsCoachLoading] = useState(false);

  // New AI coach states
  const [showReport, setShowReport] = useState(false);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [reportData, setReportData] = useState<{
    score: number;
    overallRating: string;
    strengths: string[];
    weaknesses: string[];
    exemplaryAnswers: string;
    actionPlan: string[];
  } | null>(null);

  const [hintLoading, setHintLoading] = useState(false);
  const [activeHint, setActiveHint] = useState("");

  const selectedStep = steps.find((s) => s.id === selectedStepId) || steps[1];

  const handleGetHint = async () => {
    if (messages.length === 0) return;
    setHintLoading(true);
    setActiveHint("");
    try {
      const res = await apiFetch("/api/coach/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, activeRole: selectedStep.title })
      });
      const data = await res.json();
      setActiveHint(data.hintText);
    } catch (err) {
      console.error("Failed to generate hint:", err);
      setActiveHint("💡 Think about the main bottlenecks, database scaling strategies, and explain your concrete steps using the STAR framework!");
    } finally {
      setHintLoading(false);
    }
  };

  const handleGetReview = async () => {
    if (messages.length === 0) return;
    setIsReviewLoading(true);
    setShowReport(true);
    try {
      const res = await apiFetch("/api/coach/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, activeRole: selectedStep.title })
      });
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error("Failed to generate interview review:", err);
    } finally {
      setIsReviewLoading(false);
    }
  };

  // Calculate total progress
  const totalSkills = steps.reduce((acc, step) => acc + step.skills.length, 0);
  const completedSkills = steps.reduce((acc, step) => acc + step.skills.filter(s => s.completed).length, 0);
  const progressPercent = Math.round((completedSkills / totalSkills) * 100);

  const handleToggleSkill = async (stepId: string, skillId: string) => {
    try {
      const updatedSteps = await onToggleSkill(stepId, skillId);
      setSteps(updatedSteps);
    } catch (err) {
      console.error(err);
    }
  };

  const startCoachChat = async () => {
    setChatActive(true);
    setIsCoachLoading(true);
    
    const initialPrompt = `Hello Alex! I am your AI Interview Coach. Let's practice for the role of ${selectedStep.title}. Can you describe your experience designing or working with microservices or REST APIs?`;
    
    const initialMsg: ChatMessage = {
      id: "coach-1",
      sender: "coach",
      text: initialPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    
    setMessages([initialMsg]);
    setIsCoachLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: "user_" + Date.now(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage("");
    setIsCoachLoading(true);

    try {
      const reply = await onSendCoachMessage(newHistory, selectedStep.title);
      const coachMsg: ChatMessage = {
        id: "coach_" + Date.now(),
        sender: "coach",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCoachLoading(false);
    }
  };

  return (
    <div id="roadmap-view" className="space-y-8 animate-fade-in">
      
      {/* View Header */}
      <div>
        <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider font-mono">CAREER DIRECTIVE</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Career Roadmap
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sequential tech milestones from your entry level to elite solutions architect status.
        </p>
      </div>

      {/* Progress banner */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold font-mono">
          <span>Junior Dev to Senior Solutions Architect path</span>
          <span className="text-indigo-600 font-bold">{progressPercent}% Mastered</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-sky-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: Vertical Steps + Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Timeline representation card */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
            <h3 className="font-display text-base font-bold text-slate-900 mb-6">Your Milestone Steps</h3>
            
            <div className="space-y-6 relative pl-4 border-l border-slate-100">
              {steps.map((step) => {
                const isActive = step.id === selectedStepId;
                const isCompleted = step.status === "completed";
                const isLocked = step.status === "locked";
                
                return (
                  <button
                    key={step.id}
                    id={`roadmap-step-card-${step.id}`}
                    onClick={() => setSelectedStepId(step.id)}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-200 flex items-start gap-4 relative group cursor-pointer ${
                      isActive
                        ? "bg-indigo-50/50 border-indigo-200 shadow-sm"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    {/* Circle marker on line */}
                    <div className={`absolute -left-[27px] w-5 h-5 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${
                      isCompleted 
                        ? "bg-emerald-500" 
                        : isActive 
                        ? "bg-indigo-600 animate-pulse" 
                        : "bg-slate-200"
                    }`} />

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Milestone {step.stepNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[9px] uppercase tracking-wider ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : isActive
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}>
                          {step.role}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed truncate max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed step focus card */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider">Step Details</span>
              <h3 className="font-display text-lg font-bold text-slate-900 mt-1">{selectedStep.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">{selectedStep.description}</p>
            </div>

            {/* Checklist of technical skills */}
            <div className="pt-5 border-t border-slate-100">
              <h4 className="font-display font-bold text-sm text-slate-900 mb-4">Technical Skill Checklist</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {selectedStep.skills.map((skill) => (
                  <button
                    key={skill.id}
                    id={`skill-toggle-${skill.id}`}
                    onClick={() => handleToggleSkill(selectedStep.id, skill.id)}
                    className="flex items-center gap-3 p-3 border border-slate-100 bg-slate-50/40 rounded-xl hover:border-slate-200 text-left transition-all group"
                  >
                    {skill.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-indigo-600 shrink-0 transition-colors" />
                    )}
                    <span className={`text-xs font-semibold ${skill.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                      {skill.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reference Resources */}
            <div className="pt-5 border-t border-slate-100">
              <h4 className="font-display font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
                <span>Recommended Resources</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedStep.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    className="p-4 border border-slate-100 rounded-xl hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/10 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">{res.type}</span>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mt-0.5">{res.title}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Column 3: AI Interview Coach widget */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800 flex flex-col justify-between h-[640px] overflow-hidden">
          <div className="space-y-1 shrink-0 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">REAL AI ASSISTANT</span>
            <div className="flex justify-between items-center">
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                <span>Interview Coach</span>
              </h3>
              <span className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full font-mono uppercase border border-indigo-500/20">
                {showReport ? "REPORT" : "ACTIVE"}
              </span>
            </div>
          </div>

          {showReport ? (
            /* Report Screen */
            <div className="flex-1 flex flex-col justify-between overflow-hidden my-4">
              {isReviewLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin animate-spin-slow" />
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    Analyzing interview response transcript, scoring answers, and drafting tailored expert solutions...
                  </p>
                </div>
              ) : reportData ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Assessment Tabs & Stats */}
                  <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
                    {/* Top Score Banner */}
                    <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Interview Score</p>
                        <h4 className="font-display text-xs font-bold text-indigo-400 leading-tight">
                          {reportData.overallRating}
                        </h4>
                      </div>
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 bg-indigo-950 flex items-center justify-center font-display font-bold text-sm text-indigo-400 shrink-0">
                        {reportData.score}%
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Key Strengths
                      </h5>
                      <ul className="space-y-1.5 pl-1.5">
                        {reportData.strengths.map((st, idx) => (
                          <li key={idx} className="text-slate-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full">
                            {st}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gaps */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-[10px] text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Gaps & Improvements
                      </h5>
                      <ul className="space-y-1.5 pl-1.5">
                        {reportData.weaknesses.map((wk, idx) => (
                          <li key={idx} className="text-slate-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-amber-500 before:rounded-full">
                            {wk}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Plan */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-[10px] text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <ArrowRightCircle className="w-3.5 h-3.5" /> Custom Prep Plan
                      </h5>
                      <ul className="space-y-1.5 pl-1.5">
                        {reportData.actionPlan.map((ap, idx) => (
                          <li key={idx} className="text-slate-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-indigo-500 before:rounded-full">
                            {ap}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exemplary Guide */}
                    <div className="space-y-2 pt-3 border-t border-slate-800">
                      <h5 className="font-bold text-[10px] text-indigo-300 uppercase tracking-wider font-mono">💡 Exemplary Answer Guide</h5>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed text-slate-300 whitespace-pre-line font-sans">
                        {reportData.exemplaryAnswers}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <button
                    onClick={() => {
                      setShowReport(false);
                      setReportData(null);
                      setChatActive(false);
                      setMessages([]);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-4"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Restart Practice Interview</span>
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-500">Failed to compile report.</div>
              )}
            </div>
          ) : chatActive ? (
            /* Active Chat screen */
            <div className="flex-1 flex flex-col justify-between overflow-hidden my-4">
              <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2 font-sans text-xs">
                {messages.map((m) => {
                  const isCoach = m.sender === "coach";
                  return (
                    <div key={m.id} className={`flex flex-col ${isCoach ? "items-start" : "items-end"}`}>
                      <div className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                        isCoach 
                          ? "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60" 
                          : "bg-indigo-600 text-white rounded-tr-none"
                      }`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 font-mono">{m.timestamp}</span>
                    </div>
                  );
                })}
                {isCoachLoading && (
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span>Coach is analyzing...</span>
                  </div>
                )}

                {/* Hints panel */}
                {activeHint && (
                  <div className="bg-indigo-950/80 border border-indigo-500/20 rounded-xl p-3 mt-3 relative text-[11px] leading-relaxed text-indigo-200">
                    <button 
                      onClick={() => setActiveHint("")}
                      className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-200 font-bold"
                    >
                      ×
                    </button>
                    <div className="font-mono text-[9px] text-indigo-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI SUGGESTION HINT
                    </div>
                    <p className="whitespace-pre-line">{activeHint}</p>
                  </div>
                )}
              </div>

              {/* Chat action controls */}
              <div className="space-y-3.5 shrink-0 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center gap-2">
                  <button
                    onClick={handleGetHint}
                    disabled={hintLoading || messages.length === 0}
                    className="flex-1 bg-slate-800 hover:bg-slate-700/80 disabled:opacity-50 text-indigo-300 disabled:text-slate-500 rounded-xl py-2 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {hintLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <HelpCircle className="w-3.5 h-3.5" />
                    )}
                    <span>💡 Get Hint</span>
                  </button>

                  <button
                    onClick={handleGetReview}
                    disabled={messages.length < 2}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl py-2 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Finish & Review</span>
                  </button>
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    required
                    id="coach-chat-input"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your technical answer..."
                    className="flex-1 bg-slate-800 border border-slate-750 focus:border-indigo-500 text-slate-100 rounded-xl px-4 py-3 focus:outline-none text-xs placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    id="coach-send-btn"
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Idle Screen */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-6 my-auto">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2 max-w-xs">
                <h4 className="font-display font-bold text-sm">Interactive Coaching Panel</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Ready to test your technical skills? Start a live dialogue centered on your active step: <strong className="text-indigo-400">"{selectedStep.title}"</strong>.
                </p>
              </div>
              <button
                id="btn-start-coach"
                onClick={startCoachChat}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <span>Mock Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="shrink-0 text-[10px] text-slate-500 font-mono text-center pt-3 border-t border-slate-800/80">
            Powered by Google Gemini 3.5 Flash Model
          </div>
        </div>

      </div>

    </div>
  );
}
