import { Express } from "express";
import { pinoHttp } from "pino-http";
import dotenv from "dotenv";

import { logger } from "../logger";
import { errorHandler } from "../middleware/error";
import { redisClient } from "../lib/redisClient";

export const appSetup = (app: Express) => {
  const PORT = process.env.PORT || 3000;

  dotenv.config();

  app.use(pinoHttp({ logger })).use(errorHandler);

  redisClient.connect().then((_) => logger.info("Redis client connected"));

  app.listen(Number(PORT), "0.0.0.0", () => {
    logger.info(`Server is listening on 0.0.0.0:${PORT}`);
  });
};
