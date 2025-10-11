import { Router } from "express";
import userRoutes from "@/app/modules/Consumer/User/user.route";

const router: Router = Router();

// Consumer App Routes
interface RouteConfig {
	path: string;
	route: Router;
}

const consumerRoutes: RouteConfig[] = [
	{
		path: "/user",
		route: userRoutes,
	},
	// Add more consumer routes here
	// {
	//   path: "/delivery",
	//   route: DeliveryRoutes,
	// },
	// {
	//   path: "/travel",
	//   route: TravelRoutes,
	// },
	// {
	//   path: "/rating",
	//   route: RatingRoutes,
	// },
];

// Register all consumer routes
consumerRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
