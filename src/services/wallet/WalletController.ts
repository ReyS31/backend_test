import {type NextFunction, type Request, type Response} from 'express';
import type WalletService from '../wallet/WalletService';
import {
	verifyChangePinPayload,
	verifyPayPayload,
	verifyTopupPayload,
} from './WalletTypes';

class WalletController {
	constructor(private readonly walletService: WalletService) {}

	public async topup(request: Request, response: Response, next: NextFunction) {
		try {
			const {userId} = request.auth!;
			const payload = verifyTopupPayload(request.body);

			const data = await this.walletService.topUp(userId, payload.amount);

			return response.status(202).send({
				status: 'success',
				...data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async pay(request: Request, response: Response, next: NextFunction) {
		try {
			const {userId} = request.auth!;
			const payload = verifyPayPayload(request.body);

			const data = await this.walletService.pay(
				userId,
				payload.amount,
				payload.pin,
			);

			return response.status(202).send({
				status: 'success',
				...data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async checkBalance(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		try {
			const {userId} = request.auth!;

			const data = await this.walletService.checkBalance(userId);

			return response.status(200).send({
				status: 'success',
				...data,
			});
		} catch (error) {
			next(error);
		}
	}

	public async changePin(
		request: Request,
		response: Response,
		next: NextFunction,
	) {
		try {
			const {userId} = request.auth!;
			const payload = verifyChangePinPayload(request.body);

			await this.walletService.changeWalletPin(
				userId,
				payload.pin,
				payload.newPin,
			);

			return response.status(200).send({
				status: 'success',
				message: 'pin changed',
			});
		} catch (error) {
			next(error);
		}
	}
}

export default WalletController;
