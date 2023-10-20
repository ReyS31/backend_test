import {type NextFunction, type Request, type Response} from 'express';
import type AuthService from './AuthService';
import {verifyRegisterPayload, verifyLoginPayload} from './AuthTypes';
import type WalletService from '../wallet/WalletService';

class AuthController {
	constructor(
		private readonly registerService: AuthService,
		private readonly walletService: WalletService,
	) {}

	public async register(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		try {
			const payload = verifyRegisterPayload(request.body);

			const data = await this.registerService.registerUser(
				payload,
				request.userAgent ?? 'unknown browser',
			);
			await this.walletService.createWallet(data.user);

			return response.status(201).send({
				status: 'success',
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async login(request: Request, response: Response, next: NextFunction) {
		try {
			const payload = verifyLoginPayload(request.body);

			const data = await this.registerService.loginUser(
				payload,
				request.userAgent ?? 'unknown browser',
			);

			return response.send({
				status: 'success',
				data,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default AuthController;
