import { Request, Response } from "express";
import { getDB, saveDB, resetDB } from "../config/db";

// GET /api/user - Retrieve user profile
export async function getUserProfile(req: Request, res: Response): Promise<void> {
  const db = await getDB();
  res.json(db.user);
}

// POST /api/user - Update user profile
export async function updateUserProfile(req: Request, res: Response): Promise<void> {
  const db = await getDB();
  db.user = { ...db.user, ...req.body };
  await saveDB(db);
  res.json(db.user);
}

// POST /api/user/signup - Reset and signup user
export async function signUpUser(req: Request, res: Response): Promise<void> {
  const { name, email } = req.body;
  const newDB = await resetDB(name || "New User", email || "");
  res.json(newDB.user);
}
