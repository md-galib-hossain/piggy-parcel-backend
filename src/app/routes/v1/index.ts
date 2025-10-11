import { Router } from "express";
import adminRoutes from "./admin";
import consumerRoutes from "./consumer";

const router: Router = Router();

// Health check
router.get("/health", (req, res) => {
	res.json({
		success: true,
		message: "API is healthy",
		timestamp: new Date().toISOString(),
	});
});

// Register Consumer Routes under /api/consumer
router.use("/consumer", consumerRoutes);

// Register Admin Routes under /api/admin
router.use("/admin", adminRoutes);

export default router;
