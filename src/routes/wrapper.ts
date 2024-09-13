import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export function asyncWrapper(cb: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await cb(req, res, next);
    } catch (error: any) {
      next(new createHttpError.InternalServerError(error.message));
    }
  };
}
