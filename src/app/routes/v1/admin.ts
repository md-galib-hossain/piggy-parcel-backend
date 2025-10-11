import { Router } from "express";

// import { AdminUserRoutes } from "../modules/Admin/User/adminUser.route";

const router: Router = Router();

// Admin App Routes
interface RouteConfig {
	path: string;
	route: Router;
}

const adminRoutes: RouteConfig[] = [
	// {
	// 	path: "/users",
	// 	route: AdminUserRoutes,
	// },
	// Add more admin routes here
	// {
	//   path: "/analytics",
	//   route: AdminAnalyticsRoutes,
	// },
	// {
	//   path: "/reports",
	//   route: AdminReportsRoutes,
	// },
	// {
	//   path: "/settings",
	//   route: AdminSettingsRoutes,
	// },
];

// Register all admin routes
adminRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
