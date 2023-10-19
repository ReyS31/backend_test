/* istanbul ignore next */
import express, {
	type NextFunction,
	type Express,
	type Request,
	type Response,
} from 'express';
import dotenv from 'dotenv';
import {ZodError} from 'zod';
import ClientError from './error/ClientError';
import pool from './pool';

// Misc
import bcrypt from 'bcrypt';
import PasswordHash from './security/PasswordHash';
import Jwt from 'jsonwebtoken';
import TokenManager from './security/TokenManager';

// Repository
import UserRepository from './domains/user/UserRepository';
import AuthRepository from './domains/auth/AuthRepository';

// Middleware
import getUserAgent from './middleware/userAgent';

// Service
import AuthService from './services/auth/AuthService';

// Controller
import AuthController from './services/auth/AuthController';

dotenv.config();

async function start(): Promise<void> {
	// Misc
	const passwordHash = new PasswordHash(bcrypt, 13);
	const tokenManager = new TokenManager(Jwt);

	// Repository
	const userRepository = new UserRepository(pool);
	const authRepository = new AuthRepository(pool);

	// Services
	const authService = new AuthService(
		passwordHash,
		tokenManager,
		userRepository,
		authRepository,
	);

	// Controller
	const authController = new AuthController(authService);

	// Express
	const app: Express = express();
	const port = process.env.PORT;

	// Middleware
	app.use(express.json());
	app.use(getUserAgent);

	// App
	app.use('/auth', authController.route());

	// HealthCheck
	app.get('/', (req: Request, res: Response) => {
		res.send({
			status: 'success',
			message: 'OK',
		});
	});

	// Error handling
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
