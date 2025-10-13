// src/types/express/index.d.ts

import type { Request } from "express";
import type { pino } from "pino";
import type { User } from "../modules/Shared/User/user.interface";

declare global {
	namespace Express {
		export interface Request {
			log: pino.Logger;
			user?: User;
		}
	}
}
