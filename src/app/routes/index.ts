import { Router } from "express";

const router: Router = Router();

// Health check
router.get("/health", (req, res) => {
	res.json({
		success: true,
		message: "API is healthy",
		timestamp: new Date().toISOString(),
	});
});

export default router;
