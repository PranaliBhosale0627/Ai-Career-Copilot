import crypto from "crypto";
import { Collection, MongoClient } from "mongodb";

const APP_STATE_ID = "careerco-pilot";
const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_DB_NAME = "careerco_pilot";
const DEFAULT_COLLECTION_NAME = "app_state";
const USERS_COLLECTION_NAME = "users";
const WORKSPACES_COLLECTION_NAME = "workspaces";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

let clientPromise: Promise<MongoClient> | null = null;

type UserRole = "user" | "admin";

interface UserAccount {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

interface UserWorkspace {
  _id: string;
  userId: string;
  state: any;
  stats: {
    resumesCreated: number;
    portfoliosGenerated: number;
    interviewSessionsCompleted: number;
    roadmapsCreated: number;
  };
  generatedDocuments: any[];
  interviewSessions: any[];
  activityHistory: any[];
  notifications: any[];
  createdAt: string;
  updatedAt: string;
}

// Define a default database state matching the CareerCo-pilot screenshots
const DEFAULT_DB = {
  user: {
    name: "Alex Mercer",
    email: "alex.mercer@gmail.com",
    title: "Junior Fullstack Developer",
    bio: "Passionate web developer transitioning into high-scale cloud architectures. Currently building React applications, designing RESTful APIs, and learning about system scalability.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256",
    careerInterests: ["Distributed Systems", "Machine Learning UX", "Backend Scale", "Typescript", "Kubernetes"],
  },
  jobs: [
    {
      id: "j1",
      role: "Senior Fullstack Engineer",
      company: "Vercel",
      salary: "$160k - $190k",
      location: "Remote",
      column: "saved",
      dateAdded: "2026-06-25",
      notes: "High interest. They build Next.js. I should optimize my React 19 knowledge."
    },
    {
      id: "j2",
      role: "ML Platform Engineer",
      company: "Anthropic",
      salary: "$180k - $220k",
      location: "San Francisco, CA",
      column: "saved",
      dateAdded: "2026-06-26",
      notes: "Requires deep Python and Docker experience. Let's look at the roadmap."
    },
    {
      id: "j3",
      role: "Product Engineer",
      company: "Figma",
      salary: "$150k - $185k",
      location: "Remote (US)",
      column: "applied",
      dateAdded: "2026-06-20",
      notes: "Applied via referral. Resume ATS compatibility was 78%."
    },
    {
      id: "j4",
      role: "Developer Advocate",
      company: "Stripe",
      salary: "$140k - $175k",
      location: "New York, NY",
      column: "applied",
      dateAdded: "2026-06-22",
      notes: "Initial application screening submitted. Awaiting response."
    },
    {
      id: "j5",
      role: "Frontend Specialist",
      company: "Linear",
      salary: "$155k - $180k",
      location: "Remote (Global)",
      column: "interviewing",
      dateAdded: "2026-06-15",
      notes: "Completed initial recruiter call. Technical take-home assessment scheduled next."
    },
    {
      id: "j6",
      role: "Software Engineer II",
      company: "Google",
      salary: "$165k - $210k",
      location: "Mountain View, CA",
      column: "offered",
      dateAdded: "2026-06-01",
      notes: "Received offer! Salary negotiations in progress."
    }
  ],
  roadmap: [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Junior Fullstack Developer",
      role: "Current Position",
      status: "completed",
      description: "Master foundational web applications, basic state management, database schemas, and clean code deployment.",
      skills: [
        { id: "s1-1", name: "React & Hooks", completed: true },
        { id: "s1-2", name: "Node.js & Express", completed: true },
        { id: "s1-3", name: "MongoDB Databases", completed: true },
        { id: "s1-4", name: "Git & Team Workflows", completed: true }
      ],
      resources: [
        { title: "React Design Patterns", type: "Article", url: "#" },
        { title: "Node.js Best Practices", type: "Course", url: "#" }
      ]
    },
    {
      id: "step-2",
      stepNumber: 2,
      title: "Mid-Level System Engineer",
      role: "IN PROGRESS",
      status: "in_progress",
      description: "Focus on backend performance, Docker containers, multi-service setups, caching strategies, and system reliability.",
      skills: [
        { id: "s2-1", name: "Docker & Kubernetes", completed: true },
        { id: "s2-2", name: "Redis Caching", completed: false },
        { id: "s2-3", name: "System Design Patterns", completed: false },
        { id: "s2-4", name: "CI/CD Deployment Pipelines", completed: true }
      ],
      resources: [
        { title: "Docker for Developers", type: "Course", url: "#" },
        { title: "System Design Primer", type: "Repository", url: "#" }
      ]
    },
    {
      id: "step-3",
      stepNumber: 3,
      title: "Technical Lead",
      role: "LOCKED",
      status: "locked",
      description: "Architect distributed backends, lead developer teams, coordinate product roadmap transitions, and design secure authentication gates.",
      skills: [
        { id: "s3-1", name: "Microservices Architecture", completed: false },
        { id: "s3-2", name: "Team Leadership & Mentoring", completed: false },
        { id: "s3-3", name: "Cloud Cost Optimization", completed: false }
      ],
      resources: [
        { title: "Designing Data-Intensive Applications", type: "Book", url: "#" },
        { title: "Manager Tools Guide", type: "Podcast", url: "#" }
      ]
    },
    {
      id: "step-4",
      stepNumber: 4,
      title: "Senior Solutions Architect",
      role: "FINAL GOAL",
      status: "locked",
      description: "Provide enterprise-level global software architectures, multi-region database replication plans, AI model pipelines, and system security structures.",
      skills: [
        { id: "s4-1", name: "Global Database Design", completed: false },
        { id: "s4-2", name: "Zero-Trust Security Systems", completed: false },
        { id: "s4-3", name: "Machine Learning Orchestration", completed: false }
      ],
      resources: [
        { title: "AWS Solutions Architect Study Guide", type: "Course", url: "#" }
      ]
    }
  ],
  resumeAnalysis: {
    atsScore: 78,
    strengths: [
      "Robust frontend engineering foundation with React, modern state hooks, and high-contrast responsive styling.",
      "Practical experience building lightweight backend services with Express and MongoDB.",
      "Clean TypeScript definitions and robust static typing systems utilized in pipelines."
    ],
    growthAreas: [
      "Lack of demonstrated expertise in high-scale caching (e.g. Redis) or message brokers.",
      "Minimal containerization exposure in actual bullet points.",
      "No measurable metrics / outcome-driven key accomplishments mentioned in job items."
    ],
    keywordOptimization: [
      "Docker",
      "Redis",
      "System Design",
      "CI/CD Pipeline",
      "Distributed Scaling",
      "Microservices"
    ],
    originalText: `ALEX MERCER
alex.mercer@gmail.com | (555) 019-2834
github.com/alexmercer

SUMMARY
Enthusiastic Junior Fullstack Developer with 2 years of experience crafting React applications and Node.js REST APIs. Eager to master large-scale architectures.

EXPERIENCE
Software Engineer - WebCorp (2024 - Present)
- Developed responsive features for e-commerce clients using React 18 and Tailwind CSS.
- Maintained backend endpoints written in Express, connecting them with MongoDB databases.
- Assisted in optimizing code performance and decreased main bundle sizes by 15%.`,
    suggestedRevision: `ALEX MERCER
alex.mercer@gmail.com | (555) 019-2834
github.com/alexmercer

SUMMARY
Result-driven Fullstack Developer with 2+ years of experience engineering high-performance web applications and scalable Node.js microservices. Proven success optimizing load-times and modernizing API layers.

EXPERIENCE
Software Engineer - WebCorp (2024 - Present)
- Engineered high-impact responsive consumer-facing components using React 18, Tailwind CSS, and optimized Hooks, driving a 15% increase in conversion rates.
- Authored and containerized backend Express REST APIs with Docker, optimizing MongoDB access patterns which reduced query latency by 22%.
- Established Redis caching layers and CI/CD pipelines to streamline deployment, achieving 99.9% uptime.`,
    aiRecommendations: [
      "Incorporate measurable business metrics (e.g., 'achieved 22% latency reduction', 'saved 8 engineering hours per week').",
      "Explicitly detail any cloud orchestration or container deployments you did, even if simple.",
      "Introduce critical keywords like 'Docker' and 'System Design' directly into your WebCorp experience bullets."
    ],
    skillMatches: [
      { skill: "React & TypeScript", status: "match" },
      { skill: "Node.js & Express", status: "match" },
      { skill: "Git & Version Control", status: "match" },
      { skill: "Docker & Kubernetes", status: "missing" },
      { skill: "Redis Caching", status: "missing" },
      { skill: "System Design Patterns", status: "missing" }
    ]
  }
};

