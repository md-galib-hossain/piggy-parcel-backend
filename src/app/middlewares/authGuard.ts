import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@/app/auth/auth";
import catchAsync from "@/app/utils/catchAsync";

const authGuard = catchAsync(async (req, res, next) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});

	console.log(session);

	if (!session?.user?.id) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized: You must be logged in to access this resource.",
		});
	}

	req.user = session.user;

	next();
});

export default authGuard;
