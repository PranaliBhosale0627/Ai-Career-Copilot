import { Router } from "express";
import { getRoadmap, toggleSkill } from "../controllers/roadmap.controller";

const router = Router();

// GET /api/roadmap — Get career roadmap
router.get("/", getRoadmap as any);

// POST /api/roadmap/step/:stepId/toggle-skill — Toggle a skill in a roadmap step
router.post("/step/:stepId/toggle-skill", toggleSkill as any);

export default router;
