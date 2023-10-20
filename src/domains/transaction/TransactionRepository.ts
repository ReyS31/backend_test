import {
	type ResultSetHeader,
	type Pool,
	type RowDataPacket,
} from 'mysql2/promise';
import InvariantError from '../../error/InvariantError';
import {type CreateTranscation} from '../../services/wallet/WalletTypes';

export default class TransactionRepository {
	constructor(private readonly pool: Pool) {}

	public async createTransaction(data: CreateTranscation): Promise<number> {
		const conn = await this.pool.getConnection();
		await conn.beginTransaction();
		try {
			const newestBalance
				= data.operation === 'ADD'
					? data.latestWalletBalance + data.amount
					: data.latestWalletBalance - data.amount;
			const [row] = await conn.query(
				`
				INSERT INTO transactions
				(wallet_id, amount, newest_wallet_balance, latest_wallet_balance, operation, created_at)
				VALUES
				(?, ?, ?, ?, ?, ?)
			`,
				[
					data.walletId,
					data.amount,
					newestBalance,
					data.latestWalletBalance,
					data.operation,
					data.date,
				],
			);
			if (!(row as ResultSetHeader).affectedRows) {
				throw Error('fails to create wallet');
			}

			await conn.commit();
			return newestBalance;
		} catch (error) {
			await conn.rollback();
			throw new InvariantError((error as Error).message);
		}
	}
}