type AppState = typeof DEFAULT_DB & { _id?: string };

function cloneDefaultState(): AppState {
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

async function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    clientPromise = new MongoClient(uri).connect();
  }
  return clientPromise;
}

async function getAppStateCollection(): Promise<Collection<AppState>> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  const collectionName = process.env.MONGODB_COLLECTION_NAME || DEFAULT_COLLECTION_NAME;
  return client.db(dbName).collection<AppState>(collectionName);
}

async function getUsersCollection(): Promise<Collection<UserAccount>> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  return client.db(dbName).collection<UserAccount>(USERS_COLLECTION_NAME);
}

async function getWorkspacesCollection(): Promise<Collection<UserWorkspace>> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  return client.db(dbName).collection<UserWorkspace>(WORKSPACES_COLLECTION_NAME);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function publicUser(user: UserAccount) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  };
}

function tokenSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || "careerco-pilot-dev-secret";
  if (process.env.NODE_ENV === "production" && secret === "careerco-pilot-dev-secret") {
    console.warn("JWT_SECRET is not set. Configure JWT_SECRET in production.");
  }
  return secret;
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const passwordHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { passwordHash, passwordSalt: salt };
}

function verifyPassword(password: string, user: UserAccount): boolean {
  const candidate = crypto.scryptSync(password, user.passwordSalt, 64);
  const stored = Buffer.from(user.passwordHash, "hex");
  return stored.length === candidate.length && crypto.timingSafeEqual(stored, candidate);
}

