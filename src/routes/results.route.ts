import { Router } from "express";

import { asyncWrapper } from "./wrapper";

export const resultsRouter = Router();

resultsRouter.get("/today")
.get("/:date")
.get("/today/:game_id")
