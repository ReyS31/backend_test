import express, {
	type NextFunction,
	type Express,
	type Request,
	type Response,
} from 'express';
import dotenv from 'dotenv';
import {ZodError} from 'zod';
import ClientError from './error/ClientError';
import getUserAgent from './middleware/userAgent';

dotenv.config();

async function start(): Promise<void> {
	const app: Express = express();
	const port = process.env.PORT;

	app.use(express.json());
	app.use(getUserAgent);
	app.get('/', (req: Request, res: Response) => {
		res.send({
			status: 'success',
			message: 'OK',
		});
	});
	app.use((err: Error, req: Request, res: Response, _: NextFunction): void => {
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
	});

	app.listen(port, () => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
	});
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
start();
