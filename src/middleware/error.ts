import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

import { logger } from "../logger";

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  res.status(err.statusCode || 500).send(err);
};