export function signAuthToken(payload: { id: string; email: string; name: string; role: UserRole }): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    sub: payload.id,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
  };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedBody = base64Url(JSON.stringify(body));
  const signature = crypto
    .createHmac("sha256", tokenSecret())
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64url");
  return `${encodedHeader}.${encodedBody}.${signature}`;
}

export function verifyAuthToken(token: string): { id: string; email: string; name: string; role: UserRole } {
  const [encodedHeader, encodedBody, signature] = token.split(".");
  if (!encodedHeader || !encodedBody || !signature) {
    throw new Error("Invalid token format");
  }

  const expectedSignature = crypto
    .createHmac("sha256", tokenSecret())
    .update(`${encodedHeader}.${encodedBody}`)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(Buffer.from(encodedBody, "base64url").toString("utf-8"));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role || "user"
  };
}

function createFreshWorkspaceState(name: string, email: string): any {
  const state = JSON.parse(JSON.stringify(FRESH_DB_TEMPLATE));
  state.user.name = name;
  state.user.email = email;
  return state;
}

async function ensureWorkspace(user: UserAccount): Promise<UserWorkspace> {
  const workspaces = await getWorkspacesCollection();
  const existing = await workspaces.findOne({ userId: user._id });
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const workspace: UserWorkspace = {
    _id: crypto.randomUUID(),
    userId: user._id,
    state: createFreshWorkspaceState(user.name, user.email),
    stats: {
      resumesCreated: 0,
      portfoliosGenerated: 0,
      interviewSessionsCompleted: 0,
      roadmapsCreated: 1
    },
    generatedDocuments: [],
    interviewSessions: [],
    activityHistory: [
      {
        id: crypto.randomUUID(),
        type: "account_created",
        title: "Workspace created",
        description: "Your private CareerCo-pilot dashboard is ready.",
        createdAt: now
      }
    ],
    notifications: [
      {
        id: crypto.randomUUID(),
        type: "success",
        title: "Welcome to CareerCo-pilot",
        message: "Your private dashboard has been created.",
        read: false,
        createdAt: now
      }
    ],
    createdAt: now,
    updatedAt: now
  };
  await workspaces.insertOne(workspace);
  return workspace;
}

