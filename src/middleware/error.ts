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

	const prodError = {
		message:
			"Something went wrong, please contact the developer or try again later.",
	};
	const statusCode = err.statusCode || 500;

	const error = process.env.NODE_ENV === "dev" ? err : prodError;

	res.status(statusCode).send(error);
};
