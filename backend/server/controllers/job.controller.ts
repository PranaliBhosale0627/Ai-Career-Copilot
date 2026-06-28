import { Response } from "express";
import { addActivity, getDB, saveDB } from "../config/db";
import { AuthenticatedRequest } from "../types/auth";

// GET /api/jobs - Get all pipeline jobs
export async function getJobs(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  res.json(db.jobs);
}

// POST /api/jobs - Add a new pipeline job
export async function addJob(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  const newJob = {
    id: "job_" + Date.now(),
    role: req.body.role || "Untitled Role",
    company: req.body.company || "Untitled Company",
    salary: req.body.salary || "",
    location: req.body.location || "Remote",
    column: req.body.column || "saved",
    dateAdded: new Date().toISOString().split("T")[0],
    notes: req.body.notes || ""
  };
  db.jobs.push(newJob);
  await saveDB(req.user.id, db);
  await addActivity(req.user.id, "job_added", "Job saved", `${newJob.role} at ${newJob.company} was added to your pipeline.`);
  res.json(newJob);
}

// POST /api/jobs/:id/move - Update or move a pipeline job
export async function moveJob(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  const job = db.jobs.find((j: any) => j.id === req.params.id);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  if (req.body.column) {
    job.column = req.body.column;
  }
  if (req.body.notes !== undefined) {
    job.notes = req.body.notes;
  }
  await saveDB(req.user.id, db);
  res.json(job);
}

// DELETE /api/jobs/:id - Delete a pipeline job
export async function deleteJob(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  const initialLen = db.jobs.length;
  db.jobs = db.jobs.filter((j: any) => j.id !== req.params.id);
  await saveDB(req.user.id, db);
  res.json({ success: db.jobs.length < initialLen });
}
