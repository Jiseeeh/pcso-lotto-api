import { Router } from "express";

import { asyncWrapper } from "./wrapper";
import {
	getResultsByDate,
	getResultsByDateAndByGameId,
	getResultsToday,
	getResultsTodayByGameId
} from "../controllers/results.controller";

export const resultsRouter = Router();

resultsRouter
	.get("/today", asyncWrapper(getResultsToday))
	.get("/:date", asyncWrapper(getResultsByDate))
	.get("/today/:gameId", asyncWrapper(getResultsTodayByGameId))
	.get("/:date/:gameId", asyncWrapper(getResultsByDateAndByGameId));
