import React from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Milestone, 
  Layers, 
  Settings as SettingsIcon, 
  LogOut, 
  Sparkles 
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: UserProfile;
  onSignOut: () => void;
}

export default function Sidebar({ currentView, onViewChange, user, onSignOut }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resume", label: "Resume Analysis", icon: FileText },
    { id: "roadmap", label: "Career Roadmap", icon: Milestone },
    { id: "pipeline", label: "Progress Tracker", icon: Layers },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 h-screen shrink-0">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-sky-500 rounded-xl text-white shadow-lg shadow-indigo-500/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            CareerCo-pilot
          </h1>
          <span className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase font-semibold">
            AI Assistant
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
              }`} />
              <span>{item.label}</span>
              
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 bg-sky-300 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-200 truncate leading-none mb-1">
              {user.name}
            </h3>
            <p className="text-xs text-slate-500 truncate leading-none">
              {user.email}
            </p>
          </div>
        </div>

        <button
          id="btn-signout"
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-xs font-medium transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
