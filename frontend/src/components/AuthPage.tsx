import React, { useState } from "react";
import { Sparkles, Mail, Lock, User, ArrowRight, Star, ShieldCheck } from "lucide-react";

interface AuthPageProps {
  onSignIn: (name: string, email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  onBack: () => void;
}

export default function AuthPage({ onSignIn, onSignUp, onBack }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("alex.mercer@gmail.com");
  const [name, setName] = useState("Alex Mercer");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await onSignUp(name, email, password);
      } else {
        await onSignIn(name, email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="auth-container" className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* LEFT: Auth Form Panel */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white border-r border-slate-200">
        {/* Top Header Row */}
        <div className="flex justify-between items-center">
          <button 
            id="auth-brand-logo"
            onClick={onBack}
            className="flex items-center gap-3 text-slate-900 group cursor-pointer"
          >
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Sparkles className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-display font-bold text-lg">CareerCo-pilot</span>
          </button>
          
          <button
            id="auth-toggle-top-btn"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            {isSignUp ? "Sign in instead" : "Create an account"}
          </button>
        </div>

        {/* Center Main Form */}
        <div className="max-w-md w-full mx-auto my-12">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {isSignUp ? "Create Account" : "Welcome back"}
            </h2>
            <p className="text-sm text-slate-500">
              {isSignUp 
                ? "Start your AI-guided journey to a higher-paying career today."
                : "Log in to access your customized resume analyzer and roadmap."}
            </p>
          </div>

          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              id="auth-social-google"
              onClick={() => onSignIn("Alex Mercer", "alex.mercer@gmail.com", "password123")}
              className="flex items-center justify-center gap-2.5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              id="auth-social-linkedin"
              onClick={() => onSignIn("Alex Mercer", "alex.mercer@gmail.com", "password123")}
              className="flex items-center justify-center gap-2.5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium text-slate-700 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-indigo-600" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>

          <div className="relative mb-6 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-slate-200" />
            <span className="relative bg-white px-3 text-xs text-slate-400 font-medium font-mono uppercase">
              Or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    id="auth-input-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  id="auth-input-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.mercer@gmail.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  id="auth-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <span>{isSubmitting ? "Please wait..." : isSignUp ? "Sign Up & Start Coaching" : "Sign In"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Security Footer block */}
        <div className="text-center flex items-center justify-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>AES-256 SSL Secured authentication gates</span>
        </div>
      </div>

      {/* RIGHT: High-Fidelity Testimonial & Visual Panel */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative p-16 flex-col justify-between overflow-hidden">
        {/* Abstract futuristic background decorations */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-indigo-500/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-sky-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Top Header Label */}
        <div className="relative z-10 flex items-center gap-2 text-indigo-400 font-mono text-xs tracking-wider uppercase font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>AI CAREER ENGINE V1.2</span>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 max-w-lg mt-auto mb-16">
          <div className="flex items-center gap-1 text-amber-500 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-500" />)}
          </div>

          <blockquote className="text-2xl text-slate-100 font-medium leading-relaxed mb-8 font-sans">
            "CareerCo-pilot completely changed how I approached my job search. The resume analyzer boosted my ATS score, and the roadmap gave me a clear path. I landed my Google offer in 6 weeks!"
          </blockquote>

          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128&h=128"
              alt="Sarah Jenkins"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-semibold text-slate-200">Sarah Jenkins</p>
              <p className="text-sm text-slate-400">Software Engineer II, Google</p>
            </div>
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="relative z-10 text-[10px] text-slate-500 font-mono flex items-center justify-between">
          <span>AI SERVICE LEVEL: LIVE</span>
          <span>LATENCY: 42MS</span>
        </div>
      </div>
    </div>
  );
}
