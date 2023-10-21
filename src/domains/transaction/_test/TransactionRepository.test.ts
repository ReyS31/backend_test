import moment from 'moment';
import * as TransactionTableHelper from '../../../../test_helper/transactionTableHelper';
import * as UserTableHelper from '../../../../test_helper/usersTableHelper';
import * as WalletTableHelper from '../../../../test_helper/walletTableHelper';
import pool from '../../../pool';
import TransactionRepository from '../TransactionRepository';
import InvariantError from '../../../error/InvariantError';

describe('TransactionRepository', () => {
	let transactionRepository: TransactionRepository;
	beforeAll(async () => {
		await UserTableHelper.createUser();
		await WalletTableHelper.createWallet();
		transactionRepository = new TransactionRepository(pool);
	});

	afterEach(async () => {
		await TransactionTableHelper.clearTable();
	});

	afterAll(async () => {
		await pool.query('SET FOREIGN_KEY_CHECKS = 0');
		await WalletTableHelper.clearTable();
		await UserTableHelper.clearTable();
		await pool.query('SET FOREIGN_KEY_CHECKS = 1');
		await pool.end();
	});

	describe('createTransaction function', () => {
		it('topup transaction success', async () => {
			const date = moment().utc();

			await transactionRepository.createTransaction({
				walletId: 'test',
				date: date.format('YYYY-MM-DD HH:mm:ss'),
				latestWalletBalance: 0,
				operation: 'ADD',
				amount: 1000,
			});

			const trx = (await TransactionTableHelper.getTransactions())[0];
			expect(trx.wallet_id).toBe('test');
			expect(trx.latest_wallet_balance).toBe(0);
			expect(trx.newest_wallet_balance).toBe(1000);
			expect(trx.amount).toBe(1000);
			expect(trx.operation).toBe('ADD');
			expect(trx.created_at).toBeTruthy();
		});

		it('deduct transaction success', async () => {
			const date = moment().utc();

			await transactionRepository.createTransaction({
				walletId: 'test',
				date: date.format('YYYY-MM-DD HH:mm:ss'),
				latestWalletBalance: 1000,
				operation: 'SUB',
				amount: 1000,
			});

			const trx = (await TransactionTableHelper.getTransactions())[0];
			expect(trx.wallet_id).toBe('test');
			expect(trx.latest_wallet_balance).toBe(1000);
			expect(trx.newest_wallet_balance).toBe(0);
			expect(trx.amount).toBe(1000);
			expect(trx.operation).toBe('SUB');
			expect(trx.created_at).toBeTruthy();
		});

		it('transaction fails due negative amount throws InvariantError', async () => {
			const date = moment().utc();

			await expect(
				transactionRepository.createTransaction({
					walletId: 'test',
					date: date.format('YYYY-MM-DD HH:mm:ss'),
					latestWalletBalance: 1000,
					operation: 'SUB',
					amount: -1000,
				}),
			).rejects.toThrow(InvariantError);
		});
	});
});
