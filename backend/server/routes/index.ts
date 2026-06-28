import { Router } from "express";
import userRoutes from "./user.routes";
import jobRoutes from "./job.routes";
import roadmapRoutes from "./roadmap.routes";
import aiRoutes from "./ai.routes";
import authRoutes from "./auth.routes";
import { authenticate } from "../middleware/auth";

const apiRouter = Router();

// Mount sub-routers
apiRouter.use("/auth", authRoutes);
apiRouter.use("/user", authenticate as any, userRoutes);
apiRouter.use("/jobs", authenticate as any, jobRoutes);
apiRouter.use("/roadmap", authenticate as any, roadmapRoutes);

// AI routes are mounted at root level since they have varied prefixes (/resume, /coach)
apiRouter.use("/", authenticate as any, aiRoutes);

export default apiRouter;
