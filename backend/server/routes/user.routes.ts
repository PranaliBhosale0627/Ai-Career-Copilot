import { Router } from "express";
import { getDashboard, getUserProfile, updateUserProfile, signUpUser } from "../controllers/user.controller";

const router = Router();

// GET /api/user — Retrieve user profile
router.get("/", getUserProfile as any);

// GET /api/user/dashboard — Retrieve private dashboard summary
router.get("/dashboard", getDashboard as any);

// POST /api/user — Update user profile
router.post("/", updateUserProfile as any);

// POST /api/user/signup — Reset and signup user
router.post("/signup", signUpUser as any);

export default router;
