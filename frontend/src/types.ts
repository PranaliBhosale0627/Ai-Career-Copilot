/**
 * Shared Type Definitions for CareerCo-pilot
 */

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
  careerInterests: string[];
}

export interface JobMatch {
  id: string;
  role: string;
  company: string;
  logo: string;
  matchScore: number;
  missingSkills: string[];
  salary: string;
  location: string;
}

export interface PipelineJob {
  id: string;
  role: string;
  company: string;
  salary?: string;
  location?: string;
  column: "saved" | "applied" | "interviewing" | "offered" | "rejected";
  dateAdded: string;
  notes?: string;
  coverLetter?: string;
}

export interface RoadmapSkill {
  id: string;
  name: string;
  completed: boolean;
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  role: string;
  status: "completed" | "in_progress" | "locked";
  skills: RoadmapSkill[];
  resources: { title: string; type: string; url: string }[];
  description: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  strengths: string[];
  growthAreas: string[];
  keywordOptimization: string[];
  originalText: string;
  suggestedRevision: string;
  aiRecommendations: string[];
  skillMatches: { skill: string; status: "match" | "missing" }[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}
