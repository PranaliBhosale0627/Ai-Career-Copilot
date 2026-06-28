import React from "react";
import { Sparkles, ArrowRight, Shield, Rocket, FileText, CheckCircle, Brain, Target, Star } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const steps = [
    {
      icon: FileText,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      title: "1. Optimize Your Resume",
      desc: "Our real-time ATS analyzer parses your text, identifies missing industry keywords, and drafts a beautifully re-engineered professional version."
    },
    {
      icon: Target,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      title: "2. Map Your Career Journey",
      desc: "Unlock hyper-personalized, sequential roadmaps that guide you from your current level through intermediate milestones directly to your dream role."
    },
    {
      icon: Brain,
      color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      title: "3. Ace Your AI Interview",
      desc: "Converse with our interactive, role-specific Interview Coach widget. Receive structured real-time guidance on your technical answers."
    }
  ];

  return (
    <div id="landing-container" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-200/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">
            CareerCo-pilot
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Features
          </a>
          <button
            id="landing-signin-btn"
            onClick={onGetStarted}
            className="px-4.5 py-2 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-slate-100 text-slate-800 transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 flex flex-col items-start text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Career Intelligence</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
            Land Your Dream Job with{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              AI-Powered Precision
            </span>
          </h2>

          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Upload your resume to calculate and optimize your ATS score, map out a custom step-by-step career path, and master high-paying technical interviews with a personalized AI coach.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full">
            <button
              id="landing-get-started-cta"
              onClick={onGetStarted}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center"
            >
              See how it works
            </a>
          </div>

          {/* Trust proof banner */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 w-full flex flex-col sm:flex-row items-center gap-6">
            <div className="flex -space-x-3">
              <img className="w-9 h-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128&h=128" alt="user" referrerPolicy="no-referrer" />
              <img className="w-9 h-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128&h=128" alt="user" referrerPolicy="no-referrer" />
              <img className="w-9 h-9 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128&h=128" alt="user" referrerPolicy="no-referrer" />
              <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white text-[11px] font-bold">
                +12k
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 mb-1 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Joined by <strong className="text-slate-800">50,000+ professionals</strong> from Google, Vercel, Stripe, and Figma.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Interactive UI Preview Mockup */}
        <div className="flex-1 w-full lg:max-w-xl animate-fade-in">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden relative group p-1">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-sky-500/5 to-transparent rounded-2xl pointer-events-none" />
            
            {/* Mock Header Tabs */}
            <div className="h-10 bg-slate-950/60 border-b border-slate-800 flex items-center px-4 justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-[11px] text-slate-500 font-mono select-none">
                workspace://career_copilot_v1
              </div>
              <div className="w-14" />
            </div>

            {/* Mock Dashboard Representation */}
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider font-mono">WORKSPACE</div>
                  <h3 className="text-lg font-bold text-slate-100">Welcome, Alex Mercer</h3>
                </div>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  Synced
                </span>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-semibold">ATS Match Score</p>
                    <p className="text-2xl font-bold font-display text-indigo-400">78%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 font-semibold">Job Pipelines</p>
                    <p className="text-2xl font-bold font-display text-sky-400">24 Matches</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <Rocket className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Progress visualizer */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">Junior Dev to Senior Architect Path</span>
                  <span className="font-mono text-indigo-400 font-bold">64% Done</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full w-[64%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-white border-t border-slate-200/80 py-24 px-6">
        <div className="max-w-7xl w-full mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Structured Process</span>
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How CareerCo-pilot Works
          </h3>
          
          <p className="text-slate-500 max-w-xl mx-auto mb-16 leading-relaxed">
            We provide an integrated lifecycle suite to manage, optimize, and guide your career advancements seamlessly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col items-start hover:shadow-xl hover:shadow-slate-100/40 transition-all group">
                  <div className={`p-4 ${step.color} rounded-2xl mb-6 transition-transform group-hover:scale-110 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-slate-900 mb-3">
                    {step.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 px-6 text-center shrink-0">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} CareerCo-pilot Inc. Built with full-stack React and Google Gemini. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
