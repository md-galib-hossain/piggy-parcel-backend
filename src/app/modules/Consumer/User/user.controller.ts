import catchAsync from "@/app/utils/catchAsync";
import sendResponse from "@/app/utils/sendResponse";
import { UserService } from "./user.service";

const registerUser = catchAsync(async (req, res) => {
	const result = await UserService.registerUser(req.body);
	sendResponse(res, {
		data: result,
		success: true,
		message: "User registered successfully",
		statusCode: 201,
	});
});

const loginUser = catchAsync(async (req, res) => {
	console.log("\x1b[32m%s\x1b[0m", "This is green text");
	const { email, password } = req.body;
	const result = await UserService.loginUser(email, password);

	sendResponse(res, {
		data: result,
		success: true,
		message: "User logged in successfully",
		statusCode: 200,
	});
});

const logoutUser = catchAsync(async (req, res) => {
	const headers = req.headers;
	const result = await UserService.logoutUser(headers);

	sendResponse(res, {
		data: result,
		success: true,
		message: "User logged out successfully",
		statusCode: 200,
	});
});

const requestPasswordReset = catchAsync(async (req, res) => {
	const { email } = req.body;
	const result = await UserService.requestPasswordReset(email);
	sendResponse(res, {
		data: null,
		success: true,
		message: result.message,
		statusCode: 200,
	});
});
const changeEmail = catchAsync(async (req, res) => {
	const { email } = req.body;
	const headers = req.headers;

	const result = await UserService.changeEmail(email, headers);
	sendResponse(res, {
		data: null,
		success: true,
		message: "Email change requested. Please verify your new email.",
		statusCode: 200,
	});
});

export const UserController = {
	registerUser,
	loginUser,
	logoutUser,
	requestPasswordReset,
	changeEmail,
};
