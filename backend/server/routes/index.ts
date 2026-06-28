import { Router } from "express";
import userRoutes from "./user.routes";
import jobRoutes from "./job.routes";
import roadmapRoutes from "./roadmap.routes";
import aiRoutes from "./ai.routes";

const apiRouter = Router();

// Mount sub-routers
apiRouter.use("/user", userRoutes);
apiRouter.use("/jobs", jobRoutes);
apiRouter.use("/roadmap", roadmapRoutes);

// AI routes are mounted at root level since they have varied prefixes (/resume, /coach)
apiRouter.use("/", aiRoutes);

export default apiRouter;
