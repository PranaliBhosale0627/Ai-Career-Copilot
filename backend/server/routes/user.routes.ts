import { Router } from "express";
import { getUserProfile, updateUserProfile, signUpUser } from "../controllers/user.controller";

const router = Router();

// GET /api/user — Retrieve user profile
router.get("/", getUserProfile);

// POST /api/user — Update user profile
router.post("/", updateUserProfile);

// POST /api/user/signup — Reset and signup user
router.post("/signup", signUpUser);

export default router;
