import { Response } from "express";
import { getDB, getDashboardSummary, resetDB, saveDB } from "../config/db";
import { AuthenticatedRequest } from "../types/auth";

// GET /api/user - Retrieve user profile
export async function getUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  res.json(db.user);
}

// POST /api/user - Update user profile
export async function updateUserProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const db = await getDB(req.user.id);
  db.user = { ...db.user, ...req.body };
  await saveDB(req.user.id, db);
  res.json(db.user);
}

// POST /api/user/signup - Reset and signup user
export async function signUpUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { name, email } = req.body;
  const newDB = await resetDB(req.user.id, name || "New User", email || "");
  res.json(newDB.user);
}

// GET /api/user/dashboard - Retrieve private dashboard summary
export async function getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
  const summary = await getDashboardSummary(req.user.id);
  res.json(summary);
}
