import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { verifyAuthToken } from "../config/db";

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";

  if (!token) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: "Session expired. Please sign in again." });
  }
}

export function requireRole(role: "user" | "admin") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || (req.user.role !== role && req.user.role !== "admin")) {
      res.status(403).json({ error: "You do not have permission to access this resource." });
      return;
    }
    next();
  };
}
