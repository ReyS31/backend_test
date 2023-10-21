/* istanbul ignore file */
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
import WalletRepository from './domains/wallet/WalletRepository';
import TransactionRepository from './domains/transaction/TransactionRepository';

// Middleware
import getUserAgent from './middleware/userAgent';
import auth from './middleware/auth';
import errorHandler from './middleware/errorHandler';

// Service
import AuthService from './services/auth/AuthService';
import WalletService from './services/wallet/WalletService';

// Controller
import AuthController from './services/auth/AuthController';
import WalletController from './services/wallet/WalletController';

dotenv.config();

export async function createServer(): Promise<Express> {
	// Misc
	const passwordHash = new PasswordHash(bcrypt, 8);
	const tokenManager = new TokenManager(Jwt);

	// Repository
	const userRepository = new UserRepository(pool);
	const authRepository = new AuthRepository(pool);
	const walletRepository = new WalletRepository(pool);
	const transactionRepository = new TransactionRepository(pool);

	// Services
	const authService = new AuthService(
		passwordHash,
		tokenManager,
		userRepository,
		authRepository,
	);
	const walletService = new WalletService(
		walletRepository,
		transactionRepository,
		passwordHash,
	);

	// Middleware
	const authMiddleware = auth(tokenManager, authRepository);

	// Controller
	const authController = new AuthController(authService, walletService);
	const walletController = new WalletController(walletService);

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

	/* #region Wallet */
	app.use('/wallet', authMiddleware);
	app.get('/wallet', async (req: Request, res: Response, next: NextFunction) =>
		walletController.checkBalance(req, res, next),
	);
	app.post(
		'/wallet/topup',
		async (req: Request, res: Response, next: NextFunction) =>
			walletController.topup(req, res, next),
	);
	app.post(
		'/wallet/pay',
		async (req: Request, res: Response, next: NextFunction) =>
			walletController.pay(req, res, next),
	);
	app.post(
		'/wallet/change-pin',
		async (req: Request, res: Response, next: NextFunction) =>
			walletController.changePin(req, res, next),
	);
	/* #endregion */

	// HealthCheck
	app.get('/', async (req: Request, res: Response) => {
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
