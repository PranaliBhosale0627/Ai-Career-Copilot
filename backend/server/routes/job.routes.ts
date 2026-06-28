import { Router } from "express";
import { getJobs, addJob, moveJob, deleteJob } from "../controllers/job.controller";
import { generateCoverLetter, explainFit } from "../controllers/ai.controller";

const router = Router();

// GET /api/jobs — Get all pipeline jobs
router.get("/", getJobs as any);

// POST /api/jobs — Add a new pipeline job
router.post("/", addJob as any);

// POST /api/jobs/explain-fit — AI Job Match Fit Explainer
// NOTE: This must be defined BEFORE the /:id routes to avoid matching "explain-fit" as an :id param
router.post("/explain-fit", explainFit as any);

// POST /api/jobs/:id/move — Update or move a pipeline job
router.post("/:id/move", moveJob as any);

// DELETE /api/jobs/:id — Delete a pipeline job
router.delete("/:id", deleteJob as any);

// POST /api/jobs/:id/cover-letter — AI Cover Letter Generator
router.post("/:id/cover-letter", generateCoverLetter as any);

export default router;
