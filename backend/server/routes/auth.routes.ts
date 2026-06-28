import { Router } from "express";
import { login, logout, me, register } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", register as any);
router.post("/login", login as any);
router.get("/me", authenticate as any, me as any);
router.post("/logout", authenticate as any, logout as any);

export default router;
