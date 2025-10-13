import express from "express";
import authGuard from "@/app/middlewares/authGuard";
import validateRequest from "@/app/middlewares/validateRequest";
import {
	changeEmailSchema,
	createUserSchema,
	loginSchema,
} from "@/app/modules/Shared/User/user.validation";
import { UserController } from "./user.controller";

const userRoutes: express.Router = express.Router();

const {
	registerUser,
	loginUser,
	requestPasswordReset,
	logoutUser,
	changeEmail,
	getAllUsers,
	updateMyProfile,
} = UserController;

userRoutes.post("/register", validateRequest(createUserSchema), registerUser);
userRoutes.post("/login", validateRequest(loginSchema), loginUser);
userRoutes.post("/logout", logoutUser);
userRoutes.post(
	"/change-email",
	validateRequest(changeEmailSchema),
	changeEmail,
);
userRoutes.post("/request-password-reset", requestPasswordReset);
userRoutes.get("/", getAllUsers);
userRoutes.patch("/:id", authGuard, updateMyProfile);

export default userRoutes;
