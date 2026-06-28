import { Request, Response } from "express";
import { getDB, saveDB } from "../config/db";

// GET /api/roadmap - Get career roadmap
export async function getRoadmap(req: Request, res: Response): Promise<void> {
  const db = await getDB();
  res.json(db.roadmap);
}

// POST /api/roadmap/step/:stepId/toggle-skill - Toggle a skill in a roadmap step
export async function toggleSkill(req: Request, res: Response): Promise<void> {
  const db = await getDB();
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

  await saveDB(db);
  res.json(db.roadmap);
}
