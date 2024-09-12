import { Express } from "express";
import { pinoHttp } from "pino-http";

import { logger } from "../logger";

export const appSetup = (app: Express) => {
  const PORT = 3000;

  app.use(pinoHttp({ logger }));

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
};
