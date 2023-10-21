import express, {
	type NextFunction,
	type Request,
	type Response,
} from 'express';
import request from 'supertest';
import AuthController from '../AuthController';
import {type AuthServiceT} from '../AuthService';
import {type WalletServiceT} from '../../wallet/WalletService';
import errorHandler from '../../../middleware/errorHandler';

describe('AuthController', () => {
	const mockAuthService: AuthServiceT = {
		loginUser: jest.fn().mockImplementation(async () =>
			Promise.resolve({
				user: {},
				token: {},
			}),
		),
		registerUser: jest.fn().mockImplementation(async () =>
			Promise.resolve({
				user: {},
				token: {},
			}),
		),
	};

	const mockWalletSerivce: WalletServiceT = {
		createWallet: jest.fn().mockImplementation(async () => Promise.resolve()),
		changeWalletPin: jest.fn().mockImplementation(async () => Promise.resolve()),
		pay: jest.fn().mockImplementation(async () => Promise.resolve()),
		topUp: jest.fn().mockImplementation(async () => Promise.resolve()),
		checkBalance: jest.fn().mockImplementation(async () => Promise.resolve()),
	};

	const authController = new AuthController(mockAuthService, mockWalletSerivce);

	const app = express();
	app.use(express.json());
	app.post(
		'/register',
		async (req: Request, res: Response, next: NextFunction) =>
			authController.register(req, res, next),
	);
	app.post('/login', async (req: Request, res: Response, next: NextFunction) =>
		authController.login(req, res, next),
	);
	app.use(errorHandler);

	describe('register', () => {
		it('error invalid payload', async () => {
			await request(app)
				.post('/register')
				.set('Content-Type', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400)
				.then((response) => {
					expect(response.body.status).toBe('fail');
					expect(response.body.message).toBe('BAD REQUEST');
				});
		});

		it('success valid payload', async () => {
			await request(app)
				.post('/register')
				.send({
					firstName: 'test',
					lastName: 'test',
					dateOfBirth: '2000-01-01',
					streetAddress: 'Jl. Juanda 5, Gang Karet',
					city: 'Samarinda',
					province: 'Kalimantan Timur',
					telephone: '+6281224974874',
					email: 'rey.pratama311@gmail.com',
					username: 'reyquaza',
					password: 'test',
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(201)
				.then((response) => {
					expect(response.body.status).toBe('success');
					expect(mockAuthService.registerUser).toBeCalled();
					expect(mockWalletSerivce.createWallet).toBeCalled();
				});
		});
	});

	describe('login', () => {
		it('error invalid payload', async () => {
			await request(app)
				.post('/login')
				.set('Content-Type', 'application/json')
				.expect('Content-Type', /json/)
				.expect(400)
				.then((response) => {
					expect(response.body.status).toBe('fail');
					expect(response.body.message).toBe('BAD REQUEST');
				});
		});

		it('success valid payload', async () => {
			await request(app)
				.post('/login')
				.send({
					credential: 'reyquaza',
					password: 'test',
				})
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response) => {
					expect(response.body.status).toBe('success');
					expect(mockAuthService.loginUser).toBeCalled();
				});
		});
	});
});
