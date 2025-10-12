// src/types/express/index.d.ts
import type { pino } from "pino";

declare global {
	namespace Express {
		export interface Request {
			log: pino.Logger;
		}
	}
}
