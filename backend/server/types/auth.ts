import { Request } from "express";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
