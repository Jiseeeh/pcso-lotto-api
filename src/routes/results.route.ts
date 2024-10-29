import {Router} from "express";

import {asyncWrapper} from "./wrapper";
import {getResultsByDate, getResultsToday} from "../controllers/results.controller";

export const resultsRouter = Router();

resultsRouter
    .get("/today", asyncWrapper(getResultsToday))
    .get("/:date", asyncWrapper(getResultsByDate))
    .get("/today/:game_id");
