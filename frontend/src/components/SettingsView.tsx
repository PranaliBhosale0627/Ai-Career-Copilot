import React, { useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Sparkles, 
  Check, 
  Plus, 
  X,
  ShieldCheck,
  Mail,
  FileText
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsViewProps {
  initialUser: UserProfile;
  onSaveProfile: (profile: UserProfile) => Promise<UserProfile>;
}

export default function SettingsView({ initialUser, onSaveProfile }: SettingsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "security" | "notifications" | "subscription">("profile");
  
  // Form States
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [title, setTitle] = useState(initialUser.title);
  const [bio, setBio] = useState(initialUser.bio);
  const [avatar, setAvatar] = useState(initialUser.avatar);
  const [interests, setInterests] = useState<string[]>(initialUser.careerInterests || []);
  const [tagInput, setTagInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const subTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "subscription", label: "Subscription", icon: CreditCard }
  ];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    if (!interests.includes(tagInput.trim())) {
      setInterests((prev) => [...prev, tagInput.trim()]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setInterests((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = {
        name,
        email,
        title,
        bio,
        avatar,
        careerInterests: interests
      };
      await onSaveProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save changes. Please check server status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="settings-view" className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider font-mono">WORKSPACE SETTINGS</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
          Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize your career profile parameters, security keys, and subscription preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Left Sub-navigation Bar */}
        <div className="bg-white border border-slate-200/85 p-3 rounded-2xl shadow-sm flex flex-col space-y-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`settings-sub-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-950/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Panel */}
        <div className="md:col-span-3 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          {activeSubTab === "profile" ? (
            /* Profile Settings Form */
            <form onSubmit={handleSave} className="divide-y divide-slate-100">
              
              {/* Form Section 1: Avatar + Name info */}
              <div className="p-6 space-y-6">
                <h3 className="font-display text-base font-bold text-slate-900">Personal Details</h3>
                
                {/* Avatar selection */}
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src={avatar}
                    alt="profile avatar"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-850">Profile Picture</p>
                    <p className="text-[10px] text-slate-400">Choose a professional high-contrast photo.</p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256")}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-semibold text-slate-700 cursor-pointer"
                      >
                        Default Female
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256")}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-semibold text-slate-700 cursor-pointer"
                      >
                        Default Male
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Display Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex.mercer@gmail.com"
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Professional Headline</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Junior Fullstack Developer"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-sm font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-mono">Bio summary</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Describe your career focus and current technological objectives..."
                      className="w-full p-4 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-800 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Career Interests Tag Inputs */}
              <div className="p-6 space-y-4 bg-slate-50/50">
                <h3 className="font-display text-base font-bold text-slate-900">Career Interest Parameters</h3>
                <p className="text-xs text-slate-400">These tags define the job scan and resume optimization tailwinds.</p>

                {/* Tag Input block */}
                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="e.g. Go, Distributed Scale, GCP"
                      className="flex-1 max-w-sm bg-white px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-slate-850 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Render tag list */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {interests.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold font-mono"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 p-0.5 rounded-md cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {interests.length === 0 && (
                      <span className="text-xs text-slate-400 font-medium italic">No interest tags specified. add some tags above to customize matches!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit footer bar */}
              <div className="p-6 bg-slate-100 flex justify-between items-center">
                <div>
                  {saveSuccess && (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1 font-mono uppercase tracking-wider animate-bounce">
                      <Check className="w-4 h-4" /> Changes saved successfully!
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  id="btn-save-settings"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>

            </form>
          ) : (
            /* Mock other sub-tabs to provide complete aesthetics */
            <div className="p-12 text-center space-y-4 flex flex-col items-center">
              <div className="p-3 bg-slate-100 rounded-2xl text-slate-400">
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-slate-900 text-sm">Security & Platform Keys</h3>
                <p className="text-xs text-slate-500 max-w-sm">This section contains platform authentication controls, secure cookie encryption modes, and active device listings.</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold font-mono">
                SECURED CLIENT GATEWAY
              </span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
