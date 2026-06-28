import { Request, Response } from "express";
import { getDB, saveDB } from "../config/db";

// GET /api/jobs - Get all pipeline jobs
export async function getJobs(req: Request, res: Response): Promise<void> {
  const db = await getDB();
  res.json(db.jobs);
}

// POST /api/jobs - Add a new pipeline job
export async function addJob(req: Request, res: Response): Promise<void> {
  const db = await getDB();
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
  await saveDB(db);
  res.json(newJob);
}

// POST /api/jobs/:id/move - Update or move a pipeline job
export async function moveJob(req: Request, res: Response): Promise<void> {
  const db = await getDB();
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
  await saveDB(db);
  res.json(job);
}

// DELETE /api/jobs/:id - Delete a pipeline job
export async function deleteJob(req: Request, res: Response): Promise<void> {
  const db = await getDB();
  const initialLen = db.jobs.length;
  db.jobs = db.jobs.filter((j: any) => j.id !== req.params.id);
  await saveDB(db);
  res.json({ success: db.jobs.length < initialLen });
}
