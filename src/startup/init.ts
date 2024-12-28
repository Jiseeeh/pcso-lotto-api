import { Express } from "express";
import { pinoHttp } from "pino-http";
import dotenv from "dotenv";

import { logger } from "../logger";
import { errorHandler } from "../middleware/error";
import { redisClient } from "../lib/redisClient";

export const appSetup = (app: Express) => {
	const PORT = 3000;

	dotenv.config();

	app.use(pinoHttp({logger})).use(errorHandler);

	redisClient.connect().then(_ => console.log("Redis client connected"));

	app.listen(PORT, () => {
		console.log(`[server]: Server is running at http://localhost:${PORT}`);
	});
};
