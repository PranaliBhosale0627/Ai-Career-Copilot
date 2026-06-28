import { Response } from "express";
import { findUserById, loginUser, registerUser } from "../config/db";
import { AuthenticatedRequest } from "../types/auth";

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  try {
    const result = await registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(409).json({ error: error.message || "Registration failed." });
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Login failed." });
  }
}

export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ error: "Account not found." });
    return;
  }
  res.json({ user });
}

export function logout(_req: AuthenticatedRequest, res: Response): void {
  res.json({ success: true });
}
