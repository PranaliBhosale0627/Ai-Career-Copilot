import { Collection, MongoClient } from "mongodb";

const APP_STATE_ID = "careerco-pilot";
const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_DB_NAME = "careerco_pilot";
const DEFAULT_COLLECTION_NAME = "app_state";

let clientPromise: Promise<MongoClient> | null = null;

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

function withoutMongoId(data: AppState): any {
  const { _id, ...appState } = data;
  return appState;
}

// MongoDB read/write helpers. The app stores one document containing the
// existing app state so controllers can keep their current shape.
export async function getDB(): Promise<any> {
  const collection = await getAppStateCollection();
  const existing = await collection.findOne({ _id: APP_STATE_ID });

  if (existing) {
    return withoutMongoId(existing);
  }

  const defaultState = cloneDefaultState();
  await collection.insertOne({ _id: APP_STATE_ID, ...defaultState });
  return defaultState;
}

export async function saveDB(data: any): Promise<void> {
  const collection = await getAppStateCollection();
  await collection.replaceOne(
    { _id: APP_STATE_ID },
    { _id: APP_STATE_ID, ...data },
    { upsert: true }
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

export async function resetDB(name: string, email: string): Promise<any> {
  const newDB = JSON.parse(JSON.stringify(FRESH_DB_TEMPLATE));
  newDB.user.name = name;
  newDB.user.email = email;
  await saveDB(newDB);
  return newDB;
}
