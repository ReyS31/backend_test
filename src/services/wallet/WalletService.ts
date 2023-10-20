import {createHash} from 'node:crypto';
import moment from 'moment';
import type WalletRepository from '../../domains/wallet/WalletRepository';
import type TransactionRepository from '../../domains/transaction/TransactionRepository';
import type User from '../../domains/user/User';
import type PasswordHash from '../../security/PasswordHash';
import InvariantError from '../../error/InvariantError';
import {type TransactionResponse} from './WalletTypes';

export default class WalletService {
	constructor(
		private readonly walletRepository: WalletRepository,
		private readonly transactionRepository: TransactionRepository,
		private readonly passwordHash: PasswordHash,
	) {}

	public async createWallet(user: User): Promise<void> {
		const id = createHash('sha256')
			.update(`${user.username}:${user.email}`)
			.digest('hex');

		// Default pin is 123456
		const pin = await this.passwordHash.hash('123456');
		await this.walletRepository.createWallet({
			id,
			userId: user.id,
			pin,
		});
	}

	public async changeWalletPin(
		userId: number,
		pin: string,
		newPin: string,
	): Promise<void> {
		const wallet = await this.walletRepository.getBalance(userId);
		await this.passwordHash.comparePassword(pin, wallet.pin);
		const pinHashed = await this.passwordHash.hash(newPin);
		await this.walletRepository.updatePin(wallet.id, pinHashed);
	}

	public async topUp(
		userId: number,
		amount: number,
	): Promise<TransactionResponse> {
		if (amount < 0) {
			throw new InvariantError('invalid amount');
		}

		const date = moment().utc();
		const wallet = await this.walletRepository.getBalance(userId);
		const latestBalance = await this.transactionRepository.createTransaction({
			walletId: wallet.id,
			amount,
			date: date.format('YYYY-MM-DD HH:mm:ss'),
			latestWalletBalance: wallet.balance,
			operation: 'ADD',
		});
		await this.walletRepository.updateBalance(wallet.id, latestBalance);
		const walletAfter = await this.walletRepository.getBalance(userId);

		return {
			balance: walletAfter.balance,
			date: date.toISOString(),
		};
	}

	public async pay(
		userId: number,
		amount: number,
		pin: string,
	): Promise<TransactionResponse> {
		if (amount < 0) {
			throw new InvariantError('invalid amount');
		}

		const date = moment().utc();
		const wallet = await this.walletRepository.getBalance(userId);
		await this.passwordHash.comparePassword(pin, wallet.pin);
		const latestBalance = await this.transactionRepository.createTransaction({
			walletId: wallet.id,
			amount,
			date: date.format('YYYY-MM-DD HH:mm:ss'),
			latestWalletBalance: wallet.balance,
			operation: 'SUB',
		});
		await this.walletRepository.updateBalance(wallet.id, latestBalance);
		const walletAfter = await this.walletRepository.getBalance(userId);

		return {
			balance: walletAfter.balance,
			date: date.toISOString(),
		};
	}

	public async checkBalance(userId: number): Promise<TransactionResponse> {
		const date = moment().utc();
		const wallet = await this.walletRepository.getBalance(userId);
		return {
			balance: wallet.balance,
			date: date.toISOString(),
		};
	}
}
