/* istanbul ignore next */
import express, {
	type NextFunction,
	type Express,
	type Request,
	type Response,
} from 'express';
import dotenv from 'dotenv';
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
import auth from './middleware/auth';
import errorHandler from './middleware/errorHandler';

// Service
import AuthService from './services/auth/AuthService';

// Controller
import AuthController from './services/auth/AuthController';

dotenv.config();

export async function createServer(): Promise<Express> {
	// Misc
	const passwordHash = new PasswordHash(bcrypt, 8);
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

	// Middleware
	const authMiddleware = auth(tokenManager, authRepository);

	// Controller
	const authController = new AuthController(authService);

	// Express
	const app: Express = express();

	// Middleware
	app.use(express.json());
	app.use(getUserAgent);

	// App

	/* #region Auth */
	app.post(
		'/auth/register',
		async (req: Request, res: Response, next: NextFunction) =>
			authController.register(req, res, next),
	);
	app.post(
		'/auth/login',
		async (req: Request, res: Response, next: NextFunction) =>
			authController.login(req, res, next),
	);
	/* #endregion */

	// HealthCheck
	app.get('/', [authMiddleware], async (req: Request, res: Response) => {
		res.send({
			status: 'success',
			message: 'OK',
		});
	});

	// Error handling
	app.use(errorHandler);

	return app;
}

const port = process.env.PORT;
void createServer().then((app) =>
	app.listen(port, () => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
	}),
);
