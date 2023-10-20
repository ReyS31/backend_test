import express, {type Request, type Response} from 'express';
import request from 'supertest';
import auth, {type AuthVerifyer, type TokenDecoder} from '../auth';
import errorHandler from '../errorHandler';
import AuthorizationError from '../../error/AuthorizationError';

describe('auth middleware', () => {
	const mockPayload = {
		id: 1,
		userId: 1,
	};

	describe('with promise resolve', () => {
		const tokenDecoder: TokenDecoder = {
			decodePayload: jest.fn(async () => Promise.resolve(mockPayload)),
		};

		const authVerifyer: AuthVerifyer = {
			verifyAuth: jest.fn(async () => Promise.resolve()),
		};

		const app = express();
		app.get(
			'/',
			[auth(tokenDecoder, authVerifyer)],
			(req: Request, res: Response) =>
				res.send({
					status: 'success',
					message: 'OK',
					auth: req.auth ?? {},
				}),
		);
		app.use(errorHandler);

		it('throw authorizationError when no token provided', async () => {
			await request(app)
				.get('/')
				.expect('Content-Type', /json/)
				.expect(403)
				.then((response) => {
					expect(response.body.status).toBe('fail');
					expect(response.body.message).toBe('invalid token');
					expect(tokenDecoder.decodePayload).toBeCalledTimes(0);
					expect(authVerifyer.verifyAuth).toBeCalledTimes(0);
				});
		});

		it('get data correctly', async () => {
			await request(app)
				.get('/')
				.set('Authorization', 'Bearer token')
				.expect('Content-Type', /json/)
				.expect(200)
				.then((response) => {
					expect(response.body.status).toBe('success');
					expect(response.body.message).toBe('OK');
					expect(tokenDecoder.decodePayload).toBeCalled();
					expect(authVerifyer.verifyAuth).toBeCalled();
					expect(response.body.auth).toEqual(mockPayload);
				});
		});
	});

	it('throws AuthorizationError when token expired', async () => {
		const tokenDecoder: TokenDecoder = {
			decodePayload: jest.fn(async () => Promise.resolve(mockPayload)),
		};

		const authVerifyer: AuthVerifyer = {
			verifyAuth: jest.fn(async () =>
				Promise.reject(new AuthorizationError('auth expired')),
			),
		};

		const app = express();
		app.get(
			'/',
			[auth(tokenDecoder, authVerifyer)],
			(req: Request, res: Response) =>
				res.send({
					status: 'success',
					message: 'OK',
				}),
		);
		app.use(errorHandler);

		await request(app)
			.get('/')
			.set('Authorization', 'Bearer token')
			.expect('Content-Type', /json/)
			.expect(403)
			.then((response) => {
				expect(response.body.status).toBe('fail');
				expect(response.body.message).toBe('auth expired');
				expect(tokenDecoder.decodePayload).toBeCalled();
				expect(authVerifyer.verifyAuth).toBeCalled();
			});
	});

	it('throws AuthorizationError when token not found', async () => {
		const tokenDecoder = {
			decodePayload: jest
				.fn()
				.mockImplementation(async () => Promise.resolve(mockPayload)),
		};

		const authVerifyer = {
			verifyAuth: jest
				.fn()
				.mockImplementation(async () =>
					Promise.reject(new AuthorizationError('auth not found')),
				),
		};

		const app = express();
		app.get(
			'/',
			[auth(tokenDecoder, authVerifyer)],
			(req: Request, res: Response) =>
				res.send({
					status: 'success',
					message: 'OK',
				}),
		);
		app.use(errorHandler);

		await request(app)
			.get('/')
			.set('Authorization', 'Bearer token')
			.expect('Content-Type', /json/)
			.expect(403)
			.then((response) => {
				expect(response.body.status).toBe('fail');
				expect(response.body.message).toBe('auth not found');
				expect(tokenDecoder.decodePayload).toBeCalled();
				expect(authVerifyer.verifyAuth).toBeCalled();
			});
	});
});
