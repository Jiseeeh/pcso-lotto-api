import { NextFunction, Request, Response } from "express";

// TODO: remove when express gets updated to 5+
export function asyncWrapper(cb: Function) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await cb(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
}