export async function registerUser(name: string, email: string, password: string) {
  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const existing = await users.findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error("An account already exists for this email.");
  }

  const now = new Date().toISOString();
  const { passwordHash, passwordSalt } = hashPassword(password);
  const user: UserAccount = {
    _id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    passwordSalt,
    role: "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256",
    createdAt: now,
    updatedAt: now
  };

  await users.insertOne(user);
  await ensureWorkspace(user);

  const authUser = publicUser(user);
  return {
    user: authUser,
    token: signAuthToken({ id: user._id, email: user.email, name: user.name, role: user.role })
  };
}

export async function loginUser(email: string, password: string) {
  const users = await getUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const user = await users.findOne({ email: normalizedEmail });
  if (!user || !verifyPassword(password, user)) {
    throw new Error("Invalid email or password.");
  }

  const now = new Date().toISOString();
  await users.updateOne({ _id: user._id }, { $set: { lastLoginAt: now, updatedAt: now } });
  user.lastLoginAt = now;
  await ensureWorkspace(user);

  return {
    user: publicUser(user),
    token: signAuthToken({ id: user._id, email: user.email, name: user.name, role: user.role })
  };
}

export async function findUserById(userId: string) {
  const users = await getUsersCollection();
  const user = await users.findOne({ _id: userId });
  return user ? publicUser(user) : null;
}

function withoutMongoId(data: AppState): any {
  const { _id, ...appState } = data;
  return appState;
}

// Legacy demo state helper, retained for local seeding/migration fallback only.
export async function getLegacyDemoDB(): Promise<any> {
  const collection = await getAppStateCollection();
  const existing = await collection.findOne({ _id: APP_STATE_ID });

  if (existing) {
    return withoutMongoId(existing);
  }

  const defaultState = cloneDefaultState();
  await collection.insertOne({ _id: APP_STATE_ID, ...defaultState });
  return defaultState;
}

export async function getDB(userId: string): Promise<any> {
  const users = await getUsersCollection();
  const user = await users.findOne({ _id: userId });
  if (!user) {
    throw new Error("Authenticated user not found.");
  }

  const workspace = await ensureWorkspace(user);
  return workspace.state;
}

export async function saveDB(userId: string, data: any): Promise<void> {
  const workspaces = await getWorkspacesCollection();
  await workspaces.updateOne(
    { userId },
    {
      $set: {
        state: data,
        updatedAt: new Date().toISOString()
      }
    },
    { upsert: false }
  );
}

export async function getDashboardSummary(userId: string) {
  const workspaces = await getWorkspacesCollection();
  const workspace = await workspaces.findOne({ userId });
  if (!workspace) {
    return null;
  }

  return {
    stats: workspace.stats,
    generatedDocuments: workspace.generatedDocuments.slice(-10).reverse(),
    interviewSessions: workspace.interviewSessions.slice(-10).reverse(),
    activityHistory: workspace.activityHistory.slice(-20).reverse(),
    notifications: workspace.notifications.slice(-10).reverse()
  };
}

export async function addActivity(userId: string, type: string, title: string, description: string) {
  const workspaces = await getWorkspacesCollection();
  await workspaces.updateOne(
    { userId },
    {
      $push: {
        activityHistory: {
          id: crypto.randomUUID(),
          type,
          title,
          description,
          createdAt: new Date().toISOString()
        }
      },
      $set: { updatedAt: new Date().toISOString() }
    }
  );
}

export async function addGeneratedDocument(userId: string, document: any) {
  const workspaces = await getWorkspacesCollection();
  await workspaces.updateOne(
    { userId },
    {
      $push: {
        generatedDocuments: {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          ...document
        }
      },
      $set: { updatedAt: new Date().toISOString() }
    }
  );
}

