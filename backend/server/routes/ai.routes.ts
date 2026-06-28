import { Router } from "express";
import { getResumeAnalysis, analyzeResume, coachMessage, coachReview, coachHint } from "../controllers/ai.controller";

const router = Router();

// GET /api/resume/analysis — Get cached resume analysis results
router.get("/resume/analysis", getResumeAnalysis);

// POST /api/resume/analyze — AI Resume Analysis with Gemini
router.post("/resume/analyze", analyzeResume);

// POST /api/coach/message — AI Interview Coach Chat
router.post("/coach/message", coachMessage);

// POST /api/coach/review — AI Interview Coach Performance Review
router.post("/coach/review", coachReview);

// POST /api/coach/hint — AI Interview Coach Hint Generator
router.post("/coach/hint", coachHint);

export default router;
