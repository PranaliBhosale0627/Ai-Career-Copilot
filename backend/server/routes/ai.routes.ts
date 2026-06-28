import { Router } from "express";
import { getResumeAnalysis, analyzeResume, coachMessage, coachReview, coachHint } from "../controllers/ai.controller";

const router = Router();

// GET /api/resume/analysis — Get cached resume analysis results
router.get("/resume/analysis", getResumeAnalysis as any);

// POST /api/resume/analyze — AI Resume Analysis with Gemini
router.post("/resume/analyze", analyzeResume as any);

// POST /api/coach/message — AI Interview Coach Chat
router.post("/coach/message", coachMessage as any);

// POST /api/coach/review — AI Interview Coach Performance Review
router.post("/coach/review", coachReview as any);

// POST /api/coach/hint — AI Interview Coach Hint Generator
router.post("/coach/hint", coachHint as any);

export default router;
