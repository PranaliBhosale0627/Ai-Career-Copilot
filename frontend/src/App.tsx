import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import DashboardView from "./components/DashboardView";
import ResumeAnalysisView from "./components/ResumeAnalysisView";
import RoadmapView from "./components/RoadmapView";
import PipelineView from "./components/PipelineView";
import SettingsView from "./components/SettingsView";
import { UserProfile, PipelineJob, RoadmapStep, ResumeAnalysis, ChatMessage } from "./types";
import { Sparkles, Loader2 } from "lucide-react";
import { apiFetch } from "./lib/api";

export default function App() {
  // Session / Navigation States
  const [currentScreen, setCurrentScreen] = useState<"landing" | "auth" | "workspace">("landing");
  const [currentView, setCurrentView] = useState<string>("dashboard");

  // Data states loaded from server
  const [user, setUser] = useState<UserProfile | null>(null);
  const [jobs, setJobs] = useState<PipelineJob[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync data from Express API
  useEffect(() => {
    async function fetchAllData() {
      try {
        const [userRes, jobsRes, roadmapRes, resumeRes] = await Promise.all([
          apiFetch("/api/user"),
          apiFetch("/api/jobs"),
          apiFetch("/api/roadmap"),
          apiFetch("/api/resume/analysis")
        ]);

        if (userRes.ok && jobsRes.ok && roadmapRes.ok && resumeRes.ok) {
          const userData = await userRes.json();
          const jobsData = await jobsRes.json();
          const roadmapData = await roadmapRes.json();
          const resumeData = await resumeRes.json();

          setUser(userData);
          setJobs(jobsData);
          setRoadmap(roadmapData);
          setResumeAnalysis(resumeData);
        }
      } catch (err) {
        console.error("Failed to load initial workspace data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  // Auth Action handlers
  const handleSignIn = async (name: string, email: string) => {
    try {
      const [userRes, jobsRes, roadmapRes, resumeRes] = await Promise.all([
        apiFetch("/api/user"),
        apiFetch("/api/jobs"),
        apiFetch("/api/roadmap"),
        apiFetch("/api/resume/analysis")
      ]);

      if (userRes.ok && jobsRes.ok && roadmapRes.ok && resumeRes.ok) {
        setUser(await userRes.json());
        setJobs(await jobsRes.json());
        setRoadmap(await roadmapRes.json());
        setResumeAnalysis(await resumeRes.json());
      }
    } catch (err) {
      console.error("Failed to login user:", err);
    }
    setCurrentScreen("workspace");
    setCurrentView("dashboard");
  };

  const handleSignUp = async (name: string, email: string): Promise<boolean> => {
    try {
      const signUpRes = await apiFetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      return signUpRes.ok;
    } catch (err) {
      console.error("Failed to sign up new user:", err);
      return false;
    }
  };

  const handleSignOut = () => {
    setCurrentScreen("landing");
    setCurrentView("dashboard");
  };

  // Profile Save Actions
  const handleSaveProfile = async (profile: UserProfile): Promise<UserProfile> => {
    const res = await apiFetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const updated = await res.json();
    setUser(updated);
    return updated;
  };

  // Pipeline Job Actions
  const handleAddJob = async (role: string, company: string, salary: string, location: string, notes?: string): Promise<PipelineJob> => {
    const res = await apiFetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, company, salary, location, notes })
    });
    const added = await res.json();
    setJobs((prev) => [...prev, added]);
    return added;
  };

  const handleMoveJob = async (id: string, column: PipelineJob["column"], notes?: string): Promise<PipelineJob> => {
    const res = await apiFetch(`/api/jobs/${id}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ column, notes })
    });
    const updated = await res.json();
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    return updated;
  };

  const handleDeleteJob = async (id: string): Promise<boolean> => {
    const res = await apiFetch(`/api/jobs/${id}`, { method: "DELETE" });
    const success = (await res.json()).success;
    if (success) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
    return success;
  };

  const handleGenerateCoverLetter = async (id: string): Promise<string> => {
    const res = await apiFetch(`/api/jobs/${id}/cover-letter`, { method: "POST" });
    const data = await res.json();
    // Re-fetch jobs list to synchronize
    const jobsFetch = await apiFetch("/api/jobs");
    if (jobsFetch.ok) {
      setJobs(await jobsFetch.json());
    }
    return data.coverLetter;
  };

  // Career Roadmap Actions
  const handleToggleSkill = async (stepId: string, skillId: string): Promise<RoadmapStep[]> => {
    const res = await apiFetch(`/api/roadmap/step/${stepId}/toggle-skill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId })
    });
    const updatedRoadmap = await res.json();
    setRoadmap(updatedRoadmap);
    return updatedRoadmap;
  };

  // Gemini AI Resume Scan
  const handleAnalyzeResume = async (resumeText: string, targetRole: string): Promise<ResumeAnalysis> => {
    const res = await apiFetch("/api/resume/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, targetRole })
    });
    const result = await res.json();
    setResumeAnalysis(result);
    return result;
  };

  // Gemini AI Interview Coach Chat
  const handleSendCoachMessage = async (messagesHistory: ChatMessage[], activeRole: string): Promise<string> => {
    const res = await apiFetch("/api/coach/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesHistory, activeRole })
    });
    const data = await res.json();
    return data.reply;
  };

  // Dashboard quick triggers
  const handleAddJobFromDashboard = async (role: string, company: string, salary: string, location: string) => {
    await handleAddJob(role, company, salary, location, "Discovered on dashboard recommendations table.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="font-mono text-xs text-slate-400">Bootstrapping CareerCo-pilot workspace container...</p>
      </div>
    );
  }

  // SCREEN ROUTING: Landing & Auth Gates
  if (currentScreen === "landing") {
    return <LandingPage onGetStarted={() => setCurrentScreen("auth")} />;
  }

  if (currentScreen === "auth") {
    return (
      <AuthPage 
        onSignIn={handleSignIn} 
        onSignUp={handleSignUp} 
        onBack={() => setCurrentScreen("landing")} 
      />
    );
  }

  // CORE WORKSPACE LAYOUT
  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView 
            user={user!} 
            onNavigate={(view) => setCurrentView(view)} 
            onAddJobToPipeline={handleAddJobFromDashboard}
          />
        );
      case "resume":
        return (
          <ResumeAnalysisView 
            initialAnalysis={resumeAnalysis!} 
            onAnalyze={handleAnalyzeResume}
          />
        );
      case "roadmap":
        return (
          <RoadmapView 
            initialSteps={roadmap} 
            onToggleSkill={handleToggleSkill} 
            onSendCoachMessage={handleSendCoachMessage}
          />
        );
      case "pipeline":
        return (
          <PipelineView 
            initialJobs={jobs} 
            onAddJob={handleAddJob}
            onMoveJob={handleMoveJob}
            onDeleteJob={handleDeleteJob}
            onGenerateCoverLetter={handleGenerateCoverLetter}
          />
        );
      case "settings":
        return (
          <SettingsView 
            initialUser={user!} 
            onSaveProfile={handleSaveProfile}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-slate-500 font-mono">
            View Error: The designated view handler is unresolved.
          </div>
        );
    }
  };

  return (
    <div id="workspace-layout" className="flex bg-slate-50 text-slate-900 font-sans h-screen overflow-hidden">
      
      {/* Side persistent navigation menu */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => setCurrentView(view)} 
        user={user!} 
        onSignOut={handleSignOut}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Minimal Workspace bar */}
        <header className="h-16 bg-white border-b border-slate-200/60 px-8 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-slate-500 font-mono font-semibold">AI MODEL CHANNEL: ONLINE</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider font-mono">Premium Account</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner views */}
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

    </div>
  );
}