export async function incrementWorkspaceStat(userId: string, stat: keyof UserWorkspace["stats"]) {
  const workspaces = await getWorkspacesCollection();
  await workspaces.updateOne(
    { userId },
    {
      $inc: { [`stats.${stat}`]: 1 },
      $set: { updatedAt: new Date().toISOString() }
    }
  );
}

export const FRESH_DB_TEMPLATE = {
  user: {
    name: "",
    email: "",
    title: "Junior Developer",
    bio: "Passionate developer. Ready to learn and grow my technical career.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256",
    careerInterests: [],
  },
  jobs: [],
  roadmap: [
    {
      id: "step-1",
      stepNumber: 1,
      title: "Junior Developer",
      role: "Current Position",
      status: "in_progress",
      description: "Master foundational web applications, basic state management, database schemas, and clean code deployment.",
      skills: [
        { id: "s1-1", name: "React & Hooks", completed: false },
        { id: "s1-2", name: "Node.js & Express", completed: false },
        { id: "s1-3", name: "MongoDB Databases", completed: false },
        { id: "s1-4", name: "Git & Team Workflows", completed: false }
      ],
      resources: [
        { title: "React Design Patterns", type: "Article", url: "#" },
        { title: "Node.js Best Practices", type: "Course", url: "#" }
      ]
    },
    {
      id: "step-2",
      stepNumber: 2,
      title: "Mid-Level System Engineer",
      role: "IN PROGRESS",
      status: "locked",
      description: "Focus on backend performance, Docker containers, multi-service setups, caching strategies, and system reliability.",
      skills: [
        { id: "s2-1", name: "Docker & Kubernetes", completed: false },
        { id: "s2-2", name: "Redis Caching", completed: false },
        { id: "s2-3", name: "System Design Patterns", completed: false },
        { id: "s2-4", name: "CI/CD Deployment Pipelines", completed: false }
      ],
      resources: [
        { title: "Docker for Developers", type: "Course", url: "#" },
        { title: "System Design Primer", type: "Repository", url: "#" }
      ]
    },
    {
      id: "step-3",
      stepNumber: 3,
      title: "Technical Lead",
      role: "LOCKED",
      status: "locked",
      description: "Architect distributed backends, lead developer teams, coordinate product roadmap transitions, and design secure authentication gates.",
      skills: [
        { id: "s3-1", name: "Microservices Architecture", completed: false },
        { id: "s3-2", name: "Team Leadership & Mentoring", completed: false },
        { id: "s3-3", name: "Cloud Cost Optimization", completed: false }
      ],
      resources: [
        { title: "Designing Data-Intensive Applications", type: "Book", url: "#" },
        { title: "Manager Tools Guide", type: "Podcast", url: "#" }
      ]
    },
    {
      id: "step-4",
      stepNumber: 4,
      title: "Senior Solutions Architect",
      role: "FINAL GOAL",
      status: "locked",
      description: "Provide enterprise-level global software architectures, multi-region database replication plans, AI model pipelines, and system security structures.",
      skills: [
        { id: "s4-1", name: "Global Database Design", completed: false },
        { id: "s4-2", name: "Zero-Trust Security Systems", completed: false },
        { id: "s4-3", name: "Machine Learning Orchestration", completed: false }
      ],
      resources: [
        { title: "AWS Solutions Architect Study Guide", type: "Course", url: "#" }
      ]
    }
  ],
  resumeAnalysis: {
    atsScore: 0,
    strengths: [],
    growthAreas: [],
    keywordOptimization: [],
    originalText: "",
    suggestedRevision: "",
    aiRecommendations: [],
    skillMatches: []
  }
};

export async function resetDB(userId: string, name: string, email: string): Promise<any> {
  const newDB = JSON.parse(JSON.stringify(FRESH_DB_TEMPLATE));
  newDB.user.name = name;
  newDB.user.email = email;
  await saveDB(userId, newDB);
  return newDB;
}
