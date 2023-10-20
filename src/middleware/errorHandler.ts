import {type Request, type Response, type NextFunction} from 'express';
import {ZodError} from 'zod';
import ClientError from '../error/ClientError';

export default (
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction,
): void => {
	if (err instanceof ZodError) {
		const errors = JSON.parse(err.message) as Record<string, unknown>;
		res.status(400).send({
			status: 'fail',
			message: 'BAD REQUEST',
			errors,
		});

		return;
	}

	if (err instanceof ClientError) {
		res.status(err.statusCode).send({
			status: 'fail',
			message: err.message,
		});

		return;
	}

	res
		.send({
			status: 'fail',
			message: err.message,
		})
		.status(500);
};
