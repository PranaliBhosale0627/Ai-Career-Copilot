import { Response } from "express";
import { addActivity, getDB, saveDB } from "../config/db";
import { AuthenticatedRequest } from "../types/auth";

// GET /api/roadmap - Get career roadmap
export async function getRoadmap(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  res.json(db.roadmap);
}

// POST /api/roadmap/step/:stepId/toggle-skill - Toggle a skill in a roadmap step
export async function toggleSkill(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  const { stepId } = req.params;
  const { skillId } = req.body;

  const step = db.roadmap.find((s: any) => s.id === stepId);
  if (!step) {
    res.status(404).json({ error: "Roadmap step not found" });
    return;
  }

  const skill = step.skills.find((sk: any) => sk.id === skillId);
  if (!skill) {
    res.status(404).json({ error: "Skill not found in this step" });
    return;
  }

  skill.completed = !skill.completed;

  await saveDB(req.user.id, db);
  await addActivity(req.user.id, "roadmap_updated", "Roadmap skill updated", `${skill.name} was marked ${skill.completed ? "complete" : "incomplete"}.`);
  res.json(db.roadmap);
}
