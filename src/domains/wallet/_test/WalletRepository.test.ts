import * as UserTableHelper from '../../../../test_helper/usersTableHelper';
import * as WalletTableHelper from '../../../../test_helper/walletTableHelper';
import pool from '../../../pool';
import InvariantError from '../../../error/InvariantError';
import WalletRepository from '../WalletRepository';

describe('WalletRepository', () => {
	let walletRepository: WalletRepository;
	beforeAll(async () => {
		await UserTableHelper.createUser();
		walletRepository = new WalletRepository(pool);
	});

	afterEach(async () => {
		await WalletTableHelper.clearTable();
	});

	afterAll(async () => {
		await pool.query('SET FOREIGN_KEY_CHECKS = 0');
		await UserTableHelper.clearTable();
		await pool.query('SET FOREIGN_KEY_CHECKS = 1');
		await pool.end();
	});

	describe('createWallet function', () => {
		it('success', async () => {
			await walletRepository.createWallet({
				id: 'test',
				pin: '123',
				userId: 1,
			});

			const wallet = (await WalletTableHelper.getWallets())[0];
			expect(wallet.id).toBe('test');
			expect(wallet.user_id).toBe(1);
		});
	});

	describe('getBalance function', () => {
		it('user has no wallet throws InvariantError', async () => {
			await expect(walletRepository.getBalance(1)).rejects.toThrow(InvariantError);
		});

		it('success', async () => {
			await WalletTableHelper.createWallet();

			const walletBalance = await walletRepository.getBalance(1);
			expect(walletBalance.id).toBe('test');
			expect(walletBalance.pin).toBe('test');
			expect(walletBalance.balance).toBe(0);
		});
	});

	describe('updateBalance function', () => {
		it('user has no wallet throws InvariantError', async () => {
			await expect(walletRepository.updateBalance('test', 1000)).rejects.toThrow(
				InvariantError,
			);
		});

		it('success', async () => {
			await WalletTableHelper.createWallet();

			await walletRepository.updateBalance('test', 1000);

			const wallet = (await WalletTableHelper.getWallets())[0];
			expect(wallet.id).toBe('test');
			expect(wallet.user_id).toBe(1);
			expect(wallet.balance).toBe(1000);
		});
	});

	describe('updatePin function', () => {
		it('user has no wallet throws InvariantError', async () => {
			await expect(walletRepository.updatePin('test', 'test')).rejects.toThrow(
				InvariantError,
			);
		});

		it('success', async () => {
			await WalletTableHelper.createWallet();

			await walletRepository.updatePin('test', 'test1');

			const wallet = (await WalletTableHelper.getWallets())[0];
			expect(wallet.id).toBe('test');
			expect(wallet.user_id).toBe(1);
			expect(wallet.balance).toBe(0);
			expect(wallet.pin).toBe('test1');
		});
	});
});
