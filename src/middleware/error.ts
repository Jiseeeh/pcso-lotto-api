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
  const error = process.env.NODE_ENV === "dev" ? err : {};

  res.status(err.statusCode).send(error);
};
