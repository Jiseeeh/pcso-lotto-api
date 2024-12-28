import { Express } from "express";

import { resultsRouter } from "../routes";

export const routerSetup = (app: Express) => {
	app.use("/api/results", resultsRouter);
};
