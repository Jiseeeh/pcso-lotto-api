import { NextFunction, Request, Response } from "express";

export function asyncWrapper(cb: Function) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			await cb(req, res, next);
		} catch (error: any) {
			next(error);
		}
	};
}
