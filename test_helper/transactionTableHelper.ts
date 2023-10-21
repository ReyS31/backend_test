/* istanbul ignore file */
import {type RowDataPacket} from 'mysql2';
import pool from '../src/pool';
import moment from 'moment';

export async function createTransaction(
	trx = {
		walletId: 'test',
		amount: 1000,
		newestWalletBalance: 0,
		lastetWalletBalance: 1000,
		operation: 'ADD',
		createdAt: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
	},
): Promise<void> {
	await pool.query(
		`
    INSERT INTO transactions
    (wallet_id, amount, newest_wallet_balance, latest_Wallet_balance, operation, created_at)
    VALUES
    (?, ?, ?, ?, ?, ?)
    `,
		[
			trx.walletId,
			trx.amount,
			trx.newestWalletBalance,
			trx.lastetWalletBalance,
			trx.operation,
			trx.createdAt,
		],
	);
}

export async function getTransactions(): Promise<RowDataPacket[]> {
	const [rows] = await pool.query('SELECT * from transactions');
	return rows as RowDataPacket[];
}

export async function clearTable(): Promise<void> {
	await pool.query('TRUNCATE transactions');
}
