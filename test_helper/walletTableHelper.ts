/* istanbul ignore file */
import {type RowDataPacket} from 'mysql2';
import pool from '../src/pool';

export async function createWallet(
	wallet = {
		id: 'test',
		userId: 1,
		balance: 0,
		pin: 'test',
	},
): Promise<void> {
	await pool.query(
		`
    INSERT INTO wallets
    (id, user_id, balance, pin)
    VALUES
    (?, ?, ?, ?)
    `,
		[wallet.id, wallet.userId, wallet.balance, wallet.pin],
	);
}

export async function topUpWallet(
	walletId: string,
	amount: number,
): Promise<void> {
	const [rows] = await pool.query(
		'SELECT balance FROM `wallets` WHERE `id` = ?',
		[walletId],
	);

	const {balance} = (rows as RowDataPacket[])[0] as Record<string, number>;

	const newBalance = balance + amount;
	await pool.query('UPDATE wallets SET balance = ? WHERE id = ?', [
		newBalance,
		walletId,
	]);
}

export async function useWallet(
	walletId: string,
	amount: number,
): Promise<void> {
	const [rows] = await pool.query(
		'SELECT balance FROM `wallets` WHERE `id` = ?',
		[walletId],
	);

	const {balance} = (rows as RowDataPacket[])[0] as Record<string, number>;

	const newBalance = balance - amount;
	await pool.query('UPDATE wallets SET balance = ? WHERE id = ?', [
		newBalance,
		walletId,
	]);
}

export async function getWallets(): Promise<RowDataPacket[]> {
	const [rows] = await pool.query('SELECT * from wallets');

	return rows as RowDataPacket[];
}

export async function clearTable(): Promise<void> {
	await pool.query('TRUNCATE wallets');
}
